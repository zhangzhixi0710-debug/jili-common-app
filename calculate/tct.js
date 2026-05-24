import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;
const EMPTY_SYMBOL = 21;

export const buildSymbolImageUrlJP = (gameId, id) => {
    if (id === EMPTY_SYMBOL) {
        return "";
    }
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/jp_${id}.webp`) : "";
};

export const buildSymbolImageUrl = (gameId, id) => {
    if (id === EMPTY_SYMBOL) {
        return "";
    }
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";
};

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Col[col].Symbol)
        )
    );
}

/**
 * 根据列倍率生成对应的图片数组结构
 * @param {string} gameId
 * @param {number[]} wildColumnMult - 每列的倍率数组，例如 [0, 1, 12, 0, 123]
 * @returns {Array<Array<string>>} 返回二维数组，每一列对应一组图片
 */
function buildWildColumnImages(gameId, wildColumnMult) {
    return wildColumnMult.map(item =>
        item.Col.map(col => {
            if (col.JPState) {
                return {
                    img: buildSymbolImageUrlJP(gameId, col.JPState),
                    mul: col.JPMult,
                };
            }
            return {
                number: col.Number ? col.Number + "" : 0,
            };
        })
    );
}

/**
 * const { BlueData, GreenData, RedData } = roundData;
 * 根据BlueData、GreenData、RedData值中scatterPos对应找到PlateSymbol中对应索引位置，并替换JPState值
 * @param {*} wildColumnMult
 * @param {*} blueData
 * @returns
 */
function addJPStateByScatterPos(wildColumnMult, blueData) {
    // 创建副本以避免修改原数组
    const result = JSON.parse(JSON.stringify(wildColumnMult));

    blueData.forEach(item => {
        const scatterPos = item.ScatterPos;
        const colIndex = Math.floor(scatterPos / 3);
        const innerIndex = scatterPos % 3;

        if (colIndex >= 0 && colIndex < result.length) {
            const targetCol = result[colIndex].Col;

            if (innerIndex >= 0 && innerIndex < targetCol.length) {
                targetCol[innerIndex].JPState = item.JPState;
                console.log(
                    `? 位置 ${scatterPos} (Col[${colIndex}][${innerIndex}]) 已添加 JPState=${item.JPState}`
                );
            } else {
                console.warn(
                    `? 位置 ${scatterPos} 的索引 ${innerIndex} 无效，Col ${colIndex} 长度=${targetCol.length}`
                );
            }
        } else {
            console.warn(
                `? 位置 ${scatterPos} 的列索引 ${colIndex} 无效，wildColumnMult 长度=${result.length}`
            );
        }
    });

    return result;
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRows(PlateSymbol, awardSymbol = 0) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        var column = PlateSymbol[colIndex].Col || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex].Symbol;

            if (Symbol === awardSymbol || Symbol === WILD_ID) {
                winningRows.push({ rowIndex: rowIndex });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        } else {
            continuous = false; // 中断
        }
    }

    let result = list.map(function (winningRows) {
        if (!winningRows) return [];
        var rowIndexes = [];

        for (var i = 0; i < winningRows.length; i++) {
            rowIndexes.push(winningRows[i].rowIndex);
        }

        return rowIndexes;
    });

    let odds = result.reduce((acc, arr) => acc * arr.length, 1);

    return { list: result, odds: odds };
}

function processFreeQueue(gameData, gameId) {
    const RoundQueue = gameData.RoundQueue || [];
    const convertedMainPlate = RoundQueue[0].MainPlateSymbol.map(item => ({
        Col: item.Col.map(value => ({
            Symbol: value,
        })),
    }));

    const firstPlateCopy = JSON.parse(JSON.stringify(RoundQueue[0]));

    if (RoundQueue.length > 1) {
        RoundQueue.unshift({
            ...firstPlateCopy,
            FreePlateSymbolLog: convertedMainPlate,
        });
    } else {
        RoundQueue[0] = {
            ...firstPlateCopy,
            FreePlateSymbolLog: convertedMainPlate,
        };
    }

    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;
        const PlateSymbol = roundData.FreePlateSymbolLog;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        let PlateSymbolNumImg = [];
        if (index !== 0) {
            PlateSymbolNumImg = buildWildColumnImages(gameId, PlateSymbol);
        }

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const img = buildSymbolImageUrl(gameId, award.Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, odds } = calcWinningColumnsRows(PlateSymbol, award.Symbol);

            RoundWin += award.Win || 0;

            return {
                ...award,
                uuid: uuid(),
                img,
                list,
                odds,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolNumImg,
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec,
        };
    });

    if (plates.length) {
        plates.at(-1).TotalWin = gameData.TotalWin;
    }

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

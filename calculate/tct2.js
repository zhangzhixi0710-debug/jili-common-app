import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;
const EMPTY_SYMBOL = 21;

export const buildSymbolImageUrlJP = (gameId, id) => {
    if (id === EMPTY_SYMBOL) {
        return "";
    }
    return id || id === 0 ? jiliAsset(`images/intro/tct/jp_${id}.webp`) : "";
};

export const buildSymbolImageUrl = (gameId, id) => {
    if (id === EMPTY_SYMBOL) {
        return "";
    }
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";
};

const buildNumImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/${num}.webp`) : "";

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

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(gameId, data) {
    // 先把数字转换为字符串，然后拆成单个字符，再转换为数字
    const digits = String(data).split("").map(Number);

    // 调用 buildNumImageUrl 生成图片路径
    const images = digits.map(num => buildNumImageUrl(gameId, num));

    return images;
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
            if (!col.Number) {
                return {};
            }
            return {
                imgs: getSymbolImages(gameId, col.Number),
            };
        })
    );
}

function processFreeQueue(freeInfo, gameId) {
    const RoundQueue = freeInfo.RoundQueue || [];

    const convertedMainPlate = RoundQueue[0].MainPlateSymbol.map(item => ({
        Col: item.Col.map(value => ({
            Symbol: value,
        })),
    }));

    const firstPlateCopy = JSON.parse(JSON.stringify(RoundQueue[0]));

    if (RoundQueue.length > 1) {
        RoundQueue.unshift({
            ...firstPlateCopy,
            FreePlateSymbolLog: [
                {
                    FPSD: convertedMainPlate,
                },
            ],
        });
    } else {
        RoundQueue[0] = {
            ...firstPlateCopy,
            FreePlateSymbolLog: [
                {
                    FPSD: convertedMainPlate,
                },
            ],
        };
    }

    return RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const FreePlateSymbol = roundData.FreePlateSymbolLog.filter(
            item => item.FPSD && item.FPSD.length > 0
        );

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = FreePlateSymbol.map((plate, plateIndex) => {
            const FPSD = plate.FPSD;
            const PlateSymbolExtend = generatePlateSymbolExtend(FPSD, gameId);

            let PlateSymbolNumImg = buildWildColumnImages(gameId, FPSD);

            let AwardDataVec = [];
            if (plateIndex === FreePlateSymbol.length - 1) {
                AwardDataVec = (roundData.AwardDataVec || []).map(award => {
                    const img = buildSymbolImageUrl(gameId, award.Symbol);

                    const { list, odds } = calcWinningColumnsRows(FPSD, award.Symbol);

                    return {
                        ...award,
                        uuid: uuid(),
                        img,
                        list,
                        odds,
                    };
                });
            }

            return {
                ...plate,
                uuid: uuid(),
                AwardDataVec,
                PlateSymbolNumImg,
                PlateSymbolExtend,
            };
        });

        RoundWin = roundData.RoundWin ? roundData.RoundWin : RoundWin;

        return {
            ...roundData,
            isFrist,
            RoundWin,
            uuid: uuid(),
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = processFreeQueue(gameData, gameId);

    if (gameData.RoundQueue?.length > 1) {
        gameData.isFree = true;
    } else {
        gameData.isFree = false;
    }

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

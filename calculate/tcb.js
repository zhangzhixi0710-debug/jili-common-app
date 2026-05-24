import { jiliAsset } from '@/utils/assets';
const WILD_ID = [12, 17, 18, 19];

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Col[col])
        )
    );
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRows(PlateSymbol, awardSymbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        var column = PlateSymbol[colIndex].Col || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex];

            if (Symbol === awardSymbol || WILD_ID.includes(Symbol)) {
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
 * 处理游戏数据，将PlateSymbol和AwardDataVec按索引配对组合
 * 如果PlateSymbol的PSD不存在，则忽略该数据项
 * @param {Object} gameData - 原始游戏数据
 * @returns {Array} 处理后的数据数组
 */
function processGameDataConvert(gameData = []) {
    const result = [];

    // 遍历所有轮次
    gameData.forEach((roundData, roundIndex) => {
        // 遍历当前轮次的PlateSymbol
        roundData.PlateSymbol.forEach((plateItem, index) => {
            // 检查PSD是否存在
            if (!plateItem?.PSD || !Array.isArray(plateItem.PSD) || plateItem.PSD.length === 0) {
                return;
            }

            const dataItem = {
                roundIndex: roundIndex,
            };

            // 添加PSD数据
            dataItem.PlateSymbol = [...plateItem.PSD];

            // 添加ADV数据
            const awardData = roundData.AwardDataVec[index];
            dataItem.AwardDataVec = awardData?.ADV ? [...awardData.ADV] : [];

            // 添加其他数据
            for (const key in roundData) {
                if (key !== "PlateSymbol" && key !== "AwardDataVec") {
                    const value = roundData[key];
                    if (Array.isArray(value)) {
                        dataItem[key] = value[index] !== undefined ? value[index] : null;
                    } else {
                        dataItem[key] = value;
                    }
                }
            }

            result.push(dataItem);
        });
    });

    return result;
}

export function processFreeQueue(gameData, gameId) {
    const RoundQueue = processGameDataConvert(gameData.RoundQueue);

    const plates = RoundQueue.map(roundData => {
        let RoundWin = 0;
        const plateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(plateSymbol, gameId);

        // 奖励数据
        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Symbol = 0, Win = 0 } = award;

            const { list, odds } = calcWinningColumnsRows(plateSymbol, Symbol);

            const Img = buildSymbolImageUrl(gameId, Symbol);

            RoundWin += Win;

            return {
                ...award,
                uuid: uuid(),
                img: Img,
                list: list,
                Index: odds,
            };
        });

        return {
            PlateSymbolExtend,
            AwardDataVec,
            RoundWin,
            uuid: uuid(),
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = gameData?.RoundQueue ? processFreeQueue(gameData, gameId) : null;

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

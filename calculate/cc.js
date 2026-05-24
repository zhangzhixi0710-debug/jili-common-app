import { jiliAsset } from '@/utils/assets';
const WILD_ID = [11, 13, 30];

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";

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
            buildSymbolImageUrl(gameId, plateSymbol[row].Column[col])
        )
    );
}

/**
 * 将 FGRedCoins 奖励映射到 PlateSymbol 的列块结构中
 * @param {Array} plateSymbol - PlateSymbol 数组，每个元素包含 Column 数组
 * @param {Array} fgRedCoins - 奖励数组，每个元素包含 Pos 和 Win
 * @returns {Array} 二维数组，每个列块包含 3 个位置的奖励值
 */
function mapRedCoinsToColumns(plateSymbol, fgRedCoins, gameId) {
    // 初始化结果数组：每个列块对应一个 [0, 0, 0]
    const result = Array(plateSymbol.length)
        .fill()
        .map(() => [0, 0, 0]);

    // 遍历每个奖励
    fgRedCoins.forEach(coin => {
        const pos = coin.Pos; // 全局索引
        const win = coin.Win; // 奖励金额

        // 计算列块索引和列块内位置
        const columnIndex = Math.floor(pos / 3);
        const innerIndex = pos % 3;

        // 检查索引有效性
        if (columnIndex < result.length && innerIndex < 3) {
            if (win) {
                result[columnIndex][innerIndex] = String(win)
                    .split("")
                    .map(num => buildNumImageUrl(gameId, Number(num)));
            }
        }
    });

    return result;
}

/**
 * 替换指定位置的值
 * - 同时满足以下条件的位置替换为 bothValue (默认30)：
 *   1. 存在于 NowWildPos 中
 *   2. 存在于 FGRedCoins 中
 *   3. FGRedCoins 中对应的 Win 有有效值
 * - 仅存在于 NowWildPos 中的位置替换为 wildOnlyValue (默认13)
 * @param {Array} plateSymbol - PlateSymbol 数组
 * @param {Array} wildPositions - Wild 位置数组
 * @param {Array} redCoins - 奖励数组，包含 Pos 和 Win
 * @param {number} wildOnlyValue - 仅 Wild 位置的替换值 (默认13)
 * @param {number} bothValue - 同时满足条件的替换值 (默认30)
 * @returns {Array} 替换后的新数组
 */
function replacePositionsWithWild(
    plateSymbol,
    wildPositions,
    redCoins,
    wildOnlyValue = 13,
    bothValue = 30
) {
    // 深拷贝原始数据
    const newPlateSymbol = JSON.parse(JSON.stringify(plateSymbol));

    // 创建 Map 存储红币位置和对应的 Win 值
    const redCoinMap = new Map();
    redCoins.forEach(coin => {
        // 检查 Win 是否有有效值（不为 null、undefined、0？根据需求调整）
        if (coin.Win !== undefined && coin.Win !== null && coin.Win !== 0) {
            redCoinMap.set(coin.Pos, coin.Win);
        }
    });

    // 遍历所有 Wild 位置
    wildPositions.forEach(pos => {
        const columnIndex = Math.floor(pos / 3);
        const innerIndex = pos % 3;

        // 检查索引有效性
        if (columnIndex < newPlateSymbol.length && innerIndex < 3) {
            // 判断是否同时存在于 FGRedCoins 中且有有效的 Win 值
            if (redCoinMap.has(pos)) {
                newPlateSymbol[columnIndex].Column[innerIndex] = bothValue; // 同时满足 → 30
            } else {
                newPlateSymbol[columnIndex].Column[innerIndex] = wildOnlyValue; // 仅 Wild → 13
            }
        }
    });

    return newPlateSymbol;
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
        var column = PlateSymbol[colIndex].Column || [];
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

function processFreeQueue(gameData, gameId) {
    const RoundQueue = gameData.RoundQueue || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        let PlateSymbolExtend = [];
        let PlateSymbol = roundData.PlateSymbol;
        const FGRedCoins = roundData.FGRedCoins;
        const NowWildPos = roundData.NowWildPos;

        const RoundMultImages = FGRedCoins
            ? mapRedCoinsToColumns(PlateSymbol, FGRedCoins, gameId)
            : [];

        if (NowWildPos && NowWildPos.length) {
            PlateSymbol = replacePositionsWithWild(
                PlateSymbol,
                NowWildPos,
                FGRedCoins,
                roundData.WildSymbol
            );
        }

        PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

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

        if (FGRedCoins && FGRedCoins.length) {
            FGRedCoins.forEach(coin => {
                if (coin.Win) {
                    // 初始化一个空的二维数组
                    const result = Array(5)
                        .fill()
                        .map(() => []);

                    const pos = coin.Pos;
                    const columnIndex = Math.floor(pos / 3);
                    const innerIndex = pos % 3;

                    // 检查索引有效性
                    if (columnIndex < 5) {
                        result[columnIndex].push(innerIndex);
                    }

                    AwardDataVec.push({
                        uuid: uuid(),
                        img: buildSymbolImageUrl(gameId, 18),
                        list: result,
                        Win: coin.Win,
                    });

                    RoundWin += coin.Win;
                }
            });
        }

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundMultImages,
            RoundWin,
            AwardDataVec,
        };
    });

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

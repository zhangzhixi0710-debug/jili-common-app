import { jiliAsset } from '@/utils/assets';
const DIFFERENCE = [12, 13, 14, 15];

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

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
            buildSymbolImageUrl(gameId, plateSymbol[row].Col[col])
        )
    );
}

/**
 * 根据数据和中奖位置向量计算每列中奖符号的索引（支持翻转，并排序）
 * 特殊规则：如果 symbolId === DIFFERENCE，则所有 data 中值为 DIFFERENCE 的位置都视为中奖
 * @param {Array} data - 数据源，每个元素是一个对象，包含一个 Col 数组
 * @param {Array} posVec - 一维索引数组，表示在所有 Col 展开后中奖的位置
 * @param {Number} symbolId - 当前计算的中奖符号ID
 * @returns {Object} - { list, count }
 *   list: 二维数组，每个子数组存放该列中奖符号的行索引（排序）
 *   count: 总中奖个数
 */
function getWinningIndexes(data, posVec, symbolId) {
    const colLen = data[0].Col.length; // 每列的行数
    const result = Array.from({ length: data.length }, () => []); // 初始化结果数组

    if (DIFFERENCE.includes(symbolId)) {
        // 遍历每一列，每一行，如果值为 DIFFERENCE 则视为中奖
        data.forEach((colObj, colIndex) => {
            colObj.Col.forEach((val, rowIndex) => {
                if (DIFFERENCE.includes(val)) {
                    // const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
                    result[colIndex].push(rowIndex);
                }
            });
        });
        debugger
    } else {
        // 普通情况，按 posVec 计算中奖位置
        posVec.forEach(idx => {
            const colIndex = Math.floor(idx / colLen); // 属于第几列
            const rowIndex = idx % colLen; // 在列中的位置
            // const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
            result[colIndex].push(rowIndex);
        });
    }

    // 对每列中奖索引排序
    result.forEach(arr => arr.sort((a, b) => a - b));

    // 计算总中奖个数
    const count = result.reduce((sum, arr) => sum + arr.length, 0);

    return { list: result, count };
}

function processFreeQueue(gameData, gameId) {
    const RoundQueue = gameData.RoundQueue || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbolLog;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const img = buildSymbolImageUrl(gameId, award.Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, count } = getWinningIndexes(PlateSymbol, award.PosVec, award.Symbol);

            award.Count = count;

            RoundWin += award.Win || 0;

            return {
                ...award,
                uuid: uuid(),
                Index: award.Line,
                img,
                list,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
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

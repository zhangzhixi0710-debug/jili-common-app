import { jiliAsset } from '@/utils/assets';
const WILD_ID = 7;
const JARKPOT_ID = 8;
const MAJOR_ID = "MAJOR";
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, posVec) {
    const colLen = plateSymbol[0].Col.length; // 每列的行数
    const result = Array.from({ length: plateSymbol.length }, () => []); // 初始化结果数组

    posVec.forEach(idx => {
        const colIndex = Math.floor(idx / colLen); // 属于第几列
        const rowIndex = idx % colLen; // 在列中的位置
        // const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
        result[colIndex].push(rowIndex);
    });

    // 对每列中奖索引排序
    result.forEach(arr => arr.sort((a, b) => a - b));

    return result;
}

/**
 * 检查整盘是否全部为 JARKPOT_ID
 * @param {Array} plateSymbol - 盘面符号数组，如 [{ Row: [1,2,3] }, { Row: [4,5,6] }]
 * @param {number} JARKPOT_ID - 代表 Jackpot 的符号 ID
 * @returns {Array} 如果全部是 JARKPOT_ID，返回所有格子的位置信息；否则返回 []
 */
function checkAllJackpot(plateSymbol) {
    // 检查整盘是否全部都是 JARKPOT_ID
    const jackpotCells = [];
    let allJackpot = true;

    for (let col = 0; col < plateSymbol.length; col++) {
        for (let row = 0; row < plateSymbol[col].Col.length; row++) {
            if (plateSymbol[col].Col[row] !== JARKPOT_ID) {
                allJackpot = false;
                break; // 有一个不是就直接跳出
            }
            jackpotCells.push({ col, row, symbolId: JARKPOT_ID });
        }
        if (!allJackpot) break;
    }

    return allJackpot ? jackpotCells : undefined;
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.Symbol;

        if (checkAllJackpot(PlateSymbol)) {
            return {
                isMajor: true,
                ...roundData,
                uuid: uuid(),
                img: buildSymbolImageUrl(gameId, MAJOR_ID),
                RoundWin: roundData.TotalWin,
            };
        }

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const { Line = 0, Win, Pos, Symbol = 0 } = award;

            const list = validateLineOnPlate(PlateSymbol, Pos);

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: buildSymbolImageUrl(gameId, Symbol),
                list: list,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            AwardDataVec: sortByIndex([...AwardDataVec]),
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

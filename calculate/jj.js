import { jiliAsset } from '@/utils/assets';
const WILD_ID = 7;
const JARKPOT_ID = 8;
const MAJOR_ID = "MAJOR";
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ==========================================
// 88条固定Paylines
// ==========================================
const PAYLINES = [
    // Line 1
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ],
    // Line 2
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
    ],
    // Line 3
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
    ],
    // Line 5
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
    ],
];

// ==========================================
// 辅助函数

function getLineByIndex(index) {
    return PAYLINES[index];
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Row[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, lineCells) {
    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => WILD_ID !== c.symbolId);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (targetId === c.symbolId || WILD_ID === c.symbolId) {
            matchedCells.push(c);
            count++;
        } else {
            if (count >= 3) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    return matchedCells.length >= 3
        ? {
              list: matchedCells,
              odds: targetId,
          }
        : {};
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
        for (let row = 0; row < plateSymbol[col].Row.length; row++) {
            if (plateSymbol[col].Row[row] !== JARKPOT_ID) {
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
    const RoundQueue = [gameData] || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbol[0].Col;

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

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win } = award;
            const line = getLineByIndex(Line);

            const { list, odds } = line ? validateLineOnPlate(PlateSymbol, line) : {};

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: buildSymbolImageUrl(gameId, odds),
                list: generateHighlightListFromWinning(list),
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = gameData?.PlateSymbol ? processFreeQueue(gameData, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

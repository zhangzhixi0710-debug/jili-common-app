import { jiliAsset } from '@/utils/assets';
const WILD_ID = [11, 12];
const DIFFERENCE = 13;

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

const buildNumImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/X${num}.webp`) : "";

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
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 2
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 3
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 5
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 6
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 7
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 8
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 9
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 10
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 11
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 12
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 14
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 15
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 16
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 18
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
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
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, lineCells, symbolId) {
    // ? 检查整个牌面上 DIFFERENCE 的位置
    const diffCells = [];
    plateSymbol.forEach((colObj, colIndex) => {
        colObj.Col.forEach((val, rowIndex) => {
            if (val === DIFFERENCE) {
                diffCells.push({ col: colIndex, row: rowIndex, symbolId: val });
            }
        });
    });

    // ? 如果 DIFFERENCE 数量 >= 3，直接算中奖，返回相同结构
    if (diffCells.length >= 3) {
        return diffCells;
    }

    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Col[p.row],
    }));

    const matchedCells = [];
    let count = 0;

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => !WILD_ID.includes(c.symbolId));
    const targetId = targetCell ? [targetCell.symbolId] : WILD_ID;

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (targetId.includes(c.symbolId) || WILD_ID.includes(c.symbolId)) {
            matchedCells.push(c);
            count++;
        } else {
            if (count >= 3) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    return matchedCells.length >= 3 ? matchedCells : [];
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

/**
 * 根据PlateSymbolNum生成对应的图片数组结构
 * @param {string} gameId - 游戏ID
 * @param {Array} plateSymbolNum - PlateSymbolNum数组
 * @returns {Array<Array<string|Array<string>>>} 返回二维数组 [列][行]
 */
function buildWildColumnImages(gameId, plateSymbolNum) {
    return plateSymbolNum.map(column => {
        return column.Col.map(value => {
            if (value > 0) {
                const digits = String(value).split("").map(Number);
                const imageUrls = digits.map(digit => { 
                    return buildNumImageUrl(gameId, digit)
                });

                return imageUrls;
            } else {
                return "";
            }
        });
    });
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const PlateSymbolNum = buildWildColumnImages(gameId, roundData.PlateSymbolNum);
        
        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win = 0, Symbol = 0 } = award;
            const line = getLineByIndex(Line);

            const awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, Symbol) : [];

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            PlateSymbolExtend,
            PlateSymbolNum,
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
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

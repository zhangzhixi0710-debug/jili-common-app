import { jiliAsset } from '@/utils/assets';
const WILD_ID = 7;
const PRE_MULT = "xx";

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
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 7
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 8
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
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
            return buildSymbolImageUrl(gameId, plateSymbol[row].Row[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, lineCells, symbolId) {
    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    const matchedCells = [];
    let count = 0;

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => WILD_ID !== c.symbolId);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

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

    return matchedCells.length >= 3 ? matchedCells : [];
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

/**
 * 替换指定列为 WILD 符号
 * @param {Array} plateSymbol - 原始盘面数组，如 [{ Row: [0,3,5] }, ...]
 * @param {Array<number>} wildColumnMult - 对应列的倍率数组，如 [0,1,0,0,0]
 * @returns {Array} 替换后的新盘面（不修改原始数据）
 */
function applyWildColumns(plateSymbol, wildColumnMult) {
    // 深拷贝，避免修改原始数组
    const newPlate = plateSymbol.map(col => ({
        Row: [...col.Row],
    }));

    for (let i = 0; i < newPlate.length; i++) {
        if (wildColumnMult[i] > 0) {
            newPlate[i].Row = newPlate[i].Row.map(() => WILD_ID);
        }
    }

    return newPlate;
}

/**
 * 根据列倍率生成对应的图片数组结构
 * @param {number[]} wildColumnMult - 每列的倍率数组，例如 [0, 1, 12, 0, 123]
 * @returns {Array<Array<string>>} 返回二维数组，每一列对应一组图片
 */
function buildWildColumnImages(gameId, wildColumnMult) {
    return wildColumnMult.map(v => {
        if (v > 0) {
            // 拆分数字为字符数组，例如 123 → ['1', '2', '3']
            const digits = String(v).split("");
            return [
                buildNumImageUrl(gameId, PRE_MULT), // 前缀图
                ...digits.map(d => buildNumImageUrl(gameId, d)), // 每个数字图
            ];
        } else {
            return [];
        }
    });
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let RoundWin = 0;
        let PlateSymbol = roundData.PlateSymbol;
        let hasPositive = roundData.WildColumnMult.some(v => v > 0);
        let HeaderImage = [];
        let WildColumnMult = [];
        if (hasPositive) {
            WildColumnMult = [0, ...roundData.WildColumnMult, 0];
            HeaderImage = buildWildColumnImages(gameId, WildColumnMult);

            PlateSymbol = applyWildColumns(roundData.PlateSymbol, WildColumnMult);
        }

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win = 0, Symbol = 0 } = award;
            const line = getLineByIndex(Line);

            const awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, Symbol) : [];
            console.log(awardsDetail);

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: buildSymbolImageUrl(gameId, Symbol),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            HeaderImage,
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
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

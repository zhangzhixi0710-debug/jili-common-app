import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = [7, 10, 12];
const SCATTER_ID = 11;
const SPECIAL_ID = 12;

const symbolMap = {
    0: jiliAsset("images/intro/loe/symbol_0.webp"),
    1: jiliAsset("images/intro/loe/symbol_1.webp"),
    2: jiliAsset("images/intro/loe/symbol_2.webp"),
    3: jiliAsset("images/intro/loe/symbol_3.webp"),
    4: jiliAsset("images/intro/loe/symbol_4.webp"),
    5: jiliAsset("images/intro/loe/symbol_5.webp"),
    6: jiliAsset("images/intro/loe/symbol_6.webp"),
    7: jiliAsset("images/intro/loe/symbol_7.webp"),
    8: jiliAsset("images/intro/loe/symbol_8.webp"),
    9: jiliAsset("images/intro/loe/symbol_9.webp"),
    10: jiliAsset("images/intro/loe/symbol_10.webp"),
    11: jiliAsset("images/intro/loe/symbol_11.webp"),
    12: jiliAsset("images/intro/loe/symbol_12.webp"),
};
const symbolNumMap = {
    0: jiliAsset("images/intro/loe/0.webp"),
    1: jiliAsset("images/intro/loe/1.webp"),
    2: jiliAsset("images/intro/loe/2.webp"),
    3: jiliAsset("images/intro/loe/3.webp"),
    4: jiliAsset("images/intro/loe/4.webp"),
    5: jiliAsset("images/intro/loe/5.webp"),
    6: jiliAsset("images/intro/loe/6.webp"),
    7: jiliAsset("images/intro/loe/7.webp"),
    8: jiliAsset("images/intro/loe/8.webp"),
    9: jiliAsset("images/intro/loe/9.webp"),
};

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
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 2
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
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
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 5
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 6
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 7
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 8
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 9
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 10
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 11
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 12
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 14
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 15
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
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
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
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

function generatePlateSymbolExtend(plateSymbol) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => symbolMap[plateSymbol[row].Col[col]])
    );
}

function findValueIndices(data, target, rows = 4) {
    return data.map(item => {
        // 兼容对象格式和数组格式
        const col = Array.isArray(item) ? item : item.Col;

        // 先找到命中的行索引
        const hitRows = col.reduce((acc, val, rowIndex) => {
            if (val === target) acc.push(rowIndex);
            return acc;
        }, []);

        // 转换成布尔数组
        return Array.from({ length: rows }, (_, rowIndex) => hitRows.includes(rowIndex));
    });
}

function validateLineOnPlate(plateSymbol, lineCells, symbolIdCheck) {
    // 如果检查的是 SCATTER_ID，不走连线逻辑，而是全盘扫描
    if (symbolIdCheck === SCATTER_ID) {
        const scatterCells = [];
        for (let col = 0; col < plateSymbol.length; col++) {
            for (let row = 0; row < plateSymbol[col].Col.length; row++) {
                if (plateSymbol[col].Col[row] === SCATTER_ID) {
                    scatterCells.push({ col, row, symbolId: SCATTER_ID });
                }
            }
        }
        return scatterCells.length >= 3 ? scatterCells : [];
    }

    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Col[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => !WILD_ID.includes(c.symbolId));
    const targetId = targetCell ? [targetCell.symbolId] : WILD_ID;

    let count = 0;
    const matchedCells = [];

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

function processFreeQueue(gameData) {
    const RoundQueue = gameData.RoundQueue || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol);

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win, Symbol } = award;
            const line = getLineByIndex(Line);

            const awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, Symbol) : [];

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: symbolMap[Symbol],
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        const symbolNum = roundData.Nudge != -1 ? symbolNumMap[roundData.Nudge] : "";

        if (RoundQueue.length > 1 && index === 0) {
            const awardsDetail = validateLineOnPlate(PlateSymbol, [], SCATTER_ID);

            RoundWin += roundData.RoundWin || 0;

            AwardDataVec.push({
                Index: 1,
                uuid: uuid(),
                Win: roundData.RoundWin,
                img: symbolMap[SCATTER_ID],
                list: generateHighlightListFromWinning(awardsDetail),
            });
        }

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            symbolNum,
            symbolNumArray: findValueIndices(PlateSymbol, SPECIAL_ID),
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData) {
    const rounds = gameData?.RoundQueue ? processFreeQueue(gameData) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

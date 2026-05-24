import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = 10;

const symbolMap = {
    0: jiliAsset("images/intro/dl/symbol_0.webp"), // 9
    1: jiliAsset("images/intro/dl/symbol_1.webp"), // 10
    2: jiliAsset("images/intro/dl/symbol_2.webp"), // J
    3: jiliAsset("images/intro/dl/symbol_3.webp"), // Q
    4: jiliAsset("images/intro/dl/symbol_4.webp"), // K
    5: jiliAsset("images/intro/dl/symbol_5.webp"), // A
    6: jiliAsset("images/intro/dl/symbol_6.webp"), // 绿色药水
    7: jiliAsset("images/intro/dl/symbol_7.webp"), // 蜡烛
    8: jiliAsset("images/intro/dl/symbol_8.webp"), // 紫色戒指
    9: jiliAsset("images/intro/dl/symbol_9.webp"), // 叉子
    10: jiliAsset("images/intro/dl/symbol_A.webp"), // 恶魔头像
    11: jiliAsset("images/intro/dl/symbol_B.webp"), // 带锁定金币奖金符号
    12: jiliAsset("images/intro/dl/symbol_C.webp"), // 带锁定金币奖金符号
    13: jiliAsset("images/intro/dl/symbol_D.webp"), // 带锁定金币奖金符号
    14: jiliAsset("images/intro/dl/symbol_E.webp"), // 带锁定MINI
    15: jiliAsset("images/intro/dl/symbol_F.webp"), // 带锁定MINOR
    16: jiliAsset("images/intro/dl/symbol_G.webp"), // 带锁定MEGA
    17: jiliAsset("images/intro/dl/symbol_H.webp"), // 带锁定GRANP
    18: jiliAsset("images/intro/dl/symbol_I.webp"), // 金币奖金符号
    19: jiliAsset("images/intro/dl/symbol_J.webp"), // 金币奖金符号
    20: jiliAsset("images/intro/dl/symbol_K.webp"), // 金币奖金符号
    21: jiliAsset("images/intro/dl/symbol_L.webp"), // MINI
    22: jiliAsset("images/intro/dl/symbol_M.webp"), // MINOR
    23: jiliAsset("images/intro/dl/symbol_N.webp"), // MEGA
    24: jiliAsset("images/intro/dl/symbol_O.webp"), // GRANP
};

const BonudsMap = {
    11: 18,
    12: 19,
    13: 20,
    14: 21,
    15: 22,
    16: 23,
    17: 24,
};

const SYMBOL_NAME_MAP = {
    0: "9",
    1: "10",
    2: "J",
    3: "Q",
    4: "K",
    5: "A",
    6: "绿色药水",
    7: "蜡烛",
    8: "紫色戒指",
    9: "叉子",
    10: "恶魔头像", // WILD
    11: "带锁定金币奖金符号",
    12: "带锁定金币奖金符号",
    13: "带锁定金币奖金符号",
    14: "带锁定MINI",
    15: "带锁定MINOR",
    16: "带锁定MEGA",
    17: "带锁定GRANP",
    18: "金币奖金符号",
    19: "金币奖金符号",
    20: "金币奖金符号",
    21: "MINI",
    22: "MINOR",
    23: "MEGA",
    24: "GRANP",
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
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 7
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
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
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 11
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 12
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 13
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 14
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 15
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
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
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 21
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 22
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 23
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 24
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 25
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 26
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 37
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 29
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 30
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 31
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 32
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 33
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 34
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 35
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 36
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 37
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 38
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 39
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 40
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
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

function generatePlateSymbolExtend(plateSymbol) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => symbolMap[plateSymbol[row].Row[col]])
    );
}

function parseBonusData(Index) {
    // Index 从 1 开始，转成 0-based
    const flatIndex = Index - 1;

    // 盘面 5 列 × 3 行，列优先
    const col = Math.floor(flatIndex / 3);
    const row = flatIndex % 3;

    // 生成和 AwardDataVec 一致的 list 格式
    const list = Array.from({ length: 5 }, () => []);
    list[col].push(row);

    return list;
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => c.symbolId !== WILD_ID);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (c.symbolId === targetId || c.symbolId === WILD_ID) {
            matchedCells.push({ ...c, symbolName: SYMBOL_NAME_MAP[c.symbolId] });
            count++;
        } else {
            // 遇到不匹配就中断，如果当前累计>=3，直接返回中奖
            if (count >= 3) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    return {
        ok: matchedCells.length >= 3,
        cells: matchedCells.length >= 3 ? matchedCells : [],
    };
}

/**
 * 替换 data 数组中所有等于 target 的值为 newValue
 * @param {Array} arr - 数据数组
 * @param {number} target - 要查找的值
 */
function replaceValue(Symbol, BonusDataVec) {
    BonusDataVec.forEach(bonus => {
        const symbol = bonus.Symbol;
        if (BonudsMap[symbol]) {
            Symbol = Symbol.map(item => ({
                Row: item.Row.map(v => (v === symbol ? BonudsMap[symbol] : v)),
            }));
        }
    });

    return Symbol;
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

// ==========================================
// MainGame + FreeQueue 处理
// ==========================================
function processMainGame(MainGame) {
    const Symbol = replaceValue(MainGame.Symbol, MainGame.BonusDataVec);

    const BonusAwardsVec = (MainGame.BonusDataVec || []).map((award, idx) => {
        const { Index = 0 } = award;
        const list = parseBonusData(Index + 1);

        return {
            ...award,
            uuid: uuid(),
            list,
        };
    });

    const PlateSymbolExtend = generatePlateSymbolExtend(Symbol);

    const AwardDataVec = (MainGame.AwardDataVec || []).map((award, idx) => {
        const { Index = 0 } = award;
        const line = getLineByIndex(Index);
        const awardsDetail = line ? validateLineOnPlate(Symbol, line).cells : [];

        award.Index = Index + 1;

        return {
            ...award,
            uuid: uuid(),
            list: generateHighlightListFromWinning(awardsDetail),
        };
    });
    return {
        ...MainGame,
        AwardDataVec: sortByIndex([...AwardDataVec, ...BonusAwardsVec]),
        PlateSymbolExtend,
        uuid: uuid(),
    };
}

function processFreeQueue(FreeGame) {
    const FreeQueue = FreeGame.FreeQueue || [];
    const plates = FreeQueue.map((roundData, roundIndex) => {
        let RoundWin = 0;

        const Symbol = replaceValue(roundData.Symbol, roundData.BonusDataVec);

        const BonusAwardsVec = (roundData.BonusDataVec || []).map((award, idx) => {
            const { Index = 0 } = award;
            const list = parseBonusData(Index + 1);

            return {
                ...award,
                uuid: uuid(),
                list,
            };
        });

        const PlateSymbolExtend = generatePlateSymbolExtend(Symbol);

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Index = 0, Win } = award;
            const line = getLineByIndex(Index);

            const awardsDetail = line ? validateLineOnPlate(Symbol, line).cells : [];

            RoundWin += Win || 0;

            award.Index = Index + 1;

            return {
                ...award,
                uuid: uuid(),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec: sortByIndex([...AwardDataVec, ...BonusAwardsVec]),
        };
    });
    return {
        ...FreeGame,
        uuid: uuid(),
        plates,
    };
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData) {
    const MainGame = gameData.MainGame ? processMainGame(gameData.MainGame) : [];
    const rounds = gameData?.FreeGame ? processFreeQueue(gameData.FreeGame) : null;
    if (gameData?.FreeGame?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeGame.FreeTotalWin;

    return {
        ...gameData,
        uuid: uuid(),
        MainGame,
        rounds,
    };
}

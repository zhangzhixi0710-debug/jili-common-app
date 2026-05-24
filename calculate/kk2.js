import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = 10;
const SCATTER_ID = 12;
const DEFAULT_FREE_COUNT = 8;

const symbolMap = {
    0: jiliAsset("images/intro/kk2/symbol_0.webp"),
    1: jiliAsset("images/intro/kk2/symbol_1.webp"),
    2: jiliAsset("images/intro/kk2/symbol_2.webp"),
    3: jiliAsset("images/intro/kk2/symbol_3.webp"),
    4: jiliAsset("images/intro/kk2/symbol_4.webp"),
    5: jiliAsset("images/intro/kk2/symbol_5.webp"),
    6: jiliAsset("images/intro/kk2/symbol_6.webp"),
    7: jiliAsset("images/intro/kk2/symbol_7.webp"),
    8: jiliAsset("images/intro/kk2/symbol_8.webp"),
    9: jiliAsset("images/intro/kk2/symbol_9.webp"),
    10: jiliAsset("images/intro/kk2/symbol_A.webp"),
    11: jiliAsset("images/intro/kk2/symbol_B.webp"),
    12: jiliAsset("images/intro/kk2/symbol_C.webp"),
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
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 6
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 7
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 8
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 10
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 11
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 12
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 13
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 14
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
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
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 18
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 19
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 20
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 24
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 25
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 26
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 27
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 29
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 30
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 31
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 32
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 33
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 34
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 35
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 36
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 37
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 38
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 39
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 40
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 41
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 42
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 43
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 44
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 45
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 46
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 47
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 48
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 49
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 50
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
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
    // 再映射成图片
    return plateSymbol.map(row => row.Row.map(sym => symbolMap[sym]));
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => c.symbolId !== WILD_ID && c.symbolId !== SCATTER_ID);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (c.symbolId === targetId || c.symbolId === WILD_ID) {
            matchedCells.push({ ...c });
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

// ==========================================
// MainGame + FreeQueue 处理
// ==========================================
function processMainGame(MainGame) {
    const MainPlate = MainGame.MainPlate || [];
    const plates = MainPlate.map((roundData, roundIndex) => {
        let RoundWin = 0;

        const PlateSymbolExtend = generatePlateSymbolExtend(roundData.LastPlate);

        const AwardDataVec = (roundData.AwardDataList || []).map((award, idx) => {
            const { Money, Index = 0 } = award;

            RoundWin += Money || 0;

            const line = getLineByIndex(Index);

            const awardsDetail = line ? validateLineOnPlate(roundData.LastPlate, line).cells : [];

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
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });
    return {
        ...MainGame,
        uuid: uuid(),
        plates,
    };
}

function processFreeQueue(freeInfo) {
    const FreeQueue = freeInfo.FreeQueue || [];
    let prevMaxRound = DEFAULT_FREE_COUNT; // 第一个对象的前值写死为 8

    return FreeQueue.map((roundData, roundIndex) => {
        let RoundWin = 0;
        const uid = uuid();
        const FreePlate = [roundData.FreePlate] || [];

        const diff = roundData.MaxRound - prevMaxRound;
        if (diff > 0) {
            roundData.FreeCount = diff; // 新增属性
        }
        prevMaxRound = roundData.MaxRound; // 更新前值

        const plates = FreePlate.map((plate, plateIndex) => {
            const PlateSymbolExtend = generatePlateSymbolExtend(plate.LastPlate);

            let AwardDataVec = (plate.AwardDataList || []).map((award, idx) => {
                const { Money, Index = 0 } = award;

                RoundWin += Money || 0;

                const line = getLineByIndex(Index);

                const awardsDetail = line ? validateLineOnPlate(plate.LastPlate, line).cells : [];

                award.Index = Index + 1;

                return {
                    ...award,
                    uuid: uuid(),
                    list: generateHighlightListFromWinning(awardsDetail),
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                SingleMul: plate.SingleWin || 1,
                AwardDataVec: sortByIndex(AwardDataVec),
            };
        });
        return {
            ...roundData,
            uuid: uid,
            RoundWin,
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData) {
    const MainInfo = gameData.MainInfo ? processMainGame(gameData.MainInfo) : [];
    const rounds = gameData?.FreeInfo ? processFreeQueue(gameData.FreeInfo) : null;
    if (gameData?.FreeInfo?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeInfo.FreeTotalWin;

    return {
        ...gameData,
        uuid: uuid(),
        MainInfo,
        rounds,
    };
}

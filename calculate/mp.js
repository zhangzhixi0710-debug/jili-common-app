import { jiliAsset } from '@/utils/assets';
export const buildSymbolImageUrl = (gameId, id) => {
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol${id}.webp`) : "";
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
    // 1?? 顶行（上横线）
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
    ],

    // 2?? 中行（中横线）
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ],

    // 3?? 底行（下横线）
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
    ],

    // 4?? 左上到右下（↘）
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
    ],

    // 5?? 左下到右上（↗）
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
    ],

    // // 6?? V 形（上 → 中 → 下）
    // [
    //     { col: 0, row: 0 },
    //     { col: 0, row: 1 },
    //     { col: 0, row: 2 },
    // ],

    // // 7?? 中竖线（垂直）
    // [
    //     { col: 1, row: 0 },
    //     { col: 1, row: 1 },
    //     { col: 1, row: 2 },
    // ],

    // // 8?? 右竖线
    // [
    //     { col: 2, row: 0 },
    //     { col: 2, row: 1 },
    //     { col: 2, row: 2 },
    // ],
];

// ==========================================
// 辅助函数
function getLineByIndex(index) {
    return PAYLINES[index];
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            let symbolId = plateSymbol[row].Row[col];
            if (col === 0 && symbolId === 7) {
                symbolId = "7_1";
            }
            if (col === 1 && symbolId === 7) {
                symbolId = "7_2";
            }
            if (col === 2 && symbolId === 7) {
                symbolId = "7_3";
            }
            if (col === 0 && symbolId === 8) {
                symbolId = "8_1";
            }
            if (col === 1 && symbolId === 8) {
                symbolId = "8_2";
            }
            if (col === 2 && symbolId === 8) {
                symbolId = "8_3";
            }
            return buildSymbolImageUrl(gameId, symbolId);
        })
    );
}

function validateLineOnPlate(plateSymbol, lineCells, symbolId, wildPlate) {
    // 检查 WildPlate 中是否有值 != -1
    const hasActiveWild = wildPlate ? wildPlate.some(col => col.Row.some(v => v !== -1)) : false;

    // ? 情况1：存在 Wild 值，直接对照 plateSymbol 按二维结构返回
    if (hasActiveWild) {
        const matchedCells = [];

        for (let col = 0; col < wildPlate.length; col++) {
            for (let row = 0; row < wildPlate[col].Row.length; row++) {
                if (wildPlate[col].Row[row] !== -1) {
                    matchedCells.push({
                        col,
                        row,
                        symbolId: plateSymbol[col].Row[row],
                        wildVal: wildPlate[col].Row[row],
                    });
                }
            }
        }

        // 至少3个位置触发才算中奖
        return matchedCells.length >= 3 ? matchedCells : [];
    }

    // 将 lineCells 转换为带 symbolId 的数组
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    const matchedCells = [];

    // 确定基准符号（可传入或自动取首个非wild符号）
    let baseSymbolId = symbolId;
    if (!baseSymbolId) {
        const firstNonWild = cellsWithId.find(c => c.wildVal === -1);
        baseSymbolId = firstNonWild ? firstNonWild.symbolId : cellsWithId[0].symbolId;
    }

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        // ? 如果 WildPlate 不为 -1，算匹配
        if (c.symbolId === baseSymbolId || c.wildVal !== -1) {
            matchedCells.push(c);
        } else {
            break; // 连线中断
        }
    }

    // 至少连续3个才算中奖
    return matchedCells.length >= 3 ? matchedCells : [];
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.PlateInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let RoundWin = 0;
        let PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataList || []).map((award, idx) => {
            const { AwardLine = 0, AwardMoney = 0, AwardSymbol = 0 } = award;
            let line = getLineByIndex(AwardLine);

            let awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, AwardSymbol) : [];

            RoundWin += AwardMoney || 0;

            return {
                Index: AwardLine,
                uuid: uuid(),
                Win: AwardMoney,
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            isFrist,
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
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

import { jiliAsset } from '@/utils/assets';
const WILD_ID = 9;
const DIFFERENCE = 10;
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

    // Line 特殊竖线（垂直）
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

function validateLineOnPlate(
    plateSymbol,
    lineCells,
    symbolId,
    FreeExpandInfo = [],
    WildExpandColumn = []
) {
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

    // ? 2. FreeExpandInfo + WildExpandColumn 扩展列中奖逻辑
    const expandCells = [];
    // 处理 FreeExpandInfo 的 ExpandColumn
    FreeExpandInfo.forEach(info => {
        info.ExpandColumn.forEach((isTrue, colIndex) => {
            const wildExpand = WildExpandColumn[colIndex] === true;
            if (isTrue || wildExpand) {
                const colData = plateSymbol[colIndex];
                if (colData) {
                    colData.Col.forEach((val, rowIndex) => {
                        expandCells.push({
                            col: colIndex,
                            row: rowIndex,
                            symbolId: val,
                            expandSymbol: info.Symbol,
                            winType: wildExpand ? "WILD_EXPAND" : "EXPAND",
                        });
                    });
                }
            }
        });
    });

    if (expandCells.length > 0) {
        return expandCells;
    }

    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Col[p.row],
    }));

    const matchedCells = [];
    let count = 0;

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (symbolId === c.symbolId || WILD_ID === c.symbolId) {
            matchedCells.push(c);
            count++;
        } else {
            if (count >= 2) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    return matchedCells.length >= 2 ? matchedCells : [];
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let PlateSymbols = [];
        let PlateSymbol = roundData.PlateSymbolClient.map((colObj, index) => ({
            Col: roundData.WildExpandColumn[index]
                ? colObj.Col.map(() => WILD_ID) // 替换整列为 WILD_ID
                : [...colObj.Col], // 保留原值
        }));

        PlateSymbols.push({
            ...roundData,
            FreeExpandInfo: [],
            PlateSymbolClient: PlateSymbol,
        });

        const FreeExpandInfo = (roundData.FreeExpandInfo || []).filter(info =>
            info.ExpandColumn.some(v => v === true)
        );

        if (FreeExpandInfo.length) {
            const FreeExpandInfo = roundData.FreeExpandInfo.filter(info =>
                info.ExpandColumn.some(v => v === true)
            );

            FreeExpandInfo.map(item => {
                const targetId = item.Symbol + 11;
                const FreeExpand = PlateSymbol.map((colObj, index) => ({
                    Col: item.ExpandColumn[index]
                        ? colObj.Col.map(() => targetId) // 替换整列为 WILD_ID
                        : [...colObj.Col], // 保留原值
                }));

                PlateSymbols.push({
                    ...roundData,
                    FreeExpandInfo: [item],
                    PlateSymbolClient: FreeExpand,
                    AwardDataVec: [
                        {
                            ...item,
                            Line: -1,
                            Symbol: targetId,
                        },
                    ],
                });
            });
        } else {
        }

        const plates = PlateSymbols.map((plate, plateIndex) => {
            const PlateSymbolExtend = generatePlateSymbolExtend(plate.PlateSymbolClient, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map((award, idx) => {
                let { Line = 0, Win = 0, Symbol = 0 } = award;
                let awardsDetail = [];

                let line = getLineByIndex(Line);

                awardsDetail = validateLineOnPlate(
                    PlateSymbol,
                    line,
                    Symbol,
                    plate.FreeExpandInfo.length ? plate.FreeExpandInfo : [],
                    plate.WildExpandColumn.length ? plate.WildExpandColumn : []
                );

                let img = "";
                if (Line === -1) {
                    img = buildSymbolImageUrl(gameId, Symbol);
                }

                if (Symbol === DIFFERENCE) {
                    Win = plate.ScatterWin;
                }

                RoundWin += Win || 0;

                return {
                    Index: Line + 1,
                    uuid: uuid(),
                    Win,
                    img,
                    list: generateHighlightListFromWinning(awardsDetail),
                };
            });

            if (plate.FreeExpandInfo && plate.FreeExpandInfo.length) {
                AwardDataVec;
            }

            return {
                ...plate,
                uuid: uuid(),
                RoundWin,
                PlateSymbolExtend,
                AwardDataVec,
            };
        });
        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = processFreeQueue(gameData.RoundQueue, gameId);

    if (gameData.RoundQueue?.length > 1) {
        gameData.isFree = true;
    } else {
        gameData.isFree = false;
    }

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

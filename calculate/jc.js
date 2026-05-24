import { jiliAsset } from '@/utils/assets';
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol${id}.webp`) : "";

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
    // 1?? 顶行（上横线）
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ],

    // 2?? 中行（中横线）
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
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
            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        })
    );
}

/**
 * 根据列倍率生成对应的图片数组结构
 * @param {number[]} wildColumnMult - 每列的倍率数组，例如 [0, 1, 12, 0, 123]
 * @returns {Array<Array<string>>} 返回二维数组，每一列对应一组图片
 */
function buildWildColumnImages(gameId, wildColumnMult) {
    return wildColumnMult.map((column, index) => {
        // column 是一个数组，例如 [0, 0, 7800]
        return column.map(value => {
            if (value > 0) {
                // 拆分数字为字符数组，例如 7800 → ['7', '8', '0', '0']
                const digits = String(value).split("");
                const prefix = index === 1 ? "red_num_" : "brown_num_";

                return digits.map(d => buildNumImageUrl(gameId, prefix + d));
            } else {
                return [];
            }
        });
    });
}

function validateLineOnPlate(plateSymbol, lineCells, symbolId) {
    // 将 lineCells 转换为带 symbolId 的数组
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Col[p.row],
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

function updateSymbolByMul(Mul, Symbol) {
    Mul.forEach((item, i) => {
        // 跳过索引为1的数据对象
        if (i === 1) return;

        item.Col.forEach((value, j) => {
            if (value > 0 && Symbol[i] && Symbol[i].Col) {
                if (value === 15) {
                    Symbol[i].Col[j] = "_11_mini";
                } else if (value === 25) {
                    Symbol[i].Col[j] = "_11_minor";
                } else if (value === 100) {
                    Symbol[i].Col[j] = "_11_major";
                } else if (value === 1000) {
                    Symbol[i].Col[j] = "_11_grand";
                } else {
                    Symbol[i].Col[j] = 10;
                }
            }
        });
    });
    return Symbol;
}

function getValueByGlobalIndex(symbol, globalIndex) {
    const colIndex = Math.floor(globalIndex / 3); // 计算是第几个Col
    const localIndex = globalIndex % 3; // 计算在Col中的局部索引

    if (colIndex < symbol.length) {
        return symbol[colIndex].Col[localIndex];
    }
    return undefined; // 超出范围
}

function processFreeQueue(gameData, gameId, isFree, bet) {
    const len = gameData.RoundQueue.length;
    const plates = gameData.RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let PlateSymbol = roundData.FinalSymbol;

        const Mul = roundData.FinalMul;
        let MultImages = [];
        let result = [];
        const hasPositive = Mul.some(item => item.Col.some(value => value > 0));
        if (hasPositive) {
            result = Mul.map(item => item.Col.map(value => value * bet));
            MultImages = buildWildColumnImages(gameId, result);

            PlateSymbol = updateSymbolByMul(Mul, PlateSymbol);
        }

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        let AwardDataVec = [];
        if (isFree) {
            if (roundIndex == len - 1) {
                Mul.forEach((item, index) => {
                    if (index === 1) {
                        item.Col.forEach((value, vIn) => {
                            if (value > 0) {
                                const symbol = PlateSymbol[index].Col[vIn];

                                AwardDataVec.push({
                                    uuid: uuid(),
                                    Win: result[index][vIn],
                                    Img: buildSymbolImageUrl(gameId, symbol),
                                    list: [[], [vIn], []],
                                });
                            }
                        });
                    }
                });
            }
        } else {
            AwardDataVec = (roundData.AwardDataVec || []).map(award => {
                const { Index = 0, Win = 0, Pos = 0 } = award;
                const AwardSymbol = getValueByGlobalIndex(PlateSymbol, Pos);
                if (AwardSymbol === 12) {
                    return {
                        ...award,
                        uuid: uuid(),
                        Img: buildSymbolImageUrl(gameId, AwardSymbol),
                        list: [[], [Pos % 3], []],
                    };
                } else {
                    let awardsDetail = [];
                    let line = getLineByIndex(Index);

                    awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, AwardSymbol) : [];

                    return {
                        ...award,
                        uuid: uuid(),
                        Img: buildSymbolImageUrl(gameId, AwardSymbol),
                        list: generateHighlightListFromWinning(awardsDetail),
                    };
                }
            });
        }

        return {
            ...roundData,
            isFrist,
            MultImages,
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
export function processGameData(gameData, gameId, bet) {
    const isFree = gameData.RoundQueue.length > 1;
    const rounds = processFreeQueue(gameData, gameId, isFree, bet);

    return {
        ...gameData,
        isFree,
        uuid: uuid(),
        rounds,
    };
}

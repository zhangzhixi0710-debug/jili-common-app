import { jiliAsset } from '@/utils/assets';
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol${id}.webp`) : "";
const buildNumImageUrl = (num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/number_3/${num}.webp`) : "";
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

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(Bet, digits) {
    const result = digits.map(item =>
        item.Col.map(num => {
            const val = num * Bet;
            if (val > 0 && val < 1) {
                const decimal = String(val).split(".")[1];
                const parts = [0, "dot", Number(decimal)];
                return parts.map(p => buildNumImageUrl(p));
            } else if (val > 9) {
                const parts = String(val).split("").map(Number);
                return parts.map(p => buildNumImageUrl(p));
            } else if (val > 0) {
                return [buildNumImageUrl(val)];
            }
            return val;
        })
    );
    return result;
}

function processFreeQueue(gameData, gameId, Bet) {
    const plates = gameData.RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let Mul = roundData.FinalMul;
        let PlateSymbol = roundData.FinalSymbol;

        roundData.Mul.forEach((item1, index1) => {
            item1.Col.forEach((value1, index2) => {
                // 根据 value1 的值修改
                if (value1 === 15) {
                    item1.Col[index2] = 0;

                    PlateSymbol[index1].Col[index2] = "_11_mini";
                } else if (value1 === 25) {
                    item1.Col[index2] = 0;

                    PlateSymbol[index1].Col[index2] = "_11_minor";
                } else if (value1 === 100) {
                    item1.Col[index2] = 0;

                    PlateSymbol[index1].Col[index2] = "_11_major";
                } else if (value1 === 1000) {
                    item1.Col[index2] = 0;

                    PlateSymbol[index1].Col[index2] = "_11_grand";
                }
            });
        });

        let PlateSymbolNumImg = getSymbolImages(Bet, Mul);

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const filteredData = roundData.AwardDataVec.filter(item => !item.hasOwnProperty("Pos"));

        const AwardDataVec = (filteredData || []).map(award => {
            const { Index = 0, Win = 0, Symbol = 0 } = award;
            let awardsDetail = [];
            let line = getLineByIndex(Index);

            awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, Symbol) : [];

            const Img = buildSymbolImageUrl(gameId, Symbol);

            return {
                Index: Index + 1,
                uuid: uuid(),
                Win,
                Img,
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            PlateSymbolNumImg,
            PlateSymbolExtend,
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId, Bet) {
    const rounds = processFreeQueue(gameData, gameId, Bet);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

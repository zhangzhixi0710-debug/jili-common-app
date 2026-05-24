import { jiliAsset } from '@/utils/assets';
const WILD_ID = [6];
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) => {
    try {
        return id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_0${id}.webp`) : "";
    } catch (error) {
        return "";
    }
};

const buildNumImageUrl = (num = 0) =>
    num || num === 0
        ? jiliAsset(`images/intro/number_2/${num == "." ? "dot" : num}.webp`)
        : "";

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
    ],
    // Line 2
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
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

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row =>
        row.Row.map(item => buildSymbolImageUrl(gameId, item, row.Length))
    );
}
function generateHighlightListFromWinning(winningCells) {
    debugger;
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

/**
 * 将二维数组中 >=10 的数字拆分成每位数组
 * @param {Array<Array<number>>} matrix - 二维数组
 * @returns {Array<Array<number|Array<number>>>}
 */
function splitMatrixValues(matrix) {
    return matrix.map(matrix => {
        return matrix.map(value => {
            if (value > 0) {
                const digits = String(value).split("");
                const imageUrls = [
                    ...digits.map(digit => {
                        return buildNumImageUrl(digit);
                    }),
                ];

                return imageUrls;
            } else {
                return "";
            }
        });
    });
}

function validateLineOnPlate(plateSymbol, lineCells) {
    // 原有的 WILD/普通符号连线逻辑
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
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

    return matchedCells.length >= 3
        ? {
              list: matchedCells,
              odds: targetId,
          }
        : {};
}

function processFreeQueue(freeInfo, bet, gameId) {
    if (freeInfo.GetBonus) {
        freeInfo.isBonus = true;
    }

    let len = freeInfo.PlateSymbol.length;
    if (len > 1) {
        let vecLen = freeInfo.AwardDataVec.length;
        let marginLen = len - vecLen;

        for (let i = 0; i < marginLen; i++) {
            freeInfo.AwardDataVec.splice(vecLen - 1 + i, 0, "");
        }

        let woLen = freeInfo.WildOdd.length;
        marginLen = len - woLen;
        let lastItem = freeInfo.WildOdd.slice(-1)[0];

        for (let i = 0; i < marginLen; i++) {
            freeInfo.WildOdd.splice(woLen + i, 0, lastItem);
        }

        let multLen = freeInfo.BigMult.length;
        marginLen = len - multLen;
        lastItem = freeInfo.BigMult.slice(-1)[0];

        for (let i = 0; i < marginLen; i++) {
            freeInfo.BigMult.splice(multLen + i, 0, lastItem);
        }
    }

    return [freeInfo].map(roundData => {
        let ComboStageData = roundData.PlateSymbol || [];

        const plates = ComboStageData.map((plate, index) => {
            const ComboStageSymbol = plate.Col;
            const Vec = roundData.AwardDataVec[index] ? roundData.AwardDataVec[index].ADV : [];
            const WO = roundData.WildOdd[index] ? roundData.WildOdd[index].WO : [];

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const WOMatrix = WO.map(value => value * bet) // 乘以bet
                .reduce((acc, _, i, arr) => {
                    if (i % 3 === 0) acc.push(arr.slice(i, i + 3));
                    return acc;
                }, []);

            const MultImages = splitMatrixValues(WOMatrix);

            const AwardDataVec = Vec.map((award, idx) => {
                const { Line = 0, Win = 0, Symbol = 0 } = award;
                const line = getLineByIndex(Line);
                let total = 0;

                line.forEach(item => {
                    if (WOMatrix?.[item.col]?.[item.row]) {
                        total += WOMatrix[item.col][item.row];
                    }
                });

                const { list } = line ? validateLineOnPlate(ComboStageSymbol, line) : {};

                return {
                    Index: Line + 1,
                    uuid: uuid(),
                    Win: Win,
                    img: buildSymbolImageUrl(gameId, Symbol),
                    list: list ? generateHighlightListFromWinning(list) : [],
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                isLast: index === ComboStageData.length - 1,
                MultImages,
                Mult: roundData.BigMult[index],
                AwardDataVec,
                PlateSymbolExtend,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, bet, gameId) {
    let rounds = gameData ? processFreeQueue(gameData, bet, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

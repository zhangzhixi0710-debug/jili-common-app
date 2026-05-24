import { jiliAsset } from '@/utils/assets';
const WILD_ID = [0, 8, 9];
const BAR = [4, 5, 6];
const SEVEN = [2, 3];
const EMPTY_ID = 7;
const DIFFERENCE = 1

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
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 2
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 3
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
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
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 7
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 8
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 9
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 10
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
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
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 13
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 14
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 15
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 16
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 18
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 19
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 20
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 24
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 25
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 26
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 27
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 29
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 30
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
];

/**
 * 中奖符号对应计算倍率
 */
const PAYTABLEAMOUNT = {
    // 2x 可为任意符号
    // 2x 普通符号或符号7（中奖符号一致：中奖个数为2x符号加上中奖符号，且对应倍数结果乘以2；中奖符号不一致时：中奖个数为ANY的匹配个数加上2x的个数之和的倍率*，亲切结果乘以2）
    0: {
        1: 2,
        2: 4,
        3: 8,
        4: 16,
    },
    // 金色7（中奖情况最小2个从左到右相连符号中奖）
    2: {
        2: 0.2,
        3: 0.6,
        4: 1.8,
        5: 6,
    },
    // 银色7（中奖情况最小2个从左到右相连符号中奖）
    3: {
        2: 0.2,
        3: 0.5,
        4: 1.5,
        5: 5,
    },
    // 3Bar（中奖情况最小3个从左到右相连符号中奖）
    4: {
        3: 0.4,
        4: 1.2,
        5: 4,
    },
    // 2Bar（中奖情况最小3个从左到右相连符号中奖）
    5: {
        3: 0.3,
        4: 0.9,
        5: 3,
    },
    // 1Bar（中奖情况最小3个从左到右相连符号中奖）
    6: {
        3: 0.2,
        4: 0.6,
        5: 2,
    },
    //  ANY中奖符号7（包含金色7或银色7，非普通符号）
    8: {
        3: 0.3,
        4: 0.9,
        5: 3,
    },
    // ANY中奖普通符号（非金色7和银色7）不一致时
    9: {
        3: 0.1,
        4: 0.3,
        5: 1,
    },
};

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) => {
        return Array.from({ length: 3 }, (_, col) => {
            if (plateSymbol[row].row[col].symbol === EMPTY_ID) {
                return "";
            }

            return buildSymbolImageUrl(gameId, plateSymbol[row].row[col].symbol);
        });
    });
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].row[p.row].symbol || 0,
        isConnect: plateSymbol[p.col].row[p.row].isConnect,
    }));

    const matchedCells = [];

    const first = cellsWithId[0];

    // ?? 确定目标符号
    let targetId = null;
    let isWildTarget = false;

    if (WILD_ID.includes(first.symbolId)) {
        // ?? 如果第一个是 WILD / ANY / 7
        isWildTarget = true;
    } else {
        if (BAR.includes(first.symbolId)) targetId = BAR;
        if (SEVEN.includes(first.symbolId)) {
            targetId = SEVEN
            isWildTarget = true;
        };
    }

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];

        const isMatch =
            WILD_ID.includes(c.symbolId) ||
            (targetId && targetId.includes(c.symbolId) && c.isConnect);

        if (i === 0) {
            if (!isMatch) return [];
        }

        if (isMatch) {
            matchedCells.push(c);
        } else {
            break;
        }
    }

    // ?? 动态最小数量
    const minCount = isWildTarget ? 2 : 3;

    return matchedCells.length >= minCount ? matchedCells : [];
}

/**
 * 计算单条中奖线金额（支持 BONUS）
 * @param {Array} line
 * @param {Array} column
 * @param {Number} bet
 * @param {Number} [bonusAmount] - 如果是BONUS，直接返回该值
 */
function calcLineAmount(line, column, bet, bonusAmount) {
    const getSymbol = (colIndex, rowIndex) => {
        const s = column[colIndex]?.row[rowIndex]?.symbol;
        return s === undefined ? 0 : s; // undefined → 2x
    };

    const isEmpty = (s) => s === 7;
    const isBonus = (s) => s === 1;
    const isWild = (s) => s === 0;
    const isSeven = (s) => s === 2 || s === 3;

    let symbols = [];
    let hasBonus = false;

    // ? 收集 symbol
    for (let col = 0; col < line.length; col++) {
        const rows = line[col];
        if (!rows.length) continue;

        const s = getSymbol(col, rows[0]);

        if (isBonus(s)) {
            hasBonus = true;
        }

        if (!isEmpty(s) && !isBonus(s)) {
            symbols.push(s);
        }
    }

    // ? 如果是 BONUS，直接返回
    if (hasBonus && bonusAmount !== undefined) {
        return bonusAmount;
    }

    if (symbols.length < 2) return 0;

    const wildCount = symbols.filter(isWild).length;
    const normal = symbols.filter(s => !isWild(s));

    let payKey;

    if (normal.length === 0) {
        payKey = 0;
    } else {
        const unique = [...new Set(normal)];

        if (unique.length === 1) {
            payKey = unique[0];
        } else if (normal.every(isSeven)) {
            payKey = 8;
        } else {
            payKey = 9;
        }
    }

    const count = symbols.length;
    const rate = PAYTABLEAMOUNT[payKey]?.[count];

    if (!rate) return 0;

    return rate * Math.pow(2, wildCount) * bet;
}


function validateBonusOnPlate(plateSymbol) {
    // ? 检查整个牌面上 DIFFERENCE 的位置
    const diffCells = [];
    plateSymbol.forEach((colObj, colIndex) => {
        colObj.row.forEach((val, rowIndex) => {
            if (val.symbol === DIFFERENCE) {
                diffCells.push({ col: colIndex, row: rowIndex, symbolId: val.symbol });
            }
        });
    });

    // ? 如果 DIFFERENCE 数量 >= 3，直接算中奖，返回相同结构
    if (diffCells.length) {
        return diffCells;
    }

    return []
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function processFreeQueue(gameData, gameId, bet) {
    const plate = gameData.plate
    const isFree = plate.length > 1
    const plates = plate.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        const PlateSymbol = roundData.column.map(item => ({
            row: item.row.slice(1, -1)
        }))

        let RoundWin = roundData.win;
        const AwardDataVec = []
        if (RoundWin) {
            for (let index = 0; index < PAYLINES.length; index++) {
                const item = PAYLINES[index];

                const awardsDetail = validateLineOnPlate(PlateSymbol, item);

                if (!awardsDetail.length) {
                    continue
                }

                const list = generateHighlightListFromWinning(awardsDetail)

                AwardDataVec.push({
                    Index: index + 1,
                    uuid: uuid(),
                    Win: calcLineAmount(list, PlateSymbol, bet),
                    list
                })
            }
        }

        if ((isFree && isFrist) || roundData.gold?.barWin) {
            const awardsDetail = validateBonusOnPlate(PlateSymbol)

            if (awardsDetail.length) {
                AwardDataVec.push({
                    uuid: uuid(),
                    Win: roundData.gold?.barWin || 0,
                    img: buildSymbolImageUrl(gameId, DIFFERENCE),
                    list: generateHighlightListFromWinning(awardsDetail),
                })
            }

            RoundWin = roundData.win - roundData.gold?.barWin;
        }

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId)

        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            BarWin: roundData.gold?.barWin,
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });

    const gameLen = plate.length
    if (gameLen > 1) {
        const firstPrice = plate[1].gold?.barWin || 0
        const totalGoldPrice = plate.reduce((total, item) => total + item.gold.barWin, 0)

        plates.splice(1, 0, {
            firstPrice,
            totalGoldPrice,
            getFreeSpins: gameLen - 1
        })
    }

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId, bet) {
    const rounds = processFreeQueue(gameData, gameId, bet);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

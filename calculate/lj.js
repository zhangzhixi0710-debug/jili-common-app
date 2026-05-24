import { jiliAsset } from '@/utils/assets';
const WILD_ID = [6];
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

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
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

/**
 * 将一维数组按指定列数分组为二维数组，并对每个值进行可选处理
 * @param {Array<number>} arr - 原始一维数组
 * @param {number} columns - 每行的列数
 * @param {function} [transformFn] - 可选的转换函数（如 v => v * 100）
 * @returns {Array[]} 二维数组
 */
function toMatrix(arr, columns, transformFn = v => v) {
    const result = [];
    for (let i = 0; i < arr.length; i += columns) {
        result.push(arr.slice(i, i + columns).map(transformFn));
    }
    return result;
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

function processFreeQueue(freeInfo, row, gameId) {
    if (freeInfo.GetBonus) {
        freeInfo.isBonus = true;
    } else {
        freeInfo.PlateSymbol = freeInfo.PlateSymbol.slice(-1);
    }
    freeInfo = [freeInfo];
    return freeInfo.map(roundData => {
        let ComboStageData = roundData.PlateSymbol || [];

        let PlateSymbolNum = [];
        if (roundData.WildWin) {
            const multMatrix = toMatrix(roundData.WildOdd, 3, v => v * row.Bet);
            PlateSymbolNum = splitMatrixValues(multMatrix);
        }

        const plates = ComboStageData.map((plate, index) => {
            const ComboStageSymbol = plate.Col;

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            return {
                ...plate,
                uuid: uuid(),
                isLast: index === ComboStageData.length - 1,
                PlateSymbolExtend,
                PlateSymbolNum,
            };
        });

        const PlateSymbol = ComboStageData.slice(-1)[0].Col;

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win = 0, Symbol = 0 } = award;
            const line = getLineByIndex(Line);

            const { list } = line ? validateLineOnPlate(PlateSymbol, line) : {};

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: buildSymbolImageUrl(gameId, Symbol),
                list: generateHighlightListFromWinning(list),
            };
        });

        if (plates.length && AwardDataVec.length) {
            plates[plates.length - 1].AwardDataVec = AwardDataVec;
        }

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
export function processGameData(gameData, row, gameId) {
    let rounds = gameData ? processFreeQueue(gameData, row, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

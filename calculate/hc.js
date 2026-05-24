import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;

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
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 7
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 8
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 10
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 11
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 12
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 14
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 15
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
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
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 23
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 24
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 25
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
];

// ==========================================
// 辅助函数

function getLineByIndex(index) {
    return PAYLINES[index];
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

function generateComboStageData(ComboStageSymbol) {
    return ComboStageSymbol.map(item => [...item]);
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col][p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => c.symbolId !== WILD_ID);
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

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

/**
 * 将一维数组转换为指定维度的嵌套数组
 * @param {Array} arr - 原始一维数组
 * @param {number} rows - 行数
 * @param {number} cols - 列数
 * @returns {Array} 转换后的二维数组
 */
function convertToMatrix(arr, rows = 5, cols = 3) {
    // 检查数组长度是否足够
    if (arr.length < rows * cols) {
        console.warn(`数组长度不足: 需要 ${rows * cols} 个元素，实际只有 ${arr.length} 个`);
    }

    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const start = i * cols;
        const end = start + cols;
        matrix.push(arr.slice(start, end));
    }
    return matrix;
}

function processFreeQueue(freeInfo, gameId) {
    let AllFreePlateDataPerRoundVec = freeInfo.AllFreePlateDataPerRoundVec || [];
    let RoundQueue = [
        {
            FreePlateDataVec: [freeInfo.PlateData],
        },
        ...AllFreePlateDataPerRoundVec,
    ];

    return RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const FreePlateDataVec = roundData.FreePlateDataVec || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = FreePlateDataVec.map(plate => {
            const PlateVec = convertToMatrix(plate.PlateVec);
            const ComboStageSymbol = generateComboStageData(PlateVec);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const LineAwardDataVec = plate.LineAwardInfo?.LineAwardDataVec;

            const AwardDataVec = (LineAwardDataVec || []).map(award => {
                const { LineIndex = 0, Win = 0 } = award;

                const line = getLineByIndex(25 - LineIndex);

                const awardsDetail = line ? validateLineOnPlate(ComboStageSymbol, line).cells : [];

                console.log(line, awardsDetail)

                RoundWin = Win || 0;

                return {
                    ...award,
                    uuid: uuid(),
                    line: JSON.stringify(line),
                    Index: LineIndex - 1,
                    list: awardsDetail?.length
                        ? generateHighlightListFromWinning(awardsDetail)
                        : undefined,
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                AwardDataVec,
            };
        });

        return {
            ...roundData,
            isFrist,
            RoundWin,
            uuid: uuid(),
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = processFreeQueue(gameData, gameId);

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

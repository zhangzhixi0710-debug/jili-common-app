import { jiliAsset } from '@/utils/assets';
const WILD_ID = 6;

export const buildSymbolImageUrl = (gameId, id) => {
    try {
        return id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";
    } catch (error) {
        return "";
    }
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
    // 1?? 中行（中横线）
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ],

    // 2?? 顶行（上横线）
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
    return plateSymbol.map(row => row.Row.map(item => buildSymbolImageUrl(gameId, item)));
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    const targetCell = cellsWithId.find(c => WILD_ID !== c.symbolId);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        const currentId = c.symbolId;

        // ? 符号匹配（目标符号 或 百搭）
        if (currentId === targetId || WILD_ID === currentId) {
            matchedCells.push(c);
        } else {
            if (matchedCells.length >= 2) {
                return matchedCells;
            }
            matchedCells = [];
        }
    }

    if (matchedCells.length >= 2) {
        return matchedCells;
    }

    return [];
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

/**
 * 找出图标对象中最多图标的值并生成新的对象
 * @param {*} data
 * @returns
 */
function generateLast(data) {
    const frequency = {};

    data.forEach(item => {
        item.Row.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
        });
    });

    // 找出出现次数最多的值
    let maxValue = null;
    let maxCount = 0;

    Object.entries(frequency).forEach(([value, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxValue = parseInt(value);
        }
    });

    // 2. 生成新的数据结构
    const newData = data.map(item => ({
        Row: item.Row.map(() => maxValue),
    }));

    return {
        Col: newData,
    };
}

function processFreeQueue(gameData, gameId) {
    let RoundQueue = [];
    const isOne = gameData.PlateSymbol.length === 1;
    if (isOne) {
        gameData.PlateSymbol = gameData.PlateSymbol.map(item => item.Col)[0];

        RoundQueue.push(gameData);
    } else {
        const last = generateLast(gameData.PlateSymbol[gameData.PlateSymbol.length - 1].Col);

        gameData.PlateSymbol.push(last);

        for (let index = 0; index < gameData.PlateSymbol.length; index++) {
            const element = gameData.PlateSymbol[index];

            if (index === 0) {
                RoundQueue.push({
                    Extra: gameData.Extra,
                    PlateSymbol: element.Col,
                });

                continue;
            }

            if (index === gameData.PlateSymbol.length - 1) {
                RoundQueue.push({
                    Mult: gameData.Mult,
                    GetBonus: gameData.GetBonus,
                    AwardDataVec: gameData.AwardDataVec,
                    PlateSymbol: element.Col,
                });
            } else {
                RoundQueue.push({
                    PlateSymbol: element.Col,
                });
            }
        }
    }

    const plates = RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let RoundWin = 0;
        let PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const { Line = 0, Win = 0, Symbol = 0 } = award;
            const img = buildSymbolImageUrl(gameId, Symbol);
            let line = getLineByIndex(Line);

            let awardsDetail = line ? validateLineOnPlate(PlateSymbol, line) : [];

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img,
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

    return [
        {
            plates: plates,
        },
    ];
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

import { jiliAsset } from '@/utils/assets';
// 百搭符号
const WILD_ID = [0, 11];
// 特殊百搭符号
const SCATTER = 1;
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

const buildNumFGImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/symbol_num_1_${num}.webp`) : "";

const buildNumMGImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/symbol_num_C_${num}.webp`) : "";

// uuid
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
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
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
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 6
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 7
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 8
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 9
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 10
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 11
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 12
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 13
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 14
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 15
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
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
        { col: 2, row: 0 },
        { col: 3, row: 0 },
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
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 20
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 23
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 24
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 25
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 26
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 27
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 29
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 30
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 31
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 32
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 33
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 34
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 35
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 36
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 37
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 38
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 39
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 40
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 41
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 42
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 43
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 44
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 45
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 46
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 47
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 48
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 49
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 50
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
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

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].row[p.row].symbol,
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => !WILD_ID.includes(c.symbolId));
    const targetId = targetCell ? [targetCell.symbolId] : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (targetId.includes(c.symbolId) || WILD_ID.includes(c.symbolId)) {
            matchedCells.push({ ...c });
            count++;
        } else {
            // 遇到不匹配就中断，如果当前累计>=3，直接返回中奖
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

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(gameId, digits) {
    const result = digits.map(item =>
        item.row.map(it => {
            const val = it.value
            if (val) {
                const parts = String(val).split("").map(Number);
                if (it.symbol === 1) {
                    return parts.map(p => buildNumFGImageUrl(gameId, p));
                } else {
                    return parts.map(p => buildNumMGImageUrl(gameId, p));
                }
            }
        })
    );
    return result;
}

function getContinuousSymbolFromStart(plateSymbol, minCount = 3) {
    let totalCount = 0;

    // 每列中 symbol === SCATTER 的索引
    const indicesPerCol = plateSymbol.map(colObj => {
        const indices = colObj.row
            .map((item, idx) => (item.symbol === SCATTER ? idx : -1))
            .filter(idx => idx !== -1);
        totalCount += indices.length;
        return indices;
    });

    // 总出现次数未达到要求
    if (totalCount < minCount) return [];

    // 否则返回每列索引
    return indicesPerCol;
}

export function processFreeGameData(Plates = {}, gameId) {
    const isFree = Plates.plate.length > 1;
    const data = Plates.plate.map((item, index) => {
        let RoundWin = 0;
        // 盘面数据
        const plateSymbol = item.column;

        const PlateSymbolExtend = [];

        for (let col = 0; col < plateSymbol.length; col++) {
            const colSymbols = [];
            for (let row = 0; row < plateSymbol[col].row.length; row++) {
                const symbolId = plateSymbol[col].row[row];
                colSymbols.push(buildSymbolImageUrl(gameId, symbolId.symbol));
            }
            PlateSymbolExtend.push(colSymbols);
        }

        const PlateSymbolNumImg = getSymbolImages(gameId, plateSymbol);

        let AwardDataVec = item.award.map((award, idx) => {
            const { line = 0, win = 0 } = award;
            const lines = getLineByIndex(line);

            const { list, odds } = lines ? validateLineOnPlate(plateSymbol, lines) : [];

            RoundWin += win;

            return {
                ...award,
                uuid: uuid(),
                win,
                Index: line + 1,
                list: generateHighlightListFromWinning(list),
            };
        });

        let DefaultAwardDataVec = null

        if (isFree && index === 0) {
            DefaultAwardDataVec = getContinuousSymbolFromStart(plateSymbol);

            AwardDataVec.push({
                uuid: uuid(),
                isDefault: true,
                img: buildSymbolImageUrl(gameId, SCATTER),
                list: DefaultAwardDataVec,
            });
        }

        return {
            ...item,
            PlateSymbolNumImg,
            PlateSymbolExtend,
            AwardDataVec,
            RoundWin: item.win,
            uuid: uuid(),
        };
    });
    
    const result = [];
    data.forEach(item => {
        result.push({
            AddRounds: data.length - 1,
            plates: [item],
            uuid: uuid(),
        });
    });
    return {
        uuid: uuid(),
        MainInfo: result[0],
        rounds: result.slice(1),
    };
}

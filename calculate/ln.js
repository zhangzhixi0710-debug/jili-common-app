import { jiliAsset } from '@/utils/assets';
const WILD_ID = [6, 7, 8, 9];

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";

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
        { col: 4, row: 0 },
    ],
    // Line 2
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 3
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 5
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 6
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 7
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 8
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 10
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 11
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 12
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 13
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 14
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 15
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 16
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 17
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 18
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 19
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 20
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 24
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 25
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 26
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 27
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 28
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 29
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 30
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 31
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 32
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 33
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 34
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 35
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 36
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 37
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 38
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 39
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 40
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
        { col: 4, row: 0 },
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

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Row[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, lineCells, symbolIdCheck) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    let matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        const currentId = c.symbolId;

        // ? 符号匹配（目标符号 或 百搭）
        if (currentId === symbolIdCheck || WILD_ID.includes(currentId)) {
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

function processRoundQueue(RoundQueue) {
    let AddNewData = {};
    for (let i = 0; i < RoundQueue.length; i++) {
        // 第一个元素标记为主回合
        if (i === 0) {
            RoundQueue[i].isMain = true;
            RoundQueue[i].isTip = true;
        }

        // 如果存在 TransformSymbols，则插入一个新对象
        if (RoundQueue[i].TransformSymbols?.length) {
            AddNewData = {
                PlateSymbol: RoundQueue[i].PlateSymbolReal,
                AwardDataVec: RoundQueue[i].AwardDataVec,
                RoundWin: RoundQueue[i].RoundWin,
                isMain: i === 0,
            };

            // Receive free games提示显示
            if (i === 0) {
                delete RoundQueue[i].isTip;
                AddNewData.isTip = true;
            }

            RoundQueue.splice(i + 1, 0, AddNewData);

            // 删除原对象中多余字段
            delete RoundQueue[i].AwardDataVec;
            delete RoundQueue[i].RoundWin;

            // 跳过刚插入的元素
            i++;
        }
    }

    return RoundQueue;
}

function processFreeQueue(gameData, gameId) {
    const RoundQueue = processRoundQueue(gameData.RoundQueue);

    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const { Line = 0, Win = 0, Symbol = 0 } = award;
            const line = getLineByIndex(Line);

            const awardsDetail = line ? validateLineOnPlate(PlateSymbol, line, Symbol) : [];

            RoundWin += Win || 0;

            return {
                Index: Line + 1,
                uuid: uuid(),
                Win,
                img: buildSymbolImageUrl(gameId, Symbol),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
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
    const rounds = gameData?.RoundQueue ? processFreeQueue(gameData, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

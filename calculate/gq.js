import { jiliAsset } from '@/utils/assets';
const WILD_ID = [11, 12, 13];
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

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
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
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
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 5
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 6
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 7
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 8
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 9
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 10
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 11
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 12
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
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
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 16
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 17
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 18
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 19
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 20
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 24
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 25
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 26
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 27
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 29
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 30
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 31
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 32
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 33
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 34
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 35
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 36
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 37
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 38
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 39
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 40
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
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
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Row[col]);
        })
    );
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function validateLineOnPlate(plateSymbol, lineCells) {
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

// ==========================================
// MainGame + FreeQueue 处理
// ==========================================
function processMainGame(MainGame, gameId) {
    const MainPlate = MainGame ? [MainGame] : [];
    const plates = MainPlate.map(roundData => {
        let RoundWin = 0;

        const PlateSymbolExtend = generatePlateSymbolExtend(roundData.LastPlate, gameId);
        
        const AwardDataVec = (roundData.AwardDataList || []).map((award, idx) => {
            const { Money, Index = 0 } = award;
            
            RoundWin += Money || 0;

            const line = getLineByIndex(Index);

            const awardsDetail = line ? validateLineOnPlate(roundData.LastPlate, line).cells : [];

            award.Index = Index + 1;

            return {
                ...award,
                uuid: uuid(),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataList: sortByIndex(AwardDataVec),
        };
    });
    return {
        ...MainGame,
        uuid: uuid(),
        plates,
    };
}

function processFreeQueue(freeInfo, gameId) {
    const FreeQueue = freeInfo.FreeQueue || [];
    return FreeQueue.map(roundData => {
        let RoundWin = 0;
        const uid = uuid();
        const FreePlate = [roundData.FreePlate] || [];

        const plates = FreePlate.map(plate => {
            const PlateSymbolExtend = generatePlateSymbolExtend(plate.LastPlate, gameId);

            let AwardDataList = (plate.AwardDataList || []).map((award, idx) => {
                const { Money, Index = 0 } = award;
                
                RoundWin += Money || 0;

                const line = getLineByIndex(Index);

                const awardsDetail = line ? validateLineOnPlate(plate.LastPlate, line).cells : [];

                award.Index = Index + 1;

                return {
                    ...award,
                    uuid: uuid(),
                    list: generateHighlightListFromWinning(awardsDetail),
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                AwardDataList: sortByIndex(AwardDataList),
            };
        });
        return {
            ...roundData,
            uuid: uid,
            RoundWin,
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const MainInfo = gameData.MainPlate ? processMainGame(gameData.MainPlate, gameId) : [];
    const rounds = gameData?.FreeInfo ? processFreeQueue(gameData.FreeInfo, gameId) : null;
    if (gameData?.FreeInfo?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeInfo.FreeTotalWin;
    
    return {
        ...gameData,
        uuid: uuid(),
        MainInfo,
        rounds,
    };
}

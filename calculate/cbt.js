import { jiliAsset } from '@/utils/assets';
const WILD_ID = [8, 9, 10, 11];
const EMPTY_ID = 0;
const DIFFERENCE = 5

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
const PAYLINES =
    // Line 1
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ]

function generateHighlightListFromWinning(winningCells = []) {
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 3 }, (_, row) => {
        return Array.from({ length: 3 }, (_, col) => {
            if (plateSymbol[row].Col[col] === EMPTY_ID) {
                return "";
            }

            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        });
    });
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Col[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => !WILD_ID.includes(c.symbolId));
    const targetId = targetCell ? [targetCell.symbolId] : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        matchedCells.push({ ...c });
        count++;
    }

    return matchedCells;
}


function validateBonusOnPlate(plateSymbol) {
    // ? 检查整个牌面上 DIFFERENCE 的位置
    const diffCells = [];
    plateSymbol.forEach((colObj, colIndex) => {
        colObj.Col.forEach((val, rowIndex) => {
            if (val === DIFFERENCE) {
                diffCells.push({ col: colIndex, row: rowIndex, symbolId: val });
            }
        });
    });

    // ? 如果 DIFFERENCE 数量 >= 3，直接算中奖，返回相同结构
    if (diffCells.length) {
        return diffCells;
    }

    return []
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.AckQueue.map((roundData, index) => {
        const PlateSymbolExtend = generatePlateSymbolExtend(roundData.PlateSymbol, gameId);

        let AwardDataVec = []
        let RoundWin = 0

        if (roundData.SymbolWin || roundData.PoolWin) {
            RoundWin = roundData.SymbolWin || roundData.PoolWin
            const list = validateBonusOnPlate(roundData.PlateSymbol)

            AwardDataVec = [{
                uuid: uuid(),
                Win: RoundWin,
                Index: 1,
                list: generateHighlightListFromWinning(list),
            }];

        } else if (roundData.PlateWin) {
            RoundWin = roundData.PlateWin
            const list = validateLineOnPlate(roundData.PlateSymbol, PAYLINES);

            AwardDataVec = [{
                uuid: uuid(),
                Win: roundData.PlateWin,
                Index: 1,
                list: generateHighlightListFromWinning(list),
            }];
        }

        const Pool = roundData.Pool?.reduce((sum, val) => sum + val, 0) > 0;

        return {
            ...roundData,
            Pool: Pool ? roundData.Pool : [],
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: RoundWin,
            AwardDataVec,
        };
    });
    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = gameData?.AckQueue ? processFreeQueue(gameData, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

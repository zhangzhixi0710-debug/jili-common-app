import { jiliAsset } from '@/utils/assets';
const WILD_ID = 4;
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 2 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.Col));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 2 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        })
    );
}

function validateLineOnPlate(plateSymbol, symbol) {
    const matchedCols = [];

    plateSymbol.forEach((colObj, colIndex) => {
        const isMatch = colObj.Col.every(v => v === symbol || v === WILD_ID);
        
        if (isMatch) {
            // 保存中奖列信息
            matchedCols.push({
                col: colIndex,
                Col: colObj.Col,
            });
        }
    });

    // 如果有中奖列则返回结果，否则空对象
    return matchedCols.length > 0 ? matchedCols : [];
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.AckQueue.map((roundData, index) => {
        const PlateSymbolExtend = generatePlateSymbolExtend(roundData.PlateSymbol, gameId);

        const result = (roundData.AwardDataVec || []).map(award => {
            const matchedIndexes = roundData.PlateSymbol.map((colObj, index) => ({
                index,
                isMatch: colObj.Col.every(v => v === award.Symbol || v === WILD_ID),
            }))
                .filter(item => item.isMatch)
                .map(item => item.index);

            return {
                ...award,
                Index: matchedIndexes * 1 + 1,
            };
        });

        const AwardDataVec = result.map((award, idx) => {
            const { Symbol = 0 } = award;

            const list = validateLineOnPlate(roundData.PlateSymbol, Symbol);

            return {
                ...award,
                uuid: uuid(),
                list: generateHighlightListFromWinning(list),
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: roundData.PlateWin.reduce((acc, num) => acc + num, 0),
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

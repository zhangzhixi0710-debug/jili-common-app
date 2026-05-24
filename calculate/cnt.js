import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id ? jiliAsset(`images/intro/${gameId}/Symbol${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 3 }, (_, row) => buildSymbolImageUrl(gameId, plateSymbol[row]));
}

function processFreeQueue(gameData, gameId) {
    const RoundQueue = [gameData] || [];
    const plates = RoundQueue.map(roundData => {
        const PlateSymbol = roundData.PlateSymbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = [];
        if (roundData.TotalWin) {
            AwardDataVec.push({
                uuid: uuid(),
                Win: roundData.TotalWin,
                Index: 1,
                list: [0, 1, 2],
            });
        }

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: roundData.TotalWin,
            AwardDataVec,
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = gameData?.PlateSymbol ? processFreeQueue(gameData, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

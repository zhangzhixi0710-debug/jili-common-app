import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

const buildNumImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/${num}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Col[col] ? "0" : "")
        )
    );
}

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(gameId, digits) {
    const result = digits.map(item =>
        item.Col.map(num => {
            if (num > 0 && num < 1) {
                const decimal = String(num).split(".")[1];
                const parts = [0, "dot", Number(decimal)];
                return parts.map(p => buildNumImageUrl(gameId, p));
            } else if (num > 9) {
                const parts = String(num).split("").map(Number);
                return parts.map(p => buildNumImageUrl(gameId, p));
            } else {
                return [buildNumImageUrl(gameId, num)];
            }
        })
    );
    return result;
}

function processFreeQueue(gameData, gameId) {
    const RoundQueue = gameData.RoundQueue || [];
    const plates = RoundQueue.map((roundData, index) => {
        const PlateSymbol = roundData.Symbol;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);
        const PlateSymbolNumImg = getSymbolImages(gameId, PlateSymbol);

        if (roundData.SpeicalVec?.length) {
            roundData.SpeicalVec.forEach(it => {
                it.img = buildSymbolImageUrl(gameId, it.SPType);
            });
        }

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolNumImg,
            PlateSymbolExtend,
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

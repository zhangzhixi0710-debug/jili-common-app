import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 4 }, (_, col) => {
        if (!plateSymbol[col]) {
            return ''
        }
        return buildSymbolImageUrl(gameId, plateSymbol[col]);
    });
}

const SYMBOL_ALL = [16]
const SYMBOL_SCATTER = [17, 18]
const SYMBOL_X = [11, 12, 13]
const MulObject = {
    11: 'x2',
    12: 'x5',
    13: 'x10'
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.PlateSymbol.map((roundData, index) => {
        const PlateSymbolExtend = generatePlateSymbolExtend(roundData.Symbol, gameId);

        const last = roundData.Symbol.at(-1)


        const AwardDataVec = []
        let MainWin = 0
        let OtherWin = 0
        let type = 0
        let Mul = 0
        if (SYMBOL_ALL.includes(last)) {
            type = 2

            MainWin = gameData.MainWin
            OtherWin = gameData.ReSpinWin

            if (index === 0) {
                AwardDataVec.push({
                    uuid: uuid(),
                    Index: 1,
                    Win: 0
                })
            } else {
                AwardDataVec.push({
                    uuid: uuid(),
                    Index: 1,
                    Win: OtherWin
                })
            }
        } else if (SYMBOL_SCATTER.includes(last)) {
            type = 3

            MainWin = gameData.MainWin
            OtherWin = gameData.WheelWin

            gameData.TotalWin && AwardDataVec.push({
                uuid: uuid(),
                Index: 1,
                Win: gameData.TotalWin
            })
        } else if (SYMBOL_X.includes(last)) {
            type = 4

            MainWin = gameData.MainWin
            Mul = MulObject[last]

            gameData.TotalWin && AwardDataVec.push({
                uuid: uuid(),
                Index: 1,
                Win: gameData.TotalWin
            })
        } else {
            type = 1

            MainWin = gameData.TotalWin

            gameData.TotalWin && AwardDataVec.push({
                uuid: uuid(),
                Index: 1,
                Win: gameData.TotalWin
            })
        }

        return {
            type,
            MainWin,
            OtherWin,
            Mul,
            uuid: uuid(),
            PlateSymbolExtend,
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

import { jiliAsset } from '@/utils/assets';
import { round } from "lodash";

const WILD_ID = 19;
const SYMBOL_SPLIT = 10;

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol${id}.webp`) : "";
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: plateSymbol.length }, (_, row) => {
        return Array.from({ length: plateSymbol[row].Row.length }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Row[col])
        );
    });
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRowsByTag(PlateSymbol, tagdData, idx) {
    const list = [];

    for (let colIndex = 0; colIndex < tagdData.length; colIndex++) {
        const tagRows = tagdData[colIndex]?.Row || [];
        const plateRows = PlateSymbol[colIndex]?.Row || [];

        const winningRows = [];

        for (let rowIndex = 0; rowIndex < tagRows.length; rowIndex++) {
            if (tagRows[rowIndex] === idx) {
                winningRows.push({
                    rowIndex,
                    symbol: plateRows[rowIndex],
                });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        }
    }

    // 只返回 rowIndex 结构（与你原函数保持一致）
    const result = list.map(col => (col ? col.map(item => item.rowIndex) : []));

    const odds = result.reduce((acc, arr) => acc * (arr.length || 1), 1);

    return {
        list: result,
        odds,
    };
}

function processMainGame(MainGame, gameId) {
    const GemInfo = MainGame.GemInfo;
    const PlateQueue = GemInfo.PlateQueue;

    const plates = PlateQueue.map(roundData => {
        const PlateSymbol = roundData.PlateSymbol.map(item => {
            return {
                Row: item.split("").map(Number),
            };
        });
        const tagdData = roundData.PlateTag.map(item => {
            return {
                Row: item.split("").map(Number),
            };
        });

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardInfos || []).map((award, idx) => {
            const img = buildSymbolImageUrl(gameId, award.Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, odds } = calcWinningColumnsRowsByTag(PlateSymbol, tagdData, idx + 1);

            return {
                ...award,
                uuid: uuid(),
                img,
                odds,
                list,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            AwardDataVec,
        };
    });
    return {
        ...MainGame,
        uuid: uuid(),
        RoundWin: GemInfo.GemWin,
        plates,
    };
}

function processFreeQueue(FreeGame, gameId) {
    const FreeQueue = FreeGame.FreeQueue || [];
    return FreeQueue.map((roundData, index) => {
        const FreeGemInfo = roundData.FreeGemInfo;
        const PlateQueue = FreeGemInfo.PlateQueue || [];

        const plates = PlateQueue.map(plate => {
            const reversedData = plate.PlateSymbol.map(item => {
                return {
                    Row: item.split("").map(Number),
                };
            });
            const tagdData = plate.PlateTag.map(item => {
                return {
                    Row: item.split("").map(Number),
                };
            });

            const PlateSymbolExtend = generatePlateSymbolExtend(reversedData, gameId);

            const AwardDataVec = (plate.AwardInfos || []).map((award, idx) => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, odds } = calcWinningColumnsRowsByTag(reversedData, tagdData, idx + 1);

                return {
                    ...award,
                    img,
                    uuid: uuid(),
                    odds,
                    list: list,
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                SingleMul: plate.SingleMul,
                AwardDataVec,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            FreeMul: index === 0 ? FreeGame.FreeMul : undefined,
            RoundWin: roundData.FreeSingleWin,
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const MainGame = gameData ? processMainGame(gameData, gameId) : [];
    const rounds = gameData?.FreeInfo ? processFreeQueue(gameData.FreeInfo, gameId) : null;
    if (gameData?.FreeInfo?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeInfo.FreeTotalWin;

    return {
        ...gameData,
        uuid: uuid(),
        MainGame,
        rounds,
    };
}

import { jiliAsset } from '@/utils/assets';
const WILD_ID = 19;
const SYMBOL_SPLIT = 10;

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Row[col])
        )
    );
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRows(PlateSymbol, awardSymbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        var column = PlateSymbol[colIndex].Row || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex];

            if (
                Symbol === awardSymbol ||
                Symbol === WILD_ID ||
                Symbol === awardSymbol + SYMBOL_SPLIT ||
                Symbol + SYMBOL_SPLIT === awardSymbol
            ) {
                winningRows.push({ rowIndex: rowIndex });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        } else {
            continuous = false; // 中断
        }
    }

    let result = list.map(function (winningRows) {
        if (!winningRows) return [];
        var rowIndexes = [];

        for (var i = 0; i < winningRows.length; i++) {
            rowIndexes.push(winningRows[i].rowIndex);
        }

        return rowIndexes;
    });

    let odds = result.reduce((acc, arr) => acc * arr.length, 1);

    return { list: result, odds: odds };
}

function processMainGame(MainGame, gameId) {
    const FreeGame = MainGame.PlateQueue || [];
    const plates = FreeGame.map((roundData, roundIndex) => {
        let RoundWin = 0;

        const reversedData = roundData.Symbol.map(item => ({
            Row: item.Row.slice().reverse(),
        }));

        const PlateSymbolExtend = generatePlateSymbolExtend(reversedData, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
            const img = buildSymbolImageUrl(gameId, award.Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, odds } = calcWinningColumnsRows(reversedData, award.Symbol);

            RoundWin += award.Win || 0;

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
            RoundWin,
            AwardDataVec,
        };
    });
    return {
        ...MainGame,
        uuid: uuid(),
        plates,
    };
}

function processFreeQueue(FreeGame, gameId) {
    const FreeQueue = FreeGame.FreeQueue || [];
    return FreeQueue.map((roundData, roundIndex) => {
        let RoundWin = 0;
        const uid = uuid();
        const PlateQueue = roundData.PlateQueue || [];

        const plates = PlateQueue.map((plate, plateIndex) => {
            const reversedData = plate.Symbol.map(item => ({
                Row: item.Row.slice().reverse(),
            }));

            const PlateSymbolExtend = generatePlateSymbolExtend(reversedData, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map((award, idx) => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, odds } = calcWinningColumnsRows(reversedData, award.Symbol);

                RoundWin += award.Win || 0;

                return {
                    ...award,
                    img,
                    uuid: uuid(),
                    odds,
                    list: list,
                };
            });
            return {
                uuid: uuid(),
                PlateSymbolExtend,
                SingleMul: plate.SingleMul,
                AwardDataVec,
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
    const MainGame = gameData.MainGame ? processMainGame(gameData.MainGame, gameId) : [];
    const rounds = gameData?.FreeGame ? processFreeQueue(gameData.FreeGame, gameId) : null;
    if (gameData?.FreeGame?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeGame.FreeTotalWin;

    return {
        ...gameData,
        uuid: uuid(),
        MainGame,
        rounds,
    };
}

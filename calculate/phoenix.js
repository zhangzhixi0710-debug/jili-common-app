import { jiliAsset } from '@/utils/assets';
const DIFFERENCE = 11;

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    symbolId || symbolId === 0
        ? jiliAsset(`images/intro/${gameId}/symbol_${symbolId}.webp`)
        : "";
function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

function generateComboStageData(ComboStageSymbol) {
    return ComboStageSymbol.map(item => [...item.Col].reverse());
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} ComboStageSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRows(ComboStageSymbol, awardSymbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < ComboStageSymbol.length && continuous; colIndex++) {
        var column = ComboStageSymbol[colIndex] || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex];

            if (Symbol === awardSymbol || Symbol === DIFFERENCE) {
                winningRows.push({ rowIndex: rowIndex });
            }
        }

        if (awardSymbol === DIFFERENCE) {
            if (winningRows.length) {
                list[colIndex] = winningRows;
            }
        } else {
            if (winningRows.length) {
                list[colIndex] = winningRows;
            } else {
                continuous = false; // 中断
            }
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

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        let BonusWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate, index) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbolChanged);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            let AwardDataVec = [];
            if (index === ComboStageData.length - 1) {
                AwardDataVec = (roundData.AwardDataVec || []).map((award, idx) => {
                    const { Symbol, Pos } = award;

                    const { list, odds } = calcWinningColumnsRows(ComboStageSymbol, Symbol);

                    const Img = buildSymbolImageUrl(gameId, Symbol);

                    return {
                        ...award,
                        uuid: uuid(),
                        img: Img,
                        list: list,
                        Index: odds,
                    };
                });
            }

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                AwardDataVec,
                HeaderImage: [],
            };
        });

        RoundWin = roundData.RoundWin ? roundData.RoundWin : RoundWin;

        return {
            ...roundData,
            isFrist,
            BonusWin,
            RoundWin,
            uuid: uuid(),
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = gameData?.RoundQueue ? processFreeQueue(gameData.RoundQueue, gameId) : null;

    if (gameData.RoundQueue?.length > 1) {
        gameData.isFree = true;
    } else {
        gameData.isFree = false;
    }

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

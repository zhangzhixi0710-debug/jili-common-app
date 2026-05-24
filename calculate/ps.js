import { jiliAsset } from '@/utils/assets';
const WILD_ID = 12;

const HEADER_ID = {
    1: 13,
    2: 14,
    3: 15,
};

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildNumImageUrl = (gameId, symbolId = 0) =>
    jiliAsset(`images/intro/${gameId}/${symbolId}.webp`);

const buildTopImageUrl = (gameId, symbolId = 0) =>
    jiliAsset(`images/intro/${gameId}/Symbol_${symbolId}_s.webp`);

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    jiliAsset(`images/intro/${gameId}/Symbol_${symbolId}.webp`);

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row =>
        row.map(item => {
            const newItem = {
                ...item,
                url: buildSymbolImageUrl(gameId, item.Symbol),
            };

            // 判断并添加 imgs 属性
            if (item.HSymbol !== undefined && item.Symbol !== item.HSymbol) {
                newItem.headerImg = buildNumImageUrl(gameId, item.HStack);
                newItem.otherImg = [
                    ...Array(item.HStack).fill(buildTopImageUrl(gameId, item.HSymbol)),
                ];
            }
            return newItem;
        })
    );
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
            var cell = column[rowIndex];
            var sym = cell.HSymbol !== undefined && cell.HSymbol !== null ? cell.HSymbol : 0;

            if (sym === awardSymbol || sym === WILD_ID) {
                winningRows.push({ rowIndex: rowIndex, HStack: cell.HStack });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        } else {
            continuous = false; // 中断
        }
    }

    var odds = 1;
    var result = list.map(function (winningRows) {
        if (!winningRows) return [];
        var rowIndexes = [];
        var sumOdds = 0;

        for (var i = 0; i < winningRows.length; i++) {
            rowIndexes.push(winningRows[i].rowIndex);
            sumOdds += winningRows[i].HStack;
        }

        odds *= sumOdds;
        return rowIndexes;
    });

    return { list: result, odds: odds };
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol, 1);

                // 计算中奖列索引（左到右连续）
                const { list, odds } = calcWinningColumnsRows(ComboStageSymbol, award.Symbol);

                RoundWin += award.Win || 0;

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    list,
                    odds,
                };
            });

            const Party = plate.Party;
            const hasWorkedTrue = Party.some(item => item.Worked === true);
            const PartyResult = hasWorkedTrue
                ? Party.map((party, partyIndex) => {
                      return {
                          ...party,
                          uuid: uuid(),
                          img: party.Worked ? buildSymbolImageUrl(gameId, HEADER_ID[party.State]) : "",
                      };
                  })
                : [];

            return {
                ...plate,
                uuid: uuid(),
                RoundWin,
                PlateSymbolExtend,
                AwardDataVec,
                PartyResult,
            };
        });
        return {
            ...roundData,
            isFrist,
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

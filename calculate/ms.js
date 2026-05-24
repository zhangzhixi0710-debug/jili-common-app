import { jiliAsset } from '@/utils/assets';
const WILD_ID = 12;

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
            buildSymbolImageUrl(gameId, plateSymbol[row].Col[col])
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
            }
        })
    );
    return result;
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
        var column = PlateSymbol[colIndex].Col || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex];

            if (Symbol === awardSymbol || Symbol === WILD_ID) {
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

function processFreeQueue(gameData, gameId) {
    const RoundQueue = gameData.RoundQueue || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = 0;

        const PlateSymbol = roundData.PlateSymbol;
        const PlateSymbolNum = roundData.PlateSymbolNum;
        const PlateSymbolNumImg = getSymbolImages(gameId, PlateSymbolNum);
        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const img = buildSymbolImageUrl(gameId, award.Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, odds } = calcWinningColumnsRows(PlateSymbol, award.Symbol);

            RoundWin += award.Win || 0;

            return {
                ...award,
                uuid: uuid(),
                img,
                list,
                odds,
            };
        });

        return {
            ...roundData,
            PlateSymbolNumImg,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec,
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

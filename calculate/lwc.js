import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;
const PRE_MULT = "xx";

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";

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
        Array.from({ length: 3 }, (_, col) => {
            return buildSymbolImageUrl(gameId, plateSymbol[row].Col[col]);
        })
    );
}

/**
 * 根据列倍率生成对应的图片数组结构
 * @param {number[]} wildColumnMult - 每列的倍率数组，例如 [0, 1, 12, 0, 123]
 * @returns {Array<Array<string>>} 返回二维数组，每一列对应一组图片
 */
function buildWildColumnImages(gameId, wildColumnMult) {
    return wildColumnMult.map(v => {
        if (v > 0) {
            // 拆分数字为字符数组，例如 123 → ['1', '2', '3']
            const digits = String(v).split("");
            return [
                buildNumImageUrl(gameId, PRE_MULT), // 前缀图
                ...digits.map(d => buildNumImageUrl(gameId, d)), // 每个数字图
            ];
        } else {
            return [];
        }
    });
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
    const plates = RoundQueue.map(roundData => {
        let RoundWin = 0;

        let HeaderImage = [];
        if (roundData.WheelMul) {
            HeaderImage = buildWildColumnImages(gameId, [roundData.WheelMul]);
        }

        const PlateSymbol = roundData.Symbol;
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
            HeaderImage,
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

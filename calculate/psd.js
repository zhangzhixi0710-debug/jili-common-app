import { jiliAsset } from '@/utils/assets';
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    symbolId || symbolId === 0
        ? jiliAsset(`images/intro/${gameId}/Symbol_${symbolId}.webp`)
        : "";

const buildNumImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/${num}.webp`) : "";

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

function generateComboStageData(ComboStageSymbol) {
    return ComboStageSymbol.map(item => [...item.Col].reverse());
}

/**
 * 根据数据和中奖位置向量计算每列中奖符号的索引（支持翻转，并排序）
 * 特殊规则：如果 symbolId === 9，则所有 data 中值为 9 的位置都视为中奖
 * @param {Array} data - 数据源，每个元素是一个对象，包含一个 Col 数组
 * @param {Array} posVec - 一维索引数组，表示在所有 Col 展开后中奖的位置
 * @param {Number} symbolId - 当前计算的中奖符号ID
 * @returns {Object} - { list, count }
 *   list: 二维数组，每个子数组存放该列中奖符号的行索引（排序）
 *   count: 总中奖个数
 */
function getWinningIndexes(data, symbolId = 0) {
    const colLen = data[0].Col.length; // 每列的行数
    const result = Array.from({ length: data.length }, () => []); // 初始化结果数组

    // 遍历每一列，每一行，如果值为 9 则视为中奖
    data.forEach((colObj, colIndex) => {
        colObj.Col.forEach((val, rowIndex) => {
            if (val === symbolId) {
                const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
                result[colIndex].push(mappedRowIndex);
            }
        });
    });

    // 对每列中奖索引排序
    result.forEach(arr => arr.sort((a, b) => a - b));

    // 计算总中奖个数
    const count = result.reduce((sum, arr) => sum + arr.length, 0);

    return { list: result, count };
}

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(gameId, data) {
    // 先把数字转换为字符串，然后拆成单个字符，再转换为数字
    const digits = String(data).split("").map(Number);

    // 调用 buildNumImageUrl 生成图片路径
    const images = digits.map(num => buildNumImageUrl(gameId, num));

    // 在第一个位置插入 buildNumImageUrl(gameId, 'X')
    images.unshift(buildNumImageUrl(gameId, "xx"));

    return images;
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

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol || 0);

                // 计算中奖列索引（左到右连续）
                const { list, count } = getWinningIndexes(plate.ComboStageSymbol, award.Symbol);

                award.Count = count;

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    list,
                };
            });

            let RoundMultImages = [];
            if (plate.Mul) {
                RoundMultImages = getSymbolImages(gameId, plate.Mul);
            }

            return {
                ...plate,
                uuid: uuid(),
                RoundMultImages,
                PlateSymbolExtend,
                AwardDataVec,
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

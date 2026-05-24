import { jiliAsset } from '@/utils/assets';
const WILD_ID = [10, 11, 12, 13, 14];
const MERGE_VALUE = 15;
const DIFFERENCE_VALUE = 6;
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    symbolId || symbolId === 0
        ? jiliAsset(`images/intro/${gameId}/symbol_${
              symbolId > MERGE_VALUE ? symbolId - DIFFERENCE_VALUE : symbolId
          }.webp`)
        : "";

const buildNumImageUrl = (num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/number/${num}.webp`) : "";

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

function generateComboStageData(ComboStageSymbol) {
    return ComboStageSymbol.map(item => [...item.Col].reverse());
}

/**
 * 根据数据和中奖符号计算连续中奖索引（支持翻转，中断即停止）
 * 特殊规则：如果符号ID命中，或是 Wild，视为中奖
 * @param {Array} data - 数据源，每项为 { Col: [] }
 * @param {Number} symbolId - 中奖符号ID
 * @returns {Object} { list, count }
 */
function getWinningIndexes(data, symbolId = 0) {
    const colLen = data[0].Col.length;
    const result = Array.from({ length: data.length }, () => []);
    let stopped = false; // 是否中断

    for (let colIndex = 0; colIndex < data.length; colIndex++) {
        const colObj = data[colIndex];

        if (stopped) break; // 后续停止计算

        let hasWinInCol = false;

        colObj.Col.forEach((val, rowIndex) => {
            const isWild = WILD_ID.includes(val) || WILD_ID.includes(val - DIFFERENCE_VALUE);
            const isMatch = val === symbolId;

            if (isMatch || isWild) {
                hasWinInCol = true;

                const mappedRowIndex = colLen - 1 - rowIndex;
                result[colIndex].push(mappedRowIndex);
            }
        });

        // 当前列没有任何中奖 → 中断
        if (!hasWinInCol) {
            stopped = true;
            // 清空这个列（不中）
            result[colIndex] = [];
        }
    }

    // 每列排序
    result.forEach(arr => arr.sort((a, b) => a - b));

    // 合计中奖数
    const count = result.reduce((sum, arr) => sum + arr.length, 0);

    return { list: result, count };
}

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(data) {
    // 先把数字转换为字符串，然后拆成单个字符，再转换为数字
    const digits = String(data).split("").map(Number);

    // 调用 buildNumImageUrl 生成图片路径
    const images = digits.map(num => buildNumImageUrl(num));

    // 在第一个位置插入 buildNumImageUrl(gameId, 'X')
    images.unshift(buildNumImageUrl("xx"));

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
            if (plate.Mult) {
                RoundMultImages = getSymbolImages(plate.Mult);
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

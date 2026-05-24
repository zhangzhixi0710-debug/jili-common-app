import { jiliAsset } from '@/utils/assets';
const DIFFERENCE = 9;

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

const buildNumImageUrl = (num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/number_3/${num}.webp`) : "";

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
function getWinningIndexes(data, posVec, symbolId) {
    const colLen = data[0].Col.length; // 每列的行数
    const result = Array.from({ length: data.length }, () => []); // 初始化结果数组

    if (symbolId === DIFFERENCE) {
        // 遍历每一列，每一行，如果值为 9 则视为中奖
        data.forEach((colObj, colIndex) => {
            colObj.Col.forEach((val, rowIndex) => {
                if (val === DIFFERENCE) {
                    const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
                    result[colIndex].push(mappedRowIndex);
                }
            });
        });
    } else {
        // 普通情况，按 posVec 计算中奖位置
        posVec.forEach(idx => {
            const colIndex = Math.floor(idx / colLen); // 属于第几列
            const rowIndex = idx % colLen; // 在列中的位置
            const mappedRowIndex = colLen - 1 - rowIndex; // 翻转后行索引
            result[colIndex].push(mappedRowIndex);
        });
    }

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
    const images = digits.map(num => buildNumImageUrl(num));

    // 在第一个位置插入 buildNumImageUrl(gameId, 'X')
    images.unshift(buildNumImageUrl("xx"));

    return images;
}

// 计算某个阶段的总倍率（作用于该阶段所有 AwardDataVec）
function calculateStageMultiplier(stage) {
    let multipliers = [];

    // 收集 ComboStageMults
    stage.ComboStageMults.forEach(m => {
        if (m.Col) multipliers.push(...m.Col);
    });

    // 收集 FillMults
    stage.FillMults.forEach(m => {
        if (m.Col) multipliers.push(...m.Col);
    });

    // 如果没有倍率，默认 1 倍
    return multipliers.length > 0 ? multipliers.reduce((a, b) => a + b, 0) : 0;
}

/**
 * mapMultipliers - 将 ComboStageSymbol 中值为 10 的位置映射到对应列的 ComboStageMults 值
 *
 * @param {Array<Object>} ComboStageSymbol - 包含每列符号数据的数组，每个元素格式为 { Col: [符号数组] }
 * @param {Array<Object>} ComboStageMults - 包含每列倍率数据的数组，每个元素格式为 { Col: [倍率数组] }
 * @returns {Array<Array<Object>>} - 返回数组，长度等于 ComboStageSymbol 列数，每列数组存放对象：
 **/
function mapMultipliers(ComboStageSymbol, ComboStageMults, gameId) {
    let result = [];

    ComboStageSymbol.forEach((colObj, colIndex) => {
        const colSymbols = colObj;
        const mults = (ComboStageMults[colIndex] && ComboStageMults[colIndex]) || [];
        let colResult = Array(colSymbols.length).fill({}); // 默认 {} 占位
        let multIndex = 0;

        colSymbols.forEach((symbol, rowIndex) => {
            if (symbol === 10 && multIndex < mults.Col.length) {
                const multValue = mults.Col[multIndex];

                // 如果是两位数，拆成单个数字
                let symbolNumImages;
                if (multValue > 9) {
                    symbolNumImages = String(multValue)
                        .split("")
                        .map(num => buildNumImageUrl(Number(num)));
                } else {
                    symbolNumImages = [buildNumImageUrl(multValue)];
                }

                colResult[rowIndex] = {
                    pos: rowIndex,
                    symbolNum: symbolNumImages, // 始终是数组
                };

                multIndex++;
            }
        });

        result.push(colResult);
    });

    return result;
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let BoardReset = false;
        let isFrist = false;
        const Mul = roundData.RoundMult;
        const ComboStageData = roundData.ComboStageData || [];
    

        let PrevFreeRemainRound = 0;
        if (roundIndex === 0) {
            isFrist = true;
        } else {
            PrevFreeRemainRound = freeInfo[roundIndex - 1].FreeRemainRound;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const bet = calculateStageMultiplier(plate);

            plate.RoundMultImages = Mul && Mul !== 1 ? getSymbolImages(gameId, Mul) : [];

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, count } = getWinningIndexes(
                    plate.ComboStageSymbol,
                    award.PosVec,
                    award.Symbol
                );

                award.Count = count;

                return {
                    ...award,
                    Win: bet ? award.Win * (Mul || 1) : award.Win,
                    uuid: uuid(),
                    img,
                    list,
                };
            });

            const symbolNumArray = mapMultipliers(
                ComboStageSymbol,
                plate.ComboStageMults || [],
                gameId
            );

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                AwardDataVec,
                symbolNumArray,
            };
        });

        return {
            ...roundData,
            RoundMult: roundData.RoundMult > 1 && roundData.RoundWin ? roundData.RoundMult : "",
            isFrist,
            BoardReset,
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

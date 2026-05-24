import { jiliAsset } from '@/utils/assets';
const DIFFERENCE = 9;

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0) => {
    try {
        return symbolId || symbolId === 0
            ? jiliAsset(`images/intro/${gameId}/Symbol_${symbolId}.webp`)
            : "";
    } catch (error) {
        return "";
    }
};

const buildNumImageUrl = (num = 0) => {
    try {
        return num || num === 0 ? jiliAsset(`images/intro/number_3/${num}.webp`) : "";
    } catch (error) {
        return "";
    }
};

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
 * calculateTotalFillBonus - 计算整个 Round 的 FillSymbols 额外奖励总金额
 *
 * @param {Array<Object>} comboStageData - 轮次数据数组，每个对象包含：
 *        ComboStageWin, AwardDataVec, FillSymbols, FillMults
 * @param {number} rows - 每列行数，默认 5
 * @returns {number} - FillSymbols 产生的总额外奖励
 */
function calculateTotalFillBonus(comboStageData, rows = 5) {
    let totalFillBonus = 0;

    comboStageData.forEach(stage => {
        const fillPositions = [];

        // 生成 FillSymbols 对应的绝对索引
        stage.FillSymbols.forEach((col, colIndex) => {
            if (col.Col && Array.isArray(col.Col)) {
                col.Col.forEach(row => {
                    if (typeof row === "number" && row >= 0 && row < rows) {
                        fillPositions.push(colIndex * rows + row);
                    }
                });
            }
        });

        // 遍历 AwardDataVec 计算贡献
        stage.AwardDataVec.forEach(award => {
            if (!award.Count || award.Count === 0) return; // 避免除0
            const baseWinPerSymbol = award.Win / award.Count;

            award.PosVec.forEach(pos => {
                if (fillPositions.includes(pos)) {
                    const colIndex = Math.floor(pos / rows);
                    let mult = 1;

                    if (
                        stage.FillMults[colIndex] &&
                        Array.isArray(stage.FillMults[colIndex].Col) &&
                        stage.FillMults[colIndex].Col.length > 0
                    ) {
                        mult = stage.FillMults[colIndex].Col[0];
                    }

                    if (!isNaN(baseWinPerSymbol) && !isNaN(mult)) {
                        totalFillBonus += baseWinPerSymbol * mult;
                    }
                }
            });
        });
    });

    return totalFillBonus;
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
                        .map(num => buildNumImageUrl(gameId, Number(num)));
                } else {
                    symbolNumImages = [buildNumImageUrl(gameId, multValue)];
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

/**
 * 判断一局游戏是否触发了盘面重置（严格规则版）
 * 规则：
 * 1. 每局最多触发一次
 * 2. 主游戏和免费游戏都可能触发
 * 3. 只有无法消除的符号会被清空
 * 4. img 等特殊符号会保留
 * 5. 不会与符号转换同时触发
 * 6. 如果每个阶段 FillSymbols 都为空，则不算盘面重置
 *
 * @param {Object} gameData - 一局游戏完整数据
 * @returns {Object} - { isReset: boolean, resetStageIndex: number | null }
 */
function checkRoundReset(gameData) {
    if (!gameData || !Array.isArray(gameData.ComboStageData)) {
        return false;
    }

    const stages = gameData.ComboStageData;

    // 先判断是否所有阶段都是空
    const allStagesEmpty = stages.every(
        stage =>
            Array.isArray(stage.FillSymbols) &&
            stage.FillSymbols.every(col => !col || !col.Col || col.Col.length === 0)
    );

    if (allStagesEmpty) {
        // 所有阶段都是空，不算盘面重置
        return false;
    }

    // 遍历阶段，返回第一个 FillSymbols 全空的阶段
    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        const fillSymbols = stage.FillSymbols;

        if (!Array.isArray(fillSymbols)) continue;

        const allEmpty = fillSymbols.every(col => !col || !col.Col || col.Col.length === 0);

        if (allEmpty) {
            // 找到第一次全空的阶段即认为本局触发了盘面重置
            return true;
        }
    }

    // 没有阶段满足条件，则未触发
    return isReset;
}

function processFreeQueue(freeInfo, gameId) {
    let isBoardReset = false;
    return freeInfo.map((roundData, roundIndex) => {
        let BoardReset = false;
        let isFrist = false;
        let symbolConversion = roundData.TargetPosVec && roundData.TargetPosVec.length;
        const ComboStageData = roundData.ComboStageData || [];
        let BonusWin = symbolConversion ? calculateTotalFillBonus(ComboStageData) : 0;
        let RoundWin = 0;

        if (!symbolConversion && !BoardReset && !isBoardReset) {
            BoardReset = checkRoundReset(roundData);

            if (BoardReset) {
                BonusWin = calculateTotalFillBonus(ComboStageData) || 0;

                isBoardReset = true;
            }
        }

        let PrevFreeRemainRound = 0;
        let IsGetFreeGame = false;
        const currentFreeRemainRound = roundData.FreeRemainRound;
        if (roundIndex === 0) {
            isFrist = true;
        } else {
            PrevFreeRemainRound = freeInfo[roundIndex - 1].FreeRemainRound;
        }

        if (currentFreeRemainRound >= PrevFreeRemainRound) {
            IsGetFreeGame = true;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const bet = calculateStageMultiplier(plate);

            plate.RoundMultImages = bet ? getSymbolImages(gameId, bet) : [];

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, count } = getWinningIndexes(
                    plate.ComboStageSymbol,
                    award.PosVec,
                    award.Symbol
                );

                award.Count = count;

                RoundWin += award.Win * (bet || 1);

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    list,
                };
            });

            const count9 = plate.ComboStageSymbol.reduce((sum, colObj) => {
                return sum + colObj.Col.filter(v => v === DIFFERENCE).length;
            }, 0);

            // 判断是否大于等于 3
            const isGreaterOrEqual3 = freeInfo.length > 1 && count9 >= 3;

            if (isGreaterOrEqual3 && roundIndex !== 0) {
                BonusWin = calculateTotalFillBonus(ComboStageData) || 0;
            }

            const symbolNumArray = mapMultipliers(
                ComboStageSymbol,
                plate.ComboStageMults || [],
                gameId
            );

            return {
                ...plate,
                uuid: uuid(),
                isGreaterOrEqual3,
                PlateSymbolExtend,
                AwardDataVec,
                symbolNumArray,
            };
        });

        return {
            ...roundData,
            isFrist,
            BonusWin,
            BoardReset,
            IsGetFreeGame,
            symbolConversion,
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

import { jiliAsset } from '@/utils/assets';
const WILD_ID = [0];

export const buildSymbolImageUrl = (gameId, id) => {
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : ""
};

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
            if (plateSymbol[row].row[col].isGold) {
                return buildSymbolImageUrl(gameId, plateSymbol[row].row[col].symbol + "_g");
            }
            return buildSymbolImageUrl(gameId, plateSymbol[row].row[col].symbol);
        })
    );
}


/**
 * 根据数据和中奖符号计算连续中奖索引（支持翻转，中断即停止）
 * 特殊规则：如果符号ID命中，或是 Wild，视为中奖
 * @param {Array} data - 数据源，每项为 { Col: [] }
 * @param {Number} symbolId - 中奖符号ID
 * @returns {Object} { list, count }
 */
function getWinningIndexes(data, symbolId = 0) {
    const colLen = data[0].row.length;
    const result = Array.from({ length: data.length }, () => []);
    let stopped = false; // 是否中断

    for (let colIndex = 0; colIndex < data.length; colIndex++) {
        const colObj = data[colIndex];

        if (stopped) break; // 后续停止计算

        let hasWinInCol = false;

        colObj.row.forEach((item, rowIndex) => {
            const val = item.symbol
            const isMatch = val === symbolId || WILD_ID.includes(val);

            if (isMatch) {
                hasWinInCol = true;

                const mappedRowIndex = colLen - 1 - rowIndex;
                result[colIndex].push(rowIndex);
            }
        });

        // 当前列没有任何中奖 → 中断
        if (!hasWinInCol) {
            stopped = true;
            // 清空这个列（不中）
            result[colIndex] = [];
        }
    }

    const isValid = result.slice(0, 3).every(item => item && item.length > 0);

    if (isValid) {
        // 每列排序
        result.forEach(arr => arr.sort((a, b) => a - b));

        // 合计中奖数
        let count = result.reduce((acc, arr) => acc * arr.length, 1);

        return { list: isValid ? result : [], count: count || 1 };
    }

    return { list: [] }
}

function applyChange(column, change) {
    const result = column.map(col => ({
        row: col.row.map(cell => ({
            ...cell,
            symbol: cell.symbol  // 直接取原始数字
        }))
    }));

    change.forEach((item) => {
        const rowIndex = item.row !== undefined ? item.row : 0;
        const colIndex = item.column !== undefined ? item.column : 0;

        if (
            result[colIndex] &&
            result[colIndex].row &&
            result[colIndex].row[rowIndex]
        ) {
            result[colIndex].row[rowIndex].symbol = item.symbol;
        }
    });

    return result;
}

function processFreeQueue(gameData, gameId) {
    gameData.forEach(item => {
        item.ComboStageData = []

        let ComboStageSymbol = item.column;

        (item?.combo || []).forEach(it => {
            if (it.win && it.award?.length) {
                const totalWin = it.award.reduce((sum, item) => sum + (item.win || 0), 0);

                const mul = it.win / totalWin

                it.award.forEach(aw => {
                    aw.mul = mul
                    aw.totalWin = mul * aw.win
                });
            }
        })


        const award = item.combo.flatMap(item => item?.award || []);


        item.ComboStageData.push({
            ComboStageSymbol: ComboStageSymbol,
            AwardDataVec: award
        })

        if (item.combo.length) {
            item.combo.forEach(it => {
                if (it.change.length) {
                    ComboStageSymbol = applyChange(ComboStageSymbol, it.change)

                    item.ComboStageData.push({
                        ComboStageSymbol: ComboStageSymbol,
                        AwardDataVec: award
                    })
                }
            })
        }
    })

    return gameData.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = roundData.win;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate) => {
            const ComboStageSymbol = plate.ComboStageSymbol

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            let Mul = 1
            const AwardDataVec = (plate.AwardDataVec || []).reduce((acc, award) => {
                const img = buildSymbolImageUrl(gameId, award.symbol || 0);
                const { list, count } = getWinningIndexes(ComboStageSymbol, award.symbol);

                const newItem = {
                    count,
                    uuid: uuid(),
                    img,
                    Win: award.totalWin,
                    list,
                };

                // 只有当 list 不为空时才添加
                if (list && list.length > 0) {
                    Mul = award.mul
                    
                    acc.push(newItem);
                }


                return acc;
            }, []);

            if (!AwardDataVec?.length) {
                if (roundIndex === 0) {
                    Mul = 1
                } else {
                    Mul = 2
                }
            }

            let MulArray = []
            if (roundIndex === 0) {
                MulArray = [1, 2, 3, 5]
            } else {
                MulArray = [2, 4, 5, 10]
            }

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                MulArray: MulArray,
                Mul,
                AwardDataVec
            };
        });

        return {
            ...roundData,
            isFrist,
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
    let rounds = processFreeQueue(gameData.plate, gameId)

    if (gameData.plate?.length > 1) {
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
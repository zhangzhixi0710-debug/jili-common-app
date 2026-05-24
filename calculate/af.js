import { jiliAsset } from '@/utils/assets';
const WILD_ID = [18, 19];

export const buildSymbolImageUrl = (gameId, id) => {
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";
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
            if (plateSymbol[row].isGold[col] && plateSymbol[row].row[col] < 12) {
                return buildSymbolImageUrl(gameId, plateSymbol[row].row[col] + 8);
            }
            return buildSymbolImageUrl(gameId, plateSymbol[row].row[col]);
        })
    );
}

function generateHighlightListFromWinning(winningCells = []) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

/**
 * 根据数据和中奖符号计算连续中奖索引（支持翻转，中断即停止）
 * 特殊规则：如果符号ID命中，或是 Wild，视为中奖
 * @param {Array} data - 数据源，每项为 { Col: [] }
 * @param {Number} symbolId - 中奖符号ID
 * @returns {Object} { list, count }
 */
function getWinningIndexes(data, lineCells, symbolId = 0) {
    const cellsWithId = lineCells.map(p => ({
        col: p.column || 0,
        row: p.row || 0,
        symbolId: data[p.column || 0].row[p.row || 0],
    }));

    let count = 0;
    const matchedCells = [];

    const targetId = [symbolId, symbolId + 8];
    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (targetId.includes(c.symbolId) || WILD_ID.includes(c.symbolId)) {
            matchedCells.push(c);
            count++;
        } else {
            if (count >= 3) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    // 1. 统计每一列的数量
    const colCount = {};

    matchedCells.forEach(item => {
        const col = item.col;
        colCount[col] = (colCount[col] || 0) + 1;
    });

    // 2. 将各列的数量相乘
    const odds = Object.values(colCount).reduce((product, count) => product * count, 1);

    return { list: matchedCells, odds: odds };
}

function applyChange(column, change) {
    const result = column.map(col => ({
        row: col.row.map(cell => {
            if (cell.hasOwnProperty("symbol")) {
                return cell.symbol;
            }
            return cell;
        }),
        isGold: col.isGold,
    }));

    change.forEach(item => {
        const rowIndex = item.row !== undefined ? item.row : 0;
        const colIndex = item.column !== undefined ? item.column : 0;

        if (result[colIndex] && result[colIndex].row && result[colIndex].row[rowIndex]) {
            if (item.isGold === 101) {
                result[colIndex].row[rowIndex] = 18;
            } else if (item.isGold === 102) {
                result[colIndex].row[rowIndex] = 19;
            } else {
                result[colIndex].row[rowIndex] = item.symbol || 0;
            }
        }
    });

    return result;
}

function processFreeQueue(gameData, isFree, gameId) {
    gameData.forEach((item, firstIndex) => {
        item.ComboStageData = [];

        let ComboStageSymbol = item.column;

        (item?.combo || []).forEach(it => {
            if (it.win && it.award?.length) {
                const totalWin = it.award.reduce((sum, item) => sum + (item.win || 0), 0);

                const mul = it.win / totalWin;

                it.award.forEach(aw => {
                    aw.mul = mul;
                    aw.totalWin = mul * aw.win;
                });
            }
        });

        item.ComboStageData.push({
            ComboStageSymbol: ComboStageSymbol,
        });

        if (item.combo.length) {
            item.combo.forEach((it, index) => {
                if (it.change.length) {
                    ComboStageSymbol = applyChange(ComboStageSymbol, it.change);

                    item.ComboStageData.push({
                        ...it,
                        ComboStageSymbol: ComboStageSymbol,
                    });
                }
            });
        }

        item.ComboStageData.forEach((it, index) => {
            const comboItem = item.combo?.[index];
            let comboBonus = comboItem?.comboBonus;

            if (isFree) {
                // 免费模式下的规则
                if (firstIndex === 0) {
                    comboBonus = 1;
                } else {
                    comboBonus = !comboBonus ? 2 : Math.max(comboBonus, 2);
                }
            } else {
                // 非免费模式下的规则
                comboBonus = firstIndex === 0 ? 1 : comboBonus || 1;
            }

            it.comboBonus = comboBonus;
            it.AwardDataVec = comboItem?.award || [];
        });
    });

    return gameData.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = roundData.win;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map(plate => {
            const ComboStageSymbol = plate.ComboStageSymbol;

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            let Mul = 1;
            const AwardDataVec = (plate.AwardDataVec || []).reduce((acc, award) => {
                const img = buildSymbolImageUrl(gameId, award.symbol || 0);
                const { list, odds } = getWinningIndexes(
                    ComboStageSymbol,
                    award.block,
                    award.symbol
                );

                const newItem = {
                    odds,
                    uuid: uuid(),
                    img,
                    Win: award.totalWin,
                    list: generateHighlightListFromWinning(list),
                };

                // 只有当 list 不为空时才添加
                if (list && list.length > 0) {
                    Mul = award.mul;

                    acc.push(newItem);
                }

                return acc;
            }, []);

            if (!AwardDataVec?.length) {
                if (roundIndex === 0) {
                    Mul = 1;
                } else {
                    Mul = 2;
                }
            }

            let MulArray = [];
            if (roundIndex === 0) {
                MulArray = [1, 2, 3, 5];
            } else {
                MulArray = [2, 4, 6, 10];
            }

            return {
                ...plate,
                uuid: uuid(),
                PlateSymbolExtend,
                MulArray: MulArray,
                Mul,
                AwardDataVec,
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
    if (gameData.plate?.length > 1) {
        gameData.isFree = true;
    } else {
        gameData.isFree = false;
    }

    let rounds = processFreeQueue(gameData.plate, gameData.isFree, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

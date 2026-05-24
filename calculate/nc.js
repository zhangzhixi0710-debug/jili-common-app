import { jiliAsset } from '@/utils/assets';
// 百搭符号
const WILD_ID = 0;
// 特殊百搭符号
const SPECIAL_WILD_ID = [11, 12];
// 中奖符号计算：默认百搭符号替换排除符号
const DEFAULT_EXCLUDE_ID = [1, 11, 12];
// 中奖符号计算：特殊百搭符号替换排除符号
const DEFAULT_SPECIAL_EXCLUDE_ID = [0, 1];

// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

// uuid
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function multiplyArrayLengths(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return 0;
    }

    return arr.reduce((product, subArray) => {
        // 确保子数组存在且有length属性
        const length = Array.isArray(subArray) ? subArray.length : 0;
        return product * (length > 0 ? length : 1); // 空数组按长度1处理，避免乘以0
    }, 1);
}
/**
 * 构建扩展后的特殊百搭映射：
 * 若某格为特殊百搭（SPECIAL_WILD_ID），则检查其上下左右；
 * 只有当相邻格是特殊百搭或等于 awardSymbol 时，才把它标记为 true。
 */
function buildExtendedSpecialMap(ComboStageSymbol, awardSymbol) {
    const cols = ComboStageSymbol.length;
    const map = new Array(cols);

    // 初始化 map，每列长度与原盘面对应
    for (let c = 0; c < cols; c++) {
        const colLen =
            ComboStageSymbol[c] && ComboStageSymbol[c].row ? ComboStageSymbol[c].row.length : 0;
        map[c] = new Array(colLen).fill(false);
    }

    for (let c = 0; c < cols; c++) {
        const column =
            ComboStageSymbol[c] && ComboStageSymbol[c].row ? ComboStageSymbol[c].row : [];
        for (let r = 0; r < column.length; r++) {
            const sym =
                column[r] && column[r].symbol !== undefined && column[r].symbol !== null
                    ? column[r].symbol
                    : 0;

            if (SPECIAL_WILD_ID.includes(sym)) {
                // 自身始终算特殊百搭
                map[c][r] = true;

                // 检查上下左右四个方向
                const directions = [
                    { dc: 0, dr: -1 }, // 上
                    { dc: 0, dr: 1 }, // 下
                    { dc: -1, dr: 0 }, // 左
                    { dc: 1, dr: 0 }, // 右
                ];

                for (const { dc, dr } of directions) {
                    const nc = c + dc;
                    const nr = r + dr;

                    if (
                        nc >= 0 &&
                        nc < cols &&
                        ComboStageSymbol[nc] &&
                        ComboStageSymbol[nc].row &&
                        nr >= 0 &&
                        nr < ComboStageSymbol[nc].row.length
                    ) {
                        const neighborSym = ComboStageSymbol[nc].row[nr].symbol;
                        // 只有相邻格是特殊百搭或等于 awardSymbol 才标记为 true
                        if (SPECIAL_WILD_ID.includes(neighborSym) || neighborSym === awardSymbol) {
                            map[nc][nr] = true;
                        }
                    }
                }
            }
        }
    }

    return map;
}
/**
 * 计算每列的默认中奖符号（awardSymbol 和 WILD_ID），
 * *注意*：默认中奖也会把“扩展后的特殊百搭位置”当作可匹配的百搭处理
 */
function calculateDefaultWinningSymbols(ComboStageSymbol, awardSymbol) {
    const extendedMap = buildExtendedSpecialMap(ComboStageSymbol, awardSymbol);

    var list = [];
    var continuous = true;

    // 是否禁止普通百搭替代当前中奖符号
    const excludeWild = DEFAULT_EXCLUDE_ID.includes(awardSymbol);

    for (var colIndex = 0; colIndex < ComboStageSymbol.length && continuous; colIndex++) {
        var column = ComboStageSymbol[colIndex].row || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var cell = column[rowIndex];
            var sym = cell && cell.symbol !== undefined && cell.symbol !== null ? cell.symbol : 0;

            const isAward = sym === awardSymbol;
            const isNormalWild = sym === WILD_ID;
            const isExtendedSpecial = extendedMap[colIndex] && extendedMap[colIndex][rowIndex];

            // 普通百搭只有在不被排除时才可替代
            if (isAward || (!excludeWild && isNormalWild) || isExtendedSpecial) {
                winningRows.push({ rowIndex });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        } else {
            continuous = false;
        }
    }

    return list.map(winningRows =>
        winningRows ? winningRows.map(r => ({ rowIndex: r.rowIndex })) : []
    );
}

/**
 * 计算每列的特殊WILD符号中奖情况（使用“扩展后”的特殊百搭映射”）
 * 规则：扩展后的格子只有在自身是特殊百搭 或 被特殊百搭延伸且符号匹配时才算中奖
 */
function calculateSpecialWildWinningSymbols(ComboStageSymbol, awardSymbol) {
    // 若没有特殊百搭，直接返回空数组
    const hasSpecialWild = ComboStageSymbol.some(col =>
        col.row?.some(cell => SPECIAL_WILD_ID.includes(cell.symbol))
    );
    if (!hasSpecialWild) return [];

    const extendedMap = buildExtendedSpecialMap(ComboStageSymbol, awardSymbol);
    const excludeSpecialWild = DEFAULT_SPECIAL_EXCLUDE_ID.includes(awardSymbol);

    let list = [];

    for (let colIndex = 0; colIndex < ComboStageSymbol.length; colIndex++) {
        let column = ComboStageSymbol[colIndex].row || [];
        let winningRows = [];

        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
            const cell = column[rowIndex];
            const sym = cell?.symbol ? cell.symbol : 0;

            const isSpecialWild = SPECIAL_WILD_ID.includes(sym);
            const isExtended = extendedMap[colIndex] && extendedMap[colIndex][rowIndex];
            const isAward = sym === awardSymbol;

            // 特殊百搭可命中：除非当前奖符被排除
            if ((!excludeSpecialWild && (isSpecialWild || isExtended)) || isAward) {
                if (!winningRows.some(item => item.rowIndex === rowIndex)) {
                    winningRows.push({ rowIndex });
                }
            }
        }

        if (winningRows.length) list[colIndex] = winningRows;
    }

    return list;
}

/**
 * 汇总计算中奖符号的结果（合并默认与特殊百搭的命中），
 * 同时保证默认匹配必须至少连续命中 3 列（否则认为默认匹配无效）
 */
function calcWinningColumnsRows(ComboStageSymbol, awardSymbol) {
    // 1. 计算默认中奖符号（含扩展后的特殊百搭）
    let defaultWinningRows = calculateDefaultWinningSymbols(ComboStageSymbol, awardSymbol);

    // ? 确保默认中奖是「连续」的列（非空列之间不能断）
    let continuousResult = [];
    for (let i = 0; i < defaultWinningRows.length; i++) {
        const current = defaultWinningRows[i];
        if (current && current.length > 0) {
            continuousResult[i] = current.map(r => r.rowIndex);
        } else {
            // 一旦中断，后续列即使有中奖也不再计入
            break;
        }
    }

    // 如果连续中奖列少于 3，则视为未中奖
    const nonEmptyCols = continuousResult.filter(c => c && c.length > 0);
    if (nonEmptyCols.length < 3) {
        continuousResult = [];
    }

    // 2. 计算特殊WILD符号中奖情况（扩展后的特殊百搭位置）
    const specialWildWinningRows = calculateSpecialWildWinningSymbols(
        ComboStageSymbol,
        awardSymbol
    );

    // 3. 合并结果：特殊百搭中奖不受“连续列”限制（始终算入）
    let mergedResult = [];

    // 合并普通中奖（连续有效的部分）
    continuousResult.forEach((winningRows, colIndex) => {
        if (winningRows && winningRows.length > 0) {
            mergedResult[colIndex] = [...winningRows];
        }
    });

    // 合并特殊百搭中奖（即便不连续，也有效）
    specialWildWinningRows.forEach((winningRows, colIndex) => {
        if (winningRows && winningRows.length > 0) {
            if (!mergedResult[colIndex]) mergedResult[colIndex] = [];
            winningRows.forEach(item => {
                if (!mergedResult[colIndex].includes(item.rowIndex)) {
                    mergedResult[colIndex].push(item.rowIndex);
                }
            });
        }
    });

    return mergedResult;
}

export function processFreeGameData(Plates = {}, gameId) {
    const data = Plates.plate.map(item => {
        // 盘面数据
        const plateSymbol = item.column;

        // 生成 PlateSymbolExtend (图片二维数组)，4行6列
        const PlateSymbolExtend = []; // 6列， 每列4个符号

        for (let col = 0; col < plateSymbol.length; col++) {
            const colSymbols = [];
            for (let row = 0; row < plateSymbol[col].row.length; row++) {
                const symbolId = plateSymbol[col].row[row];
                colSymbols.push(buildSymbolImageUrl(gameId, symbolId.symbol));
            }
            PlateSymbolExtend.push(colSymbols);
        }

        let RoundWin = (item.award || []).reduce((sum, item) => sum + (item.win || 0), 0);
        let Bet = 1
        if (item.win && RoundWin) { 
            Bet = item.win / RoundWin
        }
 

        // 奖励数据
        const AwardDataVec = (item.award || []).map((award, idx) => {
            const img = buildSymbolImageUrl(gameId, award.symbol);
            const list = calcWinningColumnsRows(plateSymbol, award.symbol);

            RoundWin += award

            return {
                ...award,
                uuid: uuid(),
                win: award.win * Bet,
                img,
                list,
                Index: multiplyArrayLengths(list),
            };
        });


        return {
            ...item,
            PlateSymbolExtend,
            AwardDataVec,
            RoundWin: item.win,
            uuid: uuid(),
        };
    });

    const result = [];
    data.forEach(item => {
        result.push({
            AddRounds: data.length - 1,
            plates: [item],
            uuid: uuid(),
        });
    });
    return {
        uuid: uuid(),
        MainInfo: result[0],
        rounds: result.slice(1),
    };
}

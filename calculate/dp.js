import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol${id}.webp`) : "";

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
 * 计算每列的默认中奖符号（awardSymbol 和 WILD_ID），
 * *注意*：默认中奖也会把“扩展后的特殊百搭位置”当作可匹配的百搭处理
 */
function calculateDefaultWinningSymbols(ComboStageSymbol, awardSymbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < ComboStageSymbol.length && continuous; colIndex++) {
        var column = ComboStageSymbol[colIndex].row || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var symbol = column[rowIndex];
            var sym = symbol && symbol !== undefined && symbol !== null ? symbol : 0;

            const isAward = sym === awardSymbol;

            // 普通百搭只有在不被排除时才可替代
            if (isAward) {
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

    // 3. 合并结果：特殊百搭中奖不受“连续列”限制（始终算入）
    let mergedResult = [];

    // 合并普通中奖（连续有效的部分）
    continuousResult.forEach((winningRows, colIndex) => {
        if (winningRows && winningRows.length > 0) {
            mergedResult[colIndex] = [...winningRows];
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
                colSymbols.push(buildSymbolImageUrl(gameId, symbolId));
            }
            PlateSymbolExtend.push(colSymbols);
        }

        let RoundWin = (item.award || []).reduce((sum, item) => sum + (item.win || 0), 0);
        let Bet = 1;
        if (item.win && RoundWin) {
            Bet = item.win / RoundWin;
        }

        // 奖励数据
        const AwardDataVec = (item.award || []).map((award, idx) => {
            const img = buildSymbolImageUrl(gameId, award.symbol);
            const list = calcWinningColumnsRows(plateSymbol, award.symbol);

            RoundWin += award;

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

import { jiliAsset } from '@/utils/assets';
const WILD_ID = [20, 21, 23, 24, 25];
const DEFAULT_START = 1;
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId, length = DEFAULT_START) => {
    if (symbolId === "" || symbolId === null || symbolId === undefined) {
        return "";
    }
    return length
        ? jiliAsset(`images/intro/${gameId}/symbol_${symbolId}_${length}.webp`)
        : "";
};

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => {
        return row.map(item => {
            let Symbol = item.Symbol;

            if (item.Framed) {
                Symbol += 10;
            } else if (Symbol > 9) {
                Symbol += 10;
            }
            return buildSymbolImageUrl(gameId, Symbol, item.Length);
        });
    });
}

function validateLineOnPlate(PlateSymbol, Symbol) {
    const result = [];
    let continuous = true;

    for (let colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        const column = PlateSymbol[colIndex] || [];
        const winningRows = [];

        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
            const col = column[rowIndex];

            if (
                col.Symbol === Symbol ||
                col.Symbol === Symbol + 10 ||
                WILD_ID.includes(col.Symbol + 10)
            ) {
                winningRows.push(rowIndex);
            }
        }

        if (winningRows.length > 0) {
            result[colIndex] = winningRows;
        } else {
            continuous = false; // 中断连续检测
        }
    }

    // 计算赔率：只计算连续中奖列
    let odds = 1;
    for (let i = 0; i < result.length; i++) {
        if (result[i] && result[i].length > 0) {
            odds *= result[i].length;
        } else {
            break; // 遇到第一个未中奖列就停止计算
        }
    }

    return { list: result, odds: odds };
}

function generateComboStageData(ComboStageSymbol) {
    let lastObj = ComboStageSymbol.pop();

    const result = ComboStageSymbol.map(item => ({
        MColumn: [...item.MColumn].reverse(),
    }));

    let expanded = [{}, ...lastObj.MColumn, {}];

    return result.map((item, i) => {
        return [expanded[i], ...item.MColumn];
    });
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map(plate => {
            let ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, odds } = validateLineOnPlate(ComboStageSymbol, award.Symbol);

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
                ...plate,
                uuid: uuid(),
                RoundWin,
                PlateSymbolExtend,
                AwardDataVec,
            };
        });
        return {
            ...roundData,
            isFrist,
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

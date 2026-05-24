import { jiliAsset } from '@/utils/assets';
const WILD_ID = [21, 23, 24, 25];
const DEFAULT_START = 1;
const EMPTY_ID = "none";
const INTERVAL_NUM = 10;
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0, length = DEFAULT_START) => {
    if (EMPTY_ID === symbolId) {
        return "";
    }
    return length
        ? jiliAsset(`images/intro/${gameId}/symbol_${symbolId}_${length}.webp`)
        : "";
};

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => {
        return row.map(item => buildSymbolImageUrl(gameId, item.Symbol, item.Length));
    });
}

function generateComboStageData(ComboStageSymbol) {
    const result = ComboStageSymbol.map(item => ({
        MColumn: [...item.MColumn].reverse(),
    }));

    return result.map((item, i) => {
        return [...item.MColumn];
    });
}

function validateLineOnPlate(plateSymbol, symbol, GridVec) {
    const matches = GridVec.map(item => ({
        Col:
            item.Col !== undefined && item.Col !== null
                ? item.Col === 6
                    ? item.Row + 1
                    : item.Col
                : 0,
        Row: item.Row !== undefined && item.Row !== null && item.Col !== 6 ? item.Row : 0,
    }));

    // 合并相同 Col
    const fixedGridVec = Object.values(
        matches.reduce((acc, { Col, Row }) => {
            if (!acc[Col]) acc[Col] = { Col, Row: [] };
            acc[Col].Row.push(Row);
            return acc;
        }, {})
    );

    const matchedCols = [];

    fixedGridVec.forEach((item, index) => {
        const Col = plateSymbol[item.Col];

        const result = Col.map((val, index) =>
            val.Symbol === symbol ||
            symbol + INTERVAL_NUM === val.Symbol ||
            WILD_ID.includes(val.Symbol)
                ? index
                : -1
        ) // 记录等于1的索引
            .filter(index => index !== -1); // 过滤掉无效项

        matchedCols.push({
            rowIndex: index,
            Col: result,
        });
    });

    // ? 转换为二维数组结构 [[0,1],[0,2],[2],[1]]
    const resultArray = matchedCols.map(item => item.Col);

    const odds = matchedCols.reduce((acc, item) => acc * item.Col.length, 1);

    return { list: resultArray, odds: odds };
}

function insertDataAtFirst(data) {
    const lastMColumn = data.pop();

    return data.map((item, index, arr) => {
        // 第一个或最后一个对象返回空MColumn
        if (index === 0 || index === arr.length - 1) {
            return [{ Length: 1, Symbol: EMPTY_ID }, ...item];
        }

        // 获取要插入的元素（循环使用lastMColumn中的元素）
        const insertIndex = (index - 1) % lastMColumn.length;
        const insertElement = lastMColumn[insertIndex];

        // 将元素插入到第一个位置
        return [insertElement, ...item];
    });
}

function arrayFormatting(ComboStageSymbol) {
    let result = generateComboStageData(ComboStageSymbol);

    let insertResult = insertDataAtFirst(result);

    // 提取每个子数组的第一个元素
    const firstElements = insertResult.map(innerArray => innerArray[0]);

    // 将第一个元素数组倒序
    const reversedFirstElements = [...firstElements].reverse();

    // 将倒序后的第一个元素放回原数组
    insertResult.forEach((innerArray, index) => {
        if (innerArray.length > 0) {
            innerArray[0] = reversedFirstElements[index];
        }
    });

    insertResult.forEach((innerArray, arrayIndex) => {
        innerArray.forEach((element, elementIndex) => {
            if (element.hasOwnProperty("Symbol") && typeof element.Symbol === "number") {
                if (element.Symbol > 9 || element.Framed) {
                    element.Symbol = element.Symbol + 10;
                }
            }
        });
    });

    return insertResult;
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            let ComboStageSymbol = arrayFormatting(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, odds } = validateLineOnPlate(
                    ComboStageSymbol,
                    award.Symbol,
                    award.GridVec
                );

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

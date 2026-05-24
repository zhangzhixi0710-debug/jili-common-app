import { jiliAsset } from '@/utils/assets';
const WILD_ID = 30;
const DEFAULT_START = 5;
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0, length = DEFAULT_START) => {
    return length
        ? jiliAsset(`images/intro/${gameId}/symbol_${symbolId}_${length}.webp`)
        : "";
};

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(item => buildSymbolImageUrl(gameId, item, row.length)));
}

function generateComboStageData(ComboStageSymbol) {
    const result = ComboStageSymbol.map(item => ({
        Column: [...item.Column].reverse(),
    }));

    return result.map((item, i) => {
        return [...item.Column];
    });
}

function validateLineOnPlate(plateSymbol, symbol, GridVec) {
    const matches = GridVec.map(item => ({
        Col: item.Col !== undefined && item.Col !== null ? item.Col : 0,
        Row: item.Row !== undefined && item.Row !== null ? item.Row : 0,
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

        const result = Col.map((val, index) => (val === symbol || val === WILD_ID ? index : -1)) // 记录等于1的索引
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

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const { list, odds} = validateLineOnPlate(ComboStageSymbol, award.Symbol, award.GridVec);

                RoundWin += award.Win || 0;

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    list,
                    odds
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

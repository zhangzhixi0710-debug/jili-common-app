import { jiliAsset } from '@/utils/assets';
const WILD_ID = 16;
const OTHER_IMAGE = [11, 12, 13, 14, 15];
const COMMON_ID = 10;
// 构建符号图片路径

const buildSymbolImageUrl = (gameId, symbolId = 0, length) =>
    length
        ? jiliAsset(`images/intro/${gameId}/Symbol_${
              OTHER_IMAGE.includes(symbolId) ? COMMON_ID : symbolId
          }_${length}.webp`)
        : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolReverse(plateSymbol) {
    return plateSymbol.map(item => ({
        Col: item.Col.slice().reverse(),
    }));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row =>
        row.Col.map(item => buildSymbolImageUrl(gameId, item, row.Col.length))
    );
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
        const Col = plateSymbol[item.Col].Col;

        const result = Col.map((val, index) => (val === symbol || val === WILD_ID ? index : -1)) // 记录等于1的索引
            .filter(index => index !== -1); // 过滤掉无效项

        matchedCols.push({
            col: index,
            Col: result,
        });
    });

    // ? 转换为二维数组结构 [[0,1],[0,2],[2],[1]]
    const resultArray = matchedCols.map(item => item.Col);

    // 如果有中奖列则返回结果，否则空数组
    return resultArray.length > 0 ? resultArray : [];
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.RoundQueue.map((roundData, index) => {
        let isFrist = false;
        let bonusWin = 0;
        if (index === 0) {
            isFrist = true;
        }

        const PlateSymbol = generatePlateSymbolReverse(roundData.PlateSymbol);
        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || [])
            .filter(award => {
                const { Count = 0, Win = 0 } = award;
                if (!Count) {
                    bonusWin += Win;
                    return false;
                }
                return true;
            })
            .map((award, idx) => {
                const { Symbol = 0, GridVec = [] } = award;
                const list = validateLineOnPlate(PlateSymbol, Symbol, GridVec);

                return {
                    ...award,
                    uuid: uuid(),
                    list,
                };
            });

        return {
            ...roundData,
            isFrist,
            bonusWin,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: AwardDataVec && AwardDataVec.length ? roundData.RoundWin : 0,
            AwardDataVec,
        };
    });
    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = gameData?.RoundQueue ? processFreeQueue(gameData, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

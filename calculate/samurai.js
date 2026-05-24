import { jiliAsset } from '@/utils/assets';
const WILD_ID = [8, 9, 10, 11];
const MARGIN_NUMBER = 8;

export const buildSymbolImageUrl = (gameId, id) => {
    return id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";
};
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// ==========================================
// 88条固定Paylines
// ==========================================
const PAYLINES = [
    // 1?? 顶行（上横线）
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
    ],

    // 2?? 中行（中横线）
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
    ],

    // 3?? 底行（下横线）
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
    ],

    // 4?? 左上到右下（↘）
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
    ],

    // 5?? 左下到右上（↗）
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
    ],

    // 6?? V 形（上 → 中 → 下）
    [
        { col: 0, row: 0 },
        { col: 0, row: 1 },
        { col: 0, row: 2 },
    ],

    // 7?? 中竖线（垂直）
    [
        { col: 1, row: 0 },
        { col: 1, row: 1 },
        { col: 1, row: 2 },
    ],

    // 8?? 右竖线
    [
        { col: 2, row: 0 },
        { col: 2, row: 1 },
        { col: 2, row: 2 },
    ],
];

// ==========================================
// 辅助函数
function getLineByIndex(index) {
    return PAYLINES[index];
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.Col.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} Symbol 中奖符号
 * @returns {Object} 包含list和odds的对象
 */
function validateLineOnPlate(PlateSymbol, Symbol = 0) {
    const result = [];
    let continuous = true;

    for (let colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        const column = PlateSymbol[colIndex].Col || [];
        const winningRows = [];

        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
            const symbol = column[rowIndex];

            // 假设 WILD_ID 是通配符ID或通配符ID数组
            if (symbol === Symbol || WILD_ID.includes(symbol)) {
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

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

function transformPlateSymbol(data) {
    return data.map(item => {
        const col = item.Col;
        const firstValue = col[0];

        if (firstValue === 37) {
            return {
                Col: col.map((value, index) => (index === 0 ? value : value + MARGIN_NUMBER)),
            };
        } else if (firstValue === 38) {
            return {
                Col: col.map((value, index) => (index === 0 ? value : value + MARGIN_NUMBER * 2)),
            };
        } else {
            return item;
        }
    });
}

function processFreeQueue(gameData, gameId) {
    const plates = gameData.RoundQueue.map((roundData, roundIndex) => {
        let isFrist = false;
        if (roundIndex === 0) {
            isFrist = true;
        }

        let RoundWin = 0;
        let PlateSymbol = transformPlateSymbol(roundData.PlateSymbol);

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const AwardDataVec = (roundData.AwardDataVec || []).map(award => {
            const { Win = 0, Symbol = 0 } = award;

            const img = buildSymbolImageUrl(gameId, Symbol || 0);

            let { list, odds } = validateLineOnPlate(roundData.PlateSymbol, Symbol);

            RoundWin += Win || 0;

            return {
                Index: odds,
                uuid: uuid(),
                Win,
                list: list,
                img,
            };
        });

        return {
            ...roundData,
            isFrist,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec: sortByIndex([...AwardDataVec]),
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const rounds = processFreeQueue(gameData, gameId);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

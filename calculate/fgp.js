import { jiliAsset } from '@/utils/assets';
// src/utils/fgp.js

const WILD_ID = 7;

// 固定 5 条连线（只取前三列，第四列特殊转轴不算）
const LINES = [
    [
        [0, 1],
        [1, 1],
        [2, 1],
    ], // 中横
    [
        [0, 0],
        [1, 0],
        [2, 0],
    ], // 上横
    [
        [0, 2],
        [1, 2],
        [2, 2],
    ], // 下横
    [
        [0, 0],
        [1, 1],
        [2, 2],
    ], // ↘
    [
        [0, 2],
        [1, 1],
        [2, 0],
    ], // ↗
];

// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

// uuid
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * 根据后端 AwardDataVec 生成前端可用中奖数据
 * @param {Object} raw - 原始数据
 * @param {string} gameId - 游戏 ID
 */
export function computeAwardsFromServer(raw, gameId) {
    const plateSymbols = raw.PlateSymbol;
    const awardDataVec = raw.AwardDataVec;
    const grid = plateSymbols.slice(0, 3).map(c => c.Col); // 只取前三列
    const awards = [];
    let mainGameWin = 0;
    let luckyWheelWin = 0;
    let comboMultiple = raw.IsBonus ? raw.WheelMult : ""; // 默认主游戏倍数

    awardDataVec.forEach((award, idx) => {
        const lineIndex = award.Line;
        const line = LINES[lineIndex] || []; // 没有 Line 时可能为空
        const list = line.reduce((acc, [x, y]) => {
            acc[x] = acc[x] || [];
            acc[x].push(y);
            return acc;
        }, {});

        // 每个中奖都把第四列第二行加入高亮
        if (Object.keys(list).length > 0) {
            list[3] = list[3] || [];
            list[3].push(1);
        }

        // 处理 Wild 替代情况
        let displaySymbol = award.Symbol;
        if (award.Symbol === WILD_ID && line.length > 0) {
            const lineSymbols = line.map(([x, y]) => grid[x][y]);
            const nonWild = lineSymbols.find(s => s !== WILD_ID);
            if (nonWild !== undefined) displaySymbol = nonWild;
        }

        // 累加主游戏中奖（只计前三列）
        if (line.length > 0) mainGameWin += award.Win;

        // 检查第四列 WHEEL 奖金（单独统计 Lucky Wheel）
        if (!award.Line && award.Win > 0) {
            luckyWheelWin += award.Win;
        }

        awards.push({
            Symbol: displaySymbol,
            Win: award.Win,
            uuid: award.uuid || `award-${idx}`,
            img: buildSymbolImageUrl(gameId, displaySymbol),
            list,
        });
    });

    return {
        ...raw,
        uuid: raw.uuid || `round-${Date.now()}`,
        PlateSymbolExtend: raw.PlateSymbol.map((col, colIndex) =>
            col.Col.map(id => {
                // 如果 Extra 为 true 且是第四列，14 替换为 15
                if (raw.Extra && colIndex === 3 && id === 14) return 15;
                return id;
            }).map(id => buildSymbolImageUrl(gameId, id))
        ),
        AwardDataVec: awards,
        MainGameWin: mainGameWin,
        LuckyWheelWin: luckyWheelWin,
        ComboMultiple: comboMultiple,
    };
}

/**
 * 判断某格子是否为中奖格子，用于组件高亮
 */
export function isAwardActive(changeList, colIndex, rowIndex) {
    if (!changeList?.list) return false;
    return !!changeList.list[colIndex]?.includes(rowIndex);
}

// 主处理函数
export function processGameData(raw, gameId) {
    (raw.AwardDataVec || []).forEach((item, idx) => {
        item.uuid = uuid();
    });

    raw = { ...raw, uuid: uuid() };

    return computeAwardsFromServer(raw, gameId);
}

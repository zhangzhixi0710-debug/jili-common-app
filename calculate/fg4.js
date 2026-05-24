import { jiliAsset } from '@/utils/assets';
const WILD_ID = [7];

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
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";

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
    const awardDataVec = raw.AwardDataVec || [];
    const grid = plateSymbols.slice(0, 3).map(c => c.Col); // 前三列
    const awards = [];

    awardDataVec.forEach((award, idx) => {
        const lineIndex = award.Line || 0;
        const line = LINES[lineIndex] || [];
        const list = line.reduce((acc, [x, y]) => {
            acc[x] = acc[x] || [];
            acc[x].push(y);
            return acc;
        }, {});

        // 如果是连线中奖 → 高亮第四列中间
        if (line.length > 0) {
            list[3] = list[3] || [];
            list[3].push(1);
        }

        // Wild 替代
        let displaySymbol = award.Symbol;
        if (WILD_ID.includes(award.Symbol) && line.length > 0) {
            const lineSymbols = line.map(([x, y]) => grid[x][y]);
            const nonWild = lineSymbols.find(s => !WILD_ID.includes(s));
            if (nonWild !== undefined) displaySymbol = nonWild;
        }

        awards.push({
            Symbol: displaySymbol,
            Win: award.Win,
            Mult: award.Mult || 1,
            uuid: award.uuid || `award-${idx}`,
            img: buildSymbolImageUrl(gameId, displaySymbol),
            list,
        });
    });

    // 处理分裂符号 (Split)
    debugger
    const ROWS = 3;

    const PlateSymbolExtend = raw.PlateSymbol.map((col, colIndex) =>
        col.Col.map((id, rowIndex) => {
            // 当前格子在整体盘面的索引
            const posIndex = colIndex * ROWS + rowIndex;

            // 找到 Split 里匹配的配置（如果没有 Pos，则默认是 0）
            const splitInfo =
                raw.Split &&
                raw.Split.find(function (s) {
                    return (s.Pos !== undefined ? s.Pos : 0) === posIndex;
                });

            if (splitInfo) {
                if (splitInfo.Level === 1) {
                    id = id + 8; // 双符号
                } else if (splitInfo.Level === 2) {
                    id = id + 16; // 三符号
                }
            }

            return id;
        }).map(function (id) {
            return buildSymbolImageUrl(gameId, id);
        })
    );

    return {
        ...raw,
        uuid: raw.uuid || `round-${Date.now()}`,
        PlateSymbolExtend,
        AwardDataVec: awards,
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

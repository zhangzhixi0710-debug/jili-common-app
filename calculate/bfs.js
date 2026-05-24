import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = 12;
const SCATTER_ID = 11;
const MULTIPLIERS = new Set([13, 14, 15, 16]);

const symbolMap = {
    0: jiliAsset("images/intro/bfs/0.webp"), // 9
    1: jiliAsset("images/intro/bfs/1.webp"), // 10
    2: jiliAsset("images/intro/bfs/2.webp"), // J
    3: jiliAsset("images/intro/bfs/3.webp"), // Q
    4: jiliAsset("images/intro/bfs/4.webp"), // K
    5: jiliAsset("images/intro/bfs/5.webp"), // A
    6: jiliAsset("images/intro/bfs/6.webp"), // 鹿
    7: jiliAsset("images/intro/bfs/7.webp"), // 狼
    8: jiliAsset("images/intro/bfs/8.webp"), // 熊
    9: jiliAsset("images/intro/bfs/9.webp"), // 鹰
    10: jiliAsset("images/intro/bfs/A.webp"), // 野牛
    11: jiliAsset("images/intro/bfs/B.webp"), // SCATTER
    12: jiliAsset("images/intro/bfs/C.webp"), // WILD
    13: jiliAsset("images/intro/bfs/D.webp"), // 3X
    14: jiliAsset("images/intro/bfs/E.webp"), // 3X
    15: jiliAsset("images/intro/bfs/F.webp"), // 4X
    16: jiliAsset("images/intro/bfs/G.webp"), // 5X
};

// 序号转坐标（col, row），序号1开始，4行6列
function serialToPos(serial) {
    const col = Math.floor(serial / 4); // 0~5列
    const row = serial % 4; // 0~3行
    return { col, row };
}

// 根据SerialVec生成高亮list
function generateHighlightList(SerialVec) {
    const list = Array.from({ length: 6 }, () => []);

    SerialVec.forEach(serial => {
        const { col, row } = serialToPos(serial);
        if (!list[col].includes(row)) {
            list[col].push(row);
        }
    });

    return list;
}

function calcWinningSymbol(plateSymbol, serialVec) {
    // 取符号ID列表，支持StampedeSymbols替换可按需改造
    const symbols = serialVec.map(serial => {
        const { col, row } = serialToPos(serial);
        return plateSymbol[col].Col[row];
    });

    // 过滤普通符号（去除WILD、SCATTER和倍数符号）
    const filtered = symbols.filter(
        id => id !== WILD_ID && id !== SCATTER_ID && !MULTIPLIERS.has(id)
    );

    if (filtered.length === 0) {
        // 全是WILD/SCATTER/倍数，取第一个符号
        return symbols[0];
    }

    // 统计频率
    const freq = {};
    filtered.forEach(id => {
        freq[id] = (freq[id] || 0) + 1;
    });

    // 找最大频率
    const maxCount = Math.max(...Object.values(freq));
    const candidates = Object.entries(freq)
        .filter(([id, count]) => count === maxCount)
        .map(([id]) => Number(id));

    if (candidates.length === 1) return candidates[0];

    // 多个同频次，取最左出现
    for (const s of symbols) {
        if (candidates.includes(s)) return s;
    }

    // 兜底
    return symbols[0];
}

export function processFreeGameData(AckQueue = []) {
    return AckQueue.map((item, roundIndex) => {
        // 盘面数据
        const plateSymbol = item.PlateSymbol;

        // 生成 PlateSymbolExtend (图片二维数组)，4行6列
        const PlateSymbolExtend = []; // 6列， 每列4个符号

        for (let col = 0; col < plateSymbol.length; col++) {
            const colSymbols = [];
            for (let row = 0; row < plateSymbol[col].Col.length; row++) {
                const symbolId = plateSymbol[col].Col[row];
                colSymbols.push(symbolMap[symbolId]);
            }
            PlateSymbolExtend.push(colSymbols);
        }

        // 奖励数据
        const AwardDataVec = (item.AwardDataVec || []).map((award, idx) => {
            const numbers = calcWinningSymbol(plateSymbol, award.SerialVec);
            const img = symbolMap[numbers];
            const list = generateHighlightList(award.SerialVec);

            return {
                ...award,
                uuid: `${roundIndex}-${idx}`,
                numbers,
                img,
                list,
            };
        });

        return {
            PlateSymbolExtend,
            AwardDataVec,
            RoundWin: item.Win || 0,
            uuid: `round-${roundIndex}`,
        };
    });
}

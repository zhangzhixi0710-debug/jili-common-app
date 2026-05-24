import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;

// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/symbol_${id}.webp`) : "";

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
    // Line 1
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 2
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 3
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 5
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 6
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 7
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 8
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 10
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 11
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 12
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 14
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 15
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 16
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 18
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 22
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 23
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 24
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 25
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
];

const WinMap = {
    0: {
        3: 100,
        4: 200,
        5: 500,
    },
    1: {
        3: 70,
        4: 150,
        5: 300,
    },
    2: {
        3: 70,
        4: 150,
        5: 300,
    },
    3: {
        3: 50,
        4: 100,
        5: 200,
    },
    4: {
        3: 50,
        4: 100,
        5: 200,
    },
    5: {
        3: 30,
        4: 70,
        5: 150,
    },
    6: {
        3: 30,
        4: 70,
        5: 150,
    },
    7: {
        3: 20,
        4: 50,
        5: 100,
    },
    8: {
        3: 20,
        4: 50,
        5: 100,
    },
    9: {
        3: 10,
        4: 30,
        5: 70,
    },
    10: {
        3: 10,
        4: 30,
        5: 70,
    },
    11: {
        5: 1000,
    },
};

// ==========================================
// 辅助函数

function getLineByIndex(index) {
    return PAYLINES[index];
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].Row[col])
        )
    );
}

function validateLineOnPlate(plateSymbol, lineCells) {
    lineCells = lineCells.map(item => ({
        ...item,
        row: item.row + 1,
    }));

    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col].Row[p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => WILD_ID !== c.symbolId);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (targetId === c.symbolId || WILD_ID === c.symbolId) {
            matchedCells.push(c);
            count++;
        } else {
            // 遇到不匹配就中断，如果当前累计>=3，直接返回中奖
            if (count >= 3) break;
            count = 0;
            matchedCells.length = 0;
        }
    }

    return {
        ok: matchedCells.length >= 3,
        cells: matchedCells.length >= 3 ? matchedCells : [],
    };
}

function sortByIndex(arr) {
    return arr.sort((a, b) => a.Index - b.Index);
}

/**
 * 将数据从 Row 转换为 Col
 * @param {Array<{Row: number[]}>} data - 输入数据
 * @returns {Array<{Row: number[]}>} 转换后的数据
 */
function transposeData(data) {
    if (!data || data.length === 0) return [];

    return data[0].Row.map((_, colIndex) => ({
        Row: data.map(item => item.Row[colIndex]),
    }));
}
/**
 * 将 data2 中的指定值（WILD_ID）替换为 13，并将转换后的结果
 * 作为新对象插入到 data 的第一个位置
 *
 * @param {Array} data - 原始 data 数组，例如 [{ Row: [...] }, ...]
 * @param {Array} data2 - 待处理的数组，例如 [12, 12, 11, 17, 17]
 * @param {number} WILD_ID - 要查找替换的值
 * @returns {Array} 新的数组（不会修改原始 data）
 */
function insertDataAtFirst(data, data2, WILD_ID = 11) {
    // 1. 浅拷贝 data，避免直接修改原始数据
    const newData = data.map(item => ({ Row: [...item.Row] }));

    // 2. 找到 data2 中所有 WILD_ID 的索引
    const indices = data2.map((v, idx) => (v === WILD_ID ? idx : -1)).filter(idx => idx !== -1);

    // 3. 替换 newData 中对应索引的值为 WILD_ID
    if (indices.length > 0) {
        newData.forEach(item => {
            indices.forEach(idx => {
                item.Row[idx] = WILD_ID;
            });
        });
    }

    // 4. 将 data2 中的 11 替换成 13
    const transformed = data2.map(v => (v === WILD_ID ? 13 : v));

    // 5. 插入转换后的 data2 到 newData 第一个位置
    newData.unshift({ Row: transformed });

    // 6. 返回转置后的结果
    return transposeData(newData);
}

// ==========================================
// MainGame + FreeQueue 处理
// ==========================================
function processMainGame(PlateInfo, gameId) {
    const MergeBaoPlateT = insertDataAtFirst(PlateInfo.BaoPlateT, PlateInfo.BaoEventPlate);

    const PlateSymbolExtend = generatePlateSymbolExtend(MergeBaoPlateT, gameId);

    const AwardInfos = PlateInfo.AwardInfos || [];

    const totalOdds = AwardInfos.reduce((sum, item) => sum + (item.Odds || 1), 0);
    const singleWin = PlateInfo.MainWin / totalOdds;

    const AwardDataVec = AwardInfos.map((award, idx) => {
        const { LineIndex = 0, Odds = 0, AwardSymbol } = award;
        const line = getLineByIndex(LineIndex);
        const awardsDetail = line ? validateLineOnPlate(MergeBaoPlateT, line).cells : [];

        award.Index = LineIndex + 1;

        return {
            ...award,
            uuid: uuid(),
            Money: singleWin * (Odds || 1),
            img: buildSymbolImageUrl(gameId, AwardSymbol),
            list: generateHighlightListFromWinning(awardsDetail),
        };
    });

    let bet = 0;
    AwardDataVec.forEach(item => {
        let count = item.list.filter(arr => arr.length > 0).length;
        count = Math.min(count, 5);

        if (WinMap[item.AwardSymbol] && WinMap[item.AwardSymbol][count]) {
            item.bet = WinMap[item.AwardSymbol][count];

            bet += item.bet;
        }
    });

    const mul = PlateInfo.MainWin / bet;
    AwardDataVec.forEach(item => {
        item.Money = mul * item.bet;
    });

    return {
        ...PlateInfo,
        AwardDataVec: sortByIndex(AwardDataVec),
        PlateSymbolExtend,
        MainWin: PlateInfo.MainWin,
        uuid: uuid(),
    };
}

function processFreeQueue(FreeGame, gameId) {
    const FreeQueue = FreeGame.FreeGamePlateInfo || [];

    const plates = FreeQueue.map((roundData, roundIndex) => {
        const MergePlateT = insertDataAtFirst(roundData.PlateT, roundData.EventPlate);

        const PlateSymbolExtend = generatePlateSymbolExtend(MergePlateT, gameId);
        const AwardInfos = roundData.AwardInfos || [];

        const totalOdds = AwardInfos.reduce((sum, item) => sum + (item.Odds || 1), 0);
        const singleWin = roundData.AwardPrize / totalOdds;

        let AwardDataVec = AwardInfos.map((award, idx) => {
            const { LineIndex = 0, Odds = 0, AwardSymbol } = award;
            const line = getLineByIndex(LineIndex);

            const awardsDetail = line ? validateLineOnPlate(MergePlateT, line).cells : [];

            award.Index = LineIndex + 1;

            return {
                ...award,
                uuid: uuid(),
                Money: singleWin * (Odds || 1),
                img: buildSymbolImageUrl(gameId, AwardSymbol),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });

        let bet = 0;
        AwardDataVec.forEach(item => {
            const { list,  AwardSymbol = 0} =  item
            let count = list.filter(arr => arr.length > 0).length;
            count = Math.min(count, 5);

            if (WinMap[AwardSymbol || 0] && WinMap[AwardSymbol][count]) {
                item.bet = WinMap[AwardSymbol][count];

                bet += item.bet;
            }
        });

        const mul = roundData.AwardPrize / bet;
        AwardDataVec.forEach(item => {
            item.Money = mul * item.bet;
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: roundData.AwardPrize,
            AwardDataVec: sortByIndex(AwardDataVec),
        };
    });
    return {
        ...FreeGame,
        uuid: uuid(),
        plates,
    };
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const MainGame = gameData.PlateInfo ? processMainGame(gameData.PlateInfo, gameId) : [];
    const rounds = gameData?.PlateInfo?.FreeGamePackage
        ? processFreeQueue(gameData?.PlateInfo?.FreeGamePackage, gameId)
        : null;

    gameData.isFreeGame = gameData?.PlateInfo?.FreeGamePackage?.FreeGamePlateInfo;

    MainGame.freeCount = rounds?.Times;

    return {
        ...gameData,
        uuid: uuid(),
        MainGame,
        rounds,
    };
}

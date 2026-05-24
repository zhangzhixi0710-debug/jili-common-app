import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id !== "none" ? jiliAsset(`images/intro/${gameId}/Symbol${id ? id : 0}.webp`) : "";

// uuid
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const PAYTABLE = {
    0: "WILD",
    1: "WILD",
    2: "XYY",
    3: "招财进宝",
    4: "红包",
    5: "A",
    6: "K",
    7: "Q",
    8: "J",
    9: "10",
};

const PAYTABLEAMOUNT = {
    0: {
        3: 2.2,
        4: 9.7,
        5: 22.2,
    },
    1: {
        3: 2.2,
        4: 9.7,
        5: 22.2,
    },
    2: {
        3: 1,
        4: 3,
        5: 7,
    },
    3: {
        3: 0.8,
        4: 2.4,
        5: 5.6,
    },
    4: {
        3: 0.6,
        4: 1.8,
        5: 4.2,
    },
    5: {
        3: 0.3,
        4: 0.9,
        5: 2.1,
    },
    6: {
        3: 0.2,
        4: 0.6,
        5: 1.4,
    },
    7: {
        3: 0.2,
        4: 0.6,
        5: 1.4,
    },
    8: {
        3: 0.1,
        4: 0.3,
        5: 0.7,
    },
    9: {
        3: 0.1,
        4: 0.3,
        5: 0.7,
    },
};

// ==========================================
// 88条固定Paylines
// ==========================================
const PAYLINES = [
    // Line 1
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 2
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 3
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 4
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 5
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 6
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 7
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 8
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 9
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 10
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 11
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 12
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 14
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 15
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 16
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 18
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 21
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 24
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 25
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 26
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 27
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 28
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 29
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 30
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 31
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 32
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 33
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 34
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 35
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 36
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 37
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 38
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 39
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 40
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
];

function processComboChanges(column) {
    column.forEach((comboItem, index) => {
        if (index === 0 || index === column.length - 1) {
            comboItem.row.unshift({
                symbol: "none",
            });
        }
    });

    return column;
}

function matchPayline(winData) {
    let matchedLines = "";

    PAYLINES.forEach((line, idx) => {
        let isMatch = true;

        for (let col = 0; col < line.length; col++) {
            const rows = winData[col];
            if (!rows || rows.length === 0) continue; // 空列忽略
            if (!rows.includes(line[col].row)) {
                isMatch = false;
                break;
            }
        }

        if (isMatch) {
            matchedLines = idx + 1; // line 编号从1开始
        }
    });

    return matchedLines;
}

function findAllWins(data) {
    const colCount = data.length;
    const firstColRows = data[0].row;

    // 找到第0列所有 isConnect = true 的起点 row
    const startRows = firstColRows
        .map((item, idx) => (item.isConnect ? idx : -1))
        .filter(idx => idx !== -1);

    const allWins = [];

    // 对每一个起点独立计算中奖
    for (const startRow of startRows) {
        const result = Array.from({ length: colCount }, () => []);

        // 第0列 symbol（从当前起点行取）
        const startItem = firstColRows[startRow];
        const targetSymbol = startItem.symbol ? startItem.symbol : null;

        // 第0列中奖
        result[0].push(startRow);

        // 向右处理剩下列
        for (let col = 1; col < colCount; col++) {
            const rows = data[col].row;

            rows.forEach((item, rowIdx) => {
                if (!item.isConnect) return;

                const curSymbol = item.symbol ? item.symbol : null;

                // 匹配条件：相同 symbol 或 symbol 不存在
                if (!curSymbol || curSymbol === targetSymbol) {
                    result[col].push(rowIdx);
                }
            });
        }

        allWins.push({
            uuid: uuid(),
            list: result,
            symbolId: targetSymbol,
            Index: matchPayline(result),
        });
    }

    return allWins;
}

function parseSymbolString(symbolStr) {
    if (!symbolStr || typeof symbolStr !== "string") return null;
    const m = symbolStr.match(/Symbol(\d+)/);
    return m ? parseInt(m[1], 10) : null;
}

// 计算某条线的金额（返回金额）
function calcLineWinAmount(symbolId, count, betPerLine) {
    if (symbolId == null || !PAYTABLEAMOUNT[symbolId]) return 0;
    const multiplier = PAYTABLEAMOUNT[symbolId][count] || 0;
    return {
        multiplier,
        amount: +(multiplier * betPerLine).toFixed(4) // 保留足够小数，方便累加校验
    };
}

function getWinSymbolId(list, data) {
    // 遍历每一列，优先取该列匹配的第一个有 symbol 的位置
    for (let col = 0; col < list.length; col++) {
        const rows = list[col];
        if (!rows || rows.length === 0) continue;
        for (let r = 0; r < rows.length; r++) {
            const rowIndex = rows[r];
            const cell = data[col].row[rowIndex];
            if (cell && cell.symbol) {
                const id = parseSymbolString(cell.symbol);
                if (id != null) return id;
            }
        }
    }
    // 如果一直没找到实符号，视为 WILD（id 0）
    return 0;
}

function countConnectedColumns(list) {
    let cnt = 0;
    for (let col = 0; col < list.length; col++) {
        if (list[col] && list[col].length > 0) cnt++;
        else break;
    }
    return cnt;
}

function appendWinAmount(AwardDataVec, data, bet, paylineCount = PAYLINES.length) {
    // betPerLine
    const betPerLine = bet / paylineCount;

    return AwardDataVec.map(win => {
        const { list } = win;
        const symbolId = getWinSymbolId(list, data); // number
        const count = countConnectedColumns(list); // 3/4/5...
        const calc = calcLineWinAmount(symbolId, count, betPerLine);

        return {
            ...win,
            SymbolId: symbolId,
            SymbolName: PAYTABLE[symbolId] || null,
            Count: count,
            Multiplier: calc.multiplier,
            win: calc.amount, // 单线金额（基于 betPerLine）
        };
    });
}

export function processFreeGameData(Plates = {}, gameId, Bet) {
    let raw = Plates.plate.map(item => {
        return {
            ...item,
            column: processComboChanges(item.column),
        };
    });

    const data = [];

    raw.map(item => {
        // 盘面数据
        const plateSymbol = item.column;

        // 生成 PlateSymbolExtend (图片二维数组)，4行6列
        const PlateSymbolExtend = []; // 6列， 每列4个符号

        for (let col = 0; col < plateSymbol.length; col++) {
            const colSymbols = [];
            for (let row = 0; row < plateSymbol[col].row.length; row++) {
                const symbolId = plateSymbol[col].row[row];
                colSymbols.push(buildSymbolImageUrl(gameId, symbolId.symbol));
            }
            PlateSymbolExtend.push(colSymbols);
        }

        let AwardDataVec = [];
        if (item.win) {
            AwardDataVec = findAllWins(plateSymbol);

            AwardDataVec = appendWinAmount(AwardDataVec, plateSymbol, Bet, PAYLINES.length);
        }

        data.push({
            ...item,
            PlateSymbolExtend,
            AwardDataVec,
            RoundWin: item.win,
            uuid: uuid(),
        });
    });

    return {
        uuid: uuid(),
        MainInfo: [data[0]],
        rounds: data.slice(1),
    };
}

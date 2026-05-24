import { jiliAsset } from '@/utils/assets';
const WILD_ID = 0;

export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${id}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) =>
            buildSymbolImageUrl(gameId, plateSymbol[row].row[col].symbol)
        )
    );
}

/**
 * 计算每列中奖符号在列中的具体行索引（左到右连续）
 * @param {Array} PlateSymbol 每列符号二维数组
 * @param {number} awardSymbol 中奖符号
 * @returns {Array} list 每列中奖符号行索引数组，未中奖列为空数组
 */
function calcWinningColumnsRows(PlateSymbol, awardSymbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < PlateSymbol.length && continuous; colIndex++) {
        var row = PlateSymbol[colIndex].row || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < row.length; rowIndex++) {
            var col = row[rowIndex];

            if (
                col.isConnect &&
                (!col.symbol || col.symbol === awardSymbol || col.symbol === WILD_ID)
            ) {
                winningRows.push({ rowIndex: rowIndex });
            }
        }

        if (winningRows.length) {
            list[colIndex] = winningRows;
        } else {
            continuous = false; // 中断
        }
    }

    let result = list.map(function (winningRows) {
        if (!winningRows) return [];
        var rowIndexes = [];

        for (var i = 0; i < winningRows.length; i++) {
            rowIndexes.push(winningRows[i].rowIndex);
        }

        return rowIndexes;
    });

    let odds = result.reduce((acc, arr) => acc * arr.length, 1);

    return { list: result, odds: odds };
}

function getConnectedSymbols(columns) {
    const result = new Set();

    columns.forEach(col => {
        col.row.forEach(cell => {
            let symbol = cell.symbol;

            if (symbol === undefined || symbol === null) {
                symbol = 0;
            }

            if (cell.isConnect === true && symbol !== 0) {
                result.add(symbol);
            }
        });
    });

    return Array.from(result);
}

const symbolDes = 3;
const symbolWild = 0;
let symbolWinMap = new Map([
    [0, new Map([[5, 13.5]])], // wild
    [
        2,
        new Map([
            [3, 0.5],
            [4, 1.2],
            [5, 4.2],
        ]),
    ], // 9
    [
        3,
        new Map([
            [3, 0.9],
            [4, 1.2],
            [5, 4.2],
        ]),
    ], // 10
    [
        4,
        new Map([
            [3, 0.9],
            [4, 1.2],
            [5, 4.2],
        ]),
    ], // J
    [
        5,
        new Map([
            [3, 1.2],
            [4, 1.5],
            [5, 4.8],
        ]),
    ], // Q
    [
        6,
        new Map([
            [3, 1.2],
            [4, 1.5],
            [5, 4.8],
        ]),
    ], // K
    [
        7,
        new Map([
            [3, 1.2],
            [4, 1.5],
            [5, 4.8],
        ]),
    ], // A
    [
        8,
        new Map([
            [3, 1.8],
            [4, 4.5],
            [5, 5.4],
        ]),
    ], // 樱桃
    [
        9,
        new Map([
            [3, 2.1],
            [4, 6.3],
            [5, 8.1],
        ]),
    ], // 橘子
    [
        10,
        new Map([
            [3, 3.0],
            [4, 6.9],
            [5, 9.6],
        ]),
    ], // 铃铛
    [
        11,
        new Map([
            [3, 4.5],
            [4, 7.5],
            [5, 10.8],
        ]),
    ], // bar
    [
        12,
        new Map([
            [3, 6.0],
            [4, 9.0],
            [5, 13.5],
        ]),
    ], // 7
]);

function ExplainOnePlate(plate, bet) {
    const result = new Map();
    const columns = plate.column ? plate.column : [];

    // 收集所有列中出现的唯一 symbol（对应 Go 的 firstColValue 收集逻辑）
    const allSymbols = new Set();
    for (const col of columns) {
        let row = col.row ? col.row : [];
        for (const cell of row) {
            allSymbols.add(cell.symbol ? cell.symbol : 0);
        }
    }

    // 遍历每个 symbol，计算 ways 赢分
    for (const symbol of allSymbols) {
        let ways = 1;
        let count = 0;

        for (const col of columns) {
            let colNum = 0;
            let row = col.row ? col.row : [];
            for (const cell of row) {
                const s = cell.symbol ? cell.symbol : 0;
                if (s === symbol || s === symbolWild) {
                    colNum++;
                }
            }
            if (colNum === 0) {
                break;
            }
            ways *= colNum;
            count++;
        }

        const winForCount = symbolWinMap.get(symbol)?.get(count);
        if (winForCount !== undefined && winForCount > 0) {
            const win = (winForCount * bet * ways) / symbolDes;
            result.set(symbol, win);
        }
    }

    return result;
}

function processFreeQueue(gameData, gameId, Bet) {
    const RoundQueue = gameData.plate || [];
    const plates = RoundQueue.map((roundData, index) => {
        let RoundWin = roundData.win;

        const PlateSymbol = roundData.column;

        const PlateSymbolExtend = generatePlateSymbolExtend(PlateSymbol, gameId);

        const symbolList = getConnectedSymbols(PlateSymbol);

        const winMap = ExplainOnePlate(roundData, Bet);

        const AwardDataVec = symbolList.map(Symbol => {
            const img = buildSymbolImageUrl(gameId, Symbol);

            // 计算中奖列索引（左到右连续）
            const { list, odds } = calcWinningColumnsRows(PlateSymbol, Symbol);

            return {
                uuid: uuid(),
                img,
                Win: winMap.get(Symbol),
                list,
                odds,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin,
            AwardDataVec,
        };
    });

    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId, Bet) {
    const rounds = processFreeQueue(gameData, gameId, Bet);

    return {
        ...gameData,
        uuid: uuid(),
        rounds,
    };
}

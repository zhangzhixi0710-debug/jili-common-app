import { jiliAsset } from '@/utils/assets';
const WILD_ID = 11;
// 构建符号图片路径

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    symbolId || symbolId === 0 ? jiliAsset(`images/intro/${gameId}/${symbolId}.webp`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.Row.map(item => buildSymbolImageUrl(gameId, item)));
}

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 3 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generateComboStageData(PlateShow) {
    const rows = PlateShow.map(item => item.Row);

    const colLen = rows[0].length;
    return Array.from({ length: colLen }, (_, colIndex) => ({
        Row: rows.map(r => r[colIndex]),
    }));
}

function validateLineOnPlate(plateSymbol, symbol) {
    var list = [];
    var continuous = true;

    for (var colIndex = 0; colIndex < plateSymbol.length && continuous; colIndex++) {
        var column = plateSymbol[colIndex].Row || [];
        var winningRows = [];

        for (var rowIndex = 0; rowIndex < column.length; rowIndex++) {
            var Symbol = column[rowIndex];

            if (Symbol === symbol || Symbol === WILD_ID) {
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

function processFreeQueue(gameData, gameId) {
    let freeInfo = [];
    if (gameData.FreePlateInfo?.length) {
        freeInfo = gameData.FreePlateInfo;
    } else {
        freeInfo = [gameData.PlateInfo];
    }

    const plates = freeInfo.map((roundData, index) => {
        let PlateShow = roundData.PlateShow;
        const PlateSymbolExtend = generatePlateSymbolExtend(PlateShow, gameId);

        const AwardDataVec = (roundData.AwardDataList || []).map((award, idx) => {
            const { AwardMoney = 0, Symbol = 0 } = award;

            const img = buildSymbolImageUrl(gameId, Symbol || 0);

            const { list, odds } = validateLineOnPlate(PlateShow, Symbol);

            return {
                ...award,
                Index: odds,
                uuid: uuid(),
                Win: AwardMoney,
                list,
                img,
            };
        });

        return {
            ...roundData,
            uuid: uuid(),
            PlateSymbolExtend,
            RoundWin: roundData.WinMoney,
            AwardDataVec,
        };
    });
    return plates;
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    let rounds = processFreeQueue(gameData, gameId);

    if (gameData.FreePlateInfo?.length > 1) {
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

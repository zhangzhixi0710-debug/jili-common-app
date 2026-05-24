import { jiliAsset } from '@/utils/assets';
const WILD_ID = 10;
const DEFAULT_HEADER = "xx";

// ==========================================
// 88条固定Paylines
// ==========================================
const PAYLINES = [
    // Line 1
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 2
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 3
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 4
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 5
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 6
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 7
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 8
    [
        { col: 0, row: 4 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 4 },
    ],
    // Line 9
    [
        { col: 0, row: 0 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 0 },
    ],
    // Line 10
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 1 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 11
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 12
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 13
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 4 },
        { col: 3, row: 2 },
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
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 16
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 17
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 18
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 19
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 20
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 21
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 22
    [
        { col: 0, row: 2 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 2 },
    ],
    // Line 23
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 24
    [
        { col: 0, row: 1 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 1 },
    ],
    // Line 25
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 26
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 37
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 28
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 29
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 30
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 31
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 32
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 33
    [
        { col: 0, row: 3 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 3 },
    ],
    // Line 34
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 4 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 35
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 36
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 37
    [
        { col: 0, row: 4 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 4 },
    ],
    // Line 38
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 39
    [
        { col: 0, row: 4 },
        { col: 1, row: 2 },
        { col: 2, row: 2 },
        { col: 3, row: 2 },
        { col: 4, row: 4 },
    ],
    // Line 40
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 41
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 0 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 42
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 43
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 44
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 45
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 46
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 47
    [
        { col: 0, row: 2 },
        { col: 1, row: 2 },
        { col: 2, row: 3 },
        { col: 3, row: 2 },
        { col: 4, row: 2 },
    ],
    // Line 48
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 49
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 2 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 57
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 58
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 2 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 59
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 60
    [
        { col: 0, row: 4 },
        { col: 1, row: 2 },
        { col: 2, row: 4 },
        { col: 3, row: 2 },
        { col: 4, row: 4 },
    ],
    // Line 61
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 62
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 63
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 64
    [
        { col: 0, row: 4 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 4 },
    ],
    // Line 65
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 66
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 67
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 68
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 69
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 70
    [
        { col: 0, row: 4 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 4 },
    ],
    // Line 71
    [
        { col: 0, row: 0 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 0 },
    ],
    // Line 72
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 73
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 74
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 75
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 76
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 77
    [
        { col: 0, row: 0 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 0 },
    ],
    // Line 78
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 79
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 80
    [
        { col: 0, row: 4 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 4 },
    ],
    // Line 81
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 82
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 4 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 83
    [
        { col: 0, row: 4 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 4 },
    ],
    // Line 84
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 85
    [
        { col: 0, row: 2 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 2 },
    ],
    // Line 86
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 87
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 88
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 89
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 90
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 91
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 92
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 93
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 94
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
];

function getLineByIndex(index) {
    return PAYLINES[index];
}

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    symbolId || symbolId === 0
        ? jiliAsset(`images/intro/${gameId}/symbol_${symbolId}.webp`)
        : "";

const buildNumImageUrl = (gameId, num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/${gameId}/${num}.webp`) : "";

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(symbolId => buildSymbolImageUrl(gameId, symbolId)));
}

function generateComboStageData(ComboStageSymbol) {
    return ComboStageSymbol.map(item => [...item.Col].reverse());
}

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(gameId, data) {
    // 先把数字转换为字符串，然后拆成单个字符，再转换为数字
    const digits = String(data).split("").map(Number);

    // 调用 buildNumImageUrl 生成图片路径
    const images = digits.map(num => buildNumImageUrl(gameId, num));

    // 在第一个位置插入 buildNumImageUrl(gameId, 'X')
    images.unshift(buildNumImageUrl(gameId, "xx"));

    return images;
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.col][p.row],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => c.symbolId !== WILD_ID);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (c.symbolId === targetId || c.symbolId === WILD_ID) {
            matchedCells.push({ ...c });
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

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        let BonusWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map((plate, plateIndex) => {
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const { Index = 0, Symbol = 0 } = award;
                const img = buildSymbolImageUrl(gameId, Symbol || 0);
                const line = getLineByIndex(Index);
                const awardsDetail = validateLineOnPlate(ComboStageSymbol, line).cells;

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    line: JSON.stringify(line),
                    Index: Index + 1,
                    list: awardsDetail?.length
                        ? generateHighlightListFromWinning(awardsDetail)
                        : undefined,
                };
            });

            let RoundMultImages = [];
            if (plate.Mul) {
                RoundMultImages = getSymbolImages(gameId, plate.Mul);
            }

            plate.NowUpperMul = ["", ...plate.NowUpperMul, ""];

            const result = plate.NowUpperMul.map(num => {
                if (num === "" || num === null || num === undefined) {
                    return []; // 空值 → 空数组
                }

                const sub = [DEFAULT_HEADER]; // 每个有值的前面都加 img

                if (num >= 10) {
                    // 拆分多位数字
                    const digits = num.toString().split("").map(Number);
                    sub.push(...digits);
                } else {
                    sub.push(num);
                }

                return sub;
            });

            const HeaderImage = result.map(arr => arr.map(item => buildNumImageUrl(gameId, item)));

            return {
                ...plate,
                uuid: uuid(),
                RoundMultImages,
                PlateSymbolExtend,
                AwardDataVec,
                HeaderImage,
            };
        });

        RoundWin = roundData.RoundWin ? roundData.RoundWin : RoundWin;

        return {
            ...roundData,
            isFrist,
            BonusWin,
            RoundWin,
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

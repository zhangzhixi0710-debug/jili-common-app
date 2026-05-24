import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = 10;
const SCATTER_ID = 11;

const symbolMap = {
    0: jiliAsset("images/intro/bk/symbol_0.webp"), // J
    1: jiliAsset("images/intro/bk/symbol_1.webp"), // Q
    2: jiliAsset("images/intro/bk/symbol_2.webp"), // K
    3: jiliAsset("images/intro/bk/symbol_3.webp"), // A
    4: jiliAsset("images/intro/bk/symbol_4.webp"), // 蓝色裤子
    5: jiliAsset("images/intro/bk/symbol_5.webp"), // 红色裤子
    6: jiliAsset("images/intro/bk/symbol_6.webp"), // 蓝色拳头
    7: jiliAsset("images/intro/bk/symbol_7.webp"), // 红色拳头
    8: jiliAsset("images/intro/bk/symbol_8.webp"), // 蓝色人头像
    9: jiliAsset("images/intro/bk/symbol_9.webp"), // 红色人头像
    10: jiliAsset("images/intro/bk/symbol_A.webp"), // WILD
    11: jiliAsset("images/intro/bk/symbol_B.webp"), // SCATTER
    12: jiliAsset("images/intro/bk/symbol_C.webp"), // FREESPW
};

const SYMBOL_NAME_MAP = {
    0: "J",
    1: "Q",
    2: "K",
    3: "A",
    4: "蓝色裤子",
    5: "红色裤子",
    6: "蓝色拳头",
    7: "红色拳头",
    8: "蓝色人头像",
    9: "红色人头像",
    10: "WILD",
    11: "SCATTER",
    12: "FREESPIN",
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
    // Line 50
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 2 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 51
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 2 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 52
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 53
    [
        { col: 0, row: 4 },
        { col: 1, row: 2 },
        { col: 2, row: 4 },
        { col: 3, row: 2 },
        { col: 4, row: 4 },
    ],
    // Line 54
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 55
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 56
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 57
    [
        { col: 0, row: 4 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 4 },
    ],
    // Line 58
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 59
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 60
    [
        { col: 0, row: 3 },
        { col: 1, row: 1 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 3 },
    ],
    // Line 61
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 3 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 62
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 63
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 64
    [
        { col: 0, row: 4 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 4 },
    ],
    // Line 65
    [
        { col: 0, row: 0 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 0 },
    ],
    // Line 66
    [
        { col: 0, row: 3 },
        { col: 1, row: 0 },
        { col: 2, row: 0 },
        { col: 3, row: 0 },
        { col: 4, row: 3 },
    ],
    // Line 67
    [
        { col: 0, row: 1 },
        { col: 1, row: 4 },
        { col: 2, row: 4 },
        { col: 3, row: 4 },
        { col: 4, row: 1 },
    ],
    // Line 68
    [
        { col: 0, row: 4 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 4 },
    ],
    // Line 69
    [
        { col: 0, row: 0 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 0 },
    ],
    // Line 70
    [
        { col: 0, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
    ],
    // Line 71
    [
        { col: 0, row: 0 },
        { col: 1, row: 4 },
        { col: 2, row: 3 },
        { col: 3, row: 4 },
        { col: 4, row: 0 },
    ],
    // Line 72
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 73
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 74
    [
        { col: 0, row: 4 },
        { col: 1, row: 1 },
        { col: 2, row: 2 },
        { col: 3, row: 1 },
        { col: 4, row: 4 },
    ],
    // Line 75
    [
        { col: 0, row: 0 },
        { col: 1, row: 3 },
        { col: 2, row: 2 },
        { col: 3, row: 3 },
        { col: 4, row: 0 },
    ],
    // Line 76
    [
        { col: 0, row: 0 },
        { col: 1, row: 2 },
        { col: 2, row: 4 },
        { col: 3, row: 2 },
        { col: 4, row: 0 },
    ],
    // Line 77
    [
        { col: 0, row: 4 },
        { col: 1, row: 2 },
        { col: 2, row: 0 },
        { col: 3, row: 2 },
        { col: 4, row: 4 },
    ],
    // Line 78
    [
        { col: 0, row: 2 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 2 },
    ],
    // Line 79
    [
        { col: 0, row: 2 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 2 },
    ],
    // Line 80
    [
        { col: 0, row: 4 },
        { col: 1, row: 4 },
        { col: 2, row: 1 },
        { col: 3, row: 4 },
        { col: 4, row: 4 },
    ],
    // Line 81
    [
        { col: 0, row: 0 },
        { col: 1, row: 0 },
        { col: 2, row: 3 },
        { col: 3, row: 0 },
        { col: 4, row: 0 },
    ],
    // Line 82
    [
        { col: 0, row: 1 },
        { col: 1, row: 1 },
        { col: 2, row: 0 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
    ],
    // Line 83
    [
        { col: 0, row: 3 },
        { col: 1, row: 3 },
        { col: 2, row: 4 },
        { col: 3, row: 3 },
        { col: 4, row: 3 },
    ],
    // Line 84
    [
        { col: 0, row: 3 },
        { col: 1, row: 4 },
        { col: 2, row: 0 },
        { col: 3, row: 4 },
        { col: 4, row: 3 },
    ],
    // Line 85
    [
        { col: 0, row: 1 },
        { col: 1, row: 0 },
        { col: 2, row: 4 },
        { col: 3, row: 0 },
        { col: 4, row: 1 },
    ],
    // Line 86
    [
        { col: 0, row: 2 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 2 },
    ],
    // Line 87
    [
        { col: 0, row: 2 },
        { col: 1, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 4, row: 2 },
    ],
    // Line 88
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

function generateHighlightListFromWinning(winningCells) {
    const list = Array.from({ length: 5 }, () => []);
    winningCells.forEach(c => list[c.col].push(c.row));
    return list.map(arr => Array.from(new Set(arr)).sort((a, b) => a - b));
}

function generatePlateSymbolExtend(plateSymbol) {
    const reversedData = plateSymbol.map(item => ({
        Row: item.Row.slice().reverse(),
    }));

    const colCount = reversedData[0].Row.length;

    const result = Array.from({ length: colCount }, (_, colIndex) => ({
        Row: reversedData.map(row => row.Row[colIndex]),
    }));

    return Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => symbolMap[result[col].Row[row]])
    );
}

function generatePlateSymbolExtendArray(plateSymbol) {
    const reversedData = plateSymbol.map(item => ({
        Row: item.Row.slice().reverse(),
    }));

    const colCount = reversedData[0].Row.length;

    return Array.from({ length: colCount }, (_, colIndex) => ({
        Row: reversedData.map(row => row.Row[colIndex]),
    }));
}

function validateLineOnPlate(plateSymbol, lineCells) {
    const cellsWithId = lineCells.map(p => ({
        col: p.col,
        row: p.row,
        symbolId: plateSymbol[p.row].Row[p.col],
    }));

    // 找到第一个非 WILD/SCATTER 符号作为目标符号
    const targetCell = cellsWithId.find(c => c.symbolId !== WILD_ID && c.symbolId !== SCATTER_ID);
    const targetId = targetCell ? targetCell.symbolId : WILD_ID;

    let count = 0;
    const matchedCells = [];

    for (let i = 0; i < cellsWithId.length; i++) {
        const c = cellsWithId[i];
        if (c.symbolId === targetId || c.symbolId === WILD_ID) {
            matchedCells.push({ ...c, symbolName: SYMBOL_NAME_MAP[c.symbolId] });
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

// ==========================================
// MainInfo + FreeQueue 处理
// ==========================================
function processMainInfo(mainInfo) {
    const PlateQueue = mainInfo.PlateQueue || [];
    return PlateQueue.map((plate, plateIndex) => {
        const PlateSymbolExtend = generatePlateSymbolExtend(plate.PlateSymbol);
        const PlateSymbolExtendArray = generatePlateSymbolExtendArray(plate.PlateSymbol);
        
        const AwardDataList = (plate.AwardDataList || []).map((award, idx) => {
            const { Index = 0, Money } = award;
            const line = getLineByIndex(Index);
            const awardsDetail = line
                ? validateLineOnPlate(PlateSymbolExtendArray, line).cells
                : [];

            award.Index = Index + 1;

            return {
                ...award,
                uuid: uuid(),
                list: generateHighlightListFromWinning(awardsDetail),
            };
        });
        return {
            ...plate,
            AwardDataList,
            PlateSymbolExtend,
            uuid: uuid(),
        };
    });
}

function processFreeQueue(freeInfo) {
    const FreeQueue = freeInfo.FreeQueue || [];
    return FreeQueue.map((roundData, roundIndex) => {
        let RoundWin = 0;
        const uid = uuid();
        const FreePlateQueue = roundData.FreePlateQueue || [];

        const plates = FreePlateQueue.map((plate, plateIndex) => {
            const PlateSymbolExtend = generatePlateSymbolExtend(plate.PlateSymbol);
            const PlateSymbolExtendArray = generatePlateSymbolExtendArray(plate.PlateSymbol);

            const AwardDataList = (plate.AwardDataList || []).map((award, idx) => {
                const { Index = 0, Money } = award;
                const line = getLineByIndex(Index);

                const awardsDetail = line
                    ? validateLineOnPlate(PlateSymbolExtendArray, line).cells
                    : [];

                RoundWin += Money || 0;

                award.Index = Index + 1;

                return {
                    ...award,
                    uuid: `${uid}-${roundIndex}-${plateIndex}-${idx}`,
                    list: generateHighlightListFromWinning(awardsDetail),
                };
            });
            return {
                uuid: uuid(),
                PlateSymbolExtend,
                SingleMul: plate.SingleMul || 1,
                AwardDataList,
            };
        });
        return {
            ...roundData,
            uuid: uid,
            RoundWin,
            plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData) {
    const mainInfo = gameData.MainInfo ? processMainInfo(gameData.MainInfo) : [];
    const rounds = gameData?.FreeInfo ? processFreeQueue(gameData.FreeInfo) : null;
    if (gameData?.FreeInfo?.FreeTotalWin) gameData.FreeTotalWin = gameData.FreeInfo.FreeTotalWin;
    return {
        ...gameData,
        uuid: uuid(),
        MainInfo: {
            plates: mainInfo,
        },
        rounds,
    };
}

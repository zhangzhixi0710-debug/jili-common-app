import { jiliAsset } from '@/utils/assets';
const MiniSoreNumber = 15;
const MinorNumber = 25;
const MajorNumber = 50;

// 图标
const symbolMap = {
    0: "default",
    1: 10,
    2: 11,
    3: 12,
    4: 13,
    5: 16,
    6: 14,
    7: 16,
    8: 14,
    9: 14,
    10: 14,
    15: 15,
    25: 25,
    50: 50,
};

const JACKPOT_MULTIPLIER = [
    {
        bet: 15,
        symbol: 15,
    },
    {
        bet: 25,
        symbol: 25,
    },
    {
        bet: 50,
        symbol: 50,
    },
];

const YUANBAO_MULTIPLIER = [
    {
        bet: [0.5, 1, 2],
        symbol: 1,
    },
    {
        bet: [3, 4, 5, 6],
        symbol: 2,
    },
    {
        bet: [7, 8, 9, 10],
        symbol: 3,
    },
];

// Mul 转图片数组
function mulToImages(val, gameId) {
    const images = [];

    if (val === 0) {
        return images;
    }
    const strVal = String(val);

    for (let char of strVal) {
        if (char === ".") {
            images.push(jiliAsset(`images/intro/${gameId}/dot.png`));
        } else if (!isNaN(char)) {
            images.push(jiliAsset(`images/intro/${gameId}/${char}.webp`));
        }
    }

    return images;
}

// Mul 转图片数组
function mulToImagesIndex(val) {
    const images = [];

    if (val === 0) {
        return images;
    }
    const strVal = String(val);

    for (let char of strVal) {
        if (char === ".") {
            images.push(true);
        } else if (!isNaN(char)) {
            images.push(false);
        }
    }

    return images;
}

// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) => {
    return id || id === 0
        ? jiliAsset(`images/intro/${gameId}/${symbolMap[id || 0]}.webp`)
        : "";
};

// uuid
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function buildPosGridByRowColIndex(finalSymbol, posArray) {
    const rows = finalSymbol[0].Col.length; // 行数
    const cols = finalSymbol.length; // 列数

    // 初始化每行数组
    const grid = Array.from({ length: rows }, () => []);

    posArray.forEach(pos => {
        const row = Math.floor(pos / cols); // 行索引
        const col = pos % cols; // 列索引
        if (finalSymbol[col] && finalSymbol[col].Col[row] !== undefined) {
            grid[row].push(col); // 存列索引
        }
    });

    return grid;
}

function transposeCols(finalSymbol) {
    const rows = finalSymbol[0].Col.length;
    const cols = finalSymbol.length;

    // 初始化转置后的数组
    const transposed = Array.from({ length: rows }, () => ({ Col: [] }));

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            transposed[row].Col.push(finalSymbol[col].Col[row]);
        }
    }

    return transposed;
}

function getValueByIndex(data, index) {
    let base = 0;

    for (const item of data) {
        if (!Array.isArray(item.Col)) continue;
        const len = item.Col.length;

        if (index >= base && index < base + len) {
            return item.Col[index - base];
        }

        base += len;
    }

    return undefined; // 没找到
}

function computeMoneyBet(raw, Bet) {
    const Extra = [1, 1.5, 3];
    const index = (raw && raw.Extra) != null ? raw.Extra : 0;
    return Bet / (Extra[index] || 1);
}

function replaceSymbols(data, replaceData) {
    // 遍历替换表
    replaceData.forEach(({ Pos, Symbol, Mul }) => {
        const colIndex = Math.floor(Pos / 3); // 第几列
        const rowIndex = Pos % 3; // 列内第几个值

        for (let item of YUANBAO_MULTIPLIER) {
            if (item.bet.includes(Mul)) {
                data[colIndex].Col[rowIndex] = item.symbol;
                break;
            }
        }
        for (let item of JACKPOT_MULTIPLIER) {
            if (item.bet === Symbol) {
                // 只对 15 25 50 替换
                data[colIndex].Col[rowIndex] = item.symbol;
                break;
            }
        }
    });
    return data;
}

function replaceMul(data, replaceData) {
    // 遍历替换表
    replaceData.forEach(({ Pos, Symbol, Mul }) => {
        const colIndex = Math.floor(Pos / 3); // 第几列
        const rowIndex = Pos % 3; // 列内第几个值

        data[colIndex].Col[rowIndex] = Mul;
    });
    return data;
}

function getMiniScore(data, Money) {
    let result = {
        MiniSoreMoney: 0,
        MinorMoney: 0,
        MajorMoney: 0,
    };

    data.forEach(item => {
        if (item.Col.includes(MiniSoreNumber)) {
            result.MiniSoreMoney += MiniSoreNumber * Money;
        }
        if (item.Col.includes(MinorNumber)) {
            result.MinorMoney += MinorNumber * Money;
        }
        if (item.Col.includes(MajorNumber)) {
            result.MajorMoney += MajorNumber * Money;
        }
    });

    return result;
}

function processData(Mul, Symbol) {
    // 拷贝一份，避免直接改动原 Symbol
    const result = Symbol;
    // const result = Symbol.map(col => ({ Col: [...col.Col] }));

    for (let col = 0; col < Mul.length; col++) {
        for (let row = 0; row < Mul[col].Col.length; row++) {
            const val = Mul[col].Col[row];

            if (val) {
                // 查找匹配的倍率表
                for (let item of YUANBAO_MULTIPLIER) {
                    if (item.bet.includes(val)) {
                        // 只对 [3,4,5,6] 和 [7,8,9,10] 替换，5 财神爷不替换
                        if (result[col].Col[row] !== 5) {
                            result[col].Col[row] = item.symbol;
                        }
                        break;
                    }
                }
                for (let item of JACKPOT_MULTIPLIER) {
                    if (item.bet === val) {
                        // 只对 15 25 50 替换
                        result[col].Col[row] = item.symbol;
                        break;
                    }
                }
            }
        }
    }

    return result;
}

/**
 * 根据后端 RoundInfo 生成前端可用数据
 */
export function computeAwardsFromServer(raw = [], gameId, Bet) {
    let Money = computeMoneyBet(raw, Bet);

    const lastRaw = raw.RoundInfo[raw.RoundInfo.length - 1] || {};

    let { MiniSoreMoney, MinorMoney, MajorMoney } = getMiniScore(lastRaw.Mul, Money);

    let isAwred = false
    const rounds = raw.RoundInfo.map(round => {
        let PlateSymbolExtend = [];
        let Symbol = round.Symbol;
        // let Mul = round.Mul
        let Mul = round.Mul;

        if (round.PotList?.length) {
            Symbol = replaceSymbols(Symbol, round.PotList);
            Mul = replaceMul(Mul, round.PotList);
        }

        if (round.MysteryList?.length) {
            Symbol = replaceSymbols(Symbol, round.MysteryList);
            Mul = replaceMul(Mul, round.PotList);
        }

        // 每轮倍数图片
        const PlateMulExtend = Mul.map(col => col.Col.map(val => mulToImages(val * Money, gameId)));

        Symbol = processData(Mul, Symbol);

        // 每轮真实符号图片
        PlateSymbolExtend = Symbol.map(col => col.Col.map(id => buildSymbolImageUrl(gameId, id)));

        // 每轮倍数图片
        const PlateMulExtendIndex = Mul.map(col =>
            col.Col.map(val => mulToImagesIndex(val * Money))
        );

        if (round.AwardDataVec?.length) { 
            isAwred = true
        }

        // 奖励列表
        const AwardDataVec = (round.AwardDataVec || []).map((award, idx) => {
            let list = [];
            let Img = null;

            if (award.Symbol && award.Symbol.length) {
                const rowIndex = award.Index; // Pos 从1开始，转换为索引
                award.Symbol.forEach((sym, colIdx) => {
                    list[colIdx] = [rowIndex];
                });
            } else {
                const rowIndex = award.Pos ? award.Pos : 0;
                list = buildPosGridByRowColIndex(transposeCols(Symbol), [rowIndex]);

                const ImgId = getValueByIndex(Symbol, rowIndex);

                Img = buildSymbolImageUrl(gameId, ImgId);
            }

            return {
                ...award,
                Pos: award.Pos ? award.Pos + 1 : 1,
                uuid: uuid(),
                img: Img,
                list: list,
            };
        });

        return {
            uuid: uuid(),
            PlateSymbolExtend,
            PlateMulExtend,
            PlateMulExtendIndex,
            AwardDataVec,
            TotalWin: round.ComboStageWin,
            ReSpinRemainRound: round.ReSpinRemainRound,
            ReSpinTotalRound: round.ReSpinTotalRound || 1,
        };
    });

    return {
        uuid: uuid(),
        isAwred,
        rounds,
        MiniSoreMoney,
        MinorMoney,
        MajorMoney,
        TotalWin: raw.TotalWin,
        Extra: raw.Extra,
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
export function processGameData(raw, gameId, Bet) {
    raw = { ...raw, uuid: uuid() };

    return computeAwardsFromServer(raw, gameId, Bet);
}

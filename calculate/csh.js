import { jiliAsset } from '@/utils/assets';
﻿const WILD_ID = 8;
const LONG_ID = 10;

const symbolMap = {
    0: jiliAsset("images/intro/csh/0.webp"), // 秦始皇
    1: jiliAsset("images/intro/csh/1.webp"), //
    2: jiliAsset("images/intro/csh/2.webp"), //
    3: jiliAsset("images/intro/csh/3.webp"), //
    4: jiliAsset("images/intro/csh/4.webp"), // A
    5: jiliAsset("images/intro/csh/5.webp"), // K
    6: jiliAsset("images/intro/csh/6.webp"), // Q
    7: jiliAsset("images/intro/csh/7.webp"), // J
    8: jiliAsset("images/intro/csh/8.webp"), // WILD
    9: jiliAsset("images/intro/csh/9.webp"), // BOUNS
    10: jiliAsset("images/intro/csh/A.webp"), // BOUNS
};

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function normalizeAwardGridVec(AwardGridVec) {
    return AwardGridVec.map(item => ({
        Column: item.Column ? item.Column : 0,
        Row: item.Row ? item.Row : 0,
    }));
}

/**
 * 计算 Ways 中奖结果，输出 [[..],[..],...] 格式
 * 每列数组只保留中奖行索引
 * @param {Array} board - 当前牌面 [{Row:[..]}, ...] 共6列，每列4个数字
 */
function calcWinningIndex(AwardGridVec, PlateVec, AwardSymbol) {
    // 初始化结果：6列
    const result = Array.from({ length: 6 }, () => []);

    AwardGridVec = normalizeAwardGridVec(AwardGridVec);

    // 1. 过滤无效项并排序
    const sortedAwards = AwardGridVec.sort((a, b) => a.Column - b.Column);

    // 2. 遍历中奖点 → 收集每列中奖索引
    sortedAwards.forEach(({ Column, Row }) => {
        const colIndex = Column; // 转为0索引
        const rowIndex = Row;
        const symbol = PlateVec[colIndex][rowIndex];

        // 中奖条件：相等 或 9代表任意非10
        const match = symbol === AwardSymbol || symbol === WILD_ID;

        if (match) {
            result[colIndex].push(rowIndex);
        }
    });

    // 3. 从左到右检查连续 >= 3 列
    let maxSeq = [];
    let tempSeq = [];

    for (let col = 0; col < result.length; col++) {
        if (result[col].length > 0) {
            tempSeq.push(col);
        } else {
            if (tempSeq.length >= 3) {
                maxSeq = [...tempSeq];
                break;
            }
            tempSeq = [];
        }
    }
    if (tempSeq.length >= 3 && maxSeq.length === 0) {
        maxSeq = [...tempSeq];
    }

    // 4. 不满足3连则返回空
    if (maxSeq.length < 3) {
        return Array.from({ length: 6 }, () => []);
    }

    // 5. 只保留满足3连的列，其它清空
    const finalResult = result.map((arr, colIndex) => (maxSeq.includes(colIndex) ? arr : []));

    let odds = 1;

    if (AwardSymbol === LONG_ID) {
        odds = finalResult.reduce((sum, arr) => sum + arr.length, 0);
    } else {
        odds = finalResult.reduce((acc, rows) => (rows.length ? acc * rows.length : acc), odds);
    }

    return {
        list: finalResult,
        odds: odds,
    };
}

function mapSymbols(data) {
    return data.map(group => group.map(col => col.map(num => symbolMap[num] || null)));
}

/**
 * 将 PlateVec 转换成 4行×6列的结构，每个列对象包含 Row: [..]
 * @param {Array} plateVec - 原始 PlateVec
 * @returns {Array} 转换后的数组，每个元素是 { Row: [..] }
 */
function convertPlateVec(plateVec) {
    return plateVec.map(col => {
        const rowData = col.Row || [];
        const result = [];
        const cols = 6; // 每个块 6 行
        const rowsPerCol = 4; // 每列 4 个数字

        for (let c = 0; c < cols; c++) {
            result.push(rowData.slice(c * rowsPerCol, (c + 1) * rowsPerCol));
        }

        return result;
    });
}

function processFreeQueue(AckVec) {
    return AckVec.map(roundData => {
        let RoundWin = 0;
        const PlateVec = convertPlateVec(roundData.PlateVec);

        const PlateVecImage = mapSymbols(PlateVec);

        const plates = PlateVecImage.map((item, index) => {
            if (!roundData.AwardVec && !roundData.AwardVec[index]) {
                return {
                    uuid: uuid(),
                    ColumnSymbol: item,
                };
            }

            const AwardVec = roundData.AwardVec[index] || {};

            let AwardDataList = (AwardVec.AwardSet || []).map(award => {
                const { AwardSymbol, AwardMoney } = award;
                if (!AwardMoney) {
                    return "";
                }

                RoundWin += AwardMoney;

                const { list, odds } = calcWinningIndex(
                    award.AwardGridVec,
                    PlateVec[index],
                    AwardSymbol
                );

                return {
                    ...award,
                    uuid: uuid(),
                    img: symbolMap[AwardSymbol],
                    list,
                    odds,
                };
            });

            if (!AwardDataList[0]) {
                AwardDataList = [];
            }

            return {
                uuid: uuid(),
                ColumnSymbol: item,
                SingleMul: AwardVec.AwardMoney || 1,
                AwardDataList,
            };
        });

        let FreeCount = 0;
        if (PlateVec[0]) {
            for (const col of PlateVec[0]) {
                for (const num of col) {
                    if (num === 10) FreeCount++;
                }
            }
        }

        return {
            ...roundData,
            uuid: uuid(),
            RoundWin,
            FreeCount,
            plates: plates,
        };
    });
}

// ==========================================
// 最终处理函数
// ==========================================
export function processGameData(gameData, gameId) {
    const MainInfo = {};
    const rounds = gameData?.AckVec ? processFreeQueue(gameData.AckVec, gameId) : null;

    return {
        ...gameData,
        uuid: uuid(),
        MainInfo,
        rounds,
    };
}

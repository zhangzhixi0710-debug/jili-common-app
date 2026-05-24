import { jiliAsset } from '@/utils/assets';
const PRE_MULT = "xx";
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const buildNumImageUrl = (num = 0) =>
    num || num === 0 ? jiliAsset(`images/intro/number/${num}.webp`) : "";

const buildSymbolImageUrl = (gameId, symbolId = 0) =>
    jiliAsset(`images/intro/${gameId}/symbol_${symbolId}.webp`);

function generatePlateSymbolExtend(plateSymbol, gameId) {
    return plateSymbol.map(row => row.map(item => buildSymbolImageUrl(gameId, item)));
}

function generateComboStageData(ComboStageSymbol) {
    const result = ComboStageSymbol.map(item => ({
        Col: [...item.Col].reverse(),
    }));

    return result.map((item, i) => {
        return [...item.Col];
    });
}

function calcWinningColumnsRows(plateSymbol, PosVec) {
    const size = plateSymbol[0].Col.length; // 一列长度（7）

    // 扁平化处理成一个总索引映射函数
    return plateSymbol.map((_, colIndex) => {
        const start = colIndex * size;
        const end = start + size;

        // 该列对应的 PosVec 索引区间
        const colMatched = Array.from({ length: size }, (_, rowIndex) =>
            PosVec.includes(start + rowIndex)
        );

        // 倒序后收集 true 的行索引
        return colMatched
            .reverse()
            .map((v, idx) => (v ? idx : -1))
            .filter(i => i !== -1);
    });
}

/**
 * 数字拆分并生成图片数组
 * @param {*} gameId
 * @param {*} data
 * @returns
 */
function getSymbolImages(data) {
    // 先把数字转换为字符串，然后拆成单个字符，再转换为数字
    const digits = String(data).split("").map(Number);

    // 调用 buildNumImageUrl 生成图片路径
    const images = digits.map(num => buildNumImageUrl(num));

    // 在第一个位置插入 buildNumImageUrl(gameId, 'X')
    images.unshift(buildNumImageUrl(PRE_MULT));

    return images;
}

function processFreeQueue(freeInfo, gameId) {
    return freeInfo.map((roundData, roundIndex) => {
        let isFrist = false;
        let RoundWin = 0;
        const ComboStageData = roundData.ComboStageData || [];

        if (roundIndex === 0) {
            isFrist = true;
        }

        const plates = ComboStageData.map(plate => {
            let RoundMultImages = [];
            if (!isFrist && plate.ComboStageMult) {
                RoundMultImages = getSymbolImages(plate.ComboStageMult);
            }
            const ComboStageSymbol = generateComboStageData(plate.ComboStageSymbol);

            const PlateSymbolExtend = generatePlateSymbolExtend(ComboStageSymbol, gameId);

            const AwardDataVec = (plate.AwardDataVec || []).map(award => {
                const img = buildSymbolImageUrl(gameId, award.Symbol);

                // 计算中奖列索引（左到右连续）
                const list = calcWinningColumnsRows(plate.ComboStageSymbol, award.PosVec);

                RoundWin += award.Win || 0;

                return {
                    ...award,
                    uuid: uuid(),
                    Index: award.LineNum,
                    img,
                    list,
                };
            });

            return {
                ...plate,
                uuid: uuid(),
                RoundWin,
                RoundMultImages,
                PlateSymbolExtend,
                AwardDataVec,
            };
        });
        return {
            ...roundData,
            isFrist,
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

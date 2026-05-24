import { jiliAsset } from '@/utils/assets';
import {
    mapData,
    eventTypeMap,
    symbolIdToEventIdMap,
    WILD_IDS,
    payTable,
    headerDefaultId,
    SCATTER,
    filterEventImageId,
    filterSymbolImageId,
} from "@/constants";

const buildEventImageUrl = (gameId, id) =>
    id || id === 0
        ? jiliAsset(`images/intro/${gameId}/${filterEventImageId(id)}`)
        : jiliAsset(`images/intro/${gameId}/${filterEventImageId(4)}`);

const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/${filterSymbolImageId(id)}`) : "";

function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * 替换头部冲撞符号
 */
function replaceHeaderSymbols(round, HitFGX3X5Col, gameId) {
    // 初始化HeaderId
    round.HeaderEvent = [...headerDefaultId];

    if (!round.targetBeefID) {
        round.HeaderEvent = round.HeaderEvent.map(id => buildEventImageUrl(gameId, id));
        return;
    }

    // 定义所有需要检查的标签数组及其替换值
    const tagConfigs = [
        { tags: round.ArrowTag, replaceValue: symbolIdToEventIdMap[round.targetBeefID] },
        { tags: round.GoldArrowTag, replaceValue: symbolIdToEventIdMap[round.targetBeefID] },
        { tags: HitFGX3X5Col, replaceValue: symbolIdToEventIdMap[round.targetBeefID] },
    ];

    // 处理每个标签配置
    tagConfigs.forEach(config => {
        if (config.tags && config.tags.some(Boolean)) {
            round.HeaderEvent = round.HeaderEvent.map((value, index) =>
                config.tags[index] ? config.replaceValue : value
            );
        }
    });

    round.HeaderEvent = round.HeaderEvent.map(id => buildEventImageUrl(gameId, id));
}

function computeFinalPlateSymbols(round, gameId) {
    if (!round.AwardTypeFlag) {
        round.HeaderEvent = [...headerDefaultId].map(id => buildEventImageUrl(gameId, id));
        return;
    }

    const SYMBOL_ID = {
        CHARGE_FREE: 1,
        CHARGE_BEEF: 11,
        SUPER_BEEF: 12,
    };

    // 1: 8FREE GAME x3 x5（FREE GAME + x3/x5）
    const hasFreeGame = (round.AwardTypeFlag & 16) > 0 || (round.AwardTypeFlag & 32) > 0;

    // 8 FREE
    if (hasFreeGame) {
        round.targetBeefID = SYMBOL_ID.CHARGE_FREE;
    }

    // 2: CHARGE 紫牛事件
    else if ((round.AwardTypeFlag & 64) > 0) {
        round.targetBeefID = SYMBOL_ID.CHARGE_BEEF;
    }

    // 3: SUPER CHARGE 金牛（或金色符号事件）
    else if ((round.AwardTypeFlag & 1) > 0) {
        round.targetBeefID = SYMBOL_ID.SUPER_BEEF;
    }

    // 替换逻辑
    round.PlateSymbolExtend = round.PlateSymbolExtend.map(col => ({
        Row: col.Row.map(symbol => {
            if (
                round?.StampedeSymbols?.includes(symbol) &&
                (round.targetBeefID !== null || round.targetBeefID !== 1)
            ) {
                return round.targetBeefID;
            }

            // 其余保留
            return symbol;
        }),
    }));
}

/**
 * 判断是否符合 JILI 的中奖规则（243类规则）
 */
function checkValidAwardBy243Rule(award, plate) {
    const symbolId = award.Symbol || 0;
    const minCols = payTable[symbolId] || 3;

    // 定义等价符号集合，比如普通野牛可被紫牛、金牛代替
    const equivalentSymbolsMap = {
        10: [10, 11, 12], // 普通野牛及紫牛、金牛
        11: [11], // 紫牛单独
        12: [12], // 金牛单独
    };

    const matchSymbols = equivalentSymbolsMap[symbolId] || [symbolId];

    const columns = [];

    for (let col of plate) {
        const rowMatches = col.Row.reduce((acc, val, idx) => {
            if (symbolId === val || matchSymbols.includes(val) || WILD_IDS.includes(val))
                acc.push(idx);
            return acc;
        }, []);
        columns.push(rowMatches);
    }

    // 连续匹配列数判断
    let count = 0;
    const resultList = [];

    for (let i = 0; i < columns.length; i++) {
        if (symbolId === SCATTER) {
            resultList.push(columns[i]);
            if (columns[i].length > 0) {
                count++;
            }
        } else {
            if (columns[i].length > 0) {
                resultList.push(columns[i]);
                count++;
            } else {
                break;
            }
        }
    }

    if (symbolId === SCATTER) {
        return count >= minCols ? resultList : null;
    }

    return count >= minCols ? resultList.slice(0, count) : null;
}

/**
 * 丰富中奖数据，符合 JILI 判断规则
 */
function enrichAwards(round, gameId) {
    const plate = round.PlateSymbolExtend;
    if (!round.AwardDataVec || !plate) return;

    const validAwards = [];

    round.AwardDataVec.forEach(award => {
        const resultList = checkValidAwardBy243Rule(award, plate);
        if (resultList) {
            award.uuid = uuid();
            award.Symbol = award.Symbol || 0;
            award.SymbolId = award.Symbol;
            award.SymbolName = mapData[award.Symbol] || "未知符号";
            award.list = resultList;
            award.Count = resultList.length;
            award.img = buildSymbolImageUrl(gameId, award.Symbol);
            validAwards.push(award);
        }
    });

    round.AwardDataVec = validAwards;
}

function plateSymbolReverseFillData(round, defaultLen = 7) {
    round.PlateSymbolExtend.forEach(obj => {
        obj.Row =
            obj.Row.length < defaultLen
                ? [...obj.Row, ...Array(defaultLen - obj.Row.length).fill("")].reverse()
                : [...obj.Row].reverse(); // 避免修改原数组的引用（如果其他地方依赖它）
    });
}

function imagesReplacePlateId(round, gameId) {
    // 构建符号图片URL
    round.PlateSymbolExtend = round.PlateSymbolExtend.map(
        column => column?.Row?.map(symbolId => buildSymbolImageUrl(gameId, symbolId)) || []
    );
}

/**
 * 主处理函数
 */
export function processGameData(data, gameId) {
    const HitFGX3X5Col = data.HitFGX3X5Col;

    data.RoundQueue.forEach((round, index) => {
        round.uuid = uuid();
        computeFinalPlateSymbols(round, gameId);

        replaceHeaderSymbols(round, index === 0 ? HitFGX3X5Col : [], gameId);

        plateSymbolReverseFillData(round);

        enrichAwards(round, gameId);

        imagesReplacePlateId(round, gameId);
    });

    return data;
}

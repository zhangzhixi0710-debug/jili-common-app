import request from "@/utils/request";

// export function getGameList() {
//     return request({
//         url: "/api/game-setting/game-info-list",
//         method: "get",
//     });
// }
// }https://uat-history.mt7pp.com/marquee/0/en-US
export function getNickname() {
    return request({
        url: `/api/nickname`,
        method: "get"
    });
}
export function getVerticalText() {
    return request({
        url: `/api/marquee/0/en-US`,
        method: "get"
    });
}
export function Detail(id, params) {
    return request({
        url: `/api/${id}/get-history-record`,
        method: "get",
        params
    });
}
export function getBanner(lang) {
    return request({
        url: `/api/banner`,
        method: "get",
    });
}
export function getGameList() {
    return request({
        url: "/api/game-entrance/0",
        method: "get",
    });
}
export function HistoryItem(id, params) {
    return request({
        url: `/api/${id}/history-item`,
        method: "get",
        params,
    });
}

export function createGame(data) {
    return request({
        url: "/api/games",
        method: "post",
        data,
    });
}

export function updateGame(id, data) {
    return request({
        url: `/api/games/${id}`,
        method: "put",
        data,
    });
}

export function deleteGame(id) {
    return request({
        url: `/api/games/${id}`,
        method: "delete",
    });
}

/**
 * 获取历史单个详情
 * @param {*} gameId 
 * @param {*} lang 
 * @param {*} id 
 * @returns 
 */
export function HistorySingleItem(gameId, lang, id) {
    return request({
        url: `/api/history/${gameId}/get-single-round-log-summary/${lang}/${id}`,
        method: "get",
    });
}

/**
 * 获取中奖图片
 * @param {*} gameId 
 * @param {*} id 
 * @param {*} LogIndex 
 * @returns 
 */
export function HistoryWinImage(gameId, id, LogIndex, params = {}) {
    return request({
        url: `/api/history/${gameId}/get-log-plate-info/${id}/${LogIndex}`,
        method: "get",
        params,
    });
}

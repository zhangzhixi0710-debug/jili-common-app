function isDesktop() {
    const info = uni.getSystemInfoSync();
    return info.windowWidth >= 1024;
}

/**
 * portrait: 竖屏
 * landscape: 横屏
 * @returns
 */
function getScreenOrientation() {
    const info = uni.getSystemInfoSync();
    return info.windowWidth > info.windowHeight ? "landscape" : "portrait";
}

// 监听屏幕旋转
function handleOrientationChange() {
    const orientation = getScreenOrientation();

    if (isDesktop()) {
        console.log("竖屏");
        return "portrait";
    }
    return orientation;
}

function decodeProto(gameId, data, Proto, gtTranMap) {
    const gt = gtTranMap[gameId]?.toLowerCase();
    if (!gt || !Proto[gt]) return null;
    const buffer = uni.base64ToArrayBuffer(data.sp);
    const bytes = new Uint8Array(buffer);

    if (!Proto[gt].AllPlate) {
        return Proto[gt].SpinAck.decode(bytes);
    }
    return Proto[gt].AllPlate.decode(bytes);
}

/**
 * 格式化时间戳为 GMT+8 字符串
 * @param {number|string} timestamp
 * @param {boolean} multiline
 * @returns {string}
 */
function formatTimeGmt8(timestamp, multiline = false) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const timezoneOffset = 8 * 60 * 60 * 1000;
    const gmt8Time = new Date(date.getTime() + timezoneOffset);

    const year = gmt8Time.getUTCFullYear();
    const month = String(gmt8Time.getUTCMonth() + 1).padStart(2, "0");
    const day = String(gmt8Time.getUTCDate()).padStart(2, "0");
    const hours = String(gmt8Time.getUTCHours()).padStart(2, "0");
    const minutes = String(gmt8Time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(gmt8Time.getUTCSeconds()).padStart(2, "0");

    if (multiline === true) {
        return `${year}/${month}/${day}<br />${hours}:${minutes}:${seconds}(GMT+8)`;
    } else if (multiline === 1) {
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}<br />(GMT+8)`;
    } else {
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}(GMT+8)`;
    }
}

export { isDesktop, handleOrientationChange, decodeProto, formatTimeGmt8 };

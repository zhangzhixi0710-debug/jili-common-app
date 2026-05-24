export function formatCurrency(num) {
    if (num == null) return "";
    return (Number(num).toFixed(2) * 1).toLocaleString();
}

export function formatTime(timestamp, type = false) {
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

    return type
        ? `${year}/${month}/${day}${hours}:${minutes}:${seconds}(GMT+8)`
        : `${year}/${month}/${day} ${hours}:${minutes}:${seconds}(GMT+8)`;
}

export function formatStartTime(timestamp, type = false) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const timezoneOffset = 8 * 60 * 60 * 1000;
    // Subtract 1 second (1000 milliseconds) from the GMT+8 time
    const gmt8Time = new Date(date.getTime() + timezoneOffset - 1000);

    const year = gmt8Time.getUTCFullYear();
    const month = String(gmt8Time.getUTCMonth() + 1).padStart(2, "0");
    const day = String(gmt8Time.getUTCDate()).padStart(2, "0");
    const hours = String(gmt8Time.getUTCHours()).padStart(2, "0");
    const minutes = String(gmt8Time.getUTCMinutes()).padStart(2, "0");
    const seconds = String(gmt8Time.getUTCSeconds()).padStart(2, "0");

    return type
        ? `${year}/${month}/${day}${hours}:${minutes}:${seconds}(GMT+8)`
        : `${year}/${month}/${day} ${hours}:${minutes}:${seconds}(GMT+8)`;
}

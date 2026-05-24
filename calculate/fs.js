import { jiliAsset } from '@/utils/assets';
// 构建符号图片路径
export const buildSymbolImageUrl = (gameId, id) =>
    id || id === 0 ? jiliAsset(`images/intro/${gameId}/Symbol_${id}.webp`) : "";

// uuid
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// 根据SerialVec生成高亮list
function generateHighlightList(SerialVec) {
    const list = Array.from({ length: 6 }, () => []);

    SerialVec.forEach(serial => {
        const { column = 0, row = 0 } = serial;
        if (!list[column].includes(row)) {
            list[column].push(row);
        }
    });

    return list;
}

function multiplyArrayLengths(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return 0;
    }

    return arr.reduce((product, subArray) => {
        // 确保子数组存在且有length属性
        const length = Array.isArray(subArray) ? subArray.length : 0;
        return product * (length > 0 ? length : 1); // 空数组按长度1处理，避免乘以0
    }, 1);
}

function applyChangesToColumn(column, changes) {
    const updatedColumn = JSON.parse(JSON.stringify(column)); // 深拷贝原始 column 数组

    changes.forEach(change => {
        const rowIndex = change.row || 0;
        const columnIndex = change.column || 0;

        // 查找或修改对应位置的值
        if (updatedColumn[columnIndex] && updatedColumn[columnIndex].row) {
            updatedColumn[columnIndex].row[rowIndex] = change.symbol;
        }
    });

    return updatedColumn;
}

function processComboChanges(column, combo) {
    const results = [];

    // 第一个元素为原始 column
    results.push(JSON.parse(JSON.stringify(column)));

    // 每次替换，生成新的 column，存入结果数组
    let currentColumn = JSON.parse(JSON.stringify(column));

    combo.forEach(comboItem => {
        const updatedColumn = applyChangesToColumn(currentColumn, comboItem.change);
        results.push(updatedColumn); // 存储当前替换后的结果
        currentColumn = updatedColumn; // 更新为最新的 column 作为下次替换的基础
    });

    return results;
}

function processRawData(item) {
    const result = [];

    // 遍历 raw 数组
    // raw.forEach(item => {
    const { column, combo } = item;

    // 获取column和combo数组的长度
    const numColumns = column.length;

    // 遍历每个column和对应的combo
    for (let i = 0; i < numColumns; i++) {
        result.push({
            ...item,
            column: column[i], // 对应的column
            combo: combo?.length ? combo[i] : [], // 对应的combo
        });
    }
    // });

    return result;
}

export function processFreeGameData(Plates = {}, gameId) {
    let raw = Plates.plate.map(item => {
        return {
            ...item,
            column: processComboChanges(item.column, item.combo),
        };
    });

    let AllPlate = raw.map(item => {
        return processRawData(item);
    });

    const data = [];

    AllPlate.map(plate => {
        const result = plate.map(item => {
            // 盘面数据
            const plateSymbol = item.column;

            // 生成 PlateSymbolExtend (图片二维数组)，4行6列
            const PlateSymbolExtend = []; // 6列， 每列4个符号

            for (let col = 0; col < plateSymbol.length; col++) {
                const colSymbols = [];
                for (let row = 0; row < plateSymbol[col].row.length; row++) {
                    const symbolId = plateSymbol[col].row[row];
                    colSymbols.push(buildSymbolImageUrl(gameId, symbolId));
                }
                PlateSymbolExtend.push(colSymbols);
            }

            // 奖励数据
            const AwardDataVec = (item.combo?.award || []).map((award, idx) => {
                const img = buildSymbolImageUrl(gameId, award.symbol);
                const list = generateHighlightList(award.block);

                return {
                    ...award,
                    uuid: uuid(),
                    img,
                    list,
                    Index: multiplyArrayLengths(list),
                };
            });

            return {
                ...item,
                PlateSymbolExtend,
                AwardDataVec,
                RoundWin: item.win,
                uuid: uuid(),
            };
        });

        data.push(result);
    });

    return {
        uuid: uuid(),
        MainInfo: data[0],
        rounds: data.slice(1),
    };
}

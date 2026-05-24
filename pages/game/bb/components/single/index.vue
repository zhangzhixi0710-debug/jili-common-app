<template>
    <div class="single-images-list">
        <div v-for="(item, index) in (config && config.plates)" :key="index">
            <div class="single-images-title" v-if="index === 0">
                {{ $t("MainGame") }}
            </div>

            <template v-if="item.PlateSymbolExtend">
                <div class="single-images-contain">
                    <!-- 中间中奖格子区 -->
                    <div
                        class="single-images-middle"
                        :class="{ 'single-images-middle-free': isFreeGame }"
                        v-if="(item.PlateSymbolExtend && item.PlateSymbolExtend.length)"
                    >
                        <div
                            class="single-images-middle-div-new"
                            v-for="(images, imagesIndex) in item.PlateSymbolExtend"
                            :key="imagesIndex"
                        >
                            <div
                                v-for="(img, imgIndex) in images"
                                :key="imgIndex"
                                class="single-images-back-div"
                                :class="{ 'single-images-back-active': changeList.uuid }"
                            >
                                <img
                                    :class="{
                                        'single-images-active': isAwardActive(
                                            item.uuid,
                                            imagesIndex,
                                            imgIndex
                                        ),
                                    }"
                                    :src="img"
                                />

                                <img
                                    :style="{ position: 'absolute' }"
                                    :src="(item.PlateSymbolNumImg && item.PlateSymbolNumImg[imagesIndex] && item.PlateSymbolNumImg[imagesIndex][imgIndex] && item.PlateSymbolNumImg[imagesIndex][imgIndex].back)"
                                />
                                <div
                                    class="single-images-num"
                                    v-if="(item.PlateSymbolNumImg && item.PlateSymbolNumImg[imagesIndex] && item.PlateSymbolNumImg[imagesIndex][imgIndex])"
                                    :class="{
                                        'single-images-num-active': isAwardActive(
                                            item.uuid,
                                            imagesIndex,
                                            imgIndex
                                        ),
                                    }"
                                >
                                    <img
                                        v-for="(mul, mulIndex) in item.PlateSymbolNumImg[
                                            imagesIndex
                                        ][imgIndex].img"
                                        :src="mul"
                                        :class="{
                                            'single-images-num-single':
                                                item.PlateSymbolNumImg[imagesIndex][imgIndex],
                                        }"
                                        :style="{
                                            'max-width':
                                                (
                                                    100 /
                                                    item.PlateSymbolNumImg[imagesIndex][imgIndex]
                                                        .img.length
                                                ).toFixed(0) + '%',
                                        }"
                                    />
                                </div>

                                <div
                                    class="single-images-back"
                                    v-if="isAwardBackActive(item.uuid, imagesIndex, imgIndex)"
                                ></div>
                            </div>
                        </div>

                        <div class="single-images-active-header" v-if="showHeader(item.uuid)">
                            <span>{{ formatNumber(changeList[item.uuid].win) || 0 }}</span>
                            <span>→</span>
                        </div>
                    </div>

                    <!-- 下方选项按钮 -->
                    <div class="single-images-footer" v-if="(item.AwardDataVec && item.AwardDataVec.length)">
                        <div
                            v-for="(opt, optI) in item.AwardDataVec"
                            :key="optI"
                            :class="{ 'single-footer-active': isFooterActive(item.uuid, opt.uuid) }"
                            @click.stop="handleClick(item.uuid, opt)"
                        >
                            <span>{{ opt.Index }}</span>
                        </div>
                    </div>
                </div>
            </template>

            <div
                v-if="item.RoundWin && index === config.plates.length - 1"
                class="single-images-event"
            >
                <span>{{ $t("MainGameWin") }}</span>
                <span>{{ formatNumber(item.RoundWin) || 0 }}</span>
            </div>

            <div
                v-if="item.RoundWin && item.bonusRate > 1 && index === config.plates.length - 1"
                class="single-images-event"
            >
                <span>{{ $t("multiplier") + "：" + item.bonusRate }}</span>
            </div>
            <div
                v-if="config.plates.length - 1 === index && config.AddRounds"
                class="single-images-event"
            >
                <span>{{ $t("Get") + config.AddRounds + $t("FreeGames") }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDetail",
    props: {
        uuid: { type: String, required: false },
        config: {
            type: Object,
            required: false,
            default: () => {},
        },
        isFreeGame: { type: Boolean, default: false },
        keyValue: { type: Number, default: 0 },
    },
    data() {
        return {
            changeList: [],
        };
    },
    methods: {
        showHeader(uuid) {
            return !!this.changeList[uuid]?.list;
        },
        handleClick(uuid, opt) {
            // 修复：确保数据结构正确
            this.changeList[uuid] = {
                ...opt,
                uuid: opt.uuid || uuid, // 确保有 uuid 字段
                list: opt.list || [], // 确保有 list 字段
                timestamp: Date.now(), // 添加时间戳用于调试
            };

            // 强制更新视图
            this.$forceUpdate();
        },
        isAwardActive(uuid, footerIndex, index) {
            return !!this.changeList[uuid]?.list?.[footerIndex]?.includes(index);
        },
        isAwardBackActive(uuid, footerIndex, index) {
            // 修复：确保当有选中项时，未选中的格子显示背景
            const hasSelection =
                this.changeList[uuid] && Object.keys(this.changeList[uuid]).length > 0;
            if (!hasSelection) return false;

            // 如果有 list 数据，检查是否在选中列表中
            if (this.changeList[uuid]?.list?.[footerIndex]) {
                return !this.changeList[uuid].list[footerIndex].includes(index);
            }

            // 如果没有 list 数据但有其他选中状态，也显示背景
            return true;
        },
        isFooterActive(uuid, uid) {
            // 修复：直接比较选中的 uuid 与当前选项的 uuid
            return this.changeList[uuid] && this.changeList[uuid].uuid === uid;
        },
        
        
        formatNumber(val) {
            if (!val && val !== 0) return "0";

            // 处理浮点数精度问题
            const epsilon = 1e-10;
            let num = Number(val);

            // 检查是否接近整数
            const roundedToInt = Math.round(num);
            if (Math.abs(num - roundedToInt) < epsilon) {
                // 如果是整数，直接格式化整数部分
                return roundedToInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            // 保留三位小数
            const formatted = num.toFixed(3);

            // 检查保留三位小数后是否变成了整数（如 3.000）
            const [intPart, decimalPart] = formatted.split(".");
            if (decimalPart === "000") {
                // 如果小数部分全是0，则只返回整数部分
                return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            // 否则返回带三位小数的格式化结果
            return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimalPart;
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

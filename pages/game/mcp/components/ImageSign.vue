<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ gameTitle }}
        </div>

        <div class="single-images-contain">
            <!-- 中间中奖格子区 -->
            <div
                class="single-images-middle"
                :class="{ ['single-images-middle-free_' + item.type]: true }"
                v-if="(item.PlateSymbolExtend && item.PlateSymbolExtend.length)"
            >
                <div
                    class="single-images-middle-div-new"
                    v-for="(images, i) in item.PlateSymbolExtend"
                    :key="i"
                >
                    <div
                        class="single-images-back-div"
                        :class="{ 'single-images-back-active': changeList.uuid }"
                    >
                        <img
                            v-if="images"
                            :class="{ 'single-images-active': isAwardActive(i) }"
                            :src="images"
                        />
                        <div
                            v-else
                            class="single-images-div"
                            :class="{ 'single-images-active': isAwardActive(i) }"
                        ></div>
                    </div>
                </div>

                <div class="single-images-active-header" v-if="showHeader()">
                    <span>{{ formatNumber(changeList.Win) }}</span>
                    <span>→</span>
                </div>
            </div>

            <!-- 下方选项按钮 -->
            <div class="single-images-footer" v-if="(item.AwardDataVec && item.AwardDataVec.length)">
                <div
                    v-for="(opt, i) in item.AwardDataVec"
                    :key="i"
                    :class="{ 'single-footer-active': isFooterActive(opt) }"
                    @click.stop="handleClick(opt)"
                >
                    <span>{{ opt.Index }}</span>
                </div>
            </div>
        </div>

        <div v-if="item.type == 1 && item.MainWin" class="single-images-event">
            <span>{{ $t("MainGameWin") }}</span>

            <span>{{ formatNumber(item.MainWin) }}</span>
        </div>

        <template v-else-if="item.type == 2">
            <div v-if="keyValue === 0" class="single-images-event">
                <span>{{ $t("MainGameWin") }}</span>

                <span>{{ formatNumber(item.MainWin) }}</span>
            </div>

            <div v-else class="single-images-event">
                <span>{{ $t("Respin_Win") }}</span>

                <span>{{ formatNumber(item.OtherWin) }}</span>
            </div>
        </template>

        <template v-else-if="item.type == 3">
            <div class="single-images-event">
                <span>{{ $t("MainGameWin") }}</span>

                <span>{{ formatNumber(item.MainWin) }}</span>
            </div>

            <div class="single-images-event">
                <span>{{ $t("LuckyWheelWin") }}</span>

                <span>{{ formatNumber(item.OtherWin) }}</span>
            </div>
        </template>

        <template v-else-if="item.type == 4">
            <div class="single-images-event">
                <span>{{ $t("SpecialReel") }}：</span>

                <span>{{ item.Mul }}</span>
            </div>

            <div class="single-images-event">
                <span>{{ $t("MultipliedBonusScore") }}：</span>

                <span>{{ formatNumber(item.MainWin) }}</span>
            </div>
        </template>

        <div v-else-if="item.RoundWin" class="single-images-event">
            <span>{{ keyValue === 0 ? $t("MainGameWin") : $t("Respin_Win") }}</span>

            <span>{{ formatNumber(item.RoundWin) }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDetail",
    props: {
        uuid: { type: String, required: false },
        item: { type: Object, required: true },
        isFreeGame: { type: Boolean, default: false },
        keyValue: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    data() {
        return {
            changeList: {},
            activeFooterIndex: null,
        };
    },
    computed: {
        gameTitle() {
            if (this.item.type === 1) {
                return this.$t("MainGame");
            } else {
                return this.$t("i18_SpecialGame");
            }
        },
    },
    methods: {
        showHeader() {
            if (!this.activeFooterIndex) return false;

            return true;
        },
        handleClick(opt) {
            this.changeList = opt;
            this.activeFooterIndex = opt.Index; // 保存当前点击 index
        },
        isAwardActive() {
            if (!this.changeList?.Index) {
                return false;
            }
            return this.changeList?.Index;
        },
        isAwardBackActive() {
            // 只有当前点击的 footerIndex 才显示
            if (!this.changeList?.Index) {
                return false;
            }
            return this.changeList?.Index;
        },
        isFooterActive(opt) {
            return this.item.uuid === this.uuid && opt.uuid === this.changeList.uuid;
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
@use "./ImageSign.scss";
</style>

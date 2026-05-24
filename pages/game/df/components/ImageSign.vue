<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ gameTitle }}
        </div>

        <template v-if="item.PlateSymbolExtend">
            <div class="single-images-contain">
                <!-- 中间中奖格子区 -->
                <div class="single-images-mult" v-if="item.RoundMultImages.length">
                    <img :src="melt" v-for="(melt, mIndex) in item.RoundMultImages" />
                </div>
                <div
                    class="single-images-middle"
                    :class="{ 'single-images-middle-free': isFreeGame }"
                    v-if="(item.PlateSymbolExtend && item.PlateSymbolExtend.length)"
                >
                    <div
                        class="single-images-middle-div-new"
                        v-for="(images, i) in item.PlateSymbolExtend"
                        :key="i"
                    >
                        <div
                            v-for="(img, imgIndex) in images"
                            :key="imgIndex"
                            class="single-images-back-div"
                            :class="{ 'single-images-back-active': changeList.uuid }"
                        >
                            <img
                                :class="{ 'single-images-active': isAwardActive(i, imgIndex) }"
                                :src="img"
                            />
                            <div
                                class="single-images-back"
                                v-if="isAwardBackActive(i, imgIndex)"
                            ></div>
                        </div>
                    </div>

                    <div class="single-images-active-header" v-if="showHeader">
                        <span v-if="changeList.Win">{{ formatNumber(changeList.Win) }}</span>
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
                        <img :src="opt.img" alt="" />
                        <span>{{ formatNumber(opt.Index) }}</span>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="isFreeGame" class="single-images-event">
            <span v-if="item.RoundWin">{{
                $t(item.isFrist ? "MainGameWin" : "single_details_freegamewin_mall")
            }}</span>

            <span v-if="item.RoundWin">{{ formatNumber(item.RoundWin) }}</span>
        </div>

        <div v-else-if="item.RoundWin" class="single-images-event">
            <span>{{ $t("MainGameWin") }}</span>
            <span>{{ formatNumber(item.RoundWin) }}</span>
        </div>

        <div v-if="item.FreeRemainRound" class="single-images-event">
            <span>{{ $t("Get") + item.FreeRemainRound + $t("FreeGames") }}</span>
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
        };
    },
    computed: {
        showHeader() {
            return !!this.changeList?.list;
        },
        gameTitle() {
            if (!this.isFreeGame) {
                return this.$t("MainGame");
            }

            return this.keyValue === 0 && this.item.isFrist
                ? this.$t("MainGame")
                : this.$t("FreeGame") +
                      `${this.total > 1 ? " " + this.keyValue + "/" + (this.total - 1) : ""}`;
        },
    },
    mounted() {},
    methods: {
        handleClick(opt) {
            this.changeList = opt;
        },
        isAwardActive(footerIndex, index) {
            return !!this.changeList?.list?.[footerIndex]?.includes(index);
        },
        isAwardBackActive(footerIndex, index) {
            return this.changeList?.list
                ? !this.changeList.list[footerIndex]?.includes(index)
                : false;
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

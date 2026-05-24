<template>
    <div class="single-images-list">
        <!-- 标题 -->
        <div class="single-images-title">{{ gameTitle }}</div>

        <!-- 中间中奖区域 -->
        <template v-if="hasExtend">
            <div class="single-images-contain">
                <!-- 中奖格子 -->
                <div
                    class="single-images-middle"
                    :class="middleClass"
                    v-if="item.PlateSymbolExtend.length"
                >
                    <!-- 图片区 -->
                    <div
                        class="single-images-middle-div-new"
                        v-for="(images, colIndex) in item.PlateSymbolExtend"
                        :key="colIndex"
                        :style="middleColumnStyle(colIndex)"
                    >
                        <template v-if="images.some(Boolean)">
                            <div
                                v-for="(img, rowIndex) in images"
                                :key="rowIndex"
                                v-if="img"
                                class="single-images-back-div"
                                :class="{
                                    'single-images-back-active': changeList.uuid,
                                }"
                                style="grid-row: span 3 / span 3"
                            >
                                <!-- 主图 -->
                                <img
                                    :src="img"
                                    :class="{
                                        'single-images-active': isAwardActive(colIndex, rowIndex),
                                    }"
                                />

                                <!-- 数字倍数 -->
                                <div
                                    class="single-images-num"
                                    v-if="(plateNum[colIndex] && plateNum[colIndex].length)"
                                    :class="{
                                        'single-images-num-active': isAwardActive(
                                            item.uuid,
                                            colIndex,
                                            rowIndex
                                        ),
                                    }"
                                >
                                    <img
                                        v-for="(mul, mi) in plateNum[colIndex][rowIndex]"
                                        :key="mi"
                                        :src="mul"
                                        :class="{ 'single-images-num-single': mul }"
                                        :style="numWidthStyle(colIndex, rowIndex)"
                                    />
                                </div>

                                <!-- 背景遮罩 -->
                                <div
                                    class="single-images-back"
                                    v-if="isAwardBackActive(colIndex, rowIndex)"
                                ></div>
                            </div>
                        </template>
                    </div>

                    <!-- 头部统计 -->
                    <div class="single-images-active-header" v-if="showHeader">
                        <span v-if="changeList.Win">{{ formatNumber(changeList.Win) }}</span>
                        <span>→</span>
                    </div>
                </div>

                <!-- 下方按钮 -->
                <div class="single-images-footer" v-if="(item.AwardDataVec && item.AwardDataVec.length)">
                    <div
                        v-for="(opt, i) in item.AwardDataVec"
                        :key="opt.uuid || i"
                        :class="{ 'single-footer-active': isFooterActive(opt) }"
                        @click.stop="handleClick(opt)"
                    >
                        <img :src="opt.img" alt="" />
                        <span v-if="opt.Index !== -1">{{ formatNumber(opt.Index) }}</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- 事件提示 -->
        <div v-if="showMainWin" class="single-images-event">
            <span>{{ $t("MainGameWin") }}</span>
            <span>{{ formatNumber(item.RoundWin) }}</span>
        </div>

        <div v-else-if="showBonusWin" class="single-images-event">
            <span>{{ $t("BonusWin") }}</span>
            <span>{{ formatNumber(item.BonusRoundWin) }}</span>
        </div>

        <div v-else-if="showFreeWin" class="single-images-event">
            <span>{{ $t("single_details_freegamewin_mall") }}</span>
            <span>{{ formatNumber(item.RoundWin) }}</span>
        </div>

        <div v-if="item.Spin" class="single-images-event">
            <span>{{ $t("Get") + item.Spin + $t("FreeGames") }}</span>
        </div>

        <div v-if="item.isBonus" class="single-images-event">
            <span>{{ $t("receive_bonusWin_games") }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDetail",
    props: {
        uuid: String,
        item: { type: Object, required: true },
        isFreeGame: Boolean,
        keyValue: Number,
        total: Number,
        FreeRound: Number,
    },
    data() {
        return {
            changeList: {},
        };
    },

    computed: {
        /** 是否有扩展 */
        hasExtend() {
            return Array.isArray(this.item.PlateSymbolExtend);
        },

        /** 中间格子区 class */
        middleClass() {
            if (this.keyValue === 0) return "";
            return this.item.bonusCount
                ? "single-images-middle-bonus"
                : "single-images-middle-free";
        },

        /** plateNum 简写 */
        plateNum() {
            return this.item.PlateSymbolNum || [];
        },

        /** 显示头部统计 */
        showHeader() {
            return Boolean(this.changeList?.list);
        },

        /** 标题逻辑 */
        gameTitle() {
            if (!this.isFreeGame || this.keyValue === 0) {
                return this.$t("MainGame");
            }

            if (this.item.bonusCount) {
                return `${this.$t("BonusGame")} ${this.item.bonusCount}/${
                    this.item.bonusCountTotal
                }`;
            }

            return `${this.$t("FreeGame")} ${this.item.defaultCount}/${
                this.item.defaultCountTotal
            }`;
        },

        /** 多个提示条件 */
        showMainWin() {
            return this.keyValue === 0 && this.item.RoundWin;
        },

        showBonusWin() {
            return (
                this.isFreeGame &&
                this.item.BonusRoundWin &&
                this.item.bonusCount &&
                this.item.defaultCount - this.item.bonusCount === 0
            );
        },

        showFreeWin() {
            return this.isFreeGame && this.item.RoundWin && !this.item.bonusCount;
        },
    },

    methods: {
        middleColumnStyle(i) {
            const isEquire = this.item.isEquire;
            return {
                flex: isEquire && i === 1 ? 3 : 1,
                display: isEquire && (i === 2 || i === 3) ? "none" : "",
            };
        },

        numWidthStyle(col, row) {
            const arr = this.plateNum[col]?.[row] || [];
            return {
                maxWidth: `${(100 / (arr.length + 1)).toFixed(0)}%`,
            };
        },

        handleClick(opt) {
            this.changeList = opt;
        },

        isAwardActive(col, row) {
            return Boolean(this.changeList?.list?.[col]?.includes(row));
        },

        isAwardBackActive(col, row) {
            return this.changeList.list ? !this.changeList.list[col]?.includes(row) : false;
        },

        isFooterActive(opt) {
            return this.item.uuid === this.uuid && opt.uuid === this.changeList.uuid;
        },

        formatNumber(val) {
            const n = Number(val);
            return isNaN(n) ? 0 : Number(n.toFixed(2));
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./ImageSign.scss";
</style>

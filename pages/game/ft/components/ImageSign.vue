<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ item.isBonus ? $t("BonusGame2") : $t("MainGame") }}
        </div>

        <template v-if="item.isBonus">
            <div class="single-images-contain">
                <!-- 中间中奖格子区 -->
                <div
                    class="single-images-middle single-images-middle-free"
                    v-if="(item.freeGames && item.freeGames.length)"
                >
                    <div class="single-images-middle-div">
                        <div
                            v-for="(game, index) in item.freeGames"
                            :key="index"
                            class="single-images-back-div"
                            :class="{
                                'single-images-back-active': changeList.uuid,
                                'single-images-active': isAwardActive(index, 0),
                            }"
                        >
                            <img :class="{}" :src="game.img" />
                            <div
                                class="single-images-bonus"
                                :class="{ 'single-images-active': isAwardActive(index, 0) }"
                            >
                                <div>{{ game.num }}</div>
                                <div>{{ game.win }}x</div>
                            </div>
                            <div
                                class="single-images-back"
                                v-if="isAwardBackActive(index, 0)"
                            ></div>
                        </div>
                    </div>

                    <div class="single-images-active-header" v-if="showHeader">
                        <span>{{ formatNumber(changeList.win * changeList.bet) || 0 }}</span>
                        <span>→</span>
                    </div>
                </div>

                <!-- 下方选项按钮 -->
                <div class="single-images-footer" v-if="(item.freeGames && item.freeGames.length)">
                    <div
                        v-for="(opt, i) in item.freeGames"
                        :key="i"
                        :class="{ 'single-footer-active': isFooterActive(opt) }"
                        @click.stop="handleClick(opt)"
                    >
                        <img :src="opt.img" alt="" />
                    </div>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="single-images-contain">
                <!-- 中间中奖格子区 -->
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
                    </div>
                </div>
            </div>
        </template>

        <div v-if="item.isFrist" class="single-images-event">
            <template v-if="item.isFreeGame">
                <span>{{ $t("receive_bonusWin_game") }}：</span>
            </template>
            <template v-else>
                <span>{{ $t("MainGameWin") }}</span>
            </template>

            <template v-if="item.isFreeGame">
                <span v-if="item.TotalRound"
                    >{{ item.TotalRound }} {{ $t("receive_bonusWin_game_times") }}</span
                >
            </template>
            <template v-else>
                <span v-if="item.TotalWin">{{ formatNumber(item.TotalWin) }}</span>
            </template>
        </div>

        <div v-else class="single-images-event">
            <span>{{ $t("BonusGameWin") }}：</span>

            <span v-if="item.TotalWin">{{ formatNumber(item.TotalWin) }}</span>
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

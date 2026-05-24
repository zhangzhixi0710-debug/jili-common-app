<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ gameTitle }}
        </div>

        <template v-if="item.PlateSymbolExtend">
            <div class="single-images-contain">
                <!-- 中间中奖格子区 -->
                <div
                    class="single-images-middle"
                    :class="{ 'single-images-middle-free': isFreeGame && keyValue !== 0 }"
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
                                class="single-images-num"
                                v-if="(item.PlateSymbolNumImg[i] && item.PlateSymbolNumImg[i].length)"
                                :class="{
                                    'single-images-num-active': isAwardActive(
                                        item.uuid,
                                        i,
                                        imgIndex
                                    ),
                                }"
                            >
                                <img
                                    v-for="(mul, mulIndex) in item.PlateSymbolNumImg[i][imgIndex]"
                                    :src="mul"
                                    :class="{
                                        'single-images-num-single':
                                            item.PlateSymbolNumImg[i][imgIndex][mulIndex],
                                    }"
                                    :style="{
                                        'max-width':
                                            (
                                                100 /
                                                (item.PlateSymbolNumImg[i][imgIndex].length + 1)
                                            ).toFixed(0) + '%',
                                    }"
                                />
                            </div>

                            <div
                                class="single-images-back"
                                v-if="isAwardBackActive(i, imgIndex)"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="item.RoundWin" class="single-images-event">
            <span>{{ $t("MainGameWin") }}</span>
            <span>{{ formatNumber(item.RoundWin) }}</span>
        </div>

        <template v-if="(item.SpeicalVec && item.SpeicalVec.length)">
            <div v-for="value in item.SpeicalVec" class="single-images-speical">
                <img :src="value.img" />
                <span>{{ speicalVecTitle(value.SPType) }}</span>
            </div>
        </template>
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

            return this.keyValue === 0
                ? this.$t("MainGame")
                : this.$t("FreeGame") +
                      `${this.total > 1 ? " " + this.keyValue + "/" + (this.total - 1) : ""}`;
        },
    },
    mounted() {},
    methods: {
        speicalVecTitle(val) {
            if (val === 1) {
                return 'win up'
            }
            if (val === 2) {
                return 'double'
            }
            if (val === 3) {
                return 'extra'
            }
            if (val === 4) {
                return 'max win'
            }
        },
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

            const epsilon = 1e-10;
            let num = Number(val);

            const roundedToInt = Math.round(num);
            if (Math.abs(num - roundedToInt) < epsilon) {
                return roundedToInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") * 1;
            }

            const formatted = num.toFixed(3);
            const [intPart, decimalPart] = formatted.split(".");
            if (decimalPart === "000") {
                return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") * 1;
            }

            const resultStr = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimalPart;
            return resultStr * 1;
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./ImageSign.scss";
</style>

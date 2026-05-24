<template>
    <div class="single-images-list">
        <div class="single-images-title">
            {{ $t("MainGame") }}
        </div>

        <div v-for="(item, index) in config" :key="index" v-if="config && config.length">
            <template v-if="item.PlateSymbolExtend">
                <div class="single-images-contain">
                    <!-- 盘面展示 -->
                    <div
                        class="single-images-middle"
                        :class="{
                            'single-images-middle-free': index !== 0,
                        }"
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
                                :class="{
                                    'single-images-back-active': isAwardActive(
                                        item.uuid,
                                        i,
                                        imgIndex
                                    ),
                                }"
                            >
                                <img
                                    :data-img="img"
                                    :class="{
                                        'single-images-active': isAwardActive(
                                            item.uuid,
                                            i,
                                            imgIndex
                                        ),
                                    }"
                                    :src="img"
                                    class="single-images-back-img"
                                />

                                <div
                                    class="single-images-num"
                                    v-if="(item.PlateMulExtend[i] && item.PlateMulExtend[i].length)"
                                    :class="{
                                        'single-images-num-active': isAwardActive(
                                            item.uuid,
                                            i,
                                            imgIndex
                                        ),
                                    }"
                                >
                                    <img
                                        v-for="(mul, mulIndex) in item.PlateMulExtend[i][imgIndex]"
                                        :src="mul"
                                        :class="{
                                            'single-images-num-single':
                                                item.PlateMulExtendIndex[i][imgIndex][mulIndex],
                                        }"
                                        :style="{
                                            'max-width':
                                                (
                                                    100 /
                                                    (item.PlateMulExtend[i][imgIndex].length + 2)
                                                ).toFixed(0) + '%',
                                        }"
                                    />
                                </div>
                                <div
                                    class="single-images-back"
                                    v-if="isAwardBackActive(item.uuid, i, imgIndex)"
                                ></div>
                            </div>
                        </div>

                        <div class="single-images-active-header" v-if="showHeader(item.uuid)">
                            <span v-if="(changeList[item.uuid] && changeList[item.uuid].Win)">{{
                                formatNumber(changeList[item.uuid].Win)
                            }}</span>
                            <span>→</span>
                        </div>
                    </div>

                    <!-- 下方中奖符号选项按钮 -->
                    <div class="single-images-footer" v-if="(item.AwardDataVec && item.AwardDataVec.length)">
                        <div
                            v-for="(opt, i) in item.AwardDataVec"
                            :key="i"
                            :class="{ 'single-footer-active': isFooterActive(item.uuid, opt.uuid) }"
                            @click.stop="handleClick(item.uuid, opt)"
                        >
                            <img :src="opt.img" alt="" />
                            <span v-if="opt.img">{{ formatNumber(opt.Pos) }}</span>
                            <span v-else>{{ (opt.Index || 0) + 1 }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="single-images-footer-tip" v-if="isAwred">
            <div class="single-images-event" v-if="TotalWin">
                <span>{{ $t("MainGameWin") }}</span>
                <span>{{ formatNumber(TotalWin) || 0 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDetail",
    props: {
        uuid: { type: String, required: false },
        config: { type: Array, required: false, default: () => [] },
        TotalWin: { type: Number },
        MiniSoreMoney: { type: Number },
        MinorMoney: { type: Number },
        MajorMoney: { type: Number },
        isAwred: { type: Boolean, default: false },
    },
    data() {
        return {
            changeList: [],
        };
    },
    mounted() {
        console.log(this.config);
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
@use "./ImageSign.scss";

.single-images-num {
    display: flex;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-width: 100%;
    left: 0;
    right: 0;
    width: 100%;
    justify-content: center;
    overflow: hidden;

    img {
        // flex: 1 1 auto;
        height: auto;
        object-fit: contain;
    }
    .single-images-num-single {
        max-width: 15% !important;
    }
}
.single-images-num-active {
    z-index: 1111;
}

.single-images-list {
    display: flex;
    flex-direction: column;
    gap: 0px;
}

.single-images-middle {
    display: flex;
    gap: 0;
}

.single-images-middle-div-new {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.single-images-back-div {
    position: relative;
}

.single-images-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
}

.single-footer-active {
    background: #ffcc00;
    color: #000;
    border-radius: 6px;
}

.total-win {
    font-size: 18px;
    font-weight: bold;
    color: #ff4444;
}
.single-images-footer-tip {
    margin-bottom: 10px;
}
</style>

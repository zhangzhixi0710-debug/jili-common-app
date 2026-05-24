<template>
    <div class="single-images-list">
        <div v-for="(item, index) in config.plates" :key="index">
            <div class="single-images-title" v-if="shouldShowTitle(index)">
                {{ keyValue === 0 ? $t("MainGame") : $t("FreeGame") }}
            </div>

            <template v-if="item.ColumnSymbol">
                <div class="single-images-contain">
                    <!-- 中间中奖格子区 -->
                    <div
                        class="single-images-middle"
                        :class="{ 'single-images-middle-free': isFreeGame }"
                        v-if="(item.ColumnSymbol && item.ColumnSymbol.length)"
                    >
                        <div
                            class="single-images-middle-div-new"
                            v-for="(images, imagesIndex) in item.ColumnSymbol"
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
                                <div
                                    class="single-images-back"
                                    v-if="isAwardBackActive(item.uuid, imagesIndex, imgIndex)"
                                ></div>
                            </div>
                        </div>

                        <div class="single-images-active-header" v-if="showHeader(item.uuid)">
                            <span v-if="(changeList[item.uuid] && changeList[item.uuid].AwardMoney)">{{
                                formatNumber(changeList[item.uuid].AwardMoney)
                            }}</span>
                            <span>→</span>
                        </div>
                    </div>

                    <!-- 下方选项按钮 -->
                    <div class="single-images-footer" v-if="(item.AwardDataList && item.AwardDataList.length)">
                        <div
                            v-for="(opt, optI) in item.AwardDataList"
                            :key="optI"
                            class="single-footer-default"
                            :class="{ 'single-footer-active': isFooterActive(item.uuid, opt.uuid) }"
                            @click.stop="handleClick(item.uuid, opt)"
                        >
                            <img :src="opt.img" alt="" />
                            <span>{{ opt.odds }}</span>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="config.plates.length - 1 === index && config.RoundWin">
                <div class="single-images-event">
                    <span>{{
                        $t(
                            keyValue === 0
                                ? "MainGameWin"
                                : "single_details_freegamewin"
                        )
                    }}</span>

                    <span>{{ formatNumber(config.RoundWin) }}</span>
                </div>
            </template>

            <div
                v-if="config.plates.length - 1 === index && config.FreeCount"
                class="single-images-event"
            >
                <span>{{ $t("Get") + config.FreeCount + $t("FreeGames") }}</span>
            </div>

            <div
                v-if="config.plates.length - 1 === index && config.ExtraOdds && keyValue !== 0"
                class="single-images-event"
            >
                <span>{{ $t("Multiple") }}</span>
                <span>{{ config.ExtraOdds }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ImageDetail",
    props: {
        uuid: { type: String, required: false },
        config: { type: Object, required: true },
        isFreeGame: { type: Boolean, default: false },
        keyValue: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    data() {
        return {
            changeList: [],
        };
    },
    computed: {
        shouldShowTitle() {
            return (index) => {
                return (this.isFreeGame && (this.keyValue === 0 || index === 0)) || (!this.isFreeGame && index === 0);
            };
        },
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
            // 统一数值格式化，去除多余小数点
            return Number(val).toFixed(2);
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./ImageSign.scss";
</style>

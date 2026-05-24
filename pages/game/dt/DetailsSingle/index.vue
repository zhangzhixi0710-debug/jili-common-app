<template>
    <div class="single-container single">
        <!-- 基本信息 -->
        <div class="single-detail">
            <div class="single-detail-cell" v-for="(value, key) in detailFields" :key="key">
                <div>{{ $t(value.label) }}</div>
                <div :class="value.class ? value.class(formData[value.field]) : ''">
                    <span v-if="value.html" v-html="value.html(formData[value.field])"></span>
                    <span v-else>{{
                        value.filter ? value.filter(formData[value.field]) : formData[value.field]
                    }}</span>
                </div>
            </div>
        </div>

        <!-- 分隔 -->
        <div class="single-footer-data">
            <span>{{ $t("i18_RecordDetail") }}</span>
            <div class="single-table-sort">
                <el-checkbox class="custom-checkbox" v-model="sortCheck">WinSort</el-checkbox>
            </div>
        </div>

        <!-- 图片内容 -->
        <div class="history-content-data">
            <div class="history-data">
                <div>
                    <div
                        class="div-table-portrait"
                        v-for="(item, index) in RoundQueue"
                        :key="index"
                    >
                        <div class="div-table-row-portrait div-table-header-portrait">
                            <div
                                class="div-table-cell-portrait"
                                :style="{ padding: item.img ? '10px 0' : '' }"
                            >
                                {{ $t("i18_Fish") }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ $t("i18_Odds") }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ $t("i18_Bet") }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ $t("i18_Win") }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ $t("i18_Remark") }}
                            </div>
                        </div>
                        <div class="div-table-row-portrait div-table-content-portrait">
                            <div class="div-table-cell-portrait">
                                <img v-if="item.img" :src="item.img" />
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ item.Odd }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ item.Bet }}
                            </div>
                            <div class="div-table-cell-portrait">
                                {{ item.Win }}
                            </div>
                            <div class="div-table-cell-portrait">
                                <img
                                    :src="item.bulletImg"
                                    v-if="item.Win && item.Win * 1 && item.bulletImg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!RoundQueue.length" class="single-footer-text">{{ $t('i18_NoKillingRecords') }}</div>
            <div class="single-btn" @click="backHome">{{ $t("i18_BackToPreviousPage") }}</div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Checkbox, CheckboxGroup } from "element-ui";

// 按需注册组件
Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxGroup.name, CheckboxGroup);
import { getLanguageValue } from "@/i18n";
import { langMap, $locale } from "@/utils/language";
import { formatCurrency, formatTime, formatStartTime } from "@/utils/formatter";

export default {
    name: "DetailsSingle",
    props: {
        gameId: { type: String, required: true },
        singleData: { type: Object, default: () => ({}) },
        decoded: { type: Array, default: () => [] },
    },
    data() {
        return {
            lang: getLanguageValue(),
            formData: {},
            RoundQueue: [],
            sortCheck: false,
            originalListData: [], // 用于恢复原始顺序
        };
    },
    computed: {
        detailFields() {
            return [
                { label: "i18_Account", field: "Account" },
                { label: "i18_RoundNumber", field: "RoundIndex" },
                {
                    label: "i18_NetWorth",
                    field: "NetValue",
                    class: v => (v * 1 > 0 ? "green" : "red"),
                },
                { label: "i18_Bet", field: "Bet" },
                { label: "i18_Win", field: "Win" },
                {
                    label: "i18_StartTime",
                    field: "CreateTime",
                    html: v => this.formatStartTime(v || new Date().getTime(), false),
                },
                {
                    label: "i18_EndTime",
                    field: "CreateTime",
                    html: v => this.formatTime(v || new Date().getTime(), false),
                },
                {
                    label: "i18_PostMoney",
                    field: "PostMoney",
                    filter: formatCurrency,
                },
            ];
        },
    },
    watch: {
        "$i18n.locale": {
            immediate: true,
            handler(val) {
                this.setLocale(val);
            },
        },
        sortCheck(newVal) {
            if (newVal) {
                // 排序
                this.RoundQueue = [...this.RoundQueue].sort((a, b) => b.Win - a.Win);
            } else {
                // 恢复原始顺序
                this.RoundQueue = [...this.originalListData];
            }
        },
    },
    mounted() {
        this.setLocale(this.lang);
        this.initFormData();
        this.initData();
    },
    methods: {
        setLocale(locale) {
            $locale.use(langMap[locale] || langMap["en-US"]);
        },
        async initData() {
            if (!this.decoded) return;
            console.log(this.decoded);
            this.RoundQueue = [...this.decoded];

            this.RoundQueue.forEach(fish => {
                try {
                    fish.img = require(`@/assets/images/intro/${this.gameId}/${fish.Fish}.webp`);
                } catch (error) {}
                const bullet = this.filterBulletImageId(fish.Remark);

                if (bullet) {
                    fish.bulletImg = require(`@/assets/images/intro/${this.gameId}/${bullet}`);
                }
            });

            this.originalListData = [...this.RoundQueue]; // 保存原始顺序
        },
        filterIconImageId(id) {
            return `${id >= 10 ? id : "0" + id}.png`;
        },
        filterBulletImageId(name) {
            switch (name) {
                case "Normal":
                    return "";
                case "RailGun":
                    return "201.webp";
                case "Bomb":
                    return "bullet_6.webp";
                case "Energy":
                    return "bullet_7.webp";
                default:
                    return "";
            }
        },
        initFormData() {
            this.formData = this.singleData || {};
        },
        moveUnequalToMiddle(arr) {
            if (!Array.isArray(arr) || arr.length !== 3) return arr;
            let uniqueValue;
            if (arr[0] !== arr[1] && arr[0] !== arr[2]) uniqueValue = arr[0];
            else if (arr[1] !== arr[0] && arr[1] !== arr[2]) uniqueValue = arr[1];
            else uniqueValue = arr[2];
            const result = arr.filter(item => item !== uniqueValue);
            result.splice(1, 0, uniqueValue);
            return result;
        },
        backHome() {
            this.$emit("update:back", "detail");
        },
        formatTime,
        formatStartTime,
    },
    filters: {
        formatCurrency,
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

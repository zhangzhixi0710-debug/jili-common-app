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
            {{ $t("i18_RecordDetail") }}
        </div>

        <!-- 图片内容 -->
        <div class="single-images">
            <GameImageDetail
                :uuid="RoundQueue.uuid"
                :config="RoundQueue.rounds"
                :TotalWin="RoundQueue.TotalWin" 
                :MiniSoreMoney="RoundQueue.MiniSoreMoney"
                :MinorMoney="RoundQueue.MinorMoney"
                :MajorMoney="RoundQueue.MajorMoney"
                :isAwred="RoundQueue.isAwred" />
        </div>
        <!-- 返回按钮 -->
        <div class="single-btn" @click="backHome">{{ $t("i18_BackToPreviousPage") }}</div>
    </div>
</template>

<script>
import { getLanguageValue } from "@/i18n";
import { langMap, $locale } from "@/utils/language";
import { formatCurrency, formatTime } from "@/utils/formatter";
import GameImageDetail from "../components/ImageSign";

export default {
    name: "DetailsSingle",
    components: { GameImageDetail },
    props: {
        gameId: { type: String, required: true },
        singleData: { type: Object, default: () => ({}) },
        decoded: { type: Object, default: () => {} },
    },
    data() {
        return {
            lang: getLanguageValue(),
            formData: {},
            RoundQueue: {},
        };
    },
    computed: {
        detailFields() {
            return [
                { label: "i18_Account", field: "Account", class: () => "yellow" },
                { label: "i18_RoundNumber", field: "RoundIndex" },
                {
                    label: "i18_NetWorth",
                    field: "NetValue",
                    class: v => (v * 1 > 0 ? "green" : "red"),
                },
                { label: "i18_Bet", field: "Bet" },
                { label: "i18_Win", field: "Win" },
                {
                    label: "i18_Time",
                    field: "CreateTime",
                    html: v => this.formatTime(v || new Date().getTime(), true),
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
    },
    mounted() {
        this.setLocale(this.lang);
        this.initData();
    },
    methods: {
        setLocale(locale) {
            $locale.use(langMap[locale] || langMap["en-US"]);
        },
        async initData() {
            if (!this.decoded) return;

            this.formData = this.singleData || {};

            this.RoundQueue = this.decoded;
        },
        backHome() {
            this.$emit("update:back", "detail");
        },
        formatTime,
    },
    filters: {
        formatCurrency,
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

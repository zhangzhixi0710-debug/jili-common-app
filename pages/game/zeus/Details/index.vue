<template>
    <div class="history-container history">
        <div v-if="isLoading" class="fullscreen-loading">
            <van-loading type="spinner" size="24px" vertical></van-loading>
        </div>
        <div class="history-content">
            <div class="history-title" @click="backHome">
                {{ $t("i18_Report") }}
            </div>
            <span>&lt;</span>
            <div class="history-title-sub">{{ config.nameValue }}</div>
        </div>

        <div class="history-form">
            <div class="history-row">
                <span>{{ $t("i18_FastSearch") }}：</span>
                <div class="history-search">
                    <div
                        class="history-search-item"
                        :class="{ active: activeTime == item.id }"
                        v-for="(item, index) in searchData"
                        :key="index"
                        @click="searchMinutes(item)"
                    >
                        {{ item.time }}
                    </div>
                </div>
            </div>
            <div class="history-row">
                <span>{{ $t("i18_DateSearch") }}：</span>
                <div class="history-row-bottom">
                    <el-date-picker
                        ref="datePicker"
                        v-model="dateData"
                        type="date"
                        size="mini"
                        placeholder=""
                        :picker-options="pickerOptions"
                        style="width: 100% !important"
                        value-format="yyyy-MM-dd"
                        :popper-class="popperClass"
                        :key="popperClass"
                    />
                    <van-button icon="delete-o" @click="clearDate" />
                    <van-button icon="search" @click="searchDate" />
                </div>
            </div>
            <div class="history-row">
                <span>{{ $t("i18_RoundSearch") }}：</span>
                <div class="history-row-bottom">
                    <el-input v-model="roundNumber" placeholder=""></el-input>
                    <van-button icon="delete-o" @click="clearNumber" />
                    <van-button icon="search" @click="searchIndex" />
                </div>
            </div>
        </div>

        <div class="history-content-data">
            <div class="history-data">
                <div>
                    <div v-if="isPcMax">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            :finished-text="listData.length ? '' : $t('i18_NoResult')"
                            @load="onLoad"
                            :offset="10"
                        >
                            <div class="div-table">
                                <div class="div-table-row div-table-header">
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ $t("i18_SpecialAward") }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 230px">
                                        {{ $t("i18_RoundNumber") }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ $t("i18_NetWorth") }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ $t("i18_NiuNiuAnte") }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ $t("i18_Result_Win") }}
                                    </div>
                                    <div class="div-table-cell">{{ $t("i18_Time") }}</div>
                                </div>
                                <div
                                    class="div-table-row"
                                    v-for="(item, index) in listData"
                                    :key="index"
                                    @click="onRowClick(item)"
                                >
                                    <div class="div-table-cell" style="max-width: 140px">-</div>
                                    <div class="div-table-cell" style="max-width: 230px">
                                        {{ item.RoundIndex }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        <span :class="[item.NetValue * 1 > 0 ? 'green' : 'red']">{{
                                            item.NetValue
                                        }}</span>
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ item.Bet }}
                                    </div>
                                    <div class="div-table-cell" style="max-width: 140px">
                                        {{ item.Win }}
                                    </div>
                                    <div class="div-table-cell">
                                        <span v-html="timeFormat(item.CreateTime, 1)"></span>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                    <div v-else>
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            :finished-text="listData.length ? '' : $t('i18_NoResult')"
                            @load="onLoad"
                            :offset="10"
                        >
                            <div
                                class="div-table-portrait"
                                v-for="(item, index) in listData"
                                :key="index"
                                @click="onRowClick(item)"
                            >
                                <div class="div-table-row-portrait div-table-header-portrait">
                                    <div class="div-table-cell-portrait">
                                        {{ $t("i18_NetWorth") }} /
                                        {{ $t("i18_SpecialAward") }}
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        {{ $t("i18_NiuNiuAnte") }} / {{ $t("i18_Result_Win") }}
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        {{ $t("i18_RoundNumber") }}
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        {{ $t("i18_Time") }}
                                    </div>
                                </div>
                                <div class="div-table-row-portrait div-table-content-portrait">
                                    <div class="div-table-cell-portrait">
                                        <span
                                            :class="[
                                                item.NetValue && item.NetValue > 0
                                                    ? 'green'
                                                    : 'red',
                                            ]"
                                            >{{ item.NetValue }}</span
                                        >
                                        <span>/</span>
                                        <span>-</span>
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        <span>{{ item.Bet }}</span>
                                        <span>/</span>
                                        <span>{{ item.Win }}</span>
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        {{ item.RoundIndex }}
                                    </div>
                                    <div class="div-table-cell-portrait">
                                        <span v-html="timeFormat(item.CreateTime)"></span>
                                    </div>
                                </div>
                            </div>
                        </van-list>
                    </div>
                </div>
            </div>
            <div class="history-btn" @click="backHome">{{ $t("i18_BackToPreviousPage") }}</div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { Input, DatePicker } from "element-ui";
import "element-ui/lib/theme-chalk/input.css";
import "element-ui/lib/theme-chalk/date-picker.css";

Vue.component(Input.name, Input);
Vue.component(DatePicker.name, DatePicker);

import { Detail, HistoryItem } from "@/api/game.js";
import { getLanguageValue } from "@/i18n";
import * as Proto from "@/utils/proto.js";
import { gtTranMap } from "@/calculate/gtTranMap";
import { decodeProto, formatTimeGmt8 } from "@/utils";
import { processGameData } from "@/calculate/zeus";
import { SEARCH_DATA } from "@/constants/index";

const DEFAULT_CONFIG = {
    nameValue: "",
    EndRowIndex: 10,
    EnterTime: Date.now(),
    LangId: "en-US",
    LogIndexAsRoundIndex: false,
    Minutes: "60",
    StartRowIndex: 1,
};

export default {
    name: "Detail",
    inject: ["isPcMaxVal"],
    props: {
        gameId: String,
        config: {
            type: Object,
            default: () => ({ ...DEFAULT_CONFIG }),
        },
    },
    computed: {
        isPcMax() {
            return this.isPcMaxVal();
        },
    },
    data() {
        return {
            isLoading: false,
            lang: getLanguageValue(),
            isDirection: this.$store.getters.direction,
            searchData: [],
            dateData: "",
            roundNumber: "",
            activeTime: 60,
            pickerOptions: {
                disabledDate: time => time.getTime() > Date.now(),
            },
            listData: [],
            loading: false,
            finished: false,
            allLoaded: false,
            searchForm: {},
            page: 1,
            defaultHeightLign: [11, 12, 13, 17, 18, 19],
            SCATTER_SYMBOL: 14,
            popperClass: "",
        };
    },
    watch: {
        "$store.getters.direction": {
            handler(newVal) {
                this.isDirection = newVal;

                if (this.isDirection === "landscape") {
                    this.popperClass =
                        "custom-large-date-picker custom-large-date-picker-landscape";
                } else {
                    this.popperClass = "custom-large-date-picker";
                }
            },
            immediate: true,
        },
        isPcMax: {
            handler() {},
            immediate: true,
        },
    },
    mounted() {
        this.initSearchData();
        this.searchForm = { ...DEFAULT_CONFIG, ...(this.config || {}) };
        this.activeTime = this.searchForm.Minutes || this.activeTime;

        this.initData();
    },
    methods: {
        /** 初始化快捷时间多语言数据 */
        initSearchData() {
            this.searchData = SEARCH_DATA.map(item => ({ ...item, time: this.$t(item.timeKey) }));
        },
        /** 重置分页和查询条件并加载数据 */
        resetAndLoad(newSearchForm) {
            this.searchForm = { ...DEFAULT_CONFIG, ...newSearchForm };
            this.finished = false;
            this.allLoaded = false;
            this.listData = [];
            this.loadDetailData();
        },
        /** 快速时间查询 */
        searchMinutes(item) {
            this.activeTime = item.id;
            this.resetAndLoad({
                Minutes: this.activeTime,
                LangId: this.lang,
                EnterTime: Date.now(),
            });
        },
        /** 日期查询 */
        searchDate() {
            this.activeTime = "";
            if (!this.dateData) return;
            this.resetAndLoad({
                TimeZoneOffsetMinutes: 480,
                Date: this.dateData,
                LangId: this.lang,
            });
        },
        /** 局号查询 */
        searchIndex() {
            if (!this.roundNumber) return;
            this.resetAndLoad({
                RoundIndex: this.roundNumber,
                LangId: this.lang,
            });
        },
        clearDate() {
            this.dateData = "";
        },
        clearNumber() {
            this.roundNumber = "";
        },
        /** 分页加载数据 */
        async loadDetailData() {
            if (this.allLoaded || !this.gameId) {
                this.loading = false;
                return;
            }
            this.loading = true;
            try {
                const res = await Detail(this.gameId, { ...this.searchForm });
                const data = res?.Data || [];
                if (data.length) {
                    this.listData = this.listData.concat(data);
                    if (data.length < 10) {
                        this.finished = true;
                        this.allLoaded = true;
                    }
                    this.searchForm.StartRowIndex = this.searchForm.EndRowIndex + 1;
                    this.searchForm.EndRowIndex += 10;
                } else {
                    this.finished = true;
                    this.allLoaded = true;
                    this.searchForm = { ...DEFAULT_CONFIG };
                }
            } catch (e) {
                this.finished = true;
                this.allLoaded = true;
                this.$toast?.fail(this.$t("common.error"));
            }
            this.loading = false;
        },
        /** 初始化数据 */
        initData() {
            this.finished = false;
            this.allLoaded = false;
            this.listData = [];
            this.loadDetailData();
        },
        /** 行点击，获取详细数据并解析 */
        async onRowClick(item) {
            this.isLoading = true;

            try {
                const res = await HistoryItem(this.gameId, {
                    RoundIndex: item.RoundIndex,
                    Time: item.CreateTime,
                });
                const data = res?.Data;
                if (!data) return;
                let decoded;
                if (data.type == "1") {
                    decoded = decodeProto(this.gameId, data, Proto, gtTranMap);
                } else if (data.type == "2") {
                    decoded = data?.sp;
                }

                console.log(JSON.parse(JSON.stringify(decoded)));
                if (!decoded) return;

                const result = processGameData(decoded, this.gameId);

                console.log(result, " =======");
                this.$emit("update:click", item, result);
            } catch (error) {
                debugger;
                this.$toast?.fail(this.$t("common.error"));
            }

            this.isLoading = false;
        },
        /** 格式化时间戳为 GMT+8 */
        timeFormat(timestamp, multiline) {
            return formatTimeGmt8(timestamp, multiline);
        },
        /** 返回首页 */
        backHome() {
            this.$emit("update:back");
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

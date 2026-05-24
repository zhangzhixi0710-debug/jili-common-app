<template>
    <div class="container list-content" :class="{ 'list-content-pc': isPcMax }">
        <div class="banner-swiper">
            <swiper
                class="banner-swiper-inner"
                :autoplay="true"
                :interval="5000"
                :duration="0"
                :circular="true"
                :disable-touch="true"
                :current="bannerCurrent"
                @change="onBannerChange"
            >
                <swiper-item v-for="(banner, index) in bannerImages" :key="index">
                    <img :src="banner" class="slide-img" />
                </swiper-item>
            </swiper>
            <div class="swiper-button-prev" @click.stop="prevBanner"></div>
            <div class="swiper-button-next" @click.stop="nextBanner"></div>
        </div>
        <div class="footer">
            <div class="footer-search">
                <div class="footer-search-input">
                    <div class="search-title-div">
                        <span>{{ $t("i18_Report") }}</span
                        ><span>&lt;</span>
                    </div>
                    <input
                        class="search-input"
                        :placeholder="$t('i18_SearchGame')"
                        v-model="search"
                    />
                </div>
                <img class="search-icon" src="@/assets/global/search.svg" @click="onSearch" />
            </div>
            <div class="footer-data">
                <span class="footer-data-title">{{ $t("i18_SelectGame") }}</span>
                <div class="footer-list">
                    <van-list
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="initData"
                        :offset="20"
                    >
                        <div class="image-grid">
                            <div
                                v-for="(item, index) in list"
                                :key="item.Id + index"
                                class="image-item"
                                @click="toDetail(item)"
                            >
                                <img
                                    :src="item.imgWebp"
                                    class="grid-img"
                                    :data-img="item.imgWebpString"
                                />
                                <img
                                    class="bg-overlay-img grid-img"
                                    v-if="!noJILI.includes(item.Id)"
                                    :src="$jili"
                                />
                                <div v-if="index === 0" class="bg-overlay-left"></div>
                                <div v-if="!item.imgWebp" class="no-img-text">
                                    {{ item.imgWebpString }}
                                </div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getGameList } from "@/api/game.js";
import { getLanguageValue } from "@/i18n";
import { GAME_NAME_PREFIX } from "@/constants/index";
import langCN from "@/i18n/locales/zh-CN";
import langEN from "@/i18n/locales/en-US";
import nameVN from "@/i18n/locales/vi-VN";
import { data } from "@/utils/list-data";

export default {
    name: "Game",
    inject: ["isPcMaxVal"],
    props: ["firstGame"],
    data() {
        return {
            bannerImages: [
                require("@/assets/images/banner/banner_0.jpg"),
                require("@/assets/images/banner/banner_1.jpg"),
                require("@/assets/images/banner/banner_2.jpg"),
            ],
            bannerCurrent: 0,
            list: [],
            posthost: "",
            sac: "",
            finished: false,
            allData: [],
            page: 1,
            pageSize: 20,
            loadSize: 12,
            lang: "en-US",
            specialLang: "vi-VN",
            search: "",
            loading: false,
            noJILI: [
                "MTCC",
                "MTDF",
                "MTDN",
                "MTGF",
                "MTGTF",
                "MTLKF",
                "MTTC",
                "MTFML",
                "MTFAM",
                "MTFASW",
                "MTFDBS",
                "MTFDIA",
                "MTFDSS",
                "MTFDT",
                "MTFFD",
                "MTFGCB",
                "MTFGL",
                "MTFGLG",
                "MTFGM",
                "MTFGSK",
                "MTFGTF",
                "MTFKC",
                "MTFKS",
                "MTFLKSF",
                "MTFNB",
                "MTFOO",
                "MTFPP",
                "MTFPS",
                "MTFSB",
                "MTFSFB",
                "MTFSFD",
                "MTFSON",
                "MTFTT",
                "MTFTW",
                "MTFURD",
            ],
        };
    },
    computed: {
        isPcMax() {
            return this.isPcMaxVal();
        },
    },
    watch: {
        isPcMax: {
            handler(val) {
                if (val) {
                    this.pageSize = 20
                } else {
                    this.pageSize = 40
                }

                this.initData()
            },
            immediate: true,
        },
    },
    created() {
        const { posthost, sac } = this.$route.query;
        this.posthost = posthost;
        this.sac = sac;
    },
    mounted() {
        this.lang = getLanguageValue();
    },
    methods: {
        onBannerChange(event) {
            this.bannerCurrent = event.detail.current;
        },
        prevBanner() {
            const lastIndex = this.bannerImages.length - 1;
            this.bannerCurrent = this.bannerCurrent === 0 ? lastIndex : this.bannerCurrent - 1;
        },
        nextBanner() {
            this.bannerCurrent =
                this.bannerCurrent === this.bannerImages.length - 1 ? 0 : this.bannerCurrent + 1;
        },
        // 搜索功能优化，支持中英文名模糊搜索
        onSearch() {
            this.page = 1;
            this.finished = false;
            this.loading = false;

            const searchVal = this.search.trim().toUpperCase();
            this.list = this.allData.filter(item => {
                const nameCN = item.nameCN?.toUpperCase() || "";
                const nameEN = item.nameEN?.toUpperCase() || "";
                const nameVN = item.nameVN?.toUpperCase() || "";
                return (
                    nameCN.includes(searchVal) ||
                    nameCN.includes(searchVal) ||
                    nameEN.includes(searchVal) ||
                    nameEN.includes(searchVal) ||
                    nameVN.includes(searchVal) ||
                    nameVN.includes(searchVal)
                );
            });
            if (this.list.length <= this.pageSize) {
                this.finished = true;
            }
        },
        // 指定ID置顶
        moveIdToFirst(arr, targetId) {
            if (!targetId) return arr;
            return [...arr].sort((a, b) => {
                if (a.No == targetId) return -1;
                if (b.No == targetId) return 1;
                return 0;
            });
        },
        // 初始化数据，支持分页加载
        async initData() {
            if (this.finished || this.loading) return;
            this.loading = true;
            try {
                if (!this.allData.length) {
                    const res = data;
                    // const res = await getGameList();
                    const dataArr = res?.Data || [];
                    if (!dataArr.length) {
                        this.finished = true;
                        return;
                    }

                    let exists = dataArr.some(item => item.No === 225);

                    // 如果不存在，则插入新对象
                    if (!exists) {
                        dataArr.push({
                            No: 225,
                            Id: "CTK",
                            Name: "板球王 18",
                            Show: true,
                            IsInternal: false,
                            StartDateTime: -62135595780000,
                            IconType: 3,
                            Multiple: 2000,
                            Jackpot: false,
                            SearchKeywords: null,
                        });
                    }

                    exists = dataArr.some(item => item.No === 372);

                    // 如果不存在，则插入新对象
                    if (!exists) {
                        dataArr.push({
                            No: 372,
                            Id: "DTS",
                            Name: "三重瑞龙",
                            Show: true,
                            IsInternal: false,
                            StartDateTime: -62135595780000,
                            IconType: 3,
                            Multiple: 2000,
                            Jackpot: false,
                            SearchKeywords: null,
                        });
                    }

                    exists = dataArr.some(item => item.No === 230);

                    // 如果不存在，则插入新对象
                    if (!exists) {
                        dataArr.push({
                            No: 230,
                            Id: "CTS",
                            Name: "板球萨赫 75",
                            Show: true,
                            IsInternal: false,
                            StartDateTime: -62135595780000,
                            IconType: 3,
                            Multiple: 2000,
                            Jackpot: false,
                            SearchKeywords: null,
                        });
                    }

                    exists = dataArr.some(item => item.No === 302);

                    // 如果不存在，则插入新对象
                    if (!exists) {
                        dataArr.push({
                            No: 302,
                            Id: "MCP",
                            Name: "疯狂钱来也-扩充押注",
                            Show: true,
                            IsInternal: false,
                            StartDateTime: -62135595780000,
                            IconType: 3,
                            Multiple: 10000,
                            Jackpot: false,
                            SearchKeywords: null,
                        });
                    }

                    let result = this.firstGame
                        ? this.moveIdToFirst(dataArr, this.firstGame)
                        : dataArr;

                    let lang = this.lang;

                    result.forEach(data => {
                        if (lang === this.specialLang && !this.noJILI.includes(data.Id)) {
                            lang = "en-US";
                        }

                        try {
                            data.imgWebp = require(`@/assets/images/gamehistory/${data.Id.toLowerCase()}/icon3/icon_${lang}.webp`);

                            data.imgWebpString = `@/assets/images/gamehistory/${data.Id.toLowerCase()}/icon3/icon_${lang}.webp`;
                        } catch (error) {
                            data.imgWebp = "";
                            data.imgWebpString = data.Name;
                        }

                        data.nameValue = this.$t(`${GAME_NAME_PREFIX + data.Id}`);
                        data.nameCN = langCN[GAME_NAME_PREFIX + data.Id];
                        data.nameEN = langEN[GAME_NAME_PREFIX + data.Id];
                        data.nameVN = nameVN[GAME_NAME_PREFIX + data.Id];
                    });

                    this.allData = result;
                    if (this.firstGame && result.length) {
                        this.$emit("update:first", result[0].Id);
                    }
                    this.page = 1;
                    this.list = [];
                    this.finished = false;
                }
                this.initShowData();
            } finally {
                this.$nextTick(() => {
                    this.loading = false;
                    this.$forceUpdate();
                });
            }
        },
        // 分页展示数据
        initShowData() {
            const start = this.page === 1 ? 0 : this.pageSize + (this.page - 2) * this.loadSize;
            const size = this.page === 1 ? this.pageSize : this.loadSize;
            const end = start + size;
            const pageData = this.allData.slice(start, end);
            this.list = [...this.list, ...pageData];
            if (end >= this.allData.length) {
                this.finished = true;
            } else {
                this.page += 1;
            }
        },
        toDetail(item) {
            this.$emit("click", item);
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

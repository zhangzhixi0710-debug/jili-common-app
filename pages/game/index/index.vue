<template>
    <div class="layout">
        <div v-if="isLoading" class="fullscreen-loading">
            <van-loading type="spinner" size="24px" vertical></van-loading>
        </div>
        <Header :config="config" />
        <div class="main">
            <div class="text-main">
                <div class="vertical-text">
                    <swiper
                        ref="mySwiper"
                        v-if="messages.length"
                        :options="swiperOptionText"
                        class="vertical-swiper"
                    >
                        <swiper-slide v-for="(item, index) in messages" :key="index">
                            <div class="vertical-text-content">
                                <div class="notice-item">{{ item }}</div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>

            <div class="content">
                <component
                    :is="component"
                    v-if="component"
                    :key="refreshKey"
                    :gameId="gameId"
                    :config="detailConfig"
                    @update:back="handlerBack"
                    @hook:mounted="onComponentMounted"
                >
                </component>

                <List
                    v-else
                    @click="handleListClick"
                    :first-game="initGameId"
                    @update:first="handleFirst"
                />
            </div>
        </div>
        <Tabbar :config="config" v-model="active" @update:click="handlerBack" />
    </div>
</template>

<script>
import { getLanguageValue } from "@/i18n";
import Header from "@/components/Header";
import Tabbar from "@/components/Tabbar";
import List from "./List/index.vue";
import Details from "./Details/index.vue";
import { LayoutConfig } from "@/constants/layout.js";

export default {
    name: "GameLayout",
    components: { Header, Tabbar, List, Details },
    props: ["initGameId"],
    data() {
        return {
            isLoading: false,
            config: {
                name: "index",
            },
            lang: getLanguageValue(),
            active: 0,
            swiperOptionText: {
                direction: "vertical",
                autoplay: { delay: 4000, disableOnInteraction: false },
                loop: true,
                allowTouchMove: false,
            },
            messages: [
                this.$t('message.marquee_1'),
                this.$t('message.marquee_2'),
                this.$t('message.marquee_3'),
            ],
            detailConfig: {},
            gameId: "",
            decoded: [],

            refreshKey: undefined,
            component: null,
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        onComponentMounted() {
            this.isLoading = false;
        },
        async initData() {
            this.$nextTick(() => {
                if (this.$refs.mySwiper?.$swiper) {
                    this.$refs.mySwiper.$swiper.loopDestroy();
                    this.$refs.mySwiper.$swiper.loopCreate();
                }
            });
        },
        handleListClick(item) {
            const gameId = item?.Id?.toLowerCase();
            let No = "";
            if (typeof item?.No === 'number') {
                No = item?.No * 1;
            } else {
                No = item?.No;
            }

            this.gameId = gameId;

            this.detailConfig = {
                nameValue: item.nameValue,
                EnterTime: Date.now(),
                EndRowIndex: 10,
                LangId: this.lang,
                LogIndexAsRoundIndex: item.LogIndexAsRoundIndex || false,
                Minutes: item.Minutes || "60",
                StartRowIndex: 1,
            };

            const changeComponent = LayoutConfig[No];

            if (!changeComponent) {
                this.refreshKey = new Date().getTime();

                this.component = Details;
                return;
            }

            this.isLoading = true;

            this.refreshKey = new Date().getTime();

            this.component = changeComponent.component;
        },
        handleFirst(val) {
            this.gameId = val?.toLowerCase();
        },
        handlerBack() {
            this.component = null;
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

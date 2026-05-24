<template>
    <view :class="[isPc ? 'main-pc' : '', isPhone ? 'main-mobile' : '']">
        <Index v-bind="layoutProps" :initGameId="initGameId" />
    </view>
</template>

<script>
import Index from "@/pages/game/index/index.vue"

export default {
    components: { Index },
    provide() {
        return {
            isPcMaxVal: () => this.isPc,
        };
    },
    data() {
        return {
            prefix: "",
            initGameId: "",
            isPhone: true,
            isPc: false
        }
    },
    computed: {
        layoutProps() {
            return {};
        },
    },
    onLoad(options) {
        this.prefix = options.prefix || ""
        this.initGameId = options.game || ""
        if (options.token) {
            uni.setStorageSync("token", options.token)
        }
        this.updateScreenInfo()
    },
    onShow() {
        this.updateScreenInfo()
    },
    mounted() {
        this.updateScreenInfo()
        if (typeof window !== "undefined") {
            window.addEventListener("resize", this.updateScreenInfo)
        }
    },
    beforeDestroy() {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", this.updateScreenInfo)
        }
    },
    methods: {
        updateScreenInfo() {
            const info = uni.getSystemInfoSync()
            this.isPhone = info.windowWidth <= info.windowHeight
            this.isPc = !this.isPhone
        }
    }
}
</script>

<style lang="scss">
.main-pc {
    height: 100%;

    .header {
        height: 60px;

        .header-left-img {
            width: 35px;
        }

        .header-right-img {
            width: 35px;
            margin-left: 0 !important;
        }

        .header-right {
            line-height: 16px;
        }

        .header-right span {
            font-size: 14px;
        }

        .header-img {
            margin-left: 30px;
        }
    }

    .content {
        width: calc(100% - 32px);
        margin: 0 auto;
    }

    .main {
        height: calc(100% - 60px);
        width: calc(100% - 110px);
        margin-left: 110px;
        margin-top: 115px;
    }

    .history-container {
        height: inherit !important;
    }

    .banner-swiper {
        border-radius: 5px;
        height: 300px !important;
        margin-bottom: 15px !important;
    }

    .swiper-button-next {
        height: 50px;
        width: 50px;
    }

    .swiper-button-prev {
        height: 50px;
        width: 50px;
    }

    .swiper-container {
        border-radius: 7px;
    }

    .van-tabbar {
        position: absolute;
        bottom: inherit;
        left: 0;
        top: 82px;
        right: inherit;
        height: calc(100% - 82px);
        width: 110px;
        border-top-right-radius: 7px;
    }

    .image-item {
        width: calc((100% - 82px) / 5) !important;
        /* 两个间距共40px */
        // min-height: 160px !important;
        margin-right: 20px !important;
        margin-bottom: 10px !important;
    }

    .image-item:nth-child(5n) {
        margin-right: 0 !important;
    }

    .single-images {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .text-main {
        width: calc(100% - 130px) !important;
        top: 82px !important;
        height: 30px !important;
        left: 120px;

        .vertical-text {
            width: calc(100% - 10px) !important;
            height: 30px !important;
            border-radius: 7px !important;
        }

        .vertical-swiper {
            height: 30px !important;
            overflow: hidden;
            position: relative;
        }
    }

    .vertical-text-content {
        height: 30px;
        line-height: 30px;
    }

    .notice-item {
        text-align: left !important;
        padding-left: 10px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .van-tabbar-item__text {
        margin-top: 10px;
    }

    .van-tabbar-item img {
        width: 45px !important;
        height: 45px;
    }

    .tabbar-font {
        font-size: 22px !important;
    }

    .footer {
        padding: 10px 0 !important;
    }

    .footer-search {
        margin: 0 10px !important;
    }

    .footer-data {
        padding: 0 10px !important;
    }

    .search-title-div {
        height: 40px !important;
        line-height: 40px !important;
        padding-left: 15px !important;

        span {
            font-size: 18px;
        }

        span:last-child {
            font-size: 18px !important;
        }
    }

    .search-input {
        height: 40px !important;
        line-height: 40px !important;
        font-size: 18px !important;
    }

    .search-input::placeholder {
        font-size: 18px !important;
    }

    .search-icon {
        height: 33px !important;
        line-height: 33px !important;
        border-radius: 7px !important;
        padding: 6px !important;
    }

    .footer-search-input {
        border-radius: 7px !important;
        margin-right: 15px !important;
    }

    .footer-data-title {
        height: 70px !important;
        line-height: 70px !important;
        font-size: 16px !important;
    }
}

.main-mobile {
    height: 100%;
}
</style>

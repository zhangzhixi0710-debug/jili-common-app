<template>
    <div class="header" :class="{ [`${config.name}-header`]: true }">
        <img class="header-img header-left-img" src="@/assets/svg/back.svg" @click="closeWebview" />

        <div class="header-title">
            <div class="header-right">
                <span>Welcome</span>
                <span>{{ nickname }}</span>
            </div>

            <img class="header-img header-right-img" src="@/assets/svg/people.svg" />
        </div>
    </div>
</template>

<script>
import { getNickname } from "@/api/game.js";

export default {
    name: "Header",
    props: {
        config: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            nickname: "",
        };
    },
    mounted() {
        this.initData();
    },
    methods: {
        initData() {
            getNickname().then(res => {
                this.nickname = res?.Data || "";
            });
        },
        closeWebview() {
            try {
                if (window.location !== window.parent.location) {
                    let uParams = new URLSearchParams(window.location.search);
                    let posthost = uParams.get("posthost");
                    window.parent.postMessage("CloseWebView", "https://" + posthost);
                    window.parent.postMessage("CloseWebView", "file:///");
                }
            } catch (i) {
                console.error("CloseWebView 錯誤：", i);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

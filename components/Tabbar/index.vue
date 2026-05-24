<template>
    <van-tabbar v-model="currentActive" class="tabbar" @change="changeTabbar" :border="false">
        <van-tabbar-item @click="handleTabClick">
            <template #icon="props">
                <img :src="tab4" :class="{ active: props.active }" />
            </template>
            <span class="tabbar-font">{{ $t("i18_Report") }}</span>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import tab1 from "@/assets/svg/tab1.svg";
import tab2 from "@/assets/svg/tab2.svg";
import tab3 from "@/assets/svg/tab3.svg";
import tab4 from "@/assets/svg/tab4.svg";

export default {
    name: "Tabbar",
    props: {
        value: {
            type: [Number, String],
            default: 0,
        },
        config: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            tab1,
            tab2,
            tab3,
            tab4,
            currentActive: this.value,
            isDirection: "",
        };
    },
    watch: {
        value(val) {
            this.currentActive = val;
        },
        "$store.getters.direction": {
            handler(newVal, oldVal) {
                this.isDirection = newVal;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        handleTabClick() {
            this.$emit("update:click");
        },
        changeTabbar(val) {
            this.$emit("input", val);
        },
    },
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>

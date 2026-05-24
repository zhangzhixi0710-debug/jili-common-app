<template>
    <div class="game-layout">
        <Details
            v-show="activeComponent === 'detail'"
            :gameId="gameId"
            :config="detailConfig"
            @update:back="switchToHome"
            @update:click="handleSingleClick"
        />
        <DetailsSingle
            v-if="activeComponent === 'detail-single'"
            :gameId="gameId"
            :singleData="singleData"
            :decoded="decoded"
            @update:back="switchToGame"
        />
    </div>
</template>

<script>
import Details from "./Details/index.vue";
import DetailsSingle from "./DetailsSingle/index.vue";

export default {
    name: "dt",
    props: {
        config: {
            type: Object,
            default: () => {},
        },
        gameId: {
            typy: String,
            default: "",
        },
    },
    components: { Details, DetailsSingle },
    data() {
        return {
            activeComponent: "detail",
            detailConfig: {},
            singleData: "",
            decoded: [],
        };
    },
    mounted() {
        this.detailConfig = JSON.parse(JSON.stringify(this.config));
    },
    methods: {
        handleSingleClick(singleData, decoded) {
            this.singleData = singleData;
            this.decoded = decoded;
            this.activeComponent = "detail-single";
        },
        switchToGame(page) {
            this.activeComponent = page || "list";
        },
        switchToHome() {
            this.$emit("update:back");
        },
    },
};
</script>

<style lang="scss" scoped>
.game-layout {
    height: 100%;
    width: 100%;
}
</style>

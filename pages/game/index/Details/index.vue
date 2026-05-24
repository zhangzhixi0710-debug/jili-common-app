<template>
    <div class="game-layout">
        <Content
            :gameId="gameId"
            :config="detailConfig"
            @update:back="switchToHome"
        />
    </div>
</template>

<script>
import Content from "./content.vue";

export default {
    name: "defaultDetail",
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
    components: { Content },
    data() {
        return {
            detailConfig: {},
            singleData: "",
            decoded: [],
        };
    },
    mounted() {
        this.detailConfig = JSON.parse(JSON.stringify(this.config));
    },
    methods: {
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

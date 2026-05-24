<template>
    <view
        class="floating-menu"
        :style="menuStyle"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
    >
        <view class="avatar-wrapper" @click="toggleMenu">
            <image src="/static/game/global/avatar.png" class="avatar" mode="aspectFill" />
        </view>

        <view
            v-for="(item, index) in menuItems"
            :key="index"
            class="icon-wrapper"
            :style="getIconStyle(index)"
        >
            <image :src="item.img" class="avatar" mode="aspectFill" />
        </view>
    </view>
</template>

<script>
import F1 from "@/assets/global/1.png";
import F2 from "@/assets/global/2.png";
import F3 from "@/assets/global/3.png";
import F4 from "@/assets/global/4.png";
import F5 from "@/assets/global/5.png";

export default {
    name: "Suspension",
    data() {
        return {
            menuOpen: false,
            dragging: false,
            startX: 0,
            startY: 0,
            position: { x: 15, y: 36 },
            menuItems: [{ img: F1 }, { img: F2 }, { img: F3 }, { img: F4 }, { img: F5 }],
        };
    },
    computed: {
        menuStyle() {
            return {
                top: this.position.y + "px",
                left: this.position.x + "px",
                width: this.menuWidth + "px",
            };
        },
        menuWidth() {
            const avatarWidth = 110;
            const iconWidth = 110;
            return this.menuOpen ? avatarWidth + this.menuItems.length * iconWidth : avatarWidth;
        },
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        getIconStyle(index) {
            return {
                opacity: this.menuOpen ? 1 : 0,
                transform: this.menuOpen
                    ? `translateX(${15 + index * 36}px) scale(1)`
                    : "translateX(0) scale(0.5)",
            };
        },
        startDrag(e) {
            const touch = e.touches && e.touches[0];
            if (!touch) return;
            this.dragging = true;
            this.startX = touch.clientX - this.position.x;
            this.startY = touch.clientY - this.position.y;
        },
        onDrag(e) {
            if (!this.dragging) return;
            const touch = e.touches && e.touches[0];
            if (!touch) return;

            const systemInfo = uni.getSystemInfoSync();
            const screenWidth = systemInfo.windowWidth;
            const screenHeight = systemInfo.windowHeight;
            const menuHeight = 110;

            const offsetX = touch.clientX - this.startX;
            const offsetY = touch.clientY - this.startY;
            const minX = 10;
            const minY = 10;
            const maxX = screenWidth - this.menuWidth - 10;
            const maxY = screenHeight - menuHeight - 10;

            this.position.x = Math.min(Math.max(offsetX, minX), maxX);
            this.position.y = Math.min(Math.max(offsetY, minY), maxY);
        },
        endDrag() {
            this.dragging = false;
        },
    },
};
</script>

<style lang="scss" scoped>
.floating-menu {
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 65px;
    position: fixed;
    z-index: 9999;
    display: flex;
    align-items: center;
    height: 110px;
    touch-action: none;
    transition: width 0.25s ease;
}

.avatar-wrapper {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar {
    width: 100%;
    height: 100%;
}

.icon-wrapper {
    margin-left: 8px;
    backdrop-filter: blur(6px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    color: white;
    font-size: 16px;
    transition: opacity 0.2s ease, transform 0.2s ease;

    image {
        width: 60px;
        height: 60px;
    }
}
</style>

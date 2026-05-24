import { rem, remPC, getDeviceType, getDirection } from '@/utils/rem.js'

export default {
    data() {
        return {
            deviceType: getDeviceType(),
            direction: getDirection()
        }
    },
    methods: {
        // 移动端rem计算
        rem(px) {
            return rem(px);
        },
        // PC端rem计算
        remPC(px) {
            return remPC(px);
        },
        // 根据设备类型自动选择rem计算
        remAuto(px) {
            return this.deviceType === 'mobile' ? this.rem(px) : this.remPC(px);
        },
        // 获取设备类型
        getDeviceType() {
            return getDeviceType();
        },
        // 检查是否为移动设备
        isMobile() {
            return this.deviceType === 'mobile';
        },
        // 检查是否为PC设备
        isPC() {
            return this.deviceType === 'pc';
        },
        // 检查是否为竖屏
        isPortrait() {
            return this.direction === 'portrait';
        },
        // 检查是否为竖屏
        isLandscape() {
            return this.direction === 'landscape';
        },
    },
    mounted() {
        this.deviceType = getDeviceType();
        this.direction = getDirection();
    }
} 

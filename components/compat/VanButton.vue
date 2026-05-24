<template>
  <button class="compat-button" @click="$emit('click', $event)">
    <text v-if="icon" class="compat-button__icon">{{ iconText }}</text>
    <slot />
  </button>
</template>

<script>
const iconMap = {
  'delete-o': 'X',
  search: 'S'
}

export default {
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconText() {
      return iconMap[this.icon] || this.icon
    }
  }
}
</script>

<style scoped>
.compat-button {
  min-width: 64rpx;
  height: 64rpx;
  padding: 0 16rpx;
  margin: 0;
  border: 0;
  border-radius: 6rpx;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.compat-button:after {
  border: 0;
}

.compat-button__icon {
  font-size: 32rpx;
  line-height: 1;
}
</style>

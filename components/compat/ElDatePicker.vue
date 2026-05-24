<template>
  <picker mode="date" :value="value" @change="onChange">
    <view class="compat-date">{{ value || placeholder }}</view>
  </picker>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.detail.value)
      this.$emit('change', event.detail.value)
    }
  }
}
</script>

<style scoped>
.compat-date {
  height: 64rpx;
  line-height: 64rpx;
  box-sizing: border-box;
  padding: 0 16rpx;
  background: #fff;
  border-radius: 6rpx;
}
</style>


<template>
  <view class="compat-list">
    <slot />
    <view v-if="finished && finishedText" class="compat-list__finished">{{ finishedText }}</view>
  </view>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: Boolean,
    finished: Boolean,
    finishedText: {
      type: String,
      default: ''
    },
    offset: {
      type: [Number, String],
      default: 0
    }
  },
  mounted() {
    if (!this.finished) {
      this.$emit('load')
    }
  }
}
</script>

<style scoped>
.compat-list__finished {
  padding: 24rpx 0;
  color: #999;
  text-align: center;
  font-size: 24rpx;
}
</style>


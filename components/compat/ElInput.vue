<template>
  <input class="compat-input" :value="value" :placeholder="placeholder" @input="onInput" />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.detail.value)
    }
  }
}
</script>

<style scoped>
.compat-input {
  width: 100%;
  height: 64rpx;
  box-sizing: border-box;
  padding: 0 16rpx;
  background: #fff;
  border-radius: 6rpx;
}
</style>


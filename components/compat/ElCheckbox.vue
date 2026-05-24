<template>
  <label class="compat-checkbox">
    <checkbox :checked="value" @click="toggle" />
    <slot />
  </label>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style scoped>
.compat-checkbox {
  display: flex;
  align-items: center;
}
</style>


<template>
  <router-view></router-view>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  localStorage: {
    synchronized: {
      type: Number,
      default: 0
    }
  }
}
</script>

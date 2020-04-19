<template>
  <div class="page">
    <el-button type="info" @click="signOut">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    components: {

    },
    methods: {
      signOut() {
        // 清除浏览器缓存
        window.sessionStorage.clear()
        this.$router.replace('/login')
      }
    },
  }
</script>

<style lang= 'less' scoped>

</style>

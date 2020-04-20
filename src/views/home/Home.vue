<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="~assets/img/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="signOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    signOut() {
      // 清除浏览器缓存
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    async getMenuList() {
      const { data: res} = await this.$http.get('menus')
      if(res.meta.status !==200) return this.$message.error('res.meta.message')
      console.log(res);
      
    }
  },
  created() {
    this.getMenuList() 
  },
}
</script>

<style lang= 'less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>

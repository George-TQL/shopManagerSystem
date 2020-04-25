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
      <el-aside :width="isToggle ? '64px' : '200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#3d8adc"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" 
                      v-for="item in menuList" 
                      :key="item.id">
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" 
                          v-for="subItem in item.children" 
                          :key="subItem.id"
                          @click="keepActivePath('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      isToggle: false,
      activePath: ''
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
      // console.log(res.data);
      this.menuList = res.data
    },
    toggle() {
      this.isToggle = !this.isToggle
    },
    keepActivePath(path) {
      window.sessionStorage.setItem('path', path)
      this.activePath = path
    }
  },
  created() {
    this.getMenuList() 
    this.activePath = window.sessionStorage.getItem('path')
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
  .el-menu {
    border-right: none;
  }
  .toggle-button {
    background-color: #4a5064;
    font-size: 12px;
    text-align: center;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 6px;
}
</style>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="~assets/img/logo.png" alt="" />
      </div>
      <el-form ref="form" label-width="0px" class="login-form" :model="loginForm" :rules="loginFormRule">
        <!-- 用戶名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prob="password">
          <el-input :show-password=true prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from 'network/login'
export default {
  name: "Login",
  components: {},
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      loginFormRule: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(valid => {
        if(!valid) return;
        getLoginData(this.loginForm).then(res => {
          const data = res.data
          // console.log(data);
          
          if(data.meta.status !== 200) {return this.$message.error('登录失败');}
          this.$message.success('登录成功')
          // console.log('------');
          
          window.sessionStorage.setItem("token", data.data.token)
          this.$router.push('/home')
        })
        
        // console.log(getLoginData());
        
      })
    }
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;

  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login-form {
    position: relative;
    bottom: 20px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>

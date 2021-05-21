<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>欢迎登陆</h3>
      </div>
      <el-form
        status-icon
        size="small"
        :model="loginFormObj"
        :rules="rules"
        ref="loginForm"
        @submit.native.prevent
      >
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="loginFormObj.username"
            placeholder="用户名"
            @keyup.enter.native="submitForm"
          >
            <template slot="prepend">
              <i class="el-icon-user-solid"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginFormObj.password"
            @keyup.enter.native="submitForm"
            placeholder="密码"
          >
            <template slot="prepend">
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 100%"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loginFormObj: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate().then(() => {
        this.$apis.login(this.loginFormObj);
      }).catch(err => { });
    },

    // submitForm() {
    //   this.$refs.loginForm.validate().then((res) => {
    //     axios
    //       .post("http://localhost:8889/api/private/v1/login", this.loginFormObj)
    //       .then((res) => {
    //         console.log(res);
    //         if ((res.status >= 200 && res.status < 300) || res.status === 304) {
    //           if (res.data.meta.status === 200) {
    //             this.$router.push({
    //               name: "Home",
    //             });
    //             this.$message({
    //               type: "success",
    //               message: res.data.meta.msg,
    //             });
    //           } else {
    //             this.$message({
    //               type: "error",
    //               message: res.data.meta.msg,
    //             });
    //           }
    //         } else {
    //           this.$message({
    //             type: "error",
    //             message: res.statusText,
    //           });
    //         }
    //       })
    //       .catch((error) => {
    //         this.$message({
    //           type: "error",
    //           message: error,
    //         });
    //       });
    //   });
    // },

    // async submitForm() {
    //   if (
    //     this.loginFormObj.username != "" &&
    //     this.loginFormObj.password != ""
    //   ) {
    //     let res = await $.ajax({
    //       url: "http://localhost:8889/api/private/v1/login",
    //       data: {
    //         username: this.loginFormObj.username,
    //         password: this.loginFormObj.password,
    //       },
    //     });
    //     if (res.meta.status === 200) {
    //       this.$message({
    //         type: "success",
    //         message: res.meta.msg,
    //       });
    //       this.$router.push({ name: "Home" });
    //     } else {
    //       this.$message({
    //         type: "error",
    //         message: res.meta.msg,
    //       });
    //     }
    //   }
    // },

    //   submitForm() {
    //     this.$refs.loginForm.validate().then(() => {
    //       fetch("http://localhost:8889/api/private/v1/login", {
    //         method: "POST",
    //         headers: {
    //           "user-agent": "Mozilla/4.0 MDN Example",
    //           "content-type": "application/json",
    //         },
    //         body: JSON.stringify(this.loginFormObj),
    //       })
    //         .then((res) => res.json())
    //         .then((res) => {
    //           if (res.meta.status == 200) {
    //             console.log(res);
    //             this.$message({
    //               type: "success",
    //               message: res.meta.msg,
    //             });
    //             this.$router.push({ name: "Home" });
    //           } else {
    //             this.$message({
    //               type: "warning",
    //               message: res.meta.msg,
    //             });
    //           }
    //         });
    //     });
    //   },
  },
};
</script>

<style scoped lang="scss">
.login {
  width: 100vw;
  height: 100vh;
  background: url(https://file.iviewui.com/admin-dist/img/login-bg.0899ffa6.jpg);
  background-size: cover;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .box-card {
    width: 300px;
    margin-right: 200px;
  }
}
</style>

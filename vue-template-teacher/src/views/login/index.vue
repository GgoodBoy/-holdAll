<template>
    <div class="login-container">
        <el-form ref="loginForm"
                 :model="loginForm"
                 :rules="loginRules"
                 class="login-form"
                 auto-complete="on"
                 label-position="left">
            <h3 class="title">学国学网发课端</h3>
            <el-form-item prop="username">
                <span class="svg-container svg-container_login">
                    <svg-icon icon-class="user" />
                </span>
                <el-input v-model.trim="loginForm.username"
                          name="username"
                          type="text"
                          auto-complete="on"
                          placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" />
                </span>
                <el-input :type="pwdType"
                          v-model.trim="loginForm.password"
                          name="password"
                          auto-complete="on"
                          placeholder="请输入密码"
                          @keyup.enter.native="handleLogin" />
                <span class="show-pwd"
                      @click="showPwd">
                    <svg-icon icon-class="eye"
                              v-if="pwdType === 'password'" />
                    <svg-icon icon-class="eye-open"
                              v-else />
                </span>
            </el-form-item>
            <el-form-item>
                <el-button type="danger"
                           :loading="loading"
                           style="width:100%;"
                           @click.native.prevent="handleLogin"
                           class="red-btn">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";
import { dynamicRoutes , staticRoutes} from '@/router/routes'
import { getUserRoutes} from '@/utils/auth'
import {mapActions} from 'vuex'
export default {
    name: "Login",
    data() {
        const validateUsername = (rule, value, callback) => {
            if (value.length < 3 || value.length > 20) {
                callback(new Error("请输入正确的用户名"));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value.length < 3) {
                callback(new Error("密码不能小于3位"));
            } else {
                callback();
            }
        };
        return {
            loginForm: {
                username: "",
                password: ""
            },
            loginRules: {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "长度在 3 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    },
                    {
                        min: 5,
                        max: 16,
                        message: "长度在 5 到 16 个字符",
                        trigger: "blur"
                    }
                ]
            },
            loading: false,
            pwdType: "password",
            redirect: undefined
        };
    },
    metaInfo: {
        title: "登录"
    },
    watch: {
        $route: {
            handler: function(route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    created(){
        if(document.cookie.includes('xgx-user-tk')){
            this.$message.error('请退出后再登录！')
            this.$router.go(-1)
        }else{
            this.$router.options.routes = staticRoutes;
        }
    },
    methods: {
        ...mapActions(['setAddRouteFlag']),
        showPwd() {
            if (this.loginForm.password.length == 0) {
                return;
            }
            if (this.pwdType === "password") {
                this.pwdType = "";
            } else {
                this.pwdType = "password";
            }
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    this.$store
                        .dispatch("Login", this.loginForm)
                        .then((res) => {
                            this.loading = false;
                            let authArr = JSON.parse(localStorage.getItem('permissions'))
                            let routes = getUserRoutes(authArr,dynamicRoutes,[]);
                            let allRoutes = [...this.$router.options.routes,...routes]
                            this.$router.options.routes = allRoutes;
                            this.$router.addRoutes(routes)
                            this.$router.addRoutes([{ path: '*', redirect: '/404', hidden: true ,meta:{}}])
                            this.setAddRouteFlag(true)
                            this.$router.push({path: "/"});
                        })
                        .catch((error) => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #fff;
            height: 47px;
            &:-webkit-autofill {
                -webkit-text-fill-color: #ededed !important;
                -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                background-color: transparent;
                background-image: none;
                transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background:url("../../assets/images/login-bg.jpg") no-repeat;
    background-size: 100% 100%;
    .login-form {
        position: absolute;
        left: 0;
        right: 0;
        width: 520px;
        max-width: 100%;
        padding: 35px 35px 15px 35px;
        margin: 120px auto;
    }
    .svg-container {
        padding: 0 5px 0 15px;
        line-height: 20px;
        color: #9e0e00;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    .title {
        font-size: 26px;
        font-weight: 400;
        color: #fff;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 16px;
        color: #9e0e00;
        cursor: pointer;
        user-select: none;
    }
}
</style>

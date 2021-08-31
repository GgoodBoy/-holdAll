<template>
    <el-menu class="navbar"
             mode="horizontal">
        <hamburger :toggle-click="toggleSideBar"
                   :is-active="sidebar.opened"
                   class="hamburger-container" />
        <div class="ipentNum">
            <el-row>
                <el-col :span="6"><img class="img-user-avatar" :src="'./static/images/80.png'"/></el-col>
                <el-col :span="17" :offset="1">{{nameShow}}</el-col>
            </el-row>
        </div>

        <el-dropdown class="avatar-container"
                     @command="handleCommand">
            <div class="avatar-wrapper">
                <!-- <img :src="'./static/images/test.gif'"
                     class="user-avatar"> -->
                <i class="icon-topicon user-avatar"></i>
                <i class="el-icon-caret-bottom" /> 
                <!-- icon-topicon -->
            </div>
            <el-dropdown-menu slot="dropdown"
                              class="user-dropdown">
                <!-- <router-link class="inlineBlock"
                             to="/">
         
                </router-link> -->
                <!-- <el-dropdown-item divided>
                    <span style="display:block;"
                          @click="logout">退出</span>
                </el-dropdown-item> -->
                <el-dropdown-item command="delete">退出</el-dropdown-item>                
            </el-dropdown-menu>
        </el-dropdown>
    </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Hamburger from "@/components/Hamburger";
import { getToken } from "@/utils/auth";
import {mapActions} from 'vuex'
export default {
    data(){
        return {
            nameShow:''
        }
    },
    created(){
         this.nameShow= window.localStorage.getItem('permissionName').replace("\"","").replace("\"","");
    },
    components: {
        Hamburger
    },
    computed: {
        ...mapGetters(["sidebar", "avatar"])
    },
    methods: {
        ...mapActions(['setAddRouteFlag']),
        //handleCommand
        handleCommand(command){
            this.$confirm("确定要退出当前系统？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass:"common-confirm-layout",
                type: "warning"
            })
                .then(() => {
                    if (getToken()) {
                        this.$store.dispatch("LogOut").then(() => {
                            localStorage.removeItem('permissions')
                            this.setAddRouteFlag(false)
                            window.location.hash = "login";
                            window.location.reload()
                        });
                    } else {
                        this.$store.dispatch("FedLogOut").then(() => {
                            localStorage.removeItem('permissions')
                            this.setAddRouteFlag(false)
                            window.location.hash = "/login";
                            window.location.reload()
                        });
                    }
                })
                .catch(() => {});
        },
        toggleSideBar() {
            this.$store.dispatch("ToggleSideBar");
        },
        logout() {
            this.$confirm("确定要退出当前系统？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass:"common-confirm-layout",
                type: "warning"
            })
                .then(() => {
                    if (getToken()) {
                        this.$store.dispatch("LogOut").then(() => {
                            window.location.hash = "login";
                            window.location.reload()
                        });
                    } else {
                        this.$store.dispatch("FedLogOut").then(() => {
                            window.location.hash = "/login";
                            window.location.reload()
                        });
                    }
                })
                .catch(() => {});
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 80px;
    line-height: 80px;
    border-radius: 0px !important;
    .hamburger-container {
        line-height: 80px;
        height: 80px;
        float: left;
        padding: 0 10px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }
    .ipentNum{
        position: absolute;
        right: 60px;
        width: 150px;
        .img-user-avatar{
            width: 40px;
            height: 40px;
            border-radius: 10px;      
            margin-top: 20px;      
        }
    }
    .avatar-container {
        height: 50px;
        display: inline-block;
        position: absolute;
        right: 35px;
        .avatar-wrapper {
            cursor: pointer;
            margin-top: 5px;
            position: relative;
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                font-size: 25px;
            }
            .el-icon-caret-bottom {
                position: absolute;
                right: -20px;
                top: 25px;
                font-size: 12px;
            }
        }
    }
}
</style>


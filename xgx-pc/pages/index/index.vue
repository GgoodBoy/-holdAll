<template>
    <div class="index-page">
        <div class="wrap">
            <p>请选择你关注的国学内容</p>
            <div class="img-box">
                <img :src="version1"/>
                <button @click="chooseVerison(4)">少儿国学</button>
            </div>
            <div class="line">
                <p>OR</p>
            </div>
            <div class="img-box">
                <img :src="version2"/>
                <button @click="chooseVerison(3)">成人国学</button>
            </div>
        </div>
    </div>
</template>
<script>
import {Component,Vue} from 'vue-property-decorator'
const version1 = require('@/assets/images/version1.png')
const version2 = require('@/assets/images/version2.png')
@Component({})
export default class Index extends Vue{
    version1 = version1
    version2 = version2
    chooseVerison(type){
        this.$setCookie('versionType',type)
        this.$router.push('/home')
    }
}
</script>
<style lang="scss" scoped>
    .index-page{
        padding-top:180px;
        margin-top:-100px;
        text-align: center;
        min-height:calc(100vh - 200px)!important;
        background: rgba(0,0,0,.75);
        .wrap{
            background: #fff;
            display: inline-block;
            padding: 25px 20px 0px 20px;
            border-radius: 10px;
        }
        p{
            color:#3A3A3A;
            font-size: 30px;
            font-weight: bold;
            margin-bottom: 50px;
        }
        .line{
            display: inline-block;
            vertical-align: middle;
            width: 1px;
            height: 280px;
            background: #EEEEEE;
            position: relative;
            margin:0 20px;
            p{
                position: absolute;
                height: 100px;
                top:80px;
                background: #fff;
                z-index: 2;
                left: -15px;
                color:#BEBEBE;
                font-size: 19px;
                width: 30px;
                line-height: 100px;
            }
        }
        .img-box{
            display: inline-block;
            vertical-align: middle;
            width: 300px;
            img{
                width: 220px;
                height:220px;
            }
            button{
                display: block;
                margin:35px auto;
                background: #C52D3B;
                border:none;
                outline: none;
                line-height: 48px;
                height: 48px;
                width: 133px;
                font-size: 19px;
                color:#fff;
                border-radius: 25px;
                cursor: pointer;
                &:hover{
                    background: #d73947;
                }

            }
        }
    }
</style>

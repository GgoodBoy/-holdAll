<template>
    <div class="footer" :class="{'childBgd':(!isWhite&&stateNum===false)}">
        <div class="footer-content">
            <img :src="logo" class="logo" alt="学国学网"/>
            <ul class="desktop-links">
                <li v-for="(item,index) in menu" :key="index" @click="footerLink(item)">
                    {{item.text}}
                </li>
            </ul>
            <div class="contact">
                <p>热线电话：010-62198619</p>
                <p>邮箱留言：service@xueguoxue.com</p>
                <p>热线服务时间：9:00-20:00</p>
            </div>
            <div class="copyright">
                <p>Copyright ©2017 xueguoxue.com</p>
                <p class="p1" @click="goOther(1)">版权所有 京ICP备15067244号-2</p>
                <p class="p1" @click="goOther(2)">京公网安备 11010802029579<span></span></p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator';
import {delCookie,getCookie} from '../utils/cache.js'
declare function require(string): string;
const Logo = require('../assets/images/logo_footer.png');
import {mapState,mapActions} from 'vuex'
const WhiteFooterPage : string[ ] = ['index-auth'];
@Component({
    computed:{
        ...mapState(['switchEdition'])
    },   
    methods:{
        ...mapActions(['setSwitchBoolCommit'])
    },    
    async asyncData({app,params,req}:NuxtContext):Promise<any>{}    
})
export default class Footer extends Vue{
    logo:any = Logo;
    isWhite = false;
    stateNum='';
    menu:Object[] = [ // //1，公司简介 2，大事记 3，合作平台 4，联系我们 5，关于隐私 6，责任免声明
      {path:'/aboutUs',text:'公司介绍',selectId:1},
      {path:'/aboutUs/contactUs',text:'联系我们',selectId:4},
      {path:'/aboutUs/onPrivacy',text:'关于隐私',selectId:5},
      {path:'/aboutUs/joinUs',text:'加入我们',selectId:7},
      {path:'/aboutUs/disclaimer',text:'免责声明',selectId:6},
    ]  
    @Watch('$route')
    onRouteChanged(val,old){
        let name = val.name || ''
        let isWhite = WhiteFooterPage.find(item=>name.includes(item))
        this.isWhite = isWhite?true:false
    }   
    @Watch('switchEdition')
    onswitchEditionChanged(val,oldval){
        this.stateNum = val;
    }      
    created(){
        let name = this.$route.name || ''
        let isWhite = WhiteFooterPage.find(item=>name.includes(item))
        this.isWhite = isWhite?true:false;
        if(process.client){
            let isWhite = WhiteFooterPage.find(item=>name.includes(item))
            this.isWhite = isWhite?true:false;
        }
    }
    footerLink(item){
        // this.$router.push({name:item.name,query:{selectId:item.selectId}})
        this.$router.push({path:item.path, query:{selectId:item.selectId}})
    };
    mounted(){
            let type = this.$getCookie('versionType');
            this.stateNum = type==4?false:true;
            this.setSwitchBoolCommit(this.stateNum);
    }
    goOther(type){
        if(type==1){
            window.open('https://beian.miit.gov.cn')
        }else{
            window.open('https://beian.miit.gov.cn')
        }
    }
}
</script>
<style lang="scss" scoped>
    .footer{
        height: 220px;
        background:#fff;
        text-align: center;
        position: relative;
        z-index: 2;
        padding: 70px 0;
        // box-shadow: 0 0 5px #dfdfdf;
        .footer-content{
            display: inline-block;
            font-size: 0;
            width: 1200px;
            text-align: left;
            .logo{
                width:102px;
                height: 79px;
                display: inline-block;
                margin-right: 78px;
            }
            .desktop-links{
                display: inline-block;
                vertical-align: top;
                width: 282px;
                li{
                    display: inline-block;
                    cursor: pointer;
                    margin:0 30px 14px 0;
                    color:#999;
                    &:hover{
                        text-decoration:underline;
                    }
                    a{
                        font-size: 16px;
                        color:#999;
                    }
                }
            }
            .contact{
                display: inline-block;
                vertical-align: top;
                margin:0 200px 0 70px;
                p{
                    color:#999!important;
                    font-size: 14px!important;
                    margin-bottom:15px;
                }
            }
            .copyright{
                color:#999;
                display: inline-block;
                vertical-align: top;
                p{
                    color:#999;
                    font-size: 14px;
                    margin-bottom:15px;
                }
                span{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: url('../assets/images/beian.png')no-repeat 50% 50% / cover;
                    vertical-align: bottom;
                    margin-left: 5px;
                }
                .p1:hover{
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
        &.childBgd{
            background: url('../assets/images/footer_bgd.png')no-repeat 50% 50% / cover;
        }
    }
</style>
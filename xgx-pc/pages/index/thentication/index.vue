<template>
    <div class="authen-page">
        <div class="top">
            <div class="box">
                <div class="text">
                    <p>入驻学国学网</p>
                    <p>传递国学精髓，弘扬传统文化</p>
                    <p>申请加入学国学网，共同缔造文化盛典</p>
                </div>
                <div class="btn" @click="goPage">免费入驻</div>
            </div>
        </div>
        <div class="content">
            <p class="title">平台特色</p>
            <div class="icon-list">
                <div class="item" v-for="(item,index) in list" :key="index">
                    <i></i>
                    <p v-for="option in item.text" :key="option">{{option}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import {mapState} from 'vuex';

@Component({
    name:'authenticationIndex',
    computed:{
        ...mapState(['userData'])
    }      
})
export default class Personal extends Vue{
    list = [
        {
            text:['超过千位幼稚文化领域','创作者提供原创知识'],
        },
        {
            text:['具有良好','国学氛围的社区'],
        },
        {
            text:['完善的','辅助学习体系'],
        },
        {
            text:['无缝衔接大屏、小屏','安全高效的云端存储'],
        },
        {
            text:['伴随式','用户成长体系'],
        },
        {
            text:['传统文化','爱好者聚集地'],
        },
        {
            text:['严谨的','传统文化领域创作队伍'],
        },
        {
            text:['最优质资源','免费共享'],
        },
        {
            text:['产品传播影响面','超千万级'],
        },
        {
            text:['课程梯度划分严谨','适合各阶段的爱好者'],
        },
    ]
    timer:any= null
    mounted(){
        window.addEventListener('message', (e) => {
            if (e.data === 'getMsg') {
                clearInterval(this.timer);
                console.log('我被清除了')
                this.$router.replace('/thentication')
            }
        });
    }
    /**
     * 去关联手机号
     */
    goBindPhone(){
        let url = this.$route.fullPath
        sessionStorage.setItem('redirectUrl',url)
        this.$router.push({
            path:'/auth/bindPhone'
        })
    }
    async goPage(){
        if(this.userData.userId){
            if(this.userData.cellphone){
                let query = {
                    userId:this.userData.userId
                }
                let res = await this.$axios.$post(this.$server.getVerifityMechanism,query)
                if(res.status==200){
                    if(res.content.id){
                        if(res.content.isExistence==1){
                            if(res.content.status==1){
                                let win:any = window.open('https://scugc.youfushuyuan.com/platform/waiting');
                                let query = JSON.stringify({userId:this.userData.userId})
                                this.timer = setInterval(() => {
                                    win.postMessage(query, 'https://scugc.youfushuyuan.com/platform/waiting');
                                    console.log('我在发消息')
                                }, 2000);
                            }else{
                                this.$message.error('当前机构账号已被禁用，请联系客服解封账号')
                            }
                        }else{
                            if(res.content.type==1){
                                this.$router.push('/thentication/thenList/companyIndex')
                            }else{
                                this.$router.push('/thentication/thenList/userIndex')
                            }
                        }
                    }else{
                        this.$router.push('/thentication/thenList')
                    }
                }       
            }else{
                this.goBindPhone()
            }
        }else{
            sessionStorage.setItem('redirectUrl','/thentication');
            setTimeout(()=>{
                this.$router.push('/auth/smsLogin')
            },0)
        }
    }
}
</script>
<style lang="scss" scoped>
    .authen-page{
        background: #fff;
        border-bottom: 1px solid #e5e5e5;
        .top{
            width: 100%;
            height:200px;
            background: url('../../../assets/images/thentication/thenticationBgd.png')no-repeat 50% 50% / cover;
            .box{
                width: 1200px;
                margin:0 auto;
                padding: 40px 0;
                overflow: hidden;
                .text{
                    float: left;
                    p{
                        font-size: 40px;
                        color:#333;
                        line-height: 56px;
                        height: 56px;
                        font-weight: 500;
                    }
                    p+p{
                        font-size: 18px;
                        color:#666;
                        line-height: 25px;
                        height: 25px;
                        margin:6px 0;
                    }
                    p+p+p{
                        font-size: 18px;
                        color:#666;
                        line-height: 25px;
                        height: 25px;
                    }
                }
                .btn{
                    float: right;
                    width: 162px;
                    height: 54px;
                    background: linear-gradient(90deg, #E54352 0%, #C30D23 100%);
                    border-radius: 42px;
                    text-align: center;
                    cursor: pointer;
                    line-height: 54px;
                    color:#fff;
                    font-size: 20px;
                    margin:60px 50px 0 0;
                    &:hover{
                        background:#C30D23 ;
                    }
                }
            }
        }
        .content{
            width: 1200px;
            margin:50px auto 0;
            .title{
                padding-bottom:8px;
                font-size: 38px;
                font-weight: 500;
                line-height: 53px;
                border-bottom:8px solid #C30D23;
                position: relative;
                display: inline-block;
                &::after{
                    content:'';
                    display: block;
                    position: absolute;
                    left: 0;
                    bottom:-8px;
                    width: 1200px;
                    height: 1px;
                    background:#d8d8d8 ;
                }
            }
            .icon-list{
                font-size: 0;
                width: 1200px;
                overflow: hidden;
                padding: 50px 0 10px 0;
                .item{
                    width: 200px;
                    height: 150px;
                    border-radius: 6px;
                    border:1px solid #e5e5e5;
                    text-align: center;
                    margin-right: 50px;
                    margin-bottom:40px;
                    float: left;
                    transition: all 0.3s;
                    cursor: default;
                    &:hover{
                        transform: translateY(-1px);
                        box-shadow: 0 0 10px #dfdfdf;
                    }
                    &:nth-child(5n){
                        margin-right: 0;
                    }
                    &:nth-child(1){
                        i{
                            background: url('../../../assets/images/thentication/thentication1.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(2){
                        i{
                            background: url('../../../assets/images/thentication/thentication2.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(3){
                        i{
                            background: url('../../../assets/images/thentication/thentication3.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(4){
                        i{
                            background: url('../../../assets/images/thentication/thentication4.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(5){
                        i{
                            background: url('../../../assets/images/thentication/thentication5.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(6){
                        i{
                            background: url('../../../assets/images/thentication/thentication6.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(7){
                        i{
                            background: url('../../../assets/images/thentication/thentication7.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(8){
                        i{
                            background: url('../../../assets/images/thentication/thentication8.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(9){
                        i{
                            background: url('../../../assets/images/thentication/thentication9.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    &:nth-child(10){
                        i{
                            background: url('../../../assets/images/thentication/thentication10.png')no-repeat 50% 50% / cover;
                        }                        
                    }
                    i{
                        display: inline-block;
                        width: 72px;
                        height: 72px;
                        margin-top:10px;
                    }
                    p{
                        line-height: 22px;
                        font-size: 16px;
                        color:#333;
                        height: 22px;
                    }
                }
            }
        }
    }
</style>

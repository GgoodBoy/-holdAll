<template>
    <div class="selects-page" v-loading="loading">
        <div class="box">
            <p>请选择你的认证方式</p>
            <div class="container">
                <div class="box1">
                    <i></i>
                    <div class="btn" @click="selectAuthen(1)">机构认证</div>
                </div>
                <div class="box2">
                    <i></i>
                    <div class="btn" @click="selectAuthen(2)">个人认证</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex';
import { constants } from 'fs';
@Component({
  name:'authenIndex',
  computed:{
    ...mapState(['userData'])
    }   
})
export default class Personal extends Vue{
    loading = true
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
    created(){
        this.goPage()
    }
    selectAuthen(type:number){
        if(type==1){
            this.$router.push({path:'/thentication/thenList/companyIndex'})
        }else{
            this.$router.push({path:'/thentication/thenList/userIndex'})
        }
    }
    async goPage(){
        if(this.userData.userId){
            if(this.userData.cellphone){
                let query = {
                    userId:this.userData.userId
                }
                let res = await this.$axios.$post(this.$server.getVerifityMechanism,query)
                if(res.status==200){
                    this.loading = false;
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
                                this.$router.push('/thentication')
                            }
                        }
                    }
                }       
            }else{
                this.goBindPhone()
            }
        }else{
            sessionStorage.setItem('redirectUrl','/thentication/thenList');
            setTimeout(()=>{
                this.$router.push('/auth/smsLogin')
            },0)
        }
    }
    /**
     * 去关联手机号
     */
    goBindPhone(){
        let url = this.$route.fullPath
        sessionStorage.setItem('redirectUrl','/thentication/thenList')
        this.$router.push({
            path:'/auth/bindPhone'
        })
    }
}
</script>
<style lang="scss" scoped>
    .selects-page{
        background: #3D3D3D;
        position: relative;
        .box{
            position: absolute;
            top:50%;
            left: 50%;
            transform:translate(-50%,-50%);
            width: 690px;
            height: 460px;
            border-radius: 6px;
            background: #fff;
            padding:42px;
            p{
                font-size: 32px;
                line-height: 45px;
                height: 45px;
                color:#333;
                text-align: center;
                margin-bottom: 60px;
            }
            .container{
                width: 100%;
                display: flex;
                justify-content:space-around;
                align-items: center;
                position: relative;
                &::after{
                    content:'';
                    position: absolute;
                    top:0;
                    left: 49.5%;
                    width: 1px;
                    height: 100%;
                    background: #e5e5e5;
                }
                .btn{
                    width: 136px;
                    height: 49px;
                    line-height: 49px;
                    text-align: center;
                    color:#fff;
                    font-size: 20px;
                    background: linear-gradient(90deg, #E54352 0%, #C30D23 100%);
                    border-radius: 25px;
                    cursor: pointer;
                    display: inline-block;
                    &:hover{
                        background:#C30D23 ;
                    }
                }
                .box1{
                    width: 150px;
                    text-align: center;
                    i{
                        display: block;
                        width: 150px;
                        height: 150px;
                        background: url('../../../../assets/images/thentication/thentication_jigou.png')no-repeat 50% 50% / cover;
                        margin-bottom:47px;
                    }            
                }
                .box2{
                    width: 150px;
                     text-align: center;
                    i{
                        display: block;
                        width: 150px;
                        height: 150px;
                        background: url('../../../../assets/images/thentication/thentication_geren.png')no-repeat 50% 50% / cover;
                        margin-bottom:47px;
                    }           
                }
                
            }
        }
    }
</style>

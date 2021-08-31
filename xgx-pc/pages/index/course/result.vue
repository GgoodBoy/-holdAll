<template>
    <div class="pay-result-page">
        <div class="content" :style="{'min-height':minHeight+'px'}">
            <div class="success" v-if="successFlag">
                <p class="tips">下单成功</p>
                <p class="info" v-for="(item,index) in successInfo" :key="index">
                    <span class="label">{{item.label}}</span>
                    <span>:</span>
                    <span class="value">{{item.value}}</span>
                </p>
                <div class="btns">
                    <el-button type="primary" class="to-learn" @click="toLearn">立刻开始学习</el-button>
                    <button class="to-buy" @click="toBuy">继续购买课程</button>
                </div>
            </div>
            <div class="fail" v-else>
                <p class="tips">支付失败</p>
                <p class="error-text">{{errorText}}</p>
                <p class="fail-btn" @click="toBuy">查看其他课程</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator'
import { setTimeout } from 'timers';
import {mapState,mapActions} from 'vuex'
@Component({
    computed:{
        ...mapState(['orderData'])
    },
    methods:{
        ...mapActions(['setOrderData'])
    },
    beforeRouteLeave(to,from,next){
        this.setOrderData({})
        next()
    }
})
export default class Result extends Vue{
    successInfo = []
    successFlag = false
    errorText = ''
    minHeight = 400
    // @Watch("orderData")
    // onOrderDataChanged(val,old){
    //      if(val.successFlag){
    //         this.successFlag = true;
    //         this.successInfo = val.info;
    //     }else{
    //         this.successFlag = false;
    //         this.errorText = val.errorText;
    //     }
    // }
    created(){
        if(this.$route.query&&this.$route.query.id){
            
        }
        if(this.orderData){
            if(this.orderData.successFlag){
                this.successFlag = true;
                this.successInfo = this.orderData.info;
            }else{
                this.successFlag = false;
                this.errorText = this.orderData.errorText;
            }
        }
    }
    mounted(){
        setTimeout(()=>{
            this.minHeight = window.screen.availHeight-287-53-18-20
        },1)
    }
    toLearn(){
        let url = `/course/details?id=${this.$route.query.id}`
        this.$router.replace(url)
    }
    toBuy(){
        document.querySelector(".course-menu").click()
    }
}
</script>
<style lang="scss" scoped>
    .pay-result-page{
        min-height: 500px;
        text-align: center;
        background: #F3F5F7;
        padding: 20px 0 0 0;
        .content{
            width: 1200px;
            margin:0 auto;
            background: #fff;
            .success{
                .tips{
                    color:#CC0033;
                    font-size: 28px;
                    margin:90px 0 0 0;
                    display: inline-block;
                    font-weight: bold;
                }
                .info{
                    margin:17px auto;
                    font-size: 0;
                    span{
                        color:#999999;
                        font-size: 16px;
                        display: inline-block;
                        vertical-align: middle;
                        width: 2%;
                        text-align: center;
                        &.label{
                            text-align: right;
                            width: 49%;
                        }
                        &.value{
                            width: 49%;
                            text-align: left;
                        }
                    }
                }
                .btns{
                    display: inline-block;
                    margin-top:20px;
                    button{
                        font-size: 16px;
                        width: 158px;
                    }
                    .to-learn{
                        display: block;
                    }
                    .to-buy{
                        display: block;
                        margin:5px auto;
                        line-height: 40px;
                        height: 40px;
                        border:none;
                        outline: none;
                        text-decoration: underline;
                        text-align: center;
                        color:#333333;
                        background: none;
                        cursor: pointer;
                        &:hover{
                            opacity: 0.85;
                        }
                    }
                }
            }
            .fail{
                .tips{
                    color:#CC0033;
                    font-size: 28px;
                    margin:90px 0 0 0;
                    display: inline-block;
                    font-weight: bold;
                }
                .error-text{
                    color:#999999;
                    font-size: 16px;
                    margin:32px auto;
                }
                .fail-btn{
                    font-size:18px;
                    color:#333333;
                    text-decoration: underline;
                    margin:0 auto;
                    cursor: pointer;
                    &:hover{
                        opacity: 0.85;
                    }
                }
            }
        }
    }
</style>


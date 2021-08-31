<template>
    <div class="personalBox">
        <div class="inputDivCss">
            <div class="inputCss">
                <el-input
                    type="textarea"
                    :rows="10"
                    placeholder="请输入内容"
                    show-word-limit
                    maxlength="200"
                    v-model="textarea">
                </el-input>
                <!-- <div class="warryText">
                    <i class="el-icon-error"></i>
                    <span>意见反馈限200字以内</span>
                </div> -->
                <p  class="inputP">感谢愿意支持学国学网的用户，对于大家提出的意见和建议，我们始终保持重视。学国学网会在大家的监督和提醒下，不断进步。</p>
                <div class="butCss" @click="submitBack">提交反馈</div>
            </div>
        </div>
        <el-dialog 
        title=" " 
        :visible.sync="outerVisible"
        width="304px" 
        height="290px">
            <div class="imgbox">
                <img :src="img1"/>
            </div>
            <p>反馈成功</p>
        </el-dialog>        
    </div>    
</template>
<script lang="ts">
// personal_isko.png
import { Component , Vue ,Watch} from 'vue-property-decorator'
import { NuxtContext } from 'nuxt'
import {mapState,mapActions} from 'vuex';
import {delCookie,getCookie} from '../../../../utils/cache.js'
import { setTimeout } from 'timers';
import ajaxs from '~/api/index.js';
const Logo1 = require('@/assets/images/personal_isko.png');
@Component({
    components:{},  
    methods:{
         ...mapActions(['selectMyStartEven'])
    },
    async asyncData({app,query}:NuxtContext):Promise<any>{}        
})
export default class Feedback extends Vue{
    // 1:充值成功，2:购课成功，3:课程更新，4:小喇叭（站内信）
    tableListSet:object[]=[]; 
    modelType:number=0;
    textarea:string='';
    img1:any = Logo1;
    outerVisible:boolean = false;  
    head(){
        return {
            title:'意见反馈 | 学国学网'
        }
    }  
    created(){
            var numbers = this.$route.query.selectId;
            this.selectMyStartEven(Number(numbers));
    }; 
    async submitBack(){
        let user =  getCookie('xgx_user')?JSON.parse( getCookie('xgx_user')):null;
        console.log('user',user);
        let querys = {
            type:1,
            content:this.textarea,
            userId:user.userId
        }              
        let res=await this.$axios.$post(this.$server.getMyFeedBacks,querys) 
        if(res.status==200){
            this.textarea = '';
            this.outerVisible = true;             
        }        
    }
}   
</script>
<style lang="scss" scoped>
.personalBox{
    .imgbox{
        margin: auto;
        width: 74px;
        height: 74px;
    }
    p{
        width: 100%;
        text-align: center;
        font-size: 24px;
    }    
}

.inputDivCss{
    text-align: center;
    margin-top: 40px;
    .warryText{
        color: #CC0033;
        text-align: left;
        margin: 10px 0;
        font-size: 14px;
    }
    .inputCss{
        width: 567px;
        display: inline-block;
        position: relative;
        height: 215px;
        .inputP{
            word-wrap:break-word;
            text-align: left;
            font-size: 14px;
        }
        .butCss{
            color: #ffffff;
            text-align: center;
            font-size: 14px;
            // display: inline-block;
            line-height: 41px;
            width:110px;
            height:41px;
            background:rgba(195,13,35,1);
            border-radius:4px;
            cursor: pointer;
            margin-top: 20px;
        }       
        .numberText{
            position: absolute;
            font-size: 14px;
            right: 5px;
            top: 195px;
        }     
    }
}

</style>

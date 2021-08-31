<template>
    <div  v-loading="loading">
        <div class="lmargin30 whilteBack boxshow">
            <el-row class="top">
                <el-col :span="22" class="lPadding20">
                    <el-row>
                        <el-col :span="1"><div class="iconStyle greenBack"></div></el-col>
                        <el-col :span="23" class="lSize18 lLeft-r">基本概况</el-col>
                    </el-row>
                </el-col>
                <el-col :offset="1" :span="23">
                    <el-row class="lCenter-r"> 
                        <!-- {path: '/login', query:{stage: stage}} -->
                        <el-col :span="6" class="modelNumber">
                            <el-row  @click.native="appCommentTime">
                                <el-col class="lSize24 lPadding20">新评论</el-col>
                                <el-col class="lSize26 lPadding20 data">{{forData.newCommentCount}}</el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appUserTime">
                                <el-col class="lSize24 lPadding20">昨日用户</el-col>
                                <el-col class="lSize26 lPadding20 data">{{forData.yesterdayRegisterCount}}</el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appAllUserTime">
                                <el-col class="lSize24 lPadding20">总用户</el-col>
                                <el-col class="lSize26 lPadding20 data">{{allUserCount}}<span class="numberBool" v-if="allUserCountBool">万</span></el-col>
                            </el-row>
                        </el-col>
                        <!-- <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appmoneyYesTime">
                                <el-col class="lSize24 lPadding20">昨日订单金额</el-col>
                                <el-col class="lSize26 lPadding20 data">￥{{yesterdayCount}}<span class="numberBool" v-if="moneyBool">万</span></el-col>
                            </el-row>
                        </el-col>  
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="goRecord">
                                <el-col class="lSize24 lPadding20">昨日充值金额</el-col>
                                <el-col class="lSize26 lPadding20 data">￥{{yesterdayRechargeCount}}<span class="numberBool" v-if="moneyBool">万</span></el-col>
                            </el-row>
                        </el-col>                  -->
                    </el-row>
                </el-col>
            </el-row> 
        </div>
        <div  class="lmargin30 whilteBack">
            <el-row>
                <el-col :span="22" class="lPadding20">
                    <el-row>
                        <el-col :span="1"><div class="iconStyle redBackColor"></div></el-col>
                        <el-col :span="23" class="lSize18 lLeft-r">订单概况</el-col>                        
                    </el-row>
                </el-col>
                <el-col :offset="1" :span="23">
                    <el-row class="lCenter-r">
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appmoneyYesTime">
                                <el-col class="lSize24 lPadding20">昨日订单金额</el-col>
                                <el-col class="lSize26 lPadding20 data">￥{{yesterdayCount}}<span class="numberBool" v-if="moneyBool">万</span></el-col>
                            </el-row>
                        </el-col>  
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="goRecord">
                                <el-col class="lSize24 lPadding20">昨日充值金额</el-col>
                                <el-col class="lSize26 lPadding20 data">￥{{yesterdayRechargeCount}}<span class="numberBool" v-if="moneyBool">万</span></el-col>
                            </el-row>
                        </el-col> 
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="goMemberCount">
                                <el-col class="lSize24 lPadding20">昨日会员金额</el-col>
                                <el-col class="lSize26 lPadding20 data">￥{{yesterdayMonthMemberCount}}<span class="numberBool" v-if="moneyBool">万</span></el-col>
                            </el-row>
                        </el-col>                                         
                    </el-row>
                </el-col>
            </el-row>   
        </div>        
        <div  class="lmargin30 whilteBack">
            <el-row>
                <el-col :span="22" class="lPadding20">
                    <el-row>
                        <el-col :span="1"><div class="iconStyle yellowBack"></div></el-col>
                        <el-col :span="23" class="lSize18 lLeft-r">课程概况</el-col>                        
                    </el-row>
                </el-col>
                <el-col :offset="1" :span="23">
                    <el-row class="lCenter-r">
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appMusicVideoYesTime(1)">
                                <el-col class="lSize24 lPadding20">视频课总数</el-col>
                                <el-col class="lSize26 lPadding20">{{forData.videoCount}}</el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appMusicVideoYesTime(2)">
                                <el-col class="lSize24 lPadding20">音频课总数</el-col>
                                <el-col class="lSize26 lPadding20">{{forData.audioCount}}</el-col>
                            </el-row>
                        </el-col>
                        <!-- <el-col :span="6" class="modelNumber">
                            <el-row @click.native="appExamineYesTime">
                                <el-col class="lSize24 lPadding20">待审核</el-col>
                                <el-col class="lSize40 lPadding20">{{forData.audit}}</el-col>
                            </el-row>
                        </el-col> -->
                        <el-col :span="6" class="modelNumber">
                            <el-row>
                                <el-col class="lSize24 lPadding20"></el-col>
                                <el-col class="lSize26 lPadding20"></el-col>
                            </el-row>
                        </el-col>                   
                    </el-row>
                </el-col>
            </el-row>   
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import Dialog from "@/components/myDialog/myDialog";
// import { getToken,setToken,removeToken,getPermissions} from '@/utils/auth';
import eventAction from '../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        Dialog
    },
    data(){
        return {
                forData:{},
                loading:true,
                allUserCount:0,//总用户
                yesterdayCount:0,//昨日订单，
                yesterdayRechargeCount:0,//昨日充值
                yesterdayMonthMemberCount:'',//昨日会员包月卡收入
                moneyBool:false,
                allUserCountBool:false,
                permissions:[]
            }
        },
    created(){      
        //获取对应权限数据；
        this.permissions = JSON.parse(window.localStorage.getItem('permissions'))
        this.ajaxAppHome();
    },
    props:[],  
    computed:{},
    methods:{
        appCommentTime(){
            if(this.$authJudge('comment')){
                this.timeAlgorithm(7);
                window.location.hash = 'comment'
                window.location.reload()
            }else{
                this.$message.error('没有权限');
            }
        },
        appUserTime(){
            if(this.$authJudge('user')){
                this.timeAlgorithm(1);   
                window.location.hash = 'userFilesHome'
                window.location.reload()    
            }else{
                this.$message.error('没有权限');
            }              
        },
        appmoneyYesTime(){
            if(this.$authJudge('record:order')){
                this.timeAlgorithm(1);
                window.location.hash = 'record/orderRecord'
                window.location.reload()     
            }else{
                this.$message.error('没有权限');
            }       
        },
        goMemberCount(){
            if(this.$authJudge('record:order')){
                this.timeAlgorithm(1);
                window.location.hash = 'record/monthMemberRecord';
                window.location.reload()     
            }else{
                this.$message.error('没有权限');
            }             
        },
        appAllUserTime(){
            if(this.$authJudge('user')){
                window.location.hash = 'userFilesHome'
                window.location.reload()     
            }else{
                this.$message.error('没有权限');
            }        
        },
        timeAlgorithm(num){
            var startTime = Number(new Date());
            var yesTime =startTime-(new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime());
            var endTime = startTime-86400000*num-yesTime;
            sessionStorage["appHomeSetDate"] = endTime;
        },
        //待审核
        // appExamineYesTime(){ 
        //     if(this.permissions.includes('courseaudit')){
        //         window.location.hash = 'course/audit'
        //         window.location.reload()   
        //     }else{
        //         this.$message.error('没有权限');
        //     }       
        // },
        appMusicVideoYesTime(nums){
            if(this.$authJudge('course:course')){
                let query = {
                    title:'',
                    courseStatus:3,
                    courseType:nums,
                    pipelineId:'',
                    mtype:'',
                    homeType:true
                }
                this.$router.push({
                    path:'/courseCopy',
                    query:query
                })
                // window.location.hash = 'courseCopy'
                // window.location.reload()   
            }else{
                this.$message.error('没有权限');
            }
        },
        unmberConversion(num){
            if(num>1e4){
                this.moneyBool = true;
                return (num/1e4).toFixed(1)
            }else{
                this.moneyBool = false;
                return num;
            }
        },
        ajaxAppHome(){
            var self = this;
            var url = '/home';
            actions.getData(url)
                .then(data => {  
                    var newData =  Number(data.yesterdayCount);
                    self.forData = data;
                    if(data.allUserCount>9999){
                        self.allUserCountBool = true;
                    }else{
                        self.allUserCountBool = false;
                    }
                    self.allUserCount=self.unmberConversion(data.allUserCount),//总用户
                    // self.allUserCount=self.unmberConversion(50000),//总用户
                    self.yesterdayCount=self.unmberConversion(data.yesterdayCount),//昨日收入
                    this.yesterdayRechargeCount = this.unmberConversion(data.yesterdayRechargeCount),
                    this.yesterdayMonthMemberCount = this.unmberConversion(data.yesterdayMonthMemberCount),
                    self.$nextTick(function(){
                           self.loading = false;
                    }) 
                })
                .fail(function(){
                    self.loading = false;
                }
                );                         
        },
        goRecord(){
            if(this.$authJudge('record:recharge')){
                this.$router.push({
                    path:'/record/moneyRecord',
                    query:{
                        condition:'yestoday'
                    }
                })
            }else{
                this.$message.error('没有权限');
            }        
           
        }
    },
    mounted(){}
}
</script>

<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.modelNumber:hover{
    color: #B4272D;
    cursor: pointer;
}
.iconStyle{
    width: 5px;
    height: 15px;
    border-radius: 2px;
    margin: 5px auto;
}
.top{
    .data{
        line-height: 46px;
    }
}
</style>

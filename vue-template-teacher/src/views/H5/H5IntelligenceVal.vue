<template>
    <div class="H5-intelligence-warp">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
        </div>
        <div class="page-content">
           <!-- <div>每日登陆学习奖励多少智力值和小孚星</div> -->
           <div>每日登陆学习奖励多少小孚星</div>
           <!-- <div class='inputText'>
               <div class='title'>智力值</div>
               <el-input style="width:200px;" @blur="blurEven(courseCurrencyForms[0].rewardNum)" v-model="courseCurrencyForms[0].rewardNum" placeholder="0-100整数"></el-input>
           </div> -->
           <!-- <div class='inputText'>
               <div class='title'>孚 星</div>
               <el-input style="width:200px;margin-top:10px;" @blur="blurEven(courseCurrencyForms[1].rewardNum)" v-model="courseCurrencyForms[1].rewardNum" placeholder="0-100整数"></el-input>
           </div> -->
           <div class='inputText'>
               <div class='title'>孚 星</div>
               <el-input style="width:200px;margin-top:10px;" @blur="blurEven(courseCurrencyForms[0].rewardNum)" v-model="courseCurrencyForms[0].rewardNum" placeholder="0-100整数"></el-input>
           </div>
        </div>
        <div style="text-align: center;margin-top:20px;">
            <el-button @click="medalsEven(false)">取消</el-button>
            <el-button @click="medalsEven(true)" type="primary">确认</el-button>
        </div>
    </div>
</template>

<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[],
            courseCurrencyForms:[
                // {
                //    rewardNum:'',
                //    interactCourseId:'',
                //    type:1,
                //    id:''
                // },
                // {
                //    rewardNum:'',
                //    interactCourseId:'',
                //    type:2,
                //    id:''
                // }
                {
                   rewardNum:'',
                   interactCourseId:'',
                   type:1,
                   id:''
                }

            ],
            courseId:'',
            id:'',
            newEdit:false,
            isOk:true
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    computed:{},
    created() {
        this.id = this.$route.query.id;
        this.courseId = this.$route.query.courseId||'';
        this.titleList=[
            {
                name:'H5课程管理',
                pathInfo:''
            },
            {
                name:'H5课程',
                pathInfo:'/H5WebView/index'
            },
            {
                name:'创建H5课程',
                pathInfo:'/H5WebView/H5Creat/'+this.courseId
            },
            {
                name:'孚星',
                pathInfo:''
            }                 
        ];       
            // {
            //     name:'孚星/智力值',
            //     pathInfo:''
            // } 
        this.returnData();
    },
    methods: {   
            blurEven(value){
                if(!/^\d+$/.test(Number(value))){
                    this.$message.error('内容有误,请输入范围0-100的整数');
                }else if(Number(value) < 0 || Number(value) >100){
                    this.$message.error('请输入范围0-100');
                }
            },
           returnData(){
                this.$http.get(this.$server.h5CourseCurrency+this.id).then(res=>{
                    if(res.status==200){
                        if(res.content.length>0){
                            this.newEdit = true;
                            res.content.forEach((item,index)=>{
                                // if(item.type==1){
                                //     this.courseCurrencyForms[0].rewardNum=item.rewardNum;
                                //     this.courseCurrencyForms[0].interactCourseId=item.interactCourseId;
                                //     this.courseCurrencyForms[0].type=item.type;
                                //     this.courseCurrencyForms[0].id=item.id;
                                // }
                                // if(item.type==2){
                                //     this.courseCurrencyForms[1].rewardNum=item.rewardNum;
                                //     this.courseCurrencyForms[1].interactCourseId=item.interactCourseId;
                                //     this.courseCurrencyForms[1].type=item.type;
                                //     this.courseCurrencyForms[1].id=item.id;
                                // }     
                                // if(item.type==2){
                                    this.courseCurrencyForms[0].rewardNum=item.rewardNum;
                                    this.courseCurrencyForms[0].interactCourseId=item.interactCourseId;
                                    this.courseCurrencyForms[0].type=item.type;
                                    this.courseCurrencyForms[0].id=item.id;
                                // }                                                      
                            })
                        }else{
                            this.newEdit = false;
                        }
                    }
                });
           },
           medalsEven(bool){
               if(bool){
                    let query= {};
                    for (const iterator of this.courseCurrencyForms) {
                        // if(!iterator.rewardNum){
                        //     this.$message.error("请完善数据!");
                        //     return;
                        // }else 
                        if(Number(iterator.rewardNum) < 0 || Number(iterator.rewardNum) >100){
                            this.$message.error('请输入范围0-100');
                            return;
                        }
                    }
                    this.courseCurrencyForms.forEach((item,index)=>{
                        if(this.newEdit){
                            query['courseCurrencyForms['+index+'].id'] = item.id; 
                        }
                        query['courseCurrencyForms['+index+'].rewardNum'] = item.rewardNum; 
                        query['courseCurrencyForms['+index+'].interactCourseId'] = this.id; 
                        query['courseCurrencyForms['+index+'].type'] = item.type;    
                    })
                    this.$http.post(this.$server.h5CourseCurrencyEdit,query).then(res=>{
                        if(res.status==200){
                            this.$message.success("创建成功!");
                            // this.$router.push({
                            //     path:'/H5WebView/H5Creat',
                            //     query:{
                            //         id:this.courseId
                            //     }
                            // }) 
                            this.$router.push(`/H5WebView/H5Creat/${this.courseId}`)   
                        }
                    })                   
               }else{
                   this.$router.push(`/H5WebView/H5Creat/${this.courseId}`)   
               }
           }
    }
};
</script>

<style scoped lang="scss">
    .H5-intelligence-warp {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        overflow: hidden;   
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding:20px;
            .inputText{
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                margin-top: 10px;
                .title{
                    width: 60px;
                    text-align: left;
                }
            }
        }
    }
    
   
    
</style>


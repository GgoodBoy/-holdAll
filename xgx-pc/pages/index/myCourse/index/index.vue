<template>
    <div class="course-box" v-loading="loading">
        <breadcrumb :listData='datalist' :class="{'absolutes':breadbools}"></breadcrumb>
        <div class="course-center" >
            <div class="courseListBox" v-for="(item,index) in courseListData" :key="index">
                <div class="divCourseOne">
                    <div>
                        <img :src="item.surfacePlot"/>
                    </div>
                </div>
                <div class="divCourseTwo">
                    <div class="divCenter">
                        <div class="uniteCss">
                            <el-tooltip class="item" effect="light" :content="item.title" placement="top-start">
                                <p class="titleP">{{item.title}}</p>
                            </el-tooltip> 
                        </div>
                        <div class="uniteCss imgUniteCss">
                            <el-row>
                                <el-col v-if="item.lectureTeacherList.length==1">
                                    <el-row :gutter="10">
                                        <el-col :span="4">
                                            <div class="imgBoxOne">
                                                <img :src="item.lectureTeacherList[0].avatar"/>
                                            </div>
                                        </el-col>
                                        <el-col :span="20">{{item.lectureTeacherList[0].name}}</el-col>
                                    </el-row>
                                </el-col>
                                <el-col v-if="item.lectureTeacherList.length>1">
                                    <div class="imgBoxDiv">
                                        <div class="imgBoxOne" v-bind:style="{ 'z-index':indexs+1, 'left': (indexs)*(150/(item.lectureTeacherList.length>15?15:item.lectureTeacherList.length))+'px' }" v-for="(items,indexs) in item.lectureTeacherList" :key="indexs">
                                            <img :src="items.avatar"/>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="uniteCss">
                            <el-row :gutter="10">
                                  <el-col :span="4">
                                    <div class="moneyCss_money">
                                        <i></i>
                                    </div>
                                </el-col>
                                <el-col :span="20"><p style="color:#C30D23;font-weight:bold;font-size:14px;">{{item.sellingPrice==0?'免费':item.sellingPrice+'币'}}</p></el-col>
                            </el-row>
                        </div> 
                        <div class="uniteCss" v-if="item.belongType==6&&item.channelBuyAvaliDay!=0">
                            <el-row :gutter="10">
                                <el-col :span="4">
                                    <div class="moneyCss_time">
                                        <i></i>
                                    </div>
                                </el-col>
                                <el-col :span="20"><p style="font-size:14px;">2012-07-02</p></el-col>
                            </el-row> 
                        </div>                                            
                        <div class="progress">
                            <!-- <el-progress :percentage="Number(item.progress.substr(0,item.progress.length-1))"></el-progress> -->
                            <div class="progressBox">
                                <div class="progressNum" :style="{width:Number(item.progress.substr(0,item.progress.length-1))+'%'}"></div>
                            </div>
                            <div class="progressTitle">已学完{{Number(item.progress.substr(0,item.progress.length-1))||0}}%</div>
                        </div>
                    </div>
                </div>
                <div class="divCourseFour">
                    <div>
                        <span v-if="Number(item.progress.substr(0,item.progress.length-1))==100" @click="learnStatsEven(item)">再学一次</span>
                        <span v-if="Number(item.progress.substr(0,item.progress.length-1))<100&&Number(item.progress.substr(0,item.progress.length-1))>0" @click="learnStatsEven(item)">继续学习</span>
                        <span v-if="Number(item.progress.substr(0,item.progress.length-1))==0" @click="learnStatsEven(item)">开始学习</span>
                    </div>
                </div>
            </div>
            <div v-show="listNumber==0" class="noDataCss">您还没有购买过课程</div>
        </div>
        <div class="pageCss">
            <Page  v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator';
import Page from '~/components/Page.vue';
import {delCookie,getCookie} from '../../../../utils/cache.js'
import { NuxtContext } from 'nuxt';
import { setTimeout } from 'timers';
import {mapState,mapActions} from 'vuex';
import breadcrumb from '~/components/breadcrumb.vue';
import ajaxs from '~/api/index.js';
@Component({
    components:{Page,breadcrumb},
    methods:{
        ...mapActions(['selectMyStartEven'])
    },
    async asyncData({app,params,query}:NuxtContext):Promise<any>{
    }
})
export default class About extends Vue{
    courseListData:object[]=[];
    currentPages:number=1;
    pageSizes:number=10;
    loading:boolean=false;
    totals:number=0;
    pageNo:number=1;
    breadbools:boolean=true;
    listNumber:number=0;
    cssObj:Object='position: absolute;bottom: 0;width: 967px;left: 220px;';
    head(){
        return {
            title:'已购课程 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers))
        this.getCourseListEven(1);
    }
    datalist:object[] = [
        {
            name:'首页',
            link:'/home'
        },{
            name:'已购课程',
            link:''
        }
    ];
    async currentChange(number){
        this.pageNo = Number(number);
        this.currentPages=Number(number);
        this.getCourseListEven(number);
    }
    async getCourseListEven(pageNumber){
            this.loading=true;
            let query = {
                params:{
                    pageSize:10,
                    pageNo:pageNumber,
                    type:1
                }
            }
            //ES7 ajax写法 await会在异步执行结束之后，才会执行后面的代买，实现了从上到下的代码阅读
            let res = await this.$axios.$get(this.$server.getMyCourseList,query)
            if(res.status==200){
                this.listNumber = res.content.list.length;
                this.courseListData = res.content.list;
                this.totals= res.content.total;
                this.loading=false;
            }else{
                this.listNumber = 0;
                this.loading=false;
            }
    }
    learnStatsEven(data){
        // /course/player?courseId=1&periodId=1&targetId=5
        this.$router.push({path:'/course/details?id='+data.id})
    }
}
</script>
<style lang="scss" scoped>
.course-box{
    .noDataCss{
        width: 100%;
        text-align: center;
        color: #ccc;
        padding: 30px 0 0 0;
        background: #F3F5F7;
    }
    .pageCss{
        width: 100%;
        text-align: center;
        margin:30px 0;
    }
    .absolutes{
        position: absolute;
        left: 0;
        top: -30px;
    }
    .course-center{
            display: inline-block;
            width: 967px;
            .courseListBox:last-child{
                margin:0;
            }
            .courseListBox{
                width: 100%;
                overflow: auto;
                zoom: 1;
                height: 186px;
                margin: 0px 0 20px 0;
                padding: 30px;
                background: #fff;
                .divCourseOne,.divCourseTwo,.divCourseThree{
                    float: left;
                }
                // .divCourseThree{
                //     height: 100%;
                //     display: flex;
                //     margin-left: 40px;
                //     justify-content: center;
                //     align-items: center;
                //     width: 300px;
                //     div:nth-child(1){
                //         width: 100%;
                //     }
                // }
                .divCourseTwo{
                    height: 100%;
                    position: relative;
                    // display: flex;
                    width: 200px;
                    margin-left: 22px;
                    justify-content: center;
                    align-items: center;
                    .divCenter{
                        width: 100%;
                        .progress{
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            .progressBox{
                                float: left;
                                width: 60%;
                                height: 10px;
                                margin-top: 3px;
                                background: #F3F5F7;
                                border-radius: 10px;
                                overflow: hidden;
                                .progressNum{
                                    height: 10px;
                                    background: #C30D23;
                                    border-radius: 10px;
                                }
                            }
                            .progressTitle{
                                float: right;
                                width: 38%;
                                margin-left: 2%;
                                font-size: 12px;
                            }
                        }
                        .uniteCss:not(:first-child){
                            margin-top: 8px;
                        }
                        .uniteCss{
                            .moneyCss_money{
                                width: 20px;
                                height: 20px;
                                i{
                                    width: 20px;
                                    height: 20px;
                                    display: block;
                                    background: url('../../../../assets/images/money_one.png')no-repeat 50% 50% /cover;
                                }
                            }
                            .moneyCss_time{
                                width: 20px;
                                height: 20px;
                                i{
                                    width: 20px;
                                    height: 20px;
                                    display: block;
                                    background: url('../../../../assets/images/time_one.png')no-repeat 50% 50% /cover;
                                }
                            }
                            .titleP{
                                font-size:18px;
                                font-weight:400;
                                color:rgba(51,51,51,1);   
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;                                
                            }
                        }
                        .imgUniteCss{
                            height: 20px;
                            .imgBoxOne,.imgBoxTwo{
                                    width: 20px;
                                    height: 20px;
                                    overflow: hidden;
                                    border-radius: 50%;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }
                            }
                            .imgBoxDiv{
                                width: 100%;
                                position: relative;
                                .imgBoxOne{
                                    position: absolute;
                                    width: 20px;
                                    height: 20px;
                                    overflow: hidden;
                                    border-radius: 50%;
                                    img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                        }
                    }
                }
                .divCourseOne{
                    width: 224px;
                    height: 126px;
                    div:nth-child(1){
                        width: 224px;
                        height: 126px;
                        overflow: hidden;
                        img{
                            width: 100%;
                        }
                    }
                    p{
                        line-height: 30px;
                        overflow: hidden;
                        width: 100%;
                        text-align: center;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        font-size: 12px;
                    }
                }
                .divCourseFour{
                    float:right;
                    width: 100px;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    div:nth-child(1){
                        padding: 5px 10px;
                        background: #C30D23;
                        color: #fff;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                }
            }
        }
 }

</style>

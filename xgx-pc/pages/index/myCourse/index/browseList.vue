<template>
    <div class="browse-box" v-loading="loading">
        <breadcrumb :listData='datalist' :class="{'absolutes':breadbools}"></breadcrumb>
        <div class="course-center">
            <div class="browseList" >
                <div class="detaiBoxCss" v-for="(item,index) in courseListData" :key="index">
                    <div class="detaiBoxSonOne">
                        <img :src="item.surfacePlot"/>
                    </div>
                    <div class='detaiBoxSonTwo'>
                        <div class="oneDiv">{{item.title}}</div>
                        <div class="twoDiv">{{item.intro}}</div>
                        <div class="threeDiv">
                            <div class="uniteCss imgUniteCss">
                                <el-row>
                                    <el-col v-if="item.lectureTeacherList.length==1">
                                        <el-row>
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
                        </div>
                        <div class="fourDiv">
                            <div class="divBut" @click="learnStatsEven(item)">
                                再次观看
                            </div>
                        </div>
                    </div>
                </div> 
                <div v-show="listNumber==0" class="noDataCss">您还没有浏览过课程</div>               
            </div>
            <div class="pageCss">
                <Page  v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>
            </div>            
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator';
import Page from '~/components/Page.vue';
import { NuxtContext } from 'nuxt';
import { setTimeout } from 'timers';
import {mapState,mapActions} from 'vuex';
import breadcrumb from '~/components/breadcrumb.vue';
import ajaxs from '~/api/index.js';
const Logo = require('../../../../assets/images/logo_type2.png');
@Component({
    components:{Page,breadcrumb},
    methods:{
        ...mapActions(['selectMyStartEven'])
    },    
    async asyncData({app,params,query}:NuxtContext):Promise<any>{} 
})
export default class About extends Vue{
    Logo:any = Logo;
    currentPages:number=1;
    pageSizes:number=10;
    totals:number=0;
    pageNo:number=1;    
    courseListData:object[]=[];
    loading:boolean=false;
    listNumber:number=0;
    breadbools:boolean=true;
    cssObj:Object='position: absolute;bottom: -40px;width: 967px;left: 220px;';
    datalist:object[] = [
        {
            name:'首页',
            link:'/home'
        },{
            name:'浏览记录',
            link:''
        }
    ]    
    head(){
        return {
            title:'浏览记录 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers)); 
        this.getCourseListEven(1);
    }
    async currentChange(number){
        this.pageNo = Number(number);
        this.currentPages=Number(number);
        this.getCourseListEven(number);
    } 
    learnStatsEven(data){
        // /course/player?courseId=1&periodId=1&targetId=5
        this.$router.push({path:'/course/details?id='+data.id})
    }    
    async getCourseListEven(pageNumber){
            this.loading=true;
            let query = {
                params:{
                    pageSize:10,
                    pageNo:pageNumber,
                    type:3
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
                this.loading=false;
                this.listNumber = 0;
            }        
    }   
}   
</script>
<style lang="scss" scoped>
.browse-box{
    width: 967px;
    // padding: 10px;
    .noDataCss{
        width: 100%;
        text-align: center;
        color: #ccc;
        margin: 30px 0 0 0;        
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
            // padding-top: 20px;
            width: 100%;
            // background: #ffffff;
            // padding:20px;
            .browseList{
                // width: 100%;
                overflow: hidden;
                min-height: 100px;
                // zoom: 1;
                .detaiBoxCss{
                    background: #fff;
                    margin: 0 0 17px 0;
                    overflow: auto;
                    // height: 180px;
                    // padding: 5px;
                    zoom: 1;
                    .detaiBoxSonOne{
                        width: 194px;
                        height: 109px;
                        overflow: hidden;
                        float: left;
                        img{
                            width: 100%;
                        }
                    }
                    .detaiBoxSonTwo{
                        float: right;
                        position: relative;
                        height: 100%;
                        width: 200px;
                        // margin-left: 20px;
                        .oneDiv,.twoDiv,.threeDiv,.fourDiv{
                            width: 100%;
                            margin: 5px 0;
                            .divBut{
                                width: 62px !important;
                                border-radius: 4px;
                                text-align: center !important;
                                background: #169BD5;
                                margin-left: 140px;
                                color: #fff;
                                cursor: pointer;
                            }
                        }
                        .threeDiv{
                            .uniteCss{
                                margin-top: 5px;
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
                                .moneyCss{
                                    width: 20px;
                                    height: 20px;
                                    border-radius: 50%;
                                    font-weight: bold;
                                    text-align: center;
                                    font-size: 13px;
                                    color: #C30D23;
                                    line-height: 20px;
                                    border: 1px solid #C30D23;
                                }
                            }
                            .imgUniteCss{
                                .imgBoxOne,.imgBoxTwo{
                                        width: 18px;
                                        height: 18px;
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
                                    height: 20px;
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
                        
                        .oneDiv,.twoDiv{
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;                             
                        }
                        .fourDiv{
                            position: absolute;
                            bottom: -2px;
                            right: 0px;
                            .divBut{
                                width: 62px !important;
                                border-radius: 4px;
                                padding: 2px 0;
                                text-align: center !important;
                                // background: #169BD5;
                                background: #C30D23;
                                margin-left: 140px;
                                color: #fff;
                                font-size: 12px;
                            }                            
                        }                        
                    }                    
                }
                .detaiBoxCss:nth-child(even){
                    float: right;
                    width: 475px;
                    padding: 30px;
                }                
                .detaiBoxCss:nth-child(odd){
                    float:left;
                    width: 475px;
                    padding: 30px;
                }                
            }
        }
 }
    
</style>
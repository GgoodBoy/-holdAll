<template>
    <div class="page-wrap">
        <div class="page-head">
            <section class="page-title clearfix">
                <!-- <h2 class="fl">课程审核</h2> -->
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </section>
            <section>
                <el-row class="filtrate-wrap">
                    <el-col class="filtrate-title"><h2>筛选</h2></el-col>
                    <el-col class="filtrate-input">
                        <el-input v-model.trim="form.title"
                                  placeholder="搜索标题"></el-input>
                    </el-col>

                    <el-col class="filtrate-select">
                        <el-select v-model="form.courseStatus"
                                   clearable
                                   placeholder="课程状态">
                            <el-option v-for="item,i in pageConstant.courseStatusList"
                                       :key="i"
                                       :label="item.name"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="filtrate-select">
                        <el-select v-model="form.courseType"
                                   clearable
                                   placeholder="课程类型">
                            <el-option v-for="item,i in pageConstant.courseTypeMap"
                                       :key="i"
                                       :label="item.name"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="filtrate-execute">
                        <div class="search-btn tc"
                             @click="search">筛选</div>
                    </el-col>
                </el-row>
            </section>
        </div>
        <div class="page-content">
            <el-table :data="pageData.items"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                    <el-table-column label="序号"
                                    prop="sortId"
                                    align="center"
                                    min-width="60">
                    </el-table-column>                       
                    <el-table-column prop="id"
                                    label="ID"
                                    align="center"
                                    min-width="70">
                            <template slot-scope="scope">
                                {{scope.row.parentId>0? `${scope.row.parentId}(副本)`:scope.row.id}}
                            </template>                                 
                    </el-table-column>
                    <el-table-column label="名称"
                                    align="center"
                                    min-width="360">
                        <template slot-scope="scope">
                            <div class="cell clearfix">
                                <div class="fl course-img">
                                    <img :src="scope.row.surfacePlot"
                                        alt="">
                                </div>
                                <div class="fl course-details">
                                    <h4 class="course-title text-ellipsis tl" :title="scope.row.title">{{scope.row.title}}</h4>
                                    <div class="course-price tl" v-if="scope.row.sellingPrice>0">{{scope.row.sellingPrice}}夫子币</div>
                                    <div class="course-price tl" v-else>免费</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updatedAt"
                                    label="时间"
                                    align="center"
                                    min-width="134">
                        </el-table-column>
                    <el-table-column prop="courseTypeStr"
                                    label="课程类型"
                                    align="center"
                                    min-width="149">
                    </el-table-column>
                    <el-table-column prop="planPeriodNum"
                                    label="课时数"
                                    align="center"
                                    min-width="130">
                        <template slot-scope="scope">
                            <p>{{scope.row.auditPassNum}}/{{scope.row.planPeriodNum}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="courseStatusStr"
                                    label="状态"
                                    align="center"
                                    min-width="135">
                        <template slot-scope="scope">
                            <p v-show="scope.row.parentId==0">{{scope.row.courseStatusStr}}</p>
                            <p v-show="scope.row.parentId>0">{{scope.row.courseStatusStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name"
                                    label="操作"
                                    align="center"
                                    fixed="right"
                                    min-width="160">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.courseStatus == 3||scope.row.courseStatus==2||scope.row.courseStatus==6"
                                    type="text"
                                    class="black-btn"
                                    @click="$router.push({path:'/course/audit/baseInfo',query:{id:`${scope.row.id}`,state:0}})">预览</el-button>
                            <el-button v-if="(scope.row.courseStatus == 1 || scope.row.courseStatus == 7||scope.row.courseStatus == 5)&&power.includes('courseaudit:audit')"
                                    type="text"
                                    class="black-btn"
                                    @click="$router.push({path:'/course/audit/baseInfo',query:{id:`${scope.row.id}`,state:1}})">审核</el-button>
                            <el-button v-if="scope.row.showMsg"
                                    type="text"
                                    class="black-btn"
                                    @click="getRecord(scope)">记录</el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    class="paging" />
        <my-dialog :showFlag.sync="recordFlag" :title="'审核记录'" :btnFlag="false" :footerStatus="false">
            <div slot="dialog-body" class="record-box">
                <div class="record-list">
                    <div class="record-item clearfix" v-for="(item,index) in recordList" :key="index">
                        <div class="left">
                            <p class="time">{{formatDate(item.createdAt)}}</p>
                            <p  class="text">{{item.rejectCause}}</p>
                        </div>
                        <div class="right"><p>{{item.checkStatusStr}}</p></div>
                    </div>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script type="application/ecmascript">
import pagination from "@/components/pagination";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import myDialog from '@/components/myDialog/myDialog.vue'
export default {
    data() {
        return {
            form: {
                title: "",
                courseStatus: "",
                courseType: "",
            },
            pageConstant: {},
            pageData: {

            },
            loading: false,
            recordFlag:false,
            recordList:[],
            power:[],
            titleList:[
                {
                    name:'课程',
                    pathInfo:''
                },
                {
                    name:'课程审核',
                    pathInfo:''
                }
            ]            
        };
    },
    metaInfo: {
        title: "课程审核列表"
    },
    components: {
        pagination,
        myDialog,
        breadcrumb
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        this.power = flag;        
        this.getConstant();
        this.init();
    },
    methods: {
        init() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            this.loading = true;
            this.form = {
                title: query.title || "",
                courseStatus: this.isIntNumber(query.courseStatus)
                    ? Number(query.courseStatus)
                    : "",
                courseType: this.isIntNumber(query.courseType)
                    ? Number(query.courseType)
                    : ""
            };
            this.$http
                .get(this.$server.courseAuditIndex, {
                    params: query
                })
                .then(res => {
                        var contentdate = res.content;
                        var listIds = [];
                            listIds = contentdate.items.map(function(element,index){
                                if(contentdate.currentPage==1){
                                    element.sortId = index+1;
                                    return element;
                                }else if(contentdate.currentPage>1){
                                    element.sortId = (contentdate.currentPage-1)*10+index+1;
                                    return element;
                                }
                            }); 
                    res.content.items = listIds                    
                    this.pageData = res.content;
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });
        },
        isIntNumber(str) {
            return /^\d+$/.test(str);
        },
        search() {
            this.$router.push({
                path: "/course/audit",
                query: this.form
            });
        },
        getConstant() {
            this.$http
                .get(this.$server.courseAuditConstant)
                .then(res => {
                    this.pageConstant = res.content;
                    console.log(this.pageConstant.courseStatusMap)
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getRecord(scope){
            this.recordFlag = true;
            let id = scope.row.id;
            this.$http.get(this.$server.courseAuditLog(id)).then(res=>{
                if(res.status  == 200){

                    this.recordList = res.content.items
                }
            })
        },
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                h = h<10?("0"+h):h;
                m1 = m1<10?("0"+m1):m1;   
                s = s<10?("0"+s):s;      
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        }        
    }
    /** 
     * 
     * auditPassNum: 0
bonusRatio: 0.2
bonusTeacherId: 39
bonusTeacherInfoList: []
classifyId: 3
courseBrowsCount: 0
courseStatus: 2
courseStatusStr: "审核失败"
courseType: 1
courseTypeStr: "视频"
createdAt: "2018-12-11 22:29:37"
id: 61
intro: "ljm123"
introduce: "<p style="line-height: 1.5em;">456789<br/></p>"
isFree: 0
isFreeStr: "收费"
lastSubmitRemark: "12312"
lectureTeacherList: []
originalPrice: 100
parentId: 0
planPeriodNum: 45
sellingPrice: 10
showMsg: false
showUpdateWaitCheck: false
surfacePlot: "http://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/54cbc085-1b90-4f5b-afa7-b69fa3a52df2.jpg"
teacherInfo: "[{"id":40,"name":"猫腻","serialNumber":"77421230","professionalTitle":"网络作家","intro":"猫腻 ，本名晓峰，1977年出生于湖北省宜昌市夷陵区，网络作家。","avatar":"http://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/6cfb6c45-8546-40b0-8d78-e0004405a9e6.jpg"}]"
teacherInfoList: [{…}]
title: "ljm"
updatedAt: "2018-12-12 10:54:38"
    */
};
</script>

<style lang="scss" scope>
.page-head {
    height: 150px;
    padding: 28px 19px 30px 17px;
    background: #fff;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .page-title {
        line-height: 40px;
        font-size: 18px;
        color: #384156;
        padding-bottom: 25px;
    }
    .filtrate-title {
        padding-right: 16px;
        width: 46px;
        font-size: 14px;
        color: rgba(56, 65, 86, 1);
        line-height: 40px;
    }
    .filtrate-select {
        width: 140px;
        margin-right: 20px;
    }
    .filtrate-input {
        width: 240px;
        margin-right: 20px;
    }
    .filtrate-execute {
        width: 110px;
    }
    .search-btn {
        cursor: pointer;
        width: 70px;
        height: 40px;
        line-height: 40px;
        background: #b4272d;
        border: none;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
    }
}
.page-content {
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    .course-img {
        width: 75px;
        height: 45px;
        margin-right: 20px;
        border-radius: 5px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .course-details {
        max-width: calc(100% - 150px);
        font-size: 14px;
        .course-title {
            color: #333333;
            margin: 0px;
        }
        .course-price {
            color: #b4272d;
        }
    }
    .black-btn {
        // color:rgba(41,40,45,1);
        color:#b4272d;
    }
}
.paging {
    margin: 30px 0;
}
    .record-box{
        .record-list{
            max-height:300px;
            overflow-y:auto;
            .record-item{
                background: #F5F5F5;
                padding: 0 20px;
                margin-bottom:10px;
                &:last-child{
                    margin-bottom:0;
                 }
                p{
                    line-height: 50px;
                }
            }
        }
    }
.clearfix:after {
    content: " ";
    display: block;
    clear: both;
    height: 0;
}
.clearfix {
    zoom: 1;
}
.left{
    float: left;
}
    .right{
        float: right;
    }
</style>

<template>
    <div>
        <!-- <div class="page-wrap course-list" v-show="!boolpluginForDetail"> -->
        <div class="page-wrap course-list">
            <div class="page-head">
                <section class="page-title clearfix">
                    <!-- <h2 class="fl">课程管理</h2> -->
                    <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
                    <div class="fr">
                        <el-button @click="$router.push('/course/create')"
                                class="red-btn">新增课程</el-button>
                    </div>
                </section>
                <section>
                    <el-row class="filtrate-wrap">
                        <el-col class="filtrate-title">
                            <h3>筛选</h3>
                        </el-col>
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
                        <el-col class="filtrate-select">
                            <el-select v-model="form.category"
                                    clearable
                                    placeholder="课程分类">
                                <el-option v-for="item,i in (pageConstant.courseCategoryList)"
                                        :key="i"
                                        :label="item.name"
                                        :value="item.id"></el-option>
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
                    <el-table-column label="ID"
                                    align="center"
                                    min-width="60">
                        <template slot-scope="scope">
                            {{scope.row.parentId>0? `${scope.row.parentId}(副本)`:scope.row.id}}
                        </template>
                    </el-table-column>
                    <el-table-column label="名称"
                                    align="center"
                                    min-width="370">
                        <template slot-scope="scope">
                            <div class="cell clearfix cu" 
                                @click="$router.push(`/course/manage/${scope.row.id}?type=${scope.row.courseStatus == courseStatus.draft || scope.row.courseStatus == courseStatus.auditFail?'editor':'preview'}`)">
                                <div class="fl course-img">
                                    <img :src="scope.row.surfacePlot"
                                        alt="">
                                </div>
                                <div class="fl course-details">
                                    <h4 class="course-title text-ellipsis tl"
                                        :title="scope.row.title">{{scope.row.title}}</h4>
                                    <div class="course-price tl" v-if="scope.row.sellingPrice>0">{{scope.row.sellingPrice}}夫子币</div>
                                    <div class="course-price tl" v-else>免费</div>                                
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="courseTypeStr"
                                    label="课程类型"
                                    align="center"
                                    min-width="149">
                    </el-table-column>
                    <el-table-column label="课时数"
                                    align="center"
                                    min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.auditPassNum}}/{{scope.row.planPeriodNum}}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态"
                                    align="center"
                                    min-width="135">
                        <template slot-scope="scope">
                            {{scope.row.parentId>0? `${scope.row.courseStatusStr}`:scope.row.courseStatusStr}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name"
                                    label="操作"
                                    align="center"
                                    class-name="handle-wrap-layout"
                                    min-width="240">
                        <template slot-scope="scope">
                            <!-- 显示规则 -->
                            <!-- 上线状态 -->
                            <el-button v-if="scope.row.courseStatus == courseStatus.putaway||scope.row.courseStatus == courseStatus.updateError||scope.row.courseStatus == courseStatus.updateWait"
                                    type="text"
                                    class="black-btn"
                                    @click="soldOut(scope.row)">下架</el-button>
                            <!-- 上线状态 -->
                            <el-button v-if="scope.row.courseStatus == courseStatus.putaway||scope.row.courseStatus == courseStatus.updateError"
                                    type="text"
                                    class="black-btn"
                                    @click="$router.push(`/course/manage/${scope.row.id}?type=update`)">更新<i v-if="scope.row.courseStatus == courseStatus.updateError||scope.row.updateNoPassCount>0" class="el-icon-warning"></i></el-button>
                            <!-- 草稿 || 审核失败 -->
                            <el-button v-if="scope.row.courseStatus == courseStatus.draft || scope.row.courseStatus == courseStatus.auditFail||scope.row.courseStatus == courseStatus.draftTwo|| scope.row.courseStatus == courseStatus.schoolediterroer"
                                    type="text"
                                    class="black-btn"
                                    @click="$router.push(`/course/manage/${scope.row.id}?type=${scope.row.parentId>0?'online-editor':'editor'}`)">编辑</el-button>
                            <!-- 上线 -->
                            <el-button v-if="scope.row.courseStatus == courseStatus.putaway||scope.row.courseStatus == courseStatus.updateWait||scope.row.courseStatus == courseStatus.updateError"
                                    type="text"
                                    class="black-btn"
                                    @click="onlineEditor(scope.row)">校编辑</el-button>
                            <!-- 非校编辑副本 && （草稿 || 审核失败） -->
                            <el-button v-if=" scope.row.courseStatus == courseStatus.schoolediterroer||scope.row.courseStatus == courseStatus.draft||scope.row.courseStatus == courseStatus.draftTwo || scope.row.courseStatus == courseStatus.auditFail|| scope.row.courseStatus == courseStatus.schoolediterroer"
                                    type="text"
                                    @click="delCourse(scope.row)"
                                    class="black-btn">删除</el-button>
                            <!-- 下线 -->
                            <el-button v-if="scope.row.courseStatus == courseStatus.soldOut"
                                    type="text"
                                    class="black-btn"
                                    @click="copyCourse(scope.row)">复制</el-button>
                            <el-button type="text" class="black-btn" v-if="scope.row.courseStatus != courseStatus.schooleditwait&&scope.row.courseStatus != courseStatus.draftTwo&&scope.row.courseStatus != courseStatus.schoolediterroer">
                                    <span @click="setCreamEven(scope.row)">关联推荐</span>
                                    <div v-show="scope.row['courseMappingVoList'].length>0" class="i-div">{{scope.row['courseMappingVoList'].length}}</div>
                            </el-button>                                   
                            <!-- 更新审核中tips -->
                            <!-- <div class="is-auditing"></div> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <pagination :totalNum="pageData.totalNum"
                        :currentPage="pageData.currentPage"
                        class="paging" />
        </div>
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="50%"
        >
            <div class="centerCss">
                   <!-- <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="form.courseIds" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>     -->
                   <courseListPlugin  :varObjs='varObj' v-if="dialogVisibleFour" v-on:listSelect="listSelectEven" :relevanceId="relevanceId" :chooseIdlist="courseIds" :urlPorp="urls" :numbersBool="4" :courseType="'course'"></courseListPlugin>      
            </div>                    
        </el-dialog>         
        <!-- <courseselect v-on:listSelect="listSelectEven" :relevanceId="relevanceId" :chooseIdlist="courseIds" :urlPorp="urls" :numbersBool="4" v-if="boolpluginForDetail" :courseType="'course'"></courseselect>             -->
    </div>
</template>

<script>
/*

    draft: 0,//草稿
    draftTwo:9
    auditing: 1,//审核中
    auditFail: 2,//审核失败
    putaway: 3,//上架
    soldOut: 4,//下架
    schooleditwait:5,//校编辑待审核
    schoolediterroer:6,//校编辑审核失败
    updateWait:7,//更新待审核
    updateError:8 //更新审核失败
    
*/
import pagination from "@/components/pagination";
import courseStatus from "@/utils/courseStatus";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
// import courseselect from "@/components/Appconfigpage/ACourseSelect/coursesselectcret"; //推存选择课程组件
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin"; //推存选择课程组件
export default {
    data() {
        return {
            form: {
                title: "",
                courseStatus: "",
                courseType: "",
                category: ""
            },
            pageConstant: {},
            pageData: {},
            loading: false,
            creamId:'',
            creamBools:false,
            relevanceId:'',
            urls:'',
            courseIds:[],
            courseIdsSort:[],
            courseIdsFormId:{},
            titleList:[
                {
                    name:'课程',
                    pathInfo:''
                },
                {
                    name:'课程管理',
                    pathInfo:''
                }                                               
            ],            //新组建
            dialogVisibleFour:false,
            varObj:{
                mtypeText:true
            },
            courseStatus            
        };
    },
    metaInfo: {
        title: "课程列表"
    },
    components: {
        pagination,
        // courseselect,
        breadcrumb,
        courseListPlugin
    },
    watch: {
        $route() {
            this.init();
        }
    },
    created() {
        this.getConstant();
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }        
        // this.$store.state.appConfig.appStore.boolpluginForDetail=false;
        var self = this;
        if(this.$route.query){
            this.form.mtype = this.form.mtype==0?'':this.form.mtype
        }
        this.init()
    },
    computed: {
        // boolpluginForDetail(){
        //     return this.$store.state.appConfig.appStore.boolpluginForDetail
        //     }
        },    
    methods: {
        init() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            this.loading = true;
            this.form = {
                title: query.title || "",
                courseStatus:Number(sessionStorage['courseStatus'])? Number(sessionStorage['courseStatus']):(this.isIntNumber(query.courseStatus)? Number(query.courseStatus): ""),
                courseType: Number(sessionStorage['appHomeSetNums'])?Number(sessionStorage['appHomeSetNums']):(this.isIntNumber(query.courseType)? Number(query.courseType): ""),
                category: this.isIntNumber(query.category)
                    ? Number(query.category)
                    : ""
            };
            this.$http
                .get(this.$server.courseIndex, {
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
                    sessionStorage.removeItem('courseStatus')
                    sessionStorage.removeItem('appHomeSetNums')
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
                path: "/course",
                query: this.form
            });
        },
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    res.content.courseTypeMap[0] = {name: "全部", value: -1};
                    res.content.courseStatusList= [{name: "全部", value: -1}].concat(res.content.courseStatusList);
                    res.content.courseCategoryList = [{name: "全部", value: -1}].concat(res.content.courseCategoryList);
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },

        ajaxCourseIds(idlist){
            var self = this;         
            self.$http
                .post(this.$server.relevanceCourseId({courseId:self.relevanceId}),{"courseMappingParamForms": JSON.stringify(idlist)})
                .then(res => {
                    if(res.status==200){
                        self.init();
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                });            
        },
        setCreamEven(item){
            var self = this;
            var idlist = [];
            self.urls = "/course/selectCourse?courseId="+item.id+"&courseSource="+1;
            item.courseMappingVoList.forEach(function(element,index){
                idlist.push(JSON.stringify(element["courseMappingId"]));
            });
            // self.courseIdsFormId[item.id] = idlist;
            self.relevanceId = item.id;
            self.courseIds =idlist;
            // self.$store.state.appConfig.appStore.boolpluginForDetail=true;  
            self.dialogVisibleFour = true;          
        },
        listSelectEven(data){
            var self = this;
            if(data.bool){
                self.courseIds =[];
                self.courseIdsSort=[];
                // self.$store.state.appConfig.appStore.boolpluginForDetail=false;
                self.dialogVisibleFour = false;
                self.courseList = data.datas;
                var i=0;
                data.datas.forEach(element => {
                    i++;
                    self.courseIds.push(element.content);
                    self.courseIdsSort.push({"courseId":element.content,"sort":i});               
                });
                console.log(self.courseIds);
                self.ajaxCourseIds(self.courseIdsSort);                
            }else{
                self.dialogVisibleFour = false;
            }

        },         
        delCourse(item) {
            let self = this;
            this.$confirm("确定要删除这个课程吗？", "课程删除提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "common-confirm-layout common-confirm-hide-icon",
                type: "warning"
            })
                .then(() => {
                    self.$http
                        .delete(`${this.$server.course}/${item.id}`)
                        .then(res => {
                            if (res.status === 200) {
                                self.init();
                                self.$message({
                                    message: "课程删除成功,正在获取最新数据！",
                                    type: "success"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        soldOut(item) {
            let self = this;
            this.$confirm("确定要下架这个课程吗？", "下架提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "common-confirm-layout common-confirm-hide-icon",
                type: "warning"
            })
                .then(() => {
                    self.$http
                        .put(this.$server.courseDown(item.id))
                        .then(res => {
                            if (res.status === 200) {
                                self.init();
                                self.$message({
                                    message: "课程下架成功,正在获取最新数据！",
                                    type: "success"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(() => {});
        },
        /**
         * 校编辑创创建副本id
         */
        onlineEditor(item) {
            this.$http
                .post(`${this.$server.courseReview}/${item.id}`)
                .then(res => {
                    if (res.status === 200) {
                        this.$router.push(
                            `/course/editor/${res.content}?type=online-editor`
                        );
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        /**
         * f复制课程
         */
        copyCourse(item) {
            this.$http
                .post(`${this.$server.courseCopy}/${item.id}`)
                .then(res => {
                    if (res.status === 200) {
                        this.$router.push(
                            `/course/editor/${res.content}?type=editor`
                        );
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
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
        .red-btn{
            background: #b4272d;
            color: #fff;
        }
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
        // color: rgba(41, 40, 45, 1);
        color: #b4272d;
        margin: 0 10px;
        position: relative;
        .i-div{
            width: 16px;
            height: 16px;
            margin: auto;
            border-radius: 50%;
            border: 2px solid #b4272d;
            position: absolute;
            right: -20px;
            top: 11px;
            font-size: 12px;            
        }
    }
    .is-auditing {
        position: absolute;
        top: 0;
        right: 0;
        background: #b4272d;
        width: 0;
        height: 0;
        border-right: 50px solid #b4272d;
        border-left: 50px solid #fff;
        border-top: 50px solid #fff;
        border-bottom: 50px solid #fff;
        top: -50px;
        right: -50px;
        transform: rotateZ(-225deg);
        &:after {
            content: "\66F4\65B0";
            width: 30px;
            position: absolute;
            top: -13px;
            right: -39px;
            transform: rotateZ(-90deg);
            color: #fff;
        }
        &:before {
            content: "\5BA1\6838\4E2D";
            width: 50px;
            position: absolute;
            top: -14px;
            right: -65px;
            transform: rotateZ(-90deg);
            color: #fff;
        }
    }
    .cu {
        cursor: pointer;
    }
}
.paging {
    margin: 30px 0;
}
</style>
<style lang="scss">
.course-list .handle-wrap-layout {
    overflow: hidden;
}
</style>

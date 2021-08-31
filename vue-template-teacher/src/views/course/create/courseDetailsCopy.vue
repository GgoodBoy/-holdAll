<template>
    <div class="course-manage-copy">
        <section class="base-info common-shadow">
            <h2 class="crumbs-list-common">
                <router-link to="/courseCopy">课程管理</router-link> / 课程详情
            </h2>
            <!-- <el-alert class="audit-fail"
                      v-if="
                      courseInfo.courseStatus === courseStatus.auditFail||
                      courseInfo.courseStatus === courseStatus.schoolediterroer||
                      courseInfo.courseStatus === courseStatus.updateError||
                      (courseInfo.updateFailMsg&&courseInfo.updateFailMsg.length>0?true:false)"
                      :title="courseInfo.lastSubmitRemark"
                      type="error">
            </el-alert> -->           
            <div class="info-wrap">
                <div class="course-img">
                    <img :src="courseInfo.surfacePlot"
                         alt=""
                         class="img100">
                </div>
                <div class="course-info">
                    <h3 class="course-title">
                        {{courseInfo.title}}
                    </h3>
                    <p class="course-price-type">
                        价格：{{courseInfo.sellingPrice || 0}}夫子币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;课程类型：{{courseInfo.courseTypeStr}}
                    </p>
                </div>
                <div class="course-handle tr">
                    <div class="handle-btn">
                        <router-link :to="`/course/editorCopy/${$route.params.id}?type=${inType}&disabledBool='disabledfalse'`"
                        v-if="inType!='update'&&inType!='preview'">编辑</router-link>
                        <router-link :to="`/course/editorCopy/${$route.params.id}?type=${inType}&disabledBool=disabledtrue`"
                                     v-if="inType!='update'&&inType=='preview'">预览</router-link>                                     
                    </div>
                    <p class="course-ratio">分成比例：{{courseInfo.bonusRatio}}%</p>
                    <p class="course-update-info">共{{courseInfo.planPeriodNum}}节，已更新{{onlinePeriodNum}}节</p>
                </div>
            </div>
        </section>
        <!-- ||courseInfo.courseStatus ===  courseStatus.auditFail -->
        <section class="period-filtrate common-shadow">
            <div class="title-row clearfix">
                <h3 class="fl module-title">课时内容</h3>
                <div class="module-handle fr">
                    <!-- <el-button type="danger"
                               class="red-btn tc"
                               @click="showAuditContent">上架课程</el-button> -->
                    <el-button type="danger"
                               class="red-btn tc"
                               v-if="inType!='preview'&&inType=='draft'"
                               @click="showPutawayContent">上架课程</el-button>                               
                    <el-button type="danger"
                               v-if="inType!='preview'"
                               @click="$router.push(`/course/manageCopy/${$route.params.id}/handle-period?course-type=${courseInfo.courseType}&isfree=${courseInfo.isFree}&type=${inType}`)"
                               class="red-btn tc">新增课时</el-button>
                </div>
            </div>
            <div class="filtrate-form clearfix">
                <div class="sn fl">
                    <el-input v-model="title"
                              placeholder="请输入标题"
                              clearable=""
                              @keydown.native.13="getPeriodList(title,isTry)"></el-input>
                    <!-- <i class="el-icon-search search-btn"
                       @click="getPeriodList(title,isTry)"></i> -->
                </div>
                <el-select v-model="isTry"
                           class="is-free fl"
                           placeholder="是否试看"
                           clearable
                           >
                    <el-option label="全部" value=""></el-option>                           
                    <el-option label="否"
                               :value="0">
                    </el-option>
                    <el-option label="是"
                               :value="1">
                    </el-option>
                </el-select>
                <el-button type="primary" style="margin-left:40px" @click="getPeriodList(title,isTry)">查询</el-button>
            </div>
        </section>
        <section class="period-list common-shadow ">
            <h2 class="none">课时列表</h2>
            <el-table :data="periodList"
                      border
                      header-cell-class-name="list-header-layout-bg"
                      max-height="400"
                      style="width: 100%">
                <el-table-column label="序号"
                                 align="center"
                                 min-width="60">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>                
                <el-table-column prop="title"
                                 label="课时"
                                 align="center"
                                 min-width="350">
                </el-table-column>
                <el-table-column prop="isTryStr"
                                 label="是否试看"
                                 align="center"
                                 min-width="103">
                </el-table-column>
                <el-table-column prop="periodStatusStr"
                                 label="状态"
                                 align="center"
                                 width="150">
                </el-table-column>
                <el-table-column prop="name"
                                 label="操作"
                                 align="center"
                                 min-width="180">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   class="black-btn"
                                   v-if="inType!='preview'"
                                   @click="showPutawaylistOnes(scope.row.periodStatus,scope.row.id)">{{scope.row.periodStatus==courseStatus.putaway?"下架":"上架"}}</el-button>                         
                        <!-- v-if="scope.row.periodStatus !== courseStatus.putaway" -->
                        <el-button type="text"
                                   class="black-btn"
                                   v-if="inType!='preview'&&scope.row.periodStatus !== courseStatus.soldOut"
                                   @click="sortPeriod(scope.$index,scope.row.id)">排序</el-button>                                  
                        <el-button type="text"
                                   class="black-btn"
                                   v-if="inType!='preview'"
                                   @click="$router.push(`/course/manageCopy/${$route.params.id}/${scope.row.id}?course-type=${courseInfo.courseType}&isfree=${courseInfo.isFree}&type=${inType}`)">编辑</el-button>
                        <el-button type="text"
                                   class="black-btn"
                                   @click="$router.push(`/course/manageCopy/${$route.params.id}/period-preview/${scope.row.id}?type=${$route.query['type']}`)">预览</el-button>
                                   <!-- v-if="scope.row.periodStatus !== courseStatus.putaway" -->
                        <el-button type="text"
                                   class="black-btn"
                                   v-if="inType!='preview'&&scope.row.periodStatus!=courseStatus.putaway"
                                   @click="detelePeriod(scope.row)"
                                   >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <el-dialog title="提示"
                   :visible.sync="showSortDialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   custom-class="common-confirm-layout">
            <div class="clearfix sort-dialog-content">
                <span class="fl">移动到第</span>
                <el-form ref="sortForm"
                         :model="form"
                         :rules="rules"
                         class="fl form-input">
                    <el-form-item prop="number">
                        <el-input v-model="form.number" 
                                  maxlength="4"
                                  placeholder="请输入顺序"></el-input>
                    </el-form-item>
                </el-form>
                <span class="fl">位</span>
            </div>
            <div slot="footer"
                 class="dialog-footer tc">
                <el-button @click="showSortDialog = false"
                           :disabled="btnLoading">取 消</el-button>
                <el-button type="primary"
                            :disabled="btnLoading"
                           @click="setSortList"
                           :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="更新内容"
                   :visible.sync="showAuditDialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   custom-class="common-confirm-layout">
            <div class="tc audit-content">
                <el-form ref="auditForm"
                         :model="form"
                         :rules="rules">
                    <el-form-item prop="auditContent">
                        <el-input type="textarea"
                                  v-model="form.auditContent"
                                  placeholder="请输入更新描述"
                                  :rows="6"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer"
                 class="dialog-footer tc">
                <el-button @click="showAuditDialog = false"
                           :disabled="btnLoading">取 消</el-button>
                <el-button type="primary"
                           @click="audit"
                           :loading="btnLoading">确 定</el-button>
            </div>
        </el-dialog>        
        <el-dialog title="提示"
                    width="25%"
                   :visible.sync="downcourseListDialog">
            <div style="text-align: center">
                    确定要下架这个课时吗
            </div>
            <div slot="footer"
                 class="dialog-footer tc">
                <el-button @click="downcourse(1)">取 消</el-button>
                <el-button type="primary" @click="downcourse(2,idDoWn)">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog  title="提示"
                     width="25%"
                    :close-on-click-modal='false'
                    :visible.sync="channelDialog">
            <div>
                <el-row>
                    <el-col style="text-align: left">课程上架前是否需要设置课程渠道？如果不设置课程渠道，该课程默认为自有平台课程，用户购买课程后对课程观看的拥有时间是自有渠道设置的时间，默认观看的拥有时间为永久观看。</el-col>
                    <el-col style="text-align: left;margin-top:10px;">如果上架前需要设置课程渠道，请先到<span style="font-weight: bold;">【课程渠道设置】</span>中设置后再上架课程。</el-col>
                    <el-col style="text-align: center;margin-top:20px;">
                        <el-button @click="channelClose(1)">取 消</el-button>
                        <el-button type="primary" @click="channelIsok(2,idDoWn)">继续上架</el-button>                        
                    </el-col>
                </el-row>
            </div>
        </el-dialog>        
    </div>
</template>

<script>
/**
 * const courseStatus = {
    draft: 0,//草稿
    auditing: 1,//审核中
    auditFail: 2,//审核失败
    putaway: 3,//上架
    soldOut: 4,//下架
    schooleditwait:5,//校编辑待审核
    schoolediterroer:6,//校编辑审核失败
    updateWait:7,//更新待审核
    updateError:8 //更新审核失败
}
 */
import courseStatus from "@/utils/courseStatus";
export default {
    data() {
        let validateSort = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入数字"));
            } else if (!/^\d+$/.test(value)) {
                callback(new Error("格式错误"));
            }
            // else if (
            //     Number(value) > this.periodList.length ||
            //     Number(value) <= 0
            // ) {
            //     callback(new Error("范围错误"));
            // }
            callback();
        };
        return {
            isTry: "",
            title: "",
            rules: {
                number: [{ validator: validateSort, trigger: "blur" }],
                auditContent: [
                    {
                        required: true,
                        message: "请输入更新描述",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 200,
                        message: "长度在 1 到 200 个字符",
                        trigger: "blur"
                    }
                ]
            },
            form: {
                number: "",
                auditContent: ""
            },
            periodList: [],
            periodIdList: [],
            courseId: "",
            courseInfo: {},
            showSortDialog: false,
            sortPeriodIndex: null,
            btnLoading: false,
            inType: null,
            showAuditDialog: false,
            periodNumber: 0,
            onlinePeriodNum: 0,
            auditedAndauditing: 0,
            chooseObjId:0,
            periodStatusList:[],
            draftNumber:0,
            downcourseListDialog:false,
            channelDialog:false,
            idDoWn:'',
            idDoWnStatus:'',
            courseStatus

        };
    },
    created() {
        this.courseId = this.$route.params["id"];
        this.inType = this.$route.query["type"];
        /**
         * inType
         * update:更新
         * editor:编辑
         * online-editor：校编辑
         */
        this.getCourseInfo();
        this.getPeriodList();
    },
    methods: {
        channelClose(){
            this.channelDialog = false;
        },
        channelIsok(){
            var self = this;
                // self.$http
                //     .post(self.$server.periodIdUp(self.idDoWn))
                //     .then(res => {  
                //         self.channelDialog = false;
                //         self.getPeriodList();
                //     })
                //     .catch(err => {
                //         console.log(err);
                //     });    
                self.$http
                    .post(self.$server.courseUp(self.courseId))
                    .then(res => {
                        if (res.status === 200) {
                            self.$message({
                                message: "上架课程成功",
                                type: "success"
                            });
                            self.channelDialog = false;
                            self.draftNumber=0;
                            self.$router.push("/courseCopy");
                        }
                    });                           
        },
        //上架
        showPutawaylistOnes(status,id){
            let self = this;
            if(status==self.courseStatus.putaway){
                self.downcourseListDialog = true; 
            }else{
                // self.channelDialog = true;
                self.$http
                    .post(self.$server.periodIdUp(id))
                    .then(res => {  
                        this.getPeriodList();
                    })
                    .catch(err => {
                        console.log(err);
                    });     
            } 
            self.idDoWn = id;  
            self.idDoWnStatus =  status;    
        },
        downcourse(number,id){
            let self = this;
            if(number==1){
                self.downcourseListDialog = false; 
            }else{
                self.$http
                    .post(self.$server.periodIdDown(id))
                    .then(res => { 
                        self.downcourseListDialog = false; 
                        this.getPeriodList();
                    })
                    .catch(err => {
                        self.downcourseListDialog = false; 
                        console.log(err);
                    }); 
            }
        },
        getCourseInfo() {
            let self = this;
            self.$http
                .get(`${this.$server.course}/${self.courseId}`)
                .then(res => { 
                    res.content.bonusRatio =Math.round(res.content.bonusRatio*100);
                    self.courseInfo = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getPeriodList(title = "", isTry = "") {
            let courseId = this.courseId;
            let self = this;
            self.auditedAndauditing =0;
            self.onlinePeriodNum = 0;
            self.$http
                .get(this.$server.periodInfo, {
                    params: {
                        courseId,
                        title,
                        isTry
                    }
                })
                .then(res => {
                    self.periodList = res.content;
                    self.periodIdList = [];
                    for (let i = 0; i < res.content.length; i++) {
                        self.periodIdList.push(res.content[i]["id"]);

                        if (
                            // res.content[i].periodStatus ===
                            //     self.courseStatus.putaway ||
                            // res.content[i].periodStatus ===
                            //     self.courseStatus.auditing
                                res.content[i].periodStatus ===
                                self.courseStatus.putaway                           
                        ) {
                            self.auditedAndauditing++; // 审核中和审核成功的课时 
                            if (
                                res.content[i].periodStatus ===
                                self.courseStatus.putaway
                            ) {
                                self.onlinePeriodNum++; // 已经上线的课时数量
                            }
                        }else if(res.content[i].periodStatus ===
                                self.courseStatus.draft){
                                    self.draftNumber++;//当前的草稿课时
                        }
                    }
                    // 首次请求获取列表总数
                    if (!title && isTry==="") {
                        self.periodNumber = self.periodIdList.length;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        detelePeriod(item) {
            this.$confirm("是否要删除这个课时内容", "温馨提示", {
                confirmButtonText: "取消",
                cancelButtonText: "确定",
                customClass: "common-confirm-layout",
                confirmButtonClass: "emphasize-confirm",
                cancelButtonClass: "emphasize-confirm",
                closeOnClickModal:false,
                type: "warning",
                showClose:false
            })
                .then(() => {})
                .catch(() => {
                    this.$http
                        .delete(`${this.$server.periodInfo}${item.id}`)
                        .then(res => {
                            if (res.status === 200) {
                                this.$message({
                                    message: "删除成功，正在获取最新数据",
                                    type: "success"
                                });
                                this.getPeriodList();
                            }
                        });
                });
        },
        sortPeriod(index,obg) {
            this.chooseObjId = obg;
            this.showSortDialog = true;
            this.sortPeriodIndex = index;
            this.form.number = "";
        },
        setSortList() {
            this.$refs["sortForm"].validate(valid => {
                if (valid) {
                    let self = this;
                    if (self.sortPeriodIndex === Number(self.form.number) - 1) {
                        self.showSortDialog = false;
                        return;
                    }
                    self.btnLoading = true;
                    self.sortIdList(
                        self.sortPeriodIndex,
                        Number(self.form.number) - 1
                    );

                    // periodId	integer	是	要排序的课时ID		
                    // sort	integer	是	要排序的序号		
                    // ids	string	是	所有课时 按排序顺序组成数组，在转成字符串
                    self.$http
                        .post(this.$server.periodSort,
                            {
                                ids: JSON.stringify(self.periodIdList),
                                sort:Number(self.form.number),
                                periodId:self.chooseObjId
                            }
                        )
                        .then(res => {
                            if (res.status === 200) {
                                self.$message({
                                    message: "排序成功，正在获取最新数据",
                                    type: "success",
                                    onClose() {
                                        self.btnLoading = false;
                                        self.showSortDialog = false;
                                    }
                                });
                                self.getPeriodList();
                            } else {
                                self.btnLoading = false;
                            }
                        }).catch(function(error) {
                            self.btnLoading = false;
                        });
                    self.$refs["sortForm"].clearValidate();
                } else {
                    return false;
                }
            });
        },
        sortIdList(index, tindex) {
            // index是旧下标，tindex是新下标。
            if (index > tindex) {
                this.periodIdList.splice(tindex, 0, this.periodIdList[index]);
                this.periodIdList.splice(index + 1, 1);
            } else {
                this.periodIdList.splice(
                    tindex + 1,
                    0,
                    this.periodIdList[index]
                );
                this.periodIdList.splice(index, 1);
            }
        },
        //上架课时
        showPutawayContent(){
            var self=this;
            // if (!Number(self.draftNumber)>0) {
            //     this.$message.error("需要上架的课时数不能为0");
            //     return;
            // }else{
                self.channelDialog = true;
                // self.$http
                //     .post(self.$server.courseUp(self.courseId))
                //     .then(res => {
                //         if (res.status === 200) {
                //             self.$message({
                //                 message: "上架课程成功",
                //                 type: "success"
                //             });
                //             self.draftNumber=0;
                //              self.$router.push("/courseCopy");
                //         }
                //     });                
            // }
        },
        showAuditContent() {
            if (this.periodNumber == 0) {
                this.$message.error("提交审核的课时数不能为0");
                return;
            }
            this.showAuditDialog = true;
        },
        audit() {
            let self = this;
            // var statesEditor = 0;
            //  * inType
            //  * update:更新
            //  * editor:编辑
            //  * online-editor：校编辑            
            // switch (self.inType) {
            //     case 'update':
            //         statesEditor = 2;
            //         break;
            //     case 'editor':
            //         statesEditor = 3;
            //         break;
            //     case 'online-editor':
            //         statesEditor = 1;
            //         break;                                
            //     default:
            //         break;
            // }
            this.$refs["auditForm"].validate(valid => {
                if (valid) {
                    self.$http
                        .put(
                            this.$server.courseSubmitAudit(self.courseId),
                            {
                                msg: self.form.auditContent,
                                transformRequest: true,
                                submitType:self.courseInfo.editStatus
                            },
                            {
                                headers: {
                                    "Content-Type":
                                        "application/json;charset=utf-8"
                                }
                            }
                        )
                        .then(res => {
                            if (res.status === 200) {
                                self.$message({
                                    message:
                                        "课程提交审核成功，即将跳转到课程列表",
                                    type: "success"
                                });
                                setTimeout(() => {
                                    self.$router.push("/course");
                                }, 300);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.common-shadow {
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    background: #fff;
    margin-bottom: 20px;
}
.base-info {
    .crumbs-list-common {
        padding: 28px 20px 18px;
        font-weight: 500;
    }
}
.audit-fail {
    margin: 2px 30px 8px 20px;
    width: auto;
    background: #f7e9ea;
    color: #b4272d;
}
.info-wrap {
    display: flex;
    margin-top: 12px;
    color: rgba(154, 154, 154, 1);
    .course-img {
        width: 130px;
        height: 79px;
        margin: 0 20px 30px 23px;
        border-radius: 5px;
        overflow: hidden;
    }
    .course-info {
        flex: 1;
        font-size: 14px;
        color: #9a9a9a;
        .course-title {
            color: rgba(51, 51, 51, 1);
            margin: 13px 0 25px;
        }
    }
    .course-handle {
        width: 200px;
        padding-right: 60px;
        .handle-btn {
            font-weight: bold;
            color: rgba(58, 57, 62, 1);
        }
        .course-ratio {
            margin: 15px 0 18px;
        }
    }
}
.period-filtrate {
    padding: 19px 30px 38px 24px;
    .module-title {
        font-size: 18px;
        line-height: 40px;
        font-weight: 400;
        color: #384156;
        margin-bottom: 15px;
    }
    .module-handle {
        .red-btn {
            margin-left: 30px;
            width: 100px;
            border-radius: 2px;
            font-size: 16px;
            padding: 0;
        }
    }
    .filtrate-form {
        .sn {
            width: 240px;
            margin-right: 40px;
            position: relative;
            .search-btn {
                position: absolute;
                font-size: 20px;
                top: 12px;
                right: 10px;
                cursor: pointer;
                background: #fff;
            }
        }
        .is-free {
            width: 140px;
        }
    }
}
.sort-dialog-content {
    font-size: 16px;
    line-height: 40px;
    color: rgba(106, 106, 106, 1);
    padding: 27px 0 10px;
    margin: 0 auto;
    width: 240px;
    .form-input {
        width: 120px;
        border-radius: 2px;
        margin: 0 20px;
    }
}
.audit-content {
    width: 580px;
    height: 150px;
    margin: 0 auto;
}
</style>
<style lang="scss">
.course-manage-copy {
    .el-table th.list-header-layout-bg {
        height: 60px;
    }
    .audit-fail {
        padding: 11px 16px;
        .el-alert__title {
            font-size: 16px;
        }
        .el-alert__content {
            padding: 0 15px 0 0;
            width: 100%;
            text-align: center;
        }
        .el-alert__closebtn {
            font-size: 16px;
            color: #b4272d;
            font-weight: 900;
        }
    }
}
</style>

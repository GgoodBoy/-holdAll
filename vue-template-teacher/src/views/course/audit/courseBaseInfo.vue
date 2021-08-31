<template>
    <div class="page-wrap">
        <breadcrumb :menuList ='titleList' class="lMarginBO20"></breadcrumb>
        <auditPlan v-on:linkUpdate="linkUpdate" :content="form.lastSubmitRemark"/>
        <alertHint v-show="formCourseStatus&&form.lastSubmitRemark.length>0" class="update-tip" :content="form.lastSubmitRemark"/>
        <el-form ref="form"
                 :model="form"
                 label-width="90px"
                 label-position="left"
                 class="page-content">
            <ul>
                <li class="form-module">
                    <h3 class="module-title">基本信息</h3>
                    <section class="module-details">
                        <el-form-item label="课程名称">
                            <el-input v-model="form.title"
                                      class="default-input"
                                      :disabled="disabled"
                                      placeholder="请填写一句话简介"></el-input>
                            <span class="form-hint"
                                  :class="form.title.length>20?'red-text':''">{{form.title.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程简介">
                            <el-input v-model="form.intro"
                                      class="default-input"
                                      :disabled="disabled"
                                      placeholder="一句话描述课程核心"></el-input>
                            <span class="form-hint"
                                  :class="form.intro.length>20?'red-text':''">{{form.intro.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程类型">
                            <el-radio-group v-model="form.courseType" :disabled="disabled">
                                <el-radio v-for="(item,index) in courseTypeList" class="course-type" :key="index"
                                          :label="item.value">{{item.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="课程封面">
                            <img :src="form.surfacePlot" class="surface-plot" @click="openImg"/>
                        </el-form-item>
                        <el-form-item label="课程介绍">
                             <div v-html="form.introduce" v-if="disabled" class="introduce-box"></div>
                             <div v-else>
                                 <!-- <my-editor label="brief"
                                            class="ueditor-wrap"
                                            maximumWords="2000"
                                            :handleChange="handleBrief"
                                 ></my-editor> -->
                                <div class="my-course-editor">
                                    <Editor v-model="form.introduce" :maxLength="2000"/>
                                </div>                                  
                             </div>
                        </el-form-item>
                        <el-form-item label="课程讲师">
                            <lectureTeacher v-for="item,i in teacherInfoList"
                                            :key="i"
                                            :disabled="item.disabled"
                                            :info="item"
                                            @cancelCheck="cancelTeachChecked" />
                        </el-form-item>
                        <el-form-item label="课时数">
                            <el-input v-model.number="form.planPeriodNum"
                                      class="default-input"
                                      :disabled="disabled"
                                      placeholder="请填写课时数量"></el-input>
                            <span class="form-hint">1~99</span>
                        </el-form-item>
                        <el-form-item label="课程分类">
                            <el-select clearable
                                       class="course-classify form-sort"
                                       v-model="form.classifyId"
                                       :disabled="disabled"
                                       placeholder="选择分类">
                                <el-option v-for="item,i in classifyList"
                                           :key="i"
                                           :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </section>
                </li>
                <li class="form-module ">
                    <p class="module-title">
                        价格信息
                    </p>
                    <section class="module-details">
                        <el-form-item label="课程价格">
                            <div class="price-type clearfix">
                                <el-checkbox v-model="form.isFree==0"
                                          :label="0" :disabled="disabled">收费</el-checkbox>
                                <span>
                                    <el-form-item style="display:inline-block;padding-left:20px;">
                                        <el-input v-model.number="form.sellingPrice"
                                                  class="price-input tc"
                                                  :disabled="disabled"
                                                  placeholder="0~10000"></el-input>
                                    </el-form-item>
                                    <span class="red-text">夫子币</span>
                                </span>
                                <span style="margin-left:120px">
                                    划价
                                    <el-form-item style="display:inline-block;padding-left:20px">
                                        <el-input v-model.number="form.originalPrice"
                                                  class="original-price tc"
                                                  :disabled="disabled"
                                                  placeholder="0~10000"></el-input>
                                    </el-form-item>
                                    <span class="red-text">夫子币</span>
                                </span>

                            </div>
                            <div class="price-type">
                                <el-radio v-model="form.isFree"
                                        :disabled="disabled"
                                        :label="1">免费</el-radio>
                            </div>
                        </el-form-item>
                        <el-form-item label="老师分成">
                            <el-input v-model.number="form.bonusRatio"
                                      class="form-sort"
                                      :disabled="disabled"
                                      placeholder="输入老师分成"></el-input>
                                      <span style="font-size:20px; color:#9D0E00; font-weight:bold">%</span>
                        </el-form-item>
                        <el-form-item label="提现老师">
                            <div class="clearfix">
                                <depositTeacher v-for="item,i in commissionTeacherList"
                                                :key="i"
                                                :type="true"
                                                :info="item"
                                                @cancelCheck="cancelCommissionChecked"
                                                class="checked-commission" />
                            </div>
                        </el-form-item>
                    </section>
                </li>
            </ul>
            <div class="btns-area" v-if="!previewFlag">
                <el-button plain class="my-normal-btn" @click="$router.go(-1)">取消</el-button>
                <el-button type="primary" class="my-normal-btn" @click="next">下一步</el-button>
            </div>
        </el-form>
        <Transition name="el-fade-in">
            <img-box :src="form.surfacePlot" v-on:hidden="closeImg" v-show="scaleFlag"></img-box>
        </Transition>

    </div>
</template>

<script>
import auditPlan from "./components/auditPlan";
import alertHint from '@/components/alert';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import lectureTeacher from "../create/components/lectureTeacher.vue";
import depositTeacher from "./../create/components/depositTeacher";
// import myEditor from "@/components/editor/editor";
import ImgBox from './components/ImgBox.vue'
export default {
    data() {
        return {
            form: {
                category: "",
                title: "",
                intro: "",
                courseType: "",
                surfacePlot: "",
                planPeriodNum: "",
                isFree: "",
                sellingPrice: "",
                originalPrice: "",
                bonusTeacherId: "",
                bonusRatio: "0",
                lastSubmitRemark: "",
                introduce: "",
                teacherIds: ""
            },
            teacherInfoList: [],
            courseTypeList:[],
            classifyList: [],
            commissionTeacherList: [],
            btnLoading: false,
            disabled:true,
            previewFlag:true,
            scaleFlag:false,
            formCourseStatus:false,
            titleList:[
                        {
                            name:'课程',
                            pathInfo:'/course/audit'
                        },
                        {
                            name:'审核课程',
                            pathInfo:'/course/audit'
                        },
                        {
                            name:'新增预览',
                            pathInfo:''
                        }
                ],            
        };
    },
    components: { 
        auditPlan, 
        alertHint, 
        lectureTeacher, 
        depositTeacher ,
        // myEditor,
        ImgBox,
        breadcrumb
        },
    created(){
      let courseId = this.$route.query.id;
      let state = this.$route.query.state;
      this.previewFlag = state ==0?true:false;
      this.getBaseInfo(courseId)
      this.getConstant();
    },
    methods: {
        cancelCommissionChecked(id) {
            this.$delete(this.commissionTeacherList, id);
        },
        /**
         * 获取课程详情
         */
        getBaseInfo(id){
            this.$http
                .get(`${this.$server.course}/${id}`)
                .then(res => {
                    // if(res.content.courseStatus!=3){
                        this.formCourseStatus = true;
                    // }else{
                    //     this.formCourseStatus = false;
                    // }
                    
                this.courseInfo = res.content;
                this.form = Object.assign(this.form, res.content);
                if(this.disabled){
                    this.form.bonusRatio = Math.round((this.form.bonusRatio*100))
                }                
                this.teacherInfoList = res.content.teacherInfoList||[ ];
                let state = this.$route.query.state;
                this.teacherInfoList.forEach(item=>{
                    item.disabled = true;
                })
                 this.commissionTeacherList = res.content.bonusTeacherInfoList;
            })
        },
        /**
         * 获取课程常量
         */
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                this.courseTypeList = res.content.courseTypeMap;
                // this.classifyList = res.content.courseCategoryList.items;
                this.classifyList = res.content.courseCategoryList;
            })
        .catch(err => {
                console.log(err);
            });
        },
        /**
         * 富文本内容获取
         */
        // handleBrief(data) {
        //     this.form.introduce = data.html;
        //     if(data.count>0) {
        //         this.$refs["form"].clearValidate(['introduce'])
        //     }
        // },
        linkUpdate(flag){
            if(flag.id==2){
                let query = this.$route.query
                sessionStorage["periodListIndo"] = flag.content;
                this.$router.push({path:'/course/audit/period-list',query})
            }
        },
        next(){
            let query = this.$route.query
            this.$router.push({path:'/course/audit/period-list',query})
        },
        cancelTeachChecked(){

        },
        openImg(){
            this.scaleFlag = true;
        },
        closeImg(){
            this.scaleFlag = false;
        },
    }
};
</script>
<style lang="scss" scoped>
.page-content {
    margin-top: 20px;
    box-shadow: 0px 3px 9px 0px rgba(237, 241, 247, 1);
    border-radius: 5px;
}
.default-input {
    width: 500px;
}
.form-module {
    border-radius: 5px;
    box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
    background: #fff;
    &:not(:first-of-type) {
        margin-top: 20px;
    }
    .module-title {
        height: 40px;
        background: rgba(246, 246, 248, 1);
        line-height: 40px;
        padding-left: 15px;
        font-size: 14px;
        color: rgba(56, 65, 86, 1);
    }
    .module-details {
        padding: 20px;
        width: 1160px;
    }
    .course-type {
        display: block;
        margin: 5px 0 10px;
    }
    .form-sort {
        width: 110px;
        margin-right: 20px;
    }
    .form-hint {
        font-size: 14px;
        color: #aaaaaa;
        margin-left: 20px;
        &.synopsis-hint {
            display: block;
            margin-left: 359px;
        }
    }
    .price-type {
        font-size: 14px;
    }
    .price-input {
        width: 110px;
        margin: 0 17px 0 0;
    }
    .original-price {
        width: 110px;
        margin: 0 20px 0 0;
    }
    .red-text {
        color: rgba(158, 14, 0, 1);
    }
    .checked-commission {
        border: 1px solid #d7d7d7;
        margin: 20px 20px 20px 0;
    }
}
.save-btn {
    margin: 80px auto 130px;
    width: 200px;
}
.update-tip {
    background: rgba(255, 126, 131, 0.5);
    box-shadow: 0px 3px 9px 0px rgba(237, 241, 247, 1);
    border-radius: 5px;
    color: rgba(247, 59, 66, 1);
    font-size: 16px;
    margin-top: 20px;
}
    .surface-plot{
        max-width: 800px;
    }
    .introduce-box{
        display: inline-block;
        vertical-align: middle;
    }
    .lecture-wrap{
        margin-top:10px;
    }
    .btns-area{
        text-align: center;
        margin:30px 0;
        .my-normal-btn:first-child{
            margin-right: 50px;
        }
    }
.my-normal-btn{
    padding: 12px 0px;
    width: 120px;
}
</style>

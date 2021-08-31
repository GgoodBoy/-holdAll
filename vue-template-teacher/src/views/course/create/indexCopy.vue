<template>
    <div class="page-wrap create-course-baseinfo hide-required-asterisk">
        <breadcrumb :menuList ='titleList' class="lMarginBO20"></breadcrumb>
        <el-form ref="form"
                 :model="form"
                 :rules="rules"
                 :disabled="disabledVal=='disabledtrue'?true:false"
                 label-width="90px"
                 label-position="left">
            <ul>
                <li class="form-module">
                    <h3 class="module-title">
                        基本信息
                    </h3>
                    <section class="module-details">
                        <el-form-item label="课程名称"
                                      prop="title">
                            <el-input v-model="form.title"
                                      class="default-input"
                                      placeholder="新增课程名称" autofocus="autofocus" ref="inputs"></el-input>
                            <span class="form-hint"
                                  :class="form.title.length>20?'red-text':''">{{form.title.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程简介"
                                      prop="intro">
                            <el-input v-model="form.intro"
                                      class="default-input"
                                      placeholder="一句话描述课程核心"></el-input>
                            <span class="form-hint"
                                  :class="form.intro.length>20?'red-text':''">{{form.intro.length || 0}}/20</span>
                        </el-form-item>
                        <el-form-item label="课程类型"
                                      prop="courseType">
                            <p v-show="inType!=='editor'" class="form-hint">类型在校编辑时不可更改</p>

                            <el-radio-group v-model="form.courseType" @change="selecttCourseType">
                                <el-radio v-for="(item,i) in pageConstant.courseTypeMap" :key="i"
                                          class="course-type"
                                          :label="item.value" 
                                          :disabled="canEditorPrice">{{ item.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="课程封面"
                                      prop="surfacePlot">
                            <!-- surfacePlot -->
                            <p class="form-hint">750*420像素或16:9，支持PNG、JPG格式，小于1M</p>
                            <el-upload class="avatar-uploader"
                                       :action="action"
                                       :headers="commonHeader"
                                       :before-upload="beforeUpload"
                                       :show-file-list="false"
                                       :on-error="uploadFileError"
                                       :on-success="uploadFileSuccess">
                                <img v-if="form.surfacePlot"
                                     :src="form.surfacePlot"
                                     class="avatar">
                                <i v-else
                                   class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="课程知识点" v-if="locaListStr==1"
                                    prop="knowledge">
                                    <div class="addKonked" @click="dialogVideoBut">添加知识点</div>
                                    <div class="knowledListBox">
                                        <div class="knowledCss" v-for="(item,i) in keowedList" :key="i">
                                            <div class="imgsdiv">
                                                <img class="img1" :src="item.videoImage"/>
                                                <img class="img2" :src="player_btn" @click="previewVideo(item)"/>
                                            </div>
                                            <div class="divText">{{item.title}}</div>
                                            <i class="el-icon-circle-close" @click="removKnoweds(item)"></i>
                                        </div>
                                    </div>     
                                    <p class="knowledText" v-show="errorLocaListStr">最多选择100个短视频;</p>            
                        </el-form-item>                        
                        <el-form-item label="课程介绍"
                                      prop="introduce">
                                      <div class="my-course-editor">
                                          <Editor v-model="form.introduce"/>
                                      </div>
                                      
                            <!-- <my-editor
                                       label="brief"
                                       class="ueditor-wrap"
                                       maximumWords="2000"
                                       :content="editorContent"
                                       :handleChange="handleBrief"></my-editor> -->
                                       <div class="editorStylecss" v-if="disabledVal=='disabledtrue'?true:false"></div>
                        </el-form-item>
                        <el-form-item label="课程讲师"
                                      prop="teacherList">
                            <el-button size="mini"
                                       type="primary"
                                       class="check-teacher"
                                       @click="showTeacherCheckDialog('teach')">选择老师</el-button>
                            <!-- <lectureTeacher v-for="item,i in teachLectureList"
                                            :key="i"
                                            :info="item"
                                            @cancelCheck="cancelTeachChecked" /> -->
                            <lectureTeacher v-for="(item,i) in chooseteachersOne"
                                            :key="i"
                                            :info="item"
                                            @cancelCheck="cancelTeachChecked" />                                            
                        </el-form-item>
                        <el-form-item label="课时数"
                                      prop="planPeriodNum">
                            <el-input v-model.number="form.planPeriodNum"
                                      class="default-input"
                                      placeholder="请填写课时数量"></el-input>
                            <span class="form-hint">1-9999</span>
                        </el-form-item>
                        <el-form-item label="课程分类">
                            <div>
                                <el-radio-group :disabled="(inType=='draft'||inType==undefined)?false:true" v-model="form.radioMyType" @change="selectRadiotype">
                                    <el-radio :label="1">成人分类</el-radio>
                                    <el-radio :label="2">少儿分类</el-radio>
                                </el-radio-group>
                                <span class="form-hint">课程只能属于一个分类，课程分类在编辑时不可更换</span>                                
                            </div>  
                            <div style="display: -webkit-inline-box;">
                                <el-form-item prop="categoryOne" v-if="(form.radioMyType==1)?true:false">
                                    <!-- :disabled="(form.radioMyType==1&&(inType=='draft'||inType==undefined))?false:true" -->
                                    <el-select clearable
                                            class="course-classify form-sort"
                                            v-model="form.categoryOne"
                                            @change="parentsSelect(1)"
                                            :disabled="(form.radioMyType==1)?false:true"
                                            placeholder="选择分类">
                                        <el-option v-for="(item,i) in (classifyList.manClassifies)"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="categoryTwo" v-if="(form.radioMyType==2)?true:false">
                                    <!-- :disabled="(form.radioMyType==2&&(inType=='draft'||inType==undefined))?false:true" -->
                                    <el-select clearable
                                            class="course-classify form-sort"
                                            v-model="form.categoryTwo"
                                            @change="parentsSelect(2)"
                                            :disabled="(form.radioMyType==2)?false:true"
                                            placeholder="选择分类">
                                        <el-option v-for="(item,i) in (classifyList.childClassifies)"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.id"></el-option>
                                    </el-select>                                
                                </el-form-item> 
                                <el-form-item>
                                    <div class="selectListDiv">
                                        <div class="oneDiv"  @click="selectTwoClassilyEven(selectBool)">选择二级分类</div>
                                        <div class="twoDiv" id="twoDivId" v-show="selectBool">
                                            <el-checkbox-group :max="3" v-model="form.childrenClassifyIds" @change="listChangeData">
                                                <el-checkbox class="checkMycss" style="display:block;" :label="items.id" v-for="(items,i) in checkboxList" :key="i">{{items.name}}</el-checkbox>
                                            </el-checkbox-group>                                            
                                        </div>
                                        <p class="p1">二级分类最多选择3个</p>
                                    </div>                               
                                </el-form-item>                     
                            </div>                                                                                                         
                            <!-- <el-button type="text"
                                       class="classify-utils"
                                       @click.native="createClassify">新建</el-button>
                            <el-button type="text"
                                       class="classify-utils"
                                       @click="getConstant">刷新</el-button> -->
                            <div class="selectListlayout">
                                <div class="layoutDiv" v-for="(items,i) in checkboxSelectList" :key="i">
                                    <span>{{items.name}}</span>
                                    <i class="el-icon-circle-close" @click="removeCheckboxSelectData(items,i)"></i>
                                </div>
                            </div>
                        </el-form-item>
                    </section>
                </li>
                <li class="form-module ">
                    <h3 class="module-title">
                        价格信息
                    </h3>
                    <section class="module-details">
                        <el-form-item label="课程价格"
                                      prop="isFree">
                            <div class="price-type clearfix price-type-box">
                                <div>
                                    <el-radio v-model="form.isFree"
                                            @change="valiPrice"
                                            :label="0"
                                            :disabled="canEditorPrice">收费</el-radio>                                    
                                </div>
                                <div style='margin-left:120px'>
                                    <div class="bottomPx">
                                        <div class='firstBox'>划价</div>
                                        <el-form-item prop="originalPrice"
                                                    style="display:inline-block;padding-left:20px;">
                                            <el-input v-model="form.originalPrice"
                                                    class="original-price tc"
                                                    :disabled="form.isFree!=0"
                                                    placeholder="0.1~10000"></el-input>
                                        </el-form-item>
                                        <span class="red-text requsetCss">夫子币</span>
                                    </div>
                                    <div class="bottomPx">
                                        <div class='firstBox'>售价</div>
                                        <el-form-item prop="sellingPrice"
                                                    style="display:inline-block;padding-left:20px;">
                                            <el-input v-model="form.sellingPrice"
                                                    class="price-input tc"
                                                    :disabled="form.isFree!=0"
                                                    placeholder="0.1~10000"></el-input>
                                        </el-form-item>
                                        <span class="red-text requsetCss">夫子币</span>
                                        <span class="red-text-tips">课程的实际销售价格(不含活动)</span>
                                    </div>
                                    <div class="bottomPx">
                                        <div class='firstBox'>7天价</div>
                                        <el-form-item prop="sellingPriceSevenDays"
                                                    style="display:inline-block;padding-left:20px;">
                                            <el-input v-model="form.sellingPriceSevenDays"
                                                    class="price-input tc"
                                                    :disabled="form.isFree!=0"
                                                    placeholder="0.1~10000"></el-input>
                                        </el-form-item>
                                        <span class="red-text">夫子币</span>
                                        <span class="red-text-tips">课程销售后用户只有7天有效观看期</span>
                                    </div>
                                    <div class="bottomPx">
                                        <div class='firstBox'>30天价</div>
                                        <el-form-item prop="sellingPriceThirtyDays"
                                                    style="display:inline-block;padding-left:20px;">
                                            <el-input v-model="form.sellingPriceThirtyDays"
                                                    class="price-input tc"
                                                    :disabled="form.isFree!=0"
                                                    placeholder="0.1~10000"></el-input>
                                        </el-form-item>
                                        <span class="red-text">夫子币</span>
                                        <span class="red-text-tips">课程销售后用户只有30天有效观看期</span>
                                    </div>
                                </div>
                            </div>
                            <div class="price-type">
                                <el-radio v-model="form.isFree"
                                          @change="valiPrice"
                                          :label="1"
                                          :disabled="canEditorPrice">免费</el-radio>
                            </div>
                            <div style="color:#ccc">注:课程在限时折扣活动中时，价格不可编辑</div>
                        </el-form-item>
                        <el-form-item label="老师分成"
                                      prop="bonusRatio" v-show="form.isFree==0">

                            <el-input v-model.number="form.bonusRatio"
                                      class="form-sort"
                                      placeholder="输入老师分成"></el-input>
                                      <span style="font-size:20px; color:#9D0E00; font-weight:bold">%</span>
                        </el-form-item>
                        <el-form-item label="提现老师"
                                      prop="bonusTeacherId" v-show="form.isFree==0">
                            <!-- bonusTeacherId -->
                            <el-button size="mini"
                                       type="primary"
                                       class="check-teacher"
                                       @click="showTeacherCheckDialog('commission')">选择老师</el-button>
                            <div class="clearfix">
                                <!-- <depositTeacher v-for="item,i in commissionTeacherList"
                                                :key="i"
                                                :type="true"
                                                :info="item"
                                                @cancelCheck="cancelCommissionChecked"
                                                class="checked-commission" /> -->
                            <depositTeacher v-for="(item,i) in chooseteachersTwo"
                                                        :key="i"
                                                        :type="true"
                                                        :info="item"
                                                        @cancelCheck="cancelCommissionChecked"
                                                        class="checked-commission" />                                                
                            </div>
                        </el-form-item>
                    </section>
                </li>
                <el-row :gutter="20">
                    <el-col :span="4" :offset="courseId==''?8:6" class="lCenter-r">
                        <el-button type="text"
                                class="save-btnNo"
                                v-if="disabledVal=='disabledtrue'?false:true"
                                @click="removeSave">取消</el-button>
                    </el-col>
                    <el-col :span="4" v-if="courseId==''?true:false">
                        <el-button type="danger"
                                class="save-btn"
                                @click="save('')"
                                :loading="btnLoading" v-if="disabledVal=='disabledtrue'?false:true">保存</el-button> 
                    </el-col>      
                    <el-col :span="4" v-if="courseId!=''?true:false">   
                        <el-button type="danger"
                                class="save-btn"
                                @click="save('course')"
                                :loading="btnLoading" v-if="disabledVal=='disabledtrue'?false:true">更新</el-button>
                    </el-col>    
                    <el-col :span="4" v-if="courseId!=''?true:false">
                        <el-button type="danger"
                                class="save-btn"
                                @click="save('period')"
                                :loading="btnLoading" v-if="disabledVal=='disabledtrue'?false:true">更新并返回</el-button>
                    </el-col>                                                   
                </el-row>
            </ul>
        </el-form>
        <el-row>
            <el-col class="lCenter-r"> 
                    <el-button type="text"
                        class="save-btnNo"
                        v-if="disabledVal=='disabledtrue'?true:false"
                        @click="removePreview">返回</el-button>
            </el-col>
        </el-row>        
        <el-dialog :visible.sync="showCheckTeacher"
                   custom-class="common-dialog-header-bg"
                   width="660px"
                   title="老师库"
                   :show-close="false"
                   style="margin-top: -5vh;">
            <checkTeacherDialog v-if="showCheckTeacher"
                                :typeStates="typeChoose"
                                :teachLectureListIds="teachLectureListId"
                                @setLecturer="showLecturer"
                                :list="defaultCheckTeacher"
                                :teacherCheckDialogType="teacherCheckDialogType" />
        </el-dialog>
        <el-dialog
        title="提示"
        :visible.sync="channelDelDialogVisible"
        width="30%"
        > 
            <el-row class="lLine30">
                <el-col class="lCenter-r">课程已经创建，上线课程还需要添加课时哟~</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="courseOkOrNoEven(false,'')">知道了</el-button>
                    <el-button class="redBackColor butColorF" @click="courseOkOrNoEven(true,'')">添加课时</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>  
        <el-dialog
            title="提示"
            :visible.sync="leaveDialogVisible"
            width="30%"
            >
            <span>您有未保存的信息，离开后会丢失，确认要离开吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="leaveDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="leavePage">确 定</el-button>
            </span>
        </el-dialog>    
        <el-dialog
            title="短视频库"
            :visible.sync="knowledgeDialogBox"
            :close-on-click-modal='false'
            width="750px"
            class="knowledgeCss"
            >
            <div>
                <!-- 搜索 -->
                <div>
                    <el-input
                        placeholder="输入标题搜索"
                        suffix-icon="el-icon-search"
                        style="width:40%;"
                        v-model.trim="inputText">
                    </el-input>   
                    <el-button class="red-btn" @click="search">查询</el-button>              
                </div>
                <!-- 列表 -->
                <div>
                </div>
                <ul class="KnodeBoxListBox clearfix">
                    <el-checkbox-group v-model="checkedVideo"
                                    @change="handleCheckedVideoChange">

                        <div class="video-item fl"
                            v-for="(item,i) in pageData.items" :key="i">
                            <div class="clearfix preview">
                                <div class="fl video-img">
                                    <img :src="item.videoImage"
                                        class="img100"
                                        alt="">
                                </div>
                                <div class="fl video-info">
                                    <h4 class="video-name text-ellipsis"
                                        :title="item.title">{{ item.title}}</h4>
                                    <div class="video-synopsis clearfix">
                                        <span class="fl">{{ item.fileSize }}</span>
                                        <span class="fr">{{item.duration | millisecondToDate}}</span>
                                    </div>
                                </div>
                            </div>
                            <el-checkbox :label="item.id" class="check-status">
                                <div class="check-status"></div>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </ul>                
                <!-- 分页 -->
                <div class="paginationCss">
                    <el-pagination
                        background
                        :page-size="10"
                        @current-change="pageCurrentChange"
                        layout="prev, pager, next"
                        :total="pageData.totalNum">
                        </el-pagination>
                </div>
                <!-- 确定按钮 -->
                <div>
                    <el-button class="red-btn isok" @click="searchIsOK">确定</el-button>
                </div>
            </div>
        </el-dialog>   
        <el-dialog title="视频预览"
                   custom-class="common-dialog-header-bg"
                   :visible.sync="previewDialogVisible"
                   :close-on-click-modal="false"
                   width="660px">
                    <!-- :vid="playingItem.vid" -->
            <playVideo v-if="previewDialogVisible"
                       :vid="playingItem.id"
                       :playType="'video'"
                       type="sts" />
        </el-dialog>               
    </div>
</template>

<script>
// import myEditor from "@/components/editor/editor";
import lectureTeacher from "./components/lectureTeacher";
import depositTeacher from "./components/depositTeacher";
import checkTeacherDialog from "./components/checkTeacherDialog";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseStatus from "@/utils/courseStatus"
import { getToken } from '@/utils/auth';
import playVideo from "@/components/playVideo";
import loginBg from './../../../assets/images/login-bg.jpg';
import player_btn from './../../../assets/images/player_btn.png';
export default {
    data() {
        const self = this;
        let valiTeacherIds = (rule, value, callback) => {
            if (JSON.stringify(this.teachLectureList) === "{}") {
                callback(new Error("请选择授课教师"));
            }else{
                callback();
            } 
        };        
        let valiNumber = (rule, value, callback) => {
            value = value + "";
            switch (rule.fullField) {
                case "planPeriodNum":
                    if (value === "") {
                        callback(new Error("课时数不能为空"));
                        break;
                    } else if (!/^\d+$/.test(value)) {
                        callback(new Error("格式错误"));
                        break;
                    } 
                    else if (Number(value) < 1 || Number(value) >= 10000) {
                        callback(new Error("课时数范围错误1~9999"));
                    }
                    self.form.planPeriodNum = parseInt(value);
                    break;
                case "bonusRatio":
                    if (value === "") {
                        callback(new Error("分红比例不能为空"));
                    } else if (value === "0" || value === 0) {
                        callback();
                    } else if (! /^([1-9]|[1-8][0-9]|90)$/.test(value)){
                        callback(new Error("请输入小于等于90的整数。"))
                    }else {
                        callback(); 
                    }
                    break;
                case "sellingPrice":
                    if (self.form.isFree === 0) {
                        if (value === "") {
                            callback(new Error("售价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) > 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.form.originalPrice!==''&&Number(value)>self.form.originalPrice){
                            callback(new Error("价格需要小于划价"));
                        }else if((self.form.sellingPriceSevenDays||self.form.sellingPriceThirtyDays)&&(Number(value)==Number(self.form.sellingPriceSevenDays)||Number(value)<Number(self.form.sellingPriceSevenDays)||Number(value)<Number(self.form.sellingPriceThirtyDays)||Number(value)==Number(self.form.sellingPriceThirtyDays))){
                            callback(new Error("价格需要大于7天和30天价格"));
                        }
                    }
                    break;
                case "originalPrice":
                    if (self.form.isFree === 0) {
                        if (value === "") {
                            callback(new Error("划价不能为空"));
                        } else if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        } else if (
                            Number(value) < 0.1 ||
                            Number(value) >= 10000.01
                        ) {
                            callback(new Error("格式错误(0.1~10000)"));
                        }else if(self.form.sellingPrice!==''&&Number(value)<Number(this.form.sellingPrice)){
                             callback(new Error("划价需要大于价格"));
                        }
                    }
                    break;
                case "sellingPriceSevenDays":
                    if (self.form.isFree === 0) {
                        // if (value === "") {
                        //     callback(new Error("售价不能为空"));
                        // } else 
                        if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        }else if(typeof value=="string"&&value==='0'){
                            callback(new Error("7天价格不能为0"));
                        } 
                        // else if (
                        //     Number(value) < 0.1 ||
                        //     Number(value) > 10000.01
                        // ) {
                        //     callback(new Error("格式错误(0.1~10000)"));
                        // }
                        else if(Number(self.form.sellingPriceThirtyDays)&&Number(value)>=Number(self.form.sellingPriceThirtyDays)){
                            callback(new Error("7天价格必须小于30天价格"));
                        }else if(!Number(self.form.sellingPriceThirtyDays)&&Number(self.form.sellingPrice)&&Number(value)>=Number(self.form.sellingPrice)){
                            callback(new Error("7天价格必须小于售价"));
                        }
                    }
                    break; 
                case "sellingPriceThirtyDays":
                    if (self.form.isFree === 0) {
                        // if (value === "") {
                        //     callback(new Error("售价不能为空"));
                        // } else 
                        if (
                            /^\d+\.\d+$/.test(Number(value).toString()) &&
                            Number(value)
                                .toString()
                                .split(".")[1].length > 2
                        ) {
                            callback(new Error("请保留两位小数"));
                        }else if(typeof value=="string"&&value==='0'){
                            callback(new Error("30天价格不能为0"));
                        }
                        //  else if (
                        //     Number(value) < 0.1 ||
                        //     Number(value) > 10000.01
                        // ) {
                        //     callback(new Error("格式错误(0.1~10000)"));
                        // }
                        else if(Number(self.form.sellingPrice)&&Number(value)>=Number(self.form.sellingPrice)){
                            callback(new Error("30天价格必须小于售价"));
                        }else if(Number(self.form.sellingPriceSevenDays)&&Number(value)&&Number(value)<Number(self.form.sellingPriceSevenDays)){
                            callback(new Error("30天价格必须大于7天价格"));
                        }
                    }
                    break;                    
                case "categoryOne":
                    if (self.form.isFree === 0) {
                        if(self.form.radioMyType==1){
                            if (value === "") {
                                callback(new Error("分类不能为空"));
                            } else{
                                callback(); 
                            }
                        }else{
                            callback(); 
                        }
                    }
                    break;    
                case "categoryTwo":
                    if (self.form.isFree === 0) {
                        if(self.form.radioMyType==2){
                           if (value === "") {
                                callback(new Error("分类不能为空"));
                            } else{
                                callback(); 
                            }                                                     
                        }else{
                            callback(); 
                        }
                    }
                    break;                                     
                default:
                    break;
            }
            callback();
        };
        return {
            action:'',
            loginBg:loginBg,
            player_btn:player_btn,
            titleList:[
                        {
                            name:'课程',
                            pathInfo:'/courseCopy'
                        },
                        {
                            name:'课程管理',
                            pathInfo:'/courseCopy'
                        },
                        {
                            name:'新增课程',
                            pathInfo:''
                        }
                ],            
            form: {
                categoryOne: "",
                categoryTwo: "",
                mainClassifyId:'',
                title: "",
                intro: "",
                courseType: "",
                surfacePlot: "",
                planPeriodNum: "",
                isFree: 0,
                sellingPrice: "",
                originalPrice: "",
                sellingPriceSevenDays:"",
                sellingPriceThirtyDays:"",
                bonusTeacherId: "",
                bonusRatio: "0",
                lastSubmitRemark: "",
                introduce: "",
                teacherList:'',
                radioMyType:1,
                childrenClassifyIds:[],
            },
            rules: {
                categoryOne: [
                    { validator: valiNumber, trigger: "change" }
                ],
                categoryTwo: [
                    { validator: valiNumber, trigger: "change" }
                ],                
                title: [
                    {
                        required: true,
                        message: "请输入课程名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                intro: [
                    {
                        required: true,
                        message: "请输入课程简介",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                surfacePlot: [
                    {
                        required: true,
                        message: "请上传课程封面图",
                        trigger: "change"
                    }
                ],
                courseType: [
                    {
                        required: true,
                        message: "请选择课程类型",
                        trigger: "change"
                    }
                ],
                planPeriodNum: [{ validator: valiNumber, trigger: "blur" }],
                isFree: [
                    {
                        required: true,
                        message: "请选择课程类型",
                        trigger: "change"
                    }
                ],
                sellingPrice: [{ validator: valiNumber, trigger: "blur" }],
                originalPrice: [{ validator: valiNumber, trigger: "blur" }],
                sellingPriceSevenDays: [{ validator: valiNumber, trigger: "blur" }],
                sellingPriceThirtyDays: [{ validator: valiNumber, trigger: "blur" }],
                bonusTeacherId: [
                    //分红老师id: 没有写0
                ],
                bonusRatio: [{ validator: valiNumber, trigger: "blur" }],
                // lastSubmitRemark课 程提交备注参数:0~252
                introduce: [
                    {
                        required: true,
                        message: "请输入课程介绍",
                        trigger: "change"
                    },
                    // {
                    //     min: 1,
                    //     max: 10000,
                    //     message: "长度在 1 到 10000 个字符",
                    //     trigger: "change"
                    // }
                ],
                // teacherIds: [{ validator: valiTeacherIds, trigger: "change" }]
                teacherList: [{ validator: valiTeacherIds, trigger: "change" }]
            },
            btnLoading: false,
            dialogImageUrl: "",
            showCheckTeacher: false,
            imgBrief: "",
            graphicData: {},
            pageConstant: {}, //课程常量
            classifyList: {}, //课程分类
            teachLectureList: {}, //授课教师列表
            teachLectureListId:[],
            commissionTeacherList: {}, //提成老师列表
            defaultCheckTeacher: {},
            teacherCheckDialogType: "",
            commonHeader: {},
            isEditorFlag: {},
            channelDelDialogVisible:false,
            /**
             * editor course
             */
            courseInfo: {},
            courseId: "",
            editorContent: "",
            isSaveOut: null,
            canEditorPrice: false,
            inType:'',
            typeChoose:1,
            disabledVal:'disabledfalse',
            chooseteachersOne:[],
            chooseteachersTwo:[],
            contentCourseId:'',
            leaveDialogVisible:false,
            leaveFlag:false,
            leavePath:'',
            locaListStr:'',//课程知识点显示
            errorLocaListStr:false,
            videoIds:[],//知识点视频id;
            knowledgeDialogBox:false, //知识点弹框,
            inputText:'',//小视屏搜索
            checkedVideo:[],//选中的多选视频列表；
            pageData: [],//分页数据；
            pageAllData:[],//所有数据
            playingItem: {},//阿里播放器数据
            previewDialogVisible: false,//阿里播放器开关;
            keowedList:[],//课程知识点选中展示
            maxPageSelect:0,
            shortVideoIds:[],//知识点小视频
            selectBool:false,
            checkboxSelectList:[],
            checkboxList:[],
            disabledState:false
        };
    },
    computed:{},
    metaInfo: {
        title: "创建课程（基本信息）"
    },
    components: {
        // myEditor,
        lectureTeacher,
        depositTeacher,
        checkTeacherDialog,
        breadcrumb,
        playVideo
    },
    created() {
        this.commonHeader = {
            token: getToken()
        };
        this.action = this.$server.actionImgOrvideo;
        this.actionNext = this.$server.uploadResource;
        this.getConstant();
        this.classifyListEven();
        this.inType = this.$route.query["type"];   
        this.disabledVal = this.$route.query["disabledBool"];   
        this.getKnowedVideo(1);
    },
    mounted() {
        var self = this;
        if (self.$route.name === "courseEditor") {
            self.courseId = self.$route.params["id"];
            self.getCourseInfo();
        } else {
            self.isEditorFlag = JSON.parse(
                JSON.stringify({
                    form: self.form,
                    teachLectureList: self.teachLectureList,
                    commissionTeacherList: self.commissionTeacherList
                })
            );
            setTimeout(function(){ self.$refs['inputs'].focus() }, 1500); 
        };
        //点击其他区域隐藏弹框；
        document.addEventListener('click', (e)=> {
            let dom = document.getElementById("twoDivId");
            if(this.selectBool&&dom){
                if (e.target.className != 'oneDiv'&&!dom.contains(e.target)) {
                    //这句是说如果我们点击到了id为twoDivId以外的区域
                        this.selectBool = false;
                    }
            }
        });       
       	
    },
    watch:{
        teachLectureList(newCul,olCul){
            this.teachLectureListId = [];
            if(newCul){
                setTimeout(()=>{
                    if($(".lecture-wrap").length){
                        $(".lecture-wrap").next('.el-form-item__error').hide();
                    }
                },500);

            }
            for (const iterator in newCul) {
                this.teachLectureListId.push(newCul[iterator].id);
            }
        }
    },
    methods: {
        //点击视频大屏播放；
        previewVideo(item){
            this.playingItem = item;
            this.previewDialogVisible = true;            
        },
        //删除选择的短视频课程；
        removKnoweds(data){
            var indexs = this.checkedVideo.indexOf(data.id);
            if(indexs>-1){
                this.checkedVideo.splice(indexs, 1);
                this.keowedList.splice(indexs, 1);
                // this.shortVideoIds.splice(indexs, 1);
            }
            if(this.keowedList.length<101){
                this.errorLocaListStr = false;
            }else{
                this.errorLocaListStr = true;
            }
        },
        //确定选择
        searchIsOK(){
            // this.keowedList = this.checkedVideo;
            var list =[];
            for (const iterator of this.checkedVideo) {
                for (const iterator1 of this.pageAllData) {
                    if(iterator==iterator1.id){
                        list.push(iterator1);
                    }
                }                    
            }
            this.keowedList = list;
            this.shortVideoIds=this.checkedVideo;
            this.knowledgeDialogBox=false;
            if(this.keowedList.length>100){
                this.errorLocaListStr = true;
            }
        },
        //当前页数
        pageCurrentChange(val){
            this.getKnowedVideo(val);
        },
        //短视频搜索
        search(){
            this.getKnowedVideo(1);
        },
        //点击添加短视频
        dialogVideoBut(){
            this.knowledgeDialogBox=true;
        },
        //获取段视频信息
        getKnowedVideo(num) {
            var query={
                pageSize:10,
                videoType:2,
                page:num||1,
                title:this.inputText||''
            };
            this.$http
                .get(this.$server.videoIndex, {
                    params: query
                })
                .then(res => {
                    this.pageData = res.content;
                    if(num>this.maxPageSelect){
                        this.maxPageSelect = num;
                        this.pageAllDataEven(res.content.items); 
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },    
        pageAllDataEven(data){
            this.pageAllData = [...this.pageAllData,...data];
        },    
        //课程类型触发事件；视频时1,音频是2；
        selecttCourseType(val){
            if(val==2){
                this.checkedVideo =[];
                this.keowedList =[];  
                this.shortVideoIds='';
            }
            this.locaListStr=val;

        },
        selectRadiotype(val){
            this.form.radioMyType = Number(val);
            this.checkboxSelectList =[];
            this.form.childrenClassifyIds =[];
            if(val==1){
                this.form.categoryTwo = null;
            }else{
                this.form.categoryOne = null;
            }
        },
        removePreview(){
            //预览返回
            this.$router.push(`/course/manageCopy/${this.courseId}?type=${this.inType}`);
        },
        /**
         *编辑课程信息获取课程基本资料
         */
        getCourseInfo() {
            let self = this;
            self.$http
                .get(`${self.$server.course}/${self.courseId}`)
                .then(res => {
                    self.courseInfo = res.content;
                    res.content.bonusRatio = res.content.bonusRatio*100;
                    self.form = Object.assign(self.form, res.content);
                    self.editorContent = res.content["introduce"] || "";
                    self.form["introduce"] = res.content["introduce"] || "";
                    self.form['radioMyType'] = res.content["mtype"];
                    // self.locaListStr = 1;
                    self.locaListStr=res.content.courseType;
                    if(res.content.courseShortVideos.length>0){
                        var list = [];
                        var list1= [];
                        for (const iterator of res.content.courseShortVideos) {
                            list.push({
                                videoImage:iterator.videoImage,
                                title:iterator.videoName,
                                id:iterator.videoId,
                                courseId:iterator.iterator
                            });
                            list1.push(iterator.videoId);
                        }
                        self.checkedVideo=list1;
                        self.keowedList =list;
                        self.shortVideoIds=self.checkedVideo;
                    }
                    if(res.content["mtype"]==1){//mtype
                        // self.form.categoryOne = res.content["classifyId"];
                        self.form.categoryOne = res.content["mainClassifyId"];
                        self.form.categoryTwo = null;
                    }else{
                        // self.form.categoryTwo = res.content["classifyId"];
                        self.form.categoryTwo = res.content["mainClassifyId"];
                        self.form.categoryOne = null;
                    }
                    self.parentsSelect(3,res.content.mainClassifyId,res.content.childrenClassifyIds);
                    // self.form.category = res.content["classifyId"];
                    self.canEditorPrice =
                        (self.form.courseStatus !== courseStatus.draft &&
                            self.form.courseStatus !== courseStatus.auditFail) ||
                        self.form.parentId > 0||self.inType=="editor"; //判断是否可编辑
                    //授课老师
                    let teacherInfoList = res.content["teacherInfoList"];
                    for (let i = 0; i < teacherInfoList.length; i++) {
                        let id = teacherInfoList[i]["id"] + "";
                        self.teachLectureList[id] = teacherInfoList[i];
                    }
                    var sorttimeArr = []
                    for(var kes in self.teachLectureList){
                        sorttimeArr.push(self.teachLectureList[kes]);
                    }
                    self.chooseteachersOne = sorttimeArr.sort(self.sequence); 

                    var teacherIdsArr = Object.keys(self.teachLectureList);
                    if(teacherIdsArr.length>0){
                    var chooseTeacherList = teacherIdsArr.map(function(elements,index){
                                return {
                                    teacherId:Number(elements),
                                    sort:self.teachLectureList[elements].sort
                                }
                        });
                    };
                    self.form["teacherList"] = chooseTeacherList;
                    let bonusTeacherInfoList = res.content["bonusTeacherInfoList"];
                        bonusTeacherInfoList[0].bonusTeacherId = res.content.bonusTeacherId;
                    if (bonusTeacherInfoList.length > 0) {
                        // self.commissionTeacherList[
                        //     bonusTeacherInfoList[0]["bonusTeacherId"] + ""
                        // ] = bonusTeacherInfoList[0];
                        self.commissionTeacherList[
                            bonusTeacherInfoList[0]["id"] + ""
                        ] = bonusTeacherInfoList[0];                        
                    }
                    var sorttimeArrs = []
                    for(var kes in self.commissionTeacherList){
                        sorttimeArrs.push(self.commissionTeacherList[kes]);
                    }
                    self.chooseteachersTwo = sorttimeArrs.sort(self.sequence); 

                    // 设置对比参照看是否更改
                    self.isEditorFlag = JSON.parse(
                        JSON.stringify({
                            form: self.form,
                            teachLectureList: self.teachLectureList,
                            commissionTeacherList: self.commissionTeacherList
                        })
                    );

                })
                .catch(err => {});
        },
        /**
         * 获取课程常量
         */
        getConstant() {
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    this.pageConstant = res.content;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        classifyListEven(){ 
            this.$http.get(this.$server.getCategoryOneListCategory)
                .then(res => {
                     this.classifyList = res.content;
                })
                .catch(err => {
                    console.log(err);
                });                          
        },
        // 创建新分类新页面打开
        createClassify() {
            window.open(window.location.origin+"#/classify");
        },
        // 图片文件上传
        beforeUpload(file) {
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1.001;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG,PNG,JPEG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 1M!');
            }            
            const isSize = new Promise(function(resolve, reject) {
                            let width = 750;
                            let height = 420;
                            let _URL = window.URL || window.webkitURL;
                            let img = new Image();
                            img.onload = function() {
                                let valid = img.width == width && img.height == height;
                                valid ? resolve() : reject();
                            }
                            img.src = _URL.createObjectURL(file);
                        }).then(() => {
                            return file;
                        }, () => {
                            this.$message.error('上传的图片必须是等于750*420!');
                            return Promise.reject();
                });
            return isJPG && isLt2M && isSize;
        },
        //文件上传失败
        uploadFileError(err, file, fileList) {
            if (err.message) {
                try {
                    let msg = JSON.parse(err.message).message;
                    this.$message.error(msg);
                    return;
                } catch (e) {}
            }
            this.$message.error(JSON.stringify(err));
        },
        // 图片上传成功
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.form.surfacePlot = response.content.resourceUrl;
                this.$refs["form"].validateField("surfacePlot");
            } else {
                this.$message.error(response.message);
            }
        },
        /**
         * 富文本内容获取
         */
        // handleBrief(data) {
        //     this.form.introduce = data.html;
        //     if (data.count > 0) {
        //         this.$refs["form"].clearValidate(["introduce"]);
        //     }
        // },
        /**
         * 展示已选择的课程讲师
         */
        showLecturer(val) {
            if (this.teacherCheckDialogType === "teach") {
                var sorttimeArr = []
                for(var kes in val){
                    sorttimeArr.push(val[kes]);
                }
                this.chooseteachersOne = sorttimeArr.sort(this.sequence);              
                this.teachLectureList = val;
            } else {
                var sorttimeArr = []
                for(var kes in val){
                    sorttimeArr.push(val[kes]);
                }
                this.chooseteachersTwo = sorttimeArr.sort(this.sequence);               
                this.commissionTeacherList = val;
            }
            this.showCheckTeacher = false;
        },
        /**
         * 删除已选择课程讲师
         */
        cancelTeachChecked(id,objs) {
            var sorttimeArr = [];
            this.$delete(this.teachLectureList, id);           
            var numObj = Object.keys(this.commissionTeacherList);
            if(numObj.length>0){
                if(this.commissionTeacherList[numObj[0]].teacherId==id){
                    this.$delete(this.commissionTeacherList,numObj[0]);
                }
            }
            for(var kes in this.teachLectureList){
                sorttimeArr.push(this.teachLectureList[kes]);
            }
            this.chooseteachersOne = sorttimeArr.sort(this.sequence); 
        },
        sequence(a,b){
         return a.sort - b.sort;
        },      
        /**
         * 删除已选择提成讲师
         */
        cancelCommissionChecked(id) {
            var sorttimeArr = [];
            this.$delete(this.commissionTeacherList, id);
            for(var kes in this.commissionTeacherList){
                sorttimeArr.push(this.teachLectureList[kes]);
            }
            this.chooseteachersTwo = sorttimeArr.sort(this.sequence); 
        },
        /**
         * 显示老师选择的弹窗
         */
        showTeacherCheckDialog(type) {
            if (type === "teach") {
                this.defaultCheckTeacher = this.teachLectureList;
                this.teacherCheckDialogType = "teach";
                this.typeChoose = 1;
            } else {
                this.defaultCheckTeacher = this.commissionTeacherList;
                this.teacherCheckDialogType = "commission";
                this.typeChoose = 2;
            }
            this.showCheckTeacher = true;
        },
        saveEvenIsok(str){
            var self = this;
            if(self.locaListStr==1){
                if(self.shortVideoIds){
                    if(self.shortVideoIds.length>0){   
                        self.form['shortVideoIds'] =  self.shortVideoIds.join(",");              
                    }else{
                        self.form['shortVideoIds']='';                   
                    }
                }else{
                    self.form['shortVideoIds']='';
                }
            }else{
                self.form['shortVideoIds']='';
            }           
            var teacherIdsArr = Object.keys(this.teachLectureList);
            if(teacherIdsArr.length>0){
            var chooseTeacherList = teacherIdsArr.map(function(elements,index){
                        return {
                            teacherId:Number(elements),
                            sort:self.teachLectureList[elements].sort
                        }
                });
            };
            this.form["teacherList"] = chooseTeacherList;     
            if(self.form.radioMyType==1){//mtype
                self.form['mainClassifyId'] = self.form.categoryOne;
                self.form.categoryTwo='';
            }else{
                self.form['mainClassifyId'] = self.form.categoryTwo;
                self.form.categoryOne ='';
            }
            let form = JSON.parse(JSON.stringify(this.form));
            // form["teacherIds"] = Object.keys(this.teachLectureList); //"teacherId":4,"sort":2 teacherList
            
            var numObj = Object.keys(this.commissionTeacherList);
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // form["bonusTeacherId"] = form["bonusTeacherId"][0] || 0; //只能选择一个;
                    if(this.commissionTeacherList[numObj]){
                        form["bonusTeacherId"] = this.commissionTeacherList[numObj].bonusTeacherId;
                    }else{
                        form["bonusTeacherId"] = 0;
                    }
                    this.btnLoading = true;
                    if(this.form.isFree==0&&form["bonusTeacherId"]==0){
                        this.$message.error("提现老师不能为空");
                        return ;
                    }
                    if(this.form.introduce.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>10000){
                        this.$message.error("课程简介文字长度在 1 到 10000 个字符");
                        this.btnLoading = false;
                        return ;
                    }
                    let str1 = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                        <style>
                            .xgx-editor *{
                                cursor: text;
                                font-size: 16px!important;
                                font-family:'PingFangSC','STHeiti','Microsoft YaHei','Helvetica','Arial',sans-serif;
                            }
                            .xgx-editor ol,.xgx-editor p,.xgx-editor ul{
                                margin: 1em 0;
                                line-height: 1.5;
                            }
                            .xgx-editor hr{
                                margin: 3em 0 0 0;
                                border: 1px solid #e9e9e9;
                                border-width: 1px 0 0;
                            }
                            .xgx-editor blockquote{
                                padding: 12px 8px;
                                color: #999;
                                background-color: #f3f4f5;
                                margin: 10px 0;
                                border:none!important;
                            }
                            .xgx-editor blockquote span{
                                color:#999;
                            }
                            .xgx-editor blockquote p{
                                margin:0!important;
                                line-height: 1.4em!important;
                            }
                            .xgx-editor h1{
                                display:inline-block;
                                font-size: 1em;
                                line-height: 1.25em;
                                padding-left: 12px;
                                font-weight: 700;
                                border-left: 4px solid #f85959;
                                margin: 1em 0;
                            }
                            .xgx-editor img{
                                max-width:100%;
                            }
                            .xgx-editor h1 strong{
                                line-height:1.25em;
                            }
                            .xgx-editor h1 span{
                                font-size: 1em;
                                line-height: 1em;
                            }
                            .xgx-editor pre{
                                background: #f0f0f0!important;
                                color:#222!important;
                                border-radius: 3px;
                            }
                            .xgx-editor p{
                                word-wrap:break-word;
                            }
                            .xgx-editor ol li:not(.ql-direction-rtl),.xgx-editor ul li:not(.ql-direction-rtl){
                                padding-left:1.5em;
                            }
                            .xgx-editor ol > li{
                                list-style:none;
                            }
                            .xgx-editor ol,.xgx-editor ul{
                                padding:0px!important;
                            }
                            .xgx-editor ol > li::before{
                                content:counter(list-0, decimal) '. ';
                                display: inline-block;
                                white-space: nowrap;
                            }
                            .xgx-editor li:not(.ql-direction-rtl)::before{
                                margin-left: -1.6em;
                                margin-right: 0.3em;
                                text-align: right;
                            }
                            .xgx-editor ul > li::before{
                                content:'·';
                            }
                            .xgx-editor blockquote, .xgx-editor h1, .xgx-editor h2, .xgx-editor h3, .xgx-editor h4, .xgx-editor h5, .xgx-editor h6, .xgx-editor ol, .xgx-editor p, .xgx-editor pre, .xgx-editor ul{
                                counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                            }
                            .xgx-editor ol li{
                                counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                                counter-increment: list-0
                            }
                        </style>`
                    form.introduce = str1+'<div class="xgx-editor">'+form.introduce+'</div>'
                    if(!self.disabledState){
                        if (this.courseId) { 
                            this.updateCourse(form,str);
                        } else {
                            this.createCourse(form); 
                        }
                    }
                } else {
                    return false;
                }
            });            
        },
        removeSave(){
             this.$router.push("/courseCopy"); 
        },
        //摊款选择；
        courseOkOrNoEven(bools,str){

            var self = this;
                self.channelDelDialogVisible = false;
                if(bools){
                    self.$router.push(`/course/manageCopy/${self.contentCourseId}?type=draft`);
                }else{
                    self.$router.push("/courseCopy");
                }            
            // this.saveEvenIsok(bools,str);
        },        
        /**
         * 保存
         */
        save(strings) {
            var self = this;
            if(self.errorLocaListStr) return;
            // if(this.locaListStr==1){
            //     if(!this.shortVideoIds.length>0||this.shortVideoIds.length>100){
            //         this.errorLocaListStr = true;
            //         return;                    
            //     }else{
            //         this.errorLocaListStr = false;
            //     }
            // }else{
            //      this.errorLocaListStr = false;
            // }
            // this.locaListStr==1
            if(!self.chooseteachersTwo.length>0&&this.form.isFree==0){
                self.$message.error("请选择提现老师");
                return;
            }
            if(self.form.radioMyType==1){
                if(self.form.categoryOne==null){
                    self.form.categoryOne = '';
                    self.$message.error("分类不能为空");
                    return;
                }else if(self.form.categoryOne==''){
                    self.form.categoryOne = null;
                    self.$message.error("分类不能为空");
                    return;
                }
            }
            if(self.form.radioMyType==2){
                if(self.form.categoryTwo==null){
                    self.form.categoryTwo = '';
                    self.$message.error("分类不能为空");
                    return;
                }else if(self.form.categoryTwo==''){
                    self.form.categoryTwo = null;
                    self.$message.error("分类不能为空");
                    return;
                }
            }            
            this.$refs["form"].validate(valid => {
                if(valid){
                    self.saveEvenIsok(strings);
                }
            })
        },
        // 创建新课程
        createCourse(form) {
            let self = this;
            self.contentCourseId='';
            let obj2 = {};
            form.childrenClassifyIds = form.childrenClassifyIds.toString();
            form["transformRequest"] = true;
            $.extend( true, obj2, form );
            obj2.bonusRatio = form.bonusRatio/100;       
            self.disabledState = !self.disabledState;    
            this.$http
                .post(this.$server.course, obj2, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        self.channelDelDialogVisible = false;
                        self.disabledState = !self.disabledState;
                        this.isSaveOut = true;
                        this.$message({
                            message: "创建课程成功", 
                            type: "success",
                            onClose() {
                                self.btnLoading = false;
                                self.channelDelDialogVisible = true;
                                self.contentCourseId = res.content.courseId;
                                // if(status){
                                //     self.$router.push(`/course/manageCopy/${res.content.courseId}?type=draft`);
                                // }else{
                                //     self.$router.push("/courseCopy");
                                // }
                                // self.$router.push("/courseCopy");
                                // self.$router.push(`/course/manageCopy/${res.content.courseId}?type=editor`);
                            }
                        });
                    }
                })
                .catch(res => {
                    self.btnLoading = false;
                    self.disabledState = !self.disabledState;
                });
        },
        // 更新 & 校编辑
        updateCourse(form,str) {
            let self = this;
            let obj2 = {};
            form.childrenClassifyIds = form.childrenClassifyIds.toString();
            form["transformRequest"] = true;
            $.extend( true, obj2, form );
            obj2.bonusRatio = form.bonusRatio/100;
            self.disabledState = !self.disabledState;  
            this.$http
                .put(`${this.$server.course}/${this.courseId}`, obj2, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        this.isSaveOut = true;
                        self.disabledState = !self.disabledState;
                        if(str=='period'){
                            this.$message({
                                message: "课程修改成功，即将跳转到详情页面",
                                type: "success",
                                onClose() {
                                    self.btnLoading = false;
                                    self.channelDelDialogVisible = false;
                                    self.$router.push(
                                        `/course/manageCopy/${
                                            self.courseId
                                        }?type=${self.inType}`
                                    );
                                }
                            });
                        }else{
                            this.$message({
                                message: "课程修改成功，即将跳转到列表页",
                                type: "success",
                                onClose() {
                                    self.btnLoading = false;
                                    self.channelDelDialogVisible = false;
                                    self.$router.push("/courseCopy");
                                }
                            });
                        }
                        
                    }
                })
                .catch(res => {
                    self.disabledState = !self.disabledState;
                    self.btnLoading = false;
                });
        },
        valiPrice() {
            if (this.form.isFree === 0) {
                if (this.form.sellingPrice) {
                    this.$refs["form"].validateField("sellingPrice");
                }
                if (this.form.originalPrice) {
                    this.$refs["form"].validateField("originalPrice");
                }               
            } else {
                this.form.sellingPrice = "";
                this.form.originalPrice = "";
                this.form.sellingPriceThirtyDays = "";
                this.form.sellingPriceSevenDays = "";
                this.$refs["form"].clearValidate([
                    "sellingPrice",
                    "originalPrice",
                    "sellingPriceThirtyDays",
                    "sellingPriceSevenDays"
                ]);
            }
        },
        leavePage(){
            this.leaveFlag = true;
            this.leaveDialogVisible = false;
            this.$router.push(this.leavePath);
        },
        //选中短视频是否需要操作;
        handleCheckedVideoChange(value) {
            //  console.log('checkedVideo',this.checkedVideo);
            //  console.log('value',value);
            // let checkedCount = value.length;
           
        }, 
        listChangeData(data){
            var list  =[];
            for (const iterator1 of data) {
                for (const iterator2 of this.checkboxList) {
                    if(iterator1==iterator2.id){
                        list.push(iterator2);
                    }
                }
            }  
            this.checkboxSelectList = list;
        },      
        //二级列表的容器展示与隐藏;  
        selectTwoClassilyEven(bools){
            this.selectBool=!bools;
        },   
        //删除选中的二级课程     
        removeCheckboxSelectData(data,num){
            this.checkboxSelectList.splice(num,1);
            this.form.childrenClassifyIds = this.checkboxSelectList.map((data,index)=>{
                return data.id;
            });
        },
        //分类列表一级成人选中事件；
        parentsSelect(type,parentsId,arrys){
            this.checkboxSelectList =[];
            this.form.childrenClassifyIds =[];            
            if(type==1){
                var parems = {
                    id:this.form.categoryOne
                };
            }else if(type==2){
                var parems = {
                    id:this.form.categoryTwo
                };
            }else{
                var parems = {
                    id:parentsId
                };                
            }
            this.$http
                .get(this.$server.getCategoryTwoListCategory(parems))
                .then(res => {
                    if(type==1||type==2){
                        this.checkboxList = res.content;
                        this.childrenClassifyIds = [];
                        this.checkboxSelectList = [];  
                    }else{
                        var list =[];
                        if(arrys){
                            for (const iterator1 of arrys) {
                                for (const iterator2 of res.content) {
                                    if(iterator1==iterator2.id){
                                        list.push(iterator2);
                                    }
                                }
                            }
                        }
                        this.checkboxList = res.content;
                        this.childrenClassifyIds = arrys||[];
                        this.form.childrenClassifyIds = arrys||[];
                        this.checkboxSelectList = list;                   
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }         
    },
    beforeRouteLeave(to, from, next) {
        if(this.leaveFlag){
            setTimeout(()=>{
                next();
            },100)
            return;
        }
        this.leavePath = to.fullPath;
        if (this.isSaveOut === true) {
            next();
            return;
        }
        if(this.inType=="preview"){
            next();
            return;
        }
        // 校验是否进行了更改
        const self = this;
        let isEditorFlag = {
            form: self.form,
            teachLectureList: self.teachLectureList,
            commissionTeacherList: self.commissionTeacherList
        };
        if (JSON.stringify(isEditorFlag) != JSON.stringify(self.isEditorFlag)) {
            this.leaveDialogVisible = true;
            next(false)
            return;
            // this.$confirm(
            //     "您有未保存的信息，离开会丢失，确定要离开吗？",
            //     "提示",
            //     {
            //         confirmButtonText: "确定",
            //         cancelButtonText: "取消",
            //         customClass: "common-confirm-layout",
            //         type: "warning"
            //     }
            // )
            //     .then(() => {
            //         next();
            //     })
            //     .catch(() => {
            //         next(false);
            //     });
        } else {
            next();
        }
    }
};
</script>

<style scoped lang="scss">
.editorStylecss{
    width: 905px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
    z-index: 1000;
    cursor: not-allowed;
}
.default-input {
    width: 500px;
}
.create-course-baseinfo{
    .knowledgeCss{
        .red-btn{
            background: #b4272d;
            color: #fff;
        }      
        .isok{
            display: block;
            margin: auto;
            margin-top: 20px;
        }   
        .KnodeBoxListBox{
                padding-top: 20px;
                .el-checkbox__input {
                    position: absolute;
                    left: 20px;
                    bottom: 10px;
                    &::after {
                        content: "选择";
                        font-size: 14px;
                        float: right;
                        margin: 3px 0 0 10px;
                    }
                }
                .el-checkbox__input.is-checked + .el-checkbox__label {
                    color: #606266;
                }
                .el-checkbox,
                .el-checkbox__input {
                    white-space: initial;
                }
            }            
        }
    }
    .paginationCss{
        text-align: center;
        margin-top: 20px;
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
        .knowledText{
            position: absolute;
            top: 6px;
            left: 90px;
            color: #f56c6c;
            line-height: 20px;
        }
        .addKonked{
            width: 80px;
            height: 28px;
            line-height: 28px;
            font-size: 13px;
            text-align: center;
            color: #fff;
            background: #9e0e00;
            border-radius: 4px;
        }
        .knowledListBox{
            width: 100%;
            max-height: 260px;
            overflow-y: auto;
            .knowledCss{
                float: left;
                width: 14%;
                height: 100px;
                margin:10px 2% 10px 0;
                border:1px solid #ccc;
                margin-bottom: 20px;
                position: relative;
                .imgsdiv{
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    .img1{
                        width: 100%;
                        height: 100%;
                    }
                    .img2{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: 30px;
                        height: 30px;
                        transform: translate(-50%,-50%);
                    }
                }
                .divText{
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    background: rgba(0,0,0,0.3);
                    padding: 0 15px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;                    
                }
                i{
                    position: absolute;
                    top: -7px;
                    font-size: 20px;
                    right: -7px;
                }
            }
        }
    }
    .selectListlayout{
        max-height: 82px;
        overflow: auto;
        margin-top: 20px;
        .layoutDiv{
            float: left;
            margin-right: 15px;
            line-height: 30px;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 0 5px;
            i{
                cursor: pointer;
                margin-left: 5px;
                color: #9E0E00;
            }
        }
    }
    .selectListDiv{
        width: 140px;
        position: relative;
        .p1{
            top: 0;
            left: 148px;
            width: 150px;
            color: #ccc;
            position:absolute;
        }
        .oneDiv{
            width: 100%;
            line-height: 40px;
            text-align: center;
            border: 1px solid #DCDFE6;
            color: #ccc;
            border-radius: 4px;
            cursor: pointer;
        }  
        .twoDiv{
            border: solid 1px #E4E7ED;
            border-radius: 4px;
            background-color: #FFFFFF;         
            max-height: 270px; 
            padding: 5px; 
            overflow-y: auto;
            position: absolute;
            top: 45px;
            width: 138px;
            z-index: 10;
        }      
    }
    .course-type {
        display: block;
        margin: 5px 0 10px;
    }
    .form-sort {
        width: 140px;
        margin-right: 20px;
    }
    .classify-utils {
        color: #9e0e00;
        font-weight: 800;
    }
    .check-teacher {
        background: #9e0e00;
        border-color: #9e0e00;
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
    .price-type-box{
        display:flex;
        flex-direction:row;
        .bottomPx{
            margin-bottom: 30px;
            display:flex;
            flex-direction:row;
            position: relative;
            .firstBox{
                width:60px;
                text-align: center;
            }
            .requsetCss::after{
                position: absolute;
                display: inline-block;
                content: "*";
                width: 0px;
                height: 0px;
                top: 2px;
                // right: -5px;
                color:rgba(158, 14, 0, 1);
		    }
        }
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
        margin-right: 10px;
    }
    .red-text-tips{
        color:#ccc;
    }
    .checked-commission {
        border: 1px solid #d7d7d7;
        margin: 20px 20px 20px 0;
    }
}
.save-btnNo{
    display: block;
    width: 150px;
    height: 40px;
    border: 1px solid #999;
    border-radius: 3px;
    margin: 72px auto 50px;
    &:hover {
        opacity: 0.8;
    }    
}
.save-btn {
    display: block;
    width: 150px;
    height: 40px;
    background: rgba(158, 14, 0, 1);
    border-radius: 3px;
    margin: 72px auto 50px;
    &:hover {
        opacity: 0.8;
    }
}
.create-course-baseinfo{
    .video-item:nth-child(even){
        margin: 0 0 16px 0;
    }
    .video-item:nth-child(odd){
        margin: 0 16px 16px 0;
    }
    .video-item {
        width: 347px;
        height: 133px;
        border: 1px solid rgba(237, 241, 247, 1);
        background: rgba(245, 245, 245, 1);
        border-radius: 2px;
        // margin: 0 16px 16px 0;
        // &:nth-of-type(3n) {
        //     margin-right: 0;
        // }
        .preview {
            cursor: pointer;
        }
        .video-img {
            margin: 10px;
            width: 117px;
            height: 71px;
            background: #d8d8d8;
        }
        .video-info {
            margin: 10px 10px 10px 0;
            width: 198px;
            .video-name {
                margin-bottom: 30px;
                font-size: 18px;
                color: rgba(56, 65, 86, 1);
            }
        }
        .video-synopsis {
            color: #b4272d;
            font-size: 14px;
        }
        .check-status {
            height: 40px;
            width: 100%;
            background: rgba(234, 234, 234, 1);
        }
    }    
}


</style>
<style lang="scss">
.my-course-editor{
    width: calc(100% - 110px);
    border:1px solid #dfdfdf;
    .editor-wrapper{
        padding: 0 !important;
        .content-length{
            top:5px!important;
        }
    }
}
.create-course-baseinfo {
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .el-radio__input.is-checked .el-radio__inner {
        border-color: rgba(158, 14, 0, 1);
        background: rgba(158, 14, 0, 1);
    }
    .el-radio__input.is-checked + .el-radio__label {
        color: rgba(158, 14, 0, 1);
    }
}
.create-course-baseinfo{
    .el-checkbox__inner {
        width: 20px;
        height: 20px;
        &::after {
            width: 6px;
            height: 11px;
            left: 6px;
        }
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #b4272d;
        border-color: #b4272d;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
        height: 5px;
        top: 6px;
    }
    .KnodeBoxListBox {
        padding-top: 20px;
        .el-checkbox__input {
            position: absolute;
            left: 20px;
            bottom: 10px;
            &::after {
                content: "选择";
                font-size: 14px;
                float: right;
                margin: 3px 0 0 10px;
            }
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #606266;
        }
        .el-checkbox,
        .el-checkbox__input {
            white-space: initial;
        }
    }
}


</style>
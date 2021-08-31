<template>
    <div>
        <div v-show="creatnewCustomized==1">           
            <el-row class="lLine40 headerDiv">
                <el-col class="lSize18 lMarginBO20">
                    <el-row class="lSize16">
                        <el-col :span="8" class="lLeft-r">
                            <breadcrumb :menuList ='titleList'></breadcrumb>
                        </el-col>
                        <el-col :span="3" :offset="13" v-if="$authJudge('market:membermake:add')">
                            <el-button class="redBackColor butColorF"  @click="openMemberType('creat')">新建会员卡</el-button>
                        </el-col>
                    </el-row>                
                </el-col>
                <el-col class="lRight-r">
                    <el-row :gutter="10">
                        <el-col :span="4">
                            <div class="iSeachEven">
                                <el-input v-model.trim="title"
                                        placeholder="输入会员卡名称查询"
                                        class="search-form"
                                        width="100%"
                                        maxlength="16"
                                        clearable
                                        ></el-input>
                                        
                            </div>
                        </el-col>                     
                        <el-col :span="3">
                            <el-row>
                                <el-col :span="8" class="lCenter-r">状态</el-col>
                                <el-col :span="16">
                                    <el-select v-model="memberStatus"
                                            clearable
                                            placeholder="状态">
                                        <el-option v-for="(item,i) in courseStatusList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.value"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="3">
                            <el-row>
                                <el-col :span="8" class="lCenter-r">类型</el-col>
                                <el-col :span="16">
                                    <el-select v-model="categoryType"
                                            placeholder="状态">
                                        <el-option v-for="(item,i) in categoryTypeList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.value"></el-option>
                                    </el-select>                                    
                                </el-col>
                            </el-row>
                        </el-col>                                               
                        <el-col :span="2" v-if="$authJudge('market:membermake:select')"><el-button class="redBackColor butColorF"  @click="searchMemberCard(1)">查询</el-button></el-col>
                    </el-row>
                </el-col>
            </el-row>  
            <el-row>
                <el-col>
                    <el-table
                    :data="tableData"
                    border
                    v-loading="loading"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>                                                                                         
                        <el-table-column
                            prop="name"
                            :show-overflow-tooltip="true"
                            label="名称"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="batch"
                            label="批次"
                            align="center"
                            min-width="50">
                        </el-table-column>      
                        <el-table-column
                            label="有效期"
                            align="center"
                            min-width="120">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.validityDay}}天
                                    </el-col>                                   
                                </el-row>                                                      
                            </template>                            
                        </el-table-column>
                        <el-table-column
                            label="类型"
                            align="center"
                            min-width="60">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.categoryType==1?'绑卡':'非绑卡'}}
                                    </el-col>                                   
                                </el-row>                                                      
                            </template>                            
                        </el-table-column>                        
                        <!-- <el-table-column
                            prop="integralNum"
                            label="积分"
                            align="center"
                            min-width="50">
                        </el-table-column>  -->
                        <el-table-column
                            prop="pipelineText"
                            label="渠道"
                            align="center"
                        >
                        </el-table-column> 
                        <el-table-column
                            prop="activitionNum"
                            label="已激活"
                            align="center"
                            min-width="50">
                        </el-table-column> 
                        <el-table-column
                            prop="createorName"
                            label="生成人"
                            align="center"
                            min-width="50">
                        </el-table-column>  
                        <el-table-column
                            prop="createdAt"
                            :show-overflow-tooltip="true"
                            label="生成日期"
                            align="center"
                            min-width="120">
                        </el-table-column>                                                                                                                                                       
                        <el-table-column
                            label="状态"
                            align="center"
                            min-width="40"
                            >
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col v-if="scope.row.state==1">
                                        上线
                                    </el-col>
                                    <el-col v-if="scope.row.state==2">
                                        下线
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                        
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            min-width="120"
                            >
                            <template slot-scope="scope">
                                <el-row :gutter="10"> 
                                    <el-col :span="6">
                                        <el-button v-if="$authJudge('market:membermake:offline')&&scope.row.state==1" type="text" class="black-btn" @click="memberOperate(scope.row,'onLineOrNo')">下线</el-button>
                                        <el-button v-if="$authJudge('market:membermake:online')&&scope.row.state!=1" type="text" class="black-btn" @click="memberOperate(scope.row,'onLineOrNo')">上线</el-button>
                                    </el-col>
                                    <el-col :span="6" v-if="$authJudge('market:membermake:edit')">
                                        <el-button type="text" v-if="scope.row.state==2" class="black-btn" @click="openMemberType('editer',scope.row)">编辑</el-button>
                                    </el-col>
                                    <el-col :span="6" v-if="$authJudge('market:membermake:find')">
                                        <el-button type="text" class="black-btn" @click="memberOperate(scope.row,'see')">查看</el-button>
                                    </el-col>
                                    <el-col :span="6" v-if="$authJudge('market:membermake:export')">
                                        <el-button type="text" class="black-btn" @click="memberExport(scope.row)">导出</el-button>
                                    </el-col>                                    
                                    <el-col :span="6" v-if="$authJudge('market:membermake:delay')">
                                        <el-button type="text" v-if="scope.row.state==1" class="black-btn" @click="memberOperate(scope.row,'delayList')">延期</el-button>
                                    </el-col>     
                                    <el-col :span="6">
                                        <el-button type="text" v-if="$authJudge('market:membermake:cellphone')&&(scope.row.categoryType==2)" class="black-btn" @click="memberOperate(scope.row,'telephone')">号码</el-button>
                                    </el-col>                                                                                                                                     
                                </el-row>                                                      
                            </template>
                        </el-table-column>                                                                                   
                    </el-table>
                    <div class="block">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            @current-change="childPageValue"
                            :current-page.sync="pageAtion.paginationPage"
                            :total="pageAtion.pageTotal">
                        </el-pagination>
                    </div>                
                </el-col> 
            </el-row>                 
        </div>
        <div v-show="creatnewCustomized==2">           
            <el-row class="lLine40 headerDiv">
                <el-col class="lSize18">
                    <el-row class="lSize16">
                        <el-col class="lLeft-r">  
                            <div  class="returnPage">
                                <p class="titleStyle" @click="$router.push('/marketelistlist')"><strong>系统合集</strong> /</p>
                                <p class="titleStyle" @click="returnPageEven(1)"><strong>定制会员系统</strong> /</p>
                                <p class="titleStyle">查看</p>
                            </div>                                                   
                        </el-col>
                    </el-row>                
                </el-col>
                <el-col class="lRight-r">
                    <el-row :gutter="20">
                        <el-col>
                            <div style="overflow:auto;background:#FFC0C3;border-radius:5px;color:#B4272D;margin-bottom:20px;font-size: 16px;">
                                <div style="float:left;padding:5px">排除课程:</div><div style="float: left;padding: 5px 10px;color:#B4272D;" v-for="(item,index) in selectData" :key="index">{{(index+1)==selectData.length?item.title:item.title+','}}</div>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="iSeachEven">
                                <el-input v-model.trim="titleSee"
                                        placeholder="输入卡号/账号查询"
                                        class="search-form"
                                        width="100%"
                                        maxlength="16"
                                        clearable
                                        ></el-input>  
                            </div>
                        </el-col>                     
                        <el-col :span="4">
                            <el-row>
                                <el-col :span="8" class="lCenter-r">状态</el-col>
                                <el-col :span="16">
                                    <el-select v-model="activationStatus"
                                            clearable
                                            placeholder="状态">
                                        <el-option v-for="item,i in activationList"
                                                :key="i"
                                                :label="item.name"
                                                :value="item.value"></el-option>
                                    </el-select>                                    
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <el-col :span="11">
                            <el-row class="lLine40">
                                <el-col :span="11" class="lCenter-r">
                                    <div>
                                        <el-date-picker
                                        v-model="beginAt"
                                        type="date"
                                        placeholder="开始时间">
                                        </el-date-picker>
                                    </div>                        
                                </el-col>
                                <el-col :span="11" class="lCenter-r">
                                    <div>
                                        <el-date-picker
                                        v-model="endAt"
                                        type="date"
                                        placeholder="结束时间">
                                        </el-date-picker>
                                    </div>                         
                                </el-col>
                            </el-row>         
                        </el-col>                         
                        <el-col :span="2"><el-button class="redBackColor butColorF"  @click="searchMemberCard(2)">查询</el-button></el-col>
                        <el-col :span="3"><el-button class="redBackColor butColorF"  @click="delayDetaileds">延期明细</el-button></el-col>
                    </el-row>
                </el-col>
            </el-row>  
            <el-row>
                <el-col>
                    <el-table
                    :data="tableDataSeeList"
                    border
                    v-loading="loading2"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>                                                                                         
                        <el-table-column
                            prop="cardNum"
                            :show-overflow-tooltip="true"
                            label="卡号"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="cellphone"
                            :show-overflow-tooltip="true"
                            label="关联账户"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="activitionTime"
                            label="激活日期"
                            align="center"
                            min-width="100">
                        </el-table-column> 
                        <el-table-column
                            prop="studyDurationText"
                            label="学习总时长"
                            align="center"
                            >
                        </el-table-column> 
                        <el-table-column
                            label="有效期"
                            align="center"
                            min-width="80">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.validityDay}}天
                                    </el-col>                                   
                                </el-row>                                                      
                            </template>                            
                        </el-table-column>                                                                                                                                                      
                        <el-table-column
                            label="状态"
                            align="center"
                            min-width="40"
                            >
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col v-if="scope.row.activitionFlag==1">
                                        未激活
                                    </el-col>
                                    <el-col v-if="scope.row.activitionFlag==2">
                                        已激活
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                        
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            align="center"
                            min-width="60"
                            >
                            <template slot-scope="scope">
                                <el-row :gutter="10">                                    
                                    <el-col>
                                        <el-button type="text" class="black-btn" @click="memberOperate(scope.row,'delayOne')">延期</el-button>
                                        <el-button type="text" @click="StudyRecordDetails(scope.row)">详情</el-button>
                                    </el-col>                                                                                                     
                                </el-row>                                                      
                            </template>
                        </el-table-column>                                                                                   
                    </el-table>
                    <div class="block">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            @current-change="childPageValueOne"
                            :current-page.sync="pageAtionOne.paginationPage"
                            :total="pageAtionOne.pageTotal">
                        </el-pagination>
                    </div>                
                </el-col> 
            </el-row>                 
        </div>        
        <div v-show="creatnewCustomized==4">           
            <el-row class="lLine40 headerDiv">
                <el-col class="lSize18">
                    <el-row class="lSize16">
                        <el-col class="lLeft-r">
                             <div class="returnPage"><span @click="returnPageEven(1)">定制会员卡</span> / <span @click="returnPageEven(2)">查看</span> / 延迟明细</div>
                        </el-col>
                    </el-row>                
                </el-col>
                <el-col class="lRight-r">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="iSeachEven">
                                <el-input v-model.trim="titleDetail"
                                        placeholder="输入卡号/账号查询"
                                        class="search-form"
                                        width="100%"
                                        maxlength="16"
                                        clearable
                                        ></el-input>  
                            </div>
                        </el-col> 
                        <el-col :span="2"><el-button class="redBackColor butColorF"  @click="searchMemberCard(3)">查询</el-button></el-col>
                    </el-row>
                </el-col>
            </el-row>  
            <el-row>
                <el-col>
                    <el-table
                    :data="tableDataDetail"
                    border
                    v-loading="loading3"
                    style="width: 100%">
                        <el-table-column
                            prop="sortId"
                            label="序号"
                            align="center"
                            min-width="50">
                        </el-table-column>                                                                                         
                        <el-table-column
                            prop="cardNum"
                            :show-overflow-tooltip="true"
                            label="卡号"
                            align="center"
                            min-width="120">
                        </el-table-column>     
                        <el-table-column
                            prop="cellphone"
                            :show-overflow-tooltip="true"
                            label="关联账户"
                            align="center"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            prop="activitionTime"
                            label="激活日期"
                            align="center"
                            min-width="120">
                        </el-table-column> 
                        <el-table-column
                            label="有效期"
                            align="center"
                            min-width="80">
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col>
                                        {{scope.row.validityDay}}天
                                    </el-col>                                   
                                </el-row>                                                      
                            </template>                            
                        </el-table-column> 
                                                                                                                                                                            
                        <el-table-column
                            label="状态"
                            align="center"
                            min-width="40"
                            >
                            <template slot-scope="scope">
                                <el-row> 
                                    <el-col v-if="scope.row.activitionFlag==2">
                                        已激活
                                    </el-col>
                                    <el-col v-if="scope.row.activitionFlag==1">
                                        未激活
                                    </el-col>                                    
                                </el-row>                                                      
                            </template>                        
                        </el-table-column>
                        <el-table-column
                            label="延期"
                            align="center"
                            min-width="80"
                            >
                            <template slot-scope="scope">
                                <el-row :gutter="10">                                    
                                    <el-col>
                                       {{scope.row.postponeDay}}天
                                    </el-col>                                                                                                     
                                </el-row>                                                      
                            </template>
                        </el-table-column>                                                                                   
                    </el-table>
                    <div class="block">
                        <el-pagination
                            background
                            layout="prev, pager, next"
                            @current-change="childPageValueTwo"
                            :current-page.sync="pageAtionTwo.paginationPage"
                            :total="pageAtionTwo.pageTotal">
                        </el-pagination>
                    </div>                
                </el-col> 
            </el-row>                 
        </div>                
        <div class="fromCss" v-show="creatnewCustomized==3" v-loading='loading1'>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div style="margin-bottom:20px">
                    <p class="titleStyle" @click="$router.push('/marketelistlist')"><strong>系统合集</strong> /</p>
                    <p class="titleStyle" @click="breadcrumbEven"><strong>定制会员系统</strong> /</p>
                    <p class="titleStyle">绑定会员卡</p>
                </div>
                <el-form-item label="名称" prop="name">
                    <el-input style="width:40%;" maxlength="16" v-model.trim="ruleForm.name"></el-input><span> {{ruleForm.name.length||0}}/16 </span>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-select v-model.trim="ruleForm.pipelineId" :disabled="newOrUpdate=='editer'?true:false">
                        <el-option v-for="(item,index) in channelArr" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期" prop="validityDay">
                    <el-input style="width:150px;" maxlength="4" placeholder="效期范围1-9999" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.validityDay"></el-input><span> 天 </span>
                </el-form-item>   
                <el-form-item label="张数" prop="num">
                    <el-input style="width:150px;" maxlength="5" placeholder="效期范围1-99999" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.num"></el-input><span> 张 </span>
                </el-form-item>     
                <el-form-item label="批次" prop="batch">
                    <el-input style="width:150px;" maxlength="5" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.batch"></el-input><span> 5位数字组成，批次不可重复！批次号作用于卡号规则 </span>
                </el-form-item>                                        
                <el-form-item label="权益">
                    <el-select v-model.trim="ruleForm.equityType" disabled>
                        <el-option label="全场免费" value="1"></el-option>
                    </el-select>
                    <div>
                        <el-radio v-model="radio" label="1">全场免费</el-radio>
                    </div>
                    <p class="noticeCss" v-if="noticeError">*请选择会员权益</p>
                </el-form-item>
                <el-form-item label="背景图"
                                prop="backgroundUrl">
                    <p class="form-hint">1035*585支持PNG、JPG格式，小于1M</p>
                    <el-upload class="avatar-uploader"
                                :action="action"
                                :headers="commonHeader"
                                :before-upload="(file)=>{return beforeUpload(file,[1035,585])}"
                                :show-file-list="false"
                                :on-error="uploadFileError"
                                :on-success="uploadFileSuccess">
                        <img v-if="ruleForm.backgroundUrl"
                                :src="ruleForm.backgroundUrl"
                                class="avatar">
                        <i v-else
                            class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>         
                <!-- <el-form-item label="积分关联" prop="integralNum">
                    <el-input style="width:150px;" maxlength="3" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.integralNum"></el-input><span><i class="el-icon-warning lPaddingRF10"></i>积分关联是指在会员有效期内，会员每日自动增加的积分数量。 </span>
                </el-form-item>    -->
                <el-form-item>
                    <el-button @click="resetForm()">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm','okCard')">确定</el-button>
                </el-form-item>
            </el-form>    
            </div>
            <div class="fromCss" v-show="creatnewCustomized==5" v-loading='loading1'>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <div style="margin-bottom:20px">
                        <p class="titleStyle" @click="$router.push('/marketelistlist')"><strong>系统合集</strong> /</p>
                        <p class="titleStyle" @click="breadcrumbEven"><strong>定制会员系统</strong> /</p>
                        <p class="titleStyle">非绑定会员卡</p>
                    </div>
                    <el-form-item label="名称" prop="name">
                        <el-input style="width:40%;" maxlength="16" v-model.trim="ruleForm.name"></el-input><span> {{ruleForm.name.length||0}}/16 </span>
                    </el-form-item>
                    <el-form-item label="别名">
                        <div class="addRequestIcon">
                            <div class="requestIcon1">*</div>
                            <el-input style="width:40%;" placeholder="请输入别名，2-6个字符" @blur="blurAsNameEven" :disabled="newOrUpdate=='editer'?true:false" maxlength="6" v-model.trim="ruleForm.asName"></el-input><span>{{ruleForm.asName?ruleForm.asName.length:0}}/6 </span>
                        </div>
                        <p class="myselfasName" v-show="myselfasNameShow">请输入别名，2-6个字符</p>
                    </el-form-item>                    
                    <el-form-item label="渠道">
                        <el-select v-model.trim="ruleForm.pipelineId" :disabled="newOrUpdate=='editer'?true:false">
                            <el-option v-for="(item,index) in channelArr" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <div class="courseAllBox">
                        <div class="courseselectBox">
                            <div class="courseTitle">排除课程</div>
                            <div class="courseCount" style="margin-bottom:30px;">
                                <div class="selectCourseBut" @click="selectCourse">选择课程</div>
                                <div class="courseList" style="margin-left: 160px;" v-if="selectData.length>0">
                                    <div class="courseListCount" v-for="(item,index) in selectData" :key="index">
                                        <p>{{item.title}}</p>
                                        <i class="el-icon-circle-close" @click="removeSelectCourse(index)"></i>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <p class="myselfPropNext" v-show="selectDataBool">请添加课程</p>
                    </div>  
                    <div>
                        <div class="userselectBox">
                            <div class="usersTitle">添加用户</div>
                            <div class="usersCount">
                                <!-- @blur="blurEven(1)" -->
                                <textarea type="textarea" @input="getContent" rows="2" ref="textarea"  @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent" v-model="textarea"></textarea>
                                <div class="usersList">
                                    <div class="usersListCount" v-for="(item,index) in textareaContent" :key="index">
                                        <div v-if="item.length>0">
                                            <p>{{item}}</p>
                                            <i class="el-icon-circle-close" @click="removeSelectTelephone(index)"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>    
                        <p class="myselfPropNext" v-show="userListBool">请添加用户</p>
                        <div class="userSaveBut">
                            <div @click="saveTextareaInfo">保存</div>
                        </div>
                    </div>                                                     
                    <el-form-item label="有效期" prop="validityDay">
                        <el-input style="width:150px;" maxlength="4" placeholder="效期范围1-9999" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.validityDay"></el-input><span> 天 </span>
                    </el-form-item>   
                    <el-form-item label="张数" prop="num">
                        <el-input style="width:150px;" maxlength="5" placeholder="效期范围1-99999" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.num"></el-input><span> 张 </span>
                    </el-form-item>     
                    <el-form-item label="批次" prop="batch">
                        <el-input style="width:150px;" maxlength="5" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.batch"></el-input><span> 5位数字组成，批次不可重复！批次号作用于卡号规则 </span>
                    </el-form-item>                                        
                    <el-form-item label="权益">
                        <el-select v-model.trim="ruleForm.equityType" disabled>
                            <el-option label="全场免费" value="1"></el-option>
                        </el-select>
                        <div>
                            <el-radio v-model="radio" label="1">全场免费</el-radio>
                        </div>
                        <p class="noticeCss" v-if="noticeError">*请选择会员权益</p>
                    </el-form-item>
                     <el-form-item label="欢迎语">
                         <div class="addRequestIcon">
                            <div class="requestIcon2">*</div>
                            <el-input type="textarea" style="width:300px;" placeholder="最多60个字" @blur="blurEven" maxlength="60" :rows="4" v-model="ruleForm.welcomeSpeech"></el-input>
                            <span>{{ruleForm.welcomeSpeech?ruleForm.welcomeSpeech.length:0}}/60</span>
                         </div>
                         <p class="welcomeSpeechCss" v-show="welcomeSpeechBool">请添加欢迎语</p>
                    </el-form-item>                   
                    <el-form-item label="背景图"
                                    prop="backgroundUrl">
                        <p class="form-hint">1035*585支持PNG、JPG格式，小于1M</p>
                        <el-upload class="avatar-uploader"
                                    :action="action"
                                    :headers="commonHeader"
                                    :before-upload="(file)=>{return beforeUpload(file,[1035,585])}"
                                    :show-file-list="false"
                                    :on-error="uploadFileError"
                                    :on-success="uploadFileSuccess">
                            <img v-if="ruleForm.backgroundUrl"
                                    :src="ruleForm.backgroundUrl"
                                    class="avatar">
                            <i v-else
                                class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>         
                    <!-- <el-form-item label="积分关联" prop="integralNum">
                        <el-input style="width:150px;" maxlength="3" :disabled="newOrUpdate=='editer'?true:false" v-model="ruleForm.integralNum"></el-input><span><i class="el-icon-warning lPaddingRF10"></i>积分关联是指在会员有效期内，会员每日自动增加的积分数量。 </span>
                    </el-form-item>                              -->
                    <el-form-item>
                        <el-button @click="resetForm()">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm','noCard')">确定</el-button>
                    </el-form-item>
                </el-form>                    
            </div>
        <el-dialog
        :visible.sync="delayDialog"
        :close-on-click-modal='false'
        title=""
        max-height="300"
        width="25%">  
            <el-row>
                <el-col class="lCenter-r">
                    <span class="lPaddingRF10">天数 ：</span><el-input style="width:40%;" @keyup.native="proving" placeholder="请输入非0的正整数" maxlength="6" v-model="detalyNumber" ></el-input>
                </el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button class="redBackColor butColorF" :disabled="butLoad" :loading="butLoad" @click="dialogSaveEven(1)">确定</el-button>
                </el-col>               
            </el-row>
        </el-dialog>  
        <el-dialog
        :visible.sync="lowerShelfDialog"
        title=""
        max-height="300"
        width="25%">  
            <el-row>
                <el-col class="lCenter-r">
                   确定要下线该会员卡吗
                </el-col>
                <el-col class="lCenter-r lMarginTop30">
                    <el-button class="redBackColor butColorF" @click="dialogSaveEven(2)">确定</el-button>
                </el-col>               
            </el-row>
        </el-dialog>  
        <el-dialog
            :visible.sync="studyRecordDialog"
            title="学习记录"
            custom-class="study-record"
            width="800px">  
            <el-row>
                <el-table
                    :data="studyRecordTableData"
                    border
                    v-loading="studyRecordLoading"
                    max-height="500"
                    ref="scrollBox"
                    style="width: 100%">
                        <el-table-column
                            prop="courseName"
                            label="课程名称"
                            align="center"
                            min-width="200">
                        </el-table-column>
                        <el-table-column
                            prop="courseProgress"
                            label="学习进度"
                            align="center"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="studyDurationText"
                            label="学习时长"
                            align="center"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="typeText"
                            label="类型"
                            align="center"
                            min-width="50">
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            label="开始学习时间"
                            align="center"
                            min-width="200">
                        </el-table-column>
                </el-table>                 
            </el-row>
        </el-dialog> 
        <el-dialog title="用户号码" :visible.sync="dialogTableTelePhone" width="50%">
            <div>
                <el-table :data="telePhoneListData">
                    <el-table-column align="center" prop="sortId" label="序号" min-width="50"></el-table-column>
                    <el-table-column align="center" prop="cellphone" label="号码" min-width="200"></el-table-column>
                    <el-table-column align="center" prop="receiveTime" label="激活时间" min-width="200"></el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValueThree"
                        :current-page.sync="pageAtionThree.paginationPage"
                        :total="pageAtionThree.pageTotal">
                    </el-pagination>
                </div>                
            </div>
        </el-dialog>           
        <el-dialog
        :visible.sync="creatNewCourseDialog"
        title=""
        custom-class="common-dialog-header-bg"
        max-height="300"
        width="660px"> 

                <el-row class="lLine30">
                    <el-col :span="14" :offset="5" class="lCenter-r">
                        <el-radio v-model="radioCard" label="1">绑定会员</el-radio>
                        <el-radio v-model="radioCard" label="2">非绑定会员</el-radio>
                    </el-col>
                </el-row>                
                <div slot="footer"
                    class="dialog-footer tc">
                    <el-button plain
                            class="red-border-btn my-btn"
                            @click="close">取消</el-button>
                    <el-button type="primary"
                            class="red-btn my-btn"
                            @click="save">确定</el-button>
                </div>
        </el-dialog>  
        <el-dialog class="dialogCourseTwo" :visible.sync="courseselectPluginDialog" 
                    width="50%"
                    :destroy-on-close="true"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :show-close="false">
            <courseselect :urlPorp="urls" :chooseIdlist="exCourseIds" v-on:listSelect="listSelectEven"></courseselect>
        </el-dialog>   
        <el-dialog title="已存在用户号码" :visible.sync="requestTelephoneDialog" width="40%">
            <div style="width:100%;overflow: auto;">
                <div style="float: left;" v-for="(item,index) in repeatTelephontList" :key="index">{{repeatTelephontList.length==(index+1)?item:item+','}}</div>
            </div>
            <div style="margin-top:20px;text-align: center;">
                <el-button type="primary" @click="requestTelephoneDialog=false">确定</el-button>
            </div>            
        </el-dialog>         
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courseselect from "./courseAcconList";
const formatSeconds = value =>{
    let m = parseInt(value % 3600 / 60)
    let s = parseInt(value % 3600 % 60)
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    let h = parseInt(value/3600)
    let hStr = h<10?`0${h}`:h;
    return `${h}:${m}′${s}″`
}
export default {
    data(){    
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {             
                case "validityDay":
                    if ($.trim(value)===""||Number(value)==0) {
                            if(Number(value)==0){
                                return callback(new Error('有效期1-9999'));
                            }
                            if($.trim(value)===""){
                                return callback(new Error('请填写有效期'));
                            }  
                        }else{
                            setTimeout(() => {
                                if (!Number.isInteger(Number(value))) {
                                    callback(new Error('请输入有效期'));
                                } else {
                                    if (Number(value)>9999||Number(value)<0) {
                                        callback(new Error('有效期范围1-9999'));
                                    }else {
                                        callback();
                                    }
                                }
                            }, 1000);
                        }
                break;  
                case "num":
                    if ($.trim(value)===""||Number(value)==0) {
                            if(Number(value)==0){
                                return callback(new Error('会员卡张数1-99999'));
                            }
                            if($.trim(value)===""){
                                return callback(new Error('请填写会员卡张数'));
                            }  
                        }
                        setTimeout(() => {
                            if (!Number.isInteger(Number(value))) {
                                callback(new Error('请输入会员卡张数'));
                            } else {
                                if (Number(value)>99999||Number(value)<0) {
                                    callback(new Error('会员卡张数范围1-99999'));
                                } else {
                                    callback();
                                }
                            }
                        }, 1000);
                break; 
                case "batch":
                    if (value === "") {
                        callback(new Error("批次号不能为空"));
                    } else if (value === "0" || value === 0) {
                        callback();
                    } else if (! /^[0-9]{5}$/.test(value)){
                        callback(new Error("批次号必须是5位数字组成。"))
                    }else {
                        callback(); 
                    }
                break;  
                // case "integralNum":
                //     if ($.trim(value)===""||Number(value)==0) {
                //             if(Number(value)==0){
                //                 return callback(new Error('积分关联1-100'));
                //             }
                //             if($.trim(value)===""){
                //                 return callback(new Error('请填写积分关联'));
                //             }  
                //         }
                //         setTimeout(() => {
                //             if (!Number.isInteger(Number(value))) {
                //                 callback(new Error('请输入积分关联'));
                //             } else {
                //                 if (Number(value)>100||Number(value)<0) {
                //                     callback(new Error('积分关联范围1-100'));
                //                 } else {
                //                     callback();
                //                 }
                //             }
                //         }, 1000);
                // break;                                                             
            }
        };                            
        return {
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'定制会员系统',
                            pathInfo:''
                        }
                ], 
            courseStatusList:[
                {
                    name:"全部",
                    value:''
                },
                {
                    name:"上线",
                    value:1
                },
                {
                    name:"下线",
                    value:2
                }
            ],
            categoryTypeList:[
                {
                    name:"全部",
                    value:-1
                },
                {
                    name:"绑卡会员",
                    value:1
                },
                {
                    name:"非绑卡会员",
                    value:2
                }                
            ],
            activationList:[
                {
                    name:"全部",
                    value:0
                },
                {
                    name:"未激活",
                    value:1
                },
                {
                    name:"已激活",
                    value:2
                }
            ],            
            title:'',
            titleSee:'',
            titleDetail:'',
            memberStatus:'',
            butLoad:false,
            tableData:[],
            tableDataSeeList:[],
            tableDataDetail:[],
            creatnewCustomized:1,
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },    
            pageAtionOne:{
                pageTotal:0,
                paginationPage:1
            },   
            pageAtionTwo:{
                pageTotal:0,
                paginationPage:1
            },  
            pageAtionThree:{
                pageTotal:0,
                paginationPage:1
            },                                      
            radio:'1',  
            radioCard:'1',
            commonHeader: {},
            pageSize:10,
            pageNo:1,
            pageNoOne:1,
            pageNoTwo:1,
            pageNoThree:1,
            loading:false,
            loading1:false,
            loading2:false,
            loading3:false,
            updateId:'',
            //激活
            activationStatus:'',
            //权益状态
            noticeError:false,
            flags:'',
            ruleForm: {
                name: '',
                equityType: '1',
                pipelineId:'',
                validityDay:'',
                num:'',
                batch:'',
                // integralNum:'',
                delivery:true,
                backgroundUrl:'',
                state:2,
                welcomeSpeech:'',//欢迎语言
                asName:''//别名
            },
            action :'',
            rules: {
                name: [
                    { required: true, message: '请输入会员卡名称', trigger: 'blur' },
                    { min: 1, max: 16, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                validityDay: [{ validator: checkAge, trigger: "blur" }],
                num: [{ validator: checkAge, trigger: "blur" }],
                batch: [{ validator: checkAge, trigger: "blur" }],
                // integralNum:[{ validator: checkAge, trigger: "blur" }],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],          
                backgroundUrl: [
                    {
                        required: true,
                        message: "请上传背景图",
                        trigger: "change"
                    }
                ]
            },
            selectDateInfo:'',
            selectDateInfoNext:'',
            detalyNumber:'',
            beginAt:null,
            endAt:null,
            //弹框
            delayDialog:false,
            lowerShelfDialog:false,
            delayDialogIsSelect:'',
            newOrUpdate:'',
            studyRecordDialog:false,
            studyRecordUserId:'',
            studyRecordTableData:[],
            studyRecordLoading:false,
            studyRecordPageNo:1,
            studyRecordPageSize:10,
            channelArr:[],
            titleList1:[
                {
                    name:'系统合集',
                    pathInfo:'/marketelistlist'
                },
                {
                    name:'定制会员系统',
                    pathInfo:'/marketelist/member/customizedCard'
                },
                {
                    name:'新建会员卡',
                    pathInfo:''
                }
            ],
            //创建定制会员卡前的弹框选项
            creatNewCourseDialog:false,
            selectDataBool:false,//课程提示状态 
            selectData:[],//选中的课程列表    
            exCourseIds:[],//传递给后台选中的数据   
            urls:'/memberMake/getOurCourses',   
            courseselectPluginDialog:false,
            requestTelephoneDialog:false,//重复电话号码弹框
            textarea:'',
            textareaContent:[],
            oldTextarea:'',
            rows:0,
            pasteFlag:false,
            userListBool:false,    
            categoryType:-1,//类型过滤
            repeatTelephontList:[],//电话号码重复的数组  
            welcomeSpeechBool:false,
            dialogTableTelePhone:false,
            telePhoneListData:[],
            myselfasNameShow:false,
            disabledState:false                
        }
         
    },
    beforeRouteLeave(to, from, next){
        if(this.creatnewCustomized==2){
            this.creatnewCustomized = 1;
            this.studyRecordDialog = false;
            next(false)
        }else{
            next();
        }
    },
    watch:{
        creatnewCustomized(cur,old){
            if(Number(cur)==1){
                this.ruleForm= {
                    name: '',
                    equityType: '1',
                    pipelineId:'',
                    validityDay:'',
                    num:'',
                    batch:'',
                    // integralNum:'',
                    delivery:true,
                    backgroundUrl:'',
                    state:2,
                    welcomeSpeech:'',//欢迎语言
                    asName:''//别名
                }
                this.selectData=[]; 
                this.exCourseIds=[];
                this.textarea='',
                this.textareaContent=[],
                this.oldTextarea='',    
                this.repeatTelephontList=[];                                         
            }
        }
    },
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;        
        this.flags = this.$getPermissions(routes,currentPath);
        if(!this.flags){
            this.flags = [];
        }   
        this.commonHeader = {
            token: getToken()
        };             
        this.action = this.$server.actionImgOrvideo;
        this.getCustomCardlist(1);
        this.channelCoursePipelines()
    },
    methods:{
        formatDate(date,type){
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
                if(type=="end"){
                    h = 23;
                    m1 = 59;
                    s = 59;                
                }else{
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                }
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },        
        breadcrumbEven(){
            this.creatnewCustomized=1;
            this.loading =false;
        },
        //课程选择完毕后点击确定按钮;
        listSelectEven(objs){
                    if(objs.datas.length>0){
                        this.selectData = objs.datas;
                        this.selectDataBool = false;;
                        this.exCourseIds = objs.datas.map(x=>{
                            return x.id;
                        });
                    }
                    this.courseselectPluginDialog = objs.bool;           
        },
        //选择课程
        selectCourse(){
            this.courseselectPluginDialog = true;
        },
        removeSelectTelephone(index){
            var remDate =this.textareaContent.splice(index, 1);
        },
        //删除选中的课程
        removeSelectCourse(index){
                var remDate =this.selectData.splice(index, 1);
                var indexs =this.exCourseIds.indexOf(remDate[0].id);
                this.exCourseIds.splice(indexs,1);            
        },
        //回显排除课程
        returnDetailCourse(id){
            let query = {
                memberId:id
            }
            this.$http.get(this.$server.memberMakeGetAlreadyCourse(query)).then(res=>{
                if(res.status==200){
                    this.selectData=res.content;
                    this.exCourseIds = res.content.map(x=>{
                        return x.id;
                    });                    
                }
            });            
        },
        // //检验电话号码是否重复
        // repeatTelePhone(){
        //     let query = {
        //         memberId:id,
        //     }
        //     this.$http.get(this.$server.memberMakeGetAlreadyCourse(query)).then(res=>{
        //         if(res.status==200){
        //             this.selectData=res.content;
        //             this.exCourseIds = res.content.map(x=>{
        //                 return x.id;
        //             });                    
        //         }
        //     });             
        // },
        blurEven(){
            var self = this;
            if(!self.ruleForm.welcomeSpeech){
                this.welcomeSpeechBool = true;
            }else{
                this.welcomeSpeechBool = false;
            }
        },      
        blurAsNameEven(){
            var self = this;
            if(!self.ruleForm.asName){
                self.myselfasNameShow = true;
            }else{
                if(self.ruleForm.asName.length>6||self.ruleForm.asName.length<2){
                    self.myselfasNameShow = true;
                }else{
                    self.myselfasNameShow = false;
                }
            }            
        },  
       /**
         * 获取内容
         */
            getContent(){
                this.textarea = this.textarea.replace(/[^\d\n]/g, '');
                if(this.pasteFlag){
                    this.pasteFlag = false;
                    let temp = this.textarea.split('\n').map(item=>{
                        return item.length>11?item.substr(0,11):item
                    })
                    this.textarea = this.oldTextarea = temp.join('\n');
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return false;
                }
                let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
                let arr = this.textarea.split('\n');
                if(arr[index]&&arr[index].length>11){
                    this.textarea = this.oldTextarea
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return;
                }
                this.oldTextarea = this.textarea;
            },
            /**
             * 根据光标获取行数 （鼠标点击）
             */
            getRows(){
                let index = this.getCursortPosition(this.$refs.textarea)
                let temp = this.textarea.substr(0,index)
                this.rows = temp.split('\n').length
            },    
            /**
             * 根据光标获取行数 （键盘回车，上移下移左移右移）
             */
            keyDownEvent(e){
                let code = [8,13,37,38,39,40]
                if(code.includes(e.keyCode)){
                    setTimeout(()=>{
                        let index = this.getCursortPosition(this.$refs.textarea)
                        let temp = this.textarea.substr(0,index)
                        this.rows = temp.split('\n').length
                    },1)
                }
            },
            /**
             * 获取光标的位置
             */
            getCursortPosition(dom){
                var cursorIndex = 0;
                if (document.selection) {
                    dom.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -dom.value.length);
                    cursorIndex = range.text.length;
                } else if (dom.selectionStart || dom.selectionStart==0) {
                    cursorIndex = dom.selectionStart;
                }
                return cursorIndex;
            }, 
            saveTextareaInfo(){
                // updateId
                if(this.newOrUpdate=="editer"){
                    let query = {
                        memberId:this.updateId,
                        cellphones:this.textarea
                    }
                    this.$http.post(this.$server.memberMakeCheckCourse,query).then(res=>{
                        if(res.status==200){
                            var content= res.content;
                            let list = [...new Set([...this.textareaContent,...content.okCellphone])];
                            this.textareaContent = list; 
                            this.textarea='';    
                            if(content.noCellphone.length>0){
                                this.repeatTelephontList = content.noCellphone;
                                this.requestTelephoneDialog=true;
                            }else{
                                this.requestTelephoneDialog=false;
                            }  
                        }
                    });
                }else{
                    // //数组合并去重;
                    let list = [...new Set([...this.textareaContent,...this.textarea.split('\n')])];
                    this.textareaContent = list; 
                    this.textarea='';
                }
            },
            /**
             * 粘贴事件
             */
            pasteEvent(){
                this.pasteFlag = true
            },                                 
        //上传成功
        uploadFileSuccess(response, file) {
            if (response.status == 200) {
                this.ruleForm.backgroundUrl = response.content.resourceUrl;
                this.$refs["ruleForm"].validateField("backgroundUrl");
            } else {
                this.$message.error(response.message);
            }
        },
        //上传错误
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
        
        proving(){
            var self = this;
            var reg = /^[1-9]\d*$/;
            if(!reg.test(self.detalyNumber)){
                self.detalyNumber='';
            }
        },
        //导出
        memberExport(data){
            var self = this;      
            var url = self.$server.customCardExport+"?token="+getToken()+"&memberId="+data.id;  
            window.open(url);              
        },
        //上传前验证
        beforeUpload(file,size) {
            var self = this;
            this.loading = true;
            const isJPG = (file.type === 'image/png'||file.type ==='image/jpeg'||file.type ==='image/jpg')?true:false;
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isJPG) {
                this.loading = false;
                this.$message.error('上传头像图片只能是 JPG,JPEG,PNG 格式!');
            }
            if (!isLt2M) {
                this.loading = false;
                this.$message.error('上传头像图片最大为1M!');
            }
            const isSize = new Promise(function(resolve, reject) {
                let width = size[0];
                let height = size[1];
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
                this.loading = false;
                this.$message.error('上传的图片必须是等于'+size[0]+'*'+size[1]+'!');
                return Promise.reject();
            });
            return isJPG && isLt2M && isSize;   
        },
        //上下架；
        dialogSaveEven(num){
            var self = this;
            switch (num) {
                case 1:
                    this.breathSetEven();
                    break;
                case 2:
                    this.downOrUpEven(2,self.selectDateInfo);
                    break;            
                default:
                    break;
            }
        },
        breathSetEven(){
            var self = this;
            var urls = '';
            var parems = {};
            if(self.delayDialogIsSelect=='one'){
                parems = {
                    recordId:self.selectDateInfoNext.id,
                    postponeDay:Number(this.detalyNumber)
                };
                urls = self.$server.delayOnleyOne;
            }else{
                parems = {
                    memberId:self.selectDateInfo.id,
                    postponeDay:Number(this.detalyNumber)
                };
                urls = self.$server.delaySomeList;
            }
            self.butLoad = true;
            self.$http.post(urls,parems).then(res=>{
                if(res.status==200){
                    self.delayDialog = false;
                    self.detalyNumber = '';
                    self.butLoad = false;
                    self.getCustomListSee(self.selectDateInfo,1);;
                }else{
                    self.butLoad = false;
                }
            });            
        },
        downOrUpEven(num,data){
            var self = this;
            var urls = '';
            if(num==1){
                urls = self.$server.customMakeUp({id:data.id})
            }else{
                urls = self.$server.customMakeDown({id:data.id})
            }
            self.$http.post(urls).then(res=>{
                if(res.status==200){
                    if(num==2){
                        self.lowerShelfDialog = false;
                    }
                    this.getCustomCardlist(1);
                }
            });             
        },  
        delayDetaileds(){
            this.creatnewCustomized = 4;
            this.queryDeatilList(1);
        },
        submitForm(formName,formType) {
            var self = this;
            var parems = {}
            var url ='';
            let chunk  = 1000;
            let curPage = 1;
            let pageAll = 1;
            function updateForm(parems,id){
                curPage++;
                var urls = self.$server.customizedCardUpdate({id:id});
                parems.cellphones = self.textareaContent.slice((curPage-1)*chunk,curPage*chunk).join('\n');
                if(!self.disabledState){
                    self.disabledState = !self.disabledState;     
                    self.$http.post(urls,parems).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            if(self.newOrUpdate=='creat'){
                                if(pageAll<=curPage){
                                    self.loading1 = false;      
                                    self.creatnewCustomized = 1;
                                    self.getCustomCardlist(1);                            
                                }else{
                                    updateForm(parems,id);
                                }
                            }else{
                                if(pageAll<=curPage){
                                    self.ruleForm = {
                                            name: '',
                                            equityType: '1',
                                            validityDay:'',
                                            num:'',
                                            batch:'',
                                            // integralNum:'',
                                            delivery:true,
                                            backgroundUrl:'',
                                            state:2
                                        },                      
                                        self.loading1 = false;      
                                        self.creatnewCustomized = 1;
                                        self.getCustomCardlist(1);                           
                                }else{
                                    updateForm(parems,id);
                                }
                            }
                        }
                    }).catch(()=>{
                                self.disabledState = !self.disabledState;
                            });
                }
            }
            if(this.newOrUpdate=='creat'){
                if(formType=="okCard"){
                    parems = {
                        name:self.ruleForm.name,
                        num:self.ruleForm.num,
                        batch:self.ruleForm.batch,
                        backgroundUrl:self.ruleForm.backgroundUrl,
                        equityType:self.ruleForm.equityType,
                        // integralNum:self.ruleForm.integralNum,
                        validityDay:self.ruleForm.validityDay,
                        state:self.ruleForm.state,
                        pipelineId:this.ruleForm.pipelineId,
                        categoryType:self.radioCard
                    }
                }else{       
                    if(!self.textareaContent.length){
                        self.userListBool = true;
                        return ;
                    }        
                    if(!self.ruleForm.welcomeSpeech){
                        self.welcomeSpeechBool = true;
                        return;
                    }                       
                    parems = {
                        name:self.ruleForm.name,
                        num:self.ruleForm.num,
                        batch:self.ruleForm.batch,
                        backgroundUrl:self.ruleForm.backgroundUrl,
                        equityType:self.ruleForm.equityType,
                        // integralNum:self.ruleForm.integralNum,
                        validityDay:self.ruleForm.validityDay,
                        state:self.ruleForm.state,
                        pipelineId:self.ruleForm.pipelineId,
                        welcomeSpeech:self.ruleForm.welcomeSpeech,
                        asName:self.ruleForm.asName,
                        exCourseIds:self.exCourseIds.join(','),
                        // cellphones:self.textareaContent.join('\n'),
                        categoryType:self.radioCard
                    }                
                }  
                pageAll  =  Math.ceil(self.textareaContent.length/chunk);
                url = self.$server.customizedCardAdd;
                self.$refs["ruleForm"].validateField(
                    "validityDay",
                    "batch",
                    "num",
                    // "integralNum"                    
                );
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.loading1 = true;
                        parems.cellphones  =  this.textareaContent.slice((curPage-1)*chunk,curPage*chunk).join('\n');
                        self.$http.post(url,parems).then(res=>{
                            if(res.status==200){         
                                // self.loading1 = false;      
                                // self.creatnewCustomized = 1;
                                // self.getCustomCardlist(1);
                                let idUpOne  =  res.content.cardBaseId;
                                if(pageAll<=curPage){
                                //添加完毕
                                    self.loading1 = false;      
                                    self.creatnewCustomized = 1;
                                    self.getCustomCardlist(1);                                
                                }else{
                                //继续添加
                                    let paremsOne  =  {
                                        name:this.ruleForm.name,
                                        backgroundUrl:this.ruleForm.backgroundUrl,
                                        welcomeSpeech:this.ruleForm.welcomeSpeech,
                                        asName:this.ruleForm.asName,
                                        exCourseIds:this.exCourseIds.join(','),
                                        categoryType:this.radioCard 
                                    }                                    
                                    updateForm(paremsOne,idUpOne);  
                                }
                            }else{
                                self.loading1 = false;
                            }
                        }).catch((e) => {
                            self.loading1 = false;
                        });                       
                    } else {
                        self.loading1 = false;
                        return false;
                    }
                });                
            }else{
                if(formType=="okCard"){
                    parems = {
                        name:self.ruleForm.name,
                        backgroundUrl:self.ruleForm.backgroundUrl,
                        categoryType:self.radioCard 
                    }
                }else{
                    parems = {
                        name:self.ruleForm.name,
                        backgroundUrl:self.ruleForm.backgroundUrl,
                        welcomeSpeech:self.ruleForm.welcomeSpeech,
                        asName:self.ruleForm.asName,
                        exCourseIds:self.exCourseIds.join(','),
                        // cellphones:self.textareaContent.join('\n'),
                        categoryType:self.radioCard                        
                    }
                }
                pageAll  =  Math.ceil(self.textareaContent.length/chunk);
                url = self.$server.customizedCardUpdate({id:self.updateId});
                self.$refs["ruleForm"].clearValidate([
                    "validityDay",
                    "batch",
                    "num",
                    // "integralNum"
                ]);
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.loading1 = true;
                        parems.cellphones  =  self.textareaContent.slice((curPage-1)*chunk,curPage*chunk).join('\n');
                        self.$http.post(url,parems).then(res=>{
                            if(res.status==200){
                                let idUpTwo  =  self.updateId;
                                if(pageAll<=curPage){
                                //添加完毕
                                    self.ruleForm = {
                                            name: '',
                                            equityType: '1',
                                            validityDay:'',
                                            num:'',
                                            batch:'',
                                            // integralNum:'',
                                            delivery:true,
                                            backgroundUrl:'',
                                            state:2
                                        },                      
                                        self.loading1 = false;      
                                        self.creatnewCustomized = 1;
                                        self.getCustomCardlist(1);                               
                                }else{
                                //继续添加
                                    let paremsTwo  =  {
                                        name:this.ruleForm.name,
                                        backgroundUrl:this.ruleForm.backgroundUrl,
                                        welcomeSpeech:this.ruleForm.welcomeSpeech,
                                        asName:this.ruleForm.asName,
                                        exCourseIds:this.exCourseIds.join(','),
                                        categoryType:this.radioCard 
                                    }                                    
                                    updateForm(paremsTwo,idUpTwo);  
                                }
                            }else{
                                self.loading1 = false;
                            }
                        }).catch((e) => {
                            self.loading1 = false;
                        });                       
                    } else {
                        self.loading1 = false;
                        return false;
                    }
                });             
            }
        },
        returnPageEven(num){
            this.beginAt='';
            this.endAt='';
            switch (num) {
                case 1:
                    this.creatnewCustomized=1;
                    
                    break;
                case 2:
                    this.creatnewCustomized=2;
                    break;            
                default:
                    break;
            }
        },
        resetForm(formName) {
            this.ruleForm = {
                name: '',
                equityType: '1',
                validityDay:'',
                num:'',
                batch:'',
                // integralNum:'',
                delivery:true,
                backgroundUrl:'',
                state:2
            };            
            this.creatnewCustomized = 1;
        },         
        memberOperate(data,type){
            if(type=='delayOne'){
                this.selectDateInfoNext = data;
            }else{
                this.selectDateInfo = data;
            }
            
            switch (type) {
                case 'onLineOrNo':
                    if(data.state==2){
                        this.downOrUpEven(1,data)
                    }else{
                        this.lowerShelfDialog = true;
                    }
                    break;
                case 'delayList':
                    this.delayDialog = true;
                    this.delayDialogIsSelect='list';
                    break;     
                case 'delayOne':
                    this.delayDialog = true;
                    this.delayDialogIsSelect='one';
                    break;                                   
                case 'see':
                    this.returnDetailCourse(data.id);
                    this.getCustomListSee(data,1);
                    break;  
                case 'telephone':
                    this.getTelephoneList(1);
                    break;            
                default:
                    break;
            }
        },
        getCustomListSee(data,num){
            var self = this;
            self.creatnewCustomized = 2;
            if(num){
                self.pageNoOne = num;
            }  
            var params = {
                pageNo:self.pageNoOne,
                memberId:data.id,
                pageSize:self.pageSize,
                searchContent:encodeURIComponent(self.titleSee),
                activitionFlag:self.activationStatus,
                beginAt:self.beginAt?self.formatDate(new Date(self.beginAt),"start"):'',
                endAt:self.endAt?self.formatDate(new Date(self.endAt),"end"):''                    
            };
            self.loading2 = true;
            self.$http.get(self.$server.customListSeeData(params)).then(res=>{
               if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    var nextPage = contentdate.nextPage;
                    var prePage = contentdate.prePage;
                        if(contentdate.list.length){
                                if(!prePage&&!nextPage){
                                    listIds = contentdate.list.map(function(element,index){
                                        element.sortId = index+1;
                                        element.studyDurationText = element.studyDuration!=null?formatSeconds(element.studyDuration):''
                                        return element;
                                    });
                                }else{
                                    listIds = contentdate.list.map(function(element,index){
                                        element.sortId = prePage*10+index+1;
                                        element.studyDurationText = element.studyDuration!=null?formatSeconds(element.studyDuration):''
                                        return element;
                                    });                            
                                } 
                        };             
                        self.tableDataSeeList = listIds;
                        self.pageAtionOne.pageTotal = contentdate.total;
                        self.pageAtionOne.paginationPage = num;
                        self.loading2 = false;
                   
               }else{
                   self.loading2 = false;
               }
            })                  
        },  
        //选择定制会员卡
        close(){
            this.creatNewCourseDialog=false;
            this.radioCard='';
        },
        save(){
            this.creatNewCourseDialog=false;
            if(Number(this.radioCard)==1){
                this.creatnewCustomized = 3;  
            }else if(Number(this.radioCard)==2){
                this.creatnewCustomized = 5;  
            }
        },        
        openMemberType(objString,data){
            this.newOrUpdate = objString;
            switch (objString) {
                case 'creat':
                // this.creatnewCustomized = 3;  
                    this.creatNewCourseDialog = true;
                    break;
                case 'editer':
                    this.updateId = data.id;
                    if(data.categoryType==1){
                        this.ruleForm = {
                            name: data.name,
                            equityType: '1',
                            validityDay:data.validityDay,
                            num:data.num,
                            batch:data.batch,
                            // integralNum:data.integralNum,
                            delivery:true,
                            backgroundUrl:data.backgroundUrl,
                            state:data.state,
                            pipelineId:this.channelArr[0].id
                        };                    
                        this.creatnewCustomized = 3; 
                    }else{
                        this.ruleForm = {
                            name: data.name,
                            equityType: '1',
                            validityDay:data.validityDay,
                            num:data.num,
                            batch:data.batch,
                            // integralNum:data.integralNum,
                            delivery:true,
                            backgroundUrl:data.backgroundUrl,
                            state:data.state,
                            pipelineId:this.channelArr[0].id,
                            welcomeSpeech:data.welcomeSpeech,
                            asName:data.asName
                        };  
                        this.returnDetailCourse(data.id);        
                        this.creatnewCustomized = 5;               
                    }
                    break;            
                default:
                    break;
            }
        },
        searchMemberCard(num){
            switch (num) {
                case 1:
                    this.getCustomCardlist(1);
                    break;
                case 2:
                    this.getCustomListSee(this.selectDateInfo,1);
                    break;     
                case 3:
                    this.queryDeatilList(1);
                    break;                                   
                default:
                    break;
            }
        },    
        //继续查询详情
        queryDeatilList(num){

            var self = this;
            if(num){
                self.pageNoTwo = num;
            }
            self.loading3 = true; 
            var params = {
                pageNo:self.pageNoTwo,
                pageSize:self.pageSize,
                searchContent:encodeURIComponent(self.titleDetail), 
                memberId:self.selectDateInfo.id              
            };
            self.$http.get(self.$server.delayDetailedlist(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };                   
                    self.tableDataDetail = listIds;
                    self.pageAtionTwo.pageTotal = contentdate.total;
                    self.pageAtionTwo.paginationPage = num;
                    self.loading3 = false; 
               }
            })                 
        },        
        //继续查询详情
        getTelephoneList(num){
            var self = this;
            if(num){
                self.pageNoThree = num;
            }
            self.loading3 = true; 
            var params = {
                pageNo:self.pageNoThree,
                pageSize:self.pageSize,
                memberId:self.selectDateInfo.id              
            };
            self.$http.get(self.$server.memberMakeGetUserPage(params)).then(res=>{
               if(res.status==200){
                   self.dialogTableTelePhone = true;
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };                   
                    self.telePhoneListData = listIds;
                    self.pageAtionThree.pageTotal = contentdate.total;
                    self.pageAtionThree.paginationPage = num;
                    self.loading3 = false; 
               }
            })                 
        },                       
        //搜索
        search(){
            // this.getStudylist(1);
        },
        //创建学习卡
        creatlearnCard(){
            // this.getStudylist(1);
        },
        getCustomCardlist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true;
            var params = {
                name:encodeURIComponent(self.title),
                pageSize:self.pageSize,
                pageNo:self.pageNo,
                state:self.memberStatus, 
                categoryType:self.categoryType,            
            };
            self.$http.get(self.$server.customizedCardList(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                element.pipelineText = '学国学网'
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                element.pipelineText = '学国学网'
                                return element;
                            });                            
                        } 
                   };                   
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loading = false; 
               }
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getCustomCardlist(Number(num))
            }
        },
        childPageValueOne(num){
            var self= this;
            if(Number(num)>0){
                this.getCustomListSee(self.selectDateInfo,Number(num))
            }
        },
        childPageValueTwo(num){
            if(Number(num)>0){
                this.queryDeatilList(Number(num))
            }
        },
        childPageValueThree(num){
            if(Number(num)>0){
                this.getTelephoneList(Number(num))
            }            
        },
        StudyRecordDetails(obj){
            this.studyRecordDialog = true;
            this.studyRecordTableData = [];
            this.studyRecordPageNo = 1;
            this.studyRecordUserId = obj.userId
            this.$nextTick(()=>{
                this.getStudyRecord()
            })
        },
        getStudyRecord(){
            if(this.studyRecordUserId){
                this.studyRecordLoading = true;
                let query = {
                    params:{
                        pageNo:this.studyRecordPageNo,
                        pageSize:this.studyRecordPageSize
                    }
                }
                this.$http.get(`${this.$server.studyRecord}/${this.studyRecordUserId}`,query).then(res=>{
                    if(res.status==200){
                        let typeArr = [{label:'试看',value:1},{label:'已购',value:2},{label:'VIP',value:3},]
                        this.studyRecordLoading = false;
                        let temp = res.content.list.map(item=>{
                            item.typeText = typeArr.find(option=>option.value==item.type).label;
                            item.studyDurationText = item.studyDuration!=null?formatSeconds(item.studyDuration):''
                            return item;
                        })
                        this.studyRecordTableData = [...this.studyRecordTableData,...temp]
                        let dom = document.querySelector(".study-record .is-scrolling-none")
                        if(dom){
                            if(res.content.isLastPage){
                                dom.removeEventListener("scroll",this.scrollEvent)
                            }else{
                                this.$nextTick(()=>{
                                    dom.addEventListener("scroll",this.scrollEvent)
                                })
                            }
                        }
                        
                    }
                })
            }
        },
        scrollEvent(){
            let dom = document.querySelector(".study-record .is-scrolling-none")
            let scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
            let sign = 10;
            if (scrollDistance <= sign) {
                dom.removeEventListener("scroll",this.scrollEvent)
                this.studyRecordPageNo++;
                this.getStudyRecord();
            }
        },
        /**
         * 获取渠道
         */
        channelCoursePipelines(){
            let query = {
                params:{}
            }
            // channelArr
            this.$http.get(this.$server.channelCoursePipelines,query).then(res=>{
                if(res.status==200){
                    res.content.list.forEach(item=>{
                        if(item.name=='学国学网'){
                            this.channelArr.push(item)
                        }
                    })
                    this.ruleForm.pipelineId = this.channelArr[0].id;
                }
            })
        }        
    },
    components:{
        breadcrumb,
        courseselect
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.headerDiv .search-form {
        // width: 240px;
        // margin-right: 60px;
        position: relative;
        &.el-icon-search:before {
            position: absolute;
            font-size: 18px;
            right: 10px;
            top: 10px;
            background: #fff;
            font-weight: 900;
        }
    }
.headerDiv .iSeachEven{
    width: 100%;
    position: relative;
}
.headerDiv .iSeachEven i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.titleStyle{display:inline-block;vertical-align:middle;margin-right:4px;font-size:18px;cursor: pointer;}
.userselectBox{
    // margin:10px 0;
    position: relative;
    textarea{
        height: 200px!important;
        resize: none!important;
        display: block;
        width: 200px;
        border-radius: 5px;
        border-color:#ddd;
        padding: 25px;
        line-height: 20px;
        padding: 15px;
        font-size: 14px;
    }
    .words-num{
        position: absolute;
        font-size: 14px;
        color:#666;
        right:10px;
        bottom:10px;
    }
}
.addRequestIcon{
    position: relative;
    .requestIcon1{
        position: absolute;
        color:#F56C6C;
        left: -50px;
    }
    .requestIcon2{
        position: absolute;
        color:#F56C6C;
        left: -62px;
    }    
} 
.myselfasName{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    width: 150px;    
}
</style>
<style>
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.dialogCourseTwo .el-dialog__body{
    padding: 0 20px 30px 20px !important;
}
.fromCss .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.fromCss .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.fromCss .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.fromCss .avatar {
    width: 178px;
    height: 178px;
    display: block;
} 
.returnPage{
    /* padding: 5px 10px; */
    margin: 0px 0 20px 0;
    cursor: pointer;
    width: 300px;
}
.returnPage span{
    font-weight: bold;
    text-decoration: none;
    box-sizing: inherit;
    font-size: 18px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
.returnPage span:hover{
    color: #B4272D;
}
.dialog-footer {
    margin: 0px 20px 15px 0;
}
.my-btn {
    width: 130px;
    margin: 0 35px;
}
.search-area .el-icon-search{
    font-size: 18px;
    line-height: 40px;
    cursor: pointer;
}
    

/* ljm非绑定数据 */
.fromCss .courseselectBox,.fromCss .userselectBox{
    display: -webkit-inline-box;
    position: relative;
}
.fromCss .userSaveBut{
    /* margin: 0 auto 30px auto; */
    padding:10px 0 10px 250px;
    width: 430px;
}
.userSaveBut div{
    width: 50px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    background: #9E0E00;
    color: #fff;
}
.fromCss .courseselectBox .courseCount,.fromCss .userselectBox .usersCount{
    display: -webkit-inline-box;
}
.fromCss .courseselectBox .courseCount .selectCourseBut{
    width: 80px;
    height: 30px;
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    border-radius: 6px;
    background: #9E0E00;
    color: #fff;    
}
.fromCss .courseselectBox .courseCount .courseList,.fromCss .userselectBox .usersCount .usersList{
    height: 200px;
    overflow:auto;
    width: 200px;
    margin-left: 40px;
    padding: 0 0 0 10px;
}
.fromCss .courseselectBox .courseCount .courseList .courseListCount,.fromCss .userselectBox .usersCount .usersList .usersListCount{
    position: relative;
}
.fromCss .courseselectBox .courseCount .courseList .courseListCount i,.fromCss .userselectBox .usersCount .usersList .usersListCount i{
    position: absolute;
    top: 5px;
    right: 0px;    
    font-size: 16px;
}
.fromCss .courseselectBox .courseCount .courseList .courseListCount p,.fromCss .userselectBox .usersCount .usersList .usersListCount p{
    height: 25px;
    font-size: 14px;
    line-height: 25px;
    width: 170px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;    
}
.fromCss .courseselectBox .courseTitle,.fromCss .userselectBox .usersTitle{
    width: 100px;
    text-align: right;
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 14px;
}
/* .courseselectBox .courseTitle:before{
    content:"*";
    color:#F56C6C;
    margin-right: 4px;
} */
.userselectBox .usersTitle:before{
    content:"*";
    color:#F56C6C;
    margin-right: 4px;
}
.myselfProp{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
}
.myselfPropNext{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    width: 150px;
    margin-left: 120px;    
}
.welcomeSpeechCss{
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    width: 150px;      
}
</style>




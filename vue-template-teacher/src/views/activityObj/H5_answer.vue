<template>
    <div>
        <el-row :gutter="20">
            <el-col>
                <breadcrumb :menuList ='titleListName'></breadcrumb>
            </el-col>            
            <el-col>
                <elMenusGx :menuList ='titleList'></elMenusGx>
            </el-col>   
            <el-col class="lMarginTop40">
                <el-row>
                    <el-col>
                        <el-row v-if="targetAboutTopic=='list'" :gutter="15">
                            <el-col :span="6">
                                <el-input v-model.trim="name" @keyup.native="proving('name')" placeholder="请输入内容" clearable></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button v-if="$authJudge('activity:webactivity:evaluation:select')" class="redBackColor butColorF" @click="seachEven(1)">查询</el-button>
                            </el-col>        
                            <el-col :span="3" :offset="13" class="lRight-r">
                                <el-button v-if="$authJudge('activity:webactivity:evaluation:add')" class="redBackColor butColorF" @click="addH5test('add','')">添加新H5测评</el-button>
                            </el-col>                                       
                        </el-row>   
                        <el-row :gutter="20" v-if="targetAboutTopic=='add'">
                            <el-col :span="3">
                                <el-button class="redBackColor butColorF" @click="addNewH5test">添加新题目</el-button>
                            </el-col>        
                            <el-col :span="3" :offset="18" class="lRight-r">
                                <el-button @click="returnListTest('list')">返回</el-button>
                            </el-col>                                       
                        </el-row>   
                        <el-row v-if="targetAboutTopic=='relation'">
                            <el-col :span="6">
                                <el-input v-model.trim="name1" @keyup.native="proving('name1')" placeholder="请输入内容" clearable></el-input>
                            </el-col>
                            <el-col :span="2" :offset="1">
                                <el-button class="redBackColor butColorF" @click="seachEven(2)">查询</el-button>
                            </el-col>        
                            <el-col :span="3" :offset="12" class="lRight-r">
                                <el-button @click="returnListTest('list')">返回</el-button>
                            </el-col>                                       
                        </el-row>                                                                   
                    </el-col>
                    <el-col class="lMarginTop10" v-show="targetAboutTopic=='list'?true:false">
                            <el-table
                                border
                                :data="tableData"
                                v-loading="loadingOne"
                                style="width: 100%">
                                <el-table-column
                                    prop="sortId"
                                    label="序号"
                                    align="center"
                                    min-width="50"
                                    :show-overflow-tooltip="true">
                                </el-table-column>                                
                                <el-table-column
                                    prop="name"
                                    align="center"
                                    label="H5测评名称"
                                    min-width="120"
                                    :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column
                                    min-width="60"
                                    prop="questionCount"
                                    align="center"
                                    label="试题数量"
                                    show-overflow-tooltip>                    
                                </el-table-column>
                                <el-table-column
                                    prop="evaluationCount"
                                    align="center"
                                    label="测评结果数量"
                                    min-width="100"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    label="状态"
                                    align="center"
                                    min-width="60"
                                    show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-row> 
                                                <el-col v-if="scope.row.status==1">未生成</el-col>                                
                                                <el-col v-if="scope.row.status==3">下线</el-col>
                                                <el-col v-if="scope.row.status==2">上线</el-col>                                                                                                                                                                    
                                            </el-row>                                                      
                                        </template>                                    
                                </el-table-column>    
                                <el-table-column
                                    label="活动地址"
                                    align="center"
                                    min-width="180"
                                    show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-row :gutter="10"> 
                                                <el-col :span="18" :offset="1">
                                                    <el-input class="width100" v-model="scope.row.addressUrl" disabled></el-input>
                                                </el-col>                                                  
                                                <el-col :span="5" class="lLine40" v-if="$authJudge('activity:webactivity:evaluation:copylink')">
                                                    <el-button type="text" v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`" :data-clipboard-text="scope.row.addressUrl" @click="copyEvenChange(scope.row.id)">复制</el-button>
                                                    <el-button type="text" v-else :class="`copyurl${scope.row.id}`" :data-clipboard-text="scope.row.addressUrl" @click="copyEvenChange(scope.row.id)">复制</el-button>
                                                </el-col> 
                                            </el-row>                                                      
                                        </template>                                    
                                </el-table-column>                                                            
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    align="center"
                                    min-width="220">
                                        <template slot-scope="scope">
                                            <el-row> 
                                                <el-col :span="4" class="lCenter-r">
                                                    <el-button v-if="$authJudge('activity:webactivity:evaluation:raise')" type="text" class="black-btn" :disabled="scope.row.status==2?true:false" @click="addTestQuestions(scope.row,'add')">添加题目</el-button>
                                                </el-col>                                
                                                <el-col :span="4" class="lCenter-r" :offset="1">
                                                    <el-button v-if="$authJudge('activity:webactivity:evaluation:correlation')" type="text" class="black-btn" :disabled="scope.row.status==2?true:false" @click="addTestQuestions(scope.row,'relation')">关联关系</el-button>
                                                </el-col>
                                                <el-col :span="4" class="lCenter-r" :offset="1">
                                                    <el-button v-if="$authJudge('activity:webactivity:evaluation:set')" type="text" class="black-btn" :disabled="scope.row.status==2?true:false" @click="addH5test('update',scope.row)">设置</el-button>
                                                </el-col>       
                                                <el-col :span="4" class="lCenter-r lLine40" :offset="1">
                                                    <a v-if="$authJudge('activity:webactivity:evaluation:preview')" :class="scope.row.status==2?'colorSetYes':'colorSetNo'" :href="(scope.row.status==2)?(urlScienceBools==2?('https://scm.youfushuyuan.com/activity/poetryH5/index.html?evaluationId='+ scope.row.id):('https://xgxm.xueguoxue.com/activity/poetryH5/index.html?evaluationId=' + scope.row.id)):'JavaScript:;'" target="_blank">预览</a>
                                                </el-col>     
                                                <el-col :span="4" class="lCenter-r" :offset="1">
                                                    <el-button type="text" v-if="$authJudge('activity:webactivity:evaluation:generate')" v-show="scope.row.status==1" @click="listH5CreatApp(scope.row,1)" class="black-btn">生成</el-button>
                                                    <el-button type="text" v-if="$authJudge('activity:webactivity:evaluation:offline')" v-show="scope.row.status==2" @click="listH5CreatApp(scope.row,3)" class="black-btn">下线</el-button>
                                                    <el-button type="text" v-if="$authJudge('activity:webactivity:evaluation:online')" v-show="scope.row.status==3" @click="listH5CreatApp(scope.row,2)" class="black-btn">上线</el-button>
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
                        <el-col class="lMarginTop10" v-show="targetAboutTopic=='add'?true:false">
                            <el-table
                                border
                                :data="tableDataAdd"
                                v-loading="loadingThree"
                                style="width: 100%">
                                <el-table-column
                                    prop="sortId"
                                    label="起始序号"
                                    align="center"
                                    min-width="40"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="subject"
                                    label="题目"
                                    align="center"
                                    min-width="300"
                                    :show-overflow-tooltip="true">
                                </el-table-column>                            
                                <el-table-column
                                    fixed="right"
                                    align="center"
                                    label="操作"
                                    min-width="60">
                                        <template slot-scope="scope">
                                            <el-row> 
                                                <el-col class="lCenter-r">
                                                    <el-button type="text" class="black-btn" @click="removeTestQuestions(scope.row)">删除</el-button>
                                                </el-col>                                                                                                                         
                                            </el-row>                                                      
                                        </template>                    
                                </el-table-column>                                                
                            </el-table>
                            <div class="block">
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    @current-change="childPageValueSecond"
                                    :current-page.sync="pageAtionSecond.paginationPage"
                                    :total="pageAtionSecond.pageTotal">
                                </el-pagination>
                            </div>                            
                        </el-col>
                        <el-col class="lMarginTop10" v-show="targetAboutTopic=='relation'?true:false">
                            <el-table
                                border
                                :data="tableRelations"
                                v-loading="loadingTwo"
                                style="width: 100%">
                                <el-table-column
                                    prop="sequenceNo"
                                    label="序号"
                                    align="center"
                                    min-width="60"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="subject"
                                    align="center"
                                    label="题目"
                                    min-width="300"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="relationQuestionsequenceNo1"
                                    align="center"
                                    label="关联题目一"
                                    min-width="100"
                                    show-overflow-tooltip>
                                </el-table-column>  
                                <el-table-column
                                    prop="jumpType1"
                                    align="center"
                                    label="跳转范围"
                                    min-width="100"
                                    show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-row>  
                                                <el-col v-if="scope.row.jumpType1==1">内部</el-col>   
                                                <el-col v-if="scope.row.jumpType1==2"> 外部</el-col> 
                                                <el-col v-if="scope.row.jumpType1==null"></el-col>                                                                                                                                                                                                                        
                                            </el-row>                                                      
                                        </template>
                                </el-table-column>  
                                <el-table-column
                                    prop="relationQuestionsequenceNo2"
                                    align="center"
                                    label="关联题目二"
                                    min-width="100"
                                    show-overflow-tooltip>
                                </el-table-column>  
                                <el-table-column
                                    prop="jumpType2"
                                    align="center"
                                    label="跳转范围"
                                    min-width="100"
                                    show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-row> 
                                                <el-col v-if="scope.row.jumpType2==1">内部</el-col>   
                                                <el-col v-if="scope.row.jumpType2==2">外部</el-col> 
                                                <el-col v-if="scope.row.jumpType2==null"></el-col>                                                                                                                                                                                                                                                                     
                                            </el-row>                                                      
                                        </template>                                  
                                </el-table-column>                                                                                                                        
                                <el-table-column
                                    fixed="right"
                                    align="center"
                                    label="操作"
                                    min-width="150">
                                        <template slot-scope="scope">
                                            <el-row :gutter="15"> 
                                                <el-col :span="12" class="lCenter-r" v-if="scope.row.isStart==0">
                                                    <el-button type="text" class="black-btn" :disabled='(hasEntrance==1&&scope.row.isStart==0)?true:false'  @click="creatFirstInlet(scope.row,1)">设置入口</el-button>
                                                </el-col>
                                                <el-col :span="12" class="lCenter-r" v-if="scope.row.isStart==1">
                                                    <el-button type="text" class="black-btn"  @click="creatFirstInlet(scope.row,0)">取消入口</el-button>
                                                </el-col>                                                
                                                <el-col :span="12" class="lCenter-r">
                                                    <el-button type="text" class="black-btn" :disabled='(maxLevels==0||(scope.row.level>maxLevels)||(scope.row.level==0))?true:false'  @click="updatalistanswer(scope.row)">
                                                        {{(scope.row.relationQuestionsequenceNo1==null||scope.row.relationQuestionsequenceNo1==0)||(scope.row.relationQuestionsequenceNo2==null||scope.row.relationQuestionsequenceNo2==0)?'关联内容':'修改关联'}}
                                                    </el-button>
                                                </el-col>                                                                                                                                                                         
                                            </el-row>                                                      
                                        </template>                    
                                </el-table-column>                                                
                            </el-table> 
                            <div class="block">
                                <el-pagination
                                    background
                                    layout="prev, pager, next"
                                    @current-change="childPageValueNext"
                                    :current-page.sync="pageAtionNext.paginationPage"
                                    :total="pageAtionNext.pageTotal">
                                </el-pagination>
                            </div>
                        </el-col>                  
                </el-row>
            </el-col>         
        </el-row>
        <el-dialog
            :visible.sync="centerDialogUpdate"
            :close-on-click-modal='false'
            title=""
            max-height="300"
            width="35%">  
                <el-row>
                    <el-col class="lCenter-r">添加新的测评</el-col>
                    <el-col class="lMarginTop30">
                        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                            <el-form-item label="H5测评名称:" prop="inputName">
                                <el-input maxlength="30" v-model.trim ="ruleForm.inputName" @keyup.native="proving('inputName')" placeholder="请输入内容"></el-input>
                            </el-form-item>   
                            <el-form-item label="试题背景图:" prop="backImg">
                                <el-select v-model="ruleForm.backImg" placeholder="试题背景图选择" @change="selectChoosevalue">
                                    <el-option :label="items.name" :value="items.backgroundUrl" v-for="items,index in regionOptions" :key="index"></el-option>
                                </el-select>                            
                            </el-form-item>                                              
                            <el-form-item label="引导语" prop="guide">
                                <el-input 
                                type="textarea" 
                                maxlength="200"
                                :autosize="{ minRows: 8}"
                                v-model="ruleForm.guide"></el-input>
                                <p class="lSize12">限200字以内</p>
                            </el-form-item>
                            <el-form-item label="开始按钮描述:" prop="describeStart">
                                <el-input type="text" maxlength="20" @keyup.native="proving('describeStart')" v-model.trim="ruleForm.describeStart"></el-input>
                                <p class="lSize12">限20个字以内</p>
                            </el-form-item>                            
                            <el-form-item>
                                <el-button style="margin-left:20%;" @click="dialogIsNo(3)">取消</el-button>
                                <el-button style="margin-left:10%;" class="redBackColor butColorF" @click="submitForm('ruleForm')">确定</el-button>
                            </el-form-item>                        
                        </el-form>  
                    </el-col>
                </el-row>
            </el-dialog>
            <el-dialog
                :visible.sync="updateDialogUpdate"
                title=""
                max-height="300"
                width="35%"> 
                <el-row>
                    <el-col class="graybackOne lPadding30">
                        <el-row>
                            <el-col>
                                <el-row :gutter="20">
                                    <el-col :span="6">答案一:</el-col>
                                    <el-col :span="18">{{listAnswerSelect.answerContent1}}</el-col>
                                </el-row>                                
                            </el-col>
                            <el-col class="lMarginTop20">
                                <el-row :gutter="20">
                                    <el-col :offset="3" :span="3" class="lLine40 lRight-r">内部</el-col>
                                    <el-col :span="14">
                                        <el-select v-model="answerOne1" :disabled="isDisabledOneInner" placeholder="请选择" style="width:100%" @change="selectvalInnerOne">
                                            <el-option
                                            v-for="item in optionsOne"
                                            :key="item.exerciseId"
                                            :label="item.subject"
                                            :value="item.exerciseId">
                                            </el-option>
                                        </el-select>                                        
                                    </el-col>
                                </el-row>                                
                            </el-col>
                            <el-col class="lMarginTop20">
                                <el-row :gutter="20">
                                    <el-col :offset="3" :span="3" class="lLine40 lRight-r">外部</el-col>
                                    <el-col :span="14">
                                        <el-select v-model="answerTwo1" :disabled="isDisabledOneExternal" placeholder="请选择" style="width:100%"  @change="selectvalExternalOne">
                                            <el-option
                                            v-for="item in optionsTwo"
                                            :key="item.exerciseId"
                                            :label="item.subject"
                                            :value="item.exerciseId">
                                            </el-option>
                                        </el-select>                                        
                                    </el-col>
                                </el-row>                                 
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="lMarginTop30 graybackOne lPadding30">
                        <el-row>
                            <el-col>
                                <el-row :gutter="20">
                                    <el-col :span="6">答案二:</el-col>
                                    <el-col :span="18">{{listAnswerSelect.answerContent2}}</el-col>
                                </el-row>                                
                            </el-col>
                            <el-col class="lMarginTop20">
                                <el-row :gutter="20">
                                    <el-col :offset="3" :span="3" class="lLine40 lRight-r">内部</el-col>
                                    <el-col :span="14">
                                        <el-select v-model="answerOne2" :disabled="isDisabledTwoInner" placeholder="请选择" style="width:100%" @change="selectvalInnerTwo">
                                            <el-option
                                            v-for="item in optionsOne"
                                            :key="item.exerciseId"
                                            :label="item.subject"
                                            :value="item.exerciseId">
                                            </el-option>
                                        </el-select>                                        
                                    </el-col>
                                </el-row>                                
                            </el-col>
                            <el-col class="lMarginTop20">
                                <el-row :gutter="20">
                                    <el-col :offset="3" :span="3" class="lLine40 lRight-r">外部</el-col>
                                    <el-col :span="14">
                                        <el-select v-model="answerTwo2" :disabled="isDisabledTwoExternal" placeholder="请选择" style="width:100%" @change="selectvalExternalTwo">
                                            <el-option
                                            v-for="item in optionsTwo"
                                            :key="item.exerciseId"
                                            :label="item.subject"
                                            :value="item.exerciseId">
                                            </el-option>
                                        </el-select>                                        
                                    </el-col>
                                </el-row>                                 
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col class="lMarginTop30">
                        <el-row :gutter="20">
                            <el-col :span="4" :offset="8">
                                <el-button @click="dialogIsNo(1)">取消</el-button>
                            </el-col>
                            <el-col :span="4">
                                <el-button class="redBackColor butColorF" @click="answerUpdataSave">保存</el-button>
                            </el-col>
                        </el-row>                        
                    </el-col>                    
                </el-row>
            </el-dialog>            
            <el-dialog
                :visible.sync="addNewDialogH5test"
                title=""
                max-height="300"
                width="35%">  
                <el-row>
                    <el-col>
                        <el-row :gutter="20">
                            <el-col :span="18" class="lCenter-r">
                                <!-- @keyup.native="proving2" -->
                                <el-input placeholder="请输入内容"  v-model.trim="inputCourseTwo" @keyup.native="proving('inputCourseTwo')"></el-input>
                            </el-col>
                            <el-col :span="6" class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="seachEven(3)">查找</el-button>
                            </el-col>                                                 
                        </el-row>
                    </el-col>
                    <el-col class="lMarginTop30">
                            <!-- :selectable="selectable" -->
                            <el-table
                                ref="multipleTable"
                                :data="tableAddNewTopic"
                                tooltip-effect="dark"
                                style="width: 100%"
                                max-height="400"
                                v-loading="loadingFours"
                                @selection-change="handleSelectionChange">
                                <el-table-column
                                type="selection"
                                width="55">
                                </el-table-column>
                                <el-table-column
                                prop="subject"
                                align="center"
                                label="添加新题目">
                                </el-table-column>
                            </el-table>
                    </el-col>
                    <el-col class="lMarginTop20">
                        <el-row>
                            <el-col :span="6" class="lCenter-r" :offset="6">
                                <el-button class="redBackColor butColorF" @click="dialogIsNo(2)">取消</el-button>
                            </el-col>
                            <el-col :span="6" class="lCenter-r">
                                <el-button class="redBackColor butColorF" @click="courselistIsOkOrNo()">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-col>  
                </el-row>
            </el-dialog>  
            <el-dialog
                :visible.sync="creatOrGoOnlineOrOffline"
                title=""
                max-height="300"
                width="35%">  
                <el-row>
                    <el-col class="lMarginTop20 lCenter-r">{{creatOrGoOnlineOrOfflineTitle}}</el-col>
                    <el-col class="lMarginTop20">
                        <el-row :gutter="20">
                            <el-col class="lMarginTop20 lCenter-r" :span="4" :offset="8">
                                <el-button @click="dialogIsNo(4)">取消</el-button>
                            </el-col>
                            <el-col class="lMarginTop20 lCenter-r" type="primary" :span="4" >
                                <el-button class="redBackColor butColorF" @click="creatOrGoOnlineOrOfflineIsOk">确定</el-button>
                            </el-col>  
                        </el-row>                        
                    </el-col>  
                </el-row>
            </el-dialog>                                              
    </div>
</template>
<script>
import elMenusGx from "@/components/elMenu/elMenusGx";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import Clipboard from 'clipboard';
export default {
    data(){     
        var checkAge = (rule, value, callback) => {
            var self = this;
            switch (rule.fullField) {
                case "inputName":
                    var regExp =/^(?!.*\\.*$)/;
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写测评名称'));
                            }
                            setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('不能输入"\\"特殊字符'));
                            } else {
                                callback();
                            }
                        }, 300);
                    }else{
                        callback();
                    }                
                break;   
                case "describeStart":
                    var regExp =/^(?!.*\\.*$)/;
                    if(!self.isOKOrNoTwo){
                        if (!value) {
                            return callback(new Error('请填写开始按钮描述'));
                            }
                            setTimeout(() => {
                            if (!regExp.test(value)) {
                                callback(new Error('不能输入"\\"特殊字符'));
                            } else {
                                callback();
                            }
                        }, 300);
                    }else{
                        callback();
                    }                
                break;                           
            }
        };                          
        return {
            flags:[],
            tableData:[],
            tableDataAdd:[],
            tableAddNewTopic:[],
            tableRelations:[],
            urlScienceBools:1,
            ruleForm:{
                inputName:'',
                backImg:'',
                guide:'',
                describeStart:''
            },
            rules: {
                inputName: [
                    { required: true,validator: checkAge, trigger: 'blur' }
                ],  
                backImg: [
                    { required: true, message: '请选设置试题背景', trigger: 'change' }
                ],                      
                guide: [
                    {required: true, message: '请填写引导语', trigger: 'blur' }
                ],
                describeStart: [
                    { required: true, validator: checkAge, trigger: 'blur' }
                ]
            },    
            titleListName:[
                        {
                            name:'活动',
                            pathInfo:'/activityObjList'
                        },
                        {
                            name:'H5活动',
                            pathInfo:''
                        }               
            ],        
            titleList:[
                {
                    name:'测评管理',
                    pathInfo:'/activityObj/answer',
                    divCss:true
                },
                {
                    name:'题目库',
                    pathInfo:'/activityObj/itemBank',
                    divCss:false
                },
                {
                    name:'诗词库',
                    pathInfo:'/activityObj/poetryLibrary',
                    divCss:false
                },
                {
                    name:'设置',
                    pathInfo:'/activityObj/setUpGx',
                    divCss:false
                },
                {
                    name:'统计',
                    pathInfo:'/activityObj/gxStatistics',
                    divCss:false
                }                                
            ],
            regionOptions:[],
            pageNo:1,
            pageSize:10,
            multipleSelection:[],
            input:'',
            name:'',
            name1:'',
            inputCourseTwo:'',
            loadingOne:false,
            loadingTwo:false,
            loadingThree:false,
            loadingFours:false,
            centerDialogUpdate:false,
            addNewDialogH5test:false,
            updateDialogUpdate:false,
            creatOrGoOnlineOrOffline:false,
            targetAboutTopic:'list',
            creatOrGoOnlineOrOfflineTitle:'',
            creatOrGoOnlineOrOfflineStarts:1,
            //关联id
            evaluationId:'',
            evaluationData:{},
            dataUpadatAnswerList:'',
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },   
            pageAtionNext:{
                pageTotal:0,
                paginationPage:1
            },  
            pageAtionSecond:{
                pageTotal:0,
                paginationPage:1
            },           
            removeListId:'',
            listArryChoose:[],
            chooselistTable:{
                evaluationId:'',
                evaluationExerciseIds:[]
            },
            answerOne1:'',
            answerTwo1:'',
            answerOne2:'',
            answerTwo2:'',            
            optionsOne:[],
            optionsTwo:[],
            isDisabledOneInner:false,
            isDisabledOneExternal:false,
            isDisabledTwoInner:false,
            isDisabledTwoExternal:false,
            listAnswerSelect:{
                answerContent1:'',
                answerContent2:'',
                jumpType1:'',
                jumpType2:'',
                relationQuestionId1:'',
                relationQuestionId2:''
            },
            hasEntrance:0,
            exerciseIdOne:'',
            exerciseIdTwo:'',
            maxLevels:'',
            addNewTestListArry:[],
            temporaryArry:[],
            firstToAnswerBool:false,
            pathHref:'',
            disabledState:false
        }
    },
    components:{
        elMenusGx,
        breadcrumb
    },
    created(){ 
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
            this.pathHref='https://scm.xueguoxue.com/activity/poetryH5/index.html?evaluationId=';
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
            this.pathHref='https://scm.youfushuyuan.com/activity/poetryH5/index.html?evaluationId=';
        }else{
            this.urlScienceBools = 1;
            this.pathHref='https://scm.xueguoxue.com/activity/poetryH5/index.html?evaluationId=';
        };         
        this.getTableList(1);    
    },
    methods:{
        
        proving(val){
            var self = this;
            var reg = /^(?!.*\\.*$)/;        
            switch (val) {
                case 'name':
                    if(!reg.test(self.name)){
                        this.name='';
                    }                    
                    break;
                case 'name1':
                    if(!reg.test(self.name1)){
                        this.name1='';
                    }                    
                    break;
                case 'inputName':
                    if(!reg.test(self.ruleForm.inputName)){
                        this.ruleForm.inputName='';
                    }                    
                    break; 
                case 'describeStart':
                    if(!reg.test(self.ruleForm.describeStart)){
                        this.ruleForm.describeStart='';
                    }                    
                    break; 
                case 'inputCourseTwo':
                    if(!reg.test(self.inputCourseTwo)){
                        this.inputCourseTwo='';
                    }                    
                    break;            
                default:
                    break;
            }    
        },
        //搜索
        seachEven(num){
            switch (num) {
                case 1:
                    this.getTableList(1); 
                    break;
                case 2:
                    this.answerRelationList(1); 
                    break; 
                case 3:
                    this.addNewTestList(false);                   
                default:
                    break;
            }
        },
        //生成，下线上线
        listH5CreatApp(data,num){
            this.evaluationData = data;
            switch (num) {
                case 1:
                    this.creatOrGoOnlineOrOfflineTitle="确定生成该活动";
                    this.creatOrGoOnlineOrOfflineStarts=1;
                    break;
                case 2:
                    this.creatOrGoOnlineOrOfflineTitle="确定上线该活动";
                    this.creatOrGoOnlineOrOfflineStarts=2;
                    break;       
                case 3:
                    this.creatOrGoOnlineOrOfflineTitle="确定下线该活动";
                    this.creatOrGoOnlineOrOfflineStarts=3;
                    break;                         
                default:
                    break;
            }
            this.creatOrGoOnlineOrOffline = true; 
        },
        creatOrGoOnlineOrOfflineIsOk(){                 
            var self = this;
            var parames = {
                id:self.evaluationData.id,
                operationType:self.creatOrGoOnlineOrOfflineStarts,              
            };
            self.$http.post(self.$server.h5OperationType(parames)).then(res=>{
               if(res.status==200){
                   this.creatOrGoOnlineOrOffline = false; 
                   self.getTableList(self.pageAtion.paginationPage);
               }
            })
        },
        copyEvenChange(id){ 
            var self = this;
          var clipboard = new Clipboard('.copyurl'+id);  
            clipboard.on('success',function(e){
                    // 释放内存 
                    clipboard.destroy();
                    self.$message.success({ message: "复制成功" });
                })  
            clipboard.on('error',function(e){
                    console.log('该浏览器不支持自动复制')  
                    //// 释放内存 
                    clipboard.destroy();
                })  
        },      
        //关联内部选中
        selectvalInnerOne(data){
                this.answerOne1 = Number(data);
                this.listAnswerSelect.jumpType1 = 1;
                this.listAnswerSelect.relationQuestionId1 = this.answerOne1;
                if(data){
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = true;
                    this.exerciseIdOne = Number(data);
                }else{
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = false; 
                    this.exerciseIdOne = '';                   
                } 
                console.log(this.answerOne1);
        },
        selectvalExternalOne(data){
                this.answerTwo1 = Number(data);
                this.listAnswerSelect.jumpType1 = 2;
                this.listAnswerSelect.relationQuestionId1 = this.answerTwo1;
                if(data){
                    this.isDisabledOneInner = true;
                    this.isDisabledOneExternal = false; 
                    this.exerciseIdOne = Number(data);
                }else{
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = false;  
                    this.exerciseIdOne = '';                   
                }            
                console.log(this.answerTwo1);
        },
        //关联内部选中
        selectvalInnerTwo(data){
                this.answerOne2 = Number(data);
                this.listAnswerSelect.jumpType2 = 1;
                this.listAnswerSelect.relationQuestionId2 = this.answerOne2;
                if(data){
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = true;
                    this.exerciseIdTwo = Number(data);
                }else{
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = false; 
                    this.exerciseIdTwo = '';                   
                }
                console.log(this.answerOne2);
        },
        //关联外部选中
        selectvalExternalTwo(data){
                this.answerTwo2 = Number(data);
                this.listAnswerSelect.jumpType2 = 2;
                this.listAnswerSelect.relationQuestionId2 = this.answerTwo2;
                if(data){
                    this.isDisabledTwoInner = true;
                    this.isDisabledTwoExternal = false;
                    this.exerciseIdTwo = Number(data);
                }else{
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = false;
                    this.exerciseIdTwo = '';                       
                }         
                console.log(this.answerTwo2);   
        },
        //设置入口
        creatFirstInlet(data,isStart){
            var self = this;
            var parames = {
                operateType:isStart,
                evaluationId:data.evaluationId,
                exerciseRecordId:data.exerciseRecordId                
            };
            self.$http.post(self.$server.h5UpdateEntrance,parames).then(res=>{
               if(res.status==200){
                  self.answerRelationList(1);
               }
            })            
        },
        //修改设置入口对应的答案信息；
        updatalistanswer(data){
            console.log("数据",data);
            this.dataUpadatAnswerList= data;
            this.insideListanswer(data);
            this.externalListanswer();
            this.listAnswerSelect={
                answerContent1:data.answerContent1,
                answerContent2:data.answerContent2,
                jumpType1:data.jumpType1,
                jumpType2:data.jumpType2,
                relationQuestionId1:data.relationQuestionId1,
                relationQuestionId2:data.relationQuestionId2
            } 
            if(data.jumpType1==1){
                if(!data.relationQuestionId1){
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = false;
                    this.answerOne1 = 0;
                    this.answerTwo1 = 0;
                }else{
                    this.answerOne1 = data.relationQuestionId1;
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = true; 
                    this.answerTwo1 = 0;                  
                }
            }else{
                if(!data.relationQuestionId1){
                    this.isDisabledOneInner = false;
                    this.isDisabledOneExternal = false;
                    this.answerTwo1 = 0;
                    this.answerOne1 = 0;
                }else{
                    this.answerTwo1 = data.relationQuestionId1;
                    this.answerOne1 = 0;
                    this.isDisabledOneInner = true;
                    this.isDisabledOneExternal = false;                   
                }                
            }
            if(data.jumpType2==1){
                if(!data.relationQuestionId2){
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = false;   
                    this.answerOne2 =0;     
                    this.answerTwo2 =0;             
                }else{
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = true;   
                    this.answerOne2 =data.relationQuestionId2;  
                    this.answerTwo2 =0;                    
                }

            }else{
                if(!data.relationQuestionId2){
                    this.isDisabledTwoInner = false;
                    this.isDisabledTwoExternal = false;   
                    this.answerTwo2 =0;  
                    this.answerOne2 =0;                  
                }else{
                    this.isDisabledTwoInner = true;
                    this.isDisabledTwoExternal = false;   
                    this.answerTwo2 =data.relationQuestionId2;
                    this.answerOne2 =0;                     
                }
            }          
            this.updateDialogUpdate =true;
        },
        //答案修改
        answerUpdataSave(){
            var self = this;
            var prames = [];
                prames.push({
                        evaluationId:self.evaluationData.id,
                        answerId:self.dataUpadatAnswerList.answerId1,
                        relationExerciseId:self.listAnswerSelect.relationQuestionId1,
                        jumpType:self.listAnswerSelect.jumpType1,
                        exerciseId:self.dataUpadatAnswerList.id,
                        level:self.dataUpadatAnswerList.level
                    });
                prames.push({
                        evaluationId:self.evaluationData.id,
                        answerId:self.dataUpadatAnswerList.answerId2,
                        relationExerciseId:self.listAnswerSelect.relationQuestionId2,
                        jumpType:self.listAnswerSelect.jumpType2,
                        exerciseId:self.dataUpadatAnswerList.id,
                        level:self.dataUpadatAnswerList.level
                    });                    
            self.$http.post(self.$server.h5AddRelationAnswer,{addRelationAnswerFormList:JSON.stringify(prames) }).then(res=>{
               if(res.status==200){
                   self.answerRelationList(self.pageAtionNext.paginationPage);
                   self.updateDialogUpdate = false;
                   console.log("添加成功");
                    }
                });            
        },        
        insideListanswer(data){
            var self = this;
            var prames = {
                evaluationId:self.evaluationData.id,
                level:data.level,
                currExerciseId:self.dataUpadatAnswerList.id
            };
            self.$http.get(self.$server.h5GetRelationVaildInnerQuestions(prames)).then(res=>{
               if(res.status==200){
                   res.content.unshift({
                       exerciseId:0,
                       sequenceNo:1,
                       subject:'请选择'
                   });
                   res.content.forEach((item,index)=>{
                       item.subject = item.sequenceNo+'.'+item.subject;
                   });
                   self.optionsOne = res.content;
               }
            });
        },
        externalListanswer(){
            var self = this;
            self.$http.get(self.$server.h5GetRelationOuterQuestions).then(res=>{
               if(res.status==200){
                   res.content.unshift({
                       exerciseId:0,
                       sequenceNo:1,
                       subject:'请选择'
                   });        
                   res.content.forEach((item,index)=>{
                       item.subject = item.sequenceNo+'.'+item.subject;
                   });                              
                   self.optionsTwo = res.content;
               }
            });            
        },
        //测评列表
        getTableList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingOne = true;
            var params = {
                name:self.name,
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.h5Query(params)).then(res=>{
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
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = num;
                    self.loadingOne = false;
               }
            })
            .catch(res => {
                    self.loadingOne = false;
            });                                    
        },
        answerRelationEven(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loadingThree = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                id:self.evaluationData.id
            };
            self.$http.get(self.$server.h5Questions(params)).then(res=>{
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
                    self.tableDataAdd = listIds;
                    self.pageAtionSecond.pageTotal = contentdate.total;
                    self.pageAtionSecond.paginationPage = num;
                    self.loadingThree = false;
               }
            })
            .catch(res => {
                    self.loadingThree = false;
            });                          
        },
        answerRelationList(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.tableRelations=[];
            self.loadingTwo = true;
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize,
                evaluationId:self.evaluationData.id,
                name:self.name1
            };
            self.$http.get(self.$server.h5AnswerRelation(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content.pageInfo;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   self.hasEntrance = res.content.hasEntrance;
                   self.maxLevels = res.content.maxLevel;
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
                    self.tableRelations = listIds;
                    self.pageAtionNext.pageTotal = contentdate.total;
                    self.pageAtionNext.paginationPage = num;
                    self.loadingTwo = false;
               }
            })
            .catch(res => {
                    self.loadingTwo = false;
            });              
        },
        removeChooseList(){
            var self = this;
            self.$http.post(self.$server.h5Relation({relationId:self.removeListId})).then(res=>{
               if(res.status==200){
                   self.answerRelationEven(1);
               }
            })
        },
        getBackGroundImgList(){
            var self = this;
            self.$http.get(self.$server.h5BackgroundImg).then(res=>{
               if(res.status==200){
                   self.regionOptions = res.content;
               }
            })              
        },
        //查找
        courseSeach(){},        
        //删除题目
        removeTestQuestions(data){
            // this.removeListId = data.evaluationExerciseId;
            this.removeListId = data.id;
            this.removeChooseList();
            console.log(data);
        },
        //添加测评
        addH5test(state,data){
            var self = this;
            self.getBackGroundImgList();
            if(state=="update"){
                self.evaluationId=data.id;
                self.evaluationData = data;
                self.getCertainCommentInfo(data.id);
            }else{
                self.evaluationData ={};
                self.evaluationId='';
                self.ruleForm={
                            inputName:'',
                            backImg:'',
                            guide:'',
                            describeStart:''                    
                        }              
            }
            this.centerDialogUpdate = true;
        },
        returnListTest(bools){
             this.targetAboutTopic=bools;
        },
        dialogIsNo(num){
            switch (num) {
                case 1:
                    this.updateDialogUpdate = false;
                    break;
                case 2:
                    this.addNewDialogH5test = false;
                    break; 
                case 3:
                    this.centerDialogUpdate = false;
                    break; 
                case 4:
                    this.creatOrGoOnlineOrOffline = false;
                    break;                    
                default:
                    break;
            }
        },
        //添加题目
        addTestQuestions(data,bools){
            var self = this;
            // self.evaluationId = data.id; 
            self.evaluationData = data; 
            self.targetAboutTopic=bools;
            if(bools=='relation'){
                self.answerRelationList(1);
            }else if(bools=='add'){
                self.answerRelationEven(1);
            }
        },
        //数组合并并且去重复
         mergeArray(arr1,arr2){
                var self= this;
                var _arr = new Array();
                for(var i=0;i<arr1.length;i++){
                _arr.push(arr1[i]);
                }
                for(var i=0;i<arr2.length;i++){
                    var flag = true;
                    for(var j=0;j<arr1.length;j++){
                        if(arr2[i].id==arr1[j].id){
                            flag=false;
                            break;
                        }
                    }
                    if(flag){
                        _arr.push(arr2[i]);
                    }
                }
                self.addNewTestListArry = _arr;
            },        
        addNewTestList(bools){
            var self = this;
            self.loadingFours = true;
            self.temporaryArry =[];
            var prames = {
                evaluationId:self.evaluationData.id,
                keyword:self.inputCourseTwo
            };
            if(!bools){
                self.firstToAnswerBool = true;
                self.temporaryArry = self.multipleSelection;
                self.mergeArray(self.addNewTestListArry,self.temporaryArry);
            }            
            self.listArryChoose = [];
            self.$http.get(self.$server.h5QuestionOption(prames)).then(res=>{
               if(res.status==200){
                    self.tableAddNewTopic = res.content; 
                    res.content.forEach((item,index)=>{
                        if(item.isSelected==1){
                            self.listArryChoose.push(res.content[index]);
                        }
                    });
                    setTimeout(function(){
                        self.toggleSelection(self.listArryChoose);
           
                        self.loadingFours = false; 
                    },0);
               }
            })
            console.log('addNewTestListArry',self.addNewTestListArry);
        },
        //添加试题
        addNewH5test(){
            this.inputCourseTwo ='';
            this.addNewTestList(true);
            this.addNewDialogH5test = true;
        },        
        //选中列表数量数限制
        // selectable(){
        //     // if(this.multipleSelection.length <101){
        //             return true;
        //     // }            
        // },
        //切换第二、第三行的选中状态
        toggleSelection(rows) {
            var self=this;
            if (rows) {
            rows.forEach(row => {
                self.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                self.$refs.multipleTable.clearSelection();
            }
        },  
              
        //选中的列表信息
        handleSelectionChange(val){
            var self = this;
            self.chooselistTable={
                evaluationId:'',
                evaluationExerciseIds:[]
            };
            // var selectlistId = [];
            self.multipleSelection = val;
            // self.multipleSelection.forEach(element => {
            //     selectlistId.push(element.id);
            // });
            // self.chooselistTable = {
            //     evaluationId:self.evaluationData.id,
            //     evaluationExerciseIds:selectlistId
            // };            
        },
        courselistIsOkOrNo(){
            var self = this;
            var selectlistId = [];
            if(!self.firstToAnswerBool){
                self.addNewTestListArry = self.multipleSelection;
            }
            self.mergeArray(self.addNewTestListArry,self.multipleSelection);
            self.addNewTestListArry.forEach(element => {
                selectlistId.push(element.id);
            });
            if(!self.addNewTestListArry.length>0){
                self.$message({
                    message: '请选择',
                    type: 'error'
                });                
                return;
            }            
            self.chooselistTable = {
                evaluationId:self.evaluationData.id,
                evaluationExerciseIds:selectlistId
            };
            self.$http.post(self.$server.h5AddQuestionRelation,self.chooselistTable).then(res=>{
               if(res.status==200){
                   this.addNewDialogH5test = false;
                   self.addNewTestListArry = [];
                   self.firstToAnswerBool = false;
                   this.answerRelationEven(1);
               }
            })    
        },        
        selectChoosevalue(data){
            console.log(data);
            this.ruleForm.backImg = data;            
        },
        submitForm(formName){
            var self = this;
            self.$refs[formName].validate((valid) => {
            if (valid) { 
                        console.log("表单提交成功");  
                        self.formSubmitToStory();
                    }else{
                        console.log("表单提交失败");
                    } 
                });
        },
        getCertainCommentInfo(id){
            var self = this;
            self.$http.get(self.$server.h5GetEvaluationInfo({id:id})).then(res=>{
               if(res.status==200){
                var contents = res.content;
                self.ruleForm = {
                    inputName:contents.name,
                    backImg:contents.backgroundUrl,
                    guide:contents.leadingWord,
                    describeStart:contents.startDescription                   
                }
               }
            })            
        },
        /** 
         *      ruleForm:{
                inputName:'',
                backImg:'',
                guide:'',
                describeStart:''
            },
        */
        formSubmitToStory(){
            var self = this;
            var parmise = {
                id:self.evaluationData.id,
                name:self.ruleForm.inputName,
                backgroundUrl:self.ruleForm.backImg,
                startDescription:self.ruleForm.describeStart,
                leadingWord:self.ruleForm.guide
            };
            if(!self.disabledState){
                self.disabledState = !self.disabledState;              
                self.$http.post(self.$server.h5SaveOrUpdate,parmise).then(res=>{
                    if(res.status==200){
                        self.disabledState = !self.disabledState;
                            self.getTableList(self.pageAtion.paginationPage);
                            self.centerDialogUpdate = false;
                    }
                }).catch(()=>{
                    self.disabledState = !self.disabledState;
                })
            }
        },
        childPageValueNext(num){
            if(Number(num)>0){
                this.answerRelationList(Number(num))
            }
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getTableList(Number(num))
            }
        },
        childPageValueSecond(num){
            if(Number(num)>0){
                this.answerRelationEven(Number(num))
            }            
        }       
    },
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    }
.has-gutter th.el-table-column--selection .cell{
    display: none;
}
.colorSetYes{
    color:#9E0E00 !important;
}
.colorSetNo{
    color:#c0c4cc;
    cursor:not-allowed !important;
}
</style>



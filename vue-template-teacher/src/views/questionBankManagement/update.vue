<template>
    <div class="question-bank-update">
        <div class="page-content" v-loading="loading">
            <el-row>
                <el-col :span="12">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <p class="title">{{questionBankName}}</p>
            <p class="tips">添加选题</p>
            <div class="list" ref="list">
                <div class="item question-item" v-for="(item,index) in questionTitleSaveList" :key="index">
                    <div class="t">
                        <p>题目{{index+1}}.</p>
                        <i class="el-icon-delete item-delete" @click="del(index)"></i>
                    </div>
                    <div class="content">
                        <div class="type">
                            <label>类型</label>
                            <el-select v-model="item.type" placeholder="选择类型" size="small">
                                <el-option
                                v-for="option in item.typeArr"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="name">
                            <label>题目名称</label>
                            <el-input class="input" type="text" v-model="item.title" size="small"  maxlength="50" show-word-limit placeholder="请输入题目名称"/>
                        </div>
                        <div class="answer-list">
                            <div class="option" v-for="(option,i) in item.questionAnswerSaveList" :key="i">
                                <span class="sort">{{option.sort}}.</span>
                                <el-input class="option-input" type="text" size="small" v-model="option.text" maxlength="20" show-word-limit></el-input>
                                <div class="change">
                                    <el-radio v-if="item.type==''" disabled v-model="item.radio" label="1">正确答案</el-radio>
                                    <el-radio v-if="item.type==1" v-model="item.radio" :label="i+1">正确答案</el-radio>
                                    <el-checkbox v-if="item.type==2" v-model="option.checked">正确答案</el-checkbox>
                                </div>
                                <i class="el-icon-delete" @click="delOption(item,i)"></i>
                            </div>
                            <el-button class="add" type="primary" size="small" @click="addOption(item)">添加选项</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-btn">
                <el-button @click="addQuestion"><i class="el-icon-plus"></i></el-button>
            </div>
            <div class="btns-area">
                <el-button class="save" type="primary" @click="save" v-if="$authJudge('questionbank:save')">保 存</el-button>
                <el-button class="cancel" @click="$router.go(-1)">取 消</el-button>
            </div>
        </div>
    </div>    
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const tempArr = ['A','B','C','D','E','F','G','H','I','J']
export default {
    data(){
        return{
            titleList:[
                {
                    name:'题库管理',
                    pathInfo:'/questionBank'
                },
                {
                    name:'添加题目',
                    pathInfo:''
                }               
            ],
            loading:false,
            id:'',
            questionBankName:'',
            questionTitleSaveList:[
                // {
                //     typeArr:[
                //         {label:'单选',value:1},
                //         {label:'多选',value:2}
                //     ],
                //     type:'',
                //     radio:'0',
                //     title:'',
                //     questionAnswerSaveList:[
                //         {sort:'A',text:'',checked:false}
                //     ]
                // }
            ]
        }
    },
    components: {
        breadcrumb
    },
    created(){
        if(this.$route.query&&this.$route.query.id){
            this.id = this.$route.query.id;
            this.questionBankName = decodeURI(this.$route.query.questionBankName)
            this.$nextTick(()=>{
                this.questionTitleList()
            })
        }else{
            this.$router.push('/questionBank')
        }
    },
    methods:{
        /**
         * 根据题库ID查询题目及其选项
         */
        questionTitleList(){
            this.loading = true;
            let query = {
                params:{}
            }
            this.$http.get(`${this.$server.questionTitleList}/${this.id}`,query).then(res=>{
                if(res.status==200){
                    this.questionTitleSaveList = res.content.questionTitleList.map((item,index)=>{
                        let radio = '0';
                        if(item.type==1){
                            radio = item.questionAnswerList.findIndex(option=>option.isTrue==1)+1
                        }
                        return {
                            typeArr:[
                                {label:'单选',value:1},
                                {label:'多选',value:2}
                            ],
                            type:item.type,
                            radio:radio,
                            title:item.title,
                            questionAnswerSaveList:item.questionAnswerList.map((option,i)=>{
                                return {
                                    sort:tempArr[option.sort-1],
                                    text:option.answerName,
                                    checked:option.isTrue==1?true:false
                                }
                            })
                        }
                    })
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        /**
         * 删除题目
         */
        del(index){
            // if(this.questionTitleSaveList.length==1){
            //     this.$message.error('至少保留一个题目');
            //     return;
            // }
            this.$confirm('是否删除当前题目?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.questionTitleSaveList.splice(index,1)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                   
            });
        },
        /**
         * 添加选项
         */
        addOption(obj){
            if(obj.questionAnswerSaveList.length>=10){
                this.$message.error('最多添加10个选项');
                return;
            }
            let sort = tempArr[obj.questionAnswerSaveList.length];
            obj.questionAnswerSaveList.push({
                sort,
                text:'',
                checked:false
            })
        },
        /**
         * 删除选项
         */
        delOption(obj,i){
            if(obj.questionAnswerSaveList.length==1){
                this.$message.error('请至少保留一个选项');
                return;
            }
            if(obj.radio==i+1){
                obj.radio = ''
            }else if(obj.radio>i+1){
                obj.radio = obj.radio - 1;
            }else{

            }
            let temp = [...obj.questionAnswerSaveList];
            temp.splice(i,1);
            temp.forEach((item,index)=>{
                item.sort = tempArr[index]
            })
            obj.questionAnswerSaveList = temp;
        },
        /**
         * 添加题目
         */
        addQuestion(){
            if(this.questionTitleSaveList.length>=50){
                this.$message.error('最多添加50个题目');
                return;
            }
            this.questionTitleSaveList.push(
                {
                    typeArr:[
                        {label:'单选',value:1},
                        {label:'多选',value:2}
                    ],
                    type:'',
                    radio:'0',
                    title:'',
                    questionAnswerSaveList:[
                        {sort:'A',text:'',checked:false}
                    ]
                }
            )
        },
        save(){
            let index; 
            index = this.questionTitleSaveList.findIndex(item=>item.type=='');
            if(index>=0){
                this.$message.error(`题目${index+1}类型未选择，请处理`);
                this.$refs.list.scrollTop = document.querySelectorAll('.question-item')[index].offsetTop-177;
                return;
            }
            index = this.questionTitleSaveList.findIndex(item=>item.title=='');
            if(index>=0){
                this.$message.error(`题目${index+1}题目名称未填写，请处理`);
                this.$refs.list.scrollTop = document.querySelectorAll('.question-item')[index].offsetTop-177;
                return;
            }
            index = this.questionTitleSaveList.findIndex(item=>item.questionAnswerSaveList.some(option=>option.text==''));
            if(index>=0){
                this.$message.error(`题目${index+1}有选项未填写，请处理`);
                this.$refs.list.scrollTop = document.querySelectorAll('.question-item')[index].offsetTop-177;
                return;
            }
            index = this.questionTitleSaveList.findIndex(item=>{
                return (item.type==1&&item.radio=='0')||(item.type==2&&item.questionAnswerSaveList.filter(option=>option.checked==true).length==0)
            })
            if(index>=0){
                this.$message.error(`题目${index+1}没有勾选正确答案，请处理`);
                this.$refs.list.scrollTop = document.querySelectorAll('.question-item')[index].offsetTop-177;
                return;
            }
            let questionTitleSaveList = this.questionTitleSaveList.map((item,index)=>{
                let questionAnswerSaveList = item.questionAnswerSaveList.map((option,i)=>{
                    let isTrue;
                    if(item.type==1){
                        isTrue = item.radio==i+1;
                    }else{
                        isTrue = option.checked==true;
                    }
                    return {
                        answerName:option.text,
                        sort:option.sort,
                        isTrue:isTrue
                    }
                });
                return {
                    type:item.type,
                    title:item.title,
                    sort:index+1,
                    questionAnswerSaveList:questionAnswerSaveList
                }
            })
            this.loading = true;
            let query = {
                
            }
            questionTitleSaveList.forEach((item,index)=>{
                query['questionTitleSaveList['+index+'].title'] = item.title;
                query['questionTitleSaveList['+index+'].type'] = item.type;
                query['questionTitleSaveList['+index+'].sort'] = item.sort;
                item.questionAnswerSaveList.forEach((option,i)=>{
                    query['questionTitleSaveList['+index+'].questionAnswerSaveList['+i+'].answerName'] = option.answerName;
                    query['questionTitleSaveList['+index+'].questionAnswerSaveList['+i+'].sort'] = tempArr.findIndex(o=>o==option.sort)+1;
                    query['questionTitleSaveList['+index+'].questionAnswerSaveList['+i+'].isTrue'] = option.isTrue?1:2;
                })
            })
            this.$http.post(`${this.$server.saveQuestionTitle}/${this.id}`,query).then(res=>{
                if(res.status==200){
                    this.$message.success('题目保存成功');
                    this.$router.push('/questionBank')
                }
            }).finally(()=>{
                this.loading = false;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .page-header {
        background: #fff;
        padding: 10px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        padding: 20px;
        font-size: 16px;
        .title{
            font-size: 20px;
            text-align: center;
            margin:20px 0;
        }
        .tips{
            color:#999;
        }
        .add-btn{
            text-align: center;
            margin:10px 0;
            button{
                width: 74px;
            }
        }
        .btns-area{
            text-align: center;
        }
        .list{
            margin:10px 0 10px 80px;
            height:520px;
            overflow-y:auto;
            padding-right:10px;
            .item{
                .t{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .item-delete{
                        font-size: 20px;
                        cursor: pointer;
                    }
                }
                .content{
                    border-radius: 4px;
                    border:1px solid #dfdfdf;
                    margin:10px 0;
                    padding:20px 0;
                    font-size: 14px;
                    label{
                        width: 80px;
                        text-align: right;
                        margin-right: 10px;
                        display: inline-block;
                    }
                    .name{
                        margin:15px 0;
                        .input{
                            width: calc(100% - 200px);
                        }
                    }
                    .answer-list{
                        margin:0 0 0 100px;
                        .option{
                            display: flex;
                            align-items: center;
                            margin:10px 0;
                            .sort{
                                width:30px;
                                text-align: right;
                            }
                            .option-input{
                                width: 340px;
                                margin:0 10px;
                            }
                            .change{
                                margin:0 10px 0 40px;
                            }
                            i{
                                font-size: 16px;
                                cursor: pointer;
                            }
                        }
                        .add{
                            margin-top:15px;
                        }
                    }
                }
            }
        }
    }
</style>
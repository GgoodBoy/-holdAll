<template>
    <div class="add-question-edit" v-loading="loading">
        <div class="page-content">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>    
            <div class="radio-box box">
                <label>类型</label>
                <el-radio-group v-model="type">
                    <el-radio v-for="(item,index) in typeOptions" :label="item.value" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <div class="radio-box box">
                <label>难度</label>
                <el-radio-group v-model="difficultyType">
                    <el-radio v-for="(item,index) in difficultyTypeOptions" :label="item.value" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <div class="input-box box">
                <label>题目名称</label>
                <el-input type="text" v-model="title" placeholder="请输入题目" maxlength="30" show-word-limit></el-input>
            </div>
            <div class="button-box box">
                <el-button type="primary" :disabled="answerList.length>=4" @click="addAnswer">添加答案</el-button>
            </div>
            <div class="answer-box box">
                <div class="answer-item" v-for="(item,index) in answerList" :key="index">
                    <label>答案</label>
                    <p>{{item.sort}}.</p>
                    <el-input type="text" placeholder="请输入答案" v-model="item.text" maxlength="10" show-word-limit></el-input>
                    <el-radio :disabled="id!=''" v-model="rightKey" :label="item.key">设置为正确答案</el-radio>
                    <i class="el-icon-delete" @click="delAnswer(item,index)" v-if="id==''"></i>
                </div>
            </div>
            <div class="btns-box">
                <el-button @click="$router.go(-1)">取消</el-button>
                <el-button type="primary" @click="saveQuestion">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
const sortArr = ['A','B','C','D']
export default {
    components: {
        breadcrumb
    },
    data(){
        return{
            titleList:[
                {
                    name:'小程序知识达人王者',
                    pathInfo:'/answerMiniProgram/addQuestion'
                },
                {
                    name:'添加题库',
                    pathInfo:'/answerMiniProgram/addQuestion'
                },
                {
                    name:'添加题目',
                    pathInfo:''
                }                   
            ],
            loading:false,
            title:'',
            type:1,
            difficultyType:1,
            typeOptions:[
                {label:'文学',value:1},
                {label:'常识',value:2},
                {label:'历史',value:3},
                {label:'成语',value:4},
                {label:'民俗',value:5},
            ],
            difficultyTypeOptions:[
                {label:'简',value:1},
                {label:'中',value:2},
                {label:'难',value:3},
            ],
            answerList:[
                {sort:'A',text:'',key:1}
            ],
            rightKey:0,
            id:''
        }
    },
    created(){
        if(this.$route.query&&this.$route.query.id){
            this.id = this.$route.query.id;
            this.getQuestionDetail()
        }
    },
    methods:{
        /**
         * 获取题目详情
         */
        getQuestionDetail(){
            this.loading = true;
            const query = {
                params:{}
            }
            this.$http.get(`${this.$server.getQuestionDetail}/${this.id}`,query).then(res=>{
                if(res.status==200){
                    this.title = res.content.title;
                    this.type = res.content.type;
                    this.difficultyType = res.content.difficultyType;
                    this.rightKey = res.content.rightKey;
                    const answerList = []
                    if(res.content.answerA&&res.content.answerA.length>0){
                        answerList.push({
                            sort:'A',text:res.content.answerA,key:1
                        })
                    }
                    if(res.content.answerB&&res.content.answerB.length>0){
                        answerList.push({
                            sort:'B',text:res.content.answerB,key:2
                        })
                    }
                    if(res.content.answerC&&res.content.answerC.length>0){
                        answerList.push({
                            sort:'C',text:res.content.answerC,key:3
                        })
                    }
                    if(res.content.answerD&&res.content.answerD.length>0){
                        answerList.push({
                            sort:'D',text:res.content.answerD,key:4
                        })
                    }
                    this.answerList = answerList;
                }
                this.loading = false;
            }).finally(()=>{
                this.loading = false;
            })
        },
        /**
         * 添加答案
         */
        addAnswer(){
            if(this.answerList.length<4){
                const length = this.answerList.length;
                this.answerList.push({
                    sort:sortArr[length],
                    text:'',
                    key:length+1
                })
            }
        },
        /**
         * 删除答案
         */
        delAnswer(obj,index){
            if(this.answerList.length<=1){
                this.$message.error('至少保留一个答案');
                return;
            }
            if(this.rightKey==obj.key){
                this.rightKey = 0;
            }
            this.answerList.splice(index,1);
            this.answerList.forEach((item,i)=>{
                item.sort = sortArr[i],
                item.key = i+1
            })
        },
        saveQuestion(){
            if(this.title.length==0){
                this.$message.error('请输入题目');
                return;
            }
            if(this.answerList.length==0){
                this.$message.error('每题最少一个答案');
                return;
            }
            const index = this.answerList.findIndex(item=>item.text.length==0)
            if(index>=0){
                this.$message.error('请先添加答案并设置正确答案');
                return;
            }
            if(this.rightKey===0){
                this.$message.error('请设置正确答案');
                return;
            }
            if(this.id!=''){
                this.updateQuestion()
            }else{
                this.addQuestion()
            }
        },
        /**
         * 保存题目答案
         */
        addQuestion(){
            const query = {
                title:this.title,
                type:this.type,
                difficultyType:this.difficultyType,
                rightKey:this.rightKey
            }
            query.answerA = this.answerList.find(item=>item.sort==='A').text;
            const answerB = this.answerList.find(item=>item.sort==='B');
            const answerC = this.answerList.find(item=>item.sort==='C');
            const answerD = this.answerList.find(item=>item.sort==='D');
            if(answerB){
                query.answerB = answerB.text;
            }
            if(answerC){
                query.answerC = answerC.text;
            }
            if(answerD){
                query.answerD = answerD.text;
            }
            this.loading = true;
            this.$http.post(this.$server.addQuestion,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.$message.success('题目添加成功');
                    this.$router.go(-1)
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        /**
         * 编辑题目
         */
        updateQuestion(){
            const query = {
                id:this.id,
                title:this.title,
                type:this.type,
                difficultyType:this.difficultyType,
                rightKey:this.rightKey
            }
            query.answerA = this.answerList.find(item=>item.sort==='A').text;
            const answerB = this.answerList.find(item=>item.sort==='B');
            const answerC = this.answerList.find(item=>item.sort==='C');
            const answerD = this.answerList.find(item=>item.sort==='D');
            if(answerB){
                query.answerB = answerB.text;
            }
            if(answerC){
                query.answerC = answerC.text;
            }
            if(answerD){
                query.answerD = answerD.text;
            }
            this.loading = true;
            this.$http.post(this.$server.updateQuestion,query).then(res=>{
                this.loading = false;
                if(res.status==200){
                    this.$message.success('题目编辑成功');
                    this.$router.go(-1)
                }
            }).finally(() => {
                this.loading = false;
            })
        }       
    }
}
</script>
<style lang="scss" scoped>
    .add-question-edit{
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding:20px;
            .box{
                margin:25px 0;
                label{
                    font-size: 16px;
                    margin-right: 10px;
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 20px;
                }
            }
            .radio-box{
                label{
                    width: 64px;
                }
            }
            .input-box{
                /deep/ .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: 535px;
                }
            }
            .button-box{
                padding-left:77px;
            }
            .answer-item{
                margin:20px 0;
                p{
                    display: inline-block;
                    vertical-align: middle;
                    width: 28px;
                    font-size: 16px;
                    line-height: 20px;
                }
                /deep/ .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: 370px;
                }
                .el-radio{
                    margin-left:10px;
                }
                i{
                    font-size: 20px;
                    display: inline-block;
                    vertical-align: middle;
                    cursor: pointer;
                }
            }
            .btns-box{
                text-align: center;
                margin-top:20px;
                button{
                    margin:0 10px;
                }
            }
        }
    }
</style>
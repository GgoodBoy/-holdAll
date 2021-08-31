<template>
  <div>
    <div class="page-header">
        <el-row>
            <el-col :span="12">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
        </el-row>
        <div class="keyword">
            <el-input
                style='width:200px;margin-right:5px;'
                v-model="cellphones"
                placeholder="输入手机号码查询"
                maxlength="20"
                clearable
            />
            <el-button type="primary" @click="search">查询</el-button>
        </div>
    </div>
    <div class="page-content">
        <div class="my-table">
            <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%">
                <el-table-column
                    prop="cellphone"
                    label="手机号"
                    align="center"
                    min-width="40"/>
                <el-table-column
                    prop="createdAt"
                    label="答题时间"
                    min-width="200"
                    align="center"
                    show-overflow-tooltip/>
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="80"
                >
                    <template slot-scope="scope">
                        <div class="btn-box">
                            <el-button type="text" size="small" class="handle-btn" @click="checkList(scope.row)" v-if="$authJudge('questionbank:update')">详情</el-button>
                        </div>
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
      </div>
    </div>
    <el-dialog
      v-loading="dialogLoading"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :width="'500px'"
      :top="'30vh'"
      title=""
      center>
        <div class="dialogDettailBox">
            <div class="detailBox" v-for="(item1,indexI) in dataObjContent" :key="indexI">
                <div class="detailTite">{{item1.title}}</div>
                <div class="detailList">
                    <div class='listInfo' v-for="(item2,indexJ) in item1.questionAnswerList" :key="indexJ">
                        <div>{{listLetter[indexJ]}}</div>
                        <div>. {{item2.answerName}}</div>
                    </div>
                </div>
                <div class="detailAnswer">
                    <div>正确答案:{{item1.answers}}</div>
                    <div>用户选择:{{item1.userAnswers}}</div>
                </div>
            </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {      
            titleList:[
                {
                    name:'题库管理',
                    pathInfo:'/questionBank'
                },
                {
                    name:'查看题目',
                    pathInfo:''
                }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            tableData:[],
            loading:false,
            dialogLoading:false,
            dialogVisible:false,
            cellphones:'',
            pageNo:1,
            id:'',
            dataObjContent:[],
            listLetter:['A','B','C','D','E','F','G','H','I','J']
        };
    },
    created() {
        this.id = this.$route.query.id||'';
        this.getList(1)
    },
    components: {
        breadcrumb
    },
    methods: {
        getList(num){
            var self = this;       
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            const query = {
                params:{
                    cellphone:self.cellphones,
                    pageNo:self.pageNo,
                    pageSize:10
                }
            };
            self.$http.get(self.$server.getQuestionBankUserAnswerRecord+self.id,query).then(res=>{
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
                    self.$nextTick(function(){
                        self.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        },
        //查询
        search(){
            this.getList(1);
        },
        //详情
        checkList(data){
            this.dialogVisible = true;
            this.dataObjContent=[];
            setTimeout(()=>{
                let dataList = JSON.parse(data.questionContent);
                dataList.forEach((element,index)=>{
                    element.questionAnswerList.forEach((element_i,index_i)=>{
                        if(element_i.isTrue==1){
                            let valse= '';
                            valse=this.listLetter[index_i];
                            if(dataList[index]['answers']){
                                dataList[index]['answers'] = dataList[index]['answers']+','+valse;
                            }else{
                                dataList[index]['answers'] = valse;
                            }
                        }
                        if(element_i.choose ==1){
                            let valse= '';
                            valse=this.listLetter[index_i];
                            if(dataList[index]['userAnswers']){
                                dataList[index]['userAnswers'] = dataList[index]['userAnswers']+','+valse;
                            }else{
                                dataList[index]['userAnswers'] = valse;
                            }
                        }                    
                    })
                });
                this.dataObjContent = dataList;
            },100);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getList(Number(num))
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
        .top-number{
            line-height: 40px;
            font-size: 14px;
            color:#aaa;
        }
    }
    .page-content{
        .my-table{
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;                
            }
        }
    }
    .dialogDettailBox{
        max-height: 450px;
        overflow-y: auto;
        .detailBox:not(:nth-last-child(1)){
            border-bottom:1px solid #f4f4f4;
        }
        .detailBox{
            padding:20px;
            .detailTite{
                text-align:left;
                font-size: 14PX;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;                
            }
            .detailList{
                .listInfo{
                    display: flex;
                    justify-content:left;
                    flex-direction:row;
                    div:nth-child(1){
                        width: 20px;
                        text-align:center;
                    }
                }
                >div{
                    padding: 5px 20px;
                }
            }
            .detailAnswer{
                display: flex;
                flex-direction: column;
                align-items: left;
                padding: 10px 5px;
                div{
                    margin: 0 20px 20px 0;
                    font-size: 14PX;
                }
            }
        }
    }

</style>


<template>
    <div>
        <el-row class="lLine40 headerDiv">
            <el-col class="lSize18">兴趣管理</el-col>
            <el-col class="lRight-r">
                <el-row>
                    <el-col :span="2" class="lCenter-r">添加兴趣</el-col>
                    <el-col :span="5">
                        <div class="iSeachEven">
                            <el-input v-model.trim="title"
                                    placeholder="添加兴趣"
                                    class="search-form"
                                    width="100%"
                                    maxlength="4"
                                    clearable
                                    @keyup.native="proving1"
                                    ></el-input>
                                    
                        </div>
                    </el-col>
                    <el-col :span="1" class="lCenter-r">{{title.length}}/4</el-col>
                    <el-col :span="2" v-if="$authJudge('interest:add')"><el-button class="redBackColor butColorF"  @click="addHappy">添加</el-button></el-col>
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
                        min-width="20">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="兴趣名称"
                        align="center"
                        min-width="100">
                    </el-table-column>                    
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="20"
                        >
                        <template slot-scope="scope">
                            <el-row> 
                                <el-col :span="11" v-if="$authJudge('interest:edit')">
                                    <el-button type="text" class="black-btn" @click="channeUpdateEven(scope.row)">编辑</el-button>
                                </el-col>                                                                                               
                                <el-col :span="11" :offset="2" v-if="$authJudge('interest:del')">
                                    <el-button type="text" class="black-btn lCenter-r" @click="channeRemoveBatch(scope.row)">删除</el-button>
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
        <el-dialog
        :visible.sync="centerDialogVisible"
        :close-on-click-modal='false'
        title="编辑"
        width="30%">
            <el-row class="lLine30">
                <el-col :span="16" :offset="2" class="lCenter-r">
                    <el-input v-model.trim="channelnewName"
                        class="search-form"
                        maxlength="4"
                        @keyup.native="proving2"
                        width="100%"></el-input>                                
                </el-col>
                <el-col :span="4" class="lRight-r">
                    <el-button class="redBackColor butColorF" @click="isChannelOkEven()">确 定</el-button>
                </el-col>
            </el-row>                         
        </el-dialog>    
        <el-dialog
        title="删除"
        :visible.sync="channelDelDialogVisible"
        width="30%"
        > 
            <el-row class="lLine30">
                <el-col class="lCenter-r">确定要删除这个兴趣吗</el-col>
            </el-row>                         
            <el-row  class="lLine30 lMarginTop40">
                <el-col class="lCenter-r">
                    <el-button @click="isChannelNoEvenTwo()">取 消</el-button>
                    <el-button class="redBackColor butColorF" @click="isChannelOkEvenTwo()">确 定</el-button>                        
                </el-col>                        
            </el-row>                    
        </el-dialog>                            
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
          tableData: [],
          loading:true,
          pageNo:1,
          pageSize:10, 
          pageAtion:{
            pageTotal:0,
            paginationPage:1
          },       
          centerDialogVisible: false,
          channelDelDialogVisible:false,
          channelIDs:"",
          channelnewName:'',
          oldChannelnewName:'',
          title:'',
          disabledState:false
        }
    },
    created(){
        // if(this.environmenttarget=='prod'){
        //     this.urlScienceBools = 1;
        // }else if(this.environmenttarget=='beta'){
        //     this.urlScienceBools = 2;
        // }else{
        //     this.urlScienceBools = 1;
        // };
        this.getStudylist(1);
    },
    methods:{
        proving1(){
            this.title=this.title.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
        },  
        proving2(){
            this.channelnewName=this.channelnewName.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'');
        },         
        isChannelOkEven(){
            var self = this; 
            var params = {
                name:self.channelnewName,
                id:self.channelIDs
            };
            if(self.oldChannelnewName == self.channelnewName){
                 this.centerDialogVisible = false;
                 return;
            }
            self.$http.post(self.$server.interestUpdate,params).then(res=>{
                switch (res.status) {
                    case 200:
                        self.centerDialogVisible = false;
                        self.getStudylist(1);                     
                        break;
                    // case 417:
                    //     self.$message.error(res.content.msg);
                    //     break; 
                }
            })
        },
        isChannelNoEvenTwo(){
            this.channelDelDialogVisible = false;
        },
        isChannelOkEvenTwo(rows){
            var self = this;
            self.channelDelDialogVisible = false;
            var params = {
                id:self.channelIDs
            };
            self.$http.post(self.$server.interestDel(params)).then(res=>{
            switch (res.status) {
                case 200:
                        self.channelDelDialogVisible = false;
                        self.getStudylist(1);                       
                    break;
                // case 417:
                //         self.delDialogVisibleBool = true;
                //     break; 
                }                        
            }) 
        }, 
        channeUpdateEven(rows){
            var self = this;
            self.oldChannelnewName = rows.name;
            self.channelnewName = rows.name;
            self.channelIDs = rows.id;
            self.centerDialogVisible = true;  
        },   
        channeRemoveBatch(rows){
            this.channelIDs = rows.id;
            this.channelDelDialogVisible = true;
        },                        
        //添加
        addHappy(){
            var self =this;
            if(!self.disabledState){
                self.disabledState = !self.disabledState;
                self.$http.post(self.$server.interestAdd,{name:self.title}).then(res=>{
                    if(res.status==200){
                        self.title = '';
                        self.disabledState = !self.disabledState;
                        self.$message.success({ message: "添加成功" });
                        self.getStudylist(1);
                    }
                })
                .catch(err => {
                    self.disabledState = !self.disabledState;
                });
            }        
        },
        getStudylist(num){
            var self = this;
            if(num){
                self.pageNo = num;
            }
            self.loading = true; 
            var params = {
                pageNo:self.pageNo,
                pageSize:self.pageSize
            };
            self.$http.get(self.$server.interestQuery(params)).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                       if(!nextPage&&prePage!=0){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = (prePage+1)*10+index+1;
                                return element;
                            });
                        }else if(!prePage&&!nextPage){
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
                    self.loading = false; 
               }
                console.log(res);
            })            
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }
    },
    components:{},
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
// .headerDiv .search-form {
//         position: relative;
//         &.el-icon-search:before {
//             position: absolute;
//             font-size: 18px;
//             right: 10px;
//             top: 10px;
//             background: #fff;
//             font-weight: 900;
//         }
//     }
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
.iSeachEvenSun{
    width: 25%;
    position: relative;
    margin-bottom: 20px;
}
.iSeachEvenSun i{
    position: absolute;
    right: 8px;
    font-size: 18px;
    top: 12px;
    cursor: pointer;
}
.iSeachEvenSun .search-form-sun{
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
.block{
        text-align: center;
        padding: 40px 0 40px 0;
        background: #fff;
    } 
.black-btn-ok{
    color:#9E0E00 !important; 
} 
.black-btn-no{
    color: #cccccc !important;
}   
</style>



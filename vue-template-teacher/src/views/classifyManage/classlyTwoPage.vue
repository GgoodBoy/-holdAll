<template>
    <div class="classLyTwoContent">
        <div class="page-header">
            <el-row>
                <el-col :span="20">
                     <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
                 <el-col :span="4" >
                     <el-button type="primary" class="my-add-btn" :disabled="disabledAdd" @click="handleClassify(1)">添加二级分类</el-button>               
                </el-col>               
            </el-row>
        </div>        
        <div class="page-content">
            <p class="content-p1">一级分类 : {{oneClassilyName}}</p>
            <div class="my-table">
                <el-table
                    border
                    max-height="600"
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        min-width="40">
                    </el-table-column>           
                    <el-table-column
                        prop="name"
                        label="二级分类名称"
                        align="left"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>                      
                    <el-table-column
                        label="类型"
                        align="left"
                        min-width="50"
                        show-overflow-tooltip
                        >
                            <template slot-scope="scope">
                                {{scope.row.mtype==1?'成人':'少儿'}}                                  
                            </template>                        
                    </el-table-column>   
                    <el-table-column 
                        class-name="classify-name"
                        align="center"
                        label="排序序号"
                        min-width="100"
                        show-overflow-tooltip>
                            <template slot-scope="scope">
                                <P>{{scope.row.sort?scope.row.sort:''}}</P>
                            </template>                                 
                    </el-table-column>                                      
                    <el-table-column label="操作"
                                    align="center"
                                    width="200">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                class="editor-btn"
                                                @click="sortClassType(scope.row)">排序</el-button>                                        
                                        <el-button type="text"
                                        class="editor-btn"
                                                @click="handleClassify(2,scope.row)">编辑</el-button>
                                        <el-button type="text"
                                        class="editor-btn"
                                                @click="removeClassify(scope.row)">删除</el-button>                                   
                                    </template>
                    </el-table-column>                                        
                </el-table>             
            </div>
        </div>
        <el-dialog
            :visible.sync="removeTwoClassilyDialog"
            width="30%"
            center
            :close-on-click-modal='false'
            :show-close="false"            
            >
            <div style="text-align: center;">确定要删除这个二级分类吗</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeTwoClassilyDialog = false">取 消</el-button>
                <el-button type="primary" @click="removeTwoClassily">确 定</el-button>
            </span>
        </el-dialog>   
        <el-dialog
            :visible.sync="updateTwoClassilyDialog"
            width="30%"
            center
            :close-on-click-modal='false'
            :show-close="false"
            >
            <div style="overflow: auto;">
                <div style="float: left;width: 80%;">
                    <el-input placeholder="请输入" maxlength="5" v-model="input"></el-input>
                </div>
                <div style="float: left;line-height: 40px;text-align: center;width: 20%;">{{input.length||0}}/5</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateTwoClassilyDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateTwoClassily">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="sortClassTypeDetail"
            :close-on-click-modal="false"
            style="text-align: center;"
            width="20%">      
                <div class="layout-row-start" style="margin-bottom:20px;">
                    <div>移动到第</div>
                    <el-input style="width:100px;margin:0 5px;" v-model="inputSort"></el-input>
                    <div>位</div>
                </div>
                <el-button
                    class="redBackColor butColorF"
                    @click="isOkSortClass">确定</el-button>
                <el-button
                    class="butColorF butColor6"
                    @click="sortClassTypeDetail=false">取消</el-button>                                                
        </el-dialog>                                   
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            removeTwoClassilyDialog:false,
            updateTwoClassilyDialog:false,
            tableData:[],
            twoDetailId:'',
            titleList:[
                    {
                        name:'分类管理',
                        pathInfo:'/classifyAdd'
                    },
                    {
                        name:'添加分类',
                        pathInfo:'/classifyAdd'
                    },
                    {
                        name:'二级分类',
                        pathInfo:''
                    } 

                ], 
            selectTableData:'',
            disabledAdd:false,
            input:'',
            pageSize:10,
            pageNo:1,
            loading:false,
            typeInfo:'',
            oneClassilyName:'',
            selectData:'',
            sortClassTypeDetail:false,
            inputSort:'',
            disabledState:false               
        };
    },
    metaInfo: {},
    components: {breadcrumb},
    watch: {
    },
    created() {
        this.twoDetailId = this.$route.params.id;
        this.oneClassilyName = this.$route.query.name;
        this.getTableList();
    },
    methods: {
        sortClassType(data){
            this.sortClassTypeDetail = true;
            this.selectData = data;
        },
        handleClassify(type,item){
            this.selectTableData = item;
            this.typeInfo = type;
            this.input = '';
            if(type==1){
                this.updateTwoClassilyDialog = true;
            }else{
                this.updateTwoClassilyDialog = true;
                this.input = item.name;
            }
        },
        removeClassify(item){
            this.removeTwoClassilyDialog=true;
            this.selectTableData = item;
        },
        removeTwoClassily(){
            this.removeTwoClassilyDialog=false;
            let query = {
                    id:this.selectTableData.id
            }
            this.$http.post(this.$server.delCategoryTwoCategory,query).then(res=>{
                if(res.status==200){
                    this.getTableList();
                }
            })            
        },
        getTableList(){
            this.loading = true;
            let query = {
                    id:this.twoDetailId,
                    pageSize:20,
                    pageNo:1
            }
            this.$http.get(this.$server.getCategoryTwocategory(query)).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    var list= [];
                    if(res.content){
                        list = res.content.map((data,index)=>{
                            data['sortId'] = index+1;
                            return data;
                        });
                        this.tableData = list;
                        if(this.tableData.length>=20){
                            this.disabledAdd=true;
                        }else{
                            this.disabledAdd=false;
                        }
                    }
                }
            })
        },      
        //确定排序
        isOkSortClass(){
            var that = this;
            if(this.inputSort==''){
                that.$message.error("请填写排序号");
                return;
            }
            if(this.inputSort==0){
                that.$message.error("序号不能为0");
                return;
            }            
            let query = {
                id:this.selectData.id,
                sort:this.inputSort
            }  
            that.$http.post(that.$server.setCategorySort,query).then(res=>{
                if(res.status==200){
                    this.sortClassTypeDetail = false;
                    this.inputSort = '';
                    that.$message.success("排序成功");
                    that.getTableList();
                }
            })  
        },          
        updateTwoClassily(){
            var self = this;
            if(this.input){
                this.updateTwoClassilyDialog = false;
                if(this.typeInfo==1){
                    let query = {
                            id:this.twoDetailId,
                            name:this.input
                    }
                    if(!self.disabledState){
                        self.disabledState = !self.disabledState;                       
                        this.$http.post(this.$server.addCategoryTwoCategory,query).then(res=>{
                            if(res.status==200){
                                self.disabledState = !self.disabledState;
                                this.getTableList();
                            }
                        }).catch(()=>{
                            self.disabledState = !self.disabledState;
                            this.loading = false;
                        })
                    }
                }else{
                    let query = {
                            id:this.selectTableData.id,
                            name:this.input
                    }
                    this.$http.post(this.$server.editCategoryTwoCategory,query).then(res=>{
                        if(res.status==200){
                            this.getTableList();
                        }
                    }).catch(()=>{
                        this.loading = false;
                    })
                }
            }else{
                this.$message.error('请填写二级分类名称');
            }       
        }
    }
};
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
</style>
<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 10px 30px 10px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
        }
    }
    .page-content{
        .content-p1{
            line-height: 30px;
            background: #fff;
            padding: 8px;
            font-size: 14px;
            color: #666;
        }
    }
.paging {
    margin: 60px 0;
}
</style>


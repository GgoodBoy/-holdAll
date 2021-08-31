<template>
    <div class="two-level-tag" @click="hideSort">
        <div class="page-header lMarginBO30">
            <el-row>
                <el-col>
                     <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>               
            </el-row>            
            <el-button v-if="$authJudge('classify:appadultsecond:add')" type="primary" class="my-add-btn lMarginBO10" @click="showDialog">添加</el-button>
        </div>
        <div class="my-table">
            <el-table
                border
                :data="tableData"
                v-loading="loading"
                style="width: 100%">
                <el-table-column
                    prop="sortId"
                    label="序号"
                    align="center"
                    min-width="60"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="分类名称"
                    min-width="300"
                    align="center"
                    show-overflow-tooltip>
                </el-table-column>                                 
                <el-table-column
                    label="操作"
                    align="center"
                    min-width="100">
                        <template slot-scope="scope">
                            <div class="sort-box" :class="scope.row.sortFlag?'show':''" @click.stop="test">
                                <div><p>移动到第</p><el-input v-model="scope.row.sort" size="mini" maxlength="4" @keypress.native="toSort($event,scope.row)" @input.native="changeEvent"></el-input><p>位</p></div>
                                <i class="el-icon-circle-close close" @click="closeSortBox"></i>
                            </div>
                            <div class="btn-box">
                                <el-button v-if="$authJudge('classify:appadultsecond:sort')" type="text" class="black-btn" @click.stop="sortRow(scope.row)">排序</el-button>
                            </div> 
                            <div class="btn-box">
                                <el-button v-if="$authJudge('classify:appadultsecond:del')" type="text" class="black-btn" @click="delRow(scope.row)">删除</el-button>
                            </div>                                              
                        </template>                    
                </el-table-column>                                                
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page.sync="pageNo"
                    :page-size="pageSize"
                    :total="total"
                >
                </el-pagination>
            </div>             
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'500px'" :show-close="false">
            <div class="search-box">
                <el-input placeholder="输入分类名称查询" size="medium" clearable prefix-icon="el-icon-search" v-model="searchKey" maxlength="10" @keypress.native="pressEvent($event)"></el-input>
                <el-button type="primary" size="medium" @click="search">搜索</el-button>
            </div>
            <div class="list" ref="scrollBox">
                <el-checkbox-group
                    v-model="dialogArr"
                >
                    <div class="item" v-for="(item,index) in editDialogList" :key="index">
                        <el-checkbox :label="item.id" :disabled="item.disabled">{{item.name}}</el-checkbox>
                    </div>
                </el-checkbox-group>
                <div class="loading" v-show="editDialogLoading"><div class="loading-icon" v-loading="true"></div></div>
                <p class="empty-tip" v-if="isHttp&&editDialogList.length==0">没有搜索到您想要的内容</p>
            </div>
            <div slot="footer" class="btns">
                <el-button @click="editDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="dialogSure" size="medium">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g //特殊字符(除了数字、字母、汉字) 
}
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
            loading:false,
            tableData:[],
            labelIds:[],
            pageNo:1,
            initData:false,
            pageSize:10,
            total:10,
            editDialogVisible:false,
            searchKey:'',
            isHttp:false,
            editDialogList:[],//弹窗list
            editDialogLoading:false,
            dialogArr:[],//多选集合
            editDialogCheckList:[],//多选集合，选择一次push一次，
            isChange:false,
            titleList:[
                    {
                        name:'分类管理',
                        pathInfo:''
                    },
                    {
                        name:'APP成人二级页分类设置',
                        pathInfo:'/classifyAdd'
                    }
                ]            
        }
    },
    components: {breadcrumb},
    watch:{
        pageNo(cur,old){
            if(cur==0) return;
            this.getTableList()
        }
    },
    created(){
        this.getTableList()
    },
    methods:{
        getTableList(){
            this.loading = true;
            let query = {
                params:{
                   type:1,
                   pageNo:this.pageNo,
                   pageSize:this.pageSize,
                }
            }
            this.$http.get(this.$server.getAppSecondPageClassifyList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content.classifyPageVo.list;
                    this.tableData.forEach((item)=>{
                        item.sortId = item.sort
                    })
                    this.labelIds = res.content.labelIds;
                    this.total = res.content.classifyPageVo.total;
                }
            })
        },
        showDialog(){
            this.dialogArr = this.labelIds.map(id=>id)
            this.editDialogVisible = true;
            this.getClassifyList();    
        },
        dialogSure(){
            if(this.dialogArr.length==0){
                this.$message.error('请选择分类');
                return;
            }
            let arr = [...this.dialogArr];
            this.labelIds.forEach(item=>{
                let index = arr.findIndex(id=>id==item);
                if(index>=0){
                    arr.splice(index,1)
                }
            })
            if(arr.length==0){
                this.editDialogVisible = false;
                return;
            }
            let labelIds = arr.join(`,`);
            let query = {
                classifyIds:labelIds
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            this.$http.post(`${this.$server.addAppSecondPageClassify}/1`,query).then(res=>{
                loadingInstance.close()
                if(res.status==200){
                    this.editDialogVisible = false;
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                    this.$message({
                        message:'添加成功！',
                        type:'success'
                    })
                }
            }).catch(()=>{
                loadingInstance.close()
            })
        },
        getClassifyList(){
            this.editDialogLoading = true;
            this.isHttp = false;
            let params = {
                name:this.searchKey
            }
            this.$http.get(`${this.$server.getClassifyList}/1`,{params}).then(res=>{
                if(res.status==200){
                    let arr = res.content;
                    arr.forEach(item=>{
                        let index = this.dialogArr.findIndex(id=>id==item.id);
                        item.disabled = index>=0?true:false;
                    })
                    this.editDialogList = arr
                    this.editDialogLoading = false;
                    this.isHttp = true;
                }
            })
        },
        test(){

        },
        changeEvent(){
            this.isChange = true;
        },
        closeSortBox(){
            let arr = [...this.tableData];
            arr.forEach(item=>item.sortFlag=false)
            this.tableData = arr
        },
        hideSort(){
            let obj = this.tableData.find(item=>item.sortFlag==true);
            if(this.isChange){
                this.sortEvent(obj)
            }
            else{
                let arr = [...this.tableData];
                arr.forEach(item=>item.sortFlag=false)
                this.tableData = arr
            }
        },
        sortRow(obj){
            this.tableData.forEach(item=>item.sortFlag=false)
            let index = this.tableData.findIndex(item=>item.id==obj.id);
            obj.sortFlag =!obj.sortFlag
            obj.sort = obj.sortId;
            this.$set(this.tableData,index,obj)
            this.isChange = false;
        },
        toSort(e,obj){
            if(e.keyCode==13){
                if(this.isChange){
                    this.sortEvent(obj)
                }
                else{
                    let arr = [...this.tableData];
                    arr.forEach(item=>item.sortFlag=false)
                    this.tableData = arr
                }
            }
        },
        sortEvent(obj){
            let regExp = /^[0-9]+$/
            if(!regExp.test(obj.sort)){
                this.$message.error('请输入1-4位的正整数');
                return false;
            }
            let query = {
                sort:obj.sort,
                type:1
            }
            this.$http.post(`${this.$server.sortAppSecondPageClassify}/${obj.recordId}`,query).then(res=>{
                if(res.status==200){
                    this.$message({
                        message: '排序成功！',
                        type: 'success'
                    });
                    let index = this.tableData.findIndex(item=>item.id==obj.id);
                    obj.sortFlag = false;
                    this.$set(this.tableData,index,obj);
                    this.isChange = false;
                    this.pageNo = 0;
                    this.$nextTick(()=>{
                        this.pageNo = 1;
                    })
                }
            })
        },
        delRow(obj){
            this.$confirm('确定要删除这个分类吗？删除后APP相关二级页面将不再展示该分类', '删除确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                let query = {
                    type:1
                }
                this.$http.post(`${this.$server.delAppSecondPageClassify}/${obj.recordId}`,query).then(res=>{
                    if(res.status==200){
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.pageNo = 0;
                        this.$nextTick(()=>{
                            this.pageNo = 1;
                        })
                    }
                })
            }).catch(()=>{

            })
            
        },
         /**
         * 回车搜索
         */
        pressEvent(e){
            if(e.keyCode==13){
                this.search()
            }
        },
        /**
         * 搜索
         */
        search(){
            this.searchKey = this.searchKey.replace(regExp.specialChar,'');
            this.$nextTick(()=>{
                this.editDialogList = []
                this.$nextTick(()=>{
                    this.getClassifyList()
                })
            })
        },
    }
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
</style>

<style lang="scss" scoped>
    .two-level-tag{
        .page-header{
            height: 40px;
            margin-bottom:20px;
        }
        .page-title{
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            display: block;
            float: left;
            line-height: 40px
        }
        .my-add-btn{
            float: right!important;
        }
        .lCenter-r{
            position: relative;
            z-index: 2;
            background: #fff;
        }
        .sort-box{
            position: absolute;
            z-index: 3;
            left: 0;
            top: 10px;
            padding: 7px;
            box-shadow: 0 0 5px #c2c2c2;
            background: #fff;
            transition: all 0.3s;
            opacity: 0;
            visibility: hidden;
            &.show{
                opacity: 1;
                visibility: visible;
                transform: translateX(-140px);
            }
            .el-input,p{
                display: inline-block;
                vertical-align: middle;
                margin:0 1px;
            }
            .el-input{
                width: 66px!important;
            }
            input{
                text-align: center;
            }
            .close{
                position: absolute;
                top:-8px;
                right: -8px;
            }
        }
        .btn-box{
            position: relative;
            width: 45%;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            z-index: 2;
        }
        .edit-dialog{
            left: 5%;
            .search-box{
                font-size: 0;
                .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: calc(100% - 78px);
                }
                button{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 8px;
                }
            }
            .list{
                margin:10px 0;
                max-height: 500px;
                overflow: auto;
                .item{
                    margin:10px 0;
                    .name{
                        width: 310px;
                    }
                } 
            }
            .btns{
                text-align: center;
            }
            .empty-tip{
                text-align: center;
                color:#aaa;
            }
        }
        .block{
            text-align: center;
            padding: 40px 0 40px 0;
            background: #fff;
        }
    }
</style>
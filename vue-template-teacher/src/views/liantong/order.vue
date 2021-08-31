<template>
    <div class="liantong-older-page">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div class="page-content">
            <div class="search-area">
                <el-input placeholder="请输入手机号查询" v-model="cellphone"></el-input>
                <!-- <el-select v-model="prodType" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                 -->
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" style="float:right" @click="exportTable">导出</el-button>
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
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        label="手机号"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                     <el-table-column
                        prop="orderNum"
                        label="订单"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createdAt"
                        label="订单时间"
                        align="center"
                        min-width="30"
                    >
                    </el-table-column>   
                    <!-- <el-table-column
                        label="类型"
                        align="center"
                        min-width="60"
                    >
                        <template slot-scope="scope">
                           <div v-if="scope.row.prodType==1">原价</div>
                           <div v-else-if="scope.row.prodType==2">一折会员</div>
                           <div v-else>四折会员</div>                         
                        </template> 
                    </el-table-column>  -->
                    <el-table-column
                        prop="createdAt"
                        label="状态"
                        align="center"
                        min-width="30"
                    >
                        <template slot-scope="scope">
                            {{scope.row.state==1?'开通':'取消'}}                                 
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
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import pagination from "@/components/pagination";
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){
        return{
            titleList:[
                {
                    name:'流量包管理',
                    pathInfo:'/liantongManage/list'
                },
                {
                    name:'订单',
                    pathInfo:''
                }               
            ],
            options: [{
            value: '1',
            label: '原价'
            }, {
            value: '2',
            label: '一折会员'
            }, {
            value: '3',
            label: '四折会员'
            }],            
            id:'',
            prodType:'',
            cellphone:'',
            tableData:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            total:1
        }
    },
    components: {
        breadcrumb,pagination
    },
    watch:{
        pageNo(cur,old){
            if(cur>=1){
                this.getList()
            }
        }
    },
    created(){
        this.id = this.$route.params.id;
        this.getList()
    },
    methods:{
        /**
         * 获取订单
         */
        getList(){
            this.loading = true;
            // let query = {
            //     params:{
            //         id:this.id,
            //         cellphone:this.cellphone,
            //         prodType:this.prodType,
            //         pageSize:this.pageSize,
            //         pageNo:this.pageNo
            //     }
            // }
            let query = {
                params:{
                    id:this.id,
                    cellphone:this.cellphone,
                    pageSize:this.pageSize,
                    pageNo:this.pageNo
                }
            }            
            this.$http.get(this.$server.getOrderList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.sortId = (this.pageNo-1)*this.pageSize+index+1;
                    })
                }
            }).catch(()=>{
                this.loading = false;
            })
        },
        /**
         * 查询
         */
        search(){
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        /**
         * 导出
         */
        exportTable(){
            // let url = `${this.$server.exportUnicom}?id=${this.id}&cellphone=${this.cellphone}&prodType=${this.prodType}&token=${getToken()}`
            let url = `${this.$server.exportUnicom}?id=${this.id}&cellphone=${this.cellphone}&token=${getToken()}`
            window.open(url);    
        }
    }
}
</script>       
<style lang="scss" scoped>
    .liantong-older-page{
        .page-header{
            background: #fff;
            padding: 20px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            font-size: 16px;
            margin-top:20px;
            .block{
                text-align: center;
                margin-top:60px;
                padding-bottom:60px;
            }
            .search-area{
                margin-bottom:20px;
                .el-input{
                    width: 250px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>
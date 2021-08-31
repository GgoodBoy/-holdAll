<template>
    <div class="detail-one">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="headers">
            <div class="two">
                <div class="left">
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
                    <el-button style="background:#b4272d;color:#fff;">查询</el-button>
                </div>
                <div class="right">
                    <el-button style="background:#b4272d;color:#fff;">导出</el-button>
                </div>
            </div>
        </div>
        <div class="content">
            <el-table
            ref="multipleTable"
            :data="tableData"
            border
            max-height="400"
            v-loading="loading"
            tooltip-effect="dark"
            style="width: 100%"
            header-align='center'>
                <el-table-column
                label="错题名称"
                prop="sortId"
                align='center'
                min-width="150">
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="答题时间"
                align='center'
                min-width="150"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="用户选项"
                align='center'
                min-width="50"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="正确答案"
                align='center'
                min-width="50"
                show-overflow-tooltip>
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
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { Switch } from 'element-ui';
export default {
    data() {
        return {
            input:'',
            // value:'',
            tableData:[
                {
                    sortId:1,
                    courseName:'傻逼',
                    coursePrice:1
                }
            ],
            loading:false,
            options:[],
            titleList:[
                        {
                            name:'小程序',
                            pathInfo:''
                        },
                        {
                            name:'详情',
                            pathInfo:'/smallProgram/game/detail'
                        },
                        {
                            name:'错题本',
                            pathInfo:''
                        }],
            pageNo:1,
            pageSize:10,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            }
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
    },
    methods: {
        childPageValue(num){
            // this.selectPageNum = Number(num);
            if(Number(num)>0){
                // this.getSchoolList(Number(num))
            }            
        }    
    }
};
</script>

<style scoped lang="scss">
    .detail-one {
        .headers{
            padding: 20px;
            .two{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .left{
                    display: flex;
                    flex-direction: row;
                    justify-content:space-around;
                    align-items: center;                 
                }
            }
        }
        .content{   
            .block{
                text-align: center;
                margin-top:10px;
                padding-bottom:60px;
            }
        }
        .lCenter-r{
            text-align: center;
        }
    }
</style>


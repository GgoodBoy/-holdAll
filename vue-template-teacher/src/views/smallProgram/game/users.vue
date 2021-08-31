<template>
    <div class="game-detail">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="headers">
            <div class="two">
                <div class="left">
                    <el-input v-model="input" placeholder="请输入内容"></el-input>
                    <div class="selectBox">
                        <div class="title">类型</div>
                        <el-select v-model="value" placeholder="请选择" style="width:150px;">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="selectBox">
                        <div class="title">难度</div>
                        <el-select v-model="value" placeholder="请选择" style="width:150px;">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div> 
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
                label="微信昵称"
                prop="sortId"
                align='center'
                min-width="120">
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="手机号"
                align='center'
                min-width="150"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="当前关卡"
                align='center'
                min-width="80"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="当前段位"
                align='center'
                min-width="80"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="金币"
                align='center'
                min-width="100"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="答题数"
                align='center'
                min-width="70"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="错题率"
                align='center'
                min-width="70"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="星级"
                align='center'
                min-width="60"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="当前关卡分值"
                align='center'
                min-width="120"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="平均用时（秒）"
                align='center'
                min-width="120"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                label="操作"
                align='center'
                fixed="right"
                min-width="210">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toGoPage(scope.row,1)">错题本</el-button>
                        <el-button type="text" @click="toGoPage(scope.row,2)">领取奖项</el-button>
                        <el-button type="text" @click="toGoPage(scope.row,3)">金币明细</el-button>
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
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { Switch } from 'element-ui';
export default {
    data() {
        return {
            input:'',
            value:'',
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
        },
        toGoPage(data,type){
            switch (type) {
                case 1:
                    this.$router.push({path:'/smallProgram/game/detailOne'});
                    break;
                case 2:
                    this.$router.push({path:'/smallProgram/game/detailTwo'});
                    break;
                case 3:
                    this.$router.push({path:'/smallProgram/game/detailThree'});
                    break;
                default:
                    break;
            }
        }      
    }
};
</script>

<style scoped lang="scss">
    .game-detail {
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
                    .selectBox{
                        display: flex;
                        flex-direction: row;
                        justify-content:space-evenly;
                        align-items: center; 
                        margin-right: 5px;   
                        .title{
                            width: 30px;
                            text-align: right;
                            margin-right: 5px;
                        }                     
                    }               
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


<template>
    <div class="game-answer">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="headers">
            <div class="two">
                <div class="left">
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
                    <el-button style="background:#b4272d;color:#fff;">查询</el-button>
                </div>
                <div class="right">
                    <el-button style="background:#b4272d;color:#fff;">奖项设置  </el-button>
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
                label="关卡号"
                prop="sortId"
                align='center'
                min-width="60">
                </el-table-column>
                <el-table-column
                prop="courseName"
                label="当前关卡人数"
                align='center'
                min-width="150"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="coursePrice"
                label="关联题目"
                align='center'
                min-width="80">
                    <template slot-scope="scope">
                        {{scope.row.coursePrice==1?'成人':'少儿'}}
                    </template>                
                </el-table-column>
                <el-table-column
                prop="coursePrice"
                label="创建人"
                align='center'
                min-width="80">
                </el-table-column>
                <el-table-column
                prop="coursePrice"
                label="创建时间"
                align='center'
                min-width="80">
                </el-table-column>
                <el-table-column
                min-width='100'
                align='center'
                label="操作">
                    <template slot-scope="scope">
                        <el-button
                        @click="operationRow(scope.row,1)"
                        type="text"
                        size="small">
                        查看
                        </el-button>
                        <el-button
                        @click="operationRow(scope.row,2)"
                        type="text"
                        size="small">
                            关联题目
                        </el-button>
                        <el-button
                        @click="operationRow(scope.row,3)"
                        type="text"
                        size="small">
                            获奖详情
                        </el-button>
                        <el-button
                        @click="operationRow(scope.row,4)"
                        type="text"
                        size="small">
                            编辑奖项
                        </el-button>
                        <el-button
                        @click="operationRow(scope.row,5)"
                        type="text"
                        size="small">
                            删除奖项
                        </el-button>
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
        <el-dialog
            title=""
            :visible.sync="visibleDetail"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定要删除这道题目吗</p>
                <el-button type="primary" @click="detailDialog(1)">确定</el-button>
                <el-button @click="visibleDetail=false">取消</el-button>
        </el-dialog>        
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
            visibleDetail:false,
            options:[],
            titleList:[
                        {
                            name:'小程序',
                            pathInfo:''
                        },
                        {
                            name:'添加答题',
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
        detailDialog(){

        },
        operationRow(data,type){
            switch (type) {
                case 1:
                    this.$router.push({path:'/smallProgram/game/awardSetOne'});
                    break;
                case 2:
                    this.$router.push({path:'/smallProgram/game/awardSetTwo'});
                    break;
                case 3:
                    this.$router.push({path:'/smallProgram/game/awardSetThree'});
                    break;
                case 4:
                    this.$router.push({path:'/smallProgram/game/awardSetFours'});
                    break;
                case 5:
                    this.visibleDetail = true;
                    break;
            
                default:
                    break;
            }
        },
        childPageValue(num){
            // this.selectPageNum = Number(num);
            if(Number(num)>0){
                // this.getSchoolList(Number(num))
            }            
        },
        goTo(){
            this.$router.push({path:'/smallProgram/game/edit'});
        }        
    }
};
</script>

<style scoped lang="scss">
    .game-answer {
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


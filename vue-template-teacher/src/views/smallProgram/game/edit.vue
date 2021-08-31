<template>
    <div class="game-edit">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="content">
            <div class="editRadio">
                <div class="titlt">类型</div>
                <div>
                    <el-radio v-model="radio1" label="1">备选项1</el-radio>
                    <el-radio v-model="radio1" label="2">备选项2</el-radio>  
                    <el-radio v-model="radio1" label="3">备选项3</el-radio>
                    <el-radio v-model="radio1" label="4">备选项4</el-radio>                                      
                </div>
            </div>
            <div class="editRadio">
                <div class="titlt">难度</div>
                <div>
                    <el-radio v-model="radio2" label="1">备选项1</el-radio>
                    <el-radio v-model="radio2" label="2">备选项2</el-radio>  
                    <el-radio v-model="radio2" label="3">备选项3</el-radio>
                    <el-radio v-model="radio2" label="4">备选项4</el-radio>                      
                </div>                
            </div>
            <div class="editinput">
                <div class="titlt">题目名称</div>
                <el-input v-model="input" style="width:200px" placeholder="请输入内容"></el-input>
                <div>0/50</div>
            </div>
            <el-button class="editAddbut">添加题目</el-button>
            <div class="editList">
                <div class="list_li">
                    <div class="titlt">答案</div>
                    <div>A.</div>
                    <el-input v-model="input" style="width:200px" placeholder="请输入内容"></el-input>
                    <div>0/50</div>
                    <el-radio v-model="radio3" label="1">设置为正确答案</el-radio>
                </div>
                <div class="list_li">
                    <div class="titlt">答案</div>
                    <div>A.</div>
                    <el-input v-model="input" style="width:200px" placeholder="请输入内容"></el-input>
                    <div>0/50</div>
                    <el-radio v-model="radio3" label="1">设置为正确答案</el-radio>
                </div>                
            </div>
            <div class="editSave">
                <el-button>确定</el-button>
                <el-button>取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            input:'',
            value:'',
            tableData:[],
            loading:false,
            options:[],
            titleList:[
                        {
                            name:'小程序',
                            pathInfo:''
                        },
                        {
                            name:'答题配置',
                            pathInfo:''
                        }],
            pageNo:1,
            pageSize:10,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },
            radio1:1,
            radio2:1,
            radio3:1
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
    },
    methods: {
        operationRow(data,type){},
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
    .game-edit {
        .content{   
            padding: 20px;
            .editRadio,.editinput{
                display: flex;
                justify-content:flex-start;
                flex-direction: row;
                align-items: center;
                margin-bottom: 25px;
                .titlt{
                    width: 100px;
                    text-align: right;
                }
                >div{
                    margin-right: 10px;
                }
            }
            .editAddbut{
                background:#b4272d;
                color:#fff;
                margin-bottom:25px;
                margin-left: 130px;
            }
            .editSave{
                width: 50%;
                text-align: center;
            }
            .editList{
                .list_li{
                    display: flex;
                    justify-content:flex-start;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 15px;
                    .titlt{
                        width: 100px;
                        text-align: right;
                    }
                    >div{
                        margin-right: 10px;
                    }                    
                }
            }
        }
    }
</style>


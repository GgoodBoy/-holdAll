<template>
    <div class="game-awards">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="content">
            <div>
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
            </div>
            <div>
                <el-button>批量上传</el-button>
                <el-button>添加题目</el-button>                
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
            options:[],
            value:'',
            input:''
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {},
    methods: {

    }
};
</script>

<style scoped lang="scss">
    .game-awards {
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


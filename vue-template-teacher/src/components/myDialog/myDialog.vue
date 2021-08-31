<template>
    <el-dialog :visible.sync="showFlag"
               custom-class="common-dialog-header-bg"
               :title="title"
               width="660px"
               :show-close="false"
               @close="closeDialog"
    >
        <slot name="dialog-body"></slot>
        <div slot="footer"
             class="dialog-footer tc" v-if="footerStatus">
            <el-button plain
                       class="red-border-btn my-btn"
                       @click="close" v-show="btnFlag">取消</el-button>
            <el-button type="primary"
                       class="red-btn my-btn"
                       @click="save" v-show="btnFlag">确定</el-button>
        </div>
    </el-dialog>
</template>
<script type="application/ecmascript">
    export default{
        name:'my-dialog',
        data(){
            return{

            }
        },
        props:{
            showFlag:Boolean, //是否显示遮罩弹框；
            title:String, //Dialog 的标题
            cancelName:String, //自定义取消事件名字
            sureName:String, //自定义确定事件名字,
            btnFlag:{
                type:Boolean,
                default:()=>{
                    return true
                }
            },
            footerStatus:{
                type:Boolean,
                default:()=>{
                    return true
                }
            }
        },
        methods:{
            close(){
                this.$emit(this.cancelName,'')
            },
            save(){
                this.$emit(this.sureName,'')
            },
            closeDialog(){
                this.$emit("update:showFlag",false)
            }
        }
    }
</script>
<style lang="scss">
    .dialog-footer {
        margin: 0px 20px 15px 0;
    }
    .my-btn {
        width: 130px;
        margin: 0 35px;
    }
    .search-area{
        .el-icon-search{
            font-size: 18px;
            line-height: 40px;
            cursor: pointer;
        }
    }
</style>

<template>
    <div class="one-tree-warp">
        <div class="header" @click="changeStatus">
            <span class="icon-warp">
                <i class="el-icon-minus" v-show="checkBoxStatus"></i>
                <i class="el-icon-plus" v-show="!checkBoxStatus"></i>
            </span>
            <span>{{data.title}}</span>
        </div>
        <el-collapse-transition>
            <div class="content" v-show="checkBoxStatus">
                <!--<el-checkbox-group v-model="checkList">-->
                    <el-checkbox v-for="(item,index) in data.childrenList" :key="index" :checked="item.has?true:null" :label="item.title" disabled></el-checkbox>
                    <!--<el-checkbox label="限时专区" disabled></el-checkbox>-->
                    <!--<el-checkbox label="banner图" disabled></el-checkbox>-->
                    <!--<el-checkbox label="热门课程" disabled></el-checkbox>-->
                    <!--<el-checkbox label="限时专区" disabled></el-checkbox>-->
                    <!--<el-checkbox label="banner图" disabled></el-checkbox>-->
                <!--</el-checkbox-group>-->
            </div>
        </el-collapse-transition>
    </div>
</template>
<script type="application/ecmascript">
    export default{
        data(){
            return{
                checkList:[],
                checkBoxStatus:true
            }
        },
        props:{
            data:Object
//            status:{
//                type:Boolean,
//                default:()=>{
//                    return true;
//                }
//            }
        },
        created(){
            this.checkBoxStatus = this.data.childrenList.length>0?true:false
        },
        methods:{
            changeStatus(){
                this.checkBoxStatus = !this.checkBoxStatus;
            }
        },
        watch:{
            data:{
                handler(newValue, oldValue) {
                    console.log(newValue)
                },
                deep: true
            }
        }
    }

</script>
<style lang="scss">
    .one-tree-warp{
       .header{
            cursor:pointer;
            margin-bottom:20px;
           .icon-warp{
               height: 20px;
               width: 20px;
               background: #848484;
               line-height: 20px;
               margin-right: 10px;
               text-align: center;
           }
           span{
               color:#6A6A6A;
               display: inline-block;
               font-size: 16px;
           }
           .el-icon-minus,.el-icon-plus{
               color:#fff;
           }
       }
       .content{
            .el-checkbox{
                margin-bottom:20px;
            }
            .el-checkbox{
                margin-left: 0;
                margin-right: 30px;
            }
            .el-checkbox__inner{
                box-sizing: content-box;
                padding: 2px;
            }
            .el-checkbox__inner::after{
                height: 10px;
                width: 6px;
                left: 6px;
            }
            .el-checkbox__input.is-disabled+span.el-checkbox__label{
                color:#6A6A6A;
            }
            .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
                background: #9E0E00;
                border-color:#9E0E00;
            }
            .el-checkbox__label{
                font-size: 16px;
            }
       }
    }
</style>

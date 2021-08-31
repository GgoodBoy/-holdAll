<template>
    <div class="collapse-warp">
        <div class="header">
            <span class="icon-warp" @click='changeStatus'>
                <i class="el-icon-caret-bottom" :class="checkBoxStatus?'':'colse'"></i>
            </span>
            <el-checkbox v-model="checkAll" :checked="this.data.has>0?true:false" @change="handleCheckAllChange">{{data.title}}</el-checkbox>
        </div>
        <el-collapse-transition>
            <div class="content" v-show="checkBoxStatus">
                <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                    <div class="checkbox-item" v-for="(item,index) in data.childrenList" :key="index">
                        <el-checkbox :label="item.title" ></el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script type="application/ecmascript">
    export default{
        data(){
            return{
                checkAll:false,
                checkList:[],
                checkBoxStatus:true
            }
        },
        props:{
            data:Object
        },
        created(){
            let temp = [ ]
            this.data.childrenList.forEach(item=>{
                item.has && temp.push(item.title)
            })
            this.checkList = temp;
            this.checkAll = temp.length == this.data.childrenList.length&&this.data.childrenList.length>0?true:false
        },
        methods:{
            changeStatus(){
                this.checkBoxStatus = !this.checkBoxStatus;
            },
            handleCheckAllChange(val){
                this.checkList = val ? this.data.childrenList.map((item)=>{
                    return item.title
                }) : [];
                let arr = val ? this.data.childrenList.map((item)=>{
                    return item.id
                }): []
                val && arr.push(this.data.id)
                this.$emit('update:roleArr',arr)
            },
            handleCheckedCitiesChange(value){
                let checkedCount = value.length;
                // this.checkAll = checkedCount === this.data.childrenList.length;
                this.checkAll = value.length>0?true:false;
                let arr = [ ];
                if(this.checkAll){
                    arr.push(this.data.id);  
                }else{
                    this.$emit('update:roleArr',arr);
                    return;
                }
                let temp = this.data.childrenList.map(item=>{
                    return value.includes(item.title)?item.id:''
                })
                temp.forEach((item)=>{
                    if(item!=''){
                        arr.push(item)
                    }
                })
                checkedCount === this.data.childrenList.length && arr.push(this.data.id)
                console.log("arr",arr);
                this.$emit('update:roleArr',arr)
            },

        }
    }

</script>
<style lang="scss">
    .collapse-warp{
        .el-checkbox__inner{
            box-sizing: content-box;
            padding: 2px;
        }
        .el-checkbox__label{
            font-size: 16px;
        }
        .el-checkbox__inner::after{
            height: 10px;
            width: 6px;
            left: 6px;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background: #9E0E00;
            border-color:#9E0E00;
        }
        .el-checkbox__input.is-checked+.el-checkbox__label{
            color:#384156;
        }
        .el-checkbox__input.is-focus .el-checkbox__inner{
            border-color:#dcdfe6;
        }
        .header{
            line-height: 60px;
            background: #F5F7FA;
            padding: 0 20px;
            .icon-warp{
                height: 60px;
                line-height: 60px;
                display: inline-block;
                text-align: center;
                margin-right: 20px;
            }
            .el-icon-caret-bottom{
                font-size: 25px;
                position: relative;
                top:3px;
                color:#C0C4CB;
                transition:all 0.3s;
                &.colse{
                    transform: rotate(-90deg)
                }
            }
        }
        .content{

        }
        .checkbox-item{
            height:60px;
            line-height: 60px;
            padding: 0 68px;
            border-bottom:1px solid #EBEBEB;
        }
    }
</style>

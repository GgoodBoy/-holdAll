<template>
    <div class="lecture-wrap">
        <!-- 课程讲师列表展示 -->
        <span class="cancel-check" @click="delCheckedItem" v-show="!disabled">
            ×
        </span>
        <div class="lecture-inner clearfix">
            <div class="teacher-img fl">
                <img :src="info.avatar"
                     alt="">
            </div>
            <div class="teacher-info fl">
                <h4 class="teacher-name text-ellipsis" title="info.name">
                    {{info.name}}
                </h4>
                <p class="teacher-title text-ellipsis" :title="info.professionalTitle">
                    {{info.professionalTitle}}
                </p>
                <div class="teacher-synopsis text-ellipsis" :title="info.intro">{{info.intro}}</div>
            </div>

        </div>
        <div class="teacher-id">
            ID：{{info.serialNumber}}
        </div>
    </div>

</template>

<script type="application/ecmascript">
export default {
    props:{
        info:{
            type:Object,
            default:()=>{
                return {
                    avatar:'',
                    name:'',
                    name:'',
                    professionalTitle:'',
                    intro:'',
                    serialNumber:''
                }
            }
        },
        disabled:Boolean
    },
    methods:{
        delCheckedItem() {
            this.$emit('cancelCheck', this.info.id,this.info)
        }
    },
    watch:{
        info(newVal,oldVal){
            this.infoData=newVal;
        },
    }
};
</script>

<style scoped lang="scss">
.cancel-check {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background: rgba(171, 171, 171, 1);
    color: #fff;
    border-radius: 50%;
    display: none;
    cursor: pointer;
}
.lecture-wrap {
    width: 900px;
    margin-top: 20px;
    border: 1px solid #edf1f7;
    position: relative;
    &:hover .cancel-check {
        display: block;
    }
}

.lecture-inner {
    line-height: 1;
}
.teacher-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin: 30px;
    img {
        width: 100%;
        height: 100%;
    }
}
.teacher-info {
    color: #384156;
    width: calc(100% - 140px);
    .teacher-name {
        margin-top: 30px;
    }
    .teacher-title {
        margin: 20px 0;
        color: #9a9a9a;
    }
}
.teacher-id {
    height: 40px;
    line-height: 40px;
    color: rgba(56, 65, 86, 1);
    font-size: 14px;
    background: rgba(245, 245, 245, 1);
    border: 1px solid rgba(237, 241, 247, 1);
    border-radius: 2px;
    padding-left: 20px;
}
.teacher-synopsis {
    // width:
}
</style>

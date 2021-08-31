<template>
    <div class="deposit-wrap fl">
        <!-- 已选择的提成老师样式 -->
        <span class="cancel-check" @click="delCheckedItem">
            ×
        </span>
        <div class="deposit-inner clearfix">
            <div class="teacher-img fl"><img :src="info.avatar"
                     alt=""></div>
            <div class="teacher-info fl">
                <h4 class="teacher-name text-ellipsis">
                    {{info.name}}
                </h4>
                <p class="teacher-id text-ellipsis">
                    ID：{{info.serialNumber}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["info"],
    methods:{
        delCheckedItem() {
            this.$emit('cancelCheck', this.info.id)
        }
    }
};
</script>

<style scoped lang="scss">
.deposit-inner {
    font-size: 14px;
    .teacher-img {
        width:80px;
        height:80px;
        border-radius:50%;
        overflow: hidden;
        margin: 20px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .teacher-info {
        width: 133px;
    }
    .teacher-name {
        margin: 38px 0 20px;
    }
    .teacher-id {
        color:rgba(56,65,86,1);
        margin: 13px 0;
    }
}

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
.deposit-wrap {
    width: 255px;
    height: 120px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(228, 226, 238, 1);
    border-radius: 2px;
    position: relative;
    line-height: 1;
    cursor: pointer;
    &:hover .cancel-check{
        display: inline-block;
    }
}
</style>

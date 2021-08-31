<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: "App",
    metaInfo: {
      title: '学国学网发课端',
      titleTemplate: '%s | 学国学网'
    }
};
</script>
<style lang="scss">
.textEllipsis {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color:#aaa!important;
}
.my-primary-btn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 20px;
    font-size: 14px;
    border-radius: 4px;
    &:hover{
        border-color:rgba(142,13,0,0.15);
        color:#8e0d00;
        background: rgba(142,13,0,0.15);
    }
    &:active{
        border-color: #8e0d00;
    }
}
.list-item-radio{
    .el-radio__label{
        display: inline-block!important;
        vertical-align: middle!important;
    }
    .el-radio__inner{
        width: 18px!important;
        height: 18px!important;
    }
}
</style>

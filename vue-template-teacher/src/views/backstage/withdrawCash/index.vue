<template>
    <div class="page-wrap withdrawal-page">
        <div class="page-head">
            <section class="page-title clearfix">
                <h2 class="fl">提现申请</h2>
            </section>
            <section>
                <el-row class="filtrate-wrap search-area">
                    <el-col class="filtrate-input">
                        <el-input v-model.trim="searchData.username"
                                  placeholder="输入用户名查询">
                            <i slot="suffix" class="el-icon-search"></i>
                        </el-input>
                    </el-col>
                    <el-col class="filtrate-select">
                        <el-select v-model="searchData.status" placeholder="状态">
                            <el-option
                                v-for="item in statusArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col class="filtrate-execute">
                        <el-button type="danger"
                                   class="red-btn">导出</el-button>
                    </el-col>
                </el-row>
            </section>
        </div>
        <div class="page-content">
            <el-table :data="tableData"
                      border
                      v-loading="loading"
                      header-cell-class-name="list-header-layout-bg"
                      style="width: 100%">
                <el-table-column prop="ID"
                                 label="ID"
                                 align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="depart"
                    align="center"
                    label="部门">
                </el-table-column>
                <el-table-column
                    prop="time"
                    align="center"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    prop="last"
                    align="center"
                    label="最后登录">
                </el-table-column>
            </el-table>
        </div>
        <pagination :totalNum="pageData.totalNum"
                    :currentPage="pageData.currentPage"
                    class="paging" />
        <my-dialog :showFlag="dialogFlag" :title="'拒绝原因'" :cancelName="'cancelUpdate'" v-on:cancelUpdate="cancelUpdate" :sureName="'sureUpdate'" v-on:sureUpdate="sureUpdate">
            <div slot="dialog-body">
                <el-input type="textarea" v-model="reason" resize="none" class='reject-textarea' maxlength="100"></el-input>
                <span class='word-number right'>{{reason.length}}/100</span>
            </div>
        </my-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import myDialog from '@/components/myDialog/myDialog.vue'

    export default{
        data(){
            return{
                searchData:{
                    username:'',
                    status:''
                },
                statusArr:[
                    {label:'管理员',value:0},
                    {label:'开发',value:1},
                ],
                tableData:[
                    {ID:1,username:'115151',name:'测试',depart:'研发',time:'2018-01-01',last:'2018-01-01'}
                ],
                pageData: {},
                loading: false,
                dialogFlag:false,
                reason:''
            }
        },
        components:{
            myDialog
        },
        created(){

        },
        mounted(){
            // this.$alert('由于银行卡号和用户名核对不上，无法提现。','',{
            //     customClass:'my-message-alert',
            //     showClose:false,
            // })
        },
        methods:{
            cancelCreate(){
                alert('cancel')
            },
            sureCreate(){
                alert('sure')
            },
            cancelUpdate(){

            },
            sureUpdate(){

            },
            cancelForbbiden(){

            },
            sureForbbiden(){

            }
        }
    }
</script>
<style lang="scss">
    .withdrawal-page{
        .page-head {
            height: 150px;
            padding: 28px 19px 30px 17px;
            background: #fff;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            line-height: 40px;
            font-size: 18px;
            color: #384156;
            padding-bottom: 25px;
        }
        .filtrate-title {
            padding-right: 16px;
            width: 46px;
            font-size: 14px;
            color: rgba(56, 65, 86, 1);
            line-height: 40px;
        }
        .filtrate-select {
            width: 140px;
            margin-right: 20px;
        }
        .filtrate-input {
            width: 240px;
            margin-right: 20px;
        }
        .filtrate-execute {
            width: 110px;
        }
        .search-btn {
            cursor: pointer;
            width: 70px;
            height: 40px;
            line-height: 40px;
            background: rgba(217, 220, 226, 0.2);
            border: none;
            border-radius: 2px;
            color: rgba(56, 65, 86, 1);
            font-size: 12px;
        }
        }
        .page-content {
            border-radius: 5px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .my-form-warp{
            text-align: center;
        .el-form{
            display: inline-block;
        .el-form-item__label{
            line-height: 50px;
        }
        .el-input{
            width: 360px;
            height: 50px;
            line-height: 50px;
        .el-input__inner{
            height: 50px;
            line-height: 50px;
        }
        }
        .my-pwd.el-input--suffix .el-input__inner{
            padding-right: 40px;
        }
        }
        }
        .update-form{
        .el-form-item__label{
            font-size: 12px;
            width: 38px;
            text-align: justify;
            text-align-last: justify;
            margin-left: 32px;
        }
        .el-input{
            width: 360px;
        }
        }
        .reject-textarea{
            height: 110px;
        .el-textarea__inner{
            height: 100%!important;
        }
        }
        .word-number{
            font-size: 12px;
            color:#9A9A9A;
            margin:10px 0;
        }
        .my-message-alert{
        .el-message-box__message{
            text-align: center;
            margin:10px 0;
        }
        .el-message-box__btns{
            text-align: center;
            margin:15px 0;
        .el-button{
            background:#B4272D!important;
            border-color:#B4272D!important;
            width: 130px;
        }
        }
        }
    }

</style>

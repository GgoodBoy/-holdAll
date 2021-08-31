<template>
    <div class="H5-mail-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <div class="page-h5-mail">
                <div class="mainCss">
                    <div class="one">收件人</div>
                    <div>{{receiverName}}</div>                    
                </div>
                <div class="mainCss">
                    <div class="one">手机号</div>
                    <div>{{phoneNum}}</div>                    
                </div>
                <div class="mainCss">
                    <div class="one">邮寄地址</div>
                    <div>{{detailAdreaa}}</div>                    
                </div>
            </div>
            <div style="text-align: right;margin-bottom:10px;">
                <el-button type="primary" @click="dialogVisible=true">邮寄</el-button>
            </div>    
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        prop="receiverName"
                        label="收件人"
                        min-width="80"
                        align="center">
                    </el-table-column>  
                    <el-table-column
                        prop="phoneNum"
                        label="手机号码"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="mailAddress"
                        label="邮寄地址"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>   
                    <el-table-column
                        label="课程名称"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                        <template slot-scope="scope"> 
                            {{courseName}}
                        </template> 
                    </el-table-column> 
                    <el-table-column
                        label="快递公司"
                        align="center"
                        min-width="80"
                        >
                        <template slot-scope="scope"> 
                            <span v-if="scope.row.logisticsType==1">顺丰</span> 
                            <span v-if="scope.row.logisticsType==2">韵达</span>                                           
                            <span v-if="scope.row.logisticsType==3">京东</span> 
                            <span v-if="scope.row.logisticsType==4">申通</span> 
                        </template>                        
                    </el-table-column>   
                    <el-table-column
                        prop="logisticsOrderNum"
                        label="单号"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                        >
                    </el-table-column>
                    <el-table-column
                        prop="updatedAt"
                        label="邮寄时间"
                        align="center"
                        min-width="160"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="creator"
                        label="操作人"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>                                  
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="60">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' size="small" @click="edit(scope.row)">修改</el-button>
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>           
            </div>
        </div>
        <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal='false'
        :close-on-press-escape="false"
        width="25%">
            <div class="editBox">
                <div class="rowcss">
                    <div class="names">订单号</div>
                    <div>{{orderNum}}</div>
                </div>
                <div class="rowcss">
                    <div class="names">物流单号</div>
                    <div><el-input v-model="logisticsOrderNum" placeholder="请输入内容"></el-input></div>
                </div>
                <div class="rowcss">
                    <div class="names">快递公司</div>
                    <div>
                        <el-select v-model="logisticsType" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                        
                    </div>
                </div>
                <div style='text-align:center;'>
                    <el-button @click='dialogVisible=false'>取消</el-button>
                    <el-button type="primary" @click='submit()'>确定</el-button>
                </div>
            </div>        
        </el-dialog>  
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data() {
        return {
            titleList:[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },
                {
                    name:'订单管理',
                    pathInfo:'/H5WebView/H5OrderManage'
                },
                {
                    name:'邮寄',
                    pathInfo:''
                }                
            ],
            options:[
                {
                    label:'顺丰',
                    value:1 
                },
                {
                    label:'韵达',
                    value:2 
                },
                {
                    label:'京东',
                    value:3 
                },
                {
                    label:'申通',
                    value:4
                }
            ],
            name:"",
            total:10,
            tableData:[],
            loading:false,
            receiverName:'',
            phoneNum:'',
            detailAdreaa:'',
            id:'',
            dialogVisible:false,
            selectData:'',
            logisticsOrderNum:'',
            logisticsType:'',
            orderNum:'',
            courseName:''
        };
    },
    components: {
        breadcrumb
    },
    created() {
        this.id = this.$route.query.id;
        this.getmailformList();
    },
    methods: {
        submit(){
            let query = {};
            let url='';
            if(!this.logisticsOrderNum.length>0){
                this.$message.error("请填写物流单号!");
                return;
            }
            if(!Number(this.logisticsType)>0){
                this.$message.error("请选择快递公司!");
                return;
            }
            if(this.selectData){
                query= {
                    logisticsType:this.logisticsType,
                    id:this.selectData.id,
                    logisticsOrderNum:this.logisticsOrderNum
                }     
                url=this.$server.h5InteractModifyMail;           
            }else{
                query= {
                    logisticsType:this.logisticsType,
                    logisticsOrderNum:this.logisticsOrderNum,
                    orderId:this.id,
                    receiverName:this.receiverName,
                    phoneNum:this.phoneNum,
                    mailAddress:this.detailAdreaa

                } 
                url=this.$server.h5InteractMail;
            }
            this.$http.post(url,query).then(res=>{
                if(res.status==200){
                    this.dialogVisible = false;
                    this.logisticsType='';
                    this.logisticsOrderNum='';
                    this.selectData='';
                    this.$message.success("修改成功!");
                    this.getmailformList();
                }
            })
        },
        edit(data){
            this.selectData = data;
            this.logisticsOrderNum = data.logisticsOrderNum;
            this.logisticsType = data.logisticsType;
            this.dialogVisible = true;       
        },
        /**
         * 获取列表数据
         */
        getmailformList(){
            this.loading = true;
            this.$http.get(this.$server.h5OrderMail+this.id).then(res=>{
                if(res.status==200){
                    let lists=res.content.courseMails.map((item,index)=>{
                        item['sortId'] = index+1;
                        return item;
                    });
                    this.tableData = lists;
                    this.courseName = res.content.courseName;
                    this.orderNum = res.content.orderNum;
                    this.receiverName=res.content.receiverName;
                    this.phoneNum=res.content.phoneNum;
                    this.detailAdreaa=res.content.detailAdreaa;   
                    this.loading = false;                 
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .H5-mail-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editBox{
            .rowcss{
                display:flex;
                justify-content:flex-start;
                flex-direction: row;
                align-items: center;
                .names{
                    width:120px;
                    text-align: center;
                }
                div{
                    margin-bottom: 20px;
                }
            }
        }        
        .page-header{
            .page-h5-mail{
                .mainCss{
                    display: flex;
                    flex-direction: row;
                    justify-content:flex-start;
                    align-items: center;
                    padding:10px;
                    font-size:14px;
                    .one{
                        width:100px;
                        text-align:left;
                    }
                }
            }
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .editor-btn {
                color:#9E0E00;
                font-size: 14px;
                padding: 0;
                height: 36px;
                line-height: 36px;
            }
        }        
    }

   
</style>


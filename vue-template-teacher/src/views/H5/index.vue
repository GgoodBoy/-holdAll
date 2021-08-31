<template>
    <div class="page-H5-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>  
                <el-col style="text-align: right;"><el-button v-if="$authJudge('interact:activity:add')" type="primary" @click="goTo()">创建H5页面</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="activityName"
                        label="H5名称"
                        align="center"
                        min-width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="courseNumber"
                        label="课程数"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="createdAt"
                        label="创建时间"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="creator"
                        label="创建人"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>   
                    <el-table-column
                        label="链接"
                        align="center"
                        min-width="100"
                        >
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" class='previewBox' data-clipboard-text="https://www.baidu.com/" @click="copyEven"  size="small">复制</el-button>
                                </div>                                              
                            </template> 
                    </el-table-column> 
                    <el-table-column
                        prop="hits"
                        label="点击量"
                        align="center"
                        min-width="70"
                        >
                            <template slot-scope="scope"> 
                                {{Number(scope.row.hits)>999?fomatFloat(Number(scope.row.hits)/10000,1)+'w':scope.row.hits}}                                             
                            </template> 
                    </el-table-column>                                     
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="150">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type='text' v-if="$authJudge('interact:activity:courseList')" size="small" @click="edit(scope.row)">创建课程</el-button>
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
        width="35%"
        >
            <div class='inputBox'>
                H5名称<el-input class='inputText' maxlength='20' style='width:200px;' v-model="inputText" placeholder="请输入内容"></el-input>
                <span>{{inputText.length||0}}/20</span>
            </div>
            <div class="dialog-footer">
                <el-button @click="dialogVisibleEven(false)">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleEven(true)">确 定</el-button>
            </div>
        </el-dialog>  
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import Clipboard from 'clipboard';
export default {
    data() {
        return {
            titleList:[
                {
                    name:'H5课程管理',
                    pathInfo:''
                },   
                {
                    name:'H5课程',
                    pathInfo:''
                }              
            ],
            name:"",
            tableData:[],
            inputText:'',
            loading:false,
            previewFlag:false,
            url:'',
            dialogVisible: false,
        };
    },
    metaInfo: {},
    components: {
        breadcrumb
    },
    watch: {},
    created() {
       this.getCooperationPlatformList()
    },
    methods: {  
        fomatFloat(value, n) {
            var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
            var s = f.toString();
            var rs = s.indexOf('.');   
            if (rs < 0) {     
                s += '.';   
            } 
            for(var i = s.length - s.indexOf('.'); i <= n; i++){
            s += "0";
            }
            return s;
        },
        copyEven(){
            let self = this;
            var clipboard = new Clipboard('.previewBox');  
            clipboard.on('success',function(e){
                    // 释放内存 
                    clipboard.destroy();
                    self.$message.success({ message: "复制成功" });
                })  
            clipboard.on('error',function(e){
                    console.log('该浏览器不支持自动复制')  
                    //// 释放内存 
                    clipboard.destroy();
                })  
        },
        edit(data){
            // this.$router.push({
            //     path:'/H5WebView/H5Creat',
            //     query:{
            //         id:data.id
            //     }
            // })  
            this.$router.push(`/H5WebView/H5Creat/${data.id}`)         
        },
        dialogVisibleEven(type){
            if(type){
                this.setH5AddCourseActivity();
            }else{
                this.inputText='';
                this.dialogVisible = false;
            }
        },
        goTo(){
            this.dialogVisible = true;
        },
        /**
         * 获取列表数据
         */
        getCooperationPlatformList(){
            this.loading = true;
            this.$http.get(this.$server.h5GetCourseActivity).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.tableData = res.content;
                }
            })
        },
        /**
         * 创建H5
         */
        setH5AddCourseActivity(){            
            let query= {
                activityName:this.inputText
            }
            this.$http.post(this.$server.h5AddCourseActivity,query).then(res=>{
                if(res.status==200){
                    this.dialogVisible = false;
                    this.inputText = '';
                    this.$message.success("创建成功!");
                    this.getCooperationPlatformList();
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .page-H5-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .dialog-footer{
            text-align: center;
            margin-top: 20px;
        }
        .inputBox{
            text-align: center;
            .inputText{
                width:300px;
                margin:0 10px;
            }
        }
        .page-header{
            margin-bottom: 10px;
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


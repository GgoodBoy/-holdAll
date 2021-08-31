<template>
    <div class="H5-creat-wrap">
        <div class="page-header">
            <el-row>
                <el-col>
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-row>  
                <el-col style="text-align: right;">
                    <el-button  type="primary" @click="gotoCreatCourse">创建课程</el-button>
                </el-col>
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
                        prop="sortId"
                        label="序号"
                        align="center"
                        min-width="50">
                    </el-table-column>
                    <el-table-column
                        prop="addressId"
                        label="H5ID"
                        min-width="100"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="updatedAt"
                        label="课程图片"
                        align="center"
                        min-width="120"
                        >
                            <template slot-scope="scope"> 
                                <div class='tableImg'>
                                  <img :src="scope.row.backgroundImg" />  
                                </div>                                              
                            </template>                          
                    </el-table-column> 
                    <el-table-column
                        prop="courseName"
                        label="课程名称"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip
                        >
                    </el-table-column>   
                    <el-table-column
                        label="起售价"
                        align="center"
                        min-width="80"
                        >
                            <template slot-scope="scope"> 
                               {{scope.row.originalPrice||'00:00'}}                                             
                            </template> 
                    </el-table-column> 
                    <el-table-column
                        label="售价"
                        align="center"
                        min-width="80"
                        >
                            <template slot-scope="scope"> 
                               {{scope.row.sellingPrice||'00:00'}}                                             
                            </template>
                    </el-table-column> 
                    <el-table-column
                        label="课时数"
                        align="center"
                        min-width="80"
                        >
                            <template slot-scope="scope"> 
                               {{scope.row.auditPassNum+'/'+scope.row.periodNum}}                                             
                            </template>
                    </el-table-column>
                    <el-table-column
                        label="点击量"
                        align="center"
                        min-width="80"
                        >
                            <template slot-scope="scope"> 
                               {{Number(scope.row.totalHits)>999?fomatFloat(Number(scope.row.totalHits)/10000,1)+'w':scope.row.totalHits}}                                             
                            </template>
                    </el-table-column>                                    
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="130">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(1,scope.row)">编辑</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(2,scope.row)">追加播放量</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(3,scope.row)">勋章</el-button>
                                    <!-- <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(4,scope.row)">孚星/智力值</el-button> -->
                                    <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(4,scope.row)">孚星</el-button>
                                    <el-button type="text" v-if="$authJudge('activity:cooperation:edit')" @click="edit(5,scope.row)">版本</el-button>
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
        width="20%"
        >
            <div class='inputBox' style="text-align:center;">
                追加播放量<el-input class='inputText' style='max-width:100px;margin-left:5px;' maxlength='20' v-model="inputText"></el-input>
            </div>
            <div style='text-align:center;margin-top:20px;'>
                <el-button @click="dialogVisibleEven(false)">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleEven(true)">确 定</el-button>
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
                    name:'H5课程',
                    pathInfo:'/H5WebView/index'
                },
                {
                    name:'创建H5课程',
                    pathInfo:''
                }               
            ],
            name:"",
            id:'',
            tableData:[],
            inputText:'',
            loading:false,
            dialogVisible:false,
            courseId:''
        };
    },
    metaInfo: {},
    components: {
        breadcrumb
    },
    watch: {},
    created() {
        this.id = this.$route.params.id;
        this.getCooperationPlatformList();
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
        rowClickEven(row, column, event){
            // this.$router.push({
            //     path:`/H5WebView/H5Section`,
            //     query:{
            //         id:JSON.stringify(row.id),
            //         courseId:this.id
            //     }
            // });   
             this.$router.push(`/H5WebView/H5SectionNew/${JSON.stringify(row.id)}/${this.id}`)              
        },
        gotoCreatCourse(){
            this.$router.push({
                path:`/H5WebView/H5CreatCourse`,
                query:{
                    activityId:this.id
                }
            });             
        },
        edit(type,data){
            switch (type) {
                case 1:    
                    this.$router.push(`/H5WebView/H5SectionNew/${JSON.stringify(data.id)}/${this.id}`)               
                    break;
                case 2:      
                    this.dialogVisible = true;
                    this.inputText = '';
                    this.courseId = data.id;              
                    break;
                case 3:
                    this.$router.push({
                        path:`/H5WebView/H5Medals`,
                        query:{
                            id:JSON.stringify(data.id),
                            courseId:this.id
                        }
                    });                    
                    break;
                case 4:
                    this.$router.push({
                        path:`/H5WebView/H5IntelligenceVal`,
                        query:{
                            id:JSON.stringify(data.id),
                            courseId:this.id
                        }
                    });                    
                    break;
                case 5:
                    this.$router.push({
                        path:`/H5WebView/H5SectionVersionNew`,
                        query:{
                            sectionId:JSON.stringify(data.id),
                            type:1,
                            courseId:this.id
                        }
                    });  
                    break;
                default:
                    break;
            }            
        },
        dialogVisibleEven(type){
            if(type){
                this.setH5Unm();
            }else{
                this.inputText='';
                this.dialogVisible = false;
            }
        },
        setH5Unm(){
            let query= {
                courseId:this.courseId,
                addCourseBrowsCount:this.inputText,
            }
            this.$http.post(this.$server.h5AddAddHits,query).then(res=>{
                if(res.status==200){
                    this.dialogVisible = false;
                    this.$message.success("追加量添加成功!");
                    this.getCooperationPlatformList();
                }
            })            
        },
        /**
         * 获取列表数据
         */
        getCooperationPlatformList(){
            this.loading = true;
            this.$http.get(this.$server.h5CourseList+'/'+this.id).then(res=>{
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                            listIds = contentdate.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                    this.tableData = listIds;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
            })
        }
        
    }
};
</script>

<style scoped lang="scss">
    .H5-creat-wrap {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-header{
            margin-bottom: 10px;
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            .my-table{
                .tableImg{
                    width:90px;
                    margin: auto;
                    img{
                        width:100%;
                    }
                }
            }
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


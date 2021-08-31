<template>
    <div class="wechatPage">
        <el-row :gutter="20" class="lLine40">
            <el-col :span="20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="4" style="text-align: right;">
            <el-button
                class="redBackColor butColorF"
                v-if="$authJudge('micropage:micropage:build')"  
                @click="releaseSpecial('goTo')">新建微页面</el-button>                 
            </el-col>              
        </el-row>
        <el-row class="lMarginTop20">
            <el-col class="flexBox">
                <div>
                    <el-input v-model.trim="title"
                        style="width:200px"
                        placeholder="查询页面标题"
                        class="search-form"
                        clearable
                        maxlength="20">
                    </el-input> 
                    <el-date-picker
                        v-model="begin"
                        @change="pickerBegin(begin)"
                        style="width:150px"
                        type="date"
                        placeholder="开始时间">
                        </el-date-picker>  
                    <div style="display: inline-block;">-</div>
                    <el-date-picker
                        v-model="end"
                        @change="pickerEnd(end)"
                        style="width:150px"
                        type="date"
                        placeholder="结束时间">
                        </el-date-picker>  
                    <el-button v-if="$authJudge('micropage:micropage:select')" class="redBackColor butColorF" @click="releaseSpecial('search')">搜索</el-button>                                     
                </div>
            </el-col>
            <el-col>
                <el-table
                :data="tableData"
                border
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="sortId"
                        label="序号 "
                        align="center"
                        min-width="50">
                    </el-table-column>                
                    <el-table-column
                        prop="title"
                        label="标题 "
                        align="center"
                        min-width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="创建时间"
                        prop="updatedAt"
                        align="center"
                        min-width="160">                         
                    </el-table-column> 
                    <el-table-column
                        label="创建人"
                        prop="nickname"
                        align="center"
                        min-width="120"
                        show-overflow-tooltip>                         
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="courseNum"
                        label="课程数"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>                                                                                            
                    <el-table-column
                        prop="visitNum"
                        label="访客数/浏览量"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>                                                                                           
                    <el-table-column
                        prop="importNum"
                        label="导入课程流量"
                        align="center"
                        min-width="120"
                        >
                    </el-table-column>                                                                                           
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="160"
                        >
                        <template slot-scope="scope"> 
                            <el-button type="text" v-if="$authJudge('micropage:micropage:edit')" @click="operationEven(scope.row,1)">编辑</el-button>
                            <el-button type="text" v-if="$authJudge('micropage:micropage:delete')" @click="operationEven(scope.row,2)">删除</el-button>
                            <el-button type="text" v-if="$authJudge('micropage:micropage:extension')" @click="operationEven(scope.row,3)">推广</el-button>                                              
                            <el-button type="text" v-if="$authJudge('micropage:micropage:updown')" @click="operationEven(scope.row,4)">{{scope.row.status==1?'下线':'上线'}}</el-button>
                        </template>                          
                    </el-table-column>                                                                              
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="childPageValue"
                        :current-page.sync="pageAtion.paginationPage"
                        :total="pageAtion.pageTotal">
                    </el-pagination>
                </div>                
            </el-col> 
        </el-row> 
        <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        center
        :show-close='false'>
            <div style="text-align:center;">确认删除当前微页面</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisibleven(true)">确 定</el-button>
                <el-button @click="dialogVisibleven(false)">取 消</el-button>
            </span>
        </el-dialog>  
        <el-dialog
        title=""
        :visible.sync="dialogVisibletwo"
        width="30%"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        center>
            <div class="extensionBox">
                <div class="dialogTips">推广渠道</div>
                <div class="dialogContent" v-for="(itme,index) in extensionList" :key="index">
                    <div class="title">
                        {{itme.name}}
                    </div>
                    <div class="operation">
                        <el-button type="text" @click="bindQRCode(itme)">下载二维码</el-button>    
                        <el-button type="text" :class="`copyurl${index}`" :data-clipboard-text="newUrls(itme.num)" @click="copyEvenChange(index)">复制地址</el-button>  
                    </div>                    
                </div>
            </div>
        </el-dialog>    
        <div v-show="false">
            <div id="qrCode" ref="qrCodeDiv" v-if="qrCodeDivType"></div>
        </div>                          
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import QRCode from 'qrcodejs2';
import Clipboard from 'clipboard';
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    components:{
        breadcrumb,
        QRCode
    },    
    data(){
        return {
            dialogVisible:false,
            dialogVisibletwo:false,
            tableData:[],
            loading:false,
            qrCodeDivType:false,
            titleList:[
                        {
                            name:'微页面',
                            pathInfo:''
                        },
                        {
                            name:'微页面列表',
                            pathInfo:''
                        }               
            ],
            pageAtion:{
                pageTotal:0,
                paginationPage:1
            },
            pageSize:10,
            pageNo:1,
            begin:'',
            end:'',
            title:'',  
            selectData:'',
            urlScienceBools:1,
            extensionList:[
                {
                    name:'微信公众号',
                    num:1
                    
                },
                {
                    name:'朋友圈/微信群',
                    num:2
                },
                {
                    name:'APP端',
                    num:3
                }  ,
                {
                    name:'M站',
                    num:4
                }  ,
                {
                    name:'老师',
                    num:5
                }  ,
                {
                    name:'其它1',
                    num:6
                }  ,
                {
                    name:'其它2',
                    num:7
                }  ,
                {
                    name:'其它3',
                    num:8
                }                  
            ]                                 
        }
    },
    created(){  
        if(process.env.NODE_ENV == 'production'){
            if(process.env.argv=='beta'){
                //仿生
                this.urlScienceBools = 2;
            }else{
                //正式
                this.urlScienceBools = 1;
            }
        }else{
            //仿生
            this.urlScienceBools = 2;
        }        
        this.getStudylist(1);     
    },
    props:[],
    computed:{    
    },     
    methods:{ 
        newUrls(num){
            let urls ='';
            if(this.urlScienceBools==1){
                urls = 'https://xgxm.xueguoxue.com/h5/weiyemian/channel'+num+'/index.html?id='+this.selectData.id;
            }else{
                urls = 'https://scm.youfushuyuan.com/h5/weiyemian/channel'+num+'/index.html?id='+this.selectData.id;
            }
            return urls;
        },
        //复制
        copyEvenChange(id){ 
            var self = this;
          var clipboard = new Clipboard('.copyurl'+id);  
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
        //下载二维码；   
         bindQRCode(date) {
            this.qrCodeDivType=true;
            setTimeout(()=>{
                this.creatQRCode(date);
            },100);
         },    
        creatQRCode(date){
            let urls ='';
            if(this.urlScienceBools==1){
                urls = 'https://xgxm.xueguoxue.com/h5/weiyemian/channel'+date.num+'/index.html?id='+this.selectData.id;
            }else{
                urls = 'https://scm.youfushuyuan.com/h5/weiyemian/channel'+date.num+'/index.html?id='+this.selectData.id;
            }            
            new QRCode(this.$refs.qrCodeDiv, {
                  text:urls,
                  width: 256,
                  height: 256,
                  colorDark: "#333333", //二维码颜色
                  colorLight: "#ffffff", //二维码背景色
                  correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
             })
            setTimeout(()=>{
                this.saveQrcode(date);
            },500);
        },
        //生成二维码图片并保存到本地
        saveQrcode(date) {
            //找到canvas标签
            const myCanvas = document.getElementById('qrCode').getElementsByTagName('canvas')
            //创建一个a标签节点
            const a = document.createElement('a')
            //设置a标签的href属性（将canvas变成png图片）
            a.href = myCanvas[0].toDataURL('image/jpg');
            //设置下载文件的名字
            a.download = date.name
            //点击
            a.click()
            setTimeout(()=>{
                this.qrCodeDivType=false;
            },100);
        },      
        dialogVisibleven(type){
            if(type){
                this.$http.post(this.$server.deleteWxMicroPage+this.selectData.id,{}).then(res=>{
                    if(res.status==200){
                        this.dialogVisible=false;
                        this.$message.success({ message: "删除成功" });
                        this.getStudylist(1);     
                    }
                });  
            }else{
                this.dialogVisible=false;
            }
        },
        //操作功能
        operationEven(data,type){
            var self = this;
            this.selectData = data;
            switch (type) {
                case 1:
                    this.$router.push({path:'/wechatH5/creatWechatPage',query:{id:data.id}}); 
                    break;
                case 2:
                    this.dialogVisible=true;
                    break;
                case 3:
                    this.dialogVisibletwo=true;
                    break; 
                case 4:
                    self.$http.post(self.$server.upAndDownWxMicroPage+data.id,{}).then(res=>{
                        if(res.status==200){
                            this.getStudylist(1);     
                        }
                    });                     
                    break;             
                default:
                    break;
            }
        },
        //获取列表信息
        getStudylist(num){  
            if(num){
                this.pageNo = num;
            }
            this.loading = true; 
            const query = {
                params:{
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    beginAt:this.begin?this.formatDate(new Date(this.begin),"start"):'',
                    endAt:this.end?this.formatDate(new Date(this.end),"end"):'',
                    title:this.title
                }
            }            
            this.$http.get(this.$server.getMicroPageList,query).then(res=>{
               if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = index+1;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = prePage*10+index+1;
                                return element;
                            });                            
                        } 
                   };
                    this.tableData = listIds;
                    this.pageAtion.pageTotal = contentdate.total;
                    this.pageAtion.paginationPage = num;
                    this.$nextTick(function(){
                        this.loading = false; 
                    }) 
               }
                console.log(res);
            })            
        }, 
        formatDate(date,type){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                if(type=="end"){
                    h = 23;
                    m1 = 59;
                    s = 59;                
                }else{
                    h = h<10?("0"+h):h;
                    m1 = m1<10?("0"+m1):m1;
                    s = s < 10 ? ("0" + s) : s;
                }
                return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        }, 

        releaseSpecial(type){
            if(type=='goTo'){
                this.$router.push({path:'/wechatH5/creatWechatPage'}); 
            }else{
                this.getStudylist(1);
            }
        },         
        seach(){
            this.getStudylist(1);
        },
        childPageValue(num){
            if(Number(num)>0){
                this.getStudylist(Number(num))
            }
        }             
    },
    watch: {}, 
    mounted(){}
}
</script>
<style lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
    .wechatPage{
        .flexBox{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .block{
            text-align: center;
            padding: 40px 0 40px 0;
            background: #fff;
        }   
        .extensionBox{
            padding: 0 15px;
            .dialogTips{
                text-align: left;
                padding: 15px 0;
            }
            .dialogContent{
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                display: flex;

            }
        }   
        #qrCode{
            padding: 6px;
        }
    }
</style>



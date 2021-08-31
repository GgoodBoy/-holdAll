<template>
    <div>
                    
        <el-row>
            <!-- <el-col :span="18" class="lLeft-r lSize18">{{nameTitle}}</el-col> -->
            <el-col :span="18">
                <breadcrumb :menuList ='titleList' class="fl"></breadcrumb>
            </el-col>                        
            <el-col :span="18" class="lMarginTop20">
                <!-- <my-editor
                    label="brief"
                    class="ueditor-wrap"
                    maximumWords="50000"
                    :content="introduce"
                    :handleChange="handleBrief">
                </my-editor>                 -->

                <div class="my-course-editor">
                    <Editor v-model="introduce" :maxLength="50000"/>
                </div>                
            </el-col>
            <el-col :span="18" class="lCenter-r lMarginTop20" v-if="$authJudge('set:privacy:release')">
                <el-button class="redBackColor butColorF" @click="submitForm(5)">发布</el-button>                
            </el-col>            
        </el-row>
    </div>
</template>
<script>
import { getToken } from '@/utils/auth';
// import myEditor from "@/components/editor/editor";
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){
        return {
                introduce:'',
                nameTitle:'',
                titleList:[
                    {
                        name:'网站管理系统',
                        pathInfo:''
                    }                                               
                ]                
            }
        },
    created() {
        // let routes = this.$router.options.routes;
        this.nameTitle = this.$route.meta.title;    
        this.titleList.push({
                        name:this.nameTitle,
                        pathInfo:''            
                    });            
        this.commonHeader = {
            token: getToken()
        };                
        this.action = this.$server.actionImgOrvideo;
        this.backfillData(5);
    },
    components:{
        // myEditor,
        breadcrumb
    },
    methods: {
            /**
             * 富文本内容获取
             */        
            // handleBrief(data) {
            //     this.introduce = data.html;
            // },
            submitForm(num){
                var self=this;                
                    if(self.introduce.replace(/\s+/g, "").replace(/<[^<>]+>/g,'').replace(/&nbsp;/ig,'').length>50000){
                        this.$message.error("内容长度在 1 到 50000 个字符");
                        return ;
                    }                   
                   let str1 = `<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
                        <style>
                            .xgx-editor *{
                                cursor: text;
                                font-size: 16px!important;
                                font-family:'PingFangSC','STHeiti','Microsoft YaHei','Helvetica','Arial',sans-serif;
                            }
                            .xgx-editor ol,.xgx-editor p,.xgx-editor ul{
                                margin: 1em 0;
                                line-height: 1.5;
                            }
                            .xgx-editor hr{
                                margin: 3em 0 0 0;
                                border: 1px solid #e9e9e9;
                                border-width: 1px 0 0;
                            }
                            .xgx-editor blockquote{
                                padding: 12px 8px;
                                color: #999;
                                background-color: #f3f4f5;
                                margin: 10px 0;
                                border:none!important;
                            }
                            .xgx-editor blockquote span{
                                color:#999;
                            }
                            .xgx-editor blockquote p{
                                margin:0!important;
                                line-height: 1.4em!important;
                            }
                            .xgx-editor h1{
                                display:inline-block;
                                font-size: 1em;
                                line-height: 1.25em;
                                padding-left: 12px;
                                font-weight: 700;
                                border-left: 4px solid #f85959;
                                margin: 1em 0;
                            }
                            .xgx-editor img{
                                max-width:100%;
                            }
                            .xgx-editor h1 strong{
                                line-height:1.25em;
                            }
                            .xgx-editor h1 span{
                                font-size: 1em;
                                line-height: 1em;
                            }
                            .xgx-editor pre{
                                background: #f0f0f0!important;
                                color:#222!important;
                                border-radius: 3px;
                            }
                            .xgx-editor p{
                                word-wrap:break-word;
                            }
                            .xgx-editor ol li:not(.ql-direction-rtl),.xgx-editor ul li:not(.ql-direction-rtl){
                                padding-left:1.5em;
                            }
                            .xgx-editor ol > li{
                                list-style:none;
                            }
                            .xgx-editor ol,.xgx-editor ul{
                                padding:0px!important;
                            }
                            .xgx-editor ol > li::before{
                                content:counter(list-0, decimal) '. ';
                                display: inline-block;
                                white-space: nowrap;
                            }
                            .xgx-editor li:not(.ql-direction-rtl)::before{
                                margin-left: -1.6em;
                                margin-right: 0.3em;
                                text-align: right;
                            }
                            .xgx-editor ul > li::before{
                                content:'·';
                            }
                            .xgx-editor blockquote, .xgx-editor h1, .xgx-editor h2, .xgx-editor h3, .xgx-editor h4, .xgx-editor h5, .xgx-editor h6, .xgx-editor ol, .xgx-editor p, .xgx-editor pre, .xgx-editor ul{
                                counter-reset:list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                            }
                            .xgx-editor ol li{
                                counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
                                counter-increment: list-0
                            }
                        </style>`         
                self.introduce = str1+'<div class="xgx-editor">'+self.introduce+'</div>'       
                var parmes  ={
                    type:num,
                    content:self.introduce
                };
                self.$http.post(self.$server.informAboutUsSave,parmes).then(res=>{
                    if(res.status==200){  
                       self.$message.success({ message: "发布成功" });
                    }
                });                 
            },
            backfillData(num){
                var self = this;
                self.$http.get(self.$server.informAboutUsView({type:num})).then(res=>{
                    if(res.status==200){  
                       self.introduce = res.content.content;
                    }
                });  
            }
    }
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";  
// .my-course-editor{
//     width: calc(100% - 110px);
//     border:1px solid #dfdfdf;
//     .editor-wrapper{
//         padding: 0 !important;
//         .content-length{
//             top:5px!important;
//         }
//     }
// }
</style>



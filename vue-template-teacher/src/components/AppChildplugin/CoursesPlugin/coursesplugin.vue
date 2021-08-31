<template>
        <div class="firstStye">
            <div>  
                <el-row style="margin:10px 0">
                    <el-col :span="12" :offset="1" class="modleName">{{message.moduleName||titleName}}</el-col>
                    <el-col :span="2" :offset="8" class="otherinfo"><i class="el-icon-arrow-right"></i></el-col>
                </el-row>         
                <div v-if="featuredXYBool === 'y'">
                    <el-row type="flex" class="liststyleX" v-for="(item,i) in (featuredEight.length>0?featuredEight:message.list)" :key="i">
                        <el-col class="imgDivX" v-if="initNameBool"><img :src="item.surfacePlot||''"/></el-col>
                        <el-col :span="12" :offset="1" v-if="initNameBool">
                            <el-row class="bascss1X">
                                <el-col :span="24" class="contentLeng" :title="item.title">{{item.title}}</el-col>
                                <!-- <el-col :span="12">基础篇</el-col> -->
                            </el-row>
                            <el-row class="bascss2X">
                                <el-col :span="12">{{item.courseUserLikeCount}}人看过</el-col>
                                <el-col :span="11" style="text-align:right;"><i style="cursor: pointer;" class="el-icon-star-on"></i>赞{{item.courseBrowsCount}}</el-col>
                            </el-row>
                            <el-row class="bascss3X">
                                <el-col :span="24">{{item.sellingPrice}}夫子币</el-col>
                            </el-row>                         
                        </el-col>
                        <div class="img-icon" v-if="initNameBool">
                            <i class="el-icon-service icon-voice"></i>
                        </div>
                        <el-col  v-if="!initNameBool" :span="24"  class="lCenter-r lLine200 lSize28 occupation-map">
                            <!-- 请添加{{titleName}}                                                               -->
                        </el-col>                        
                    </el-row>                               
                </div>
                <div v-else>
                    <!-- <el-row type="flex" justify="center" class="liststyleY"> -->
                    <el-row type="flex" :gutter="20" class="liststyleY">
                        <el-col :span="12" v-for="(item,i) in (featuredEight.length>0?featuredEight:message.list)" :key="i" class="styleYOdd">
                            <el-row class="nextStyleY">
                                <el-col :span="24" class="imgDivY">
                                    <img :src="item.surfacePlot||imgurl"/>
                                    <div class="img-icon">
                                        <i class="el-icon-service icon-voice"></i>
                                    </div>
                                </el-col>
                                <el-col v-if="initNameBool==true" :span="24" style="height:186px;">
                                    <el-row class="bascss1Y">
                                        <el-col class="contentLeng" :span="11" :offset="1">{{item.title}}</el-col>
                                    </el-row>
                                    <el-row class="bascss2Y">
                                        <el-col :span="11" :offset="1">{{item.courseUserLikeCount}}人看过</el-col>
                                        <el-col :span="11" style="text-align:right;"><i style="cursor: pointer;" class="el-icon-star-on"></i>赞{{item.courseBrowsCount}}</el-col>
                                    </el-row>
                                    <el-row class="bascss3Y">
                                        <el-col :span="23" :offset="1">{{item.sellingPrice}}夫子币</el-col>
                                    </el-row>                                                                
                                </el-col>
                                <el-col v-else :span="24" class="lCenter-r lLine200 lSize28">
                                   请添加{{titleName}}                                                              
                                </el-col>                                
                            </el-row>
                        </el-col>
                        <!-- <div v-show="message.list.length>8&&listBool" class="lRight-r moreCss" @click="moreData">点击更多>></div> -->
                    </el-row>
                </div>
            </div>  
        </div>
</template>
<script>
// x轴，y轴样式列表
export default {
    data(){
        return {
            imgurl:'',
            titleName:'',
            featuredEight:[],
            // listBool:true
        }
    },
    created(){
        switch (this.message.moduleType) {
            case "featured":
                this.featuredEight =[];
                this.titleName = "推荐位";
                if(this.message.list.length>8){
                    this.featuredEight= this.message.list.slice(0,8);
                }
                break;
            case "popularCourses":
                this.titleName = "热门课程"
                break;
            case "timeZone":
                this.titleName = "限时专区"
                break;
            case "guessLike":
                this.titleName = "猜你喜欢"
                break;
            default:
                console.log("当前模块无需名字")
                break;
        }        
    },
    props:["message","infolength","xyaxis"],
    computed:{
        messages:function(){
            return this.message.moduleType
        },
        initNameBool:function(){
            return this.message.moduleName!=''?true:false
        },
        featuredXYBool:function(){
             return this.message.list.length>=4?'x':'y';
        }       
    },
    watch:{
        message:{  
                handler:function(val,oldval){ 
                    this.featuredEight = [];
                    if(val.list.length>8){
                        this.featuredEight= val.list.slice(0,8);
                        // this.listBool=true;
                    }
                },  
                immediate:true,//关键
                deep:true
            }            
    },
    methods:{
        // moreData(){
            // if(this.listBool){
            //     this.listBool = !this.listBool;
            // }
            // this.featuredEight = this.message.list;
        // }
    },
    mounted(){

    }
}
</script>
<style>
 @import "../../formSynthesisPlugin/my-component.css";
 </style>
<style scoped lang="scss">

    .firstStye{
        line-height: 37px;
        padding: 20px;
        .modleName{
            text-align: left;
            font-size: 36px;
            font-weight: bold;
        }
        .otherinfo{
            text-align: right;
            font-size: 14px;
            cursor:pointer;
        }
        .liststyleX{
            height: 200px;
            border: 1px solid #E3E3E3;
            margin:20px;
            border-radius: 10px;
            overflow: hidden;
            text-align: left;
            position: relative;
            .contentLeng{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }            
            .imgDivX{
                width: 345px;
            }
            .bascss1X{
                font-size: 30px;
                font-weight: bold;
                margin-top: 16px;
                font-family:PingFangSC-Regular;
            }
            .bascss2X{
                font-size: 24px;
                color: #ccc;
                margin-top: 32px;
            }   
            .bascss3X{
                font-size: 28px;
                color: #C61A35;
                font-weight: bold;
                margin-top: 30px;
            } 
            .occupation-map{
                background: url('../../../assets/images/pc_course_bgd.png')no-repeat 50% 50%;
                background-size: 100% 100%;
            }
            .img-icon{
                bottom: 5px;
                left: 5px;
                font-weight: bold;
                cursor: pointer;    
                width: 36px;
                height: 36px;                            
                position: absolute;
                padding: 4px 8px;
                border-radius: 50%;
                background-color:rgba(0,0,0,0.5);     
                    .icon-voice{
                        font-size: 20px;
                        color: #ffffff;
                    }           
            }                         
        }
        .liststyleY{
            line-height: 30px;
            flex-wrap: wrap;
            position: relative;
            .contentLeng{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }            
            // .styleYOdd:nth-child(even){
            //     margin-left: 10px;
            // }
            .styleYOdd{
                margin-top: 20px;
            }
            .moreCss{
                position: absolute;
                bottom: -60px;
                font-size: 16px;
                right: 0;
            }
            .nextStyleY{
                border-radius: 10px;
                border: 1px solid #E3E3E3;
                text-align: left;
                .imgDivY{
                    height: 200px;
                    overflow: hidden;
                    position: relative;
                    border-radius:10px 10px 0px 0px
                }
                .bascss1Y{
                    font-size: 30px;
                    font-weight: bold;
                    font-family:PingFangSC-Regular;
                    margin-top: 18px;
                }
                .bascss2Y{
                    font-size: 24px;
                    margin-top: 15px;
                    color: #ccc;
                }   
                .bascss3Y{
                    font-size: 28px;
                    color: #C61A35;
                    font-weight: bold;
                    margin-top: 30px;
                }   
            .img-icon{
                bottom: 5px;
                left: 5px;
                width: 36px;
                height: 36px;
                font-weight: bold;
                cursor: pointer;        
                padding:8px;    
                position: absolute;
                border-radius: 50%;
                background-color:rgba(0,0,0,0.5);
                    .icon-voice{
                        font-size: 20px;
                        color: #ffffff;
                    }
                }                              
            }
        }
    }
</style>


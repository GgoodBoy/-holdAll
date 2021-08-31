<template>
    <div class="wTitleEdit wModelEdit">
        <div class="wTitle-head">
            <div class="edit1">
                <div>标题设置</div>
                <el-button size="small" type="primary" @click="seave">保存</el-button>
            </div>
            <div class="edit2">
                <div>样式</div>
                <div>
                    <div class="style1" :style="{border:(styleIndex==1?'1px solid #66CCFF':'none')}" @click="selectType(1)"></div>
                    <div class="style2" :style="{border:(styleIndex==2?'1px solid #66CCFF':'none')}" @click="selectType(2)"></div>
                </div>
            </div>
        </div>
        <div class="wTitle-style-one" v-if="titleMoel.style==1">
            <div class="titleEdit1">
                <div class="edit1" style="position: relative;">
                    <div class="edit_t beforeCss">标题内容</div>
                    <div class="content2">
                        <el-input placeholder="请输入标题" style="width:300px" maxlength="20" show-word-limit v-model="titleMoel.titleContent"></el-input>
                        <div v-show="errorTips==1" class="colorError">请输入标题</div>
                    </div>
                </div>
                <div class="edit2">
                    <div class="edit_t">标题描述</div>
                    <el-input type="textarea" :rows="2" style="width:300px" maxlength="40" show-word-limit v-model="titleMoel.titleDescribe" placeholder="请输入文字描述"></el-input>
                </div>
            </div>
            <div class="titleEdit2">
                <div class="edit1">
                    <div class="layouts">
                        <div>对齐方式</div>
                        <div v-if="titleMoel.layouts==1">左对齐</div>
                        <div v-else-if="titleMoel.layouts==2">居中对齐</div>
                        <div v-else>右对齐</div>
                    </div>
                    <div class="alignmentEdit">
                        <div :class="[titleMoel.layouts==1?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',1)">
                            <img src='../../../../assets/wxImg/layout-left.png' />
                        </div>
                        <div :class="[titleMoel.layouts==2?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',2)">
                            <img src='../../../../assets/wxImg/layout-center.png' />
                        </div>
                        <div :class="[titleMoel.layouts==3?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',3)">
                            <img src='../../../../assets/wxImg/layout-right.png' />
                        </div>                    
                    </div>
                </div>
                <div class="edit2">
                    <div class="layouts">
                        <div>标题大小</div>
                        <div>{{titleMoel.titleFontSize}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[titleMoel.titleFontSize==16?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('titleFontSize',16)">16</div>
                        <div :class="[titleMoel.titleFontSize==14?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('titleFontSize',14)">14</div>
                        <div :class="[titleMoel.titleFontSize==12?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('titleFontSize',12)">12</div>                    
                    </div>
                </div>
                <div class="edit3">
                    <div class="layouts">
                        <div>描述大小</div>
                        <div>{{titleMoel.describeFontSize}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[titleMoel.describeFontSize==16?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('describeFontSize',16)">16</div>
                        <div :class="[titleMoel.describeFontSize==14?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('describeFontSize',14)">14</div>
                        <div :class="[titleMoel.describeFontSize==12?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('describeFontSize',12)">12</div>                     
                    </div>
                </div>
                <div class="edit4">
                    <div class="layouts">
                        <div>标题加粗</div>
                        <div>{{titleMoel.titleBold?'加粗':'正常'}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[titleMoel.titleBold==true?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('titleBold',true)" style="font-weight:bold">B</div>
                        <div :class="[titleMoel.titleBold==false?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('titleBold',false)" >B</div>                    
                    </div>
                </div>
                <div class="edit5">
                    <div class="layouts">
                        <div>描述加粗</div>
                        <div>{{titleMoel.describeBold?'加粗':'正常'}}</div>
                    </div>
                    <div class="sizeEdit">
                        <div :class="[titleMoel.describeBold==true?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('describeBold',true)" style="font-weight:bold">B</div>
                        <div :class="[titleMoel.describeBold==false?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('describeBold',false)">B</div>
                    </div>
                </div>
                <div class="edit6 colorStyle">
                    <div class="layouts">
                        <div>标题颜色</div>
                        <div>{{titleMoel.titleColor}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-button size="small" type="text" @click="setUpTitleStyle('titleColor','#000000')">重置</el-button>
                        <div class="colorCover">
                            <div class="coverDiv" :style="{background:titleMoel.titleColor}"></div>
                            <el-color-picker @active-change='changeSelectColor' v-model="titleMoel.titleColor" style="width:100px;"></el-color-picker>
                        </div>
                    </div>
                </div>
                <div class="edit7 colorStyle">
                    <div class="layouts">
                        <div>描述颜色</div>
                        <div>{{titleMoel.describeColor}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-button size="small" type="text" @click="setUpTitleStyle('describeColor','#000000')">重置</el-button>
                        <div class="colorCover">
                            <div class="coverDiv" :style="{background:titleMoel.describeColor}"></div>
                            <el-color-picker v-model="titleMoel.describeColor" style="width:100px;"></el-color-picker>
                        </div>
                    </div>
                </div>
                <div class="edit8 colorStyle">
                    <div class="layouts">
                        <div>背景颜色</div>
                        <div>{{titleMoel.titleBack}}</div>
                    </div>
                    <div class="colorEdit">
                        <el-button size="small" type="text" @click="setUpTitleStyle('titleBack','#ffffff')">重置</el-button>
                        <div class="colorCover">
                            <div class="coverDiv" :style="{background:titleMoel.titleBack}"></div>
                            <el-color-picker v-model="titleMoel.titleBack" style="width:100px;"></el-color-picker>
                        </div>
                    </div>
                </div>
                <div class="edit9 colorStyle">
                    <div class="layouts">
                        <div>更多链接</div>
                    </div>
                    <div class="colorEdit">
                        <el-checkbox v-model="titleMoel.urlIsShow">显示</el-checkbox>
                    </div>
                </div>             
            </div>
            <div class="titleEdit3">
                <div class="edit1">
                    <div class="wurl">跳转页面</div>
                    <el-input placeholder="支持M站和H5地址" type="textarea" :rows="2" v-model="titleMoel.goToUrlStr" style="width:400px"></el-input>   
                </div>      
            </div>
        </div>
        <div class="wTitle-style-two" v-if="titleMoel.style==2">
            <div class="titleEdit1">
                <div class="edit1" style="position: relative;">
                    <div class="title2 beforeCss">
                        标题内容
                    </div>
                    <div class="content2">
                        <el-input placeholder="请输入标题" maxlength="20" show-word-limit style="width:400px" v-model="titleMoel.titleContent"></el-input>   
                        <div v-show="errorTips==1" class="colorError" style="margin-top:5px">请输入标题</div>
                    </div>  
                </div>
                <div class="edit2" style="position: relative;">
                    <div class="title2 beforeCss">
                        日期
                    </div>
                    <div class="content2">
                            <el-date-picker
                                v-model="titleMoel.titleDate"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>   
                            <div v-show="errorTips==2" class="colorError" style="margin-top:5px;">请选择日期</div>
                    </div>  
                </div> 
                <div class="edit3">
                    <div class="title2">
                        作者
                    </div>
                    <div class="content2">
                        <el-input placeholder="请输入作者,最多20个字" maxlength="20" show-word-limit style="width:400px" v-model="titleMoel.titleAuthor"></el-input>   
                    </div>  
                </div> 
                <div class="edit4">
                    <div class="title2">
                        链接标题
                    </div>
                    <div class="content2">
                        <el-input placeholder="请输入链接标题,最多20个字" maxlength="20" show-word-limit style="width:400px" v-model="titleMoel.titeleGoToUrl"></el-input>   
                    </div>  
                </div>
                <div class="edit5">
                    <div class="title2">
                        跳转页面    
                    </div>
                    <div class="content2">
                        <el-input placeholder="支持M站和H5地址" type="textarea" :rows="2" v-model="titleMoel.goToUrlStr" style="width:400px"></el-input>   
                    </div>  
                </div>               
            </div>
            <div class="titleEdit2">
                <div class="edit1">
                    <div class="layouts">
                        <div>对齐方式</div>
                        <div v-if="titleMoel.layouts==1">左对齐</div>
                        <div v-else-if="titleMoel.layouts==2">居中对齐</div>
                        <div v-else>右对齐</div>
                    </div>
                    <div class="alignmentEdit">
                        <div :class="[titleMoel.layouts==1?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',1)">
                            <img src='../../../../assets/wxImg/layout-left.png' />
                        </div>
                        <div :class="[titleMoel.layouts==2?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',2)">
                            <img src='../../../../assets/wxImg/layout-center.png' />
                            </div>
                        <div :class="[titleMoel.layouts==3?'actionIsOk':'actionIsNo']" @click="setUpTitleStyle('layouts',3)">
                            <img src='../../../../assets/wxImg/layout-right.png' />
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const regExp = {
    'exceptSpecialChar':/^[A-Za-z0-9\u4e00-\u9fa5]+$/,  //数字、字母、汉字(除去特殊字符)
    'protocol':/^(http|https)\:\/\/.*?/, //协议(http或者https)
    'specialChar':/[^A-Za-z0-9\u4E00-\u9FA5]/g, //特殊字符(除了数字、字母、汉字) 
    'numberChar':/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
}
import { Switch } from 'element-ui';
import {mapState,mapActions} from 'vuex'
export default {
    name:'wxTitleEdit',
    props:['modeEditInfo','indexModel'],
    data(){
        return{
            styleIndex:1,
            layoutsIndex:1,
            errorTips:0,  
            titleMoel:{
                style:1,//样式
                titleContent:'',//标题内容
                titleDescribe:'',//标题描述
                layouts:2,//对齐
                titleFontSize:14,//标题大小
                titleBold:true,//标题加粗
                describeColor:'#000000',//描述颜色
                describeFontSize:14,
                describeBold:true,//描述加粗
                titleColor:'#000000',//标题颜色
                titleBack:'#ffffff',//背景颜色
                urlIsShow:true,//链接是否显示
                // microPageRelationRecordList:[]
                goToUrlStr:'',//链接
                titleDate:'',  //时间
                titleAuthor :'',//作者
                titeleGoToUrl:'',//链接标题  
            },
        }
    },
    created(){
        if(this.modeEditInfo.content){
            let contents = JSON.parse(this.modeEditInfo.content);
            var contentType =typeof contents;
            if(contentType==='string'){
                contents = JSON.parse(contents);
            }
            console.log('contents',contents);
            this.styleIndex = this.modeEditInfo.style;
            this.titleMoel={
                    style:this.modeEditInfo.style||1,//样式
                    titleContent:contents.titleContent||'',//标题内容
                    titleDescribe:contents.titleDescribe||'',//标题描述
                    layouts:contents.layouts||1,//对齐
                    titleFontSize:contents.titleFontSize||12,//标题大小
                    titleBold:contents.titleBold||false,//标题加粗
                    describeColor:contents.describeColor||null,//描述颜色
                    describeFontSize:contents.describeFontSize||12,//描述大小
                    describeBold:contents.describeBold||false,//描述加粗
                    titleColor:contents.titleColor||null,//标题颜色
                    titleBack:contents.titleBack||null,//背景颜色
                    urlIsShow:contents.urlIsShow||false,//链接是否显示  
                    titleDate:contents.titleDate||'',  //时间
                    titleAuthor:contents.titleAuthor||'',//作者
                    titeleGoToUrl:contents.titeleGoToUrl,//链接标题
                    goToUrlStr:this.modeEditInfo.microPageRelationRecordList?this.modeEditInfo.microPageRelationRecordList[0].targetId:''//链接    
            }
        }
    },
    computed:{
        ...mapState(['wxStore']),
    },
    methods:{
        ...mapActions(['setWxRightData','setWxLeftData','setwxComponentNameType','setwxSavePageIsState']),
        selectType(type){
            this.titleMoel.style=type;
            this.styleIndex=type;
            this.errorTips=0;  
            this.titleMoel={
                style:type,//样式
                titleContent:'',//标题内容
                titleDescribe:'',//标题描述
                layouts:1,//对齐
                titleFontSize:14,//标题大小
                titleBold:true,//标题加粗
                describeColor:'#000000',//描述颜色
                describeFontSize:14,
                describeBold:true,//描述加粗
                titleColor:'#000000',//标题颜色
                titleBack:'#ffffff',//背景颜色
                urlIsShow:true,//链接是否显示
                // microPageRelationRecordList:[]
                goToUrlStr:'',//链接
                titleDate:'',  //时间
                titleAuthor:'',//作者
                titeleGoToUrl:'',//链接标题  
            }
        },
        // formatDate(date,type){
        //     if(date){
        //         date = new Date(date);
        //         var y=date.getFullYear();
        //         var m=date.getMonth()+1;
        //         var d=date.getDate();
        //         var h=date.getHours();
        //         var m1=date.getMinutes();
        //         var s=date.getSeconds();
        //         m = m<10?("0"+m):m;
        //         d = d<10?("0"+d):d;
        //         if(type=="end"){
        //             h = 23;
        //             m1 = 59;
        //             s = 59;                
        //         }else{
        //             h = h<10?("0"+h):h;
        //             m1 = m1<10?("0"+m1):m1;
        //             s = s < 10 ? ("0" + s) : s;
        //         }
        //         return y+"-"+m+"-"+d+" "+h+":"+m1+":"+s;
        //     }else{
        //         return '';
        //     }
        // },        
        /**
         * 保存右边的数据
         * 1.前端保存，更新wxStore.wxRightData，wxStore.wxLeftData中的值；
         */
        seave(){
            this.errorTips=0;
            if(!this.titleMoel.titleContent){
                this.errorTips=1;
                return;
            }         
            if(this.titleMoel.style==2){
                if(!this.titleMoel.titleDate){
                    this.errorTips=2;
                    return;
                }
            }  
            if(this.titleMoel.goToUrlStr){
                if(!regExp.protocol.test(this.titleMoel.goToUrlStr)){
                    this.$message.error("请填写正确的地址.");
                    return;
                }
            }
            //记得清空样式数据
            if(this.titleMoel.style==1){
                this.titleMoel.titleDate='';  //时间
                this.titleMoel.titleAuthor='';//作者
                this.titleMoel.titeleGoToUrl='';//链接标题   
            }else{
                this.titleMoel.titleDescribe='';//标题描述
                this.titleMoel.titleFontSize='';//标题大小
                this.titleMoel.titleBold='';//标题加粗
                this.titleMoel.describeColor='';//描述颜色
                this.titleMoel.describeFontSize='';//描述大小
                this.titleMoel.describeBold='';//描述加粗
                this.titleMoel.titleColor='';//标题颜色
                this.titleMoel.titleBack='';//背景颜色
                this.titleMoel.urlIsShow='';//链接是否显示      
            }
            let rightwxStoreData=this.wxStore.wxRightData;
            let leftwxStoreData=this.wxStore.wxLeftData;
            let rightdata = rightwxStoreData[this.indexModel];
            let leftdata = leftwxStoreData[this.indexModel];            
            //第一步分开左右两边数组
            let contebtStr = JSON.stringify({
                        titleContent:this.titleMoel.titleContent,//标题内容
                        titleDescribe:this.titleMoel.titleDescribe,//标题描述
                        layouts:this.titleMoel.layouts,//对齐
                        titleFontSize:this.titleMoel.titleFontSize,//标题大小
                        titleBold:this.titleMoel.titleBold,//标题加粗
                        describeColor:this.titleMoel.describeColor,//描述颜色
                        describeFontSize:this.titleMoel.describeFontSize,//描述大小
                        describeBold:this.titleMoel.describeBold,//描述加粗
                        titleColor:this.titleMoel.titleColor,//标题颜色
                        titleBack:this.titleMoel.titleBack,//背景颜色
                        urlIsShow:this.titleMoel.urlIsShow,//链接是否显示 
                        titleDate:this.titleMoel.titleDate ,  //时间
                        titleAuthor:this.titleMoel.titleAuthor,//作者
                        titeleGoToUrl:this.titleMoel.titeleGoToUrl,//链接标题   
            });
            let leftNewData= {
                    id:leftdata.id,
                    microPageId:leftdata.microPageId,
                    action:true,
                    style:this.titleMoel.style,
                    sort:leftdata.sort,
                    subModule:leftdata.subModule,
                    titleDate:this.titleMoel.titleDate, 
                    titleAuthor:this.titleMoel.titleAuthor,  
                    titeleGoToUrl:this.titleMoel.titeleGoToUrl,
                    titleDescribe:this.titleMoel.titleDescribe,
                    titleContent:this.titleMoel.titleContent,
                    addLeftId:leftdata.addLeftId,
                    newType:false,
                    content:contebtStr
                };            
            let rightNewData= {
                    id:rightdata.id,
                    microPageId:rightdata.microPageId,
                    style:this.titleMoel.style,
                    sort:rightdata.sort,
                    subModule:rightdata.subModule,
                    addRightId:rightdata.addRightId,
                    microPageRelationRecordList:[{
                        targetId:this.titleMoel.goToUrlStr,
                        type:2,
                        id:rightdata.microPageId,//id: 微页面关联ID
                        microPageDetailId:rightdata.id,//微页面详情ID
                        sort:1
                    }],  
                    content:contebtStr,
                    newType:false
            }; 
            //第三步替换对应下表的值
            rightwxStoreData.splice(this.indexModel,1,rightNewData);
            leftwxStoreData.splice(this.indexModel,1,leftNewData);
            //第四步，重新保存左右两边的最新值;             
            //设置左边变化数据；
            this.setWxLeftData(leftwxStoreData);
            //设置右边变化数据；
            this.setWxRightData(rightwxStoreData); 
            this.setwxSavePageIsState(true); 
            //关闭右侧组件  
            this.setwxComponentNameType('');   
            console.log("wxStore",this.wxStore);    
        },
        //颜色变化
        changeSelectColor(data){
            console.log('data',data);
        },
        setUpTitleStyle(type,data){
            this.titleMoel[type]=data;
        }
    },
    watch:{
        'titleMoel.titleColor': {
            handler(news,olds) {
                if(news===null){
                    this.titleMoel.titleColor='#000000'
                }
            },
        },
        'titleMoel.describeColor': {
            handler(news,olds) {
                if(news===null){
                    this.titleMoel.describeColor='#000000'
                }
            },
        },
        'titleMoel.titleBack': {
            handler(news,olds) {
                if(news===null){
                    this.titleMoel.titleBack='#ffffff'
                }
            },
        }       
    }
}
</script>
<style lang="scss" scoped>
.wModelEdit{
    padding: 15px;
}
.wTitleEdit{
    font-size: 14px;
    >div{
        border-bottom: 1px solid #f4f4f4;
        padding: 15px 0;
        
    }
    .wTitle-head{
        .edit1{
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .edit2{
            padding: 0 20px;
            display:flex;
            flex-direction: row;
            align-items: center;
            justify-content:flex-start;  
            div:nth-child(2){
                >div{
                    margin-right: 10px;
                    float: left;
                    width: 80px;
                    height: 40px;
                    cursor: pointer;
                }
            }
            >div{
                padding: 0 20px 0 0;
                .style1{
                    background: url('../../../../assets/wxImg/title_r_1.png')no-repeat 50% 50% /cover;
                }
                .style2{
                    background: url('../../../../assets/wxImg/title_r_2.png')no-repeat 50% 50% /cover;
                }
            }         
        }
    }
    .wTitle-style-one{
        .titleEdit1{
            .edit1,.edit2{
                display:flex;
                flex-direction: row;
                align-items: center;
                justify-content:flex-start;    
                margin-bottom: 20px;   
                .edit_t{
                    padding: 0 15px 0 0;
                }
                .beforeCss:before {
                    content: '* ';
                    color: red;
                    position: absolute;
                    top: 17px;
                    left:-6px;
                    }
            }
        }
        .titleEdit2{
            >div{
                display: flex;
                flex-direction: row;
                justify-content:space-between;
                align-items: center;
                margin-bottom: 20px;
                .layouts{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:flex-start;    
                    >div{
                        margin-right: 10px;
                    }            
                }                  
                .sizeEdit{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:space-around;
                    border-top: 1px solid #f4f4f4;
                    border-left: 1px solid #f4f4f4;
                    border-bottom: 1px solid #f4f4f4;
                    >div{
                        width: 40px;
                        line-height: 25px;
                        text-align: center;
                        cursor: pointer;
                        height: 25px;
                        border-right: 1px solid #f4f4f4;
                    }                 
                }
                .colorEdit{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:space-between;     
                    .colorCover{
                        position: relative;
                        cursor: pointer;
                        margin-left: 5px;
                        .coverDiv{
                            pointer-events: none;
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: 1;
                            border: 1px solid #f4f4f4;
                        }
                    }            
                }  
            }
            .edit1{
                display:flex;
                flex-direction: row;
                align-items: center;
                justify-content:space-between; 
                margin-bottom: 15px;
                .layouts{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:flex-start;    
                    >div{
                        margin-right: 10px;
                    }            
                }
                .alignmentEdit{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:space-around;
                    border-top: 1px solid #f4f4f4;
                    border-left: 1px solid #f4f4f4;
                    border-bottom: 1px solid #f4f4f4;
                    padding: 3px;
                    >div{
                        width: 40px;
                        cursor: pointer;
                        height: 25px;
                        border-right: 1px solid #f4f4f4;
                        img{
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                        
                    }                
                }         
            }
        }
        .titleEdit3{
            .edit1{
                display: flex;
                flex-direction: row;
                align-items:flex-start;
                justify-content: flex-start;
                .wurl{
                    margin-right: 10px;
                }
            }
        }
    }
    .wTitle-style-two{
        .titleEdit1{
             margin-top: 10px;
            .edit1,.edit2,.edit3,.edit4{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;     
                margin-top: 20px;          
                .title2{
                    width: 100px;
                    text-align: left;
                }
                .beforeCss:before {
                    content: '* ';
                    color: red;
                    position: absolute;
                    top: 17px;
                    left: -6px;                    
                } 
            }
            .edit5{
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-start;     
                margin-top: 20px;          
                .title2{
                    width: 100px;
                    text-align: left;
                }
            }            
        }
        .titleEdit2{
            padding-top: 15px;
            margin-top: 15px;
            border-top: 1px solid #f4f4f4;
            >div{
                display:flex;
                flex-direction: row;
                align-items: center;
                justify-content:space-between; 
                .layouts{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:flex-start;    
                    >div{
                        margin-right: 10px;
                    }            
                }                
                .alignmentEdit{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content:space-around;
                    border-top: 1px solid #f4f4f4;
                    border-left: 1px solid #f4f4f4;
                    border-bottom: 1px solid #f4f4f4;
                    padding: 3px;
                    >div{
                        width: 40px;
                        cursor: pointer;
                        height: 25px;
                        border-right: 1px solid #f4f4f4;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                        
                    }                
                }                
            }
        }
    }
}
</style>
<style>
.actionIsOk{
    border: 1px solid #66CCFF !important;
}
.actionIsNo{
    border:none;
}
.colorStyle .colorEdit .colorCover .el-color-picker .el-color-picker__trigger{
    width: 100% !important;
    height: 100% !important;
}
.colorError{
    color:#9E0E00;
    position: absolute;
}
.wTitle-style-two .titleEdit1 .edit1 .content2 .el-input .el-input__suffix,
.wTitle-style-two .titleEdit1 .edit3 .content2 .el-input .el-input__suffix,
.wTitle-style-two .titleEdit1 .edit4 .content2 .el-input .el-input__suffix,
.wTitle-style-one .titleEdit1 .edit1 .content2 .el-input .el-input__suffix,
.wTitle-style-one .titleEdit1 .edit2 .el-textarea .el-input__count
{
    right: -40px !important;
}
</style>

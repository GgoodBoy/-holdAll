<template>
    <div class="info-page">
        <div class="div-cneter">
            <div class="left-native">
                <LeftNative :routId="selectDivShow" :cssList="csslist" :valueList="currentVal" v-on:liSetDataToParents="ulGetDataForLi"></LeftNative>
            </div>
            <div class="right-info">
                <div style="position: relative;min-height:600px;">
                    <P class="pCss" style="text-align: center;">常见问题</P>
                    <div class="divCss2" v-loading="loading">
                        <div class="textCss" v-for="(item,index) in content.list" :key="index">
                            <div v-html="item.title"></div>
                            <div class="detailCss" @click="detailClickEven(item)">详情>></div>
                        </div>
                    </div>
                    <Page :styleCss="cssObj" v-on:currentPagesEven="currentChange" :currentPage='currentPages' :pageSize='pageSizes' :totals='totals'></Page>                    
                </div>
            </div>
        </div>
        <!-- title="提示" -->
        <el-dialog
        :visible.sync="centerDialogVisible"
        width="50%"
        :show-close="false"
        center>
        <div v-html="contentLists"></div>
        <div class="dialog-footer">
            <div @click="centerDialogVisible = false">关闭</div>
        </div>
        </el-dialog>               
    </div>    
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator'
import LeftNative from '~/components/LocalComponents/leftNative.vue'
import { NuxtContext } from 'nuxt'
import Page from '~/components/Page.vue'
import {mapState,mapActions} from 'vuex';
import ajaxs from '~/api/index.js'
@Component({
    components:{LeftNative,Page},
    methods:{
        ...mapActions(['selectMyStartEven'])
    },    
    async asyncData({app,params}:NuxtContext):Promise<any>{}, 
})
export default class About extends Vue{
    //组件样式数据：
    selectDivShow:number = 1;
    csslist:Object={
        childCss:'font-size: 18px; padding:20px 0;cursor: pointer;',
        parentCss:'text-align: center;',
        headLiCss:'font-size: 18px; padding:20px 0;color:#fff;background:#000',
        headText:'个人中心',
        headShow:false,
        cssType:2
    };
    // honorImgList:object[]=[];
    centerDialogVisible: boolean =false;
    cssObj:Object='position: absolute;bottom: -40px;width: 980px;left: 0;';
    currentVal:Object[] = [
      {text:'公司介绍',selectId:1},
      {text:'大事记',selectId:2},
      {text:'合作平台',selectId:3},
      {text:'加入我们',selectId:7},
      {text:'联系我们',selectId:4},
      {text:'关于隐私',selectId:5},
      {text:'免责声明',selectId:6}, 
      {text:'常见问题',selectId:8},
    ];
    content:object={};
    centerDialogVisible: boolean =false;
    currentPages:number=1;
    loading:boolean = false;
    pageSizes:number=8;
    totals:number=0;
    pageNo:number=1;
    pageSize:number = 50;
    // scorllBool:boolean=true;
    contentLists:string='';
    head(){
        return {
            title:'常见问题 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));   
        this.getAboutUsinfo();
    }
    async ulGetDataForLi(index){
        this.selectDivShow=Number(index);
        switch (this.selectDivShow) {
            case 1:
                this.$router.push({path:'/aboutUs', query:{selectId:index}})
                break;
            case 2:
                this.$router.push({path:'/aboutUs/events', query:{selectId:index}})
                break;
            case 3:
                this.$router.push({path:'/aboutUs/honorPage', query:{selectId:index}})
                break;
            case 7:
                this.$router.push({path:'/aboutUs/joinUs', query:{selectId:index}})
                break;
            case 4:
                this.$router.push({path:'/aboutUs/contactUs', query:{selectId:index}})
                break;          
            case 5:
                this.$router.push({path:'/aboutUs/onPrivacy', query:{selectId:index}})
                break;        
            case 6:
                this.$router.push({path:'/aboutUs/disclaimer', query:{selectId:index}})
                break;                                                                     
            default:
                break;
        }        
    }
    async detailClickEven(data){
        this.contentLists=data.content;
        this.centerDialogVisible =true;
    }
    async currentChange(number){
        this.pageNo = number;
        this.currentPages=number;
        this.getAboutUsinfo();
    }
    async getAboutUsinfo(){  
            this.loading = true;
            let query = {
                params:{
                    pageSize:8,
                    pageNo:this.pageNo
                }
            }            
            //ES7 ajax写法 await会在异步执行结束之后，才会执行后面的代买，实现了从上到下的代码阅读
            let res2 = await this.$axios.$get(this.$server.getAboutUsProblemPageInfo,query)
            if(res2.status==200){
                this.loading = false;
                this.totals = res2.content.total;
                this.content = res2.content;
            }
    }
}   
</script>
<style lang="scss" scoped>
    .info-page{
        font-family:MicrosoftYaHei;
        zoom: 1;
        overflow: auto;
        margin: 1% 0;
        text-align: center;
        .dialog-footer{
            padding: 20px;  
            margin-top: 30px;    
            div{
                width: 184px;
                height: 40px;
                line-height: 40px;
                background: #C30D23;
                color: #ffffff;
                cursor: pointer;
                margin: auto;text-align: center;
                font-size: 16px;
            }     
        }
        .div-cneter{
            display: inline-block;
            .left-native,.right-info{
                float: left;
            }
            .left-native{
                width: 203px;
            }
            .right-info{
                padding-left: 20px;
                width: 1000px;
                div{
                    .pCss{
                        width: 100%;
                        border-bottom: 1px solid #ccc;
                        padding: 15px 5px;
                        text-align: left;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .divCss3{
                        width: 100%;
                        // height: 600px;
                        // overflow: auto;
                        .imgBox{
                            display:flex; 
                            align-items: center;
                            width: 200px;
                            height: 200px;
                            margin: auto;
                            .imgBoxNext{
                                margin: auto;
                                position: relative;
                                .el-icon-circle-close{
                                    font-size: 20px;
                                    cursor: pointer;
                                    position: absolute;
                                    top:-10px;
                                    right: -10px;
                                    color: #18191936;
                                }
                            }

                        }
                    }
                    .divCss2{
                        padding: 0 10px;
                        text-align: left;
                        margin-bottom: 40px;
                        .textCss{
                            position: relative;
                            width: 100%;
                            padding: 50px 0;
                            border-bottom:1px dashed #ccc;
                            .detailCss{
                                position: absolute;
                                right: 0;
                                color: #C30D23;
                                bottom: 15px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }            
        }
    }
</style>
<style>
.imgWidthCss{
    width: 100%;
}
.imgHeightCss{
    height: 100%;
}
</style>


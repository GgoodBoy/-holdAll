<template>
    <div class="info-page">
        <div class="div-cneter">
            <div class="left-native">
                <LeftNative :routId="selectDivShow" :cssList="csslist" :valueList="currentVal" v-on:liSetDataToParents="ulGetDataForLi"></LeftNative>
            </div>
            <div class="right-info">
                <div>
                    <P class="pCss">合作平台</P>
                    <div class="divCss3" @scroll="handleScroll">
                        <el-row>
                            <el-col :span="6" v-for="(items,index) in honorImgList" :key='index' style="margin-top:30px;">
                                <div class="imgBox">
                                    <div class="imgBoxNext" :class="(items.content.width>items.content.height||items.content.width==items.content.height)?'imgWidthCss':'imgHeightCss'">
                                        <img :src="items.content.url" :class="(items.content.width>items.content.height||items.content.width==items.content.height)?'imgWidthCss':'imgHeightCss'"/>   
                                    </div>
                                </div>                                
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>       
    </div>    
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator'
import LeftNative from '~/components/LocalComponents/leftNative.vue'
import { NuxtContext } from 'nuxt'
import {mapState,mapActions} from 'vuex';
import ajaxs from '~/api/index.js'
@Component({
    components:{LeftNative},
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
    honorImgList:object[]=[];
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
    currentPages:number=1;
    loading:boolean = false;
    pageSizes:number=8;
    totals:number=0;
    pageNo:number=1;
    pageSize:number = 200;
    scorllBool:boolean=true;
    head(){
        return {
            title:'合作平台 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        // this.selectDivShow = Number(this.$route.params.newsId);
        this.selectMyStartEven(Number(numbers));  
        this.getAboutUsinfo();
    }
    async ulGetDataForLi(index){
        this.selectDivShow=Number(index);
        // this.selectMyStartEven(this.selectDivShow);        
        // this.getAboutUsinfo(this.selectDivShow);
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
    async currentChange(number){
        this.pageNo = number;
        this.currentPages=number;
        this.getAboutUsinfo();
    }
    async handleScroll(e) {
            //scrollTop为滚动条在Y轴上的滚动距离。
            //clientHeight为内容可视区域的高度。
            //scrollHeight为内容可视区域的高度加上溢出（滚动）的距离。 
            var self = this;
            if(e.srcElement.scrollTop+e.srcElement.offsetHeight==e.srcElement.scrollHeight){ 
                // this.loadMore();
                if(self.scorllBool){
                    this.pageNo++;
                        //加载更多
                    this.getAboutUsHandle(this.pageNo);                        
                }
            }else{
            }
        }    
    async getAboutUsHandle(number){
                    let query = {
                    params:{
                        pageNo:number,
                        pageSize:200
                    }
                }   
            let res = await this.$axios.$get(this.$server.getHoerDateList,query)
            if(res.status==200){
                // this.honorImgList = res.content.list;
                var list = [];
                if(res.content.list.length>0){
                    res.content.list.forEach(element => {
                        element.content=JSON.parse(element.content);
                        list.push(element)
                    });
                    if(res.content.list.length<this.pageSize){
                            this.scorllBool=false;
                    }
                }else{
                    this.scorllBool=false;
                }
                this.honorImgList = this.honorImgList.concat(list);
            }
    }  
    async getAboutUsinfo(){  
            this.honorImgList =[];
            this.getAboutUsHandle(1);
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


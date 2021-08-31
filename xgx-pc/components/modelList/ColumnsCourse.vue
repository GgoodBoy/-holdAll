<template>
    <div class="columns-modular" :class="index%2==0?'white':''">
        <div class="content">
        <P class="titleCss" v-show="titlesShows"><img :src="img1"/> {{columnsListTitle}} <img :src="img1"/></P>
        <div :class="{'columns-img1':columnsList.length==1,'columns-img2':columnsList.length==2,'columns-img3':columnsList.length>2}" v-for="(item,index) in columnsList" :key="index">
            <div class="imgsDiv" @click="getPathToPage(ColumnsDataList)">
                <img :src='item.picUrl'>
            </div>
            <p class="chilTitle" v-show="columnsList.length>2">{{item.title}}</p>
        </div>
        </div>       
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
const Logo1 = require('@/assets/images/home_title_icon.png');
declare function require(string): string;
@Component({})
export default class Columns extends Vue{
    @Prop()    
    ColumnsDataList: Object  
    @Prop()
    titleShow:boolean 
    @Prop()
    index:number  
    img1:any = Logo1;
    titlesShows:boolean = this.titleShow
    columnsList:object = this.ColumnsDataList['list'];
    columnsListTitle:string=this.ColumnsDataList['moduleName'];
    @Watch("titleShow")
    onChildChanged(val, oldVal) {
        this.titlesShows = val;
    }

    @Watch("ColumnsDataList")
    oncurrentPageChanged(val,oldVal){
        this.columnsList = val['list'];
        this.columnsListTitle=val['moduleName']
    } 
    getPathToPage(data){
    //  this.$router.push(`/course/details?id=${this.ColumnsDataList.id}`)
        var self = this;
        if(data.moduleType=='columnsCourse'){
            self.$router.push('/course/details?id='+data.list[0].content)
        }else if(data.moduleType=='advertising'){
            switch (data.list[0].type) {
                case 2:
                    console.log(self.ColumnsDataList['id']);
                    self.$router.push('/course/details?id='+data.list[0].content)
                    break;
                case 1:
                case 3:
                    window.open(data.list[0].content);
                    break;
                case 4:
                    console.log("不跳转");
                    break;                                                    
                default:
                    console.log("不存在");
                    break;
            }
        }
        
    }  
}
</script>
<style lang="scss" scoped>
   .columns-modular{
       width: 100%;
       min-height: 116px;
       overflow: hidden;
       display: inline-block;
       padding:50px 0!important;
       &.white{
           background: #fff;
           box-shadow:0px 5px 27px -2px rgba(0,0,0,0.09);
       }
       .content{
           width:1200px;
           margin:0 auto;
       }
        .titleCss{
            width: 100%;
            text-align: center;
            font-size: 32px;
            color: #2B323B;
            font-weight: bold;
            font-family: 'Adobe Heiti Std R';
            line-height: 80px;
        }     
        .columns-img2:nth-child(2n+1){
            margin:0 0 0 20px !important;
        }  
        .columns-img3:nth-child(1+4n){
            margin:0 10px 0 0 !important;
        }
        .columns-img3:nth-child(4n){
            margin:0 0 0 10px !important;
        }                    
       .columns-img1,.columns-img3{
            .imgsDiv{
                height: 116px;
                cursor: pointer;
                width: 100%;
                overflow: hidden;
                border-radius: 4px;
                img{
                    width: 100%;
                }
            }
            .chilTitle{
                width: 100%;
                text-align: center;
                line-height:28px;
                font-size: 16px;
                margin-top: 28px;
            }
       }
       .columns-img1{
            widows: 100%;
        }
        .columns-img2{
            width: 590px;
            float: left;
            border-radius: 4px;
            overflow: hidden;
            img{
                width:100%;
                max-width: 100%;
                display: block;
            }
        }
        .columns-img3{
            width: 274px;
            float: left;
        }       
    }    
</style>

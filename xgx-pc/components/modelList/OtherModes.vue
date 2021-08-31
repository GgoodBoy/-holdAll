<template>
    <div class="other-modular" :class="index%2==0?'white':''">
        <div class="otherTitle" v-show="titlesShows">
            <p>{{listName}}</p>
        </div>
        <div class="divOne clearfix">
            <div class="course-item-box" v-for="(item,index) in otherModelList" :key="index">
                <CourseItem :courseData="item"/>
            </div>
        </div>     
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import CourseItem from '~/components/courseItem.vue';
declare function require(string): string;
@Component({
    components:{CourseItem}
})
export default class Columns extends Vue{
    @Prop()    
    modelList: Object   
    @Prop()    
    titleShow: boolean
    @Prop()
    index:number  

    otherModelList:object = this.modelList['list'];
    titlesShows:boolean = this.titleShow;
    listName:string=this.modelList['moduleName'];

    @Watch("titleShow")
    onChildChanged(val, oldVal) {
        this.titlesShows = val;
    }
    @Watch("modelList")
    oncurrentPageChanged(val,oldVal){
        this.otherModelList = this.modelList['list'];
        this.listName=this.modelList['moduleName'];
    }


}
</script>
<style lang="scss" scoped>
    .course-item-box{
        width:305px;
        float: left;
        padding:20px 10px;
        cursor: default;
        text-align:left;
    }
   .other-modular{
       width: 100%;
       min-height: 288px;
       padding: 20px 0 30px 0;
       &.white{
           background: #fff;
           box-shadow:0px 5px 27px -2px rgba(0,0,0,0.09);
       }
       .otherTitle{
            width: 1200px;
            margin:0 auto;
            border-bottom: 1px solid #D8D8D8;
            text-align: left;
            p{
                padding: 26px 0 16px 0;
                font-size: 38px;
                display: inline-block;
                font-weight: 500;
                color: #333;
                position: relative;
                &::before{
                    display: block;
                    content:'';
                    width:100% ;
                    height: 8px;
                    background: #C30D20;
                    bottom:0;
                    left: 0;
                    position: absolute;
                }       
            }
             
       }
       .divOne{
            display: inline-block;
            overflow: auto;           
            zoom: 1;
            width: 1220px;
            margin-top: 30px;
            .otherDiv:nth-child(1+4n){
                margin:0 10px 0 0 !important;
            }
            .otherDiv:nth-child(4n){
                margin:0 0 0 10px !important;
            }            
            .otherDiv{
                width: 273px;
                float: left;
                margin:0 10px;
                position: relative;
                .titleIMgCss{
                    position: absolute;
                    width: 38px;
                    height: 24px;
                    text-align: center;
                    line-height: 24px;
                    font-size: 14px;
                    top:0;
                    left: 0;
                    color: #ffffff;
                    background: #FF3366;
                    border-radius: 0 0 10px 0;
                }
                .other-img{
                    width: 100%;
                    height: 154px;
                    border-radius:5px;
                    overflow: hidden;
                    img{
                        width: 100%;
                    }
                }
                .other-text{
                    text-align: left;
                    .titleCss{
                        font-size: 16px;
                        margin-top: 19px;
                    }
                    .typeCss{
                        font-size: 12px;
                        color: #888888;
                        margin-top: 10px;
                        span:nth-child(2){
                            margin-left: 30px;
                        }
                        .whiteSpace{
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;                             
                        }
                    }
                    .titleCss{
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;                        
                    }
                    .moneyCss{
                        font-size: 14px;
                        margin-top: 16px;
                        color: #C30D23;
                    }
                }
            }
       }

    }
</style>

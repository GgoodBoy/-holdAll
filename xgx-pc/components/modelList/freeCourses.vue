<template>
    <div class="free-course" :class="index%2==0?'white':''">
        <div class="title" v-show="data.moduleName.length>0">
            <p>{{data.moduleName}}</p>
        </div>
        <div class="list clearfix">
            <div class="item" v-for="(item,index) in data.list" :key="index" @click="goCourse(item)">
                <i class="course-new" v-if="item.upType==1"></i>
                <i class="course-update" v-if="item.upType==2"></i>
                <i class="course-type-video" v-if="item.courseType==1"></i>
                <i class="course-type-audio" v-if="item.courseType==2"></i>
                <div class="masking"></div>
                <img class="surface" :src="item.surfacePlot" v-lazy="item.surfacePlot"/>
                <div class="course-data">
                    <p class="course-title">{{item.title}}</p>
                    <div class="course-info">
                        <div class="course-teacher">
                            <div class="course-teacher-head">
                                <img :src="item.lectureTeacherList.length>0?item.lectureTeacherList[0].avatar:''"/>
                            </div>
                            <p :title="item.lectureTeacherList[0].name||''">{{item.lectureTeacherList.length>0?item.lectureTeacherList[0].name:''}}</p>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="browse-val">
                            <p class="i-box"><i></i></p>
                            <p>{{Math.floor(Number(item.courseBrowsCount)/1e5)>1?(Math.floor(Number(item.courseBrowsCount)/1e5)>1000?1000:Math.floor(Number(item.courseBrowsCount)/1e5))+'W+':Number(item.courseBrowsCount)}}学习</p>
                        </div>
                        <p class="course-price" v-if="item.isFree>0">免费</p>
                        <p class="course-price" v-else>{{item.sellingPrice}}币</p>
                    </div>
                </div>
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
    data: Object   
    @Prop()
    index:number
    goCourse(obj:any){
        this.$router.push('/course/details?id='+obj.id)
    }
}
</script>
<style lang="scss" scoped>
   .free-course{
       width: 100%;
       min-height: 288px;
       padding: 20px 0 30px 0;
       &.white{
           background: #fff;
           box-shadow:0px 5px 27px -2px rgba(0,0,0,0.09);
       }
       .title{
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
       .list{
            width: 1200px;
            margin: 50px auto 0;
            font-size: 0;
            overflow: hidden;
            .item{
                float: left;
                margin-bottom: 30px;
                width: 590px;
                height: 167px;
                border-radius: 5px;
                margin-right: 20px;
                overflow: hidden;
                box-shadow:0px 0px 5px 0px rgba(230,230,230,1);
                transition: all 0.3s;
                will-change: box-shadow;
                font-size: 0;
                position: relative;
                cursor: pointer;
                &:nth-child(even){
                    margin-right:0;
                }
                &:hover{
                    transform: translateY(-1px);
                    box-shadow:0px 0px 20px 0px #bcbcbc;
                }
                .masking{
                        position: absolute;
                        top:0;
                        left: 0;
                    }
                    .surface{
                        width: 50%;
                        height: 100%;
                        display: inline-block;
                        vertical-align: middle;
                        border-radius: 5px 5px 0 0;
                    }
                    img[lazy=loading] {
                        opacity: 0.5;
                    }
                    img[lazy=loaded] {
                        opacity:1;
                        transition: opacity 0.5s;
                    }
                    .course-data{
                        font-size: 0;
                        padding:14px 16px;
                        height: 100%;
                        width: 50%;
                        display: inline-block;
                        vertical-align: middle;
                        text-align: left;
                        background: #fff;
                        .course-title,.course-info,.course-price{
                            line-height: 26px;
                        }
                        .course-title{
                            color:#333;
                            font-size: 18px;
                            font-weight: bold;
                            width: 100%;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 52px;
                        }
                        .course-info{
                            font-size: 0;
                            position: relative;
                            margin:5px 0;
                            .course-teacher{
                                font-size: 0;
                                margin:20px 0;
                                i,img,p{
                                    display: inline-block;
                                    vertical-align: middle;
                                }
                                p{
                                    width: 130px;
                                    white-space:nowrap;
                                    text-overflow:ellipsis;
                                    -o-text-overflow:ellipsis;
                                    overflow:hidden;
                                    font-size: 16px;
                                    color:#666;
                                }
                                img{
                                    height:24px;
                                    border-radius: 50%;
                                    position: absolute;
                                    top:50%;
                                    left: 50%;
                                    transform: translate(-50%,-50%);
                                }
                                .course-teacher-head{
                                    display: inline-block;
                                    vertical-align: middle;
                                    height:24px;
                                    width:24px;
                                    border-radius: 50%;
                                    overflow: hidden;
                                    margin-right: 5px;
                                    position: relative;
                                }
                            }
                        }
                        .bottom{
                            position: relative;
                            .browse-val{
                                width: 70%;
                                font-size: 0;
                                line-height: 24px;
                                .i-box{
                                    width:24px;
                                    margin-right: 5px;
                                    text-align: center;
                                    display: inline-block;
                                    vertical-align: middle;
                                    i{
                                        display: block;
                                        margin:0 3px;
                                        width: 16px;
                                        height: 12px;
                                        background: url('../../assets/images/course_browse_icon.png')no-repeat 50% 50% / cover;
                                    }
                                }
                                p{
                                    font-size: 12px;
                                    display: inline-block;
                                    vertical-align: middle;
                                    color:#999;
                                }
                            }
                            .course-price{
                                color:#C30D23;
                                font-size: 16px;
                                position: absolute;
                                right:0;
                                top:0;
                            }
                        }
                    }
                    .course-new,.course-update{
                        width: 44px;
                        height: 30px;
                        display: block;
                        position: absolute;
                        top:-2px;
                        left: -6px;
                        z-index: 2;
                    }
                    .course-new{background: url('../../assets/images/new_icon.png')no-repeat 50% 50%/cover}
                    .course-update{background: url('../../assets/images/update_icon.png')no-repeat 50% 50%/cover}
                    .course-type-video,.course-type-audio{
                        width: 26px;
                        height: 26px;
                        display: block;
                        position: absolute;
                        top:125px;
                        right: 9px;
                        z-index: 2;
                        display: none;
                    }
                    .course-type-video{background: url('../../assets/images/video_icon.png')no-repeat 50% 50%}
                    .course-type-audio{background: url('../../assets/images/audio_icon.png')no-repeat 50% 50%}
                }
       }
    }
</style>

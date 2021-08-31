<template>
    <div class="course-item" @click="goCourse">
        <i class="course-new" v-if="courseData.upType==1"></i>
        <i class="course-update" v-if="courseData.upType==2"></i>
        <i class="course-type-video" v-if="courseData.courseType==1"></i>
        <i class="course-type-audio" v-if="courseData.courseType==2"></i>
        <div class="masking"></div>
        <img class="surface" v-lazy="courseData.surfacePlot"/>
        <div class="course-data">
            <p class="course-title textEllipsis">{{courseData.title}}</p>
            <div class="course-info">
                <div class="course-teacher">
                    <div class="course-teacher-head">
                        <img :src="courseData.lectureTeacherList.length>0?courseData.lectureTeacherList[0].avatar:''"/>
                    </div>
                    <p :title="courseData.lectureTeacherList.length>0?courseData.lectureTeacherList[0].name:''">{{courseData.lectureTeacherList.length>0?courseData.lectureTeacherList[0].name:''}}</p>
                </div>
            </div>
            <div class="bottom">
                <div class="browse-val">
                    <p class="i-box"><i></i></p>
                    <p>{{Math.floor(Number(courseData.courseBrowsCount)/1e5)>1?(Math.floor(Number(courseData.courseBrowsCount)/1e5)>1000?1000:Math.floor(Number(courseData.courseBrowsCount)/1e5))+'W+':Number(courseData.courseBrowsCount)}}学习</p>
                </div>
                <p class="course-price" v-if="courseData.isFree>0">免费</p>
                <p class="course-price" v-else>{{courseData.sellingPrice}}币</p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component,Vue,Prop} from 'vue-property-decorator'
@Component({})
export default class CourseItem extends Vue{
    @Prop()
    courseData:object
    @Prop()
    type:number
    goCourse(){
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('child-page')[0],
            background:'transparent'
        });
        this.$router.push('/course/details?id='+this.courseData['id'])
        loadingInstance.close()
    }
}
</script>
<style lang="scss" scoped>
    .course-item{
        width:100%;
        position: relative;
        cursor: pointer;
        border-radius: 5px;
        background: #fff;
        font-size: 0;
        overflow: hidden;
        box-shadow:0px 0px 5px 0px rgba(230,230,230,1);
        transition: all 0.3s;
        will-change: box-shadow;
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
            width: 100%;
            height: 160px;
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
            height: 108px;
            .course-title,.course-info,.course-price{
                line-height: 26px;
            }
            .course-title{
                color:#333;
                font-size: 18px;
                font-weight: bold;
                width: 100%;
            }
            .course-info{
                font-size: 0;
                position: relative;
                margin:5px 0;
                .course-teacher{
                    font-size: 0;
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
                            background: url('../assets/images/course_browse_icon.png')no-repeat 50% 50% / cover;
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
        .course-new{background: url('../assets/images/new_icon.png')no-repeat 50% 50%/cover}
        .course-update{background: url('../assets/images/update_icon.png')no-repeat 50% 50%/cover}
        .course-type-video,.course-type-audio{
            width: 26px;
            height: 26px;
            display: block;
            position: absolute;
            top:125px;
            right: 9px;
            z-index: 2;
        }
        .course-type-video{background: url('../assets/images/video_icon.png')no-repeat 50% 50%}
        .course-type-audio{background: url('../assets/images/audio_icon.png')no-repeat 50% 50%}
    }
</style>

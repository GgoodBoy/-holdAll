<template>
    <div class="courseListcss" @click="goCourse(item)">
        <div class="imgBox" v-lazy:background-image="lazyBgImg">
            <img :src="data.surfacePlot" alt="">
            <div v-lazy:background-image="someImgIcom">
                <img :src="data.courseType==1?looks:hears"/>
            </div>                        
        </div>
        <div class="textContent">
            <p class="p_1">{{data.title}}</p>
            <p class="p_2">{{data.intro}}</p>
            <div class="textDiv_1">
                <div class="imgDiv">
                    <img :src="teacherIcon"/>
                </div>
                <div>{{(data.lectureTeacherList&&data.lectureTeacherList.length>0)?data.lectureTeacherList[0].name:''}}</div>
                <p v-if="data.lectureTeacherList&&data.lectureTeacherList.length>1?true:false">等</p>
                <div>{{data.planPeriodNum}}讲</div>
            </div>
            <div class="textDiv_2">
                <span>{{numsMath(data,'人学习')}}</span>
                <span v-if="data.isVip==1">VIP</span>
                <span v-else>{{data.isFree==0?(Number(data.sellingPrice)>0?data.sellingPrice+'币':'免费'):'免费'}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import looks from '@/assets/image/looks.png'
import someImgIcom from '@/assets/image/icon-someImg.png' 
import hears from '@/assets/image/hears.png'
import teacherIcon from '@/assets/image/teacherImgIcon.png'
import lazyBgImgs from '@/assets/image/lazy-bg-3.png'
export default {
	props:["data",'className'],
	data(){
		return {
            lazyBgImg:lazyBgImgs,
            finished: false,
            looks:looks,
            hears:hears,              
            pageNo:1,
            pageSize:10,   
            teacherIcon:teacherIcon,
            someImgIcom:someImgIcom
		}
	},
	methods:{
        goCourse(){
            var self=this;
           this.$router.push(`/course/${self.data.id}`)
        },
        numsMath(data,textTitle){
            return data.courseBrowsCount>9999?Number((data.courseBrowsCount/9999).toString().match(/^\d+(?:\.\d{0,1})?/))+'w+'+textTitle:data.courseBrowsCount+textTitle;
        },                
	},
	computed:{
        ...mapState(['isVip']),
    },
}

</script>

<style lang="scss" scoped>
.courseListcss:not(:last-child){
    border-bottom: 1px solid #f2f2f2;
}
.courseListcss{
    display: -webkit-inline-box;
    padding: 0.4rem 0;
    overflow: hidden;
    .imgBox{
        width: 3.08rem;
        height: 1.78rem;
        overflow: hidden;
        position: relative;
        border-radius: 0.12rem 0 0 0.12rem;
        >img{
            width: 100%;
            height: 100%;
        }
        div{
            position: absolute;
            width: 0.52rem;
            height: 0.3rem;
            right: 0.1rem;
            bottom: 0.1rem;
            img{
                width: 100%;
                height: 100%;
            }
        }                
    }
    .textContent{
        width: 3.62rem;
        margin-left: 0.2rem;
        .p_1{
            font-size: 0.3rem;
            font-weight: 700;
            color: #333;
            margin-bottom: 0.02rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .p_2{
            font-size: 0.24rem;
            font-weight: 7000;
            color: #999;      
            margin-bottom: 0.08rem;  
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;        
        } 
        .textDiv_1{
            display: -webkit-inline-box;
            margin-bottom: 0.26rem;
            .imgDiv{
                width: 0.3rem;
                height: 0.3rem;
                overflow: hidden;
                border-radius: 100%;
                margin-top: 0.03rem;
                img{
                    width: 100%;
                    height: 100%;;
                }
            }
            p{
                padding: 0 0.2rem 0 0;
            }
            >div:nth-child(2){
                color: #666;
                font-size: 0.26rem;
                margin-left: 0.1rem;
                width: 50%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;                         
            }
            >div:nth-child(3){
                font-size: 0.26rem;
                color: #666;
                margin-left: 0.2rem;
            }

        }           
        .textDiv_2{
            overflow: auto;
            span:nth-child(1){
                float: left;
                font-size: 0.24rem;
                color: #999;     
            }
            span:nth-child(2){
                float: right;
                font-size: 0.28rem;
                font-weight: 700;
                color: #C30D23;
            }                
        }             
    };
}
</style>

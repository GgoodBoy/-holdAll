<template>
  <div class="module-swiperp-wrap">
    <div class="swiper-wrap">
        <swiper :options="swiperOption" class="parentBanners" :class="{ 'course-img-a': type, 'course-img-b': !type,'swiper-no-swiping':swiperBool}" :ref="`mySwiper${index}`">
            <!-- @click.native="tapBanner(item,index)" -->
            <swiper-slide v-for="(item , i) in bannerImgList" 
                :key="i" >
                <div class="course-img one" v-lazy:background-image="bannerIcon">
                    <img :src="item.imgUrl" class="swiper-img" :data-index="i"/>
                </div>
            </swiper-slide>
        </swiper>        
    </div>
    <ul class="indicatorsCss" :id="swiperID(index)" v-if="bannerImgList&&bannerImgList.length==1?false:true">
        <li :class="{ 'like-stye-a': i==indexLike, 'like-stye-b': i!=indexLike}" v-for="(item , i) in bannerImgList.length" :key="i"></li>
    </ul>    
  </div>
</template>

<script>
import bannerIcon from '../img/icon-banner.png';
export default {
    // props:["bannerData","editionType"],
    props:["dataInfo","index"],
    data() {
        return {
            bannerIcon:bannerIcon,
            indexLike: 0,
            bannerImgList:[],
            type:true,
            swiperBool:false,
            swiperOption:{
                autoplay: {
                    delay: 3000, //自动切换的时间间隔，单位ms
                    stopOnLastSlide: false,
                    disableOnInteraction: false
                },
                // autoplay:false,
                loop:true,
                on: {
                    click:()=>{
                    // 这里有坑，需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法 
                    // console.log(this); // -> Swiper
                    // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。
                        const realIndex = this.$refs['mySwiper'+this.index].swiper.realIndex;
                        this.handleClickSlide(realIndex);
                    },                    
                    slideChange:()=>{
                        let swiper = this.$refs['mySwiper'+this.index].swiper;
                        if(swiper){
                            if(swiper.swipeDirection&&swiper.swipeDirection=="prev"){
                                if(this.bannerImgList.length-swiper.activeIndex==this.bannerImgList.length){
                                    this.indexLike = this.bannerImgList.length-1;
                                }else if(this.bannerImgList.length-swiper.activeIndex==0||this.bannerImgList.length-swiper.activeIndex==1){
                                    this.indexLike = this.bannerImgList.length-2;
                                }else{
                                    this.indexLike = swiper.activeIndex-1;
                                }
                            }else{
                                if(this.bannerImgList.length+1==swiper.activeIndex){
                                    this.indexLike = 0;
                                }else if(swiper.activeIndex-1==1||swiper.activeIndex-1==0){
                                     this.indexLike = 1;
                                }else{
                                    this.indexLike = swiper.activeIndex-1;
                                }
                            }
                        }
                    }
                }                
            },            
        };
    },
    created(){
        var self = this;
        this.bannerImgList = this.dataInfo.ahprrList;
        this.type = (this.dataInfo.style==1?true:false);
    },     
    methods:{
        swiperID(index){
            return "swiper_p" +index;
        },          
        getDocumentSrcollTop(){
            var scrollTopMark = Math.floor(document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset);
            localStorage.setItem('courseToListTop',scrollTopMark); 
        },         
        handleClickSlide(index) {
            var data = this.bannerImgList[index];
            this.tapBanner(data,index);
        },
        tapBanner(data,i){
            this.getDocumentSrcollTop();
            switch (data.type) {
                case 1://课程
                        this.$router.push(`/course/${data.targetId}`)//targetId：就是对应状态的值；
                    break;
                case 2://资讯
                        this.$router.push(`/infromation/infromDetails/${data.targetId}`)//targetId：就是对应状态的值；
                    break;
                case 3://链接
                        window.open(data.targetId)
                    break;
                case 4://无连接
                    console.log("无连接")
                    break;                                                                
                default:
                    break;
            }
        },
    },
        mounted() {
            if(this.bannerImgList&&this.bannerImgList.length==1){
                this.$refs['mySwiper'+this.index].swiper.autoplay.stop();
            }else{
                this.$refs['mySwiper'+this.index].swiper.autoplay.start();
            }
        }
};
</script>
<style lang="scss" scoped>
.search-icon{
    vertical-align: text-bottom;
}
.module-swiperp-wrap{
    position: relative;
    background: #fff;
    .swiper-wrap{
        .parentBanners{
            border-radius: 0.12rem;
            overflow: hidden;
        }
    }
    .indicatorsCss{
        overflow: auto;
        position: absolute;
        bottom:0.6rem;
        right: 0.4rem;
        z-index: 1;
        .like-stye-a{
            background: #C30D23;
        }
        .like-stye-b{
            background: #fff;
        }
        li{
            width: 0.12rem;
            height: 0.12rem;
            border-radius: 100%;
            float: left;
            margin: 0 0.05rem;
        }
    }    
}
.swiper-wrap{
    padding: 0.22rem 0.3rem; 
    // margin: 0.2rem 0 0 0;  
}
.swiper-wrap-layout {
    height: 2.66rem;
    overflow: hidden;
    border-radius: 2px;
}
.empty-box{
    height: 2.72rem;
    width: 100%;
}
</style>
<style lang="scss">

.like-stye-a{
    background: #C30D23;
}
.like-stye-b{
    background: #fff;
}
.course-img-a{
    height:2.66rem;
    width: 100%;
    background-size: 100% 100%;    
}
.course-img-b{
    height:3.26rem;
    width: 100%;
    background-size: 100% 100%;    
}
.course-img{
    height:2.66rem;
    width: 100%;
    background-size: 100% 100%;
}
.module-swiperp-wrap {
    .van-cell__value {
        height: 100%;
    }
    .search-wrap{
       .van-info{
            top: .1rem;
            background: #A63433;
            border: none;
        } 
    }
    .found-wrap{
        .van-info{
            background: #A63433;
        } 
    }
    
}
.swiper-img{
    // height: 100%;
    width: 100%;
    max-width: 100%;
}
</style>

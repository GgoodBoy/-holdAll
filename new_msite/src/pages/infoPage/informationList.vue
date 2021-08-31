<template>
    <div>
        <van-nav-bar
            :title="informationName"
            left-arrow
            @click-left="onClickLeft"
        />        
        <van-list
            class="informList"
            v-model="loading"
            :finished="finished"
            @load="getInformationSecondPageList">      
            <div v-for="(item,i) in list" :key="i" @click="detailInform(item)">
                <div class="textCss">
                    <p>{{item.name}}</p>
                    <div class="divBox">
                        <div class="div1">{{item.createdAtStr}}</div>
                        <div class="div2">
                            <div class="pBox1">{{numsMath(item.browseCount,'')}}</div>
                             <div class="pBox2">人阅读</div>
                        </div>
                    </div>
                </div>
                <div class="imgCss" v-lazy:background-image="someImgIcom">
                    <img :src="item.pictureUrl"/>
                </div>
            </div>
        </van-list>    
         <transition name="fade">
            <P class="p_Text1" v-show="pTextIsShow" transiton="fade">没有更多数据了</P> 
         </transition>        
    </div>
</template>

<script>
import someImgIcom from '@/assets/icon-someImg.png'
export default {
    props:[],
    data(){
        return { 
            pageNo:1,
            pageSize:5,
            loading:false,
            finished:false,
            informationName:'',
            list:[],
            lazyBgImg:'./static/img/common/lazy-bg-3.png',
            someImgIcom:someImgIcom,
            pTextIsShow:false
        }
    },
    created(){
        if(this.$route.query&&this.$route.query.nameType){
            this.informationName = this.$route.query.nameType;         
        }
    },    
	components:{},
    methods:{
        onClickLeft(){
            this.$router.push('/')
                
        },
        numsMath(data,textTitle){
            return data>9999?Number((data/9999).toString().match(/^\d+(?:\.\d{0,1})?/))+'w+'+textTitle:data+textTitle;
        },          
        detailInform(obj){
            this.$router.push(`/infromation/infromDetails/${obj.id}`)
        },
        /**
         * 获取二级资讯列表
         */
        getInformationSecondPageList(){
            let query = {
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            this.$http.post(this.$server.getInformationSecondPageList,query).then(res=>{
                if(res.data.status == 200){
                    this.pageNo++;
                    this.loading = false;
                    this.finished = res.data.content.isLastPage ?  true : false;
                    this.list = [...this.list,...res.data.content.list];
                }
            })
        }
    },
    mounted(){
        var GetSlideDirection = (startX, startY, endX, endY)=>{
            var dy = startY - endY;  
            //var dx = endX - startX;  
            var result = 0;
            if(dy>0) {//向上滑动
                    result=1;
            }else{//向下滑动
                    result=2;
            }
            return result;              
        }
        //滑动处理  
        var startX, startY;  
        document.addEventListener('touchstart',(ev)=>{  
            if(this.finished){
                startX = ev.touches[0].pageX;  
                startY = ev.touches[0].pageY; 
                this.pTextIsShow = true;
            }   
        }, false);  

        document.addEventListener('touchend',(ev)=>{ 
            if(this.finished){
                var endX, endY;  
                endX = ev.changedTouches[0].pageX;  
                endY = ev.changedTouches[0].pageY;  
                var direction = GetSlideDirection(startX, startY, endX, endY);
                switch(direction) {  
                    case 0:  
                        break;  
                    case 1:  
                        // 向上
                        setTimeout(()=>{
                            this.pTextIsShow = false;
                        },800);
                        break;  
                    case 2:  
                        // 向下
                        break;  
                    
                    default:             
                } 
            }             
        }, false);         
    }    
};
</script>
<style lang="scss" scoped>
.p_Text1{
    width: 100%;
    text-align: center;
    color: #666;
    font-size: 0.26rem;
}
.fade-enter-active, .fade-leave-active {
      transition: opacity .5s
}
.fade-enter, .fade-leave-active {
      opacity: 0
}
.informList{
    padding: 0.3rem;
    >div{
        padding: 0.4rem 0 0 0;
        border-bottom: 1px solid #F2F2F2;
        overflow: auto;
        .textCss{
            float: left;
            height: 2.2rem;
            width: 3.28rem;
            position: relative;
            p{
                color: #333333;
                font-size: 0.28rem;                
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3; //文本行数
                overflow: hidden;                              
            }
            .divBox{
                overflow: auto;
                font-size: 0.22rem;
                color: #999999;
                position: absolute;
                bottom: 0.5rem;
                width: 100%;
                .div1{
                    float: left;
                    width: 40%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;                 
                }
                .div2{
                    width: 60%;
                    float: right;
                    .pBox1{
                        width: 60%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        float: left;
                        text-align: right; 
                    } 
                    .pBox2{
                        width: 40%;
                        float: left;                        
                    }                  
                }
            }
        }
        .imgCss{
            float: right;
            width: 3.38rem;
            height: 1.7rem;
            font-size: 0.22rem;
            border-radius: 0.12rem;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>

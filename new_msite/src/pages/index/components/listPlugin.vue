<template>
    <div class="list-wrap">
        <div class="listTitle">
            <div>{{dataInfo.title}}</div>
        </div>
        <div v-for="(item,index) in dataInfo.list" :key="index" class="listContent" @click="toCoursePage(item)">
            <div class="divLeft" v-lazy:background-image="someImgIcom">
                <img :src="item.imgurl"/>
            </div>
            <div class="divRight">
                <p>{{item.p1}}</p>
                <p>{{item.p2}}</p>
            </div>
        </div>
        <div class="otherList" v-if="dataInfo.typeState" @click="toOtherPageList()">
            {{dataInfo.otherTitle}}
            <van-icon name="arrow" />
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import someImgIcom from '@/assets/image/icon-someImg.png'
export default {
    props:["dataInfo"],
    data(){
        return {
            someImgIcom:someImgIcom
        }
    },
    computed:{
         ...mapState(['isWx','isIos']),
    },     
    created(){},    
    methods:{
        ...mapActions(['setShortVideoId']),
        toCoursePage(data){
            let self =this;
            switch (self.dataInfo.otherPageName) {
                case 'shortVideo':
                    this.setShortVideoId(data.targetId);
                    this.$router.push("/shortVideo");
                    break;            
                default:
                    // let d = new Date();
                    // let t0 = d.getTime();
                    // this.$toast.loading();
                    // var delay = setInterval(function(){
                    //     var d = new Date();
                    //     var t1 = d.getTime();
                    //     if( t1-t0<5000 && t1-t0>4000){
                    //        self.$router.push(`/course/${data.targetId}`);
                    //     }
                    //     if(t1-t0>=5000){
                    //         clearInterval(delay);
                    //     }
                    // },1000);
                    this.$router.push(`/course/${data.targetId}`);
                    break;
            }
        
        },
        toOtherPageList(data){
            var self = this;
            switch (self.dataInfo.otherPageName) {
                case 'free':
                    this.$router.push({path:'/specialArea',query:{ type:self.dataInfo.otherPageName,name:self.dataInfo.title}});
                    break;
                case 'shortVideo':
                    this.setShortVideoId('');
                    this.$router.push("/shortVideo");
                    break;            
                default:
                    break;
            }
        },
    }
};
</script>
<style lang="scss" scoped>
    .list-wrap{
        margin: 0.2rem 0 0 0;
        .listTitle{
            padding: 0.2rem 0.3rem;
            position: relative;
            div{
                // border-left: 0.06rem solid #C30D23;
                height: 0.56rem;
                line-height: 0.56rem;
                padding: 0 0.3rem;
                font-size: 0.4rem;
                color: #333;
                font-weight: 500;
            }
            div:before{
                content:'';
                height: 0.4rem;
                width: 0.06rem;
                bottom: 0.27rem;
                left: 0.3rem;                
                display: block;   
                position: absolute;
                background: #C30D23;
            }
        }
        .listContent{
            overflow: auto;
            padding: 0.4rem 0.3rem;
            background: #fff;  
            border-bottom: 0.02rem solid #f4f4f4;
            .divLeft{
                float: left;
                width: 3.1rem;
                height: 1.8rem;
                overflow: hidden;
                border-radius: 0.12rem 0 0 0.12rem;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .divRight{
                float: left;
                width: 3.8rem;
                padding-left: 0.2rem;
                font-size: 0.3rem;
                p:nth-child(1){
                    color: #333;
                }
                p:nth-child(2){
                    margin-top: 0.1rem;
                    color: #666;
                    font-size: 0.26rem;
                }
            }
        }        
        .otherList{
            text-align: center;
            font-size: 0.32rem;
            position: relative;
            padding: 0.3rem;
            background: #fff;
            color: #333;
            i{
                position: absolute;
                bottom: 0.34rem;                
            }
        }
    }
</style>

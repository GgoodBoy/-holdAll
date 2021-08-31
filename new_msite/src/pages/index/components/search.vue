<template>
    <div class="module-search-wrap">
        <div class="found-wrap" v-if="showFound">
        <van-nav-bar
            title="发现"
            @click-left="goMessage"
            @click-right="goSearch">
                <van-icon name="pending-evaluate"
                    class="message"
                    size=".42rem" 
                    :info="number==0?'':number"
                    color="#9A9A9A"
                    slot="left"/>
                <van-icon name="search" color="#9A9A9A" size=".36rem" slot="right" />
            </van-nav-bar>
        </div>
        <div class="search-wrap" v-else>
            <div class="search c9a" @click="goSearch">
                <van-icon name="search" color="#9A9A9A" size=".32rem" class="search-icon"/>
                请输入您要查找课程的名称
            </div>
            <div class="version-control" @click="switchVersion">
                <img :src="searchData.imgUser"/>
            </div>
            <!-- <div class="chunjie">
                <div class="fireworks"><img :src="yanhua" alt=""></div>
                <div class="firecracker"><img :src="firecracker" alt="" width="8px"></div>
            </div> -->
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import yanhua from '@/assets/image/yanhua.png'
import firecracker from '@/assets/image/firecracker.png'
export default {
    data(){
        return {
            showFound:false,
            number:4,
            titleList:[],
            isSwitch:0,
            childCourseType1:'',
            yanhua:yanhua,
            firecracker:firecracker
        }
    },
    // props:['editionType','columnListArr','childCourseType'],
    props:['editionType',"searchData"],
    created(){
    },
    watch: {},    
    methods:{
        ...mapActions(['setEditionType']),
        goSearch(){
            this.$router.push("/search");
        },
        switchVersion(){
            this.$router.push('/user')
            // let editionType = this.editionType==1?2:1;
            // this.$emit('update:editionType',editionType);
            // localStorage.removeItem("courseToListTop");
            // localStorage.setItem('editionType',editionType)
        },
    },
    mounted(){

    }
}
</script>
<style lang="scss" scoped>
    .module-search-wrap{
        background: #fff;
        position: relative;
        .found-wrap{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            z-index: 10;
            transition: all .1s linear .1s;
        }
        .pad1{
            padding: 0.3rem;
        }       
        .search-wrap {
            padding: 0.3rem;
            width: 100%;
            z-index: 2;
            display: flex;
            align-items: center;
            transition: all .1s linear .1s;
            // background: url('../../../assets/image/chunjie.jpg')no-repeat 50% 50%/cover;
            font-size: 0;
            .search-icon{
                position: relative;
                top:0.08rem;
            }
            .search-icon1{
                position: relative;
                top:0.12rem;
            }            
            .message {
                width: 0.5rem;
                margin: 0 0.28rem 0 0.3rem;
                line-height: 0.88rem;
                display: none;
            }
            .search{
                display: inline-block;
                vertical-align: middle;
                width: calc(100% - 1.65rem);
                height: .66rem;
                text-align: left;
                line-height: .66rem;
                border-radius: .66rem;
                font-size: 0.28rem;
                background: #EDEDED;
                // background: #fff;
                padding: 0 0.3rem;
                z-index: 2;
            }
            .search1{
                display: inline-block;
                vertical-align: middle;
                width: calc(100% - 1.78rem);
                height: .6rem;
                text-align: right;
                line-height: .6rem;
                border-radius: .12rem;
                font-size: 0.22rem;  
            }
            .version-control{
                display: inline-block;
                vertical-align: middle;
                font-weight: 700;
                width: 0.7rem;
                height: 0.7rem;
                text-align: center;
                margin-left: 0.15rem;
                overflow: hidden;
                position: absolute;
                border-radius: 50%;
                right: 0.3rem;
                border-radius: 50%;
                z-index: 2;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .chunjie{
        position: absolute;
        z-index: 1;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .fireworks{
            position: absolute;
            right: 10%;
            top:0;
            width: 3rem;
            height: 3rem;
            transform: scale(0);
            margin:-1rem -1.2rem -1rem -1rem;
            animation: fireworks 3s forwards infinite;
        }
        .firecracker{
            position: absolute;
            right: 10%;
            bottom: 0;
            width: 5px;
            margin-right: 0.4rem;
            margin-bottom: -0.5rem;
            animation: firecracker 3s forwards infinite;
        }
        @keyframes fireworks {
            0%{
                transform: scale(0);
            }
            80%{
                transform: scale(1);
            }
            100%{
                opacity: 0;
            }
        }
        @keyframes firecracker {
            0%{
                transform: scale(0);
                bottom: -20%;
            }
            10%{
                transform: scale(1);
                bottom: 0;
            }
            100%{
                bottom: 80%;
                transform: scale(0);
            }
        }
    }
</style>

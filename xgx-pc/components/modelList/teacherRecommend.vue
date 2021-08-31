<template>
    <div class="recommend-module" :class="index%2==0?'white':''">
        <div class="content">
            <i class="prev" v-show="data.list.length>4" @click="prev"></i>
            <div class="scroll-box">
                <div class="list-box">
                    <div class="list" :style="moveStyle">
                        <div class="item" v-for="(item,index) in data.list" :key="index" @click="goSearch(item)">
                            <img class="head" :src="item.avatar"/>
                            <div class="info">
                                <p class="name">{{item.name}}</p>
                                <p class="job">{{item.professionalTitle}}</p>
                                <p class="intro">{{item.intro}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <i class="next" v-show="data.list.length>4" @click="next"></i>
        </div>
    </div>
</template>
<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
declare function require(string): string;
@Component({})
export default class Banner extends Vue{
    @Prop()    
    data: Object   
    @Prop()
    index:number
    start = 0;
    moveStyle = {
        'transform':'translateX(0)'
    }
    prev(){
        if(this.start==0) return;
        this.start--;
        this.moveStyle = {
            'transform':`translateX(-${this.start*306}px)`
        }
    }
    next(){
        if(this.start==this.data.list.length-4) return;
        this.start++;
        this.moveStyle = {
            'transform':`translateX(-${this.start*306}px)`
        }
    }
    goSearch(obj){
        this.$router.push({
            path:'/search',
            query:{
                keywords:obj.name
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    .recommend-module{
        padding: 100px 0;
        &.white{
            background: #fff;
            box-shadow:0px 5px 27px -2px rgba(0,0,0,0.09);
        }
        .content{
            width: 1200px;
            position: relative;
            margin:0 auto;
            &:hover{
                .next,.prev{
                    opacity: 1;
                }
            }
            .scroll-box{
                overflow: hidden;
                height: 258px;
            }
            .list-box{
                height: 288px;
                width: 100%;
                overflow-x: scroll;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
                position: relative;
                .list{
                    display: flex;
                    height: 258px;
                    position: absolute;
                    top:0;
                    left: 0;
                    transition: all 0.3s;
                    .item{
                        width: 279px;
                        height: 100%;
                        position: relative;
                        margin-right: 27px;
                        flex-shrink:0;
                        cursor: default;
                        &:hover{
                            .info{
                                transform: translateY(0);
                            }
                        }
                        &:last-child{
                            margin-right: 0;
                        }
                        .head{
                            width: 100%;
                            height: 100%;
                        }
                        .info{
                            position: absolute;
                            z-index: 2;
                            top:0;
                            left: 0;
                            background: rgba(0,0,0,.4);
                            padding: 25px 30px;
                            width: 100%;
                            height: 100%;
                            color:#fff;
                            text-align: left;
                            transform: translateY(100%);
                            transition: transform 0.3s;
                            .name{  
                                font-size:28px;
                                line-height: 36px;
                            }
                            .job{
                                font-size: 16px;
                                line-height: 22px;
                                margin:15px 0;
                            }
                            .intro{
                                font-size: 14px;
                                line-height:22px;
                                width:100%;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 4;
                                overflow: hidden;
                            }
                        }
                    }
                }
            }
            .prev{
                position: absolute;
                cursor: pointer;
                width: 41px;
                height: 40px;
                left:-55px;
                top:109px;
                background:url('../../assets/images/prev.png')no-repeat 50% 50% / cover;
                opacity: 0;
                transition: all 0.3s;
            }
            .next{
                position: absolute;
                cursor: pointer;
                width: 41px;
                height: 40px;
                right:-55px;
                top:109px;
                background:url('../../assets/images/next.png')no-repeat 50% 50% / cover;
                opacity: 0;
                transition: all 0.3s;
            }
        }
    }
</style>

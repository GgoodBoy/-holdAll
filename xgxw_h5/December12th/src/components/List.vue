<template>
    <div class="my-list">
        <slot></slot>
        <div class="my-list-loading" v-if="model">
            <svg viewBox="0 0 100 100" class="spinner" :style="{'fill':color}">
                <rect transform="rotate(0 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(30 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.083s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(60 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.166s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(90 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(120 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.333s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(150 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.416s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(180 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(210 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.583s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(240 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.666s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(270 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(300 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.833s" repeatCount="indefinite"></animate>
                </rect>
                <rect transform="rotate(330 50 50) translate(0 -25)">
                    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.916s" repeatCount="indefinite"></animate>
                </rect>
            </svg>
            <p class="text" :style="{'color':color}">{{loadingText}}</p>
        </div>
        <p class="finished-tips" :style="{'color':color}" v-if="finished">{{dataLength===0?emptyText:finishedText}}</p>
    </div>
</template>
<script>
export default {
    props:{
        model:{
            type:Boolean,
            default:false
        },//loading
        finished:{
            type:Boolean,
            default:false
        },//是否请求完
        loadingText:{
            type:String,
            default:'加载中...'
        },//loading文案
        finishedText:{
            type:String,
            default:'没有更多了~'
        },//完成文案
        emptyText:{
            type:String,
            default:'暂无数据~'
        },//数据为空的文案
        dataLength:{
            type:Number,
            default:0
        },//列表数据长度
        color:{
            type:String
        }
    },
    created(){
        window.addEventListener('scroll',this.scrollEvent);
    },
    methods:{
        scrollEvent(){
            if(this.model||this.finished) return;
            var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
            if(scrollTop+windowHeight>=scrollHeight){
                this.check()
            }
        },
        check(){
            this.$emit('load')
        }
    },
    destroyed(){
        window.removeEventListener('scroll',this.scrollEvent)
    }
}
</script>
<style lang="scss" scoped>
    .my-list{
        .my-list-loading{
            text-align: center;
            padding:10px 0;
            font-size: 0;
            .spinner{
                fill: #999;
                width: 30px;
                height: 30px;
                rect{
                    x: 47.5;
                    y: 41;
                    rx: 3;
                    ry: 3;
                    width: 5px;
                    height: 18px;
                }
            }
            .text{
                font-size: 0.28rem;
                color:#999;
            }
        }
        .finished-tips{
            font-size: 0.28rem;
            color:#999;
            padding:10px 0;
            text-align: center;
        }
    }
</style>
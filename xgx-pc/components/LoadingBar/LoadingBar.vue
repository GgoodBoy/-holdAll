<template>
    <div class="my__loading-bar">
        <div
        class="my__loading-bar--bar"
        :class="isError ? 'my__loading-bar--error' : ''"
        role="bar"
        :style="{transform: 'translate3d(-'+(100-totalProgress)+'%, 0, 0)'}">
            <div class="my__loading-bar--peg"></div>
        </div>
        <div class="my__loading-bar--spinner" role="spinner" v-if="showSpinner">
            <div class="spinner-icon" :class="isError ? 'spinner-icon--error' : ''">
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {Component , Vue } from 'vue-property-decorator'
@Component
export default class LoadingBar extends Vue{
    speed:Number = 5
    easing:String = 'linear'//加载动画
    percentNum:Number = 0//每次前进的百分比
    totalProgress:Number = 0//控制顶部条形进度条x轴的位移
    showSpinner:Boolean = true//是否显示圆圈加载
    isError:Boolean = false//是否发生错误
}
</script>
<style lang="scss" scoped>
    .my__loading-bar{
        .my__loading-bar--bar{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            z-index: 9999;
            transition: all .2s ease;
            transform: translate3d(-100%,0,0);
            background: #C30D23;
            .my__loading-bar--peg{
                display: block;
                position: absolute;
                right: 0;
                width: 100px;
                height: 100%;
                box-shadow: 0 0 10px #ffdc00, 0 0 5px #ffdc00;
                opacity: 1;
                transform: rotate(3deg) translateY(-4px);
            }
        }
        .my__loading-bar--spinner{
            display: block;
            position: fixed;
            z-index: 1031;
            top: 15px;
            right: 15px;
            .spinner-icon{
                width: 18px;
                height: 18px;
                box-sizing: border-box;
                border: 2px solid transparent;
                border-top-color: #C30D23;
                border-left-color: #C30D23;
                border-radius: 50%;
                animation: spinner 0.7s linear infinite;
            }
        }
    }
    @keyframes spinner {
        from{
            transform: rotate(0deg)
        }
        to{
            transform: rotate(360deg)
        }
    }
</style>

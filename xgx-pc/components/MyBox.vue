<template>
    <div class="my-box" :class="className">
        <span class="t-l" v-if="!lowBrowser"></span>
        <span class="t-r" v-if="!lowBrowser"></span>
        <span class="b-l" v-if="!lowBrowser"></span>
        <span class="b-r" v-if="!lowBrowser"></span>
        <slot name="content"></slot>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class MyBox extends Vue {
    lowBrowser:boolean = false
    @Prop()
    className: string 
    @Prop({default:'#fff'})
    color:string 
    mounted(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        
        var browser = {
            versions: function () {
                var u = navigator.userAgent;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                };
            }()
        }
        if (browser.versions.trident && !isIE11) {
            this.lowBrowser = true
        }
  }
}
</script>
<style lang="scss" scoped>
    .my-box{
        position: relative;
        display: inline-block;
        overflow: hidden;
        min-width: 80px;
        min-height: 20px;
        clip-path:polygon(0px 34px,6px 34px,6px 40px,379px 40px,379px 34px,385px 34px,385px 6px,379px 6px,379px 0px,6px 0px,6px 6px,0px 6px);
        &.medium{
            clip-path:polygon(0px 34px,6px 34px,6px 40px,254px 40px,254px 34px,385px 34px,385px 6px,254px 6px,254px 0px,6px 0px,6px 6px,0px 6px);
        }
        &.small{
            clip-path:polygon(0px 34px,6px 34px,6px 40px,139px 40px,139px 34px,385px 34px,385px 6px,139px 6px,139px 0px,6px 0px,6px 6px,0px 6px);
        }
        &.mini{
            clip-path:polygon(0px 34px,6px 34px,6px 40px,99px 40px,99px 34px,385px 34px,385px 6px,99px 6px,99px 0px,6px 0px,6px 6px,0px 6px);
        }
        span{
            position: absolute;
            width: 7px;
            height: 7px;
            display: block;
            z-index: 2;
            background: #fff;
            &.t-l{
                top:0px;
                left: 0px;
                border-bottom:1px solid #999;
                border-right:1px solid #999;
            }
            &.t-r{
                top:0px;
                right: 0px;
                border-bottom:1px solid #999;
                border-left:1px solid #999;
            }
            &.b-l{
                bottom:0px;
                left: 0px;
                border-top:1px solid #999;
                border-right:1px solid #999;
            }
            &.b-r{
                bottom:0px;
                right: 0px;
                border-top:1px solid #999;
                border-left:1px solid #999;
            }
        }
    }
</style>

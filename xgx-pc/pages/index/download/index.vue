<template>
    <div class="download">
		<div class="section1">
			<div class="box">
                <div class="iphone1"></div>
                <div class="iphone2"></div>
                <div class="download1" @click="goCode"></div>
                <div class="download2" @click="goCode"></div>
                <div class="child">
                    <div class="eye1"></div>
                    <div class="eye2"></div>
                </div>
            </div>
		</div>
		<div class="section2">
            <div class="box">
                <div class="text1"></div>
                <div class="iphone3"></div>
                <div class="iphone4"></div>
            </div>
        </div>
        <div class="section3">
            <div class="box">
                <div class="iphone5"></div>
                <div class="iphone6"></div>
                <div class="iphone7"></div>
                <div class="text2"></div>
            </div>
            <div class="book"></div>
            <div class="code" v-show="show">
                <i @click="show=false"></i>
            </div>
        </div>
	</div>
</template>
<script lang="ts">
import { Component , Vue } from 'vue-property-decorator'
// let img1 = require('@/assets/images/download_section0_logo.png');

@Component({})
export default class DownLoad extends Vue{
   show = true
    head(){
        return {
            title:'APP下载 | 学国学网',
        }
    }
   goCode(){
        // let top = 0;
        this.show = true;
        // let timer = setInterval(function(){
        //     top+=100;
        //     document.body.scrollTop = top;
        //     if(top>=1400){
        //         clearInterval(timer);
        //     }
        // },30)
   }
}
</script>
<style lang="scss" scoped>
    .download{
        background: #fff;
        .section1{
            height: 809px;
            background: url('../../../assets/images/download/bgd1.png')no-repeat 50% 50% / cover;
            .box{
                width: 1200px;
                margin:0 auto;
                height: 100%;
                padding-top:200px;
                position: relative;
                .iphone1{
                    position: absolute;
                    height: 539px;
                    width: 266px;
                    background: url('../../../assets/images/download/iphone1.png')no-repeat 50% 50% / cover;
                    z-index: 2;
                    bottom: 0;
                    left: 0;
                }
                .iphone2{
                    position: absolute;
                    height: 599px;
                    width: 323px;
                    background: url('../../../assets/images/download/iphone2.png')no-repeat 50% 50% / cover;
                    z-index: 1;
                    bottom:0;
                    left:190px;
                }
                .download1{
                    position: absolute;
                    height: 72px;
                    width: 239px;
                    background: url('../../../assets/images/download/download1.png')no-repeat 50% 50% / cover;
                    top:405px;
                    right: 240px;
                    z-index: 2;
                }
                .download2{
                    position: absolute;
                    height: 72px;
                    width: 239px;
                    background: url('../../../assets/images/download/download2.png')no-repeat 50% 50% / cover;
                    top:492px;
                    right: 240px;
                    z-index: 2;
                }
                .child{
                    width: 420px;
                    height: 470px;
                    position: absolute;
                    background: url('../../../assets/images/download/child.png')no-repeat 50% 50% / cover;
                    bottom:20px;
                    right: -110px;
                }
                .eye1{
                    position: absolute;
                    top:216px;
                    left:155px;
                    background: url('../../../assets/images/download/eye1.png')no-repeat 50% 50% / cover;
                    height: 38px;
                    width: 26px;
                    animation: eye 4s linear infinite;
                }
                .eye2{
                    position: absolute;
                    top:216px;
                    left:238px;
                    background: url('../../../assets/images/download/eye2.png')no-repeat 50% 50% / cover;
                    height: 38px;
                    width: 26px;
                    animation: eye 4s linear infinite;
                }
            }
        }
        .section2{
            height: 591px;
            .box{
                width: 1200px;
                margin:0 auto;
                height: 100%;
                position: relative;
                overflow: hidden;
                .text1{
                    width: 279px;
                    height: 191px;
                    position: absolute;
                    background: url('../../../assets/images/download/text1.png')no-repeat 50% 50% / cover;
                    top:181px;
                    left: 140px;
                }
                .iphone3{
                    width: 322px;
                    height: 651px;
                    position: absolute;
                    background: url('../../../assets/images/download/iphone3.png')no-repeat 50% 50% / cover;
                    top:75px;
                    left: 670px;
                    z-index: 2;
                }
                .iphone4{
                    width: 306px;
                    height: 620px;
                    position: absolute;
                    background: url('../../../assets/images/download/iphone4.png')no-repeat 50% 50% / cover;
                    top:120px;
                    left: 904px;
                    z-index: 1;
                }
            }
        }
        .section3{
            width: 100%;
            height: 622px;
            position: relative;
            background: url('../../../assets/images/download/bgd2.png')no-repeat 50% 50% / cover;
            .box{
                position: relative;
                margin:0 auto;
                width: 1200px;
                height: 100%;
                overflow: hidden;
                .iphone5{
                    width: 272px;
                    height: 548px;
                    position: absolute;
                    background: url('../../../assets/images/download/iphone5.png')no-repeat 50% 50% / cover;
                    top:200px;
                    left: 0;
                    z-index: 1;
                }
                .iphone6{
                    width: 322px;
                    height: 643px;
                    position: absolute;
                    background: url('../../../assets/images/download/iphone6.png')no-repeat 50% 50% / cover;
                    top:140px;
                    left: 164px;
                    z-index: 2;
                }
                .iphone7{
                    width: 270px;
                    height: 546px;
                    position: absolute;
                    background: url('../../../assets/images/download/iphone7.png')no-repeat 50% 50% / cover;
                    top:198px;
                    left: 410px;
                    z-index: 1;
                }
                .text2{
                   width: 456px;
                    height: 192px;
                    position: absolute;
                    background: url('../../../assets/images/download/text2.png')no-repeat 50% 50% / cover;
                    top:280px;
                    right:0;
                    z-index: 1;
                }
            }
            .book{
                width: 210px;
                height: 120px;
                position: absolute;
                background: url('../../../assets/images/download/book.png')no-repeat 50% 50% / cover;
                top:50px;
                right:100px;
                z-index: 1;
            }
            .code{
                width: 204px;
                height: 244px;
                background: url('../../../assets/images/download/code.png')no-repeat 50% 50% / cover;
                position: fixed;
                right: 120px;
                bottom:30px;
                z-index:3;
                i{
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    position: absolute;
                    right: 0px;
                    top:0px;
                    background: url('../../../assets/images/download/close.png')no-repeat 50% 50% / cover;
                }
            }
        }
    }
    @keyframes eye{
        0%{
            transform: scaleY(0);
        }
        5%{
            transform: scaleY(1);
        }
        10%{
            transform: scaleY(0);
        }
        15%{
            transform: scaleY(1);
        }
        100%{
            transform: scaleY(1);
        }
    }
</style>

<template>
    <div class="fourth-page">
        <div class="box1">
            <img class="poster" :src="poster" />
            <!-- <div class="user-info" :style="curStyle.style1">
                <div class="avatar"><img :src="avatar" /></div>
                <p class="name">{{name}}</p>
            </div>
            <div class="content" :style="curStyle.style2">{{content}}</div>
            <div class="code" :style="curStyle.style3">
                <img :src="code"/>
                <p>扫码送祝福</p>
            </div>
            <img :src="posterText" class="poster-text" :style="curStyle.style4"/> -->
            <img :src="downloadUrl" class="download" v-if="downloadUrl.length>0"/>
        </div>
        <div class="box2">
            <img class="poster" :src="poster"/>
            <div class="user-info" :style="curStyle.style1">
                <div class="avatar"><img :src="avatar" /></div>
                <p class="name">{{name}}</p>
            </div>
            <div class="content" :style="curStyle.style2">{{content}}</div>
            <div class="code" :style="curStyle.style3" :class="`code${posterIndex}`">
                <img :src="code" />
                <p>扫码送祝福</p>
            </div>
            <img :src="posterText" class="poster-text" :style="curStyle.style4"/>
        </div>
    </div>
</template>
<script>
import html2canvas from 'html2canvas';
import {store,mutations} from '../store'
import poster1 from '../assets/image/poster1.png'
import poster2 from '../assets/image/poster2.png'
import poster3 from '../assets/image/poster3.png'
import poster4 from '../assets/image/poster4.png'
import posterText from '../assets/image/poster_text.png'
import code from '../assets/image/code1.png'
export default {
    data(){
        return{
            poster:'',
            posterText:posterText,
            posterArr:[poster1,poster2,poster3,poster4],
            avatar:'',
            name:'',
            styleArr:[
                {   style1:{'top':'2.76rem','left':'0.55rem'},
                    style2:{'top':'4.55rem','left':'0.65rem'},
                    // style3:{'top':'9.5rem','left':'0.62rem'},
                    style3:{'top':'14.5rem','left':'50%','marginLeft':'-0.6rem'},
                    style4:{'top':'14.1rem','left':'2.36rem'}
                },
                {
                    style1:{'top':'3.56rem','left':'0.46rem'},
                    style2:{'top':'5.35rem','left':'0.56rem'},
                    // style3:{'top':'7.16rem','left':'0.94rem'},
                    style3:{'top':'14rem','left':'50%','marginLeft':'-0.8rem'},
                    style4:{'top':'13.62rem','left':'2.36rem'}
                },
                {
                    style1:{'top':'3.46rem','right':'0.76rem'},
                    style2:{'top':'5.16rem','right':'0.76rem','width':'4rem'},
                    // style3:{'top':'9.7rem','right':'0.76rem'},
                    style3:{'bottom':'0.2rem','right':'0.2rem'},
                    style4:{'top':'13rem','right':'0.64rem'}
                },
                {
                    style1:{'top':'2.56rem','left':'0','width':'100%'},
                    style2:{'top':'4.3rem','left':'0.5rem','width':'calc(100% - 1rem)','textAlign':'center'},
                    // style3:{'top':'10rem','left':'0.5rem'},
                    style3:{'top':'14rem','left':'50%','marginLeft':'-0.8rem'},
                    style4:{'top':'13.62rem','left':'2.36rem'}
                },
            ],
            curStyle:{},
            code:code,
            downloadUrl:''
        }
    },
    props:['showTips'],
    computed:{
        posterIndex(){
            return store.posterIndex
        },
        content(){
            return store.content
        },
        userInfo(){
            return store.userInfo
        }
    },
    created(){
        this.poster = this.posterArr[this.posterIndex]
        this.curStyle = this.styleArr[this.posterIndex]
        if(this.userInfo.nickname){
            this.avatar = this.userInfo.headimgurl;
            this.name = this.userInfo.nickname;
        }
    },
    mounted(){
        this.$toast.loading()
        setTimeout(()=>{
            this.createPoster()
        },300)
    },
    methods:{
        createPoster(){
            let dom = document.querySelector('.box2')
            let width = dom.offsetWidth;
            let height = dom.offsetHeight;
            let scale = 2
            let html2canvasFunc = window.html2canvas || html2canvas
            html2canvasFunc(dom,
            {
                dpi: window.devicePixelRatio*2,
                scale:scale,
                allowTaint:false,
                width:width,
                heigth:height,
                useCORS: true,
                logging: false,
            }).then((canvas) => {
                const context = canvas.getContext('2d');
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;
                this.downloadUrl = canvas.toDataURL("image/png");
                this.$emit('update:showTips',true)
                setTimeout(()=>{
                    this.$toast.clear()
                },2000)
            })    
        }
    }
}
</script>
<style lang="scss" scoped>
    .fourth-page{
        position: relative;
        .box1{
            position: relative;
            min-height: 100%;
            .poster{
                opacity: 0;
            }
        }
        .box2{
            position: fixed;
            width: 100vw;
            min-height: 100vh;
            top:-2000px;
            left: 0;
            font-size: 0;
        }
        .poster{
            width: 100vw;
            z-index: 2;
            position: relative;
        }
        .user-info{
            font-size: 0;
            position: absolute;
            top:2rem;
            height: 1.28rem;
            text-align: center;
            z-index: 3;
            .avatar{
                width:1.28rem;
                height: 1.28rem;
                border-radius: 50%;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: #fff;
                border-radius: 50%;
                overflow: hidden;
                img{
                    display: block;
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    top:50%;
                    left: 50%;
                    position: absolute;
                    transform: translate(-50%,-50%);
                }
            }
            .name{
                font-size:0.36rem;
                margin-left: 0.15rem;
                display: inline-block;
                vertical-align: middle;
            }
        }
        .content{
            font-size:0.4rem;
            line-height:0.52rem ;
            position: absolute;
            width: 6.5rem;
            z-index: 3;
        }
        .code{
            position: absolute;
            font-size: 0;
            z-index: 3;
            &.code0{
                img{
                    width:1.2rem;
                    height: 1.2rem;
                }
                p{
                    width: 1.4rem;
                    margin-top:0.06rem;
                    font-size:0.24rem;
                    margin-left: -0.1rem;
                }
            }
            img{
                width:1.6rem;
                height: 1.6rem;
            }
            p{
                width:1.6rem;
                font-size:0.26rem;
                margin-top:0.16rem;
                text-align: center;
            }
        }
        .poster-text{
            position: absolute;
            width: 2.8rem;
            z-index: 3;
        }
        .download{
            width: 100%;
            max-width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 4;
        }
    }
</style>
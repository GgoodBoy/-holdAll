<template>
    <div class="my-toast-dialog" v-if="visible">
            <div class="mask" v-if="forbidClick"></div>
            <div class="my-toast" :class="{'has-icon':type!=''}">
                <div class="my-toast-icon" v-if="type=='loading'">
                    <svg viewBox="25 25 50 50" class="my-loading-icon circular">
                        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                    <svg viewBox="0 0 100 100" class="my-loading-icon spinner">
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
                </div>
                <div class="my-toast-content">{{message}}</div>
            </div>
        </div>  
</template>
<script>
export default {
    name:'my-toast',
    data(){
        return{
            visible:false,
            forbidClick:false,
            message:'',
            type:'',
            duration:2500,
            timer:null
        }
    },
    watch:{
        message(cur){
            clearTimeout(this.timer)
            if(this.duration===0) return;
            this.timer = setTimeout(()=>{
                this.visible = false;
                this.remove()
            },this.duration)
        }
    },
    created(){
        if(this.visible){
            if(this.duration===0) return;
            this.timer = setTimeout(()=>{
                this.visible = false;
                this.remove()
            },this.duration)
        }   
    }
}
</script>
<style lang="scss">
    .my-toast-dialog{
        .mask{
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
            height:100%;
            z-index: 1000;
        }
        .my-toast{
            position: fixed;
            top:50%;
            left: 50%;
            max-width: 80%;
            min-width: 88px;
            padding:8px 12px;
            transform: translate(-50%,-50%);
            z-index: 1001;
            background: rgba(0,0,0,0.7);
            border-radius: 8px;
            font-size: 14px;
            line-height: 20px;
            white-space: pre-wrap;
            text-align: center;
            word-wrap: break-word;
            color:#fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-sizing: content-box;
            &.has-icon{
                min-height: 88px;
                padding:16px;
            }
            .my-toast-icon{
                padding:4px;
                color:#fff;
                font-size: 0;
                height: 38px;
                .my-loading-icon{
                    &.circular{
                        height:30px;
                        width:30px;
                        animation: loading-rotate 2s linear infinite;
                        .path{
                            animation: loading-dash 1.5s ease-in-out infinite;
                            stroke-dasharray: 90,150;
                            stroke-dashoffset: 0;
                            stroke-width: 3;
                            stroke: currentColor;
                            stroke-linecap: round;
                        }
                    }
                    &.spinner{
                        display: none;
                        fill: #fff;
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
                }
            }
        }
    }
</style>
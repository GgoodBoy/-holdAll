<template>
    <div class="error_page">
        <img :src="errorImg"/>
        <p>对不起，您要访问的页面可能跑到了另一个平行宇宙中。现在返回首页。</p>
        <a @click="goIndex">返回首页({{time}})</a>
    </div>
</template>
<script>
import error from '@/assets/image/404.png'
let timer;
export default {
    data(){
        return {
            errorImg:error,
            time:5
        }
    },
    methods:{
        goIndex(){
            this.$router.replace('/')
        }
    },
    created(){
        timer = setInterval(()=>{
            this.time--;
            if(this.time==0){
                clearInterval(timer)
                this.$router.replace('/')
            }
        },1000)
    },
    beforeDestroy(){
        clearInterval(timer)
    }    
}
</script>
<style lang="scss" scoped>
    .error_page{
        text-align:center;
        img{
            width: 5rem;
            margin-top:1rem;
            margin-left: 0.4rem;
        }
        p{
            color:#bbb;
            font-size: 0.28rem;
            margin:1rem auto;
            width: 70%;
        }
        a{
            background: rgb(229, 28, 35);
            color:#fff;
            display: inline-block;
            padding: 0.2rem 0.5rem;
            font-size: 0.28rem;
        }
    }
</style>

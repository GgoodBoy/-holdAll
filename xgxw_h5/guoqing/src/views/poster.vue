<template>
    <div class="poster-page">
        <p class="tips">长按保存到本地</p>
        <img :src="bgd"/>
    </div>
</template>
<script>
import bgd1 from '../assets/image/poster_beta.jpg'
import bgd2 from '../assets/image/poster_prod.jpg'
export default {
    data(){
        return{
            bgd:bgd2
        }
    },
    created(){
        let from = sessionStorage.getItem('from');
        if(from&&from=='result'){
            
        }else{
            this.$router.replace('/')
        }
    }
}
</script>
<style lang="scss" scoped>
    .poster-page{
        position: relative;
        img{
            display: block;
        }
        .tips{
            border:1px dashed #C30D23;
            color:#C30D23;
            font-size: 0.3rem;
            width: 2.88rem;
            height: 0.73rem;
            line-height: 0.73rem;
            top:1.68rem;
            border-radius: 0.48rem;
            text-align: center;
            position: absolute;
            left: 50%;
            margin-left: -1.44rem;
        }
    }
</style>
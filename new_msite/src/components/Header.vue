<template>
    <div class="header">
        <div class="fixed-box">
            <div class="left-icon" @click="$router.go(-1)">
                <van-icon name="arrow-left" class="return-left"/>
            </div>
            <p>{{name}}</p>
            <div class="home-icon" @click="$router.push('/')">
                <van-icon name="wap-home" class="user-setting-icon" />
            </div>
        </div>
        <div class="block"></div>
    </div>	
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:['name']
}
</script>
<style lang="scss" scoped>
    .header{
        position: relative;
        .block{
            height: 1rem;
        }
        .fixed-box{
            display: flex;
            height: 1rem;
            justify-content: center;
            align-items: center;
            position: relative;
            background: #fff;
            position: fixed;
            z-index: 100;
            width: 100%;
            left: 50%;
            max-width: 414px;
            transform: translateX(-50%);
        }
        .left-icon{
            position: absolute;
            top:50%;
            left: 0.2rem;
            margin-top:-0.2rem;
            font-size: 0.32rem;
        }
        p{
            height: .5rem;
            font-size: 0.32rem;		
        }	
        .home-icon{
            position: absolute;
            top:50%;
            right:0;
            padding:0.1rem 0.2rem;
            margin-top:-0.4rem;
            i{
                display: block;
                font-size: 0.48rem;
                color:#323232;
            }
        }
    }
</style>
<template>
    <div class="course-header" :class="{'fixed':startPlay&&!mqqbrowser}" :style="{top:hasOpenApp&&startPlay&&!mqqbrowser?'0.98rem':'0px'}" @click.stop="test">
        <div class="left-icon" @click="$router.go(-1)">
            <van-icon name="arrow-left" class="return-left"/>
        </div>
        <div class="right-icon">
            <div class="share-icon" @click="share"></div>
            <div class="user-icon" @click="$router.push('/user')"></div>
            <van-icon name="wap-home" class="home-icon" @click="$router.push('/')"/>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{

        }
    },
    computed:{
        ...mapState(['hasOpenApp']),
    },
    props:['shareFlag','startPlay','mqqbrowser'],
    methods:{
        share(){
            let isLogin = this.$getCookie('uInfo');
            if(!isLogin){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath);
				this.$router.push('/auth')
			}else{
				this.$emit('update:shareFlag',true)
			}
        },
        test(){
            
        }
    }
}
</script>
<style lang="scss" scoped>
    .course-header{
        display: flex;
        height: 1rem;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        padding:  0 0.3rem;
        width: 100%;
        top:0;
        left: 0;
        z-index: 4;
        &.fixed{
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            max-width: 414px;
        }
        .left-icon{
            font-size: 0.32rem;
            padding: 0.2rem 0;
            color:#fff;
        }
        .right-icon{
            font-size: 0;
            i{
                font-size: 0.48rem;
                color:#323232;
                background: #fff;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
            }
            .share-icon{
                display: inline-block;
                vertical-align: middle;
                height: 0.48rem;
                width: 0.48rem;
                border-radius: 50%;
                background: url('../../assets/image/share.png')no-repeat 50% 50% / cover;
            }
            .user-icon{
                display: inline-block;
                vertical-align: middle;
                height: 0.48rem;
                width: 0.48rem;
                border-radius: 50%;
                margin:0 0.1rem;
                background: url('../../assets/image/person.png')no-repeat 50% 50% / cover;
            }
        }
    }
</style>
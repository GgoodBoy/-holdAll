<template>
    <!-- height="400px"  -->
    <el-carousel height="266px"
                v-if="message.moduleType === 'banner'">
        <el-carousel-item v-for="(carouselItem,i) in message.list"
                        :key="i"
                        class="carousel-items">
            <img v-if="carouselItem.picUrl"
                :src="carouselItem.picUrl"
                :alt="carouselItem.title">
            <h3 v-else>请完善banner信息</h3>
        </el-carousel-item>
    </el-carousel>
</template>
<script>
export default {
    data(){
        return {}
    },
    created(){
        console.log(this.message)
    },
    props:["message"],
    computed:{},
    methods:{},
    mounted(){}
}
</script>
<style scoped lang="scss">
.list-item {
    text-align: center;
    border: 1px solid #ccc;
    line-height: 40px;
    position: relative;
    transition: 0.3s;
    .carousel-items {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
        background-color: #99a9bf;
        img{
            margin: auto;
            max-width: none;
            width: 100%;
        }
    }
    .item-handle {
        display: none;
        width: 100px;
        height: 30px;
        position: absolute;
        right: -100px;
        top: 0;
        .hand-btn {
            padding: 0;
        }
        .hand-icon {
            font-size: 30px;
            color: #333;
            cursor: pointer;
            &:active {
                font-size: 35px;
            }
        }
    }
    &:hover .item-handle {
        display: inline-block;
    }
}
</style>


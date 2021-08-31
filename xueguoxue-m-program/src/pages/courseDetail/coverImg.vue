<template>
    <view class="cover-pluge" v-if="dataIntroduce.length>0"> 
        <mp-html :content="text"/>
        <!-- <rich-text :nodes="text"></rich-text> -->
    </view>
</template>

<script>
import mpHtml from '@/wxcomponents/mp-html/mp-html'
export default {

    data() {
        return {}
    },
    computed:{
        text(){
            return this.dataIntroduce.replace(/<img([\s]+)/ig, '<img class="img" style="max-width:100%!important;display:block;width:100%;" ')
        }
    },
    props:['dataIntroduce'],
    onReady: function (res) {
    },
    components:{mpHtml},
    created(){
       
    },
    methods: { 
    }
        
}
</script>
<style lang="scss">
.cover-pluge{
    padding: 30rpx;
    img{
        width: 100%;
        max-width: 100%;
        display: block;
    }
}
</style>
<style>
</style>
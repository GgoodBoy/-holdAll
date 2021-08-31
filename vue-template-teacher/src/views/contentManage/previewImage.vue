<template>
    <div class="preview-image">
        <el-image 
            class="small-image"
            style="width:10px;height:10px;"
            :src="url" 
            :preview-src-list="current">
        </el-image>
        <i v-if="show" class="el-icon-circle-close preview-close" @click="closePreviewImage"></i>
        <transition name="fade" v-if="show">
            <div class="all-image" v-if="srcList.length>1">
                <div class="item" :class="{'active':current==item}" v-for="(item,index) in srcList" :key="index" @click="choose(item)">
                    <el-image
                    style="width:100%;height:100%;"
                    :src="item"
                    :fit="'contain'"></el-image>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data(){
        return{
            show:false,
            url:'',
            current:[''],
        }
    },
    props:['showFlag','srcList'],
    created(){
        let loadingInstance = this.$loading({
            target:document.querySelector('body'),
            background: 'rgba(0, 0, 0, 0.7)'
        });
        this.url = this.srcList[0]
        this.current = this.srcList.slice(0,1);
        let img = new Image()
        img.src = this.current;
        img.onload = ()=>{
            loadingInstance.close()
        }

    },
    mounted(){
        let timer = setInterval(() => {
            let dom = document.querySelector('.small-image .el-image__preview')
            if(dom){
                clearInterval(timer);
                dom.click();
                this.show = true;
                return;
            }
        }, 100);
        document.onkeydown = (e)=>{
            if(e.keyCode==27){
                this.closePreviewImage()
            }
        }
    },
    methods:{
        closePreviewImage(){
            let dom = document.querySelector(".el-image-viewer__close")
            if(dom){
                dom.click()
            }
            this.show = false;
            setTimeout(()=>{
                this.$emit('update:showFlag',false)
            },300)
        },
        choose(obj){
            this.current = [obj];
        }
    }
}
</script>
<style lang="scss">
    .preview-image{
        .small-image{
            .el-image__inner{
                position: fixed;
                z-index: 9000;
                opacity: 0;
                width: 10px;
                height: 10px;
            }
        }
        .el-image-viewer__wrapper{
            background: rgba(0,0,0,0.7);
        }
        .el-image-viewer__mask{
            display: none!important;
        }
        .el-image-viewer__close{
            opacity: 0;
        }
        .el-image-viewer__canvas{
            height: 80%!important;
            overflow:auto;
        }
        .el-image-viewer__actions{
            bottom:calc(10px + 20%)!important;
        }
        .preview-close{
            position: fixed;
            top: 40px;
            right: 40px;
            width: 40px;
            height: 40px;
            font-size: 40px;
            color:#9E0E00;
            font-weight: normal;
            z-index: 2001;
        }
        .all-image{
            width: 100%;
            position: fixed;
            z-index: 2001;
            bottom:0;
            left: 0;
            height: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
            .item{
                height:150px;
                width: 150px;
                margin:0 10px;
                &.active{
                    border-radius: 5px;
                    border:2px dashed #9E0E00;
                }
            }
        }
    }
</style>
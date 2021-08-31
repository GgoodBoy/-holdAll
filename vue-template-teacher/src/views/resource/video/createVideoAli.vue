<template>
    <div>
        <Breadcrumb :menuList ='titleList'></Breadcrumb>
        <UploadMedia :fileType="'video'" :videoType="'1'"></UploadMedia>  
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import UploadMedia from "@/components/uploadMedia/UploadMedia"
export default {
    data(){
        return{
            titleList:[
                {
                    name:'素材',
                    pathInfo:'/resource/video'
                },                
                {
                    name:'视频库',
                    pathInfo:'/resource/video'
                },
                {
                    name:'视频上传',
                    pathInfo:''
                }                               
            ]
        }
    },
    components:{
        Breadcrumb,UploadMedia
    }
}
</script>
<style lang="scss" scoped>

</style>

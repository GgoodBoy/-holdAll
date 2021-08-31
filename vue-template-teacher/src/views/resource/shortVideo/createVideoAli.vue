<template>
    <div>
        <Breadcrumb :menuList ='titleList'></Breadcrumb>
        <UploadMedia :fileType="'video'" :videoType="'2'"></UploadMedia>  
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
                    pathInfo:'/resource/shortVideo'
                },
                {
                    name:'短视频库',
                    pathInfo:'/resource/shortVideo'
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

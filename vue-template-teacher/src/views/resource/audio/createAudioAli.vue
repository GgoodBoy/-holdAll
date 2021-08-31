<template>
    <div>
        <Breadcrumb :menuList ='titleList'></Breadcrumb>
        <UploadMedia :fileType="'audio'"></UploadMedia>  
    </div>
</template>
<script>
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import UploadMedia from "@/components/uploadMedia/UploadMedia";
export default {
    data(){
        return{
            titleList:[
               {
                    name:'素材',
                    pathInfo:'/resource/audio'
                },                
                {
                    name:'音频库',
                    pathInfo:'/resource/audio'
                },
                {
                    name:'音频上传',
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

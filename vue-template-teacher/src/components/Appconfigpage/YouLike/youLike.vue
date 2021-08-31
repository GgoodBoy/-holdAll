<template>
    <addcontentlist :modelFromChildren ="modeAllInfo" :urlProp="urlList" :powerArryListSun="powerArryList"></addcontentlist>
</template>
<script>
import {mapState,mapActions} from 'vuex'
import addcontentlist from "@/components/Appconfigpage/ASamePlugin/asameplugin";
export default {
    components:{
        addcontentlist
    },
    data(){
        return {}
        },
    created(){},
    props:["modeAllInfo","powerArryList",'urlList'],
    computed:{},
    methods:{},
    mounted(){
    }
}
</script>

<style>
 @import "../../formSynthesisPlugin/my-component.css";
</style>
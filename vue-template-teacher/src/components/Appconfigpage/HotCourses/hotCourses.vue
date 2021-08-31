<template>
    <div>
        <addcontentlist :modelFromChildren ="modeAllInfo" :urlProp="urlList" :powerArryListSun="powerArryList"></addcontentlist>
    </div>
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

</style>
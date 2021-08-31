<template>
    <div class="home-page" ref="appBox" v-loading='loading'>
        <Banner v-if="this.tableModelList.findIndex(item=>item.moduleType=='banner')>=0" :bannerlist="this.tableModelList.find(item=>item.moduleType=='banner').list" ></Banner>
        <div v-for="(item,index) in tableModelList.filter(item=>item.moduleType!='banner')" :key='index' class="modelBox">
            <classify v-if="item.moduleType=='classify'" :data="item" :index="index"></classify>
            <Columns style="padding:20px 0;" :titleShow="false" v-if="item.moduleType=='columnsCourse'||item.moduleType=='advertising'" :ColumnsDataList="item" :index="index"></Columns>
            <OtherMode :titleShow="true" v-if="item.moduleType=='popularCourses'||item.moduleType=='featured'||item.moduleType=='guessLike'||item.moduleType=='timeZone'" :modelList="item" :index="index"></OtherMode>
            <freeCourses v-if="item.moduleType=='freeGoodCourse'" :data="item" :index="index"></freeCourses>
            <teacherRecommend v-if="item.moduleType=='teacherRecommend'" :data="item" :index="index"></teacherRecommend>
        </div>
        <transition name="fade">
            <div class="xgxNative" transiton="fade" v-show="isShow">
                <div class="native">
                    <div class="native1" @click="clickEven">
                        <img :src="img1"/>
                    </div>
                </div>
                <div class="native">
                    <div class="native1" @click="appPageDown">
                        <img :src="img2"/>
                    </div>                
                </div>
                <div class="native">
                    <div class="native1" @click="topMoveEven">
                        <img :src="img3"/>
                    </div>                
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import { Component , Vue, Watch} from 'vue-property-decorator'
import { NuxtContext } from 'nuxt';
import {mapState,mapActions} from 'vuex'
import Banner from '~/components/modelList/Banner.vue';
import Columns from '~/components/modelList/ColumnsCourse.vue';
import OtherMode from '~/components/modelList/OtherModes.vue';
import freeCourses from '~/components/modelList/freeCourses.vue'
import teacherRecommend from '~/components/modelList/teacherRecommend.vue'
import classify from '~/components/modelList/classify.vue'
import ajaxs from '~/api/index.js';

const Logo1 = require('@/assets/images/home_kefu.png');
const Logo2 = require('@/assets/images/home_shouji.png');
const Logo3 = require('@/assets/images/home_zhiding.png');
// banner:banner图，
// columnsCourse：通栏课
// advertising：通栏图，
// classify：导航分类，
// popularCourses：热门课程，
// featured：推荐位，
// timeZone限时专区，
// guessLike：猜你喜欢

@Component({
    components:{Banner,Columns,OtherMode,freeCourses,teacherRecommend,classify},
    computed:{
        ...mapState(['switchEdition','userData'])
    },    
    methods:{
        ...mapActions(['setSwitchBoolCommit','setUserData'])
    },    
    async asyncData({app,params,req}:NuxtContext):Promise<any>{
        let type = 3
        let reg = new RegExp("(^| )versionType=([^;]*)(;|$)")
        if(req&&req.headers&&req.headers.cookie){
            let arr = req.headers.cookie.match(reg)
            type = arr?arr[2]:3
        }
        if(process.client){
            let arr = document.cookie.match(reg)
            type = arr[2]
        }
        let query = {
                params:{
                    type:type
                }
            }           
        let [getModellist] = await Promise.all([
                app.$axios.$get(ajaxs.getHomeModelListInfo,query),
            ])   
        return {
                tableModelList:getModellist.content
              }
    }
})
export default class Auth extends Vue{
    //3:PC成人版, 4:PC少儿版
    tableModelList:object[]=[];
    classLyPc:object[]=[];
    img1:any = Logo1;
    img2:any = Logo2;
    img3:any = Logo3;
    isShow:boolean=false;
    loading:boolean = false;
    created(){
        if(process.client){
            let type = this.$getCookie('versionType')
            let stateNum = type==3?true:false
            this.setSwitchBoolCommit(stateNum)
        }
    }  
    async asetHomeDataList(bool){
        this.loading = true;
        this.classLyPc = [];
        this.tableModelList = [];
        let query = {
            params:{
                type:bool?3:4
            }
        }
        let res=await this.$axios.$get(this.$server.getHomeModelListInfo,query) 
        if(res.status==200){
            let list1=[];
            let list2=[];
            res.content.forEach(element => {
                if(element.moduleType=='classify'){
                    list1 = element;
                    list2.push(element);
                }else{
                    list2.push(element);
                }
            });
            this.classLyPc = list1;
            this.tableModelList = list2;
            this.loading = false;
            // this.setCourseListDataCommit(this.classLyPc);
        }else{
            this.loading = false;
        }        
    }
    topMoveEven(){
        window.scrollTo({
                top: 0,
                behavior: "smooth"
        });
    } 
    clickEven(){
        qimoChatClick();
    }
    
    handleScroll() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;   
        if(scrollTop==0){
            this.isShow = false;
        }else{
            this.isShow = true;
        }
    }
    appPageDown(){
        this.$router.push({path:'/download'})
    }
    mounted(){
        window.addEventListener('scroll', this.handleScroll, true)
    }
}
</script>
<style lang="scss" scoped>
    .home-page{
        margin-top:-100px;
        text-align: center;
        position: relative;
        .xgxNative{
            position: fixed;
            right: 0;
            top:70%;
            width: 38px;
            z-index: 11;
            .native{
                width: 100%;
                height: 38px;
                margin-top: 2px;
                background: #C30D23;
                border-radius: 5px;
                .native1{
                    width: 100%;
                    height: 100%;
                    padding: 5px;
                    cursor: pointer;
                    color: #fff;
                    img{
                        width: 100%;
                    }
                }
            }
        }
    }
    .backBoxCss{
         box-shadow: #EDF7F5 0px 0px 30px 5px inset;//边框内阴影
         background: #F8FAFC;
    }  
    .fade-enter-active, .fade-leave-active {
            transition: opacity .5s
            }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }   
</style>
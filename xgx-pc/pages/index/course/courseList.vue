<template>
    <div class="course-list-page">
        <div class="page-top">
             <div class="content">
                <BreadCrumb :listData="breadCrumb"></BreadCrumb>
                <div class="classification clearfix" :class="{'no-data':classifyList.length==0}">
                    <div class="label-box">栏目</div>
                    <span class="colon">：</span>
                    <div class="value-box">
                        <p class="item" v-for="(item,index) in classifyList" :key="index" :class="{'active':item.active}" @click="chooseClassify(item)">{{item.classifyName}}</p>
                    </div>
                </div>
                <div class="free-type clearfix" :class="{'no-data':freeTypeArr.length==0}">
                    <div class="label-box">筛选</div>
                    <span class="colon">：</span>
                    <div class="value-box">
                        <p class="item" v-for="(item,index) in freeTypeArr" :key="index" :class="{'active':item.active}" @click="chooseType(item)">{{item.label}}</p> 
                    </div>
                </div>
            </div>
        </div> 
        <div class="page-body">
            <div class="condition">
                <p :class="sortType==1?'active':''" @click="chooseSortType(1)">最新</p>
                <p :class="sortType==2?'active':''" @click="chooseSortType(2)">最热</p>
            </div>
            <div class="course-list clearfix">
                <div class="course-item-box" v-for="(item,index) in courseList" :key="index">
                    <CourseItem :courseData="item"></CourseItem>
                </div>
                <div class="empty" v-if="courseList.length==0&&finished">暂无数据哦~</div>
            </div>
            <div class="page-box">
                <Page
                    :pageSize="pageSize"
                    :currentPage.sync="currentPage"
                    :totals="totals">
                </Page>
            </div> 
        </div>      
    </div>
</template>
<script lang="ts">
import {Component,Vue,Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import { NuxtContext } from 'nuxt'
import BreadCrumb from '~/components/breadcrumb.vue'
import Page from '~/components/Page.vue'
import CourseItem from '~/components/courseItem.vue'
import server from '~/api/index'
@Component({
    components:{Page,CourseItem,BreadCrumb},
    computed:{
       ...mapState(['switchEdition','userData'])
    },
    async asyncData({app,query,store}:NuxtContext):Promise<any>{
        console.log('进来了')
       let {id,sortType,pageNo,pageSize,freeType} = query;
       let queryData = {
            params:{
               sortType:sortType,
               pageNo:pageNo,
               pageSize:pageSize,
               freeType:freeType
            }
       }
       let res = await app.$axios.$get(`${server.getCourseListByClassify}/${id}`,queryData)
       if(res.status==200){
            return {
               sortType:sortType,
               pageSize:Number(pageSize),
               currentPage:Number(pageNo),
               freeType:freeType,
               totals:res.content.total,
               courseList:res.content.list,
               classifyId:id
            }
       }
    }
})
export default class CourseList extends Vue{
    currentPage = 1
    sortType = 1
    freeType = 2
    classifyId = 0
    pageSize = 12
    breadCrumb = [{name:'首页',link:''},{name:'课程',link:''},{name:'全部',link:''}]
    classifyList = []
    freeTypeArr = [{label:'全部',value:'2',active:true},{label:'免费',value:'1',active:false},{label:'收费',value:'0',active:false},]
    courseList = []
    editionType = 3
    noReplace = false
    finished = false
   @Watch('currentPage')
   onCurrentPagechanged(val,oldval){
       if(val>0){
            if(this.noReplace){
                this.noReplace = false;
            }else{
                let {id,sortType,freeType,pageSize} = this.$route.query;
                this.$router.replace(`/course/courseList?id=${id}&sortType=${sortType}&pageNo=${val}&pageSize=${pageSize}&freeType=${freeType}`)
            }
       }
   }
   @Watch('$route')
   onRouteChanged(val,oldval){
       let {id,pageNo,sortType,freeType,pageSize} = val.query;
       if(id){
           if(id==0){
                this.classifyList = [
                   {classifyId:0,id:0,classifyName:'全部',active:true}
                ]
                this.currentPage = Number(pageNo);
                this.sortType = sortType;
                this.freeType = freeType;
                this.classifyId = id;
                this.pageSize = Number(pageSize);
                if(freeType){
                        this.freeTypeArr.forEach(item=>item.active = false)
                        let obj = this.freeTypeArr.find(item=>item.value==freeType)
                        obj.active = true;
                    }
                this.getCourseListByClassify();
           }else{
               this.getClassifyListByParentId()
                this.currentPage = Number(pageNo);
                this.sortType = sortType;
                this.freeType = freeType;
                this.classifyId = id;
                this.pageSize = Number(pageSize);
                if(freeType){
                    this.freeTypeArr.forEach(item=>item.active = false)
                    let obj = this.freeTypeArr.find(item=>item.value==freeType)
                    obj.active = true;
                }
                this.getCourseListByClassify();
           }
       }
    }
    head(){
        return {
            title:'课程 | 学国学网',
        }
    }
   mounted(){
       console.log('mounted')
       let {id,pageNo,sortType,freeType,pageSize} = this.$route.query;
       if(id){
            if(id==0){
               this.classifyList = [
                   {classifyId:0,classifyName:'全部',active:true}
               ]
           }else{
               this.getClassifyListByParentId()
           }
       }
       if(sortType){
           this.sortType = sortType
       }
       if(freeType){
           this.freeTypeArr.forEach(item=>item.active = false)
            let obj = this.freeTypeArr.find(item=>item.value==freeType)
            obj.active = true;
       }
       this.currentPage = Number(pageNo);
                this.sortType = sortType;
                this.freeType = freeType;
                this.classifyId = id;
                this.pageSize = Number(pageSize);
                this.getCourseListByClassify();
   }
   /**
    * 获取课程一级分类列表
    */
   async getclassifyList(){
       let loadingInstance = this.$loading.service({
           target:document.getElementsByClassName('page-top')[0],
       });
       this.editionType = this.switchEdition?3:4;
       let query = {
           params:{
               editionType:this.editionType
           }
       }
       let res = await this.$axios.$get(this.$server.getclassifyList,query);
       loadingInstance.close()
       if(res.status==200){
           let classifyList = res.content;
           if(this.$route.query&&this.$route.query.id){
               let {id} = this.$route.query;
               let temp = classifyList.find(item=>item.classifyId==id)
               if(temp){
                   classifyList.forEach(item=>{
                        item.active = item.classifyId == id ? true : false;
                    })
                    let obj = classifyList.find(item=>item.active==true)
                    let last = classifyList[classifyList.length-1].classifyId;
                    this.breadCrumb = [
                        {name:'首页',link:'/home'},
                        {name:'课程',link:`/course/courseList?id=0&sortType=1&pageNo=1&pageSize=12&freeType=2`},
                        {name:'全部',link:''}
                    ]
                    this.breadCrumb[2].name = obj.classifyName
               }else{
                   this.$router.replace('/course/courseList?id=0')
               }
           }
           this.classifyList = classifyList;
       }
   }
   /**
    * 根据一级分类获取二级分类
    */
    async getClassifyListByParentId(){
        const {id} = this.$route.query
        const query = {
            params:{
                parentId:id
            }
        }
        const res = await this.$axios.get(this.$server.getClassifyListByParentId,query)
        if(res.data.status==200){
            if(res.data.content.length>0){
                this.classifyList = res.data.content.map(item=>{
                    return {classifyId:item.id,classifyName:item.name,active:false}
                })
                this.classifyList.unshift({classifyId:id,classifyName:'全部',active:false})
            }else{
                this.classifyList = [
                    {classifyId:0,classifyName:'全部',active:false}
                ]
            }
        }
    }
   async getCourseListByClassify(){
       this.finished = false;
       let loadingInstance = this.$loading.service({
           target:document.getElementsByClassName('page-body')[0],
       });
       let query = {
           params:{
               sortType:this.sortType,
               pageNo:this.currentPage,
               pageSize:this.pageSize,
               freeType:this.freeType
           }
       }
       let res = await this.$axios.$get(`${this.$server.getCourseListByClassify}/${this.classifyId}`,query)
       loadingInstance.close()
       if(res.status==200){
           this.totals = res.content.total
           this.courseList = res.content.list
           this.finished = true;
       }
   }
   /**
    * 选择分类
    */
   chooseClassify(obj){
       if(obj.classifyId==0){
        //    this.breadCrumb[2].name = obj.classifyName;
            this.$router.replace(`/course/courseList?id=${obj.classifyId}&sortType=1&pageNo=1&pageSize=12&freeType=2`)
       }else{
           this.currentPage = 1
           this.noReplace = true;
           this.classifyId = obj.classifyId
           this.classifyList.forEach(item=>item.active = false)
           obj.active = true;
           this.getCourseListByClassify()
       }
   }
   /**
    * 选择类型
    */
   chooseType(obj){
       this.freeTypeArr.forEach(item=>item.active = false)
       obj.active = true;
       this.freeType = Number(obj.value)
       let {id,pageNo,sortType,freeType,pageSize} = this.$route.query;
       this.$router.replace(`/course/courseList?id=${id}&sortType=${sortType}&pageNo=1&pageSize=12&freeType=${obj.value}`)
   }
   /**
    * 选择排序类型
    */
   chooseSortType(index){
       this.sortType = index;
       let {id,pageNo,sortType,freeType,pageSize} = this.$route.query;
       this.$router.replace(`/course/courseList?id=${id}&sortType=${index}&pageNo=1&pageSize=12&freeType=${freeType}`)
   }
}
</script>
<style lang="scss" scoped>
    .course-list-page{
        background: #F3F5F7;
        padding-top:30px;
        .page-top{
            box-shadow:0px 2px 10px 0px rgba(230,230,230,1);
            background: #fff;
            .content{
                width: 1200px;
                margin:0 auto;
                color:#07111A;
                font-size: 18px;
                .breadcrumb{
                    padding: 24px 0;
                    border-bottom:1px solid #EDF1F2;
                    margin-bottom:30px;
                }
                .classification,.free-type{
                    .label-box{
                        font-weight: bold;
                        float: left;
                        text-align: justify;
                        text-align-last: justify;
                        font-size: 18px;
                        line-height: 30px;
                    }
                    .colon{
                        float: left;
                        padding-right: 10px;
                        line-height: 30px;
                    }
                    .value-box{
                        float: left;
                        width: calc(100% - 100px);
                    }
                    .item{
                        float: left;
                        margin:0 10px 20px 0;
                        cursor: pointer;
                        padding: 1px 10px;
                        border-radius: 20px;
                        font-size:16px;
                        line-height: 28px;
                        &:hover{
                            opacity: 0.7;
                        }
                        &.active{
                            background: #CC0033;
                            color:#fff;
                            transition: all 0.3s;
                            &:hover{
                                opacity: 1;
                            }
                        }
                    }
                }
                .classification.no-data{
                    margin-bottom:30px;
                }
                .free-type.no-data{
                    padding-bottom:30px;
                }
            }
        }
        .page-body{
            min-height: 400px;
            .condition{
                height: 60px;
                font-size: 0;
                margin:0 auto;
                width: 1200px;
                border-bottom:1px solid #dfdfdf;
                p{
                    display: inline-block;
                    height: 30px;
                    line-height: 30px;
                    margin:25px 20px 25px 0;
                    font-size: 15px;
                    color:#000;
                    padding: 0 10px;
                    border-radius: 20px;
                    cursor: pointer;
                    &.active{
                        background:#9099A1;
                        color:#fff;
                        transition: all 0.3s;
                    }
                }
            }
            .course-list{
                width: 1220px;
                 margin:0 auto;
                .course-item-box{
                    width:305px;
                    float: left;
                    padding:10px;
                    cursor: default;
                }
                .empty{
                    padding:50px 0 0 0;
                    text-align: center;
                    color:#999;
                }
            }
            .page-box{
                width: 1200px;
                position: relative;
                margin:0 auto;
                padding: 50px 0;
                text-align: center;
            }
        }
    }
</style>

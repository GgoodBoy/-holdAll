<template>
    <div class="courseBox">
        <Header :name="'分类'"/>            
        <div class="courseAllBox" :style="{height:height}">
            <div class="classNameBox">
                <div v-for="(item,i) in firstClassifyList" :key="i" :class="item.active?'active':''" @click="chooseFirst(item)">{{item.name}}</div>
            </div>           
            <div class="lableContentBox">
                <div class="labelList" ref="box1" v-show="secondClassifyList.length>0">
                    <div v-for="(item,i) in secondClassifyList" :key="i" :class="item.active?'active':''" @click="chooseSecond(item)">{{item.name}}</div>
                </div> 
                <div class="sort-box" ref="box2">
                    <div class="item" :class="{'active':item.active,'sort1':item.isSort=='1','sort2':item.isSort=='2'}" v-for="(item,index) in sort" :key="index" @click="sortEvent(item)">
                        <p>{{item.name}}</p>
                        <div class="icon" v-if="item.isSort">
                            <span class="high"></span>
                            <span class="low"></span>
                        </div>
                    </div>
                </div>              
                <van-list
                    class="informList"
                    ref="box3"
                    :style="{height:boxHeight}"
                    v-model="loading"
                    :finished="finished"
                    @load="getCourseList">                 
                        <div class="contentListNo" v-if="list.length==0">
                            <img v-show="finished" :src="emptylimit"/>
                            <p v-show="finished">暂时没有课程哦~</p>
                        </div>                        
                        <div class="contentListCss" v-for="(item,i) in list" :key="i" @click="goCourse(item)" v-else>
                            <div class="imgbox" v-lazy:background-image="someImgIcom">
                                <img :src="item.teacherAvatar"/>
                                <div>
                                    <img :src="item.courseType==1?looks:hears"/>
                                </div>                                 
                            </div>
                            <div class="textCss">
                                <p class="p_1">{{item.title}}</p>
                                <p class="p_2">{{item.intro}}</p>                                
                                <p class="p_3">{{(item.lectureTeacherList&&item.lectureTeacherList.length>0)?item.lectureTeacherList[0].name:''}}</p>
                                <p class="p_4" v-if="item.isVip==1"><span>VIP</span></p>
                                <p class="p_4" v-else>{{item.planPeriodNum}}讲/<span v-if="item.isVip==1">VIP</span><span v-else>{{item.isFree==0?item.sellingPrice+'币':'免费'}}</span></p>
                            </div>                          
                        </div>
                </van-list>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import someImgIcom from '@/assets/image/icon-someImg.png'
import emptylimit from './img/empty_limit.png' 
import looks from './img/looks.png'
import hears from './img/hears.png'
import Header from "@/components/Header.vue";
export default {
    props:[],
    data(){
        return { 
            height:'auto',
            boxHeight:'auto',
            someImgIcom:someImgIcom,
            courseType:1,
            targetId:-1,
            firstClassifyList:[],
            secondClassifyList:[],
            finished: false,
            loading:false,            
            pageNo:1,
            pageSize:10,   
            list:[],     
            looks:looks,
            hears:hears,
            emptylimit:emptylimit,
            emptylimitstate:false,
            sort:[
                {name:'综合',active:true,sortType:1},
                {name:'按热度',active:false,isSort:'0',sortType:2},
                {name:'按时间',active:false,isSort:'0',sortType:3},
            ]            
        }
    },
    computed:{
        ...mapState(['isVip','hasOpenApp']),
    },  
    watch:{
        hasOpenApp(cur,old){
            if(!cur){
                this.height = `calc(${document.documentElement.clientHeight}px - 1rem)`
            }
        },
        targetId(cur,old){
            if(cur<0) return;
            this.pageNo = 1;
            this.list = [ ];
            this.finished = false;
            
            let temp = this.$refs.box1.clientHeight+this.$refs.box2.clientHeight+Number(window.getComputedStyle(this.$refs.box2, null).marginTop.split('px')[0])*2
            this.boxHeight = `calc(100% - ${temp}px)`
            this.$refs.box3.scrollTop = 0;
            this.getCourseList();
        }
    },  
    components:{
        Header
    },
    created(){
        this.height = this.hasOpenApp?`calc(${document.documentElement.clientHeight}px - 1.98rem)`:`calc(100vh - 1rem)`;
        if(this.$route.query&&this.$route.query.type){
            let type = this.$route.query.type;
            this.getAllClassify(type)
        }
    },
    mounted() {
       
    },     
    methods:{
        /**
         * 获取所有分类，包含一级和二级
         */
        getAllClassify(type){
            let query = {
                type
            }
            this.$http.post(this.$server.getAllClassify,query).then(res=>{
                if(res.data.status==200){
                    this.firstClassifyList = res.data.content;
                    this.firstClassifyList.unshift({
                        name:'全部',
                        id:0,
                        childrenVos:[],
                        active:true
                    })
                    this.secondClassifyList = [];
                    this.targetId = 0;
                }
            })
        },
        /**
         * 选择一级分类
         */
        chooseFirst(obj){
            if(obj.active) return;
            this.targetId = obj.id;
            this.secondClassifyList = obj.childrenVos||[]
            this.firstClassifyList.forEach(item=>item.active=false);
            this.secondClassifyList.forEach(item=>item.active=false);
            obj.active = true;
            this.sort = [
                {name:'综合',active:true,sortType:1},
                {name:'按热度',active:false,isSort:'0',sortType:2},
                {name:'按时间',active:false,isSort:'0',sortType:3},
            ]    
        },
        /**
         * 选择二级分类
         */
        chooseSecond(obj){
            if(obj.active) return;
            this.targetId = obj.id;
            this.secondClassifyList.forEach(item=>item.active=false);
            // this.firstClassifyList.forEach(item=>item.active=false);
            obj.active = true;
            this.sort = [
                {name:'综合',active:true,sortType:1},
                {name:'按热度',active:false,isSort:'0',sortType:2},
                {name:'按时间',active:false,isSort:'0',sortType:3},
            ]  
        },
        /**
         * 课程跳转
         */
        goCourse(data){
            this.$router.push(`/course/${data.id}`);
        },
        /**
         * 获取分类ID获取课程列表
         */
        getCourseList(){
            if(this.targetId<0) return;
            this.loading = true;
            let obj = this.sort.find(item=>item.active==true)
            let query = {
                targetId:this.targetId,
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                mtype:this.$route.query.type,
                sortType:obj.sortType
            }
            if(obj.isSort){
                query.updown = obj.isSort
            }
            this.$http.post(this.$server.getListByNavigation2,query).then(res=>{
                if(res.data.status==200){
                    this.list = [...this.list,...res.data.content.list];
                    this.pageNo++;
                    this.loading = false;
                    this.finished = res.data.content.isLastPage;
                }
            })
        },
        /**
         * 排序
         */
        sortEvent(obj){
            if(obj.active){
                if(obj.isSort=='1'){
                    obj.isSort = '2'
                }
                else if(obj.isSort=='2'){
                    obj.isSort = '1'
                }
            }
            else{
                this.sort.forEach(item=>{
                    if(item.isSort){
                        item.isSort = '0'
                    }
                    item.active = false
                })
                if(obj.isSort){
                    obj.isSort = '1';
                }
                obj.active = true;
            }
            let temp = this.targetId;
            this.targetId = -1;
            this.$nextTick(()=>{
                this.targetId = temp;
            })           
        }
    }
};
</script>
<style lang="scss" scoped>
.courseBox{
    overflow: hidden;
    .courseAllBox{
        padding: 0 0.3rem;
        position: relative;
        &::before{
            content:'';
            width: 100%;
            height: 1px;
            background: #f2f2f2;
            position: absolute;
            top:0;
            left: 0;
        }
        .classNameBox{
            position: absolute;
            padding: 0.32rem 0 0 0.3rem;
            left: 0;
            bottom: 0;
            top: 0;
            width: 1.8rem;
            overflow-y: auto;
            background: #f2f2f2;
            -webkit-overflow-scrolling: touch; 
            div{
                margin-bottom: 0.6rem;
                font-size: 0.3rem;
                color: #666;
                font-weight: 500;
            }
            .active{
                color: #C30D23;
                font-weight: 700;
            }            
        }
        .lableContentBox{
            position: absolute;
            right: 0.3rem;
            bottom: 0;
            top: 0;    
            width: 5.1rem;    
            .labelList{
                width: 100%;
                overflow: auto;
                padding-bottom: 0.2rem;
                border-bottom:1px solid #f2f2f2;
                .active{
                    color: #C30D23;
                    font-weight: 700;
                }
                div{
                    float: left;
                    margin: 0.1rem 0.1rem 0 0.1rem;
                    font-size: 0.28rem;
                    color:#666666;
                }
            }
            .sort-box{
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin:0.2rem 0;
                .item{
                    width: 1.5rem;
                    padding: 0.1rem 0;
                    position: relative;
                    border-radius: 0.4rem;         
                    display: flex;
                    align-items: center;
                    justify-content:center;
                    &.active{
                        background: #f2f2f2;
                    }
                    &.sort1{
                        .high{
                            position: absolute;
                            margin:auto!important;
                            bottom:0.04rem;
                            top:0;
                            left: 0;
                            right: 0;
                            border-color: transparent transparent #888!important;
                        }
                        .low{
                            display: none;
                        }
                    }
                    &.sort2{
                        .low{
                            position: absolute;
                            margin:auto!important;
                            top:0.1rem;
                            left: 0;
                            bottom:0;
                            right: 0;
                            border-color: #888 transparent transparent!important;
                        }
                        .high{
                            display: none;
                        }
                    }
                    p{
                        font-size: 0.28rem;
                    }
                    .icon{
                        margin-left: 0.04rem;
                        height: 0.4rem;
                        position: relative;
                        span{
                            display: block;
                            height: 0.2rem;
                        }
                        .high{
                            width: 0;
                            height: 0;
                            border: 0.06rem solid;
                            border-color: transparent transparent #ddd;
                            margin:0.06rem 0;
                        }
                        .low{
                            width: 0;
                            height: 0;
                            border: 0.06rem solid;
                            border-color: #ddd transparent transparent;
                        }
                    }
                }
            }
            .informList{
                overflow-y:auto;
                -webkit-overflow-scrolling: touch; 
                padding-bottom: 0.4rem;
                .contentListNo{
                    margin: 0.5rem 0;
                    width: 100%;
                    img{
                        width: 100%;
                    }
                    p{
                        text-align: center;
                        font-size: 0.24rem;
                        color: #999;
                    }
                }
                .contentListCss{
                    display: -webkit-inline-box;
                    padding: 0.4rem 0;
                    border-bottom: 1px solid #f2f2f2;
                    .imgbox{
                        width: 1.6rem;
                        height: 1.9rem;
                        background-position: center;
                        background-size: cover;  
                        overflow: hidden;
                        position: relative;                        
                        >img{
                            width: 100%;
                            transform: scale(1.4);
                            position: absolute;
                            top: 7px;
                            left: 0px;                            
                        }
                        div{
                            position: absolute;
                            width: 0.52rem;
                            height: 0.3rem;
                            right: 0.1rem;
                            bottom: 0.1rem;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        } 
                    }
                    .textCss{
                        margin-left: 0.4rem;
                        overflow-y: auto;
                        width: 3rem;
                        p{
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;                            
                        }
                        .p_1{
                            font-size: 0.3rem;
                            margin-bottom: 0.1rem;
                            font-weight: 700;
                            color: #333;
                        }
                        .p_2{
                            font-size: 0.26rem;
                            margin-bottom: 0.1rem;
                            color: #666;
                        }
                        .p_3{
                            font-size: 0.22rem;
                            margin-bottom: 0.24rem;
                            color: #999;
                        }
                        .p_4{
                            font-size: 0.24rem;
                            color: #666666;
                            span{
                                font-size: 0.26rem;
                                color:#C30D23;
                                font-weight: 700;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

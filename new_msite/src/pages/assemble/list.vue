<template>
    <div class="assemble-list-wrap">
        <Header :name="'拼团列表'"></Header>
        <div class="list">
            <van-list
                v-model="loading"
                :finished="finished"
                @load="getAssembleCourseList"
            >
                <div class="assemble-item clearfix" v-for="(item,index) in list" :key="index" @click="goCourse(item)">
                    <div class="assemble-item-left">
                        <img :src="item.courseSurfacePlot"/>
                        <img class="icon" :src="item.courseType==1?looks:hears"/>
                    </div>
                    <div class="assemble-item-right">
                        <p class="course-name" >{{item.courseTitle}}</p>
                        <p class="assemble-price">拼团价：{{item.assemblePrice.toFixed(2)}}币</p>
                        <p class="original-price">原价：{{item.coursePrice.toFixed(2)}}币</p>
                        <p class="assemble-num">已拼：{{item.assembleSuccessNum}}</p>
                        <div class="assemble-btns">
                            <!-- <button class="join-btn" @click="joinAssemble(item,$event)">参团</button> -->
                            <!-- <button class="open-btn" @click="openAssemble(item,$event)">开团</button> -->
                            <button class="join-btn" @click="joinAssemble(item,$event)">拼团</button>
                        </div>
                    </div>
                </div>
                <div class="no-data" v-show="list.length==0&&finished">
                    <p>当前没有已开始的拼团哟</p>
                </div>
            </van-list>
        </div>
    </div>
</template>
<script>
import looks from '@/assets/image/looks.png'
import hears from '@/assets/image/hears.png'
import Header from '@/components/Header.vue'
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            looks:looks,
            hears:hears, 
            list:[],
            loading:false,
            finished:false,
            adult:{
                loading:false,
                finished:false,
                list:[],
                currentPage:1,
                pageSize:10,
            },
            child:{
                loading:false,
                finished:false,
                list:[],
                currentPage:1,
                pageSize:10,
            },
        }
    },
    components:{Header},
    computed:{
        ...mapState(['hasOpenApp']),
    },   
    created(){
        
    },
    methods:{
        getAssembleCourseList(){
            this.getAdultList()
        },
        getAdultList(){
            if(this.adult.finished){
                this.getChildList()
                return;
            }
            let query = {
                currentPage:this.adult.currentPage,
                pageSize:this.adult.pageSize,
                type:1
            }
            this.$http.post(this.$server.getAssembleCourseListNew,query).then(res=>{
                if(res.data.status==200){
                    this.adult.list = [...this.adult.list,...res.data.content.list];
                    this.list = this.adult.list
                    this.adult.currentPage++;
                    this.loading = this.adult.loading = false;
                    this.finished = this.adult.finished = res.data.content.isLastPage ?  true : false;
                    if(res.data.content.isLastPage){
                        this.getChildList()
                    }
                }
            })
        },
        getChildList(){
            let query = {
                currentPage:this.child.currentPage,
                pageSize:this.child.pageSize,
                type:2
            }
            console.log(query)
            this.$http.post(this.$server.getAssembleCourseListNew,query).then(res=>{
                if(res.data.status==200){
                    this.child.list = [...this.child.list,...res.data.content.list];
                    this.list = [...this.adult.list,...this.child.list]
                    this.child.currentPage++;
                    this.child.loading = false;
                    this.loading = this.child.loading&&this.adult.loading
                    this.child.finished = res.data.content.isLastPage ?  true : false;
                    this.finished = this.child.finished&&this.adult.finished
                }
            })
        },
        /**
         * 去开团
         */
        openAssemble(obj,e){
            e.stopPropagation();
            if(obj.id){
                this.$router.push(`/assemble/openAssemble/${obj.id}`)
            }
        },
        /**
         * 拼团
         */
        joinAssemble(obj,e){
            e.stopPropagation();
            if(obj.id){
                this.$router.push(`/assemble/joinAssemble/${obj.id}`)
            }
        },
        goCourse(obj){
           this.$router.push(`/course/${obj.courseId}`)
        }
    } 
}
</script>
<style lang="scss" scoped>
    .assemble-list-wrap{
        padding-bottom:1rem;
        .no-data{
            text-align: center;
            padding: 0.5rem 0;
            color:#CACACA;
        }
        .assemble-item{
            padding: 0.2rem;
            .assemble-item-left{
                float: left;
                width: 2.63rem;
                height: 1.6rem;
                position: relative;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 3px;
                }
                .icon{
                    position: absolute;
                    left: 0.1rem;
                    bottom:0.1rem;
                    width: 0.52rem;
                    height: 0.3rem;
                }
            }
            .assemble-item-right{
                float: left;
                width: calc(100% - 2.63rem);
                height: 1.6rem;
                padding-left: 0.2rem;
                position: relative;
                .course-name{
                    color:#1A1A1A;
                    font-size: 0.28rem;
                    line-height: 0.44rem;
                    font-weight: bold;
                }
                .assemble-price{
                    color:#C30725;
                    font-size: 0.26rem;
                }
                .original-price{
                    color:#9A9A9A;
                    font-size: 0.24rem;
                    margin-bottom:0.08rem;
                    text-decoration:line-through;
                }
                .assemble-num,.assemble-time{
                    color:#9A9A9A;
                    font-size: 0.24rem;
                }
                .assemble-btns{
                    font-size: 0;
                    position: absolute;
                    bottom:0;
                    // right: 0.1rem;
                    right: 0;
                    button{
                        display: inline-block;
                        width: 1rem;
                        height: 0.48rem;
                        line-height: 0.48rem;
                        text-align: center;
                        font-size: 0.28rem;
                        color:#fff;
                        border:none;
                        outline: none;
                        border-radius: 20px;
                        &.join-btn{
                            background: #FCBA3F;
                            box-shadow:1px 2px 9px 0px rgba(224,142,32,0.46);
                            // margin-right: 0.3rem;
                        }
                        &.open-btn{
                            background: #C52D3B;
                            box-shadow:1px 2px 9px 0px rgba(197,45,59,0.46);
                        }
                    }
                }
            }
        }
    }
</style>

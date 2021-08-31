<template>
    <div class="my-assemble-wrap">
        <Header :name="'我的拼团'"/>
        <div class="list">
            <van-list
                v-model="loading"
                :finished="finished"
                @load="getUserAssembleRecordList"
            >
                <div class="item clearfix" v-for="(item,index) in list" :key="index">
                    <AssembleItem :item="item"></AssembleItem>
                </div>
                <div class="no-data" v-show="list.length==0&&finished">
                    <p>暂无数据~</p>
                </div>
            </van-list>    
        </div>
    </div>    
</template>
<script>
import {mapState,mapActions} from 'vuex'
import AssembleItem from './assembleItem.vue'
import Header from '@/components/Header.vue'
export default {
    data(){
        return{
            loading:false,
            finished:false,
            currentPage:1,
            pageSize:10,
            list:[]
        }
    },
    components:{AssembleItem,Header},
    created(){

    },
    mounted(){

    },
    computed:{
        ...mapState(['hasOpenApp']),
    },
    methods:{
        onClickLeft(){
            this.$router.go(-1)
        },
        getUserAssembleRecordList(){
            let query = {
                currentPage:this.currentPage,
                pageSize:this.pageSize,
            }
            this.$http.post(this.$server.getUserAssembleRecordList,query).then(res=>{
                if(res.data.status==200){
                    this.list = [...this.list,...res.data.content.list];
                    this.currentPage++;
                    this.loading = false;
                    this.finished = res.data.content.isLastPage ?  true : false;
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .my-assemble-wrap{
        .no-data{
            text-align: center;
            padding: 0.5rem 0;
            color:#CACACA;
        }
        .list{
            // .item{
            //     padding: 0.2rem;
            // }
        }
    }
</style>

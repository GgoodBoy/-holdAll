<template>
    <div class="record-page">
        <div class="fubao_header">
            <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/returnIcon.jpg' @click="goTo" />
            <div>记录</div>
            <div></div>
        </div>      
        <div class="record_box">
            <div class="tabsLi">
                <img :src="tagState?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_prize_b.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_prize_w.png'" @click="tagChane(true)"/>
                <img :src="tagState?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_gold_w.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_gold_b.png'" @click="tagChane(false)"/>
            </div>
            <div class="record_li1" v-if="tagState">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onFubaoLoad"
                >
                    <div class="lis" v-for="(item,index) in tableData" :key='index'>
                        <img :src="item.type==1?'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_userIcon.png':'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_courseIcon.png'"/>
                        <div class="infos">
                            <div v-if="item.type==1">{{item.content+'礼金'}}</div>
                            <div v-else class="infos_div">
                                <div>{{item.courseName}}</div>
                                <div>{{'免费观看权'+item.content+'天'}}</div>
                            </div>
                            <div>{{item.createdAt}}</div>
                        </div>
                    </div>
                </van-list>
            </div>
            <div class="record_li2" v-else>
                <van-list
                    :finished="finished"
                    v-model="loading"
                    finished-text="没有更多了"
                    @load="onFubaoLoad"
                >                
                    <div class="lis" v-for="(item,index) in tableData" :key='index'>
                        <div class="lefts">
                            <div v-if="item.type==1">每日收获礼金</div>
                            <div v-else-if="item.type==2">获得签到任务礼金</div>
                            <div v-else-if="item.type==3">获得购买任务礼金</div>
                            <div v-else-if="item.type==4">获得分享任务礼金</div>
                            <div v-else-if="item.type==5">中奖礼金</div>
                            <div v-else-if="item.type==6">兑换平安符</div>
                            <div v-else-if="item.type==7">兑换吉祥符</div>
                            <div v-else>兑换好运符</div>
                            <div>{{item.createdAt}}</div>
                        </div>
                        <div class="rights">
                            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_goldIcon.png"/>
                            <div>{{item.num>0?'+'+item.num:(item.num||0)}}礼金</div>
                        </div>
                    </div>
                </van-list>
            </div>            
        </div>
    </div>
</template>
<script>
import {store,mutations} from '../store'
export default {
    data(){
        return {
            userInfo:{},
            tagState:true,
            tableData:[],
            pageSize:10,
            pageNo:1,
            selectState:true,
            loading:false,
            finished:false,
            tableIsKong:false
        }
    },
    beforeRouteLeave(to, from, next){
        next()
    },
    created(){
        this.onFubaoLoad();
    },
    computed:{
        userInfoisApp(){
            return store.userInfo;
        }        
    },  
    methods:{
        async onFubaoLoad(){
                let uInfo = this.$getCookie('uInfo');
                if(uInfo){
                    this.userInfo = {
                        userId:JSON.parse(uInfo).userid,
                        token:JSON.parse(uInfo).accessToken,
                        cellphone:JSON.parse(uInfo).cellphone
                    }
                } 
                if(!this.userInfo.userId){
                    this.userInfo = {
                        userId:this.userInfoisApp.userid,
                        token:this.userInfoisApp.accessToken
                    }                     
                }
                let query = {
                    userId:this.userInfo.userId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                };  
                // this.$toast('用户id22'+this.userInfoisApp.userid+'用户token22:'+this.userInfoisApp.accessToken); 
                if(this.userInfo.userId){
                    let url = '';
                    this.loading = true;
                    if(this.tagState){
                        url = this.$server.getFuBaoAwardWinningRecordList;
                    }else{
                        url = this.$server.getFuBaoOurGoldListList;
                    }
                    const res = await this.$http.post(url,query,{userId:this.userInfo.userId,token:this.userInfo.token});
                    if(res.data.status==200){
                            this.tableData = [...this.tableData,...res.data.content.list];
                            this.pageNo++;
                            this.loading = false;
                            this.finished = res.data.content.isLastPage;
                    }
                }
        },     
        goTo(){
            // this.$router.go(-1);
            this.$router.push({path:'/index'});
        },   
        tagChane(bool){
            if(bool){
                this.tagState = bool;
                if(this.selectState!= bool){
                    this.tableData =[];
                    this.pageNo=1;
                    this.selectState = bool;
                    this.finished=false;
                    this.loading=true;
                    this.onFubaoLoad();
                }
            }else{
                this.tagState = bool;
                if(this.selectState!= bool){
                    this.tableData =[];
                    this.pageNo=1;
                    this.selectState = bool;
                    this.finished=false;
                    this.loading=true;
                    this.onFubaoLoad();
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .record-page{
        width: 100%;
        position: relative;
        height: 100%;
        .fubao_header{
            height: 1rem;
            display: flex;
            flex-direction: row;
            justify-content:space-between;
            align-items: flex-end;
            padding:0 0.32rem 0.2rem;    
            div{
                font-family: 'PingFangSC-Medium';
                font-size: 0.36rem;
                font-weight: 700;  
            }   
            img{
                display: block;
                width: 0.18rem;
                height: 0.32rem;
            }          
        }
        .record_box{
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieBgd.png')no-repeat 50% 50% / cover;
            height: calc(100% - 1rem);
            .tabsLi{
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                // padding: 0.6rem 0 0.45rem;
                height: 1.89rem;
                img{
                    display: block;
                    width: 2.55rem;
                    height: 0.84rem;
                }
            }
            .record_li1{
                // padding-top: 0.29rem;   
                height:calc(100% - 1.89rem);
                overflow: auto;
                zoom: 1; 
                .noTableData{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #fff;         
                    font-family: 'PingFangSC-Medium';           
                }                
                .lis{
                    width: 6.89rem;
                    height: 1.46rem;
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_record_li.png')no-repeat 50% 50% / cover; 
                    padding: 0.3rem 0.32rem;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    margin: 0 auto;
                    margin-bottom: 0.29rem;
                    img{
                        display: block;
                        height: 0.84rem;
                        width: 0.84rem;
                        margin-right: 0.22rem;
                    }
                    .infos{
                        >div:nth-child(1){
                            font-size: 0.26rem;
                            height: 0.25rem;
                            font-weight: 700;
                            color: #333;
                            font-family: 'PingFangSC-Medium';
                        }
                        >div:nth-child(1){
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 0.26rem;
                            height: 0.25rem;
                            font-weight: 700;
                            color: #333;
                            font-family: 'PingFangSC-Medium';
                            >div:nth-child(1){
                                max-width:3rem;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;  
                                font-family: 'PingFangSC-Medium';
                            }
                        }
                        >div:nth-child(2){
                            font-size: 0.22rem;
                            height: 0.25rem;
                            margin-top: 0.2rem;
                            color: #999999;
                            font-family: 'PingFangSC-Medium';
                        }
                    }
                }
            }
            .record_li2{
                // padding-top: 0.29rem;
                height: 10.2rem; 
                overflow: auto;
                height:calc(100% - 1.89rem);
                zoom: 1;
                .noTableData{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #fff;                    
                }
                .lis{
                    width: 6.89rem;
                    height: 1.46rem;
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_record_li.png')no-repeat 50% 50% / cover; 
                    padding: 0.3rem 0.32rem;
                    display: flex;
                    flex-direction: row;
                    justify-content:space-between;
                    align-items: center;
                    margin: 0 auto;
                    margin-bottom: 0.29rem;
                    .lefts{
                        font-family: 'PingFangSC-Medium';
                        div:nth-child(1){
                            font-size: 0.26rem;
                            height: 0.25rem;
                            font-weight: 700;
                            color: #333;
                        }
                        div:nth-child(2){
                            font-size: 0.22rem;
                            height: 0.25rem;
                            margin-top: 0.2rem;
                            color: #999999;
                        }
                    }
                    .rights{
                        display: flex;
                        flex-direction: row;
                        justify-content:flex-end;
                        align-items: center;                        
                        img{
                            display: block;
                            height: 0.62rem;
                            width: 0.62rem;
                        }
                        div{
                            font-size: 0.24rem;
                            font-weight: 700;
                            color: #333;
                            font-family: 'PingFangSC-Medium';
                        }
                    }
                }
            }            
        }
    }
</style>
<style>
.record_box .record_li1 .van-list .van-list__finished-text,.record_box .record_li2 .van-list .van-list__finished-text{
    font-size: 0.24rem;
    text-align: center;
    padding: 0 0 0.2rem 0;
    color: #fff;
}

.record_box .record_li1 .van-list .van-list__loading .van-loading,.record_box .record_li2 .van-list .van-list__loading .van-loading{
    text-align: center;
}
.record_box .record_li1 .van-list .van-list__loading .van-loading .van-loading__text,.record_box .record_li2 .van-list .van-list__loading .van-loading .van-loading__text{
    color: #fff !important;
    font-size: 0.3rem !important;
}
</style>
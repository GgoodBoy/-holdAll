<template>
    <div class="fubao-page">
        <div class="fubao_header">
            <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/returnIcon.jpg' @click="goTo" />
            <div>我的福包</div>
            <div></div>
        </div>
        <div class="fubao_contents">
            <div class="fubaoTagBox" :class="{'waitStyle':!isOkFuBaoType,'isOkStyle':isOkFuBaoType}">
                <img class="img1" src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_isOpen.png' v-if="isOkFuBaoType"/>
                <img class="img3" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_time.png" />
                <img class="img2" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_lingjinag.gif" @click="isOkOpenFubao" v-if="!isOkFuBaoType"/>
            </div>    
            <div class="fubaoListBox" v-if="!isOkFuBaoType">
                <!-- v-model="loading" -->
                <van-list
                    :finished="finished"
                    v-model="loading"
                    finished-text="没有更多了"
                    @load="onFubaoLoad"
                >                
                    <div v-for="(item,index) in tableFubaoList" :key="index">
                        <div class="imgbox">
                            <img :src='item.surfacePlot'/>
                            <p>{{item.courseName}}</p>
                        </div>
                        <img class="img1" v-if="item.symbolType!=4" src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_add.png'/>
                        <div class="textImg">
                            <!-- openStatus 1未开，2开-->
                            <div class="allImgBox" @click="openFubaoEven(item,index)">
                                <img v-if="item.symbolType==1" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_pin.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <img v-else-if="item.symbolType==2" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_ji.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <img v-else-if="item.symbolType==3" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_hao.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <div v-else-if="item.symbolType==4"></div>
                                <img v-else src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png'/>
                            </div>
                            <p v-if="item.symbolType==1">提升中奖率至10%</p>
                            <p v-else-if="item.symbolType==2">提升中奖率至30%</p>
                            <p v-else-if="item.symbolType==3">提升中奖率至50%</p>
                            <p v-else-if="item.symbolType==4"></p>
                            <div class="imgBox" v-else>
                                <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_accelerate.png" @click="openFubaoEven(item,index)">
                            </div>
                            
                        </div>
                        <img class="img2" src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_wait.png' @click="receiveThePrize(item)"/>
                    </div>
                </van-list>
            </div>                
            <div class="fubaoListBox" v-else>
                <van-list
                    :finished="finished"
                    v-model="loading"
                    finished-text="没有更多了"
                    @load="onFubaoLoad"
                >                
                    <div v-for="(item,index) in tableFubaoList" :key="index">
                        <div class="imgbox">
                            <img :src='item.surfacePlot'/>
                            <p>{{item.courseName}}</p>
                        </div>
                        <img class="img1" v-if="item.symbolType!=4" src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_add.png'/>
                        <div class="textImg">
                            <!-- openStatus 1未开，2开-->
                            <div class="allImgBox" @click="openFubaoEven(item,index)">
                                <img v-if="item.symbolType==1" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_pin.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <img v-else-if="item.symbolType==2" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_ji.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <img v-else-if="item.symbolType==3" :src='item.setFubao?"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_hao.png":"https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png"'/>
                                <div v-else-if="item.symbolType==4"></div>
                                <img v-else src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_no.png'/>
                            </div>
                            <p v-if="item.symbolType==1">提升中奖率至10%</p>
                            <p v-else-if="item.symbolType==2">提升中奖率至30%</p>
                            <p v-else-if="item.symbolType==3">提升中奖率至50%</p>
                            <p v-else-if="item.symbolType==4"></p>
                            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_accelerate.png" v-else>
                        </div>
                        <img class="img2" src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_open.png' @click="receiveThePrize(item)"/>
                    </div>
                </van-list>
            </div>
            <div class="fubaoMaskBox" v-if="boxshowOne">
                <transition name="myFuBaoBox">
                    <div class="fubaoBox" v-show="boxshowTwo">
                        <div class="fubaoTitle">
                            <div></div>
                            <div>提升中奖率</div>
                            <img src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close_1.png" @click="selectFubao('')"/>
                        </div>
                        <div class="fubaoUlBox">
                            <div class="fubao_li">
                                <img class="imgOne" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_pin.png"/>
                                <div class="divText">
                                    <p>平安符</p>
                                    <p>提升中奖率至10%</p>
                                </div>
                                <div class="imgDiv">   
                                    <img class="imgTwo" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_exchange.png" @click="selectFubao(1)"/> 
                                    <p>100礼金</p>
                                </div>  
                            </div>
                            <div class="fubao_li">
                                <img class="imgOne" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_ji.png"/>
                                <div class="divText">
                                    <p>吉祥符</p>
                                    <p>提升中奖率至30%</p>
                                </div>
                                <div class="imgDiv">   
                                    <img class="imgTwo" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_exchange.png" @click="selectFubao(2)"/> 
                                    <p>200礼金</p>
                                </div>                        
                            </div> 
                            <div class="fubao_li">
                                <img class="imgOne" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_hao.png"/>
                                <div class="divText">
                                    <p>好运符</p>
                                    <p>提升中奖率至50%</p>
                                </div>
                                <div class="imgDiv">   
                                    <img class="imgTwo" src="https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_exchange.png" @click="selectFubao(3)"/> 
                                    <p>300礼金</p>
                                </div>                                 
                            </div>                                       
                        </div>
                    </div>
                </transition>                   
            </div>
        </div> 
        <div class="sunBoxBagLayer" v-if="fubaoResultBox">
            <div class="sunBoxBag" :class="{'sunBoxBagIsYes':fudaiType,'sunBoxBagIsNo':!fudaiType}">
                <div class="fudaiBox fudai1" v-if="fudaiType">
                    <div class="contents1">
                        <div>恭喜你!</div>
                        <div v-if="randomState==1">
                            <p>{{courseNameOrGold}}</p>
                            <p>{{courserDay}}天免费观看权</p>
                        </div>
                        <p v-if="randomState==2">获得{{courseNameOrGold}}礼金</p>
                    </div>
                    <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close.png' @click="cloeseFubaoEven"/>
                </div>
                <div class="fudaiBox fudai2" v-else>
                    <div class="contents2">
                        <div>很遗憾</div>
                        <div>你的福包爆了！</div>
                        <p>安慰下领取100礼金</p>
                    </div>
                    <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_close.png' @click="cloeseFubaoEven"/>                    
                </div>
            </div>             
        </div>            
    </div>    
</template>
<script>
import {store,mutations} from '../store'
export default {
    data(){
        return{
            boxshowOne:false,
            boxshowTwo:false,
            show:false,
            loading:false,
            finished:false,
            userInfo:{},
            tableFubaoList:[],
            pageSize:10,
            pageNo:1,        
            isOkFuBaoType:false,
            exchangeData:{},
            selectIndex:-1,
            fudaiType:true,//领取福宝是报了还是获得了；
            fubaoResultBox:false,
            randomState:-1,//1课程，2礼金，3爆了
            courseNameOrGold:'',
            courserDay:'',
            inApp:false
        }
    },
    beforeRouteLeave(to, from, next){
        next()
    },
    created(){  
    },
    computed:{
        userInfoisApp(){
            return store.userInfo;
        }        
    },    
    methods:{
        //开奖
        async receiveThePrize(data){
            this.pointButton(17);
            const query = {
                userId:this.userInfo.userId,
                fuBaoId:data.id
            }
            const res = await this.$http.post(this.$server.getFuBaoOpenLottery,query,{userId:this.userInfo.userId,token:this.userInfo.token})
            if(res.data.status==200){
                this.randomState = res.data.content.type;
                switch (this.randomState) {
                    case 1:
                        this.courseNameOrGold = res.data.content.content;
                        this.courserDay = res.data.content.howMuchDay;
                        this.fudaiType=true;
                        break;
                    case 2:
                        this.courseNameOrGold = res.data.content.content;
                        this.fudaiType=true;
                        break;
                    case 3:
                        this.fudaiType=false;
                        break;
                    default:
                        break;
                }
                this.fubaoResultBox=true;
            }else{
                this.$toast(res.data.message)
            }
        }, 
        /**
         * button打点
         */
        async pointButton(type,callback){
            const query = {
                type:type
            }
            if(type==20){
                query.courseId = this.courseId
            }
            const res = await this.$http.post(this.$server.getFuBaoPointButton,query)
            if(res.data.status==200){
                if(callback && typeof callback==='function'){
                callback()
                }
            }
        },
        cloeseFubaoEven(){
            this.fubaoResultBox=false;
            this.pageNo=1;
            this.tableFubaoList=[];                    
            this.loading = false;
            this.finished = false;            
            this.onFubaoLoad();
        },
        //过滤福宝
        filterFuaoData(){
            
        },
        //选择福包
        selectFubao(type){
            //tableFubaoList  福包列表
            this.tableFubaoList=this.tableFubaoList.map((item,index) => {
                if(this.selectIndex==index){
                    if(type){
                        // item['symbolType']=type;
                        // item['setFubao']=true;
                        if(type==1){
                            this.pointButton(13);
                            this.getFuBaoAddSpellEven(1,index);
                        }else if(type==2){
                            this.pointButton(14);
                            this.getFuBaoAddSpellEven(2,index);
                        }else if(type==3){
                            this.pointButton(15);
                            this.getFuBaoAddSpellEven(3,index);
                        }
                    }
                }
                return item
            })
            this.boxshowTwo = !this.boxshowTwo;
            setTimeout(()=>{
                this.boxshowOne = !this.boxshowOne;
            },500);    
            this.selectIndex=-1;        
        },
        openFubaoEven(data,index){
            if(!data.setFubao){
                this.exchangeData = data;
                this.selectIndex = index;
                this.pointButton(12);
                if(data.openStatus==1){
                    this.boxshowOne = !this.boxshowOne;
                    setTimeout(()=>{
                        this.boxshowTwo = !this.boxshowTwo;
                    },100);
                }
            }
        },

        //添加符
        async getFuBaoAddSpellEven(type,indezs){
                let query = {
                    userId:this.userInfo.userId,
                    type:type,
                    fuBaoId:this.exchangeData.id
                };
                let url = this.$server.getFuBaoAddSpell;
                const res = await this.$http.post(url,query,{userId:this.userInfo.userId,token:this.userInfo.token});
                if(res.data.status==200){
                    this.tableFubaoList=this.tableFubaoList.map((item,index) => {
                        if(indezs==index){
                            if(type){
                                item['setFubao']=true;
                                item['symbolType']=type
                            }
                        }
                        return item
                    })
                }else{
                     this.$toast(res.data.message)
                }
        },          
        goTo(){
            if(this.isOkFuBaoType){
                this.isOkFuBaoType = false;
                this.pageNo=1;
                this.tableFubaoList=[];                    
                this.loading = false;
                this.finished = true;
                setTimeout(()=>{
                    this.onFubaoLoad();
                },50);
            }else{
                // this.$router.push({path:'/index'});
                this.$router.go(-1);
            }
        },
        //我的富宝可以开奖
        async isOkOpenFubao(type){
            this.finished = true;
            this.pointButton(16);
            this.isOkFuBaoType = true;
            this.pageNo=1;
            this.tableFubaoList=[];                    
            this.loading = false;
            setTimeout(()=>{
                this.onFubaoLoad();
            },50);
        },         
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
                    if(this.isOkFuBaoType){
                        url = this.$server.getFuBaoCanOpenFuBaoList;
                    }else{
                        url = this.$server.getFuBaoWaitOpenFuBaoList;
                    }
                    this.loading = true;
                    const res = await this.$http.post(url,query,{userId:this.userInfo.userId,token:this.userInfo.token});
                    if(res.data.status==200){
                        // if(res.data.content.list.length>0){
                            let lists = [];
                            if(this.isOkFuBaoType){
                                lists = res.data.content.list.map((item,index)=>{
                                    if(item.symbolType){
                                        item['setFubao']=true;
                                    }else{
                                        item['symbolType']=4;
                                    }
                                    return item;
                                });
                            }else{
                                lists = res.data.content.list.map((item,index)=>{
                                    if(item.symbolType){
                                        item['setFubao']=true;
                                    }else{
                                        item['setFubao']=false;
                                    }
                                    return item;
                                });
                            }
                            this.tableFubaoList = [...this.tableFubaoList,...lists];               
                            this.pageNo++;
                            this.loading = false;
                            this.finished = res.data.content.isLastPage;
                        // }
                    }     
                }        
            }
        }
    
      
}
</script>

<style>
.fubaoListBox .van-list .van-list__finished-text{
    font-size: 0.24rem;
    text-align: center;
    padding: 0 0 0.2rem 0;
    color: #fff;
    overflow: hidden;
}
.fubaoListBox .van-list .van-list__loading .van-loading{
    text-align: center;
}
.fubaoListBox .van-list .van-list__loading .van-loading .van-loading__text{
    color: #fff !important;
    font-size: 0.3rem !important;
}  
</style>
<style lang="scss" scoped>
    .fubao-page{
        width: 100%;
        position: relative;
        height: 100%;
        // background: #D70009;
        .fubao_header{
            height: 1rem;
            padding:0 0.32rem 0.2rem;
            display: flex;
            flex-direction: row;
            align-items:flex-end;
            justify-content:space-between;
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
        .fubao_contents{
            background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjieBgd.png')no-repeat 50% 50% / cover;
            height: 100%;
            // padding-top: 0.55rem;
            overflow-y: auto;
            .fubaoTagBox{
                display: flex;
                padding: 0.55rem 0.39rem 0 0.28rem;
                margin-bottom: 0.45rem;
                &.waitStyle{
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;    
                    .img3{
                        width: 2.842rem;
                        height: 0.34rem;
                        margin-right: 0.82rem;
                    }                 
                }
                &.isOkStyle{
                    flex-direction: column;
                    justify-content: space-between;
                    align-items:center;
                    .img3{
                        width: 2.842rem;
                        height: 0.34rem;
                    } 
                }
                .img1{
                    width: 1.04rem;
                    height: 0.4rem;
                    display: block;
                    margin-bottom: 0.1rem;
                    margin-right: 3.4rem;
                }
                .img2{
                    width: 1.12rem;
                    height: 1.37rem;
                    display: block;
                }                
            }
            .fubaoMaskBox{
                background: rgba(0, 0, 0, 0.7);
                position: fixed;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                .fubaoBox{
                    padding: 0.5rem 0 0.1rem 0;
                    height:8.54rem;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjiecashBox.png')no-repeat 50% 50% / cover;
                    overflow: hidden;
                    .fubaoTitle{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                        padding:0 0.33rem 0 0.8rem;
                        color: #004088;
                        font-family: 'PingFangSC-Medium';
                        div{
                            font-size: 0.5rem;
                        }
                        img{
                            width: 0.48rem;
                            height: 0.48rem;
                        }
                    }
                    .fubaoUlBox{
                        overflow: auto;
                        height: 7.01rem;
                        padding: 0.1rem 0.75rem 0;
                        .fubao_li{
                            width: 6rem;
                            height: 1.96rem;
                            background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjiecashLi.png')no-repeat 50% 50% / cover; 
                            margin-top: 0.29rem;
                            padding: 0.16rem 0.29rem 0.17rem 0.35rem;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            flex-direction: row;
                            .imgOne{
                                width: 0.84rem;
                                height: 1.62rem;
                            }
                            .imgDiv{
                                display: flex;
                                justify-content:center;
                                align-items: center;
                                flex-direction:column;                                
                                .imgTwo{
                                    width: 1.4rem;
                                    height: 0.74rem;
                                }
                                p{
                                    text-align: center;
                                    font-size: 0.24rem;
                                    color: #666;
                                }
                            }
                            .divText{
                                font-family: 'PingFangSC-Medium';
                                p:nth-child(1){
                                    font-size: 0.34rem;
                                    color: #AA0000;
                                    font-weight: 600;
                                }
                                p:nth-child(2){
                                    font-size: 0.26rem;
                                    color: #666;
                                    margin-top: 0.21rem;
                                }
                            }
                        }
                    }
                }
                //给过渡的name加样式
                
                .myFuBaoBox-leave-active,.myFuBaoBox-enter-active{
                    transition: all 0.1s linear; 
                }
                .myFuBaoBox-leave-active,.myFuBaoBox-enter{
                    height:0rem !important;
                }
                .myFuBaoBox-leave,.myFuBaoBox-enter-active{
                    height: 8.48rem;
                }                 
            }
            .fubaoListBox{
                padding: 0.3rem;
                .van-list{
                    >div{
                        height: 2.7rem;
                        width: 6.9rem;
                        background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjiecashLi.png')no-repeat 50% 50% / cover;
                        border-radius: 0.2rem;
                        margin-bottom: 0.3rem;
                        padding: 0.35rem 0.14rem 0.34rem 0.28rem;
                        display: flex;
                        justify-content: space-between;
                        flex-direction: row;
                        align-items: center;
                        .img1{
                            width: 0.47rem;
                            height: 0.47rem;
                        }
                        .img2{
                            width: 1.39rem;
                            height: 0.73rem;
                        }
                        .textImg{
                            width: 0.84rem;
                            height: 1.97rem;
                            position: relative;
                            .allImgBox{
                                width: 0.84rem;
                                height: 1.62rem;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }
                                div{
                                    width: 100%;
                                    height: 100%;                                
                                }
                            }
                            p{
                                text-align: center;
                                font-size: 0.26rem;
                                position: absolute;
                                width: 2.4rem;
                                bottom: 0;
                                left: -0.68rem;
                                color: #666;
                                font-family: 'PingFangSC-Medium';
                            }
                            .imgBox{
                                width: 1.29rem;
                                height: 0.63rem;
                                position: absolute;
                                left: -0.22rem;
                                img{
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                }
                            }
                        }
                        .imgbox{
                            width: 2.77rem;
                            height: 2.03rem;
                            border: 0.06rem solid #00569F;
                            border-radius: 0.12rem;                            
                            img{
                                display: block;
                                width: 100%;
                            }
                            p{
                                font-size: 0.24rem;
                                color: #333;
                                width: 100%;
                                text-align: center;
                                line-height: 0.48rem;
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                font-family: 'PingFangSC-Medium';                                
                            }
                        }
                    }
                }
                .noTableData{
                    text-align: center;
                    font-size: 0.3rem;
                    color: #fff;
                    font-family: 'PingFangSC-Medium';
                }
            }
            .hehe-enter,.hehe-leave-to{
                opacity: 0;
            }
            .hehe-enter-to,.hehe-leave{
                opacity: 1;
            }
            .hehe-enter-active,.hehe-leave-active{
                transition: all 3s;
            }                    
        }
        .sunBoxBagLayer{
            position: fixed;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.7);
            .sunBoxBag{
                 margin-top:2.3rem;
                 height: 10.24rem;
                 &.sunBoxBagIsYes{
                     background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_sun_bag.png')no-repeat 50% 50% / cover;
                 }
                 &.sunBoxBagIsNo{
                     background:none;
                 }
                .fudaiBox{
                    width: 6.08rem;
                    height: 7.24rem;
                    margin: 1.62rem 0 0 0.82rem;
                    position:absolute;
                    .contents1{    
                        width: 3.1rem;
                        position: absolute;
                        left: 1.4rem;
                        top: 3.66rem;
                        >div:nth-child(1){
                            font-size: 0.44rem;
                            text-align: center;
                            color: #790403;
                            font-family: 'PingFangSC-Medium';
                        }
                        >div:nth-child(2){
                            p{
                            font-size: 0.3rem;
                            text-align: center;
                            color: #666666;
                            font-family: 'PingFangSC-Medium';
                            }
                        }
                        p{
                            font-size: 0.3rem;
                            text-align: center;
                            color: #666666;
                            font-family: 'PingFangSC-Medium';
                        }
                    }
                    .contents2{
                        width: 3.1rem;
                        position: absolute;
                        left: 1.6rem;
                        top: 3.6rem;
                        div{
                            font-size: 0.44rem;
                            text-align: center;
                            color: #790403;
                            font-family: 'PingFangSC-Medium';
                        }
                        p{
                            font-size: 0.3rem;
                            text-align: center;
                            color: #666666;
                            font-family: 'PingFangSC-Medium';
                        }
                    }
                    img{
                        width: 0.74rem;
                        height: 0.74rem;
                        position: absolute;
                        bottom: -0.74rem;
                        left:2.67rem;
                    }
                }
                .fudai1{
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_fu_bag.png')no-repeat 50% 50% / cover;
                }
                .fudai2{
                    background:url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/20210201/nChunjie_burst.png')no-repeat 50% 50% / cover;
                }
            }
        }        
    }
</style>
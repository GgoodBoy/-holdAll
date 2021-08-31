<template>
    <div class="active-wrap" v-show="domShow">
        <div class="active-box">
            <div class="active-box1" v-if="!freeIsOk" :style="dataInfo.bagType==1?{backgroundImage: 'url(' + dataInfo.picture + ')'}:''" :class="{'imgOne':(Number(dataCourseNum)==1),'imgTwo':(Number(dataCourseNum)==2),'imgThree':(Number(dataCourseNum)>=3),'link':dataInfo.bagType==2}">
                <img :src="dataInfo.picture" v-if="dataInfo.bagType==2" class="bgd" @click="goPage"/>
                <img :src="dataInfo.picture" v-if="dataInfo.bagType==3" class="bgd type3" @click="goCourse"/>
                <van-icon class="van-icon-css" name="close" color="#fff" size="0.5rem" @click="leaveEvent()"/>
                
                <template v-if="dataInfo.bagType==1">
                    <div class="boxScroll" :class="{'overState1':(listNum.length>3),'overState2':(3>listNum.length)}">
                        <div class="sunsBox" v-for="(item,index) in listNum" :key='index'>
                            <div class="sunsBox1">
                                <div class="leftText">
                                    <p>{{item.courseName}}</p>
                                    <p>{{item.lectureTeacherList[0].name}} <span v-if="Number(item.lectureTeacherList.length)>1?true:false">等</span></p>
                                </div>
                                <div class="rightText">
                                    <p>价值</p>
                                    <p>{{Number(item.coursePrice)?(item.coursePrice.toString()).indexOf(".")==-1?item.coursePrice+'.00':item.coursePrice.toFixed(2):'免费'}}</p>
                                </div>              
                            </div>
                        </div> 
                    </div>
                    <div class="titleAllbox">
                        <p class="titleText">领取后{{dataInfo.giftDate}}日内有效</p>     
                        <div class="butBox" @click="freeIsOkBut"></div>       
                        <p class="titleText2">课程领取后在已购中查看</p> 
                    </div>
                </template>
            </div>
            <div class="active-box2" v-if="freeIsOk">
                <div class="freeTextBox">
                    <p class="p1">恭喜您成功领取课程</p>
                    <div class="div1">
                        <div>{{nameString}}</div>
                    </div>
                    <p class="p2">请于{{learnTime}}日前完成学习</p>
                    <div class="isOkFree">
                        <img :src="imgIsOk" @click="isOkFreeEven"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex';
import imgIsOk from '@/assets/image/getfreeIsOk.png'
export default {
    data(){
        return {
            freeIsOk:false,
            imgIsOk:imgIsOk,
            nameString:'',
            learnTime:'',
            domShow:false
        }
    },
    props:["dataInfo",'dataCourseNum'],
    created(){
        if(!this.dataInfo.gcrList)return;
        this.dataInfo.gcrList.forEach((element,index) => {
            if(index==this.dataInfo.gcrList.length-1){
                this.nameString= this.nameString+element.courseName;
            }else{
                 this.nameString= this.nameString+element.courseName+',';
            }
        });
        var freeIsOk =localStorage.getItem('actionFlagIsOk');
        if(freeIsOk=='ok'){
            this.learnTime=localStorage.getItem('actionFlagIsOkTime');
            this.freeIsOk = true;
        }else{
            this.freeIsOk=false;
        }
    },
    computed:{
        listNum(){
            return this.dataInfo.gcrList||[];
        },
        ...mapState(['actionFlagState']),
    },    
    methods:{
        ...mapActions([
            'setActionStateFlag',
            'setInterestFlag',
            'setActionflagstates',
            'setGiftFlag',
            'setChinaMobileDialog',
            'setMembershipCardDialog',
            'setpasswardStates']),
        //点击免费领取事件;
        freeIsOkBut(){
            let login = this.$getCookie('uInfo');
			if(!login){
				sessionStorage.setItem('rediectUrl',this.$route.fullPath);
                this.setActionStateFlag(false);
                this.$router.push({
                    path:'/auth',
                    query:{
                        from:'giftpack'
                    }
                });
                this.setpasswardStates(false);
				return;
            }else{
                var id =Number(localStorage.getItem('actionFlagId'));
                this.$http.post(this.$server.getGiftBagReceive,{giftId:id,userId:login.userid}).then(res=>{
                    if(res.data.status==200){
                        //活动领取页面和领取活动成功页面的交互；
                        localStorage.setItem('actionFlagIsOk','ok');
                        localStorage.setItem('actionFlagIsOkTime',res.data.content.tryEndAt);
                        localStorage.setItem('userSmsLoginInfo',JSON.stringify(res));
                        this.setActionStateFlag(true);
                        this.learnTime=res.data.content.tryEndAt;
                        this.freeIsOk = true;
                    }else{
                        this.$toast({
                            mask: false,
                            message: res.data.message
                        })
                    }
                });                
            } 
        },
            // })        
        /**
		 * 获取用户基本信息
		 */
		getUserInfo(){},
        isOkFreeEven(){
                localStorage.removeItem('actionFlagIsOk');
                localStorage.removeItem('actionFlagIsOkTime');
                this.setActionflagstates(false);
                this.setActionStateFlag(false);      
                let ChinaMobile = sessionStorage.getItem('ChinaMobile');
                let setInterestFlagBool = sessionStorage.getItem('setInterestFlagBool'); 
                let welcomeSpeech = sessionStorage.getItem('welcomeSpeech');   
                let welcomeSpeechForMemberMake = sessionStorage.getItem('welcomeSpeechForMemberMake');
                if(ChinaMobile){
                    this.setChinaMobileDialog(true);
                }else{
                    if(setInterestFlagBool){
                        this.setInterestFlag(true)
                    }else{
                        if(welcomeSpeech){
                            this.setGiftFlag(welcomeSpeech)
                        }else{
                            if(welcomeSpeechForMemberMake){
                                this.setMembershipCardDialog(welcomeSpeechForMemberMake)
                            }
                        }
                    }
                }
            },  
        goPage(){
            this.$toast.loading()
            this.leaveEvent()
            window.location.href = this.dataInfo.mstationLinkUrl;
        },
        goCourse(){
            this.leaveEvent()
            this.$router.push(`/course/${this.dataInfo.giftCourse}`)
        },
        leaveEvent(){
            localStorage.removeItem('actionFlagIsOk');
            localStorage.removeItem('actionFlagIsOkTime');
            this.setActionflagstates(false);
            this.setActionStateFlag(false); 
            let setInterestFlagBool = sessionStorage.getItem('setInterestFlagBool'); 
            let welcomeSpeech = sessionStorage.getItem('welcomeSpeech');     
            let welcomeSpeechForMemberMake = sessionStorage.getItem('welcomeSpeechForMemberMake');
            if(setInterestFlagBool){
                this.setInterestFlag(true)
            }else{
                if(welcomeSpeech){
                    this.setGiftFlag(welcomeSpeech)
                }else{
                    if(welcomeSpeechForMemberMake){
                        this.setMembershipCardDialog(welcomeSpeechForMemberMake)
                    }
                }
            }
        }
    },
    mounted(){
        this.$nextTick(function () {
            this.domShow = true;
            })
    },    
}
</script>
<style lang="scss" scoped>
    ::-webkit-scrollbar {
        display: none;
    }
    .active-wrap{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: rgba(0,0,0,0.5);
        // overflow: hidden;
        .active-box{
            width: 5.9rem;
            min-height:3rem;
            border-radius: 5px;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .imgOne{
                height: 6.1rem;                
            }
            .imgTwo{
                height: 7.59rem;                
            }
            .imgThree{
                height: 9.08rem;
            }
            .active-box1{
                position: relative;
                width: 5.9rem;
                background-size: cover;
                padding-top: 3.02rem;
                background-repeat: no-repeat;
                .type3{
                    position: absolute;
                    top:0;
                    left:0;
                }
                &.link{
                    padding:0;
                }
                .van-icon{
                    position: absolute;
                    top: -0.3rem;
                    right: -0.3rem;
                }
                .titleAllbox{
                    width: 4.95rem;
                    bottom: 0.3rem;
                    left:0.46rem;
                    position: absolute;
                    .titleText,.titleText2{
                        text-align: center;
                        color: #fff;
                        font-size: 0.24rem;
                        line-height: 0.24rem;
                        font-weight: 700;
                    }
                    .butBox{
                        width: 3.72rem;
                        height: 0.64rem;
                        background: url('../../assets/image/getFree.png') no-repeat;
                        background-size: cover;
                        margin: 0.1rem auto;
                    }
                }
                .overState1{
                    overflow-y: auto;
                }
                .overState1{
                    overflow-y: hidden;
                }                    
                .boxScroll{
                    max-height:4.24rem;
                    -webkit-overflow-scrolling: touch;
                    .sunsBox{
                        margin-bottom: 0.25rem;
                        .sunsBox1{
                            position: relative;
                            overflow: hidden;
                            width: 4.48rem;
                            background: url('../../assets/image/item_give_class.png') no-repeat;
                            background-size: cover;
                            margin:auto;
                            height: 1.24rem;
                            .leftText{
                                float: left;
                                height: 1.24rem;
                                width: 3rem;
                                // background-color: #fff;
                                border-radius: 0.12rem 0 0 0.12rem;
                                position: relative;
                                p:nth-child(1){
                                    color: #084EC6;
                                    font-size: 0.24rem;
                                    line-height: 0.28rem;
                                    margin: 0 0.28rem 0 0.28rem; 
                                    font-weight: 700;
                                    position: absolute;
                                    top: 0.2rem;
                                    overflow:hidden; 
                                    text-overflow:ellipsis;
                                    display:-webkit-box; 
                                    -webkit-box-orient:vertical;
                                    -webkit-line-clamp:2;                                     
                                }
                                p:nth-child(2){
                                    color: #666666;
                                    font-size: 0.22rem;
                                    margin: 0.1rem 0 0 0.28rem; 
                                    font-weight: 700;
                                    position: absolute;
                                    bottom: 0.14rem;
                                }                       
                            }
                            .rightText{
                                float: left;
                                width: 1.44rem;
                                height: 1.24rem;
                                // background-color: #FCC91A;
                                border-radius: 0 0.12rem 0.12rem 0;
                                color: #084EC6;
                                p:nth-child(1){
                                    font-size: 0.38rem;
                                    text-align: center;
                                    padding: 0.16rem 0.16rem 0 0.16rem;
                                    font-weight: 700;
                                }
                                p:nth-child(2){
                                    font-size: 0.35rem;
                                    font-style:oblique;
                                    font-weight: 700;
                                    letter-spacing: -0.02rem;
                                    text-align: center;                            
                                }                          
                            }                 
                        }
                        
                }
            }
            }
            .active-box2{
                    width: 5rem;
                    height: 6.52rem;
                    background: url('../../assets/image/freeIsok.png') no-repeat;
                    background-size: cover;
                    margin: auto;
                    position: relative;
                    .freeTextBox{
                        position: absolute;
                        top: 3rem;
                        height: 1rem;
                        width: 4.75rem;
                        .p1{
                            font-size: 0.42rem;
                            color: #fff;
                            font-weight: 700;
                            text-align: center
                        };
                        .div1{
                            width: 2.92rem;
                            margin: auto;       
                            height: 1.44rem;
                            display:table;
                            div{          
                                width: 1005;
                                text-align: center;
                                display:table-cell;
                                vertical-align:middle;
                                word-wrap: break-word;
                                word-break: normal;  
                                font-size: 0.28rem;
                                color: #fff;                                                                
                            }                
                        };
                        .div1::before{
                            content: '';
                            display:-webkit-inline-box;
                            height: 100%;
                            width: 100%;
                            vertical-align: middle;
                        }
                        .p2{
                            color: #FFFF33;
                            text-align: center;
                            font-size: 0.22rem;
                            padding: 0 0 0.24rem 0;
                        };
                        .isOkFree{
                            width: 2.98rem;
                            height: 0.64rem;
                            margin: auto;
                        }
                    }
            }
        }
    }
</style>

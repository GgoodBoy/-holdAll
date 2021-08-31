<template>
    <div class="interest-wrap">
        <div class="interest-box">
            <div class="header">
                <p>选择你感兴趣的内容</p>
            </div>
            <div class="main">
                <div class="interest-list clearfix">
                    <p class="interest-item" v-for="(item,index) in interestList" :key="index" :class="item.selected?'selected':''" @click="choose(item)">{{item.label}}</p>
                    
                </div>
                <p class="tips">最多选3个兴趣</p>
                <div class="btn-area clearfix">
                    <button class="sure" @click="sure">确定</button>
                    <button class="cancel" @click="cancel">跳过</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    data(){
        return {
            interestList:[
            ],
            nickname:'',
        }
    },
    created(){
        this.getUserInfo()
        this.getInterestList()
    },
    methods:{
        ...mapActions(['setInterestFlag','setGiftFlag','setMembershipCardDialog']),
        getInterestList(){
            let query = {}
            this.$http.post(this.$server.getInterestList,query).then(res=>{
                if(res.data.status==200){
                    this.interestList = res.data.content.map(item=>{
                        return {
                            label:item.name,
                            id:item.id,
                            selected:false
                        }
                    })
                }
            })
        },
        /**
		 * 获取用户基本信息
		 */
		getUserInfo(){
			this.$http.post(this.$server.getUserInfoById,{}).then(res =>{
				if(res.data.status == 200){
                    this.nickname = res.data.content.nickname
				}
			})
		},
        /**
         * 选择兴趣
         */
        choose(obj){
            obj.selected = !obj.selected
        },
        sure(){
            let temp = this.interestList.filter(item=>item.selected ==true)
            if(temp.length>3){
                this.$toast("最多可选3项兴趣");
                return false;
            }
            if(temp.length==0){
                this.$toast("至少选择1项兴趣");
                return false; 
            }
            let interestIdArr= temp.map((item)=>{
                return item.id
            })
            let query = {
                interestId:interestIdArr.join(','),
                nickname:this.nickname
            }
            this.$http.post(this.$server.updateInfo,query).then(res=>{
                if(res.data.status == 200){
                    this.setInterestFlag(false)
                    let welcomeSpeech = sessionStorage.getItem('welcomeSpeech')
                    if(welcomeSpeech){
                        this.setGiftFlag(welcomeSpeech)
                    }else{
                        let welcomeSpeechForMemberMake = sessionStorage.getItem('welcomeSpeechForMemberMake');
                        if(welcomeSpeechForMemberMake){
                            this.setMembershipCardDialog(welcomeSpeechForMemberMake)
                        }
                    }
                    if(res.data.content.integralNum>0){
                        this.$rewardPointsToast({
							points:res.data.content.integralNum
						})
                    }
                }
            })
        },
        cancel(){
            sessionStorage.removeItem('welcomeSpeech')
            this.setInterestFlag(false)
            let welcomeSpeech = sessionStorage.getItem('welcomeSpeech');     
            let welcomeSpeechForMemberMake = sessionStorage.getItem('welcomeSpeechForMemberMake');
            if(welcomeSpeech){
                this.setGiftFlag(welcomeSpeech)
            }else{
                if(welcomeSpeechForMemberMake){
                    this.setMembershipCardDialog(welcomeSpeechForMemberMake)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    ::-webkit-scrollbar {
        display: none;
    }
    .interest-wrap{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 98;
        background: rgba(0,0,0,0.7);
        .interest-box{
            width: 6.3rem;
            height: 9rem;
            border-radius: 5px;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
            .header{
                height: 2.02rem;
                border-radius: 5px;
                background: url('../../assets/image/interest_bgd.png')no-repeat 50% 50%;
                background-size: cover;
                padding: 0.68rem 0 0 0;
                p{
                    color:#3C3C3D;
                    font-size: 0.36rem;
                    text-align: center;
                    font-weight: bold;
                }
            }
            .main{
                padding: 0 0.24rem;
                .interest-list{
                    height: 4.4rem;
                    padding: 0.1rem 0;
                    overflow: auto;
                    -webkit-overflow-scrolling: touch;
                    .interest-item{
                        overflow: hidden;
                        float: left;
                        width: 1.5rem;
                        height: 0.56rem;
                        line-height: 0.5rem;
                        text-align: center;
                        border:1px solid #E0E0E3;
                        border-radius: 25px;
                        margin:0.15rem 0.22rem;
                        font-size: 0.3rem;
                        &.selected{
                            background: #E8BEC0;
                            border:1px solid #DEA0A3;
                            color:#B4272D;
                        }
                    }
                }
                .tips{
                    color:#E0E0E3;
                    font-size: 0.3rem;
                    text-align: center;
                    margin:0.46rem 0;
                }
                .btn-area{
                    padding: 0 0.6rem;
                    button{
                        width: 2.1rem;
                        height: 0.8rem;
                        line-height: 0.8rem;
                        border-radius: 25px;
                        text-align: center;
                        color:#fff;
                        outline: none;
                        font-size: 0.32rem;
                        letter-spacing: 1px;
                        &.sure{
                            background: #B4272D;
                            box-shadow: 0 0 2px #B4272D;
                            border:1px solid #B4272D;
                            float: left;
                        }
                        &.cancel{
                            background: #BEBDBD;
                            box-shadow: 0 0 2px #BEBDBD;
                            float: right;
                            border:1px solid #BEBDBD;
                        }
                    }
                }
            }
        }
    }
</style>

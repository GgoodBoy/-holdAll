<template>
    <div class="dialog_login" v-show='loginShow' @click="dialogLoginClick(true)">
        <div class="login"  @click.stop="dialogLoginClick(false)">
            <div inset class="inputBox">
                <van-field class='telCss' label-width='1rem' v-model="cellphone" maxlength='11' placeholder="请输入手机号" type="tel" label="手机号" />
                <div class="codeBox">
                    <van-field class='codeCss' label-width='1rem' v-model="code" placeholder="输入验证码" maxlength='6' label="验证码" />
                    <div class="code-btn" @click.stop="sendSms" :class="{'disabled':codeText!='获取验证码'}">
                        {{codeText}}
                    </div>
                </div>
            </div>   
            <img src='https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/denglu.png' @click.stop="loginEvent"/>
            <div class="loadBox" v-show="loading">
                <van-loading type="spinner"/>
            </div>
        </div>
    </div>
</template>

<script>

import {onMounted,ref,provide,inject,getCurrentInstance, watch} from 'vue'
let codeTimer;
//判断是分享过来的连接还是直接打开的连接；
function url_data(url){//URL地址的解析
    var obj = {};
    if (url.includes('&')) {
            let arr1 = url.split('?')[1].split('&');
            arr1.forEach(item => {
            let arr2 = item.split('=');
            let arr_one = arr2[0];
            let arr_two = arr2[1];
            obj[arr_one] = arr_two;
        })
    } else {
        if(url.includes('?')){
            let arr1 = url.split('?')[1].split('=');
            arr1.forEach(item => {
                let arr_one = arr1[0];
                let arr_two = arr1[1];
                obj[arr_one] = arr_two;
            })
        }
    }
    return obj;
}
export default {
  name: 'login',
  components: {},
  props: {},
  setup(props,context){
    const {proxy} = getCurrentInstance();
    const cellphone = ref(null);
    const code = ref('');
    const loading = ref(false);
    const loginShow = inject('loginDialType');
    const codeText = ref('获取验证码');
    const dialogLoginClick = (states)=>{
        if(states){
            context.emit('closeEven',{dialogId:1,type:false}) 
        }
    }
    const sendSms = ()=>{
					const regExp = /^[0-9]*$/
					if(codeText.value!='获取验证码') return false;
					if(cellphone.value.length!=11||!regExp.test(cellphone.value)){
						Toast('请输入正确的手机号');
						cellphone.value = '';
						return;
					}	
					var query = {
						cellphone:cellphone.value,
						smsType:1,
						tokenType:2
                    }
                    loading.value = true;
                    proxy.$http.post(proxy.$server.sendSms,query).then(res=>{
                        if(res.status==200){
                            let time = 60;
                            loading.value = false;
                            codeText.value= time +'s';
                            codeTimer = setInterval(()=>{
                                time--;
                                codeText.value = time +'s'
                                if(time==0){
                                    clearInterval(codeTimer);
                                    codeText.value = '获取验证码'
                                }
                            },1000)           
                        }
                    }).catch(()=>{
                        loading.value = false;
                    })       
    }
    const loginEvent = ()=>{
				if(cellphone.value.length!=11){
					Toast('请输入正确的手机号');
					cellphone.vakue ='';
					return;
				}
				if(code.value.length!=6){
					Toast('无效的验证码')
					return;
				}	
				var query = {
					cellphone:cellphone.value,
					tokenType:2,
					code:code.value,
					registerSource:3,
                    requestType:1,
                    channelId:2,
					activityName:'hb'
				}
				// window.location.href
				let parems = url_data(window.location.href);
				if(parems.activityShareUserId){
					query['activityShareUserId']=parems.activityShareUserId;
					query['activityName']=parems.activityName;
                }
                loading.value = true;
                proxy.$http.post(proxy.$server.login,query).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
							let userInfo = {
								accessToken: res.data.content.accessToken,
								nickname: res.data.content.nickname,
								avatar: res.data.content.avatar,
								userid: res.data.content.id,
								cellphone:res.data.content.cellphone,
                            }	
                            context.emit('packUserInfo',userInfo)
                            context.emit('closeEven',{dialogId:1,type:false})  
                        }
                        loading.value = false;
                    }
                }).catch(()=>{
                    loading.value = false;
                })               
    }
    onMounted(()=>{})
    return{
        loginShow,
        cellphone,
        code,
        codeText,
        loading,
        //方法
        sendSms,
        dialogLoginClick,
        loginEvent
    }
  }
}
</script>
<style lang="less">

.dialog_login{
    position:fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,0.8);
    z-index: 3;
    .login{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;	
        width:6.483rem;
        height: 5.6rem;
        background:url("https://xgxw-pic.oss-cn-beijing.aliyuncs.com/hd/hongbao/loginInconImg.png") no-repeat center;
        background-size: cover;
        img{
            display: block;
            width:2.24rem;
            margin:0.34rem auto 0;
        }
        .loadBox{    
            position: absolute;
            left: 0;
            bottom: 2.5rem;
            right: 0;
            margin: auto;
        }
        .inputBox{
            width:5rem;
            margin-left:0.8rem;
            margin-top: 1.29rem;
            .telCss{
                border-radius:0.88rem;
                border:0.02rem solid #C71626;
            }
            .codeBox{  
                margin-top: 0.2rem;
                display:flex;
                flex-direction: row;
                align-items: center;                
                .codeCss{
                    border-radius:0.88rem;
                    width:3.4rem;
                    border:0.02rem solid #C71626;
                }
                .code-btn{
                    font-size: 0.26rem;
                    text-decoration: underline;
                    margin-left: 0.1rem;
                    color:#C71626;    
                    width: 1.5rem;
                    text-align: center;
                }
            }
        }
    }
}
</style>

<template>
  <div class="index" :class="{overflowScroll:!overflowtype,overflowHidden:overflowtype}"> 
      <div class="header">
          <img src="../assets/images/daren_1.png" />
          <div class="headerDiv" @click='qunayisDialEven'></div>
      </div>
      <div class="content">
            <div class="topBox">购买以下课程升级为国学智慧达人</div>
            <div class="listBox" v-if="courseListData.length">
                <div class="li" v-for="(item,index) in courseListData" :key='index' @click="goTo(item)">
                    <div class="leftLi">
                        <img class='img1' :src='item.surfacePlot'/>
                        <img class='img2' v-if='item.courseType==1' src="../assets/images/daren_14.png" />
                        <img class='img2' v-else src="../assets/images/daren_15.png" />
                    </div>
                    <div class="rightLi">
                        <div class="div0">
                            <p>{{item.title}}</p>
                            <div class="div1">
                                <img src='../assets/images/userIcon.png'/>
                                <div>{{item.lectureTeacherList[0].name}}/{{item.planPeriodNum}}讲</div>
                            </div>
                        </div>
                        <div class="div2">
                          <div>{{sauFaNumber(item.courseBrowsCount)}}人学习</div>
                          <div>{{Number(item.sellingPrice).toFixed(2)}}币</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="listBox2" v-else>暂无课程</div>
      </div>
      <!-- 登录 -->
      <login @packUserInfo="setPackUserEven" @closeEven="closeEven"/> 
      <qunayi @closeEven="closeEven"/>
  </div>
</template>

<script>
function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
function loadScript(src){
        return new Promise((resolve,reject)=>{
            let script = document.createElement('script');
            let body = document.getElementsByTagName('body')[0];
            script.type = 'text/javascript';
            script.src = src;
            if (script.readyState){
                script.onreadystatechange = ()=>{
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            } else {
                script.onload = ()=>{
                    resolve();
                };
                script.onerror = () => {
                    body.removeChild(script);
                    reject();
                }
            }
            body.appendChild(script);
        })
}
import {onMounted,ref,reactive,provide,inject,computed,getCurrentInstance,watch} from 'vue'
import { Toast } from 'vant';
import useIsWx from '@/hooks/useIsWx.js'
import { GetCookies,SetCookies } from '@/utils/setCookies'
import { useRouter } from 'vue-router'
import login from '@/components/login.vue'
import qunayi from '@/components/qunayi.vue'
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
function url_expertplanShareUser(url,name){//URL地址的解析
    var obj = {};
        if(url.includes(name)){
            let arr1 = url.split(name)[1];
            let arr2 = /\d+/.exec(arr1)[0];
            obj[name] = arr2;
        }
    return obj;
}
export default {
  name: 'index',
  components: {
    login,
    qunayi
  },
  setup(){
        const {proxy} = getCurrentInstance();
        const router = useRouter();
        const loginState = ref(false);//是否登录
        const overflowtype =ref(false);//页面滚动样式切换
        const loginDialType = ref(false);//登录框是否显示  
        const qunayisDialType = ref(false);//登录框是否显示 
        const loadScriptFlag = ref(false); 
        const loadHandType = ref(false);  //手动输入验证
        const courseListData = ref([]);//红包记录列表数据
        const {isWechatBrowser,iswxs} = useIsWx(); //获取openid
        const userData =ref({
                accessToken: '',
                nickname: '',
                avatar:'',
                userid:'',
                cellphone:'',
            });//用户信息保存
        const processType = window.location.href.indexOf('xgxm.xueguoxue.com')>0?ref(true):ref(false);
        const appid = processType.value?ref('wx44e94e1ef84f486e'):ref('wxfd920b9cc0f222c4');
        watch(() =>  loadHandType, (cur) => {
                if(cur){

                }
            }
        )        
        // router.beforeEach((to, from, next) => {
        //     /* 路由发生变化修改页面title */
        //     if (to.meta.title) {
        //         document.title = to.meta.title
        //     }
        //     next()
        // })
        const qunayisDialEven = ()=>{
            if(loginShow()) return;
            qunayisDialType.value = true;
        }
        const sauFaNumber = (num)=>{
                if(num>999){
                    return (Number(num)/10000).toFixed(1)+'W'
                }else{
                    return num;
                }
        }
        const loadScripts =()=>{
            if(loadScriptFlag.value){
                return false;
            }
            loadScript('//res.wx.qq.com/open/js/jweixin-1.4.0.js').then(()=>{
                    loadScriptFlag.value = true;
                    // share()
                }).catch(()=>{
                    loadScriptFlag.value = false;
                    setTimeout(()=>{
                        loadScripts()
                    },1000)
            });
        }
        const geTcourseList = (id)=>{
                courseListData.value = [];
				let query = {
                    "userId":id||userData.value.userid||'',
                }     
                proxy.$http.post(proxy.$server.getCarnivalCourses,query,{userId:userData.value.userid||'',token:userData.value.accessToken||''}).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            let data = res.data.content;
                            courseListData.value = data;
                        }                           
                    }
                })            
        }
        const loginShow = ()=>{
            let logetype = true;
            if(!userData.value.accessToken){
                if(iswxs()){
                    if(!loginState.value){
                        overflowtype.value = true;
                        loginDialType.value = true;
                    }else{
                        overflowtype.value = false;
                        loginDialType.value = false;
                    }
                }else{
                    Toast('该链接仅限在微信内访问~') 
                }
                if(iswxs()){
                    logetype = loginDialType.value;
                }
            }else{
                logetype = false;
            }
            return logetype;
        }        
        const goTo = (data)=>{
            if(loginShow()) return;
            SetCookies('courseSurfacePlot',JSON.stringify(data.surfacePlot))
            router.push({
                    //传递参数使用query的话，指定path或者name都行，但使用params的话，只能使用name指定 
                    path:'/courseDetail',
                    query:{
                        id:data.id,
                        imgs:data.surfacePlot
                    }
            })
        }
        //保存登陆后的用户信息
        const setPackUserEven = (data)=>{
            loginState.value = true;
            if(iswxs()){
                SetCookies('uInfo',JSON.stringify(data))
            }
            setTimeout(() => {
                    const uInfo = GetCookies('uInfo')
                    userData.value.accessToken = JSON.parse(uInfo).accessToken;
                    userData.value.nickname = JSON.parse(uInfo).nickname;
                    userData.value.avatar = JSON.parse(uInfo).avatar;
                    userData.value.userid = JSON.parse(uInfo).userid;
                    userData.value.cellphone = JSON.parse(uInfo).cellphone;
            }, 1000);
            loadHandType.value = true;
            getUserInfo(data);
        }
        const closeEven = (data)=>{
            console.log('closeEven-data',data);
            overflowtype.value = false;
            switch (data.dialogId) {
                case 1:
                    loginDialType.value = false;
                    break;
                case 2:
                    qunayisDialType.value = false;
                    break;
                default:
                    break;
            }
        }   
        const getUserInfo = (data)=>{               
            let query = {
                userId:data.userid                   
            };
            proxy.$http.post(proxy.$server.getUserInfoById,{userId:data.userid},{userId:data.userid,token:data.accessToken}).then(res=>{
                if(res.status==200){
                    if(res.data.status==200){
                        let contents = res.data.content;
                        if(contents.expertplanUser){
                            SetCookies('userRoleType',JSON.stringify(contents.expertplanUser.roleType))
                            if(contents.expertplanUser.roleType==1||contents.expertplanUser.roleType==2){
                                if(loginDialType.value){
                                    loginDialType.value = false;
                                    setTimeout(() => {
                                        router.push({
                                            path:'/tips'
                                        })                                        
                                    },100)
                                }else{
                                    router.push({
                                        path:'/tips'
                                    })                                    
                                }
                            }
                        }
                        geTcourseList(data.userid);
                    }
                }
            }).catch(()=>{})            
        }
        //在Appnei
        const isInApp = ()=>{
                if(!userData.value.accessToken){
                    let cellphone = window.sessionStorage.getItem('cellphone');
                    let userId = Number(window.sessionStorage.getItem('userId'))==-1?'':window.sessionStorage.getItem('userId');
                    let token = window.sessionStorage.getItem('token');   
                    userData.value.accessToken = token||''; 
                    userData.value.userid = userId; 
                    userData.value.cellphone = cellphone||'';        
                }
        }   
        const isWifi=()=>{
            try {
                let wifi = true
                let ua = window.navigator.userAgent
                let con = window.navigator.connection
                    // 如果是微信
                if (/MicroMessenger/.test(ua)) {
                    if (ua.indexOf('WIFI') >= 0) {
                        return true;
                    } else {
                        wifi = false
                    }
                    // 如果支持navigator.connection
                } else if (con) {
                    let network = con.type
                    if (network !== 'wifi' && network !== '2' && network !== 'unknown') {
                        wifi = false
                    }
                }
                return wifi
            } catch (e) {
                return false
            }
        }       
        //判断用户是否登录
        const islogins = ()=>{
            //判断是否保存了当前缓存数据；
            if(iswxs()){
                const uInfo = GetCookies('uInfo')
                if(uInfo){
                    userData.value.accessToken = JSON.parse(uInfo).accessToken;
                    userData.value.nickname = JSON.parse(uInfo).nickname;
                    userData.value.avatar = JSON.parse(uInfo).avatar;
                    userData.value.userid = JSON.parse(uInfo).userid;
                    userData.value.cellphone = JSON.parse(uInfo).cellphone;
                }
            }
            // else{
            //     // isInApp();
            // }
            if(userData.value.accessToken){
                loginState.value = true;
                getUserInfo(userData.value);	
            }else{
                loginState.value = false;
            }            
        }     
        const expertplanShareUserId = ()=>{
            let parems = url_expertplanShareUser(window.location.href,'expertplanShareUser');
            if(parems.expertplanShareUser){
                SetCookies('expertplanShareUser',parems.expertplanShareUser);
            }else{
                SetCookies('expertplanShareUser','0');
            }
        }
        //通过Appid获取Openid;
        isWechatBrowser(appid,getQueryString);      
        //当传递的值发生变化时，provide也会触发；这是登陆页面显示
        provide('loginDialType',loginDialType);        //qunayisDialType
        provide('qunayisDialType',qunayisDialType);
        onMounted(()=>{
            loadScripts();
            islogins();
            geTcourseList();
            setTimeout(() => {
                expertplanShareUserId();
            },500)
        })
        return{
            //方法
            loginShow,
            islogins,
            goTo,
            closeEven,
            setPackUserEven,
            geTcourseList,
            sauFaNumber,
            qunayisDialEven,
            expertplanShareUserId,
            //属性
            courseListData,
            loginDialType,
            qunayisDialType,
            overflowtype,
            userData,
            loadScriptFlag,
            loginState
        }
  }
}
</script>
<style lang="less">
    .index{
      padding: 0.3rem;
      .header{
          position: relative;
          img{
            display:block;
            width:100%;
            height: 2.66rem;
          }
          margin-bottom: 0.4rem;
          .headerDiv{
            position: absolute;
            height: 0.6rem;
            width: 1.5rem;
            top: 0.33rem;
            right: 0.3rem;
          }
      }
      .content{
          border-radius: 0.12rem;
          overflow: hidden;
          .topBox{
            background: linear-gradient(#E66F6F, #C93C3C); 
            height: 0.68rem;
            overflow:auto;
            text-align: center;
            line-height:0.68rem;
            color: #fff;
            font-size: 0.28rem;
          }
          .listBox2{
            height:calc(100vh - 4.34rem);
            font-size: 0.3rem;
            padding: 0.3rem 0;
          }
          .listBox{
            height:calc(100vh - 4.34rem);
            overflow-y: scroll;
            .li:nth-child(1){
              margin-top: 0.2rem;
            }
            .li{
              height: 2.12rem;
              padding-left: 0.2rem;
              padding-top: 0.2rem;
              background-color: #fff;
              margin-bottom: 0.26rem;
              .leftLi{
                float: left;
                width:3.08rem;
                height: 1.72rem;
                overflow: hidden;
                border-top-left-radius: 0.12rem;
                border-bottom-left-radius: 0.12rem;
                position: relative;
                .img1{
                  width: 100%;
                  height: 100%;

                }
                .img2{
                    position: absolute;
                    bottom: 0.12rem;
                    right:0.12rem;
                    width: 0.52rem;
                    height: 0.32rem;
                }
              }
              .rightLi{
                  float: left;
                  width: 3rem;
                  height: 1.72rem;
                  text-align: left;
                  margin-left: 0.2rem;
                  position: relative;
                  .div0{
                        p{
                            word-wrap: break-word;
                            font-size: 0.3rem;
                            font-weight: 700;
                            letter-spacing: 0;
                            overflow: hidden;
                            display: -webkit-box;
                            text-overflow: ellipsis;
                            -webkit-line-clamp: 2;  /*要显示的行数*/
                            -webkit-box-orient: vertical;                         
                        }
                        .div1{
                            font-size: 0.24rem;
                            display:flex;
                            flex-direction:row;
                            align-items:center;
                            justify-content:flex-start;
                            color: #999999;
                            margin-top: 0.1rem;
                            img{
                                width: 0.28rem;
                                height: 0.24rem;
                                display:block;
                            }
                        }
                  }
                  .div2{
                      position: absolute;
                      bottom:0;
                      left:0;
                      display:flex;
                      flex-direction: row;
                      justify-content:space-between;
                      align-items: center;
                      width: 100%;
                      >div:nth-child(1){
                        color: #999999;
                        font-size: 0.22rem;
                      }
                      >div:nth-child(2){
                        color: #C30D23;
                        font-weight: 700;
                        font-size:0.28rem;
                      }
                  }
              }
            }
        }
      }
    }
    .overflowScroll{
         overflow-y: scroll;
    }
    .overflowHidden{
         overflow-y:hidden;
    }
</style>
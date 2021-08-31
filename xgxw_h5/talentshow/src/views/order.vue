<template>
  <div class="order">
        <div class="vants-icon">
            <div class="iconBox">
                <van-icon name="arrow-left" size="0.4rem" @click="gotopart"/>
            </div>
            <div class="icontext">订单结算</div>
        </div>
        <div class="oneBox">
            <div class="oneBox_1">
                    <img :src='courseOlderData.courseSurfacePlot'/>
            </div>
            <div class="oneBox_2">
                    <p>{{courseOlderData.courseTitle}}</p>
                    <p>{{courseOlderData.courseSellingPrice}}夫子币</p>
            </div>
        </div>
        <div class="twoBox">
            <div class="twoBox_1">
                    <div class="one">优惠券</div>
                    <div class="two" @click="couponsIconType=!couponsIconType">
                        <div>{{courseOlderData.userCouponsNum}}张可用</div>
                        <img src='../assets/images/daren_6.png' v-if='!couponsIconType'/>
                        <img src='../assets/images/daren_7.png' v-else />
                    </div>
            </div>
            <div class="twoBox_2" v-show='couponsIconType'>
                <div class="twoLiBox">
                    <div class="oneli" v-for="(item,index) in couponsData" :key="index" @click="selectCoupons(item,index+1)">
                        <div v-if="item.couponType==3" class="libox cssOne">
                            <img class="img1" :src="item.couponType==2?cnnpansOne:cnnpansTwo" />
                            <img class="img2" v-show="selectIndex==(index+1)" src='../assets/images/daren_10.png' />
                            <div class="content">
                                <div class="divs">
                                    <!-- item.couponsTitle -->
                                    <p class="p1" v-if="item.couponType==1||item.couponType==4||item.couponType==5">无门槛优惠券</p>
                                    <p class="p1" v-if="item.couponType==2">
                                        满{{item.couponsMinAmount}}减{{item.reducedPrice}}
                                    </p>
                                    <p class="p1" v-if="item.couponType==3">无门槛优惠券</p>
                                    <div class="div1">
                                        <div class="tit1">{{item.reducedPrice}}元</div>
                                        <div style="text-align:left;">
                                            <p class="p3">{{repsEven(item.beginAtStr)}}<span style="padding:0 0.1rem;">-</span>{{repsEven(item.endAtStr)}}</p>
                                            <div class="tit2">{{item.couponCode}}</div>
                                        </div>
                                    </div>
                                    <p class="p2">{{item.useCourseTitle}}</p>
                                </div>
                            </div>
                        </div>                        
                        <div v-else class="libox cssTwo">
                            <img class="img1" :src="item.couponType==2?cnnpansOne:cnnpansTwo" />
                            <img class="img2" v-show="selectIndex==(index+1)" src='../assets/images/daren_10.png' />
                            <div class="content">
                                <div class="divs">
                                    <!-- item.couponsTitle -->
                                    <p class="p1" v-if="item.couponType==1||item.couponType==4||item.couponType==5">无门槛优惠券</p>
                                    <p class="p1" v-if="item.couponType==2">
                                        满{{item.couponsMinAmount}}减{{item.reducedPrice}}
                                    </p>
                                    <p class="p1" v-if="item.couponType==3">无门槛优惠券</p>
                                    <div class="div1">
                                        <div class="tit1">{{item.reducedPrice}}元</div>
                                        <div class="tit2">{{item.couponCode}}</div>
                                    </div>
                                    <p class="p2">有效期：{{repsEven(item.beginAtStr)}}<span style="padding:0 0.1rem;">至</span>{{repsEven(item.endAtStr)}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="threeBox" v-show="isjifenType?true:false">
            <div class="tops">
                <div class="threeBox_1">
                    <div class="one_1">积分</div>
                    <img class="one_2" src='../assets/images/daren_11.png' />
                    <div class="one_3">共有{{courseOlderData.availableNum}}积分，有{{courseOlderData.availableNum}}积分可用</div>
                </div>
                <van-switch v-model="switcChecked" @change="switchChange" :disabled="isEnableType" size='20'/>                
            </div>
            <div class="bottoms" v-show="switcChecked">
                <!-- <van-field class='telCss' :border='false' @input='inputMoneyEven' label-width='0.6rem' v-model="integral" maxlength='11' placeholder="积分" type="number" label="使用" /> -->
                <div class='moneyTitles'>
                    使用
                </div>
                <div style='width:2rem;'>
                    <van-dropdown-menu :overlay="false" style='width:100%;'>
                        <van-dropdown-item v-model="integral" :options="option1" @change="inputMoneyEven"/>
                    </van-dropdown-menu>
                </div>
                <div class="bot_1">积分,</div>
                <div class="bot_2">抵{{toCalculateMoney}}元</div>
            </div>
        </div>
        <div class="fourBox">
            <div class="fourBox_1">支付方式</div>
            <div class="fourBox_2">
                <div class="one_1">
                    <span>余额:</span>
                    <span>{{courseOlderData.coinBalance}}夫子币</span>
                    <span v-if="Number(courseOlderData.coinBalance)<Number(courseOlderData.courseSellingPrice)">
                        (余额不足)
                    </span> 
                </div>
                <div class="two_1">
                    <!-- <div>充值</div> -->
                    <img src="../assets/images/daren_13.png" v-if="payTyleNum==1"/>
                    <img src="../assets/images/daren_12.png" v-else @click='selectPay(1)'/>
                </div>
            </div>
            <div class="fourBox_3">
                <div class="one_1">
                    <img src='../assets/images/weixin.png'/>
                    <div>微信支付</div>
                </div>
                <div class="two_1">
                    <!-- <div>充值</div> -->
                    <img src="../assets/images/daren_13.png" v-if="payTyleNum==5"/>
                    <img src="../assets/images/daren_12.png" v-else @click='selectPay(5)'/>
                </div>
            </div>
        </div>
        <div class="fiveBox" @click='payCourseMoney'>
            <p><span v-if="payTyleNum==5">¥</span>{{paysMoney}}<span v-if="payTyleNum==1">夫子币</span>／确认支付</p>
            <p v-show="(Number(userRoleType)==1||Number(userRoleType)==2)?true:false">本单优惠{{couponsMoney}}夫子币</p>
        </div>
  </div>
</template>
<script>
import {onMounted,ref,reactive,provide,inject,computed,getCurrentInstance,watch} from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { Toast } from 'vant';
import { GetCookies,SetCookies } from '@/utils/setCookies'
import darenCnnpansOne from '@/assets/images/daren_9.png'
import darenCnnpansTwo from '@/assets/images/daren_8.png'
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
    components: {},
    setup(){   
        const {proxy} = getCurrentInstance();
        const route = useRoute();
        const router = useRouter();
        const courseDetailsId = ref(0);//课程id
        const integral = ref(0);//积分
        const switcChecked = ref(false);   
        const payTyleNum = ref(5); //默认微信
        const selectPayType = ref(5);//默认微信
        const toCalculateMoney = ref(0);//计算积分抵扣的钱
        const courseOlderData = ref({}); //课程详情 
        const couponsData = ref([]);//优惠券列表
        const selectIndex = ref(-1);//选中优惠卷下标
        const selectDate = ref({});//选中优惠券
        const couponsMoney = ref(0);//优惠价格
        const paysMoney = ref(0);//支付价格
        const linTimeMoneys =  ref(0);//选中优惠券后的临时支付价格
        const linTimecouponsMoneys =  ref(0);//选中优惠券后的临时优惠价格
        const isEnableType = ref(false);
        const couponsIconType = ref(false);
        const selectCouponsIsOkOrNo = ref(-1);//检查优惠券选中开关的状态id是不是点击的同一个的优惠券；
        const linTimeMoneysOne = ref(0);//一半钱的临时值
        const cnnpansOne = ref(darenCnnpansOne);
        const cnnpansTwo = ref(darenCnnpansTwo);
        const isjifenType = ref(true);//可不可以显示积分；
        const couponsMoneyNum = ref(0);//优惠卷选中的金额；
        const selectCouponsData = ref({});
        const shareUserId = ref(0);//分享id
        const userData =ref({
              accessToken: '',
              nickname: '',
              avatar:'',
              userid:'',
              cellphone:'',
          });
          const option1 = ref([]);
        const userRoleType =ref(-1);
        //用户信息保存
        const setuserData = ()=>{
            const uInfo = GetCookies('uInfo')
            userData.value.accessToken = JSON.parse(uInfo).accessToken;
            userData.value.nickname = JSON.parse(uInfo).nickname;
            userData.value.avatar = JSON.parse(uInfo).avatar;
            userData.value.userid = JSON.parse(uInfo).userid;
            userData.value.cellphone = JSON.parse(uInfo).cellphone;        
            courseDetailsId.value = route.query.curseId;
            userRoleType.value = GetCookies('userRoleType');
            shareUserId.value = GetCookies('expertplanShareUser');
            console.log("shareUserId",shareUserId.value)
        }
        const gotopart = ()=>{
            router.push({
                    path:'/courseDetail',
                    query:{
                        id:Number(courseDetailsId.value)
                    }
            })            
        }
        const selectCoupons = (data,i)=>{
            //有积分的时候
            if(isjifenType.value&&switcChecked.value){
                //积分可以抵消的价格；proportion:比例
                let moneyTwo = parseInt(Number(courseOlderData.value.availableNum)/Number(courseOlderData.value.proportion));
                option1.value = [];
                if(Number(selectCouponsIsOkOrNo.value)==-1){
                    selectCouponsIsOkOrNo.value = Number(data.id);
                    //不是通用优惠券
                    selectIndex.value = i;
                    if(data.couponType!=1){
                        //优惠金额小于售价
                        if(Number(data.reducedPrice)<Number(courseOlderData.value.courseSellingPrice)){
                            //积分最多可以使用优惠后售价的一半；
                            couponsMoneyNum.value = data.reducedPrice;
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;                                
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyOne*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;
                            }
                                couponsMoney.value = Number(data.reducedPrice)+integral.value/Number(courseOlderData.value.proportion);
                                paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                        //优惠金额大于售价
                        }else{
                            couponsMoneyNum.value = 0;
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                            for (let index = 0; index <= moneyOne; index++) {
                                option1.value.push(
                                        { text: '0', value: 0 }
                                );
                            }   
                            integral.value = moneyOne*Number(courseOlderData.value.proportion); 
                            toCalculateMoney.value = moneyOne;
                            couponsMoney.value = moneyOne;        
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                            Toast('售价小于优惠价格，无法使用优惠券。只能使用积分');
                        }
                    }else{//是通用优惠券
                        //如果优惠券额度大于售价，积分就不可食用
                        if(Number(courseOlderData.value.courseSellingPrice)<Number(data.reducedPrice)){                        
                            option1.value.push(
                                    { text: '0', value: 0 }
                            );     
                            couponsMoneyNum.value = Number(courseOlderData.value.courseSellingPrice);                     
                            integral.value = 0;
                            toCalculateMoney.value = 0;
                            couponsMoney.value = Number(courseOlderData.value.courseSellingPrice); 
                            paysMoney.value = 0;
                        }else{
                            couponsMoneyNum.value = Number(data.reducedPrice);   
                            //积分最多可以使用优惠后售价的一半；
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyOne*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;
                            }
                                toCalculateMoney.value = moneyOne;
                                couponsMoney.value = Number(data.reducedPrice)+integral.value/Number(courseOlderData.value.proportion);
                                paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                            
                        }             
                    }         
                }else if(Number(selectCouponsIsOkOrNo.value) == Number(data.id)){
                    couponsMoneyNum.value = 0; 
                    selectCouponsIsOkOrNo.value=-1;
                    selectIndex.value = -1;
                    let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                    if(moneyTwo<moneyOne){
                        for (let index = 0; index <= moneyTwo; index++) {
                            option1.value.push(
                                    { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                            );
                        }
                        integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                        toCalculateMoney.value = moneyTwo;
                    }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                        for (let index = 0; index <= moneyOne; index++) {
                            option1.value.push(
                                    { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                            );
                        }
                        integral.value = moneyOne*Number(courseOlderData.value.proportion);
                        toCalculateMoney.value = moneyOne;
                    }   
                    couponsMoney.value = integral.value/Number(courseOlderData.value.proportion);            
                    paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));

                }else{
                    selectIndex.value = i;
                    selectCouponsIsOkOrNo.value = Number(data.id);
                    //不是通用优惠券
                    if(data.couponType!=1){
                        //优惠金额小于售价
                        if(Number(data.reducedPrice)<Number(courseOlderData.value.courseSellingPrice)){
                            couponsMoneyNum.value = Number(data.reducedPrice); 
                            //积分最多可以使用优惠后售价的一半；
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyOne*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;
                            }
                                couponsMoney.value = Number(data.reducedPrice)+integral.value/Number(courseOlderData.value.proportion);
                                paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                        //优惠金额大于售价
                        }else{
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                            for (let index = 0; index <= moneyOne; index++) {
                                option1.value.push(
                                        { text: '0', value: 0 }
                                );
                            }  
                            couponsMoneyNum.value = 0; 
                            integral.value = moneyOne*Number(courseOlderData.value.proportion); 
                            toCalculateMoney.value = moneyOne;
                            couponsMoney.value = moneyOne;        
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));                        
                            Toast('售价小于优惠价格，无法使用优惠券。只能使用积分');
                        }
                    }else{//是通用优惠券
                        selectIndex.value = i;
                        //如果优惠券额度大于售价，积分就不可食用
                        if(Number(courseOlderData.value.courseSellingPrice)<Number(data.reducedPrice)){
                            option1.value.push(
                                    { text: '0', value: 0 }
                            );                         
                            integral.value = 0;
                            toCalculateMoney.value = 0;
                            couponsMoneyNum.value = Number(courseOlderData.value.courseSellingPrice); 
                            couponsMoney.value = Number(courseOlderData.value.courseSellingPrice); 
                            paysMoney.value = 0;
                        }else{
                            //积分最多可以使用优惠后售价的一半；
                            couponsMoneyNum.value = Number(data.reducedPrice); 
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = Number(moneyOne)*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = Number(moneyOne)*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;
                            }
                                couponsMoney.value = Number(data.reducedPrice)+integral.value/Number(courseOlderData.value.proportion);
                                paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                        }             
                    }                         
                }
            }else{
                //没有积分去权利的时候
                integral.value = 0;
                toCalculateMoney.value = 0;
                option1.value = [];
                if(Number(selectCouponsIsOkOrNo.value)==-1){
                    selectCouponsIsOkOrNo.value = Number(data.id);
                    //不是通用优惠券
                    selectIndex.value = i;
                    if(data.couponType!=1){
                        //优惠金额小于售价
                        if(Number(data.reducedPrice)<Number(courseOlderData.value.courseSellingPrice)){
                            couponsMoneyNum.value = data.reducedPrice;
                            couponsMoney.value = Number(data.reducedPrice)
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/100).toFixed(2));
                        //优惠金额大于售价
                        }else{
                            couponsMoneyNum.value = 0;   
                            couponsMoney.value = 0;        
                            paysMoney.value = Number(courseOlderData.value.courseSellingPrice);
                            Toast('售价小于优惠价格，无法使用优惠券。只能使用积分');
                        }
                    }else{//是通用优惠券
                        //如果优惠券额度大于售价，积分就不可食用
                        if(Number(courseOlderData.value.courseSellingPrice)<Number(data.reducedPrice)){                            
                            couponsMoneyNum.value = Number(courseOlderData.value.courseSellingPrice);                     
                            couponsMoney.value = Number(courseOlderData.value.courseSellingPrice); 
                            paysMoney.value = 0;
                        }else{
                            couponsMoneyNum.value = Number(data.reducedPrice);   
                            couponsMoney.value = Number(data.reducedPrice)
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/100).toFixed(2));
                        }             
                    }         
                }else if(Number(selectCouponsIsOkOrNo.value) == Number(data.id)){
                    couponsMoneyNum.value = 0; 
                    selectCouponsIsOkOrNo.value=-1;
                    selectIndex.value = -1; 
                    couponsMoney.value = 0;            
                    paysMoney.value = Number(courseOlderData.value.courseSellingPrice);

                }else{
                    selectIndex.value = i;
                    selectCouponsIsOkOrNo.value = Number(data.id);
                    //不是通用优惠券
                    if(data.couponType!=1){
                        //优惠金额小于售价
                        if(Number(data.reducedPrice)<Number(courseOlderData.value.courseSellingPrice)){
                            couponsMoneyNum.value =  Number(data.reducedPrice);
                            couponsMoney.value = Number(data.reducedPrice)
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/100).toFixed(2));
                        //优惠金额大于售价
                        }else{
                            couponsMoneyNum.value = 0;   
                            couponsMoney.value = 0;        
                            paysMoney.value = Number(courseOlderData.value.courseSellingPrice);                      
                            Toast('售价小于优惠价格，无法使用优惠券。只能使用积分');
                        }
                    }else{//是通用优惠券
                        selectIndex.value = i;
                        //如果优惠券额度大于售价，积分就不可食用
                        if(Number(courseOlderData.value.courseSellingPrice)<Number(data.reducedPrice)){
                            couponsMoneyNum.value = Number(courseOlderData.value.courseSellingPrice);                     
                            couponsMoney.value = Number(courseOlderData.value.courseSellingPrice); 
                            paysMoney.value = 0;
                        }else{
                            couponsMoneyNum.value = Number(data.reducedPrice);   
                            couponsMoney.value = Number(data.reducedPrice)
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(data.reducedPrice)*100)/100).toFixed(2));
                        }             
                    }                         
                }
            }
            selectCouponsData.value = data;
            linTimecouponsMoneys.value = couponsMoney.value;
            linTimeMoneys.value = paysMoney.value;
        }
        const repsEven = (data)=>{
            return data.replace(/-/g, '\.');
        }
        const selectPay = (val)=>{
            payTyleNum.value = val;
            selectPayType.value = val;
        }
        const payCourseMoney = ()=>{
                // const openId = GetCookies('openId');
                const openId = localStorage.getItem('openId');
				var query = {
					userId:userData.value.userid,
                    courseId:Number(courseDetailsId.value),// 课程id
                    paymentType:selectPayType.value,
                    registerSource:3,
                    integralNum:Number(integral.value),
                    userCouponsId:selectCouponsIsOkOrNo.value!=-1?selectCouponsIsOkOrNo.value:'',
                    openId:openId,
                    isExpertplan:1
                }
                if(shareUserId.value){
                    query.expertplanShareUser = shareUserId.value;
                }
                proxy.$http.post(proxy.$server.buyCourse,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                    if(res.status==200){
                        if(res.data.status==200){
                            let data = res.data.content.wechatInfo;
                            if(JSON.stringify(data)=='{}'){
                                Toast('支付成功~');
                                setTimeout(() => {
                                    router.push({
                                        path:'/tips'
                                    })                                     
                                }, 2500);
                            }else{
                                StartWeiXinPay(res.data.content.wechatInfo);
                            }
                        }else{
                            Toast(res.data.message);
                        }                          
                    }
                }) 
            }
			//监测是不是在微信内
			const StartWeiXinPay=(pay_params)=>{
				if (typeof WeixinJSBridge === 'undefined') {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady(pay_params), false)
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady(pay_params))
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady(pay_params))
					}
				} else {
					onBridgeReady(pay_params)
				}
			}
			//调用微信支付
			const onBridgeReady = (data,self)=>{
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId":data['appid'],     //公众号名称，由商户传入
						"timeStamp":data['timestamp'],         //时间戳，自1970年以来的秒数
						"nonceStr":data['nonce_str'], //随机串
						"package":'prepay_id'+'='+data['prepay_id'],
						"signType":data['sign_type'],         //微信签名方式：
						"paySign":data['sign'] //微信签名
					},
					(res)=>{
						if (res.err_msg == 'get_brand_wcpay_request:ok') {
                            router.push({
                                path:'/tips'
                            })                           
						} else {
							console.log('支付失败');
						}
					}
				)
			}

        const inputMoneyEven = (data)=>{
            console.log('data',data)
            if(linTimecouponsMoneys.value>0){
                if(selectIndex.value==-1){
                    toCalculateMoney.value = Number(data)/courseOlderData.value.proportion;
                    paysMoney.value = Number((((courseOlderData.value.courseSellingPrice*100)-Number(data)/courseOlderData.value.proportion*100)/100).toFixed(2));
                    couponsMoney.value = parseInt(Number(data)/courseOlderData.value.proportion*100/100); 
                }else{
                    toCalculateMoney.value = Number(data)/courseOlderData.value.proportion;
                    paysMoney.value = Number((((courseOlderData.value.courseSellingPrice*100)-Number(data)/courseOlderData.value.proportion*100-Number(couponsMoneyNum.value*100))/100).toFixed(2));
                    couponsMoney.value = parseInt(((couponsMoneyNum.value*100)+Number(data)/courseOlderData.value.proportion*100)/100); 
                }
            }else{
                toCalculateMoney.value = Number(data)/courseOlderData.value.proportion;
                paysMoney.value = Number((((courseOlderData.value.courseSellingPrice*100)-Number(data)/courseOlderData.value.proportion*100)/100).toFixed(2));
                couponsMoney.value =toCalculateMoney.value; 
            }
        }
        //获取优惠券详情
        const getCouponsInfo =()=>{
                    let query = {
                        courseId:Number(courseDetailsId.value),
                        userId:userData.value.userid,
                        isExpertplan:1
                    }     
            proxy.$http.post(proxy.$server.getUserCouponsListForBuyCourse,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){
                    if(res.data.status==200){
                        couponsData.value = res.data.content;     
                        // couponsData.value = [res.data.content[0]];                          
                    }                           
                }
            })         
        }
        const switchChange = (val)=>{
            option1.value=[];
            if(!val){
                integral.value = 0;
                toCalculateMoney.value = 0;
                paysMoney.value = Number((((courseOlderData.value.courseSellingPrice*100)-Number(couponsMoneyNum.value)*100)/100).toFixed(2));
                couponsMoney.value =Number(couponsMoneyNum.value)||0;                 
            }else{
                //积分可以最多换取的金额；
                let moneyTwo = parseInt(Number(courseOlderData.value.availableNum)/Number(courseOlderData.value.proportion));
                //判断有没有选优惠券
                if(selectIndex.value==-1){
                    //优惠券优惠的价格
                    couponsMoneyNum.value = 0; 
                    selectCouponsIsOkOrNo.value=-1;
                    let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                    console.log("moneyOne",moneyOne)
                    console.log("moneyOne",moneyOne)
                    if(moneyTwo<moneyOne){
                        for (let index = 0; index <= moneyTwo; index++) {
                            option1.value.push(
                                    { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                            );
                        }
                        integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                        toCalculateMoney.value = moneyTwo;
                    }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                        for (let index = 0; index <= moneyOne; index++) {
                            option1.value.push(
                                    { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                            );
                        }
                        integral.value = moneyOne*Number(courseOlderData.value.proportion);
                        toCalculateMoney.value = moneyOne;
                    }   
                    couponsMoney.value = integral.value/Number(courseOlderData.value.proportion);            
                    paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));                    
                }else{
                    //选中的优惠券信息
                    let couponsDataVal = selectCouponsData.value;
                    //不是通用优惠券
                    if(couponsDataVal.couponType!=1){
                        //优惠金额小于售价
                        if(Number(couponsDataVal.reducedPrice)<Number(courseOlderData.value.courseSellingPrice)){
                            // couponsMoneyNum.value = couponsDataVal.reducedPrice;
                            //积分最多可以使用优惠后售价的一半；
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(couponsDataVal.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyOne*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;
                            }
                            couponsMoney.value = Number(couponsDataVal.reducedPrice)+integral.value/Number(courseOlderData.value.proportion);
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(couponsDataVal.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                        //优惠金额大于售价
                        }else{
                            // couponsMoneyNum.value = 0;
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                            for (let index = 0; index <= moneyOne; index++) {
                                option1.value.push(
                                        { text: '0', value: 0 }
                                );
                            }   
                            integral.value = moneyOne*Number(courseOlderData.value.proportion); 
                            couponsMoney.value = moneyOne;      
                            toCalculateMoney.value = 0;  
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                            Toast('售价小于优惠价格，无法使用优惠券。只能使用积分');
                        }
                    }else{//是通用优惠券
                        //如果优惠券额度大于售价，积分就不可食用
                        if(Number(courseOlderData.value.courseSellingPrice)<Number(couponsDataVal.reducedPrice)){                        
                            option1.value.push(
                                    { text: '0', value: 0 }
                            );     
                            couponsMoneyNum.value = Number(courseOlderData.value.courseSellingPrice);                     
                            integral.value = 0;
                            couponsMoney.value = Number(courseOlderData.value.courseSellingPrice); 
                            paysMoney.value = 0;
                            toCalculateMoney.value = 0;
                        }else{
                            couponsMoneyNum.value = Number(couponsDataVal.reducedPrice);   
                            //积分最多可以使用优惠后售价的一半；
                            let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100-Number(couponsDataVal.reducedPrice)*100)/2/100);
                            //检查用户有多少积分，在创建可以使用的积分数组；100积分等于1元；
                            //积分抵扣数量不到售价优惠后的一半价格
                            if(moneyTwo<moneyOne){
                                for (let index = 0; index <= moneyTwo; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyTwo*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyTwo;  
                            }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                                for (let index = 0; index <= moneyOne; index++) {
                                    option1.value.push(
                                            { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                    );
                                }
                                integral.value = moneyOne*Number(courseOlderData.value.proportion);
                                toCalculateMoney.value = moneyOne;  
                            }
                            couponsMoney.value = Number(couponsDataVal.reducedPrice)+integral.value/Number(courseOlderData.value.proportion)*100;
                            paysMoney.value = Number(((Number(courseOlderData.value.courseSellingPrice)*100-Number(couponsDataVal.reducedPrice)*100-integral.value/Number(courseOlderData.value.proportion)*100)/100).toFixed(2));
                        }             
                    }  
                }
            }
        }  
        //获取订单详情
        const getOlderInfo =()=>{
            option1.value =[];
            let query = {
                courseId:Number(courseDetailsId.value),
                userId:userData.value.userid,
                isExpertplan:1
            }     
            proxy.$http.post(proxy.$server.getOrderForCourseInfo,query,{userId:userData.value.userid,token:userData.value.accessToken}).then(res=>{
                if(res.status==200){
                    if(res.data.status==200){
                        courseOlderData.value = res.data.content;
                        isjifenType.value = (courseOlderData.value.isEnable==1&&courseOlderData.value.isXgxCourse)?true:false;
                        paysMoney.value = Number(res.data.content.courseSellingPrice);
                        linTimeMoneysOne.value = Number(res.data.content.courseSellingPrice)*100/2;
                        // switcChecked.value = res.data.content.isEnable==1?true:false;
                        isEnableType.value = res.data.content.isEnable==1?false:true;
                        //初始化积分列表；
                        let moneyTwo = parseInt(Number(courseOlderData.value.availableNum)/Number(courseOlderData.value.proportion));
                        let moneyOne = parseInt((Number(courseOlderData.value.courseSellingPrice)*100)/2/100);
                        if(moneyTwo<moneyOne){
                            for (let index = 0; index <= moneyTwo; index++) {
                                option1.value.push(
                                        { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                );
                            }
                        }else{//积分抵扣数量多余售价优惠后的一半价格，就使用优惠后售价的一半;
                            for (let index = 0; index <= moneyOne; index++) {
                                option1.value.push(
                                        { text: Number(courseOlderData.value.proportion)*index+'', value: index*Number(courseOlderData.value.proportion) }
                                );
                            }
                        }                        

                    }                           
                }
            })         
        }
        onMounted(()=>{
            setuserData();
            getOlderInfo();
            getCouponsInfo();
        })
        return{
            inputMoneyEven,
            selectPay,
            selectCoupons,
            payCourseMoney,
            gotopart,
            switchChange,
            repsEven,
            //
            switcChecked,
            userData,
            couponsData,
            courseOlderData,
            integral,
            toCalculateMoney,
            payTyleNum,
            selectIndex,
            selectDate,
            paysMoney,
            couponsMoney,
            linTimeMoneys,
            linTimecouponsMoneys,
            linTimeMoneysOne,
            selectPayType,
            isEnableType,
            selectCouponsIsOkOrNo,
            couponsIconType,
            option1,
            userRoleType,
            cnnpansOne,
            cnnpansTwo,
            isjifenType            
        }
    }
}
</script>
<style>
.van-dropdown-menu .van-dropdown-item{
    width:2rem;
    max-height:4rem;
    left:1.6rem;
}
.van-dropdown-menu__title--down::after,.van-dropdown-menu__title::after{
    display:none;
}
.van-dropdown-menu .van-dropdown-menu__bar{
    height: 0.6rem;
}
</style>
<style lang="less">
.order{
    height: 100vh;
    padding: 0.2rem 0.3rem;
    overflow:auto;
    .vants-icon{    
        text-align: left;
        line-height: 0.4rem;
        background:#fff;
        position: fixed;
        height: 1rem;
        top: 0;
        left: 0;
        right: 0;
        .iconBox{
            position: absolute;
            z-index:2;
            left: 0;
            top: 0.2rem;
            i{
                display: block !important;
                padding:0.1rem 0.2rem;
            }
        }
        .icontext{
            position: absolute;
            text-align: center;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            font-size: 0.36rem;
            font-weight: 700;
            line-height:1rem;
        }
    }
    .oneBox{
        padding: 0.3rem;
        background: #fff;
        border-radius: 0.12rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 1rem;
        .oneBox_1{
            width: 2.64rem;
            height: 1.6rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .oneBox_2{
            height: 1.6rem;
            padding-left: 0.2rem;
            display: flex;
            flex-direction:column;
            justify-content: space-between;
            text-align: left;
            >p:nth-child(1){
                font-size: 0.3rem;
            }
            >p:nth-child(2){
                font-size: 0.28rem;
                color: #C30D23;
            }
        }
    }
    .twoBox{
        padding: 0.3rem;
        background: #fff;
        border-radius: 0.12rem;
        .twoBox_1{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.26rem;
            .one{
                font-size: 0.28rem;
            }
            .two{
                font-size: 0.28rem;
                color: #C30D23;
                display: flex;
                flex-direction: row;
                align-items: center;
                img{
                    width: 0.36rem;
                    height: 0.36rem;
                }
            }
        }
        .twoBox_2{
            // overflow-x: auto;
            // overflow-y: hidden;
            // white-space:nowrap;
            // width: 100%;
                &::-webkit-scrollbar{// 滚动条整体
                    background:none;
                }
                position:relative;
                overflow-x:auto;
                width:100%;
                margin:0 0;
                height: 1.55rem;
            .twoLiBox{
                position:absolute;
                left:0;
                top:0;
                display:flex;
                flex-wrap:nowrap;
                overflow-x:scroll;
                .oneli{
                    .cssOne{
                        .content{
                            .divs{
                                padding-top:0.1rem; 
                                .p1{
                                    font-size: 0.18rem;
                                    text-align:left;
                                    padding:0 0 0 1.3rem;
                                }
                                .div1{
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: flex-start;
                                    .tit1{
                                        font-size: 0.29rem;
                                        width: 1.3rem;
                                        text-align:left;
                                        padding: 0 0.1rem 0 0.2rem;
                                    }
                                    .tit2{
                                        margin-top: 0.04rem;
                                        font-size: 0.13rem;
                                        text-align:center;
                                    }
                                    .p3{
                                        margin-top: 0.04rem;
                                        font-size: 0.14rem;
                                    }
                                }
                                .p2{
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                    .cssTwo{
                        .content{
                            .divs{
                                padding-top:0.2rem; 
                                .p1{
                                    font-size: 0.18rem;
                                    text-align:left;
                                    padding:0 0 0 1.3rem;
                                }
                                .div1{
                                    display: flex;
                                    flex-direction: row;
                                    align-items: center;
                                    justify-content: flex-start;
                                    .tit1{
                                        font-size: 0.29rem;
                                        width: 1.3rem;
                                        text-align:left;
                                        padding: 0 0.1rem 0 0.2rem;
                                    }
                                    .tit2{
                                        font-size: 0.13rem;
                                        text-align:center;
                                    }
                                }
                            }
                        }                        
                    }
                    .libox{
                        width: 4rem;
                        height: 1.22rem;
                        position: relative;
                        // display: inline-block;
                        // float: left;
                        margin-right: 0.2rem;
                        text-align:center;
                        list-style:none;
                        .img1{
                            width: 100%;
                            height: 100%;
                        }
                        .img2{
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 0.45rem;
                            height: 0.45rem;
                            z-index: 2;
                        }
                        .content{
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            z-index: 1;
                            color: #fff;
                            .divs{
                                width: 4rem;
                                height: 1.22rem;
                                position: relative;
                                padding-left:0.1rem;
                                .p2{
                                    font-size: 0.14rem;
                                    position: absolute;
                                    bottom: 0.04rem;
                                    left: 0;
                                    right: 0;
                                    text-align:left;
                                    padding: 0 0 0 0.3rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .threeBox{
        padding: 0.3rem;
        background: #fff;
        border-radius: 0.12rem;
        margin-top: 0.2rem;
        .tops{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:space-between;
            margin-bottom: 0.2rem;
            .threeBox_1{
                font-size: 0.28rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                .one_2{
                    display: block;
                    width: 0.4rem;
                    height: 0.4rem;
                }
                .one_3{
                    color: #999;
                    font-size: 0.24rem;
                }
            }
        }
        .bottoms{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            .moneyTitles{
                width:1rem;
                font-size:0.3rem;
                text-align:center;
            }
            .bot_1{
                font-size: 0.28rem;
                margin-left: 0.2rem;
            }
            .bot_2{
                font-size: 0.28rem;
                color: #C30D23;
            }
        }
    }
    .fourBox{
        padding: 0.3rem;
        background: #fff;
        border-radius: 0.12rem;
        margin-top: 0.2rem;
        .fourBox_1{
            font-size: 0.3rem;
            margin-bottom: 0.3rem;
            text-align: left;
            font-weight: 700;
        }
        .fourBox_2{
            font-size: 0.28rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:space-between;
            padding: 0.3rem 0;
            border-bottom: 0.02rem solid #f4f4f4;
            .two_1{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                img{
                    display: block;
                    width:0.5rem;
                    height: 0.5rem;
                }
            }
        }
        .fourBox_3{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content:space-between;
            font-size: 0.28rem;
            padding: 0.3rem 0;
            .one_1{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                img{
                    width: 0.56rem;
                    height: 0.56rem;
                    display: block;
                    margin-right: 0.1rem;
                }
            }
            .two_1{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                img{
                    display: block;
                    width:0.5rem;
                    height: 0.5rem;
                }
            }
        }
    }
    .fiveBox{
        width: 6.9rem;
        padding: 0.2rem 0;
        margin-top: 0.8rem;
        color: #fff;
        border-radius: 0.8rem;
        background:#C30D23;
        >p:nth-child(1){
            font-size: 0.28rem;
        }
        >p:nth-child(2){
            font-size: 0.2rem;
        }
    }
}
</style>

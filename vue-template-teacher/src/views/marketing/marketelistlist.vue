<template>
    <div>
        <el-row :gutter="20">
            <!-- v-if="flags.includes(items.code)" -->
            <el-col class="lMarginTop30" :span="6" v-for="(items,index) in typeList.filter(item=>item.show==true)" :key="index">
                <div class="typeStyle lSize18"  @click="$router.push(items.pathInfo)">
                {{items.name}}
                </div>
            </el-col>
        </el-row>                    
    </div>
</template>
<script>
import { getToken,setToken,removeToken} from '@/utils/auth';
export default {
    data(){                     
        return {
            flags:[],
            typeList:[
                {
                    name:'优惠券系统',
                    pathInfo:'/marketelist/coupon',
                    code:'market:coupon',
                },
                {
                    name:'活动优惠券系统',
                    pathInfo:'/marketelist/activity',
                    code:'market:activitycoupon',
                },
                // {
                //     name:'限时购/秒杀系统1',
                //     pathInfo:'/marketelist/timelimit',
                //     code:'market:limited',
                // },
                {
                    name:'限时购系统',
                    pathInfo:'/marketelist/timelimitNew',
                    code:'market:discounts',
                },
                // {
                //     name:'学习卡',
                //     pathInfo:'/marketelist/learningCard',
                //     code:'studyCard',
                // },
                {
                    name:'定制精品课系统',
                    pathInfo:'/marketelist/customLearnCard',
                    code:'market:studycard',
                },
                {
                    name:'佣金系统',
                    pathInfo:'/marketelist/commissionManage/commission',
                    code:'market:commission',
                },
                {
                    name:'好友邀请系统',
                    pathInfo:'/marketelist/friendinviteManage/invite',
                    code:'market:invitationfriend',
                },
                {
                    name:'邀请码系统',
                    pathInfo:'/marketelist/inviteQrCode/qrCode',
                    code:'market:invitationcode',
                },
                {
                    name:'拼团系统',
                    pathInfo:'/marketelist/assemble',
                    code:'market:assemble',
                },
                {
                    name:'会员卡系统',
                    pathInfo:'/marketelist/member/memberCard',
                    code:'market:member'
                },
                {
                    name:'定制会员系统',
                    pathInfo:'/marketelist/member/customizedCard',
                    code:'market:membermake'
                },
                {
                    name:'大客户免费课系统',
                    pathInfo:'/marketelist/member/keyAccountCard',
                    code:'market:customer'
                },
                {
                    name:'月度会员卡定制系统',
                    pathInfo:'/marketelist/member/unIconCardList',
                    code:'market:customer'
                },
                {
                    name:'活动学习卡系统',
                    pathInfo:'/marketelist/activitiesCard/activiesLearningCard',
                    code:'market:activitystudycard'
                }
            ]
        }
    },
    created(){
        this.typeList.forEach(item=>{
            item.show = this.$authJudge(item.code);
        })     
    },
    methods:{
    },
    components:{},
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../components/formSynthesisPlugin/my-component.css";
.typeStyle{
    width: 100%;
    height: 100px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 100px;
}
.typeStyle:hover{
    background-color:#ccc;
    color:#fff;
    cursor: pointer;
}
</style>



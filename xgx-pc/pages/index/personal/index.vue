<template>
    <div class="personal-page">
        <div class="container clearfix">
            <div class="menu">
                <LeftNative :routId="selectDivShow" :cssList="csslist" :valueList="currentVal" v-on:liSetDataToParents="ulGetDataForLi"></LeftNative>
            </div>
            <div class="child-page">
                <nuxt-child></nuxt-child>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import LeftNative from '~/components/LocalComponents/leftNative.vue'
import {mapState,mapActions} from 'vuex';
@Component({
    components:{LeftNative},
    computed:{
        ...mapState(['userData'])
    },
    methods:{
        ...mapActions(['setDetailStart']),
    }    
})
export default class Personal extends Vue{
    selectDivShow:number = 1;
    csslist:Object={
        childCss:'font-size: 18px; padding:20px 0;cursor: pointer;',
        parentCss:'text-align: center;',
        headLiCss:'font-size: 18px; padding:20px 0;color:#fff;background:#C30D23',
        headText:'个人中心',
        headShow:true,
        cssType:1
    };
    currentVal:Object[] = [
      {text:'个人资料',selectId:1},
      {text:'我的消息',selectId:2},
      {text:'意见反馈',selectId:3},
      {text:'我的账户',selectId:4},
      {text:'我的订单',selectId:5},
      {text:'我的优惠券',selectId:6}
    ];
    async ulGetDataForLi(index){
        this.selectDivShow=Number(index);
        switch (this.selectDivShow) {
            case 1:
                this.$router.push({path:'/personal/personalData', query:{selectId:index}})
                break;
            case 2:
                if(this.userData.cellphone){
                    this.$router.push({path:'/personal/personalList', query:{selectId:index}})
                }else{
                    this.goBindPhone()
                }
                break;
            case 3:
                if(this.userData.cellphone){
                    this.$router.push({path:'/personal/personalFeedback', query:{selectId:index}})
                }else{
                    this.goBindPhone()
                }
                break;
            case 4:
                if(this.userData.cellphone){
                    this.setDetailStart(1);
                    this.$router.push({path:'/personal/personalMyAccount', query:{selectId:index}})
                }else{
                    this.goBindPhone()
                }
                break;
            case 5:
                if(this.userData.cellphone){
                     this.$router.push({path:'/personal/personalMyOrder', query:{selectId:index}})
                }else{
                    this.goBindPhone()
                }
                break;
            case 6:
                if(this.userData.cellphone){
                    this.$router.push({path:'/personal/personalMyCoupon', query:{selectId:index}})
                }else{
                    this.goBindPhone()
                }
                break;
            default:
                break;
        }
    }
     /**
     * 去关联手机号
     */
    goBindPhone(){
        let url = this.$route.fullPath
        sessionStorage.setItem('redirectUrl',url)
        this.$router.push({
            path:'/auth/bindPhone'
        })
    }
}
</script>
<style lang="scss" scoped>
    .personal-page{
        padding: 30px 20px 50px 20px;
        background: #F3F5F7;
        .container{
            width: 1200px;
            margin: 0 auto;
            position: relative;
            min-height: 600px;
            .menu{
                float: left;
                width: 203px;
                margin-right: 30px;
                background: #fff;
                min-height: 300px;
            }
            .child-page{
                overflow: hidden;
                background: #fff;
                min-height: 600px;
                // position: relative;
            }
        }
    }
</style>

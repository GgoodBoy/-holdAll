<template>
    
</template>
<script lang="ts">
import { Component , Vue} from 'vue-property-decorator'
import {mapActions} from 'vuex'
const getQueryString = (key:string):string|null=>{
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
}
@Component({
    methods:{
        ...mapActions(['setUserData'])
    },
})
export default class Weibo extends Vue{
    head(){
        return{
            title:'第三方登录 | 学国学网'
        }
    }
    mounted(){
        let code = getQueryString('code')
        if(code){
            console.log(code)
            this.loginByThird(code)  
        }else{
            this.$router.replace('/auth/login')
        }
    }
    async loginByThird(code){
        let query = {
            code:code,
            type:2,
            redirectUri:window.location.origin+'/auth/weibo'
        }
        let res = await this.$axios.$post(this.$server.loginByThird,query)
        if(res.status==200){
            let userData = Object.assign({},res.content,{type:2})
            this.setUserData(userData)
            this.$setCookie('xgx_user',JSON.stringify(res.content));
            let {cellphone} = res.content;
            if(cellphone==''){
                this.$router.push('/auth/bindPhone')
            }else{
                let redirectUrl = sessionStorage.getItem('redirectUrl');
                if(redirectUrl){
                    sessionStorage.removeItem('redirectUrl');
                    this.$router.push(redirectUrl)
                }else{
                    this.$router.push('/home')
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>

</style>

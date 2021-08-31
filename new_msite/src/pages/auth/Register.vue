<template>
	<div>
		<commonPhone v-if="t==1" :classifyName="phoneTitle" :routerTitle="routerTitle" :t.sync="t" :phone.sync="phone"></commonPhone>
		<commonCode v-if="t==2" :classifyName="codeTitle" :routerTitle="routerTitle" :t.sync="t" :phone.sync="phone" :code.sync="code"></commonCode>
		<commonPassword v-if="t==3" :classifyName="passwordTitle" :routerTitle="routerTitle" :t.sync="t" :phone.sync="phone" :code.sync="code"></commonPassword>
	</div>
</template>
<script>
import commonPhone from "./commonPhone.vue"
import commonCode from "./commonCode.vue"
import commonPassword from "./commonPassword.vue"
export default {
	data(){
		return {
			t:1,
			routerTitle:'register',
			phoneTitle:"注册",
			codeTitle:'请输入验证码',
			passwordTitle:'设置密码',
			phone:'',
			code:''
		}
	},
	methods:{

	},
	components:{
		commonPhone,
		commonCode,
		commonPassword
	}
}

</script>

<style lang="scss" scoped>

</style>

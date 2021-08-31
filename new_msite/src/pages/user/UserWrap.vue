<template>
	<div>
		<commonHeader v-if="showHeader" :headerTitle="headerTitle"></commonHeader>
		<router-view/>
	</div>
</template>

<script>
import commonHeader from "../../components/commonHeader.vue"
export default {
	data(){
		return {

		}
	},
	methods:{

	},
	components: {
        commonHeader
    },
	computed:{
		headerTitle(){
			return this.$route.meta.headerTitle || '学国学网';
		},
		showHeader(){
			return this.$route.meta.headerTitle ? true : false;
		}
	},
	created(){
		
	},
}

</script>

<style lang="scss" scoped>

</style>
<template>
	<div class="header-nav" :style="pageStyle">
		<Header :name="Title"/>
		<!-- <van-nav-bar
			:style="{top:hasOpenApp?'0.98rem':'0px'}"
		  	:title="Title"
		  	@click-left="onClickLeft">
			<img class="go-back" :src="'./static/img/common/go-left.png'" alt="" slot="left"/>
		</van-nav-bar> -->
		<div class="course-filter" v-if="courseFilter.length>0">
			<div class="course-filter-tabs" >
				<div class="item" v-for="(item,index) in courseFilter" :key="index" :class="item.active?'active':''" @click="chooseFilter(item)">
					<p>{{item.title}}</p>
					<i></i>
				</div>
			</div>
			<div class="condition-list" :class="courseFilterOpen?'open':''">
				<div class="condition-list-item" v-for="(item,index) in courseFilter" :key="index" :class="{'active':item.active,'hidden':item.hidden}">
					<p v-for="(option,i) in item.list" :key="i" :class="option.active?'active':''" @click="chooseCondition(item,option,i)">{{option.label}}</p>
				</div>
			</div>
			<div class="shade" :style="shadeStyle" :class="courseFilterOpen?'show':''" @click="closeCourseFilter"></div>
		</div>
		<van-list
			class="comment-list"
			:class="courseFilter.length>0?'has-padding':''"
          	v-model="loading"
          	:finished="finished"
          	@load="onLoad"
        >
			<commonCourse v-for="(item,i) in courseList"
						  :key="i"
						  :isnormal="isnormal"
						  :data-delay="`${i*100}`"
						  :courseItem="item">
			</commonCourse>
			<!-- <transition-group 
				v-bind:css="false"
				v-on:before-enter="beforeEnter" 
				v-on:enter="enter"
				v-on:after-enter="afterEnter">
			
			</transition-group> -->
			<div class="empty" v-show="courseList.length==0&&finished">
				<img :src="img"/>
				<p>没找到你想要的内容~</p>
			</div>
		</van-list>
	</div>
</template>

<script>
import {mapState} from 'vuex'
import commonCourse from "@/components/commonCourse.vue"
import img from '@/assets/image/no_content.png'
import Header from '@/components/Header.vue'
export default {
	data(){
		return {
			Title:'全部课程',
			loading: false,
			finished: false,
			courseList:[],
			currentPage:0,
			lastPage:0,
			isnormal:false,//true 显示夫子币和免费；false 显示显示学习进度
			path:'',
			img:img,
			pageStyle:{},
			shadeStyle:{},
			priceRank:0,
			classifyType:'',
			classifyId:-1,
			courseFilter:[
				// {
				// 	title:'分类',
				// 	active:false,
				// 	hidden:true,
				// 	list:[
				// 		{label:'全部',value:'',active:true},
				// 		{label:'国学',value:'',active:false},
				// 	]
				// },
				// {
				// 	title:'价格',
				// 	active:false,
				// 	hidden:true,
				// 	list:[
				// 		{label:'全部',value:'',active:true},
				// 		{label:'价格升序',value:'',active:false},
				// 		{label:'价格降序',value:'',active:false},
				// 	]
				// }
			]
		}
	},
	computed:{
		...mapState(['hasOpenApp']),
		courseFilterOpen(){
			let flag = this.courseFilter.some(item=>item.hidden==false)
			if(flag){
				if(this.hasOpenApp){
					this.pageStyle = {
						'height':'calc(100vh - 0.98rem)',
						'overflow':'hidden'
					}
				}else{
					this.pageStyle = {
						'height':'100vh',
						'overflow':'hidden'
					}
				}
			}else{
				this.pageStyle = {}
			}
			return flag
		},
	},
	watch:{
		hasOpenApp(cur,old){
			if(!cur){
				this.shadeStyle = {
					'height':`calc(100vh - 46px)`
				}
				let flag = this.courseFilter.some(item=>item.hidden==false)
				if(flag){
					this.pageStyle = {
						'height':'100vh',
						'overflow':'hidden'
					}
				}
			}
		},
		priceRank(cur,old){
			this.courseList = [];
			this.loading = true;
			this.finished = false;
			this.currentPage = 0;
			this.onLoad()
		},
		classifyId(cur,old){
			if(old==-1&&this.$route.query.classifyId)return;
			this.courseList = [];
			this.loading = true;
			this.finished = false;
			this.currentPage = 0;
			this.onLoad()
		}
	},
	created(){
		if(this.$route.query.classifyId){
			this.classifyId = this.$route.query.classifyId;
			if(this.$route.query.type=='classify'){
				this.classifyType = 1;
			}else if(this.$route.query.type=='tag'){
				this.classifyType = 2;
			}
		}
	},
	methods:{
		envJudge(){
			if(window.history.length==1){
				let u = navigator.userAgent;
				let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
				if(isIOS){
					try {    
						window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody")
						document.querySelector('.go-back').style.display = 'none'
					}
					catch(err) {
			
					}
				}else{
					if(window.android){
						if(window.android.methForAndroid){
							document.querySelector('.go-back').style.display = 'none'
						}
					}
				}
			}
		},
		onClickLeft(){
			if(window.history.length==1){
				this.$router.replace('/')
			}else{
				this.$router.go(-1)
			}
		},
		onLoad() {
			let data;
			this.currentPage >= 1 ? this.currentPage++ : this.currentPage = 1;
			if(this.$route.query.classifyId){
				data = {
					currentPage:this.currentPage,
					pageSize:10,
					classifyId:this.classifyId
				}
				let editionType = localStorage.getItem('editionType')?localStorage.getItem('editionType'):1
				data.type = editionType;
				data.priceRank = this.priceRank;
				data.classifyType = this.classifyType;
			}else if(this.$route.query.courseType){
				data = {
					currentPage:this.currentPage,
					pageSize:10,
					type:Number(this.$route.query.courseType)
				}
			}else {
				data = {
					currentPage:this.currentPage,
					pageSize:10
				}
				if(this.$route.query.type=='featured'){
					data.moduleId = this.$route.query.id
				}else if(this.$route.query.type=='popularCourses'){
					data.priceRank = this.priceRank;
					data.type = 2;
				}
			}
			setTimeout(() => {
				this.$http.post(this.path,data).then(res => {
					if(res.data.status == 200){
						this.courseList= [...this.courseList,...res.data.content.list];
						this.currentPage = res.data.content.pageNum;
						this.loading = false;
						res.data.content.isLastPage ? this.finished = true : this.finished = false;
					}else {
						this.loading = false;
						this.finished = true;
					}
				})
			}, 500);
		},
		beforeEnter(dom) {
            dom.classList.add('list-enter', 'list-enter-active');
        },
        enter(dom,done) {
			let delay = dom.dataset.delay - (this.currentPage-1)*900;
            setTimeout(function () {
                dom.classList.remove('list-enter');
                dom.classList.add('list-enter-to');
                //监听 transitionend 事件
                var transitionend = window.ontransitionend ? "transitionend" : "webkitTransitionEnd";
                dom.addEventListener(transitionend, function onEnd() {
                  dom.removeEventListener(transitionend, onEnd);
                  done(); //调用done() 告诉vue动画已完成，以触发 afterEnter 钩子
                });
            }, delay)
        },
        afterEnter(dom) {
            dom.classList.remove('list-enter-to', 'list-enter-active');
		},
		chooseFilter(obj){
			if(obj.active){
				obj.active = false;
				setTimeout(()=>{
					obj.hidden = true;
				},301)
				return;
			}else{
				this.courseFilter.forEach(item=>{
					item.active=false;
					item.hidden = true
				})
				obj.active = true;
				obj.hidden = false;
				return;
			}			
		},
		closeCourseFilter(){
			this.courseFilter.forEach(item=>{
				item.active=false;
			})
			setTimeout(()=>{
				this.courseFilter.forEach(item=>{
					item.hidden=true;
				})
			},300)
		},
		getClassifyListByType(){
			let editionType = localStorage.getItem('editionType')?localStorage.getItem('editionType'):1;
			let query = {
				type:editionType
			}
			this.$http.post(this.$server.getClassifyListByType,query).then(res=>{
				if(res.data.status==200){
					let temp = res.data.content.map(item=>{
						item.label = item.classifyName;
						item.value = item.classifyId;
						item.active = false;
						return item
					})
					let {classifyId} = this.$route.query;
					if(classifyId==0){
						temp.find(item=>item.label=='全部').active = true;
					}else{
						let tempObj = temp.find(item=>item.classifyId==classifyId)
						if(tempObj){
							tempObj.active = true;
						}
						// temp.find(item=>item.classifyId==classifyId).active = true;
					}
					this.courseFilter = [
						{
							title:'分类',
							active:false,
							hidden:true,
							list:temp
						},
						{
							title:'价格',
							active:false,
							hidden:true,
							list:[
								{label:'全部',value:0,active:true},
								{label:'价格升序',value:2,active:false},
								{label:'价格降序',value:1,active:false},
							]
						}
					]
				}
			})
		},
		chooseCondition(parent,obj,index){
			let editionType = localStorage.getItem('editionType')?localStorage.getItem('editionType'):1
			if(parent.title=='价格'){
				let tempObj = this.courseFilter.find(item=>item.title=='价格')
				tempObj.list.forEach(item=>item.active = false)
				obj.active = true;
				this.priceRank = obj.value;
				this.closeCourseFilter()
			}else{
				let tempObj = this.courseFilter.find(item=>item.title=='分类')
				tempObj.list.forEach(item=>item.active = false)
				obj.active = true;
				this.closeCourseFilter()
				this.classifyType = 1;
				if(editionType==1){
					this.classifyId = obj.classifyId
				}else{
					if(obj.label=='全部'){
						let temp = [...tempObj.list]
						temp.splice(index,1);
						this.classifyId = temp.map(item=>item.id).join(',')
					}else{
						this.classifyId = obj.classifyId
					}
				}
				this.Title = obj.label;
			}
		}
	},
	mounted(){
		let type = this.$route.query.type;
		switch (type) {
			case "classify":
				this.uriName = 'getCoursesListByClassIfy';
				this.path = this.$server.getCoursesListByClassIfy;
				this.isnormal = true;
				this.Title = decodeURIComponent(decodeURIComponent(this.$route.query.name))
				this.getClassifyListByType()
				break;
			case "tag":
				this.uriName = 'getCoursesListByClassIfy';
				this.path = this.$server.getCoursesListByClassIfy;
				this.isnormal = true;
				this.Title = decodeURIComponent(decodeURIComponent(this.$route.query.name))
				this.getClassifyListByType()
				break;
			case "timeZone":
				this.uriName = 'getTimeLimitPurchaseCourseList';
				this.path = this.$server.getTimeLimitPurchaseCourseList;
				this.Title = decodeURIComponent(decodeURIComponent(this.$route.query.name));
				this.isnormal = true;
				break;
			case "popularCourses":
				this.uriName = 'getPopularCourseList';
				this.path = this.$server.getPopularCourseList;
				this.Title = decodeURIComponent(decodeURIComponent(this.$route.query.name));
				this.isnormal = true;
				this.courseFilter = [
					{
						title:'价格',
						active:false,
						hidden:true,
						list:[
							{label:'全部',value:0,active:true},
							{label:'价格升序',value:2,active:false},
							{label:'价格降序',value:1,active:false},
						]
					}
				]
				break;
			case "alreadyBuy":
				this.uriName = 'getPurchasedCourseList'
				this.path = this.$server.getPurchasedCourseList;
				this.Title = '已购课程';
				this.isnormal = false;
				break;
			case "freeCourse":
				this.uriName = 'getPurchasedCourseList'
				this.path = this.$server.getPurchasedCourseList;
				this.Title = '免费课程';
				this.isnormal = false;
				break;
			case "browseHistory":
				this.uriName = 'getBrowsingHistoryList'
				this.path = this.$server.getBrowsingHistoryList;
				this.Title = '浏览记录';
				this.isnormal = true;
				break;
			case "featured":
				this.uriName = 'getListForRecommend'
				this.path = this.$server.getListForRecommend;
				this.Title = '推荐位';
				this.isnormal = true;
			default:
				// statements_def
				break;
		}
		setTimeout(()=>{
			this.envJudge()
		},1)
		let fontSize = Number(window.getComputedStyle(document.documentElement).fontSize.split("px")[0]);
		let height = this.hasOpenApp?46+fontSize*0.98:16;
		this.shadeStyle = {
			'height':`calc(100vh - ${height}px)`
		}
	},
	components:{
		commonCourse,Header
	}
}

</script>

<style lang="scss" scoped>
	.go-back{
		width: .5rem;
		height: .5rem;
		vertical-align: middle;
	}
	.has-padding{
		padding-top:0.8rem;
	}
	.course-filter{
		height: 0.8rem;
		background: #fff;
		position: fixed;
		z-index: 20;
		width: 100%;
		.course-filter-tabs{
			height:100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			z-index: 3;
			background: #fff;
			.item{
				flex: 1;
				text-align: center;
				font-size: 0;
				&.active{
					i{
						transform: rotate(180deg);
					}
				}
				p{
					color:#333;
					font-size: 0.32rem;
					display: inline-block;
					vertical-align: middle;
					margin-right: 0.1rem;
					margin-left:0.3rem;
				}
				i{
					display: inline-block;
					vertical-align: middle;
					width: 0;
					height: 0;
					border-width: 0.12rem 0.1rem 0rem;
					border-style: solid;
					border-color: #333 transparent transparent;
					transition: transform 0.3s;
				}
			}
		}
		.condition-list{
			position: relative;
			z-index: 2;
			overflow: hidden;
			&.open{
				overflow: initial;
			}
			.condition-list-item{
				background: #fff;
				border-top:1px solid #F4F4F4;
				position: absolute;
				top:0;
				left: 0;
				width: 100%;
				transition: transform 0.3s;
				transform: translateY(-100%);
				&.hidden{
					visibility: hidden;
				}
				&.active{
					transform: translateY(0);
				}
				p{
					height: 0.8rem;
					line-height: 0.8rem;
					color:#333;
					font-size: 0.28rem;
					border-bottom:1px solid #F4F4F4;
					text-align: center;
					&:last-child{
						border:none;
					}
					&.active{
						color:#fff;
						background: #C30D23
					}
				}
			}
		}
		.shade{
			background: rgba(0,0,0,.7);
			position: absolute;
			z-index: 1;
			width: 100%;
			left: 0;
			top:0;
			height: 100vh;
			visibility: hidden;
			opacity: 0;
			&.show{
				visibility: visible;
				opacity: 1;
				transition: visibility 1ms,opacity 0.3s ease 2ms;
			}
		}
	}
	.header-nav .van-nav-bar, .common-header .van-nav-bar{
		z-index: 21!important;
	}
</style>
<style lang="scss">
	.header-nav {
		.van-hairline--bottom::after{
			width: 0;
		}
		.van-nav-bar__title{
			font: normal .32rem/.88rem "";
		}
	}
	.list-enter {
    opacity: 0;
    transform: translateY(100%);
}
.list-enter-active {
    transition: .3s;
}
/* enter-to其实可以不用写, 没有显性写明，就是默认的opacity: 1;transform: none;  */
.list-enter-to {
    opacity: 1;
    transform: translateY(0);
}

</style>
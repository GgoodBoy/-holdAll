<template>
    <div class="join-assemble">
        <Header :name="'参团'"></Header>
        <div class="content">
            <div class="course-info clearfix"  @click="goCourse">
                <img class="course-surface" :src="assembleData.courseSurfacePlot"/>
                <div class="course-data">
                    <p class="course-name textEllipsis">{{assembleData.courseTitle}}</p>
                    <p class="assemble-pirce">拼团价：{{assembleData.assemblePrice!='-'?assembleData.assemblePrice.toFixed(2):''}}币</p>
                    <p class="original-price">原价：{{assembleData.coursePrice!='-'?assembleData.coursePrice.toFixed(2):''}}币</p>
                </div>
            </div>
            <div class="list-wrap">
                <div class="list">
                    <van-list
                            v-model="loading"
                            :finished="finished"
                            @load="getJoinAssembleCourseInfo"
                        >
                        <div class="item" v-for="(item,index) in list" :key="index">
                            <div class="block" v-if="item.show">
                                <p class="phone">{{item.createorPhone}}</p>
                                <div class="status">
                                    <p class="need">还差{{item.remainderNum}}人成团</p>
                                    <p class="count-down">距离结束还有<span>{{item.timeStr}}</span></p>
                                </div>
                                <button @click="goJoin(item)">立即参团</button>
                            </div>
                        </div>
                    </van-list>    
                </div>
            </div>
        </div>
        <button class="open-assemble-btn" @click="goOpen">我要开团（{{assembleData.assemblePrice!='-'?assembleData.assemblePrice.toFixed(2):''}}币）</button>
        <CourseAssemble v-if="courseAssembleFlag" :courseAssembleData="courseAssembleData" :assembleData="assembleData"></CourseAssemble>
    </div>
</template>
<script>
import CourseAssemble from '@/pages/assemble/courseAssemble.vue'
import {mapState,mapActions} from 'vuex'
import Header from '@/components/Header.vue'
const countDownFormat = (time)=>{
    let h = parseInt(time / 3600);
    let m = parseInt(time % 3600 / 60);
    let s = parseInt(time % 3600 % 60);
    let hStr = h<10?`0${h}`:h;
    let mStr = m<10?`0${m}`:m;
    let sStr = s<10?`0${s}`:s;
    return `${hStr}:${mStr}:${sStr}`
}
export default {
    data(){
        return{
            assembleCourseId:'',
            list:[],
            currentPage:1,
            pageSize:10,
            loading:false,
            finished:false,
            assembleData:{
                "continueTime": '-', // 拼团持续时间
                "courseTitle": "-", // 课程标题
                "assemblePrice": '-', // 拼团价格
                "courseSurfacePlot": '', // 课程图片
                "coursePrice": '-', // 课程价格
                "courseId": '-', // 课程id
                "peopleNum": '-' // 拼团人数    
            },
            courseAssembleFlag:false,
            courseAssembleData:{}//参加某人开团的团信息
        }
    },
    components:{
        CourseAssemble,Header
    },
    inject:['reload'],
    computed:{
        ...mapState(['hasOpenApp','audioData']),
    },
    beforeRouteLeave (to, from, next){
		if(to.name=='CourseOrder'){
			if(this.assembleData.channelAvaliDay!=0){
				this.$dialog.confirm({
                    message: `为了您更好的学习该课程内容，课程购买后，学习有效期至${this.assembleData.channelAvaliDay},请于有效期内学习完该课程`,
                    confirmButtonColor:"#D40015"
                }).then(() => {
					next()
				}).catch(() => {
				});			
			}else{
				next()
			}
		}else{
			next()
		}
	},
    created(){
        if(this.$route.query&&this.$route.query.assembleRecordId){
            this.courseAssembleFlag = true;
        }
        let audioData = Object.assign({},this.audioData,{bottom:'1rem'})
        this.setAudioData(audioData)
    },
    methods:{
        ...mapActions(['setAudioData']),
        returnHome(){
            this.$router.push('/')
        },
        onClickLeft(){
            this.$router.go(-1)
        },
        /**
         * 获取参团详情
         */
        getJoinAssembleCourseInfo(){
            if(this.$route.params&&this.$route.params.assembleId){
                this.assembleCourseId = this.$route.params.assembleId;
                let query = {
                    currentPage:this.currentPage,
                    pageSize:this.pageSize,
                    assembleCourseId:this.$route.params.assembleId
                }
                this.$http.post(this.$server.getJoinAssembleCourseInfo,query).then(res=>{
                    if(res.data.status == 200){
                        if(!this.assembleData.hasOwnProperty('id')){
                            this.assembleData = {
                                id:res.data.content.id,
                                assemblePrice:res.data.content.assemblePrice,
                                courseId:res.data.content.courseId,
                                coursePrice:res.data.content.coursePrice,
                                courseSurfacePlot:res.data.content.courseSurfacePlot,
                                courseTitle:res.data.content.courseTitle,
                                channelAvaliDay:res.data.content.channelAvaliDay
                            }
                        }
                        this.list = [...this.list,...res.data.content.pageInfo.list];
                        this.currentPage++;
                        this.loading = false;
                        this.finished = res.data.content.pageInfo.isLastPage ?  true : false;
                        if(this.$route.query.assembleRecordId){
                            let obj = this.list.find(item=>item.id==this.$route.query.assembleRecordId);
                            this.courseAssembleData = obj?obj:{};
                            this.courseAssembleData.assemblePrice = res.data.content.assemblePrice
                            this.courseAssembleData.courseId = res.data.content.courseId
                        }
                        this.countDown()
                    }
                })
            }
        },
        /**
         * 倒计时
         */
        countDown(){
            let timer = null;
            let now = new Date().getTime();
            this.list.forEach((item,index)=>{
                let end = new Date(item.endTimeStr.replace(/-/g, '/')).getTime();
                let time = parseInt((end-now)/1000);
                if(time>0){
                    item.show = true;
                    item.time = time;
                    item.timeStr = countDownFormat(time);
                    item.timer = null;
                    item.timer = setInterval(()=>{
                        let arr = [...this.list];
                        arr[index].time--;
                        let time = arr[index].time;
                        arr[index].timeStr = countDownFormat(time);
                        let curTime = new Date().getTime();
                        let temp = parseInt((end-curTime)/1000);
                        if(time-temp>=1){
                            time = temp;
                            arr[index].timeStr = countDownFormat(time);
                        }
                        if(time<=0){
                            // arr[index].timeStr = '00:00:00';
                            this.list.forEach(item=>{
                                clearInterval(item.timer)
                            })
                            // this.reload();
                            // clearInterval(item.timer)
                        }
                        this.list = arr
                    },1000)
                }else{
                    item.show = false
                }
            })
        },
        /**
         * 去开团
         */
        goOpen(){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
            }else{
                let params = {
                    courseId:this.assembleData.courseId
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
                            localStorage.setItem('aboutCourse',this.$route.path)
                            let query = {
                                buyType:2,
                                assembleType:1,
                                assembleId:this.$route.params.assembleId,
                                assemblePrice:this.assembleData.assemblePrice
                            }
                            this.$router.push({path:`/course/order/${this.assembleData.courseId}`,query:query})
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }else{
                        if(res.data.message.includes('是会员')){
                            setTimeout(()=>{
                                this.$router.push(`/course/${this.assembleData.courseId}`)
                            },2000)
                        }
                    }
                })
            }
        },
        /**
         * 去参团
         */
        goJoin(obj){
            let uInfo = this.$getCookie('uInfo');
			if(!uInfo){
                sessionStorage.setItem('rediectUrl',this.$route.fullPath)
				this.$router.push('/auth')
            }else{
                let params = {
                    courseId:this.assembleData.courseId
                }
                this.$http.post(this.$server.verifyUserAssemble,params).then(res=>{
                    if(res.data.status==200){
                        if(res.data.content.isJoin==0){
                            localStorage.setItem('aboutCourse',this.$route.path)
                            let query = {
                                buyType:2,
                                assembleType:2,
                                assembleId:this.$route.params.assembleId,
                                assemblePrice:this.assembleData.assemblePrice,
                                joinAssembleRecordId:obj.id
                            }
                            this.$router.push({path:`/course/order/${this.assembleData.courseId}`,query:query})
                        }else if(res.data.content.isJoin==1){
                            this.$toast('您已参加过该团购')
                        }
                    }else{
                        if(res.data.message.includes('是会员')){
                            setTimeout(()=>{
                                this.$router.push(`/course/${this.assembleData.courseId}`)
                            },2000)
                        }
                    }
                })
            }
        },
        goCourse(){
            this.$router.push(`/course/${this.assembleData.courseId}`)
        }
    },
    beforeDestroy(){
        this.list.forEach(item=>{
            clearInterval(item.timer)
        })
    }     
}
</script>
<style lang="scss" scoped>
    .join-assemble{
        padding-bottom:1rem;
        .content{
            .course-info{
                padding: 0.2rem;
                .course-surface{
                    width:2.63rem;
                    height: 1.6rem;
                    border-radius: 3px;
                    float: left;
                }
                .course-data{
                    float: left;
                    width: calc(100% - 2.63rem);
                    height: 100%;
                    font-size: 0.32rem;
                    padding-left: 0.2rem;
                    .course-name{
                        color:#1A1A1A;
                        font-weight: bold;
                        line-height: 0.6rem;
                    }
                    .assemble-pirce{
                        color:#A63433;
                        line-height: 0.48rem;
                    }
                    .original-price{
                        color:#9A9A9A;
                        font-size: 0.24rem;
                        line-height: 0.6rem;
                        text-decoration: line-through;
                    }
                }
            }
            .list-wrap{
                padding-top:0.2rem;
                background: #f0f2f5;
                .list{
                    background: #fff;
                    padding: 0 0.3rem;
                    .item{
                        .block{
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            height: 1.4rem;
                            border-bottom:1px solid #F0F0F0;
                            font-size: 0.26rem;
                        }
                        .phone{
                            color:#6A6A6A;
                        }
                        .status{
                            .need{
                                color:#000000;
                                margin-bottom:0.02rem;
                            }
                            .count-down{
                                font-size: 0.24rem;
                                color:#9A9A9A;
                                span{
                                    display: inline-block;
                                    width: 1.05rem;
                                }
                            }
                        }
                        button{
                            display: block;
                            outline: none;
                            border:none;
                            width: 1.4rem;
                            height: 0.48rem;
                            line-height: 0.48rem;
                            text-align: center;
                            color:#fff;
                            background: #A63433;
                            border-radius: 20px;
                            box-shadow:2px 3px 18px 0px rgba(197,60,52,0.3);
                        }
                    }
                }
            }
        }
        .open-assemble-btn{
            position: fixed;
            bottom:0;
            left:50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 414px;
            height: 0.88rem;
            line-height: 0.88rem;
            color:#fff;
            background: #B63B40;
            text-align: center;
            border:none;
            outline: none;
            font-size: 0.32rem;
            &:active{
                background:#b1262b
            }
        }
    }
</style>

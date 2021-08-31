<template>
    <div class="one-list">
        <Header :name="pageTitle"/>
        <p class="listIsNo" v-show="listIsNo">暂时还没有精选视频哦</p>
        <div class="listBox" @scroll="scrollEvent">
            <courseRow v-for="(item,index) in dataList" :key="index" :data='item' :className='item.title' />
            <P class="p_Text" v-show="pTextIsShow">没有更多数据了</P>
        </div>
    </div>
</template>

<script>
import courseRow from "@/components/courseRow3.vue";
import Header from "@/components/Header.vue";
export default {
    data(){
        return {
            paramsName:'',
            pageTitle:'',
            //分页加载
            pageNo:1,
            pageSize:10,            
            finished:false,
            dataList:[],
            editionType:1,
            pTextIsShow:false,
            listIsNo:false
        }
    },
    components:{
        courseRow,
        Header
    },    
    computed:{},     
    created(){
        this.paramsName = this.$route.query.type;
        this.pageTitle = this.$route.query.name;
        console.log("this.pageTitle",this.pageTitle);
        this.gitDataList(1);
    },    
    methods:{
        scrollEvent(e){
            var domInfo = document.querySelector(".listBox")
                // domInfo.scrollHeight:内容区域的高度
                // domInfo.scrollTop：滚动条的高度
                // domInfo.clientHeight ：内容区的可见高度
            if(domInfo.scrollHeight - Math.ceil(domInfo.scrollTop) === domInfo.clientHeight){
                if(!this.finished){
                    this.pageNo=this.pageNo+1;
                    this.gitDataList(this.pageNo);
                }
            }
        },
        //获取数据
        gitDataList(num){
            var self =this;
            let login = JSON.parse(self.$getCookie('uInfo'));
			let parems = {
                type:self.editionType,
                pageNo:num,
                pageSize:self.pageSize
            }
            if(self.editionType==1){
                self.$http.post(self.$server.getFreeList,parems).then(res =>{
                    if(res.data.status==200){
                        if(res.data.content.list.length==self.pageSize){
                            self.dataList = [...self.dataList,...res.data.content.list];
                        }else{
                            self.dataList = [...self.dataList,...res.data.content.list];
                            self.editionType = 2;
                            self.pageNo = 1;
                            self.pageSize = Number(self.pageSize)-Number(res.data.content.list.length);
                            let qparems = {
                                type:self.editionType,
                                pageNo:self.pageNo,
                                pageSize:self.pageSize
                            }
                            self.$http.post(self.$server.getFreeList,qparems).then(res =>{
                                if(res.data.status==200){
                                    if(res.data.content.list.length==self.pageSize){
                                        self.dataList = [...self.dataList,...res.data.content.list];
                                    }else{
                                        self.dataList = [...self.dataList,...res.data.content.list];
                                        self.finished = res.data.content.isLastPage ?  true : false;  
                                        self.pTextIsShow=true;                                  
                                    }
                                    if(self.dataList.length>0){
                                        self.listIsNo = false;
                                        self.noData = true; 
                                    }else{
                                        self.listIsNo = true;
                                    }
                                }else{
                                    self.$toast(res.data.message);
                                }
                            });
                        }
                    }else{
                        self.$toast(res.data.message);
                    }
                });
            }else{
                //后期使用，保留；
                // self.pageSize = 10;
                let qparems = {
                    type:self.editionType,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                }
                self.$http.post(self.$server.getFreeList,qparems).then(res =>{
                    if(res.data.status==200){
                        if(res.data.content.list.length==self.pageSize){
                            self.dataList = [...self.dataList,...res.data.content.list];
                        }else{
                            self.dataList = [...self.dataList,...res.data.content.list];
                            self.finished = res.data.content.isLastPage ?  true : false;
                            self.pTextIsShow=true;   
                        }
                    }else{
                        self.$toast(res.data.message);
                    }
                });
            }  
        }
    }
};
</script>
<style lang="scss" scoped>  
.one-list{
    .listBox{
        overflow: auto;
        position: relative;
        height: calc(100vh - 0rem);    
        padding: 0 0.3rem;
        .p_Text{
            width: 100%;
            text-align: center;
            color: #666;
            font-size: 0.26rem;
            padding: 0.3rem;
        }        
    }
    .listIsNo{
        font-size: 0.32rem;
        text-align: center;
        padding: 0.4rem;
        background: #000;
        color:#7e7e7e;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
        opacity: 0
    }    
}

</style>

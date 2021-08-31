<template>
  <div class="home">
      <search :editionType="1" :searchData="searchData"/>
      <courseSwiper :dataInfo="courseSwiperObj" :index="index"/>
      <typeLayout :dataInfo="typeLayouts"/>
      <listPlugin :dataInfo="datalist1"/>
      <listPlugin :dataInfo="datalist2"/>
      <listPlugin :dataInfo="datalist3"/>
      <listPlugin :dataInfo="datalist4"/>
      <p class="titleCenter" @click="downLoadApp">看更多国学好课下载学国学网APP</p>
  </div>
</template>

<script>
import courseSwiper from "./components/swiperNew.vue"; //课程滑动
import listPlugin from "./components/listPlugin.vue";//限时专区
import typeLayout from "./components/typeLayout.vue";//分类
import search from "./components/search.vue";//搜索
import persons from "@/assets/image/person.png";
let imgUrlPath = 'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/m/';
export default {
  name: 'home',
  data(){
      return {
        persons:persons,
        courseSwiperObj:{},
        index:0,
        typeLayouts:{
          list:[]
        },
        datalist1:{
          list:[
            {
              imgUrl:'',
              p1:'',
              p2:''
            }
          ],
          title:'',
          typeState:false,
          otherPageName:''
        },
        datalist2:{
          list:[
            {
              imgUrl:'',
              p1:'',
              p2:''
            }
          ],
          title:'',
          typeState:false,
          otherPageName:''
        },
        datalist3:{
          list:[
            {
              imgUrl:'',
              p1:'',
              p2:''
            }
          ],
          title:'',
          typeState:false,
          otherPageName:''
        },
        datalist4:{
          list:[
            {
              imgUrl:'',
              p1:'',
              p2:''
            }
          ],
          title:'',
          typeState:false,
          otherPageName:''
        },
        searchData:{}
      }
  },
  components:{
    courseSwiper,
    listPlugin,
    typeLayout,
    search
  },
  created(){
    this.courseSwiperObj={
      style:1,
      ahprrList:[
        // {
        //   imgUrl:banner,
        //   targetId:'https://xgxm.xueguoxue.com/h5/winter/channel2/index.html',
        //   type:3
        // },
        {
          imgUrl:imgUrlPath+'swiper-1.png',
          targetId:465,
          type:1
        },
        {
          imgUrl:imgUrlPath+'swiper-2.png',
          targetId:381,
          type:1
        },
        {
          imgUrl:imgUrlPath+'swiper-3.png',
          targetId:290,
          type:1
        }
      ]
    };
    this.datalist1 = {
      list:[
        {
          imgurl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/881b7c96-4709-4d5e-b09c-2967376ca1de.png',
          p1:'和小孚姐姐轻松学成语',
          p2:'学国学网',
          targetId:850
        },
        {
          imgurl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/ad9ca34c-5ee5-46c0-9489-c30783bfca75.jpg',
          p1:'周月亮全新解读王阳明，独创阳明心学三字经',
          p2:'周月亮',
          targetId:839
        },
        {
          imgurl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/bb57b8f5-e9bd-4809-abd6-149fe2211e7b.jpg',
          p1:'儒家经典与人生智慧',
          p2:'车凤',
          targetId:1
        },
        {
          imgurl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/fd75fc76-66de-49db-8190-a7ba3fc7b213.jpg',
          p1:'《菜根谭》的处世智慧',
          p2:'杜保瑞',
          targetId:878
        },
        {
          imgurl:imgUrlPath+'new-3.png',
          p1:'少儿国学启蒙《幼学琼林》',
          p2:'六六老师',
          targetId:570
        },
        {
          imgurl:imgUrlPath+'new-4.png',
          p1:'唐太宗的成功之道',
          p2:'孟宪实',
          targetId:592
        }
      ],
      title:'最新上线',
      typeState:false,
      otherPageName:''
    };
    this.datalist2 = {
      list:[
        {
          imgurl:imgUrlPath+'hote-1.png',
          p1:'《周易》应该这样读',
          p2:'鲁洪生',
          targetId:6
        },
        {
          imgurl:imgUrlPath+'hote-2.png',
          p1:'任景利教你轻松学古琴',
          p2:'任景利',
          targetId:125
        },
        {
          imgurl:imgUrlPath+'hote-3.png',
          p1:'大人和孩子都值得听得古诗词精讲',
          p2:'金立群',
          targetId:461
        },
        {
          imgurl:imgUrlPath+'hote-4.png',
          p1:'赏析最美古诗50讲',
          p2:'申怡老师',
          targetId:10
        }
      ],
      title:'最热播放',
      typeState:false,
      otherPageName:''
    };
    this.datalist3 = {
      list:[
        {
          imgurl:imgUrlPath+'free-1.png',
          p1:'中华经典资源库——跟着名家学诗词(小学篇)',
          p2:'方明',
          targetId:226
        },
        {
          imgurl:imgUrlPath+'free-2.png',
          p1:'1分钟轻松学国学——雅欣陪你涨知识',
          p2:'曹雅欣',
          targetId:449
        },
        {
          imgurl:imgUrlPath+'free-3.png',
          p1:'易经中你不知道的事',
          p2:'尹红卿',
          targetId:292
        },
        {
          imgurl:'https://xgxw-pic.oss-cn-beijing.aliyuncs.com/xgxw/53bfe562-3744-44f9-9718-a527a793e338.jpg',
          p1:'傅佩荣讲《易经》——中华经典资源库',
          p2:'傅佩荣',
          targetId:656
        }
      ],
      title:'免费专区',
      typeState:true,
      otherPageName:'free',
      otherTitle:'更多免费课程'
    };
    this.datalist4 = {
      list:[
        {
          imgurl:imgUrlPath+'Study-1.png',
          p1:'为啥叫铁观音？原来和一位皇帝有关系',
          p2:'',
          targetId:165
        },
        {
          imgurl:imgUrlPath+'Study-2.png',
          p1:'给孩子一门最好的国学声旋律启蒙',
          p2:'',
          targetId:163
        },
        {
          imgurl:imgUrlPath+'Study-3.png',
          p1:'香学有讲究:不同图案，代表时间各不相同',
          p2:'',
          targetId:160
        },
        {
          imgurl:imgUrlPath+'Study-4.png',
          p1:'不管是"儒家"还是"道家"都向往"自由"',
          p2:'',
          targetId:152
        }
      ],
      title:'小知识',
      typeState:true,
      otherPageName:'shortVideo',
      otherTitle:'更多小知识'
    };
    this.typeLayouts={
      list:[
        // {
        //   imgurl:this.class_1,
        //   name:'分类',
        //   id:1
        // },
        {
          imgurl:imgUrlPath+'class-1.png',
          name:'成人',
          id:0
        },   
        {
          imgurl:imgUrlPath+'class-1.png',
          name:'少儿',
          id:1
        },        
        {
          imgurl:imgUrlPath+'class-2.png',
          name:'拼团',
          id:2
        },
        {
          imgurl:imgUrlPath+'class-3.png',
          name:'小知识',
          id:3
        },
        {
          imgurl:imgUrlPath+'class-4.png',
          name:'我的',
          id:4
        }
      ]
    };
    let cookie = this.$getCookie('uInfo');
    let userId = cookie ? JSON.parse(cookie).userid  : '';
    if(userId){
      this.searchData={
        imgUser:JSON.parse(cookie).avatar
      }
    }else{
      this.searchData={
        imgUser:this.persons
      }
    }
  },
  methods:{
    downLoadApp(){
      window.location.href = this.$server.downLoad;
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
  background: #f4f4f4;
}
.titleCenter{
  text-align: center;
  padding: 0.5rem 0;
  font-size: 0.32rem;
  color: #333;
  text-decoration:underline;
}
</style>

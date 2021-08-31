<template>
<div class="tableDiv">
    <el-table
        v-loading="loading"
        :data="tableData"
        header-cell-class-name="list-header-layout-bg"
        border
        :height='heights'
        style="width: 100%"
        :header-cell-style="tableHeaderColor"
        @row-click="clickRow"
        v-tabelLoadmore
        >      
       <!-- <el-table-column
       v-if="typeInfo=='moneyType'"
        align="center"
        label="付款账号"
        min-width="150">
            <template slot-scope="scope">
                <p class="moneyOrRecord">{{scope.row.userPhone}}<span class="flag" v-if="telephoneList.indexOf(scope.row.userPhone)!=-1">测</span></p>                          
            </template>
        </el-table-column>        -->
        <el-table-column
        :show-overflow-tooltip="item.tooltip?false:true"
        :prop="item.date"
        align="center"
        :label="item.label"
        :min-width="item.width"
        v-for="(item,i) in moduleList" :key="i">
            <template slot-scope="scope">
                <div v-bind:class="{ 'roundCss': roundBoll, 'squareCss': squareBoll }" v-if="(()=>{return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(scope.row[item.date])})()"> 
                    <img v-if="scope.row['contenthistoryRecord']!=='historyRecord'" v-bind:src="scope.row[item.date]"/>
                    <span v-if="scope.row['contenthistoryRecord']=='historyRecord'">{{scope.row[item.date]}}</span>
                </div>                
                <div v-if="scope.row[item.date]!=='reducedPrice'&&!(()=>{return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(scope.row[item.date])})()">
                    {{scope.row[item.date]}}
                </div>                     
                <div v-if="scope.row[item.date]==='reducedPrice'">
                    <el-row class="lCenter-r">
                        <el-col class="redFontColor">{{scope.row['reducedPriceNum']}}</el-col>
                        <el-col>{{scope.row['couponType']}}</el-col>
                    </el-row>
                </div>                                     
            </template>
        </el-table-column>       
        <el-table-column
        v-if="copyEven==true"
        label="链接"
        align="center"
        :min-width="minWidth"
        fixed="right"
        >
                <template slot-scope="scope">
                    <div v-if="$authJudge('market:coupon:copylink')" v-show="scope.row.copyUrl=='copyUrl'">
                        <el-button v-if="urlScienceBools===2" :class="`copyurl${scope.row.id}`" :data-clipboard-text="`https://scm.youfushuyuan.com/#/receiveCouponH5?coupon=${scope.row.id}`" @click="copyEvenChange(scope.row.id)">复制</el-button>
                        <el-button v-else :class="`copyurl${scope.row.id}`" :data-clipboard-text="`https://xgxm.xueguoxue.com/#/receiveCouponH5?coupon=${scope.row.id}`" @click="copyEvenChange(scope.row.id)">复制</el-button>
                    </div>
                </template>
        </el-table-column>        
        <el-table-column
        v-if="markState==true"
        label="操作"
        align="center"
        :min-width="minWidth"
        fixed="right"
        >  
            <template slot-scope="scope">
                <div v-if="typeInfo==='coupon'">
                    <el-button 
                    v-if="scope.row.status1===2&&((item1.type==3&&$authJudge('market:coupon:info'))||(item1.type==4&&$authJudge('market:coupon:addcellphone'))||(item1.type==1&&$authJudge('market:coupon:info'))||(item1.type==2&&$authJudge('market:coupon:down')))"  
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button v-if="(scope.row.status1===1||scope.row.status1===3||scope.row.status1===4 )&&(item1.type===3&&$authJudge('market:coupon:info'))" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                </div>    
                <div v-if="typeInfo==='activity'">
                    <el-button v-if="scope.row.status1===2&&scope.row.couponTypeNum!==5&&((item1.type==3&&$authJudge('market:activitycoupon:info'))||item1.type==1||(item1.type==4&&$authJudge('market:coupon:addcellphone'))||(item1.type==2&&$authJudge('market:activitycoupon:down')))"  
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button v-if="(scope.row.status1===1||scope.row.status1===3||scope.row.status1===4||scope.row.couponTypeNum===5 )&&(item1.type===3&&$authJudge('market:activitycoupon:info'))"
                     @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                </div>   
                <!-- <div v-else-if="typeInfo==='timelimit'">
                    <el-button v-if="scope.row.status1===0&&((item1.type==3&&$authJudge('market:limited:up'))||(item1.type==4&&$authJudge('market:limited:del')))"  
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button v-if="scope.row.status1===1&&(item1.type==2&&$authJudge('market:limited:down'))" 
                     @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>                       
                </div>                 -->
                <div v-else-if="typeInfo==='userFiles'">
                    <el-button v-if="$authJudge('user:users:forbidden')" v-show="scope.row.disableMark==0&&item1.type==2" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i+'forbidden'">{{item1.name}}</el-button> 
                    <el-button v-if="$authJudge('user:users:open')" v-show="scope.row.disableMark==1&&item1.type==1" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i+'open'">{{item1.name}}</el-button>
                    <el-button v-if="$authJudge('user:users:info')" v-show="item1.type==3" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i+'info'">{{item1.name}}</el-button>
                    <el-button v-if="$authJudge('user:users:pullnew')" v-show="item1.type==4"
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i+'pullnew'">{{item1.name}}</el-button>                    
                </div>
                <!-- <div v-else-if="typeInfo==='hotWork'">
                    <el-button v-if="($authJudge('hotword:edit')&&item1.type==1)||($authJudge('hotword:del')&&item1.type==2)" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="item1,i in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button v-if="$authJudge('hotword:setHot')" type="text" size="small" @click="handleClick(scope.row,3)">{{scope.row.type&&scope.row.type==1?'取消默认词':'设置默认词'}}</el-button>
                </div>  -->
                <!-- <div v-else-if="typeInfo==='commentFiles'">
                    <el-button v-if="scope.row.show==0&&((item1.type==1&&$authJudge('comment:reply'))||(item1.type==2&&$authJudge('comment:hide')))" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button v-if="scope.row.show==1&&(item1.type==3)&&($authJudge('comment:display')&&item1.type==3)" 
                    @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                </div> -->
                <div v-else-if="typeInfo==='bugreturn'||typeInfo==='proposalName'">
                    <el-button v-if="$authJudge('admin:feedback:notread')&&scope.row.isRead==0&&item1.type==0" @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                    <el-button class="fontColor" v-if="scope.row.isRead==1&&item1.type==1" @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                </div>      
                <div v-else-if="typeInfo==='insideInit'">
                    <el-button @click="handleClick(scope.row,item1.type)" type="text" size="small" v-for="(item1,i) in marksArr" :key="i">{{item1.name}}</el-button>
                </div>                                                                                           
            </template> 
        </el-table-column>              
  </el-table>
</div>
   
</template>
<script>
import datalist from './gxTitleList';
import Clipboard from 'clipboard';
let titleList = new datalist()
export default {
    data(){
        return {          
            moduleList:[],
            heights:null,
            roundBoll:false,
            squareBoll:false,
            minWidth:140,
            urlScienceBools:1,
            creamId:'',
            telephoneList:[]
    }},
    created(){
        this.type = this.$route.meta.type;
        // if(this.tableDatas.types=='moneyType'){
        //     this.telephoneList = titleList.telePhoneList.join();
        // }
        if(this.environmenttarget=='prod'){
            this.urlScienceBools = 1;
        }else if(this.environmenttarget=='beta'){
            this.urlScienceBools = 2;
        }else{
            this.urlScienceBools = 1;
        };
        //this.type的名字必须和配置参数中对应的key值相等；
        this.moduleList =titleList.formHeadName[this.type];
        this.heights = this.tableDatas.height==true?760:null;
        if(this.tableDatas.imgCss!=undefined){
            this.roundBoll = this.tableDatas.imgCss.roundBoll;
            this.squareBoll = this.tableDatas.imgCss.squareBoll;
        }
        this.minWidth = this.tableDatas.minWidth&&this.tableDatas.minWidth>0?this.tableDatas.minWidth:180;
    },
    props:['tableDatas','rowEven'],
    computed:{
        // tableDatas:展示的数据；
        // marksArr:表格数据操作的类型
        // markState：当前表格式展示类型的还是可编辑的；        
        tableData(){
            return this.tableDatas.tableData;
        },              
        marksArr(){
            return this.tableDatas.marksArrs;
        },
        copyEven(){
            return this.tableDatas.copyEven;
        },
        markState(){
            return this.tableDatas.markState;
        },
        loading(){ 
            return this.tableDatas.loading;
        },
        typeInfo(){
            return this.tableDatas.types;
        }
    },

    directives:{
        // 自定义指令的名字
        tabelLoadmore:{
            bind(el, binding,vode) {
                    // 获取element-ui定义好的scroll盒子
                    const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
                    
                    SELECTWRAP_DOM.addEventListener('scroll', function() {

                    /*
                    * scrollHeight 获取元素内容高度(只读)
                    * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                    * clientHeight 读取元素的可见高度(只读)
                    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
                    let sign = 80; // 定义默认的向上滚于乡下滚的边界
                    const CONDITION = ((Math.floor(this.scrollHeight - this.scrollTop) === this.clientHeight) && this.scrollTop > sign)// 注意: && this.scrollTop
                    if(this.scrollTop > sign) {
                        if(vode.context.rowEven){
                        sign = this.scrollTop;
                        console.log('向下')
                        }                         
                    }
                    if(this.scrollTop < sign) {
                        if(vode.context.rowEven){
                            sign = this.scrollTop;
                            console.log('向上')
                        }                        
                    }
                    if(CONDITION) {
                        if(vode.context.rowEven){
                            vode.context.$emit("scrollTopChange",1);
                            }
                        }
                    });
                }
        }
    },
    methods:{
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },        
        setCreamEven(item,num){
            var self = this;
            switch (num) {
                case 1:
                    self.creamFun(item.id,1);
                    break;
                case 2:
                    self.creamFun(item.id,0);
                    break;            
                default:
                    break;
            }
            // this.creamId = item.id;
        },
        creamFun(id,boosNum){
            var self =this;
            var chooseNum = boosNum;
            var parems = {
                id:id,
                isElite:boosNum
            };
            self.$http.post(self.$server.getCreamElite(parems)).then(res=>{
                if(res.status==200){  
                    if(chooseNum>0){
                        // self.creamId = id;
                        self.$message({
                            message: "设置评论精华成功！",
                            type: "success"
                        });   
                        self.$emit('creamEvenlist');
                    }else{
                        // self.creamId = '';
                        self.$message({
                            message: "评论精华取消成功！！",
                            type: "success"
                        });  
                        self.$emit('creamEvenlist');
                    }                           
                }                       
            })
        },        
        handleClick(e,f){
            switch (this.tableDatas.types) {
                case 'coupon':
                // case 'timelimit':
                case 'userFiles':
                // case 'commentFiles':
                case 'insideInit':
                // case 'hotWork':0
                case 'bugreturn':
                case 'proposalName':
                case 'activity':
                    console.log("e",e);
                    this.$emit('pathRouterPage', {id:e.id,type:f,data:e})
                    break;
                default:
                    break;
            }
        },
        //复制
       copyEvenChange(id){ 
          var clipboard = new Clipboard('.copyurl'+id);  
            clipboard.on('success',(e)=>{
                    this.$message.success("复制成功");
                    // 释放内存 
                    clipboard.destroy();
                })  
            clipboard.on('error',function(e){
                    console.log('该浏览器不支持自动复制')  
                    //// 释放内存 
                    clipboard.destroy();
                })  
        },       
        clickRow(a){
            if(this.rowEven){
                this.$emit("rowEvenChange",a);
            }
        },        
        enter(e){
            console.log(e)
        },
        leave(e){
            console.log(e)
        },
        tableLoadMore() {
            console.log("10000");
        },
        // getCaption(obj){
        //     var index=obj.lastIndexOf("\:");
        //     obj=obj.substring(index+1,obj.length);
        //     return obj;
        // }             
    },
    mounted(){
        console.log(this.power);
    }
}
</script>
<style>
@import "./my-component.css";
.roundCss{
    width:30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin: auto;
}
.roundCss img{
    width: 100%;
    border-radius: 50%;    
}
.squareCss{
    width:30px;
    height: 30px;
    overflow: hidden;
    margin: auto;
}
.squareCss img{
    width: 100%;  
}
.fontColor{
    color: #ADADAD;
}
.el-tooltip__popper{
    max-width: 60%;
}
.el-table .cell.el-tooltip>div{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1;
}
.tableDiv .moneyOrRecord{
        position: relative;
        display: inline-block;
        padding: 10px;    
}
.tableDiv .moneyOrRecord .flag{
            /* color:#9E0E00; */
            color:#fff;
            background: #9E0E00;
            font-size: 12px;
            position: absolute;
            top:-1px;
            right: -8px;
            width: 20px;
            text-align: center;
            height: 20px;
            /* border:1px solid #9E0E00; */
            border-radius: 50%;
            transform: scale(0.9)      
}

/* body .el-table th.gutter {
    display: table-cell !important
} */
</style>


<template>
    <div>
        <gxHead :headObj='headObj' v-on:dialogChange="dialogChanges" v-on:inputValPortEven="inputStateVal"></gxHead>
        <gxTable :tableDatas="tableObj" v-on:pathRouterPage="Routerpage"></gxTable>
        <gxPaginaton :pageAtions="pageAtion" v-on:childByPageValue="childPageValue" ></gxPaginaton>
        <Dialog 
                :showFlag="dialgObj.Revoke.showFlag" 
                :title="dialgObj.Revoke.title"
                :cancelName="dialgObj.Revoke.cancelName"
                :sureName="dialgObj.Revoke.sureName"
                v-on:RevokeNo="couponRevokeNo" 
                v-on:RevokeOk="couponRevokeOk">
                <span slot="dialog-body"></span>
                <el-row slot="dialog-body" class="lLine30">
                    <el-col :span="2" :offset="2" class="lRight-r">
                        <i class="el-icon-warning lSize30 redFontColor"></i>
                    </el-col>
                    <el-col class="lSize16 lLeft-r" :span="20">下架后将不再领取此优惠券，但不影响已领用户使用，确定要下架吗？</el-col>
                </el-row>
        </Dialog>
        <Dialog 
                :showFlag="dialgObj.newObj.showFlag" 
                :title="dialgObj.newObj.title"
                :cancelName="dialgObj.newObj.cancelName"
                :sureName="dialgObj.newObj.sureName"
                v-on:newObjNo="couponNewObjNo" 
                v-on:newObjOk="couponNewObjOk">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col :span="14" :offset="5" class="lCenter-r">
                        <el-radio v-model="radio" label="1">新建课程优惠券</el-radio>
                        <el-radio v-model="radio" label="2">新建网站优惠券</el-radio>
                    </el-col>
                </el-row>
        </Dialog> 
        <Dialog 
                :showFlag.sync="dialgObj.editsObj.showFlag"
                :title="dialgObj.editsObj.title"
                :cancelName="dialgObj.editsObj.cancelName"
                :sureName="dialgObj.editsObj.sureName"
                v-on:editObjNos="couponEditObjNo"
                v-on:editObjOks="couponEditObjOkEd">
                <el-row slot="dialog-body" class="lLine30">
                    <el-col :span="3" class="lLeft-r">
                        发行量
                    </el-col>
                    <el-col :span="10" :offset="1" class="lCenter-r">
                        <el-input
                            placeholder="请输入发行数量"
                            suffix-icon="el-icon-search"
                            v-model="inputNum">
                        </el-input>
                    </el-col>
                    <el-col :span="8" :offset="1" class="lLeft-r">
                        最多不超过1万张
                    </el-col>  
                    <el-col v-show="titleDialog" :offset="4" class="lSize14 redFontColor">修改发行数量不能少于原数量</el-col>                                      
                </el-row>
        </Dialog>  
        <el-dialog 
        title="" 
        :visible.sync="addUserTelephone" 
        width="40%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false">
            <div>
                <div class="userSelectListBtn">
                    <div class="usersTitle">优惠券剩余 :{{cardNumber}}</div>
                    <div style="display: -webkit-inline-box;">
                        <div style="margin-right:15px;">渠道来源 :</div>
                        <el-select v-model="channelValue" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.origin"
                            :value="item.code">
                            </el-option>
                        </el-select>                        
                    </div>                    
                    <div class="usersCount">
                        <!-- <el-input type="textarea" style="width:200px;" :rows="9"></el-input> -->
                        <textarea class="telePhoneTextareas" type="textarea" @input="getContent" rows="6" ref="textarea"  @click="getRows" @keydown="keyDownEvent($event)" @paste="pasteEvent" v-model="textarea"></textarea>
                        <div class="usersList">
                            <div class="usersListCount" v-for="(item,index) in addTelephoneListCopy" :key="index">
                                <p>{{item}}</p>
                                <i class="el-icon-circle-close" @click="removeSelectTelephone(index)"></i>
                            </div>
                        </div>
                    </div>
                </div> 
                <div class="userTelePhoneSaveBut">
                    <div @click="saveTextareaInfo">保存</div>
                </div>               
                <div style="text-align: center;">
                    <el-button type="primary" @click="telephoneDoal(1)">保存</el-button>
                    <el-button type="info" @click="telephoneDoal(2)">取消</el-button> 
                </div>
            </div>
        </el-dialog>                              
    </div>
</template>
<script>
import gxHead from "@/components/formSynthesisPlugin/gxHead"; 
import gxTable from "@/components/formSynthesisPlugin/gxTable";
import gxPaginaton from "@/components/formSynthesisPlugin/gxPaginaton"; 
import Dialog from "@/components/myDialog/myDialog";
import eventAction from '../../lEventAtion';
let actions = new eventAction()
export default {
    components:{
        gxHead,
        gxTable,
        gxPaginaton,
        Dialog
    },
    data(){
        return {
            //表格配置
            tableObj:{
                tableData:[],
                // 1.编辑，2.下架，3.详情，4.排序
                marksArrs:[ //"add", "soldOut", "details", "edit", "coupon"
                    {name:"编辑",type:1,code:"edit"},
                    {name:"下架",type:2,code:"soldOut"},
                    {name:"详情",type:3,code:"details"},
                    {name:"添加号码",type:4,code:"adds"}
                    ],
                markState:true,
                copyEven:true,
                loading:true,
                types:"coupon",
                minWidth:100,
                chooseID:'',
                power:[]              
            },
            //分页
            pageAtion:{},
            //头部配置
            headObj:{
                typeBoll:true,
                name:'coupon',
                title:'新建优惠券',
                listType:{
                    listValOne:[
                    {
                    value: 5,
                    label: '全部'
                    },
                    {
                    value: 1,
                    label: '未开始'
                    }, {
                    value: 2,
                    label: '领取中'
                    }, {
                    value: 3,
                    label: '已领完'
                    }, {
                    value: 4,
                    label: '已结束'
                    }                                           
                    ]
                },
                buttonBool:true,
                power:[],
                menuList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'优惠券系统',
                            pathInfo:''
                        }
                ]             
            },
            chooseState:'',
            titleVal:'',
            inputNum:'',
            startTime:'',
            endTime:'',
            titleDialog:false,
            //弹框配置
            dialgObj:{
                    Revoke:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"温馨提示", //Dialog 的标题
                        cancelName:'RevokeOk', //自定义取消事件名字
                        sureName:'RevokeNo', //自定义确定事件名字
                    },
                    newObj:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:" ", //Dialog 的标题
                        cancelName:'newObjNo', //自定义取消事件名字
                        sureName:'newObjOk', //自定义确定事件名字,
                    },
                    editsObj:{
                        showFlag:false, //是否显示遮罩弹框；
                        title:"优惠券编辑", //Dialog 的标题
                        cancelName:'editObjNos', //自定义取消事件名字
                        sureName:'editObjOks', //自定义确定事件名字,                        
                    }                    
            },
            //课程新建单选
            radio:'1',
            pageSize:10,
            //添加号码-ljm
            addUserTelephone:false,
            textarea:'',
            oldTextarea:'',
            rows:0,
            pasteFlag:false,
            addTelephoneListCopy:[],
            channelValue:'',
            cardNumber:'',
            options: [],            
    }},
    created(){
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path
        let flag = this.$getPermissions(routes,currentPath);
        if(!flag){
            flag = [];
        }
        var self = this;
        self.tableObj.power = flag;
        self.headObj.power = flag;
        this.getChannelList();
        this.showData({pageSize:self.pageSize ,pageNo: 1});
    },
    props:{},
    computed:{},
    methods:{
        //返回渠道；
        getChannelList(){
            var self = this;
            self.$http.get(self.$server.getOriginStudyCard).then(res=>{
                if(res.status==200){    
                    self.options = res.content;                
                }
            })            
        },        
        //剩余可用学习卡张数
        remainCardNumber(id){
            var self = this;
            var params = {
                couponId:id        
            };
            self.$http.get(self.$server.getCouponsCountCoupons(params)).then(res=>{
                if(res.status==200){    
                    self.cardNumber = res.content.surplusNum;                
                }
            })            
        },
        //表头输入信息过滤
        inputStateVal(valobj){
            var self = this;      
            self.tableObj.loading = true;
            self.chooseState =valobj.status1!=5?valobj.status1:''; 
            self.titleVal =valobj.title; 
            self.startTime = valobj.dataStart;
            self.endTime = valobj.dataEnd;
            self.showData({pageSize:self.pageSize ,pageNo: 1,title:self.titleVal,status:self.chooseState,startTime:actions.formatDate(self.startTime,"start"),endTime:actions.formatDate(self.endTime,'end')});
        },
        //表格组件数据传递
        Routerpage(obj){
            var self = this;
            this.tableObj.chooseID = obj.id;
            switch (obj.type) {
                case 1: 
                    this.dialgObj.editsObj.showFlag = true;
                    this.tableDataObj = obj.data;
                    break;
                case 2:
                    this.dialgObj.Revoke.showFlag = true;
                    break;
                case 3:
                    this.$router.push({name:'couponDetails',query:{id:obj.id}});
                    break;    
                case 4:
                    self.addUserTelephone=true;
                    self.remainCardNumber(obj.id);
                    break;                                                
                default:
                    break;
            }
        },
        //分页子组件传递给父组件的方法
        childPageValue(pageNum){
            var self = this;
            this.tableObj.loading = true;
            //后期做接口字段过滤；
            this.showData({pageSize: self.pageSize,pageNo: pageNum,title:self.titleVal,status:self.chooseState,startTime:actions.formatDate(self.startTime,"start"),endTime:actions.formatDate(self.endTime,'end')});
        },
       showData(paramsObj){
            var self = this;
            var url = '/coupons/selectCouponsByTitleAndStatus';
            paramsObj["type"]=1;
            actions.getData(url,paramsObj)
                .then(data => {
                    let obhArr = actions.tableHead.coupon;
                    let endObj=actions.filterData(data,obhArr,'coupon');
                    var listIds = [];
                        listIds = endObj.tableObj.tableData.map(function(element,index){
                            if(endObj.pageAtion.pageNum==1){
                                element.sortId = index+1;
                                return element;
                            }else if(endObj.pageAtion.pageNum>1){
                                element.sortId = (endObj.pageAtion.pageNum-1)*10+index+1;
                                return element;
                            }
                        });
                    self.tableObj.tableData = listIds;
                    self.pageAtion = endObj.pageAtion;
                    if(endObj.pageAtion.pageTotal>self.pageSize){
                        self.pageAtion['pageBool'] = false;
                    }else{
                        self.pageAtion['pageBool'] = true;
                    }                    
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })   
                })
                .fail(function(){
                    self.pageAtion['pageBool'] = true;
                    self.$nextTick(function(){
                            self.tableObj.loading = false; 
                    })
                    }
                );                  
        },
        //下架弹框
        couponRevokeNo(){
            var self = this;
            var url = "coupons/soldOut/"+this.tableObj.chooseID;
            actions.getData(url,'',"post").then(data=>{
                    this.dialgObj.Revoke.showFlag = false;
                    var paramsObj= {pageSize:self.pageSize ,pageNo: self.pageAtion.pageNum,title:self.titleVal,status:self.chooseState}
                    this.showData(paramsObj)
            })
        },
        couponRevokeOk(e){
           this.dialgObj.Revoke.showFlag = false;
        },
        dialogChanges(){
            this.dialgObj.newObj.showFlag = true;
        },
        //新建优惠券
        couponNewObjNo(e){
            var self = this;
            this.dialgObj.newObj.showFlag = false;
            // this.$router.push({path: '/login?url=' + this.$route.path});
        },
        couponNewObjOk(){
            var self = this;
            if(this.radio=="1"){
                this.$router.push({path:'/marketelist/coupon/appCoupon', query:'2'});
            }else if(this.radio=="2"){
                this.$router.push({path:'/marketelist/coupon/webCoupon', query:'1'});
            }
        },
        couponEditObjNo(){
            this.dialgObj.editsObj.showFlag = false;
        },
        couponEditObjOkEd(){
            var self = this;
            self.titleDialog = false;
            if(parseInt(self.inputNum)>parseInt(self.tableDataObj.totalNum)){
                var url = "/coupons/edit/"+this.tableObj.chooseID;
                actions.getData(url,{totalNum:parseInt(this.inputNum)},"post").then(data=>{
                    self.dialgObj.editsObj.showFlag = false;
                    var paramsObj= {pageSize:self.pageSize ,pageNo: 1,title:self.titleVal,status:self.chooseState}
                    self.showData(paramsObj)
                })
            }else{
                self.titleDialog = true;
            }
        },
        codeSetUpEven(arryOne,arryTwo){
            arryOne.forEach((element,index) => {
                if(arryTwo.indexOf(arryOne.code)>0){
                    arryOne[index].code = true;
                }else{
                    arryOne[index].code = false;
                }
            });
        },


        // 添加号码事件
        //添加号码确定
        telephoneDoal(num){
            switch (num) {
                case 1:
                    this.addTelePhoneNewId();                  
                    break;
                case 2:
                    this.addUserTelephone = false;
                    this.textarea='';
                    this.oldTextarea='';
                    this.rows=0;
                    self.channelValue ='';
                    this.pasteFlag=false;
                    this.addTelephoneListCopy=[];                    
                break;  
                default:
                    break;
            }
        },   
        addTelePhoneNewId(){
            var self = this;
            if(self.addTelephoneListCopy){
                if(self.addTelephoneListCopy.length>200){
                    self.$message.error('每次最多添加200条');
                    return;
                }else{
                    var params = {
                        couponId: self.tableObj.chooseID,
                        origin:self.channelValue,
                        cellphones:self.addTelephoneListCopy.join('\n')          
                    };
                    var boolType = true;
                    self.addTelephoneListCopy.forEach((element,index)=>{
                        if(element.length!=11){
                            boolType = false;
                        }
                    });
                    if(boolType){
                        self.$http.post(self.$server.receiveCouponByCellphonecoupons,params).then(res=>{
                            if(res.status==200){
                                self.addUserTelephone = false;
                                self.addTelephoneListCopy =[];
                                self.textarea =[];
                                self.oldTextarea='';
                                self.channelValue ='';
                                self.rows=0;
                                self.pasteFlag=false;                    
                                self.$message.success({ message: "添加成功!" });                      
                            }
                        })
                    }else{
                        self.$message.error({ message: "号码有误!" });    
                    }
                }
            }                
        },             
        /**
         * 获取内容
         */
            getContent(){
                this.textarea = this.textarea.replace(/[^\d\n]/g, '');
                if(this.pasteFlag){
                    this.pasteFlag = false;
                    let temp = this.textarea.split('\n').map(item=>{
                        return item.length>11?item.substr(0,11):item
                    })
                    this.textarea = this.oldTextarea = temp.join('\n');
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return false;
                }
                let index = this.rows - 1 < 0 ? 0 : this.rows - 1;
                let arr = this.textarea.split('\n');
                if(arr[index]&&arr[index].length>11){
                    this.textarea = this.oldTextarea
                    this.$nextTick(()=>{
                        this.getRows()
                    })
                    return;
                }
                this.oldTextarea = this.textarea;
            },
            /**
             * 根据光标获取行数 （鼠标点击）
             */
            getRows(){
                let index = this.getCursortPosition(this.$refs.textarea)
                let temp = this.textarea.substr(0,index)
                this.rows = temp.split('\n').length
            }, 
            /**
             * 根据光标获取行数 （键盘回车，上移下移左移右移）
             */
            keyDownEvent(e){
                let code = [8,13,37,38,39,40]
                if(code.includes(e.keyCode)){
                    setTimeout(()=>{
                        let index = this.getCursortPosition(this.$refs.textarea)
                        let temp = this.textarea.substr(0,index)
                        this.rows = temp.split('\n').length
                    },1)
                }
            },
            /**
             * 获取光标的位置
             */
            getCursortPosition(dom){
                var cursorIndex = 0;
                if (document.selection) {
                    dom.focus();
                    var range = document.selection.createRange();
                    range.moveStart('character', -dom.value.length);
                    cursorIndex = range.text.length;
                } else if (dom.selectionStart || dom.selectionStart==0) {
                    cursorIndex = dom.selectionStart;
                }
                return cursorIndex;
            }, 
            /**
             * 粘贴事件
             */
            pasteEvent(){
                this.pasteFlag = true
            },
            //保存添加的电话号码
            saveTextareaInfo(){
                let list = [...new Set([...this.addTelephoneListCopy,...this.textarea.split('\n')])];              
                this.addTelephoneListCopy = list;       
                this.textarea ='';        
            },  
            removeSelectTelephone(index){
                var remDate =this.addTelephoneListCopy.splice(index, 1);
            },                                                      
    },
    watch: {
            radio(curVal,oldVal){
                this.radio = curVal;
            }
    },    
    mounted(){}
}
</script>
<style>
@import "../../../components/formSynthesisPlugin/my-component.css";
.userSelectListBtn .usersTitle{
    /* width: 70px; */
    text-align: left;
    padding: 0 12px 0 0;
    color: #606266;
    font-size: 14px;
    margin-bottom: 15px;
}
.telePhoneTextareas{
    height: 200px!important;
    resize: none!important;
    display: block;
    width: 200px;
    border-radius: 5px;
    border-color:#ddd;
    padding: 25px;
    line-height: 20px;
    padding: 25px;
    font-size: 14px;
}
.learnNumber{
    width: 200px;
    margin: auto;
}
.courseSelectListBtn,.userSelectListBtn{
        /* display: -webkit-inline-box; */
        margin: 15px 0;
}
.usersCount{
    display: -webkit-inline-box;
    margin: 15px 0;
}
.usersCount .usersList{
    height: 200px;
    overflow:auto;
    width: 200px;
    background: #fff;
    margin-left: 40px;
    padding: 0 0 0 10px;
}
.usersCount .usersList .usersListCount{
    position: relative;
}
.usersCount .usersList .usersListCount i{
    position: absolute;
    top: 8px;
    right: 0px;    
}
.usersCount .usersList .usersListCount p{
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;     
    width: 90%;
}
</style>
<style scoped lang="scss">
 .userTelePhoneSaveBut{
    margin: 0 auto 30px auto;
    width: 430px;
    div{
        width: 50px;
        height: 30px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        background: #9E0E00;
        color: #fff;    
        margin: auto;    
    }
}
</style>

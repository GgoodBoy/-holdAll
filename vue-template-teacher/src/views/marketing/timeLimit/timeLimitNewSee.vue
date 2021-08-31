<template>
    <div class="timeLimitNewEdit">
        <div class="lPadding20 timeLimitHeader">
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>         
        <div class="editContentTop"> 
            <div class="unifiedCss">
                <div class="titles beforeCss">活动名称</div>
                <div class="indexCss">
                    <!-- <el-input style="width:250px" maxlength='20' v-model="title" placeholder="请输入内容" show-word-limit></el-input> -->
                    <div>{{title}}</div>
                    <!-- <div v-if="false">活动名称不能为空</div> -->
                </div>
            </div>
            <div class="unifiedCss">
                <div class="titles beforeCss">活动时间</div>
                <div>
                    <!-- <el-date-picker
                        v-model="beginAt"
                        type="datetime"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                    <div v-if="false">活动名称不能为空</div> -->
                    <div>{{beginAt}}</div>
                </div>
                <div style="margin-left:10px;">至</div>
                <div style="margin-left:10px;">
                    <!-- <el-date-picker
                        v-model="endAt"
                        type="datetime"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                    <div v-if="false">活动名称不能为空</div> -->
                    <div>{{endAt}}</div>
                </div>                
            </div>            
        </div>
        <div class="editContentBut" >
            <div class="editFilterBox">
                <div class="leftBox" v-if="tableData.length>0">
                    <div class="leftBoxOne" v-if="batchDiscount">
                        <div class="oneContent">
                            <el-input style="width:150px" @change="inputchange2(batchDiscountVal,'batchDiscountVal',1)" v-model="batchDiscountVal" placeholder="保留小数点后1位"></el-input>
                            <div style="padding:0 15px;">折</div>
                            <el-button @click="isOkbatch(1)">确定</el-button>
                        </div>
                        <p v-if="Number(batchDiscountVal)>0?false:true">请输入正确折扣</p>
                    </div>
                    <div class="leftBoxOne" v-if="batchReducePrice">
                        <div class="oneContent">
                            <el-input style="width:150px" @change="inputchange2(batchReducePriceVal,'batchReducePriceVal',2)" v-model="batchReducePriceVal" placeholder="保留小数点后2位"></el-input>
                            <div style="padding:0 15px;">元</div>
                            <el-button @click="isOkbatch(2)">确定</el-button>
                        </div>
                        <p v-if="Number(batchReducePriceVal)>0?false:true">请输入正确价格</p>
                    </div>
                </div>
                <div  class="rightBox">
                    <!-- <el-button style="background:#b4272d;color:#fff;" @click="selectCourse">添加课程</el-button> -->
                    <p>本活动共包括{{tableData.length||0}}个课程</p>
                </div>
            </div>
            <div class="batchBut" v-if="tableData.length>0">
                <el-button style="background:#b4272d;color:#fff;" @click="selectBatchBut(1)">批量打折</el-button>
                <el-button style="background:#b4272d;color:#fff;" @click="selectBatchBut(2)">批量减价</el-button>
                <el-button style="background:#b4272d;color:#fff;" @click="selectBatchBut(3)">批量取消</el-button>
            </div>
            <div class="tableContent" v-if="tableData.length>0">
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    max-height="400"
                    v-loading="loading"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    label="序号"
                    prop="sortId"
                    min-width="60">
                    </el-table-column>
                    <el-table-column
                    label="名称"
                    min-width="150"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.courseName}}
                            </div>
                            <div>
                                <span v-if="scope.row.isUp==1">
                                    <i class="el-icon-warning" style="color:#b4272d;"></i>该课程已下架
                                </span>
                                <span v-else></span>
                            </div>
                        </template>                      
                    </el-table-column>
                    <el-table-column
                    prop="coursePrice"
                    label="原价"
                    min-width="80">
                    </el-table-column>
                    <el-table-column
                    label="促销"
                    min-width='400'>
                        <template slot-scope="scope">
                            <div class="tablePromotion">
                                <div>
                                    打折<el-input style="width:100px;margin:0 5px;" @change="inputchange(scope.row,1)" v-model="scope.row.discount" placeholder="0.00"></el-input>折
                                </div>
                                <div>
                                    满减<el-input style="width:100px;margin:0 5px;" @change="inputchange(scope.row,2)" v-model="scope.row.reducePrice" placeholder="0.00"></el-input>元
                                </div>
                                <div>
                                    促销价<el-input style="width:100px;margin:0 5px;" @change="inputchange(scope.row,3)" v-model="scope.row.PromotionPrice" placeholder="0.00"></el-input>元
                                </div>
                            </div>
                        </template>                    
                    </el-table-column>
                    <el-table-column
                    min-width='100'
                    label="操作">
                        <template slot-scope="scope">
                            <el-button
                            @click="deleteRow(scope.row)"
                            type="text"
                            size="small">
                            取消
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>              
            </div>
            <!-- <div style="text-align: center;">
                <el-button style="background:#b4272d;color:#fff;" @click="seaveTimeLimitDate">保存</el-button>   
                <el-button @click="removeEdit">取消</el-button>           
            </div> -->
        </div>  
        <el-dialog
            title=""
            :visible.sync="timeTypeDetail1"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定删除当前课程</p>
                <el-button style="background:#b4272d;color:#fff;" @click="detailDialog(1)">确定</el-button>
                <el-button @click="timeTypeDetail1=false">取消</el-button>
        </el-dialog>  
        <el-dialog
            title=""
            :visible.sync="timeTypeDetail3"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定删除当前批量课程</p>
                <el-button style="background:#b4272d;color:#fff;" @click="detailDialog(3)">确定</el-button>
                <el-button @click="timeTypeDetail3=false">取消</el-button>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="timeTypeDetail2"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定不保存直接返回？</p>
                <el-button style="background:#b4272d;color:#fff;" @click="detailDialog(2)">确定</el-button>
                <el-button @click="timeTypeDetail2=false">取消</el-button>
        </el-dialog>        
        <el-dialog
            :visible.sync="dialogVisibleFour"
            :close-on-press-escape='false'
            :close-on-click-modal="false"
            :show-close="false"
            width="50%"
        >
            <div class="centerCss">
                <courselist v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIds" :numbersBool="false" v-on:listSelect="listSelectEven"></courselist>      
            </div>                    
        </el-dialog>                                                  
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import courselist from './courseListTimeLimitModel'//课程组件
export default {
    components:{
        breadcrumb,
        courselist
    },
    data(){
        return {
            //新组建
            varObj:{
                pageType:true//是否分页
            },   
            courseIds:[],
            urls:'/discountsActivity/searchCourseListForDiscountsActivity',
            tableData: [],
            tableDataIdList:[],//选中的表单
            timeTypeDetail2:false,
            timeTypeDetail1:false,
            timeTypeDetail3:false,
            dialogVisibleFour:false,
            selectData:'',//选中的值
            batchDiscount:false,//批量折扣状态
            batchDiscountVal:0,//批量折扣值
            batchReducePrice:false,//批量减价状态
            batchReducePriceVal:0,//批量减价值
            loading:false,
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'限时购',
                            pathInfo:'/marketelist/timelimitNew'
                        },
                        {
                            name:'查看',
                            pathInfo:''
                        }                 
            ],
            beginAt:'',
            endAt:'',
            title:'',
            timeLimitId:'',//编辑id
            selectData:''//选中课程                                  
        }
    },
    created(){
        this.timeLimitId =this.$route.query.id;
        if(this.timeLimitId){
            //编辑回填
            this.getTimeLinitList();
        }else{
            //创建
        }
    },
    props:{},
    computed:{},
    watch:{
        tableDataIdList(news,olds){
            if(!news.length){
                this.batchDiscount=false;
                this.batchReducePrice = false;
            }
        },
        // endAt(news,olds){
        //     if(Number(news)>0){
        //         if(Number(news)<Number(this.beginAt)){
        //             this.endAt='';
        //         }
        //     }
        // },
        // beginAt(news,olds){
        //     if(Number(news)>0){
        //         if(Number(news)>Number(this.endAt)){
        //             this.beginAt='';
        //         }
        //     }
        // }
    },
    methods:{
        //三个批量设置按钮
        selectBatchBut(type){
            switch (type) {
                case 1:
                    if(this.tableDataIdList.length>0){
                        this.batchDiscount=true;
                        this.batchReducePrice = false;
                    }else{
                        this.$message.error("请选择打折课程");
                    }
                    break;
                case 2:
                    if(this.tableDataIdList.length>0){
                        this.batchReducePrice = true;
                        this.batchDiscount=false;
                    }else{
                        this.$message.error("请选择减价课程");
                    }                    
                    break;
                case 3:
                    if(this.tableDataIdList.length>0){
                        this.timeTypeDetail3 = true;
                        this.batchReducePrice = false;
                        this.batchDiscount=false;                        
                    }else{
                        this.$message.error("请选择取消课程");
                    }                    
                    break;
            
                default:
                    break;
            }
        },
        //确定批量折扣或者价格
        isOkbatch(type){
            switch (type) {
                case 1:
                    this.batchDiscountEven();
                    break;
                case 2:
                    this.batchReducePriceEven();
                    break;
                default:
                    break;
            }
        },
        //批量折扣
        batchDiscountEven(){
            let dataList  = this.tableData;
            this.tableDataIdList.forEach((element,index)=>{
                dataList.forEach((elementj,indexj)=>{
                    if(element.courseId==elementj.courseId){
                        elementj.discount=this.batchDiscountVal;
                        elementj.PromotionPrice=this.proving(JSON.stringify(Number(elementj.coursePrice)/10*Number(this.batchDiscountVal)),2);
                        // elementj.reducePrice=this.proving(JSON.stringify(Number(elementj.coursePrice)-Number(elementj.PromotionPrice)),2);
                        let reducePriceStr=this.proving(JSON.stringify((Number(elementj.coursePrice)*100-Number(elementj.PromotionPrice)*100)/100),2);
                        let lastStr = reducePriceStr.substring(reducePriceStr.length-1)
                        if(reducePriceStr.indexOf('.') != -1){
                            if(lastStr=='0'){
                                elementj.reducePrice = reducePriceStr.substring(0,reducePriceStr.length-1);
                            }else{
                                elementj.reducePrice = reducePriceStr;
                            }
                        }else{
                            elementj.reducePrice = reducePriceStr;
                        }
                        dataList.splice(indexj,1,elementj);
                    }
                });
            });
            this.tableData = dataList;
            this.batchDiscount=false;
        },
        //批量价格
        batchReducePriceEven(){
            let dataList  = this.tableData;
            this.tableDataIdList.forEach((element,index)=>{
                dataList.forEach((elementj,indexj)=>{
                    if(element.courseId==elementj.courseId){
                        elementj.reducePrice=this.batchReducePriceVal;
                        elementj.PromotionPrice=this.proving(JSON.stringify((Number(elementj.coursePrice)*100-Number(this.batchReducePriceVal)*100)/100),2);
                        elementj.discount=this.proving(JSON.stringify(Number(elementj.PromotionPrice)/Number(elementj.coursePrice)*10),2);
                        dataList.splice(indexj,1,elementj);
                    }
                });
            });
            this.tableData = dataList; 
            this.batchReducePrice = false;           
        },
        // //保存限时购
        // seaveTimeLimitDate(){
        //     var self = this;    
        //     let parems = {
        //         title:this.title,
        //         beginAt:this.formatDate(self.beginAt),
        //         endAt:this.formatDate(self.endAt)
        //     };
        //     let urls = '';
        //     this.tableData.forEach((element,index)=>{
        //         parems['discountsActivityDetailFormList['+index+'].courseId']=element.courseId;
        //         parems['discountsActivityDetailFormList['+index+'].discount']=element.discount;
        //         parems['discountsActivityDetailFormList['+index+'].reducePrice']=element.reducePrice;
        //     });
        //     if(this.timeLimitId){
        //         parems['id'] = this.timeLimitId;
        //         urls = self.$server.timeLimitUpdateDiscountsActivity
        //     }else{
        //         urls = self.$server.timeLimitAddDiscountsActivity
        //     }
        //     self.$http.post(urls,parems).then(res=>{
        //         if(res.status==200){
        //             this.$message.success(Number(this.timeLimitId)>0?'编辑成功':'创见成功');
        //             this.$router.push({path:'/marketelist/timelimitNew'});                                 
        //         }
        //     });             
        // },
        //取消限时购配置
        removeEdit(){
            this.timeTypeDetail2=true;
        },
        proving(data,num) {
            data = data.replace(/[^\d.]/g, '');
            data = data.replace(/^\./g, '');
            data = data.replace(/\.{2,}/g, '');
            data = data.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
            let index = -1
            for (let i in data) {
                if (data[i] === '.') {
                    index = i
                }
                if (index !== -1) {
                    if (i - index > num) {
                        data = data.substring(0, data.length-1)
                    }
                }
            }
            return data;
        },         
        inputchange2(data,keys,type){
            this[keys] = this.proving(data,type)
        },
        //修改数据计算价格
        inputchange(data,type){
                let uupdates={};
                if(type==1){
                    this.tableData.forEach((element,index)=>{
                        //discount 折扣
                        //reducePrice 降价
                        //PromotionPrice 促销价
                        //coursePrice 原价                      
                        if(element.sortId==data.sortId){
                            element.discount = this.proving(element.discount,1);
                            // element.PromotionPrice=this.proving(JSON.stringify(Number(data.coursePrice)/10*Number(data.discount)),2);
                            element.PromotionPricethis.proving(JSON.stringify(Number(data.coursePrice)*100*(Number(data.discount)*10)/10000),2);
                            element.reducePrice=this.proving(JSON.stringify(Number(data.coursePrice)-element.PromotionPrice),2);
                            uupdates = element;
                        }
                    });
                    this.tableData.splice(Number(data.sortId)-1,1,uupdates);    
                }else if(type==2){
                    this.tableData.forEach((element,index)=>{
                        if(element.sortId==data.sortId){
                            element.reducePrice = this.proving(element.reducePrice,2);
                            element.PromotionPrice=this.proving(JSON.stringify((Number(data.coursePrice)*100-Number(element.reducePrice)*100)/100),2);
                            element.discount=this.proving(JSON.stringify(element.PromotionPrice/Number(data.coursePrice)*10),1);
                            uupdates = element;
                        }
                    }); 
                    this.tableData.splice(Number(data.sortId)-1,1,uupdates);
                }else{
                    this.tableData.forEach((element,index)=>{
                        if(element.sortId==data.sortId){
                            element.PromotionPrice = this.proving(element.PromotionPrice,2);
                            element.reducePrice=this.proving(JSON.stringify((Number(data.coursePrice)*100-Number(element.PromotionPrice)*100)/100),2);
                            element.discount=this.proving(JSON.stringify(Number(data.PromotionPrice)/Number(data.coursePrice)*10),1);
                            uupdates = element;
                        }
                    }); 
                    this.tableData.splice(Number(data.sortId)-1,1,uupdates);
                }
        },
        //选择课程
        listSelectEven(data){
            var self = this;
            if(data.bool){
                // self.courseIds = [];
                self.dialogVisibleFour = false;
                let listCourse = [];
                data.datas.forEach((element,index)=>{
                    listCourse.push({
                        courseName:element.courseName,
                        courseId:element.courseId,
                        coursePrice:element.coursePrice,//原价
                        discount:element.discount||'0.0',//折扣
                        reducePrice:element.reducePrice||'0.00',//减价
                        PromotionPrice:element.PromotionPrice||'0.00',//促销价
                        sortId:index+1
                    })
                });                
                self.tableData = listCourse;
                data.datas.forEach(element => {
                    self.courseIds.push(element.courseId);
                });
            }else{
                self.dialogVisibleFour = false;
            }             
        },
        deleteRow(data){
            this.selectData = data;
            this.timeTypeDetail1=true;
        },
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },      
        handleSelectionChange(data){
            console.log('data',data);
            this.tableDataIdList = data;
        },
        //添加课程
        selectCourse(){
            this.dialogVisibleFour=true;
        },      
        detailDialog(type){
            let self = this;
            if(type==1){
                this.timeTypeDetail1=false;   
                let newDate=[];    
                let i = 0;
                let j = 0;
                self.tableData.forEach((element,index)=>{
                    if(element.sortId!=this.selectData.sortId){
                        if(i){
                            j = index+1-i
                            i=0;
                        }
                        let reducePriceStr = self.proving(JSON.stringify((Number(element.coursePrice)*100-Number(element.reducePrice)*100)/100),2);
                        let lastStr = reducePriceStr.substring(reducePriceStr.length-1);
                        let reducePriceVals = '';
                        if(reducePriceStr.indexOf('.') != -1){
                            if(lastStr=='0'){
                                reducePriceVals = reducePriceStr.substring(0,reducePriceStr.length-1);
                            }else{
                                reducePriceVals = reducePriceStr;
                            } 
                        }else{
                            reducePriceVals = reducePriceStr;
                        }
                        newDate.push(
                          {
                            "id":element.id,
                            "courseId":element.courseId,
                            "courseName":element.courseName,
                            'coursePrice':element.coursePrice||0,
                            "reducePrice":element.reducePrice,
                            "discount":element.discount,
                            "PromotionPrice":reducePriceVals,
                            "sortId":index-j+1                               
                          }
                        );  
                    }else{
                       i= index+1;
                    }
                });   
                self.tableData = newDate;        
            }else if(type==2){
                this.timeTypeDetail2=false;
                this.$router.push({path:'/marketelist/timelimitNew'});
            }else{
                this.timeTypeDetail3 = false;
            }                      
        }, 
        //转换时间到年月日时分秒
        formatDate(date){
            if(date){
                date = new Date(date);
                var y=date.getFullYear();
                var m=date.getMonth()+1;
                var d=date.getDate();
                var h=date.getHours();
                var m1=date.getMinutes();
                var s=date.getSeconds();
                m = m<10?("0"+m):m;
                d = d<10?("0"+d):d;
                h = h<10?("0"+h):h;
                m1 = m1<10?("0"+m1):m1;
                s = s < 10 ? ("0" + s) : s;
                return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
            }else{
                return '';
            }
        },  
        getTimeLinitList(){
            var self = this;    
            self.loading = true;   
            self.courseIds=[];
            self.$http.get(self.$server.timeLimitDetail+self.timeLimitId).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content;
                    this.title = contentdate.title;
                    this.beginAt = contentdate.beginAt;
                    this.endAt = contentdate.endAt;
                    listIds = contentdate.discountsActivityDetailList.map(function(element,index){
                        let reducePriceStr = self.proving(JSON.stringify((Number(element.coursePrice)*100-Number(element.reducePrice)*100)/100),2);
                        let lastStr = reducePriceStr.substring(reducePriceStr.length-1);
                        let reducePriceVals = '';
                        if(reducePriceStr.indexOf('.') != -1){
                            if(lastStr=='0'){
                                reducePriceVals = reducePriceStr.substring(0,reducePriceStr.length-1);
                            }else{
                                reducePriceVals = reducePriceStr;
                            }                              
                        }else{
                            reducePriceVals = reducePriceStr;
                        }
                       
                        let newdata = {
                            "id":element.id,
                            "courseId":element.courseId,
                            "courseName":element.courseName,
                            'coursePrice':element.coursePrice||0,
                            "reducePrice":element.reducePrice,
                            "discount":element.discount,
                            "PromotionPrice":reducePriceVals,
                            "sortId":index+1                            
                        }
                        self.courseIds.push(element.courseId);
                        return newdata;
                    });
                    self.tableData = listIds;
                    // sessionStorage.setItem('timeLimitCourseListVal',JSON.stringify(listIds));
                    self.$nextTick(function(){
                        self.loading = false; 
                    })                                     
                }
            });             
        }         
    },
    mounted(){}
}
</script>
<style scoped lang="scss">
@import "../../../components/formSynthesisPlugin/my-component.css";
.timeLimitNewEdit{
    background: #fff;
    .editContentTop{
        background: #F2F2F2;
        padding: 20px;
        .unifiedCss{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            position: relative;
            margin-bottom: 20px;
            .titles{
                margin-right: 20px;
            }
            .beforeCss:before {
                content: '* ';
                color: red;
                position: absolute;
                top: 5px;
                left:-6px;
            }     
        }
    }
    .editContentBut{
        padding: 20px;
        .editFilterBox{
            overflow: auto;
            zoom: 1;            
            .leftBox{
                float: left;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content:space-between;
                .leftBoxOne{
                    margin-right: 20px;
                    p{
                        color: #b4272d;
                    }
                    .oneContent{
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content:space-between;         
                        button{
                            background:#b4272d;
                            color:#fff;                       
                        }           
                    }
                }
            }
            .rightBox{
                float: right;
                button{
                    background:#b4272d;
                    color:#fff;                
                }
            }
        }
        .tableContent{
            padding: 30px 0;     
            .tablePromotion{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }     
        }
        .batchBut{
            margin: 20px 0 15px;
        }
    }
}
</style>
<style>
.timeLimitNewEdit .editContentTop .unifiedCss .indexCss .el-input .el-input__suffix{
    right: -40px !important;
}
.timeLimitNewEdit .editContentTop .unifiedCss .indexCss .el-input .el-input__suffix .el-input__count-inner{
    background: #EDF1F7 !important;
}
.tableContent .has-gutter th.el-table-column--selection .cell{
    display: block;
}
</style>


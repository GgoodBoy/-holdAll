<template>
    <div>
        <div>
            <Breadcrumb :menuList ='titleList' style="margin-bottom:20px"></Breadcrumb>
        </div>
        <div>
            <div>
                <div class="divBox">
                    <div class="titles">选择年月</div>
                    <div>   
                        <el-date-picker
                        v-model="value2"
                        style="width:150px;"
                        format="yyyy"
                        value-format="yyyy"
                        type="year"
                        @change="selectYear"
                        :picker-options="pickerOptionsYear"
                        placeholder="选择年">
                        </el-date-picker>
                        <el-date-picker
                        v-model="value1"
                        style="width:150px;"
                        class="monthChangeDivCss"
                        type="month"
                        format="MM"
                        @change='selectMonth'
                        value-format="yyyy-MM"
                        :picker-options="pickerOptionsMonth"
                        placeholder="选择月">
                        </el-date-picker> 
                    </div>
                </div>
                <div class="divBox">
                    <div class="titles">关联优惠券</div>
                    <div>                                
                        <el-select style="width:200px" v-model="value3" placeholder="选择优惠券ID" @change="selectWorkName">
                            <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            <div class="selectBox textEllipsis" style="float: left;width:100px;">{{ item.title }}</div>
                            <div style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</div>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="courseListCss">
                        <div class="li" v-if="selectedWorkName.title">
                            <div style="margin-right:20px;">{{selectedWorkName.title}}</div>
                            <div style="margin-right:10px;">{{selectedWorkName.id}}</div>
                            <div @click="removes(selectedWorkName.id)">
                                <i class="el-icon-circle-close" style='cursor: pointer;'></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divBox">
                    <div class="titles">添加课程</div>
                    <el-button class="lButtomOk" @click="curseclick">选课</el-button>
                </div>
            </div>
            <div>
                <el-table
                :data="courseList"
                border
                max-height="350"
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        label="序号"
                        align="center"
                        min-width="60">
                        <template slot-scope="scope">                                                             
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="courseName"
                        label="课程名称"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="sellingPrice"
                        label="原价"
                        align="center"
                        min-width="80"
                        >
                    </el-table-column>
                    <el-table-column
                        label="冰点价"
                        min-width="80"
                        >
                        <template slot-scope="scope">                                                             
                            <el-input placeholder="" v-model="promotionPrice[scope.$index]" @change="setTablePromotionPrice(scope.$index,promotionPrice[scope.$index])" style="width:100px;"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="80"
                        >
                        <template slot-scope="scope">                                                             
                            <el-button type="text" @click="removeTable(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>                                                                
                </el-table>                           
            </div>
            <div style="text-align:center;margin-top:20px;">
                <el-button style="background-color:#9e0e00;color:#fff" @click="save">确定</el-button>
                <el-button style="background-color:#ccc;color:#fff" @click="returns">取消</el-button>
            </div>
        </div> 
        <el-dialog
        :visible.sync="dialogVisibleFour"
        :close-on-press-escape='false'
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
            <div class="centerCss">
                   <courseListPlugin v-if="dialogVisibleFour" :varObjs='varObj' :urlPorp="urls" :chooseIdlist="courseIdList" :numbersBool="false" :courseType="courseselectType" v-on:listSelect="listSelectEven"></courseListPlugin>      
            </div>                    
        </el-dialog> 
    </div>
</template>
<script>
function formatDate(date,type){
    date = new Date(date);
    var y=date.getFullYear();
    var m=date.getMonth()+1;
    var d=date.getDate();
    // var h=date.getHours();
    // var m1=date.getMinutes();
    // var s=date.getSeconds();
    m = m<10?("0"+m):m;
    d = d<10?("0"+d):d;
    // return y+"/"+m+"/"+d+" "+h+":"+m1+":"+s;
    if(type=='year'){
            return y;
    }
    if(type=='month'){
            return m;
    }
    // return y+"-"+m+"-"+d;
}
import Breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { getToken,setToken,removeToken} from '@/utils/auth';
import courseListPlugin from "@/components/Appconfigpage/ACourseSelect/courseListPlugin";
export default {
    components:{
        Breadcrumb,
        // courseselect,
        courseListPlugin,
    },    
    data(){               
        return {          
            //新的项目
            tableData:[],
            loading:false,
            pageNo:1,
            pageSize:10,
            isAdd:true,
            disabledState:false,
            dialogVisibleFour:false,
            courseIdList:[],
            courseList:[],
            value1:'',
            value2:'',
            value3:'',
            options:[],
            selectedWorkName:{},
            isAdd:true,
            titleList:[
                {
                    name:'国学达人计划',
                    pathInfo:'/talentShow/carnival'
                },
                {
                    name:'达人狂欢节课程设置',
                    pathInfo:'/talentShow/carnival'
                },
                {
                    name:'添加狂欢节',
                    pathInfo:''
                }
            ],
            varObj:{
                pageType:false,//是否分页
                mtypeText:true,//是否显示成人少儿分类
                coursrTitleStr:'talentShow',
                pipelineType:true                
            },
            promotionPrice:[],//冰点集合
            urls:'/expertplan/getSelectCourseList',
            courseselectType:"talentShow",
            id:'',
            pickerOptionsYear:{
                disabledDate (time) {
                    return time.getFullYear() < Number(formatDate(Date.now(),'year'));//选当前时间之前的时间
                }
            },
            pickerOptionsMonth:{
                disabledDate:this.disabledDate
            },
            yearData:''
    }},
    created(){   
        this.id = this.$route.query.id;
        if(this.id){
            this.isAdd = false;
            this.gettalenDetail(); 
        }else{
            this.isAdd = true;
            this.getCouponList('');
        }
    },
    props:[],
    computed:{  },        
    methods:{  
            selectMonth(data){
                this.value2 = formatDate(data,'year')+'';
            },
            selectYear(time){
                this.value1 = '';
                let self = this;
                if(Number(time)==Number(formatDate(Date.now(),'year'))){
                    this.value1 = time+'-'+Number(formatDate(Date.now(),'month'));
                }else{
                    this.value1 = time+'-01';
                }
                self.yearData = time;
            },
            disabledDate(time){ 
                if(this.yearData){
                    if(Number(this.yearData) > Number(formatDate(time,'year'))){
                        return true;
                    } else if(Number(this.yearData) == Number(formatDate(time,'year'))&&Number(formatDate(time,'year'))==Number(formatDate(Date.now(),'year'))){
                        return time.getMonth()+1 < Number(formatDate(Date.now(),'month'));
                    } else if(Number(this.yearData) == Number(formatDate(time,'year'))&&Number(formatDate(time,'year'))>Number(formatDate(Date.now(),'year'))){
                        return false;
                    }else if(Number(this.yearData) < Number(formatDate(time,'year'))){
                        return false;
                    }
                }else{
                    return true;
                }                
            },
            removes(id){
                var self = this;      
                this.selectedWorkName =[];  
                this.value3=''; 
            },
            returns(){
                this.$router.push({path:"/talentShow/carnival"});
            },
            save(){
                if(!this.value1||!this.value2||!this.value3){
                    this.$message.error("请完善信息。");
                    return;
                }
                let params = {
                    year:this.value2,
                    month:Number(formatDate(this.value1,'month')),
                    couponId:this.value3,
                };
                let boos = true;
                this.courseList.forEach((element,index)=>{
                    if(!Number(element.promotionPrice)){
                        boos = false;
                    }
                    params['carnivalCourseForms['+index+'].courseId']=element.content;
                    params['carnivalCourseForms['+index+'].promotionPrice']=element.promotionPrice;
                });
                if(!boos){
                    this.$message.error("请完善冰点价。");
                    return;                    
                }
                if(!this.isAdd){
                    params['id']=this.id;
                }
                this.$http.post(this.$server.getExpertEditCarnival,params).then(res=>{
                    if(res.status==200){
                        this.$message.success(this.isAdd?'创建完成.':'修改完成.');
                        this.$router.push({path:"/talentShow/carnival"});
                    }
                })                
            }, 
            removeTable(index){
                this.courseList.splice(Number(index),1);
                this.courseIdList.splice(Number(index),1);
                this.promotionPrice.splice(Number(index),1);
            },
            getCouponList(couponId){
                this.options=[];
                let query = {
                    params:{
                        id:this.id||''
                    }
                }
                this.$http.get(this.$server.getExpertCouponList,query).then(res=>{
                    if(res.status==200){
                        this.options = res.content;  
                        if(couponId){
                            this.value3=couponId
                        }              
                    }
                })                
            },
            setTablePromotionPrice(index,val){
                this.courseList[Number(index)].promotionPrice = val;
            },  
            //点击课程弹框
            curseclick(){
            //   this.$store.state.appConfig.appStore.boolpluginForDetail=true;
                this.dialogVisibleFour = true;
            },        
            //点击课程数据渲染
            listSelectEven(data){
                var self = this;
                let listIds =[];
                if(data.bool){
                    // self.courseIdList = [];
                    self.dialogVisibleFour = false;
                    data.datas.forEach(function(element,index){
                        var idIndex = self.courseIdList.indexOf(Number(element.content));
                        if(idIndex==-1){
                            element['promotionPrice'] = '';
                            self.promotionPrice.unshift('');
                            listIds.push(element);
                        }
                    }); 
                    self.courseList = listIds.concat(self.courseList);
                    data.datas.forEach(element => {
                        var idIndex = self.courseIdList.indexOf(Number(element.content));
                        if(idIndex==-1){
                            self.courseIdList.push(Number(element.content));
                        }
                    });
                }else{
                    self.dialogVisibleFour = false;
                }
            }, 
            gettalenDetail(num){
                var self = this;
                self.loading = true;
                self.$http.get(self.$server.getExpertCarnivalDetail+self.id).then(res=>{
                if(res.status==200){
                    var listIds = [];
                    var contentdate = res.content; 
                    self.courseList = [];
                    // self.value1=Number(contentdate.carnival.month)>9?contentdate.carnival.month+'':'0'+contentdate.carnival.month;
                    self.value1=contentdate.carnival.year+'-'+(Number(contentdate.carnival.month)>9?contentdate.carnival.month+'':'0'+contentdate.carnival.month);
                    self.value2=contentdate.carnival.year+'';
                    self.yearData = contentdate.carnival.year;
                    contentdate.courses.forEach((elements,index)=>{
                        self.courseList.push(
                            {
                                "content":elements.courseId,
                                "courseName":elements.courseName,
                                "no":'',
                                "originalPrice":0,
                                "sellingPrice":elements.sellingPrice,
                                "promotionPrice":elements.promotionPrice
                            }
                        );
                        self.promotionPrice.push(elements.promotionPrice);
                    });
                    self.courseIdList = contentdate.courses.map(x=>{
                        return Number(x.courseId);
                    }); 
                    self.getCouponList(contentdate.carnival.couponId);
                    self.loading = false; 
                }
            })            
        },   
        selectWorkName(id){
            this.selectedWorkName = {};
            this.selectedWorkName = this.options.find((item)=>{//这里的chargingWorkNameList就是上面遍历的数据源
                return item.id === id;
                //筛选出匹配数据，是对应数据的整个对象
            });
        },                               
    },
    watch: {}, 
    mounted(){}
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
</style>
<style lang="scss" scoped>
    .textAlign{
        text-align: right;
    }
    .divBox{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: row;
        margin-bottom: 15px;
        .titles{
            width: 100px;
            text-align: left;
        }
        .courseListCss{
            .li{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: row;
                margin-left: 10px;
                font-size: 15px;
                border: 1px solid #fff;
                color: #666;
                border-radius: 4px;
                padding:3px 10px;
            }
        }
    }
    .block{
        background:#fff;
        padding:15px 0;
        text-align: center;
    }
</style>



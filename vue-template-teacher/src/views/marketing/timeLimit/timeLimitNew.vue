<template>
    <div class="timeLimitNew">
        <div class="lPadding20 timeLimitHeader">
            <breadcrumb :menuList ='titleList'></breadcrumb>
            <div class="releaseTimeLimit" @click="switchSecondEven" v-if="$authJudge('market:discounts:add')">发布限时购活动</div>
        </div>         
        <div class="timeLimitFilter">
            <el-input style="width:250px" v-model="title" placeholder="请输入内容"></el-input>
            <el-select style="width:160px;margin-left:5px;" v-model="status" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-button style="margin-left:5px;background:#b4272d;color:#fff;" @click="select" v-if="$authJudge('market:discounts:select')">搜索</el-button>            
        </div>
       <div class="tableBox">
            <el-table
                :data="tableData"
                border
                header-cell-class-name="list-header-layout-bg"
                v-loading="loading"
                :header-cell-style="tableHeaderColor"
                max-height="600"
                style="width: 100%">               
                    <el-table-column
                        prop="sortId"
                        label="序号"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="活动"
                        align="center"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="活动时间"
                        :show-overflow-tooltip='true'
                        align="center"
                        min-width="220">
                        <template slot-scope="scope">
                            <p>
                                <span>{{scope.row.beginAt}}</span>
                                至
                                <span>{{scope.row.endAt}}</span>
                            </p>
                        </template>
                    </el-table-column>               
                    <el-table-column
                        label="活动状态"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="60">
                        <template slot-scope="scope">
                            <p>
                                <span v-if="scope.row.status==1">未开始</span>
                                <span v-else-if="scope.row.status==2">进行中</span>
                                <span v-else>已结束</span>
                            </p>
                        </template>
                    </el-table-column>            
                    <el-table-column
                        label="是否使用优惠券"
                        align="center"
                        :show-overflow-tooltip='true'
                        min-width="120">
                        <template slot-scope="scope">
                            <p>
                                <span v-if="scope.row.useCoupon==1">是</span>
                                <span v-else-if="scope.row.useCoupon==2">否</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="courseNum"
                        label="课程数"
                        align="center"
                        min-width="60">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    align="center"
                    fixed="right"
                    min-width="120"
                    >  
                        <template slot-scope="scope">
                            <div>
                                <el-button @click="handleClick(scope.row,1)" v-if="scope.row.status!=3&&$authJudge('market:discounts:endnow')" type="text" size="small" >立即结束</el-button>
                                <el-button @click="handleClick(scope.row,2)" v-if="scope.row.status!=3&&$authJudge('market:discounts:edit')" type="text" size="small" >编辑</el-button>
                                <el-button @click="handleClick(scope.row,3)" v-if="scope.row.status==3&&$authJudge('market:discounts:delete')" type="text" size="small" >删除</el-button>
                                <el-button @click="handleClick(scope.row,4)" v-if="scope.row.status==3&&$authJudge('market:discounts:detail')" type="text" size="small" >查看</el-button> 
                            </div>                                                                                 
                        </template> 
                    </el-table-column>                              
            </el-table> 
            <div class="block">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="childPageValue"
                    :current-page.sync="pageAtion.paginationPage"
                    :total="pageAtion.pageTotal">
                </el-pagination>
            </div>                           
        </div>  
        <el-dialog
            title=""
            :visible.sync="timeTypeDetail1"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定删除当前活动</p>
                <el-button type="primary" @click="detailDialog(1)">确定</el-button>
                <el-button @click="timeTypeDetail1=false">取消</el-button>
        </el-dialog> 
        <el-dialog
            title=""
            :visible.sync="timeTypeDetail2"
            width="20%"
            class="lCenter-r">
                <p style="margin-bottom:15px;">确定立即结束当前活动结束后不能重新开始</p>
                <el-button type="primary" @click="detailDialog(2)">确定</el-button>
                <el-button @click="timeTypeDetail2=false">取消</el-button>
        </el-dialog>                                             
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    components:{
        breadcrumb
    },
    data(){
        return {
            tableData:[],
            timeTypeDetail1:false,
            timeTypeDetail2:false,
            selectData:'',
            loading:false,
            titleList:[
                        {
                            name:'系统合集',
                            pathInfo:'/marketelistlist'
                        },
                        {
                            name:'限时购',
                            pathInfo:''
                        }               
            ],
            options: [
                 {
                value: -1,
                label: '全部'
                },{
                value: 1,
                label: '未开始'
                }, {
                value: 2,
                label: '进行中'
                }, {
                value: 3,
                label: '已结束'
                }
            ],
            status: -1,
            title:'',
            pageNo:1,
            pageSize:10,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            },                                  
        }
    },
    created(){
        this.getTimeLinitList(1);
    },
    props:{},
    computed:{},
    methods:{
        // 修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color: #F3F3F3;font-weight: 500;font-size: 16px;'
            }
        },      
        select(){
            this.getTimeLinitList(1);
        },   
        detailDialog(type){
            let self = this;
            if(type==1){
                self.$http.post(self.$server.timeLimitNewdelete+this.selectData.id,{}).then(res=>{
                    if(res.status==200){
                        self.timeTypeDetail1=false;
                        if(self.tableData.length==1){
                            if(self.pageNo>1){
                                self.getTimeLinitList(self.pageNo-1);
                            }else{
                                self.getTimeLinitList(1);
                            }
                        }else{
                            self.getTimeLinitList(self.pageNo);
                        }
                    }
                });
            }else{
                self.$http.post(self.$server.timeLimitNewEndNow+this.selectData.id,{}).then(res=>{
                    if(res.status==200){
                        self.timeTypeDetail2=false;
                        self.getTimeLinitList(self.pageNo);
                    }
                });
            }                         
        },
        handleClick(e,f){
            this.selectData = e;
            switch (f) {
                case 1:
                    this.timeTypeDetail2=true;
                    break;
                case 2:
                    this.$router.push({path:'/marketelist/timelimit/timeLimitNewEdit',query: {id: e.id}});
                    break;
                case 3:
                    this.timeTypeDetail1=true;
                    break;
                case 4:
                    this.$router.push({path:'/marketelist/timelimit/timeLimitNewSee',query: {id: e.id}});
                    break;
            
                default:
                    break;
            }
        },
        switchSecondEven(){
            this.$router.push({path:'/marketelist/timelimit/timeLimitNewEdit'});
        },        
        childPageValue(num){
            this.selectPageNum = Number(num);
            if(Number(num)>0){
                this.getTimeLinitList(Number(num))
            }            
        }, 
        getTimeLinitList(num){
            var self = this;    
            self.loading = true;  
            if(num){
                self.pageNo = num;
            }            
            let querys = {
                params:{
                    title:self.title,
                    status:self.status,
                    pageNo:self.pageNo,
                    pageSize:self.pageSize
                }
            };    
            self.$http.get(self.$server.timeLimitNewGetDiscountsActivityList,querys).then(res=>{
                if(res.status==200){
                   var listIds = [];
                   var contentdate = res.content;
                   var nextPage = contentdate.nextPage;
                   var prePage = contentdate.prePage;
                   if(contentdate.list.length){
                        // if(!prePage&&!nextPage){
                        //     listIds = contentdate.list.map(function(element,index){
                        //         element.sortId = index+1;
                        //         return element;
                        //     });
                        // }else{
                        //     listIds = contentdate.list.map(function(element,index){
                        //         element.sortId = prePage*10+index+1;
                        //         return element;
                        //     });                            
                        // } 
                        if(!prePage&&!nextPage){
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-index;
                                return element;
                            });
                        }else{
                            listIds = contentdate.list.map(function(element,index){
                                element.sortId = contentdate.total-(self.pageNo-1)*10-index;
                                return element;
                            });                            
                        }      
                   };
                    self.tableData = listIds;
                    self.pageAtion.pageTotal = contentdate.total;
                    self.pageAtion.paginationPage = self.pageNo;
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
.timeLimitNew{
    .timeLimitHeader{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .releaseTimeLimit{
            padding: 10px 15px;
            background:#b4272d;;
            border-radius: 6px;
            color: #fff;
            cursor: pointer;
        }
    }
    .timeLimitFilter{
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;        
    }
    .tableBox{
        margin-top: 10px;
        .block{
            text-align: center;
            margin-top:10px;
            padding-bottom:60px;
        }        
    }
}
</style>


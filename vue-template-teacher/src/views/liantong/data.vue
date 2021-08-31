<template>
    <div class="liantong-page-wrap">
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <breadcrumb :menuList ='titleList'></breadcrumb>
                </el-col>
            </el-row>
            <el-button size="small" type="primary">数据</el-button>
            <el-button size="small" @click="toDetail">详情</el-button>
        </div>
        <div class="page-content">
            <p class="total-people">总订购用户数：{{userCount}}人</p>
            <div class="buyNumCount">
                <p class="title">订购数量</p>
                <div class="item" v-for="(item,index) in countData" :key="index">
                    <div class="item-box">
                        <i :class="item.className"></i>
                        <p class="percent">{{item.percent}}</p>
                        <p class="num">数量：{{item.num}}</p>
                    </div>
                </div>
            </div>
            <div class="browse-num">
                <p class="title">观看次数</p>
                <div class="echart-box"></div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import echarts from 'echarts'
import 'echarts/lib/chart/bar'
export default {
    data(){
        return{
            titleList:[
                {
                    name:'流量包管理',
                    pathInfo:'/liantongManage/list'
                },
                {
                    name:'明细',
                    pathInfo:''
                }
            ],
            id:'',
            userCount:'-',
            countData:[
                {
                    className:'el-icon-user-solid',
                    percent:'新用户：0',
                    num:'0'
                },
                {
                    className:'el-icon-user',
                    percent:'老用户：0',
                    num:'0'
                },
            ]
        }
    },
    components: {
        breadcrumb
    },
    created(){
        this.id = this.$route.params.id;
        this.detailInfo()
    },
    mounted(){

    },
    methods:{
        toDetail(){
            this.$router.push(`/liantongManage/detail/${this.$route.params.id}`)
        },
        /**
         * 获取明细
         */
        detailInfo(){
            let loadingInstance = this.$loading({
                target:document.querySelector('.page-content')
            });
            let query = {
                params:{
                    id:this.id
                }
            }
            this.$http.get(this.$server.detailInfo,query).then(res=>{
                if(res.status==200){
                    this.userCount = res.content.userCount;
                    if(res.content.userCount>0){
                        this.countData = [
                            {
                                className:'el-icon-user-solid',
                                percent:res.content.newUserCount>=0?`新用户：${((res.content.newUserCount/res.content.userCount)*100).toFixed(2)}%`:'新用户：-',
                                num:res.content.newUserCount>=0?res.content.newUserCount:'-'
                            },
                            {
                                className:'el-icon-user',
                                percent:res.content.oldUserCount>=0?`老用户：${((res.content.oldUserCount/res.content.userCount)*100).toFixed(2)}%`:'老用户：-',
                                num:res.content.oldUserCount>=0?res.content.oldUserCount:'-'
                            },
                        ]
                    }
                    let xData = Object.keys(res.content.map1)
                    if(xData.length>0){
                        let yData = Object.values(res.content.map1);
                        let myChart = echarts.init(document.querySelector('.echart-box'));
                        myChart.setOption({
                            tooltip : {
                                trigger : 'axis',
                                showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid:{//直角坐标系内绘图网格
                                show:true,//是否显示直角坐标系网格。[ default: false ]
                                bottom:"20%"
                            },
                            xAxis: {
                                type: 'category',
                                data: xData,
                                axisLabel : {//坐标轴刻度标签的相关设置。
                                    formatter : function(params){
                                    var newParamsName = "";// 最终拼接成的字符串
                                                var paramsNameNumber = params.length;// 实际标签的个数
                                                var provideNumber = 4;// 每行能显示的字的个数
                                                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                                                /**
                                                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                                                 */
                                                // 条件等同于rowNumber>1
                                                if (paramsNameNumber > provideNumber) {
                                                    /** 循环每一行,p表示行 */
                                                    for (var p = 0; p < rowNumber; p++) {
                                                        var tempStr = "";// 表示每一次截取的字符串
                                                        var start = p * provideNumber;// 开始截取的位置
                                                        var end = start + provideNumber;// 结束截取的位置
                                                        // 此处特殊处理最后一行的索引值
                                                        if (p == rowNumber - 1) {
                                                            // 最后一次不换行
                                                            tempStr = params.substring(start, paramsNameNumber);
                                                        } else {
                                                            // 每一次拼接字符串并换行
                                                            tempStr = params.substring(start, end) + "\n";
                                                        }
                                                        newParamsName += tempStr;// 最终拼成的字符串
                                                    }

                                                } else {
                                                    // 将旧标签的值赋给新标签
                                                    newParamsName = params;
                                                }
                                                //将最终的字符串返回
                                                return newParamsName
                                    }
                                }
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: yData,
                                type: 'bar',
                                barWidth:'30'
                            }]
                        })
                    }
                    loadingInstance.close()
                }
            }).catch(()=>{
                loadingInstance.close()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .liantong-page-wrap{
        .page-header{
            background: #fff;
            padding: 20px;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        }
        .page-content {
            background: #fff;
            box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
            padding: 20px;
            font-size: 16px;
            margin-top:20px;
            .total-people{
                text-align: center;
                font-size: 18px;
            }
            .buyNumCount{
                .title{
                    font-size: 16px;
                    margin:10px 0;
                }
                .item{
                    display: inline-block;
                    vertical-align: middle;
                    width:49%;
                    text-align: center;
                    .item-box{
                        display: inline-block;
                    }
                    i{
                        font-size: 100px;
                        color:#c30d23;
                        transition: all 0.3s;
                        &:hover{
                            color:#9E0E00;
                        }
                    }
                    p{
                        margin:10px 0;
                        text-align: left;

                    }
                }
            }
            .browse-num{
                margin-top:30px;
                .echart-box{
                    width: 90%;
                    min-width: 600px;
                    height: 400px;;
                }
            }
        }
    }
</style>

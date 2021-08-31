<template>
    <div class="game-answer">
        <div>
            <breadcrumb :menuList ='titleList'></breadcrumb>
        </div>
        <div class="headers">
          
        </div>
        <div class="content">
       
        </div>      
    </div>
</template>

<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
import { Switch } from 'element-ui';
export default {
    data() {
        return {
            input:'',
            value:'',
            tableData:[
                {
                    sortId:1,
                    courseName:'傻逼',
                    coursePrice:1
                }
            ],
            loading:false,
            visibleDetail:false,
            options:[],
            titleList:[
                        {
                            name:'小程序',
                            pathInfo:''
                        },
                        {
                            name:'添加答题',
                            pathInfo:''
                        }],
            pageNo:1,
            pageSize:10,
            pageAtion:{
                paginationPage:1,
                pageTotal:0
            }
        };
    },
    components: {
        breadcrumb
    },
    watch: {},
    created() {
    },
    methods: {
        detailDialog(){

        },
        operationRow(data,type){
            switch (type) {
                case 1:
                    
                    break;
                case 2:
                    this.$router.push({path:'/smallProgram/game/gameSee'});
                    break;
                case 3:
                    this.$router.push({path:'/smallProgram/game/detail'});
                    break;
                case 4:
                    this.visibleDetail = true;
                    break;
            
                default:
                    break;
            }
        },
        childPageValue(num){
            // this.selectPageNum = Number(num);
            if(Number(num)>0){
                // this.getSchoolList(Number(num))
            }            
        },
        goTo(){
            this.$router.push({path:'/smallProgram/game/edit'});
        }        
    }
};
</script>

<style scoped lang="scss">
    .game-answer {
        .headers{
            padding: 20px;
            .one{
                text-align: right;
            }
            .two{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .left{
                    display: flex;
                    flex-direction: row;
                    justify-content:space-around;
                    align-items: center;     
                    .selectBox{
                        display: flex;
                        flex-direction: row;
                        justify-content:space-evenly;
                        align-items: center; 
                        margin-right: 5px;   
                        .title{
                            width: 30px;
                            text-align: right;
                            margin-right: 5px;
                        }                     
                    }               
                }
            }
        }
        .content{   
            .block{
                text-align: center;
                margin-top:10px;
                padding-bottom:60px;
            }
        }
        .lCenter-r{
            text-align: center;
        }
    }
</style>


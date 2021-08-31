<template>
    <div class="module-edit guess-like-edit">
        <div class="module-edit-header clearfix">
            <p class="title" ref="title">猜你喜欢</p>
            <el-button v-if="$authJudge('homeset:appadult:savedata')" type="primary" size="small" @click="saveData">保存</el-button>
        </div>
        <div class="module-edit-body">
            <div class="module-name">
                <label>模块名称</label>
                <div class="input-area"><el-input size="medium" v-model="editData.name" maxlength="10"></el-input></div>
                <p>{{editData.name?editData.name.length:0}}/10</p>
            </div>
            <div class="clearfix styles">
                <label>样式</label>
                <el-select v-model="styleVal" size="small">
                    <el-option v-for="item in styleOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <!-- <img src="" class="thumbnail"/> -->
                <div class="question">
                    <i class=" el-icon-question"></i>
                    <div class="real-img" :class="styleVal==1?'style1':'style2'"></div>
                </div>
            </div>
            <div class="number">
                <p>展示数量</p>
                <el-select v-model="curEditData.number" size="small">
                    <el-option v-for="item in numberOption"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>    
</template>
<script>
import {mapActions} from 'vuex'
export default {
    data(){
        return {
            homeCloumnId:'',
            cloumnTitle:'',
            moduleId:'',
            styleOption:[
                {label:'样式一',value:'1'},
                {label:'样式二',value:'2'},
            ],
            styleVal:'1',
            numberOption:[
                {value:'1'},{value:'2'},{value:'3'},{value:'4'},{value:'5'},{value:'6'},{value:'7'},{value:'8'},
            ],
        }
    },
    computed:{
        adultHomeEditData(){
            return this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).data;
        },
        /**
         * 猜你喜欢总数据
         */
        editData(){
            let obj = this.adultHomeEditData.find(item=>item.isFocus==true)
            if(obj){
                let localId = obj.localId;
                return this.$store.state.homeConfig.adultHomeModuleChildData.find(item=>item.localId==localId);
            }else{
                return []
            }
        },
        /**
         * 当前猜你喜欢数据(具体到样式下)
         */
        curEditData(){
            if(this.editData.data&&this.editData.data.length>0){
                let temp = this.editData.data.find(item=>item.active==true)
                return temp?temp.guessLikeData:[];
            }
            else{
                return [];
            }
        },
        moduleName(){
            return this.editData.name;
        }
    },
    watch:{
        styleVal(cur,old){
            let obj = this.editData.data.find(item=>item.styleType==cur);
            this.editData.data.forEach(item=>item.active=false)
            obj.active = true;
            this.editData.style = cur;
        },
        moduleName(cur,old){
            this.editData.inEdit = true;
        },
        curEditData:{
            handler(cur,old){
                if(this.editData.initData){
                    this.editData.inEdit = false;
                    delete this.editData.initData;
                }else{
                    if(this.editData.compareFlag){
                        let tempCur = JSON.stringify(cur);
                        let tempOld = JSON.stringify(old);
                        this.editData.inEdit = tempCur==tempOld && this.editData.saveDataFlag ? false:true
                        delete this.editData.compareFlag;
                    }else{
                        console.log('动了数据')
                        this.editData.inEdit = true;
                        this.editData.saveDataFlag = false;
                    }
                }
            },
            deep:true
        },
    },
    created(){
        setTimeout(()=>{
            this.homeCloumnId = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabId;
            this.cloumnTitle = this.$store.state.homeConfig.adultHomeEditData.find(item=>item.active==true).tabName;
            this.homeCloumnId = this.homeCloumnId<0?'':this.homeCloumnId
        },1)
    },
    mounted(){
        this.initData()
    },
    methods:{
        ...mapActions(['setHomeCloumnId']),
        initData(){
            let {id} = this.editData;
            this.moduleId = id!=-1?id:''
            if(this.editData.data.length==0){
                if(id==-1){
                    this.styleVal = '1';
                    let editChildData = [
                        {styleType:'1',guessLikeData:{number:'1'},active:true},
                        {styleType:'2',guessLikeData:{number:'1'},active:false}
                    ]
                    this.editData.data = editChildData;
                }else{
                    this.getSubModuleInfoList(id)
                }
            }else{
                let obj = this.editData.data.find(item=>item.active==true)
                this.styleVal = obj.styleType;
                this.editData.compareFlag = true;
            }
        },
        /**
         * 查询app首页子模板数据列表
         */
        getSubModuleInfoList(id){
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            this.$http.get(`${this.$server.getSubModuleInfoList}/${id}`).then(res=>{
                loadingInstance.close()
                if(res.status==200){
                    if(this.moduleId!=this.editData.id) return;//防止选择模块过快，造成数据缓存有误
                    this.styleVal = String(res.content.style)
                    let guessLikeData = {
                        number:String(res.content.num)
                    }
                    let editChildData = [
                        {styleType:'1',guessLikeData:res.content.style==1?guessLikeData:{number:'1'},active:res.content.style==1?true:false},
                        {styleType:'2',guessLikeData:res.content.style==2?guessLikeData:{number:'1'},active:res.content.style==2?true:false}
                    ]
                    this.editData.data = editChildData;
                    this.editData.initData = true;
                    this.editData.saveDataFlag = true;
                }
            })
        },
        /**
         * 保存数据
         */
        saveData(){
            let query = {
                id:this.moduleId,
                homeCloumnId:this.homeCloumnId,
                name:this.editData.name,
                type:1,
                subModule:4,
                style:this.styleVal,
                styleImgUrl:'https://youfuedu.oss-cn-beijing.aliyuncs.com/testxgxw/abe7114c-c7ea-4ed4-99ed-04b37b31f4f2.png',
                num:this.curEditData.number,
                targetId:0,
            }
            if(this.homeCloumnId==''){
                query.cloumnTitle = this.cloumnTitle
            }
            let loadingInstance = this.$loading({
                target:document.querySelector('.module-edit')
            });
            this.$http.post(this.$server.saveSubModule,query,{headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res=>{
                loadingInstance.close();
                if(res.status==200){
                    let temp = this.adultHomeEditData.find(item=>item.localId == this.editData.localId)
                    temp.id = res.content.subModuleId;
                    this.setHomeCloumnId(res.content.homeCloumnId)
                    this.moduleId = res.content.subModuleId;
                    this.editData.data.find(item=>item.active == false).guessLikeData = {number:'1'}
                    this.editData.inEdit = false;
                    this.editData.saveDataFlag = true;
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                }
            })
        }  
    }
}
</script>
<style lang="scss" scoped>
    .module-edit{
        font-size: 14px;
        height: 100%;
        .module-edit-header{
            padding-bottom:10px;
            line-height: 32px;
            border-bottom: 1px solid #dfdfdf;
            p{
                float: left;
                font-size: 16px;
            }
            button{
                float: right;
            }
        }
        .module-edit-body{
            padding: 10px 0;
            height: calc(100% - 43px);
            overflow-y: auto;
            overflow-x:hidden;
            label{
                width: 56px;
                text-align: right;
                display: inline-block;
                vertical-align: middle;
            }
            .module-name{
                .input-area,p{
                    display: inline-block;
                    vertical-align: middle;
                }
                .input-area{
                    width: 200px;
                    margin:0 10px 0 5px;
                }
            }
            .styles{
                margin:20px 0;
                position: relative;
                text-align: left;
                .el-select{
                    margin:0 5px;
                }
                .thumbnail{
                    display: inline-block;
                    vertical-align: middle;
                    width: 79px;
                    height: 32px;
                    border-bottom: 3px;
                }
                .question{
                    position: absolute;
                    top:-9px;
                    left: 265px;
                    font-size: 18px;
                    color:#bbb;
                    i{
                        position: absolute;
                        top:0;
                        left:0;
                    }
                    &:hover{
                        .real-img{
                            visibility:visible;
                            opacity: 1;
                            &:hover{
                                visibility:hidden!important;
                                opacity: 0!important;
                            }
                        }
                    }
                }
                .real-img{
                    margin:9px 0 0 24px;
                    visibility:hidden;
                    opacity: 0;
                    transition: all 0.3s;
                    &.style1{
                        width: 345px;
                        height: 86px;
                        transform: scale(0.8) translate(-10%,-10%);
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/cnxh/cnxh1.png')no-repeat 50% 50% /cover;
                    }
                    &.style2{
                        width: 166px;
                        height: 185px;
                        transform: scale(0.8) translate(-10%,-10%);
                        background: url('https://xgxw-pic.oss-cn-beijing.aliyuncs.com/zwt/chengren/mk1/cnxh/cnxh2.png')no-repeat 50% 50% /cover;
                    }
                }
            }
            .number{
                position: relative;
                margin:20px 0;
                p{
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 26px;
                    width: 56px;
                    text-align: right;
                    margin-right: 5px;
                }
                p+p{
                    border:1px solid #dfdfdf;
                    width: 60px;
                    text-align: center;
                    border-radius: 3px;
                }
                .question{
                    position: absolute;
                    top:-9px;
                    left: 130px;
                    font-size: 18px;
                    color:#bbb
                }
            }
            button{
                margin-left: 5px;
            }
        }
        .edit-dialog{
            left: 5%;
            .search{
                font-size: 0;
                .el-input{
                    display: inline-block;
                    vertical-align: middle;
                    width: calc(100% - 78px);
                }
                button{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 8px;
                }
            }
            .list{
                margin:10px 0;
                max-height: 500px;
                overflow: auto;
                .item{
                    margin:10px 0;
                    .course-name{
                        width: 310px;
                    }
                } 
            }
            .btns{
                text-align: center;
            }
        }
    }
</style>


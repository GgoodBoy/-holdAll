<template>
    <div>
        <div class="page-header">
            <el-row>
                <el-col :span="4">
                    <h3 class="page-title">学校管理</h3>
                </el-col>
                <el-col :span="2" :offset="18">
                    <el-button v-if="$authJudge('school:add')" type="primary" @click="add">添加</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <div class="keyword">
                    <el-input v-model="name"
                        placeholder="请输入学校名称"
                        maxlength="20"
                        clearable
                        ></el-input>
                    </div>
                </el-col>                     
                <el-col :span="10">
                    <el-row>
                        <el-col :span="7" :offset="1">
                            <el-select v-model="provinceId"
                                clearable
                                placeholder="省/直辖市"
                                @change="getProvince(provinceId,1)"
                                >
                                <el-option v-for="(item,i) in provinceList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>                                    
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-select v-model="cityId"
                                clearable
                                placeholder="市"
                                @change="getCity(cityId,1)"
                                >
                                <el-option v-for="(item,i) in cityList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>                                    
                        </el-col>
                        <el-col :span="7" :offset="1">
                            <el-select v-model="areaId"
                                clearable
                                placeholder="区">
                                <el-option v-for="(item,i) in areaList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>                                    
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="3">
                    <el-row>
                        <el-col :span="21" :offset="3">
                            <el-select v-model="type"
                                clearable
                                placeholder="学段">
                                <el-option v-for="(item,i) in typeList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>            
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="2" :offset="1"><el-button v-if="$authJudge('school:select')" type="primary" @click="search">查询</el-button></el-col>
            </el-row>     
        </div>
        <div class="page-content">
            <div class="my-table">
                <el-table
                    border
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%">
                    <el-table-column
                        prop="order"
                        label="序号"
                        align="center"
                        min-width="40"
                        :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="学校"
                        min-width="200"
                        align="center"
                        show-overflow-tooltip>
                    </el-table-column>  
                    <el-table-column
                        prop="areaName"
                        label="地区"
                        align="center"
                        min-width="200"
                        :show-overflow-tooltip="true">
                    </el-table-column>     
                    <el-table-column
                        prop="typeText"
                        label="学段"
                        align="center"
                        >
                    </el-table-column> 
                    <el-table-column
                        prop="registerNum"
                        label="注册人数"
                        align="center"
                        >
                    </el-table-column>                                       
                    <el-table-column
                        label="操作"
                        align="center"
                        min-width="100">
                            <template slot-scope="scope"> 
                                <div class="btn-box">
                                    <el-button v-if="$authJudge('school:edit')" size="small" @click="edit(scope.row)">编辑</el-button>
                                    <el-button v-if="$authJudge('school:details')" size="small" @click="details(scope.row)">详情</el-button> 
                                </div>                                              
                            </template>                    
                    </el-table-column>                                                
                </el-table>
                <div class="block">
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total"
                    >
                    </el-pagination>
                </div>             
            </div>
        </div>
        <el-dialog :custom-class="'edit-dialog'" :visible.sync="editDialogVisible" :width="'780px'">
            <p class="title">{{flag=='add'?'添加新学校信息':'编辑学校信息'}}</p>
            <el-row class="edit-box">
                <div class="name">
                    <el-input size="small" v-model="editData.name" maxlength="20"></el-input>
                </div>
                <div class="select-box">
                    <el-select v-model="editData.provinceId"
                        clearable
                        size="small"
                        @change="getProvince(editData.provinceId,2)"
                        placeholder="省/直辖市">
                        <el-option v-for="(item,i) in editData.provinceList"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>        
                </div>
                <div class="select-box">
                    <el-select v-model="editData.cityId"
                        clearable
                        size="small"
                        @change="getCity(editData.cityId,2)"
                        placeholder="市">
                        <el-option v-for="(item,i) in editData.cityList"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>       
                </div>
                <div class="select-box">
                   <el-select v-model="editData.areaId"
                        clearable
                        size="small"
                        placeholder="区">
                        <el-option v-for="(item,i) in editData.areaList"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>        
                </div>
                <div class="select-box">
                    <el-select v-model="editData.type"
                        clearable
                        size="small"
                        placeholder="学段">
                        <el-option v-for="(item,i) in typeList"
                            :key="i"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>           
                </div>
                <div class="btn">
                    <el-button type="primary" size="small" @click="saveData">保存</el-button>
                </div>
                <p class="error-tips" v-show="errorText.length>0">{{errorText}}</p>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import pagination from "@/components/pagination";
export default {
    data() {
        return {
            flag:'',
            name:'',
            provinceId:'',
            provinceList:[],
            provinceArr:[],
            cityId:'',
            cityList:[],
            cityArr:[],
            areaId:'',
            areaList:[],
            areaArr:[],
            type:'',
            typeList:[
                {label:'小学',value:1,},
                {label:'初中',value:2,},
                {label:'高中',value:3,},
                {label:'其他',value:4,},
            ],
            pageNo:1,
            pageSize:10,
            total:10,
            tableData:[],
            loading:false,
            editDialogVisible:false,
            editData:{
                name:'',
                provinceId:'',
                cityId:'',
                areaId:'',
                type:'',
                provinceList:[],
                cityList:[],
                areaList:[]
            },
            editId:'',
            disabledState:false,
            errorText:''
        };
    },
    metaInfo: {
        title: "学校管理"
    },
    components: {
        pagination
    },
    watch: {
        editDialogVisible(cur,old){
            if(!cur){
                this.errorText = '';
                this.editData.name = '';
                this.editData.provinceId = '';
                this.editData.cityId = '';
                this.editData.areaId = '';
                this.editData.type = '';
            }
        },
        pageNo(cur,old){
            if(cur>=1){
                this.getSchoolList();
            }
        }
    },
    created() {
        this.getRegionList()
        this.getSchoolList()
    },
    methods: {
        /**
         * 获取地区信息
         */
        getRegionList(){
            this.$http.get(this.$server.getRegionList,{}).then(res=>{
                if(res.status==200){
                    let provinceArr = [],cityArr = [],areaArr = [];
                    res.content.forEach((item,index)=>{
                        item.label = item.name;
                        item.value = item.id;
                        if(item.level==1){
                            provinceArr.push(item)
                        }else if(item.level==2){
                            cityArr.push(item)
                        }else if(item.level==3){
                            areaArr.push(item)
                        }
                    })
                    this.provinceArr = provinceArr;
                    this.cityArr = cityArr;
                    this.areaArr = areaArr;
                    this.provinceList = [...this.provinceArr];
                    this.editData.provinceList = [...this.provinceArr]
                }
            })
        },
        /**
         * 获取列表
         */
        getSchoolList(){
            this.loading = true;
            let params = {
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }
            if(this.name!=''){
                params.name = this.name;
            }
            if(this.provinceId!=''){
                params.provinceId = this.provinceId;
            }
            if(this.cityId!=''){
                params.cityId = this.cityId;
            }
            if(this.areaId!=''){
                params.areaId = this.areaId;
            }
            if(this.type!=''){
                params.type = this.type;
            }
            let query = {
                params
            }
            this.$http.get(this.$server.getSchoolList,query).then(res=>{
                if(res.status==200){
                    this.loading = false;
                    this.total = res.content.total;
                    this.tableData = res.content.list;
                    this.tableData.forEach((item,index)=>{
                        item.typeText = this.typeList.find(option=>option.value==item.type).label;
                        item.order = (this.pageNo-1)*this.pageSize+index+1;
                    })
                }
            })
        },
        /**
         * 查询
         */
        search(){
            let regExp = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if(this.name.length>0&&!regExp.test(this.name)){
                this.$message.error('学校名称只能是数字、字母或汉字');
                return;
            }
            this.pageNo = 0;
            this.$nextTick(()=>{
                this.pageNo = 1;
            })
        },
        /**
         * 选择省
         */
        getProvince(val,type){
            if(val){
                let obj = this.provinceArr.find(item=>item.value==val)
                let cityList = [ ]
                this.cityArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        cityList.push(item)
                    }
                })
                if(type==1){
                    this.cityList = cityList;
                }else if(type==2){
                    this.editData.cityList = cityList;
                }
            }
            if(type==1){
                this.cityId = '';
                this.areaId = '';
            }else if(type==2){
                this.editData.cityId = '';
                this.editData.areaId = '';
            }
        },
        /**
         * 选择市
         */
        getCity(val,type){
            if(val){
                let obj = this.cityArr.find(item=>item.value==val)
                let areaList = [ ]
                this.areaArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        areaList.push(item)
                    }
                })
                if(type==1){
                    this.areaList = areaList;
                }else if(type==2){
                    this.editData.areaList = areaList;
                }
            }
            if(type==1){
                this.areaId = '';
            }else if(type==2){
                this.editData.areaId = '';
            }
        },
        /**
         * 添加
         */
        add(){
            this.editDialogVisible = true;
            this.flag = 'add';
        },
        /**
         * 编辑
         */
        edit(obj){
            this.editId = obj.id;
            this.editDialogVisible = true;
            this.flag = 'edit';
            this.editData.name = obj.name.replace(/\s+/g,"");
            this.editData.provinceId = obj.provinceId;
            this.editData.cityId = obj.cityId;
            this.editData.areaId = obj.areaId;
            this.editData.type = obj.type;
            let provinceTemp = this.provinceArr.find(item=>item.value==obj.provinceId)
            let cityList = [ ]
            this.cityArr.forEach(item=>{
                if(item.parentId == provinceTemp.id){
                    cityList.push(item)
                }
            })
            this.editData.cityList = cityList;
            let cityTemp = this.cityArr.find(item=>item.value==obj.cityId)
            let areaList = [ ]
            this.areaArr.forEach(item=>{
                if(item.parentId == cityTemp.id){
                    areaList.push(item)
                }
            })
            this.editData.areaList = areaList;
        },
        details(data){
            this.$router.push({path:'schoolManage/schoolList',query: { userId: data.id }});
        },
        /**
         * 保存数据
         */
        saveData(){
            this.errorText = ''
            var self = this;
            let {name,provinceId,cityId,areaId,type} = this.editData;
            let regExp = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if(name==''){
                this.errorText = '请输入学校名称';
                return;
            }
            if(!regExp.test(name)){
                this.errorText = '学校名称只能输入数字、字母或汉字';
                return;
            }
            if(provinceId==''){
                this.errorText = '请选择学校所在省/直辖市';
                return;
            }
            if(cityId==''){
                this.errorText = '请选择学校所在市';
                return;
            }
            if(areaId==''){
                this.errorText = '请选择学校所在区';
                return;
            }
            if(type==''){
                this.errorText = '请选择学段';
                return;
            }
            let query = {name,provinceId,cityId,areaId,type}
            let loadingInstance = this.$loading({
                target:document.querySelector('.edit-dialog')
            });
            if(!self.disabledState){
                self.disabledState = !self.disabledState;              
                if(this.flag=='add'){
                    this.$http.post(this.$server.addSchool,query).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            loadingInstance.close();
                            this.editDialogVisible = false;
                            this.$message({
                                message:'添加成功！',
                                type:'success'
                            })
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                        loadingInstance.close();
                    })
                }else if(this.flag=='edit'){
                    this.$http.post(`${this.$server.editSchool}/${this.editId}`,query).then(res=>{
                        if(res.status==200){
                            self.disabledState = !self.disabledState;
                            loadingInstance.close();
                            this.editDialogVisible = false;
                            this.$message({
                                message:'修改成功！',
                                type:'success'
                            })
                            this.pageNo = 0;
                            this.$nextTick(()=>{
                                this.pageNo = 1;
                            })
                        }
                    }).catch(()=>{
                        self.disabledState = !self.disabledState;
                        loadingInstance.close();
                    })
                }
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .page-header {
        background: #fff;
        padding: 30px 30px 38px 20px;
        margin-bottom: 26px;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .page-title {
            font-size: 18px;
            color: rgba(56, 65, 86, 1);
            margin-bottom: 20px;
        }
    }
    .search-form {
        width: 100%;
        margin-right: 10px;
        position: relative;
    }
    .page-content {
        background: #fff;
        box-shadow: 0px 0px 9px rgba(237, 241, 247, 1);
        .editor-btn {
            color:#9E0E00;
            font-size: 14px;
            padding: 0;
            height: 36px;
            line-height: 36px;
        }
        .block{
            text-align: center;
            margin-top:60px;
            padding-bottom:60px;
        }
    }
    .edit-dialog{
        .edit-box{
            margin:10px 0 40px 0;
        }
        .name,.select-box,.btn{
            display: inline-block;
            vertical-align: middle;
        }
        .name{
            width: 180px;
        }
        .select-box{
            width: 110px;
            margin:0 5px;
        }
        .error-tips{
            position: absolute;
            left: 0;
            bottom:-30px;
            color:#ca2312;
            font-size: 14px;
        }
    }
</style>


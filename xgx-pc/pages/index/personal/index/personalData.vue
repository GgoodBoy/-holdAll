<template>
    <div class="personal-data-page">
        <div class="block avatar">
            <p class="label">头像</p>
            <div class="value">
                <div @click="chooseFile"><img :src="avatar"/></div>
                <p class="tips">头像大小限制200K</p>
            </div>
        </div>
        <div class="block nickname" :class="{'error-box':nicknameError.length>0}">
            <p class="label">昵称</p>
            <div class="value">
                <div><input type="text" maxlength="20" v-model="nickname" ref="nicknameDom"/></div>
                <p class="tips">限20个汉字以内</p>
                <p class="error" v-if="nicknameError.length>0" @click="clearError('nicknameError')">{{nicknameError}}</p>
            </div>
        </div>
        <div class="block gender" :class="{'error-box':genderError.length>0}">
            <p class="label">性别</p>
            <div class="value" ref="genderDom">
                <el-select v-model="gender" placeholder="请选择">
                    <el-option
                        v-for="item in genderArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="error" v-if="genderError.length>0" @click="clearError('genderError')">{{genderError}}</p>
            </div>
        </div>
        <div class="block birthDate" :class="{'error-box':birthDateError.length>0}">
            <p class="label">出生日期</p>
            <div class="value" ref="birthDateDom">
                <div>
                    <el-date-picker
                        v-model="birthDate"
                        type="date"
                        
                        value-format="yyyy-MM-dd"
                        @change="formatTime"
                        :picker-options="pickerOptions"
                        placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <p class="error" v-if="birthDateError.length>0" @click="clearError('birthDateError')">{{birthDateError}}</p>
            </div>
        </div>
        <div class="block identify">
            <p class="label">身份</p>
            <div class="value">
                <div><input type="text" v-model="identify" disabled/></div>
            </div>
        </div>
        <div class="block region" v-if="userType!=1">
            <p class="label">地区</p>
            <div class="value">
                <el-row>
                    <el-col :span="5">
                        <el-select v-model="provinceId"
                            clearable
                            placeholder="省/直辖市"
                            
                            @change="getProvince(provinceId)"
                            >
                            <el-option v-for="(item,i) in provinceList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-select v-model="cityId"
                            clearable
                            
                            placeholder="市"
                            @change="getCity(cityId)"
                            >
                            <el-option v-for="(item,i) in cityList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" :offset="1">
                        <el-select v-model="areaId"
                            clearable
                            placeholder="区"
                            
                            @change="getArea(areaId)"
                            >
                            <el-option v-for="(item,i) in areaList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>               
                    </el-col>
                </el-row>                
            </div>
        </div>
        <div class="block school" v-if="userType!=1">
            <p class="label">学校</p>
            <div class="value">
                <el-select v-model="schoolId"
                    clearable
                    :loading="loading"
                    filterable
                    placeholder="请选择学校"
                    
                    >
                    <el-option v-for="(item,i) in schoolList"
                        :key="i"
                        :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </div>
        </div>
        <div class="block grade" v-if="userType==3">
            <p class="label">年级</p>
            <div class="value">
                <el-select v-model="gradeType"
                    clearable
                    placeholder="请选择年级"
                    
                    >
                    <el-option v-for="(item,i) in gradeList"
                        :key="i"
                        :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </div>
        </div>
        <div class="block education" :class="{'error-box':educationError.length>0}" v-if="userType!=3">
            <p class="label">学历</p>
            <div class="value" ref="educationDom">
                <el-select v-model="education" placeholder="未选择">
                    <el-option
                        v-for="item in educationArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="error" v-if="educationError.length>0" @click="clearError('educationError')">{{educationError}}</p>
            </div>
        </div>
        <div class="block industry" :class="{'error-box':industryError.length>0}" v-if="userType==1">
            <p class="label">行业</p>
            <div class="value" ref="industryDom">
                <el-select v-model="industry" placeholder="未选择">
                    <el-option
                        v-for="item in industryArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="error" v-if="industryError.length>0" @click="clearError('industryError')">{{industryError}}</p>
            </div>
        </div>
        <div class="block occupation" :class="{'error-box':occupationError.length>0}" v-if="userType==1">
            <p class="label">职业</p>
            <div class="value" ref="occupationDom">
                <el-select v-model="occupation" placeholder="未选择">
                    <el-option
                        v-for="item in occupationArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <p class="error" v-if="occupationError.length>0" @click="clearError('occupationError')">{{occupationError}}</p>
            </div>
        </div>
        <div class="block interest"> <!--:class="{'error-box':interestError.length>0}"-->
            <p class="label">兴趣方向</p>
            <div class="value">
                <div class="clearfix">
                    <p class="item" v-for="(item,index) in interestArr" :key="index" :class="{'active':item.active}" @click="chooseInterset(item)">{{item.name}}</p>
                </div>
                 <p class="error" v-show="interestArr.length>0">最多选中3个兴趣</p>
                <!-- <p class="error" v-if="interestError.length>0" @click="clearError('interestError')">{{interestError}}</p> -->
            </div>
        </div>
        <div class="block">
            <div class="label"></div>
            <div class="value">
                <div class="update-btn" @click="updateMessage">
                    保存
                </div>
            </div>
        </div>
        
        <div class="cropper-wrapper" v-show="cropperFlag">
            <div class="cropper-container">
                <div class="cropper-box">
                    <vueCropper
                        ref="cropper2"
                        :img="example2.img "
                        :outputSize="example2.size"
                        :outputType="example2.outputType"
                        :info="example2.info"
                        :canScale="example2.canScale"
                        :autoCrop="example2.autoCrop"
                        :autoCropWidth="example2.autoCropWidth"
                        :autoCropHeight="example2.autoCropHeight"
                        :fixed="example2.fixed"
                        :fixedNumber="example2.fixedNumber"
                    ></vueCropper>
                </div>
                <label class="upload-btn" for="upload2" @click="beforeChoose">选择文件</label>
                <input type="file" id="upload2" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event)">
                <button @click="finish" class="cropper-btn">裁剪</button>
                <button class="sure-btn" @click="cropperSure">确定</button>
                <button class="return-btn" @click="cropperFlag=false">返回</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component ,Vue ,Watch} from 'vue-property-decorator'
import {mapState,mapActions} from 'vuex'
if(process.client) {
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<=9){
        alert("您的浏览器版本过低，要裁剪头像，请使用IE9及以上版本");
    }else{
        let vueCropper = require('vue-cropper')
        Vue.use(vueCropper.default)
    }
}
const convertBase64UrlToBlob = (urlData)=>{
	var bytes=window.atob(urlData.split(',')[1]);
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob( [ab] , {type : 'image/png'});
}
const genderArr = [
    {label:'女',value:'0'},
    {label:'男',value:'1'},
    {label:'保密',value:'2'}
]
@Component({
    computed:{
        ...mapState(['userData'])
    },
    methods:{
        ...mapActions(['selectMyStartEven']),
        ...mapActions(['setUserData'])
    }
})
export default class PersonalData extends Vue{
    genderArr:object[]= genderArr
    avatar = ''
    gender = ''
    nickname = ''
    birthDate = ''
    identify = ''
    userType = 0;
    educationArr:object[] = []
    education = ''
    industryArr:object[] = []
    industry = ''
    occupationArr:object[] = []
    occupation = ''
    interestArr:object[] = []
    interestId = [];
    provinceId = ''
    cityId = ''
    areaId = ''
    schoolId = ''
    gradeType = ''
    provinceList = []
    cityList = []
    areaList = []
    provinceArr = []
    cityArr = []
    areaArr = []
    schoolList = []
    gradeList = []
    loading = false
    nicknameError = ''
    genderError = ''
    birthDateError = ''
    educationError = ''
    industryError = ''
    occupationError = ''
    interestError = ''
    cropperFlag:boolean = false
    example2 = {
        //img的路径自行修改
        img: '',
        info: true,
        size: 1,
        outputType: 'png',
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 300,
        autoCropHeight: 250,
        fixed: true,
        // 真实的输出宽高
        infoTrue: true,
        fixedNumber: [4, 3]
    }
    pickerOptions = {
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
    }
    head(){
        return {
            title:'个人中心 | 学国学网'
        }
    }
    created(){
        var numbers = this.$route.query.selectId;
        this.selectMyStartEven(Number(numbers));          
    };
    @Watch("userData")
    onuserDataChanged(val, oldVal) {
        if(typeof val=='object'&& val.hasOwnProperty('token')){
            this.avatar = val.avatar;
            // this.getInfo()
        }
    }
    mounted(){
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('personal-data-page')[0],
            background:'rgba(255,255,255,0)'
        });
        this.getRegionList()
        this.getGradeList();
        this.getEducationList();
        this.getIndustryList();
        this.getOccupationList();
        this.getInterestList();
        this.getInfo()
        this.avatar = this.userData.avatar;
        loadingInstance.close()
        
    }
    /**
     * 获取地区信息
     */
    async getRegionList(){
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getRegionList,query);
        if(res.status == 200){
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
        }
    }
    /**
     * 获取年级
     */
    async getGradeList(){
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getGradeList,query);
        if(res.status==200){
            this.gradeList = res.content;
        }
    }
    getProvince(val){
        if(val){
            let obj = this.provinceArr.find(item=>item.value==val)
            let cityList = [ ]
            this.cityArr.forEach(item=>{
                if(item.parentId == obj.id){
                    cityList.push(item)
                }
            })
            this.cityList = cityList;
        }else{
            this.cityList = []
        }
        this.cityId = '';
        this.areaId = '';
        this.areaList = [];
        this.schoolId = '';
        this.schoolList = [];
    }
    /**
     * 选择市
     */
    getCity(val){
        if(val){
            let obj = this.cityArr.find(item=>item.value==val)
            let areaList = [ ]
            this.areaArr.forEach(item=>{
                if(item.parentId == obj.id){
                    areaList.push(item)
                }
            })
            this.areaList = areaList;
        }
        this.areaId = '';
        this.schoolId = '';
        this.schoolList = [];
        
    }
    /**
     * 获取地区
     */
    getArea(val){
        if(val){
            this.getSchoolList();
        }
        this.schoolId = '';
        this.schoolList = [];
    }
    /**
     * 获取学校列表
     */
    async getSchoolList(){
        this.loading = true;
        let query = {
            provinceId:this.provinceId,
            cityId:this.cityId,
            areaId:this.areaId
        }
        let res = await this.$axios.$post(this.$server.getSchoolList,query)
        this.loading = false;
        if(res.status==200){
            this.schoolList = res.content;
        }
    }
    /**
     * 裁剪图片
     */
    finish() {
        this.$refs.cropper2.getCropData((data) => {
            this.example2.img = data;
        })
    }  
    /**
     * 确定裁剪
     */
    cropperSure(){
        this.cropperFlag = false;
        this.avatar = this.example2.img
    }
    /**
     * 选择头像
     */
    chooseFile(){
        let dom:any = document.querySelector('.upload-btn')
        dom.click()
    }
    /**
     * 可以重复选择同一张图片
     */
    beforeChoose(){
        let dom:any = document.getElementById('upload2')
        dom.value = ''
    }
    /**
     * 上传图片
     */
    uploadImg (e) {
        this.example2.img = ''
        let file = e.target.files[0]
        let size = file.size;
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
            this.$message({
                message: '图片类型必须是.gif,jpeg,jpg,png,bmp中的一种',
                type: 'warning'
            });
            return false
        }
        if(size>(1024*200)){
            this.$message.error('图片大小不能超过200KB');
            return false;
        }
        this.cropperFlag = true;
        var reader = new FileReader()
        reader.onload = (e) => {
            let data
            data = e.target.result
            if (typeof e.target.result === 'object') {
                // 把Array Buffer转化为blob 如果是base64不需要
                data = window.URL.createObjectURL(new Blob([e.target.result]))
            } else {
                data = e.target.result
            }
            this.example2.img = data
        }
        // 转化为base64
        reader.readAsDataURL(file)
        // 转化为blobcs
        // reader.readAsArrayBuffer(file)
      }
    /**
     * 查询学历列表
     */
    async getEducationList(){
        let questData = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getEducationList,questData)
        if(res.status==200){
            this.educationArr = res.content.map((item,index)=>{
                return {
                    label:item,
                    value:String(index)
                }
            });
        }
    }
    /**
     * 查询行业列表
     */
    async getIndustryList(){
        let questData = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getIndustryList,questData)
        if(res.status==200){
            this.industryArr = res.content.map((item,index)=>{
                return {
                    label:item,
                    value:index
                }
            });
        }
    }
    /**
     * 查询职业列表
     */
    async getOccupationList(){
        let questData = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getOccupationList,questData)
        if(res.status==200){
            this.occupationArr = res.content.map((item,index)=>{
                return {
                    label:item,
                    value:index
                }
            });
        }
    }
    /**
     * 兴趣列表
     */
    async getInterestList(){
        let questData = {
            params:{}
        }
        let res = await this.$axios.$get(this.$server.getInterestList,questData)
        this.interestArr = res.content.map((item,index)=>{
            item.active = false;
            return item;
        });
    }
    /**
     * 获取用户资料
     */
    async getInfo(){
        if(!this.userData.userId) return;
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('personal-data-page')[0],
        });
        let query = {
            params:{}
        }
        let res = await this.$axios.$get(`${this.$server.getInfo}/${this.userData.userId}`,query)
        if(res.status==200){
            loadingInstance.close()
            this.$nextTick(()=>{
                let userData = Object.assign({},this.userData,{
                    avatar:res.content.avatar,
                    userId:res.content.id
                })
                this.setUserData(userData)
                this.avatar = res.content.avatar;
                this.birthDate = res.content.birthDate;
                this.nickname = res.content.nickname;
                let educationObj = this.educationArr.find(item=>item.label==res.content.education)
                this.education = educationObj?educationObj.value:res.content.education;
                let industryObj = this.industryArr.find(item=>item.label==res.content.industry)
                this.industry = industryObj?industryObj.value:res.content.industry;
                let occupationObj = this.occupationArr.find(item=>item.label==res.content.occupation)
                this.occupation = occupationObj?occupationObj.value:res.content.occupation;
                this.gender = String(res.content.gender)
                this.userType = res.content.userType;
                let arr = [
                    {value:1,label:'普通'},
                    {value:2,label:'教师'},
                    {value:3,label:'学生'},
                ]
                this.identify = arr.find(item=>item.value==res.content.userType).label;
                if(res.content.userType>1){
                    this.gradeType = res.content.gradeType;
                    let timer = setInterval(()=>{
                        if(this.provinceArr.length>0){
                            let provinceTemp = this.provinceArr.find(item=>item.value==res.content.provinceId)
                            let cityList = [ ]
                            this.cityArr.forEach(item=>{
                                if(item.parentId == provinceTemp.id){
                                    cityList.push(item)
                                }
                            })
                            let cityTemp = this.cityArr.find(item=>item.value==res.content.cityId)
                            let areaList = [ ]
                            this.areaArr.forEach(item=>{
                                if(item.parentId == cityTemp.id){
                                    areaList.push(item)
                                }
                            })
                            this.cityList = cityList;
                            this.areaList = areaList;
                            this.provinceId = res.content.provinceId;
                            this.cityId = res.content.cityId;
                            this.areaId = res.content.areaId;
                            this.getSchoolList()
                            setTimeout(()=>{
                                this.schoolId = Number(res.content.schooleId);
                            },700)
                            clearInterval(timer)
                        }
                    },500)
                }
                
                if(res.content.userInterestList.length>0){
                    let interestId = [ ];
                    this.interestArr.forEach((item)=>{
                        let obj = res.content.userInterestList.find(option=>option.interestId==item.id)
                        if(obj){
                            item.active = true;
                            interestId.push(item.id);
                        }
                    })
                    this.interestId = interestId;
                }
            })
            // this.userInterestList = res.content.userInterestList;
        }
    }
    /**
     * 选择兴趣
     */
    chooseInterset(obj){
        this.interestError = ''
        if(obj.active){
            obj.active = false;
            let index = this.interestId.findIndex(item=>item==obj.id);
            this.interestId.splice(index,1);
        }else{
            if(this.interestId.length>=3){
                this.interestError = '最多选中3个兴趣'
                return;
            }
            obj.active = true;
            this.interestId.push(obj.id);
        }
    }
    formatTime(time){
        this.birthDate = time;
    }
    /**
     * 清除错误
     */
    clearError(key){
        if(key=='nicknameError'){
            this.nicknameError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.nicknameDom
                dom.focus()  
            })
        }else if(key=='genderError'){
            this.genderError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.genderDom
                dom.querySelector('.el-input__inner').click()
            })
        }else if(key=='birthDateError'){
            this.birthDateError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.birthDateDom
                dom.querySelector('.el-input__inner').focus()
            })
        }else if(key=='educationError'){
            this.educationError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.educationDom
                dom.querySelector('.el-input__inner').click()
            })
        }else if(key=='industryError'){
            this.industryError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.industryDom
                dom.querySelector('.el-input__inner').click()
            })
        }else if(key=='occupationError'){
            this.occupationError = '';
            this.$nextTick(()=>{
                let dom:any =  this.$refs.occupationDom
                dom.querySelector('.el-input__inner').click()
            })
        }
    }
    /**
     * 上传文件到OSS
     */
    uploadOss(file,cb){
        let forms= new FormData();
            forms.append('file',file);
            forms.append('userId',this.userData.userId);
            forms.append('imgType',1)
            let xhr = new XMLHttpRequest();    
            xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                if(xhr.status>=200&&xhr.status<=300||xhr.status==304){
                    cb(JSON.parse(xhr.response))
                }
                }else{
                    cb(xhr.status)
                }
            }
            xhr.open('POST',this.$server.uploadForOSS,true);
            xhr.setRequestHeader("token",this.userData.token); 
            xhr.setRequestHeader("userId",this.userData.userId);
            xhr.send(forms);
    }
    /**
     * 修改资料
     */
    updateMessage(){
        let regExp = /^[\u2E80-\u9FFF]+$/
        if(this.nickname.length==0){
            this.$message.error('请输入昵称');
            // this.nicknameError = '请输入昵称'
            return;
        }
        if(this.nickname.length>20){
            this.$message.error('昵称限20个汉字以内');
            // this.nicknameError = '限20个汉字以内';
            return;
        }
        if(this.userType>1){
            if(!this.provinceId||!this.cityId||!this.areaId||this.provinceId==''||this.cityId==''||this.areaId==''){
                this.$message.error('请选择地区');
                return;
            }
            
            if(this.schoolId==''||!this.schoolId){
                this.$message.error('请选择学校');
                return;
            }
            if(this.userType==2&&String(this.education)==''){
                this.$message.error('请选择学历');
                return;
            }
            if(this.userType==3&&this.gradeType==''){
                this.$message.error('请选择年级');
                return;
            }
        }
        // if(this.gender==''){
        //     this.genderError = '请选择性别'
        //     return;
        // }
        // if(this.birthDate==''){
        //     this.birthDateError = '请选择出生日期';
        //     return;
        // }
        // if(this.education===''){
        //     this.educationError = '请选择学历';
        //     return;
        // }
        // if(this.industry===''){
        //     this.industryError = '请选择行业';
        //     return;
        // }
        // if(this.occupation===''){
        //     this.occupationError = '请选择职业';
        //     return;
        // }
        if(this.interestId.length==0){
            this.$message.error('请至少选择1个兴趣')
            return;
        }
        this.interestError = ''
        let loadingInstance = this.$loading.service({
            target:document.getElementsByClassName('personal-data-page')[0],
            background:'rgba(255,255,255,0)'
        });
        if(this.avatar!=this.userData.avatar){
            let file = convertBase64UrlToBlob(this.avatar);
            this.uploadOss(file,(res)=>{
                if(res.status==200){
                    this.avatar = res.content.resourceAbsoluteUrl
                    this.$nextTick(()=>{
                        this.updateInfo()
                        loadingInstance.close()
                    })
                }
            })
        }else{
            this.updateInfo()
            loadingInstance.close()
        }
    }
    async updateInfo(){
        let query = {
            avatar:this.avatar,
            nickname:this.nickname,
            gender:this.gender?this.gender:'',
            birthDate:this.birthDate?this.birthDate:'',
            interestId:this.interestId.join(','),
        }
        if(this.userType==1){
            query.industry = this.industry?this.industryArr[this.industry].label:''
            query.education = this.education?this.educationArr[this.education].label:''
            query.occupation = this.occupation?this.occupationArr[this.occupation].label:''
        }else if(this.userType==2){
            query.provinceId = this.provinceId;
            query.cityId = this.cityId;
            query.areaId = this.areaId;
            query.schooleId = this.schoolId;
            if(this.education==0){
                query.education = 0;
            }else{
                query.education = this.education?this.educationArr[this.education].label:''
            }
        }else if(this.userType==3){
            query.provinceId = this.provinceId;
            query.cityId = this.cityId;
            query.areaId = this.areaId;
            query.schooleId = this.schoolId;
            query.gradeType = this.gradeType;
        }
        let res = await this.$axios.$post(`${this.$server.updateInfo}/${this.userData.userId}`,query)
        if(res.status==200){
            this.$message({
                message: '修改成功',
                type: 'success'
            });
            let userData = Object.assign({},this.userData,{
                avatar:this.avatar,
            })
            this.setUserData(userData)
        }else{
            this.$message.error(res.message);
        }
    }
}
</script>
<style lang="scss">
    .personal-data-page{
        padding: 30px 40px;
        position: relative;
        .el-input.is-disabled .el-input__inner{
            background: rgba(244,244,244,1)!important;
        }
        input:disabled{
            background: rgba(244,244,244,1)!important;
        }
        .block{
            font-size: 0;
            margin:20px 0;
            &.avatar{
                img{
                    width: 66px;
                    height: 66px;
                    border-radius: 50%;
                }
                .tips{
                    bottom:-22.5px!important;
                }
                .value{
                    div{
                        display: inline-block;
                    }
                }
            }
            &.nickname{
                margin:30px 0 40px 0;
                .tips{
                    bottom:-30px!important;
                }
            }
            &.interest{
                margin:40px 0;
                .label{
                    margin-top:5px;
                }
                .label,.value{
                    vertical-align: top;
                }
                .item{
                    float: left;
                    width: 84px;
                    border:1px solid #CCCCCC;
                    border-radius: 20px;
                    color:#9A9A9A;
                    font-size: 14px;
                    line-height: 30px;
                    height: 30px;
                    text-align: center;
                    margin:0 25px 20px 0;
                    cursor: pointer;
                    &:hover{
                        border-color:#aaa;
                    }
                    &.active{
                        transition: all 0.3s;
                        background: #C30D23;
                        border-color:#C30D23;
                        color:#fff;
                        &:hover{
                            border-color:#C30D23;
                        }
                    }
                }
                .error{
                    font-size: 12px;
                    color:#ccc;
                }
            }
            .label{
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                color:#3A3A3A;
                width: 60px;
                text-align:justify;
                margin-right: 15px;
                text-align: justify;
                text-align-last: justify;
            }
            .value{
                display: inline-block;
                vertical-align: middle;
                position: relative;
                width: 600px;
                input{
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    color:#3A3A3A;
                    font-size: 14px;
                    padding: 0 30px;
                    border:1px solid #E4E2ED;
                    border-radius: 3px;
                    outline: none;
                    &:hover{
                        border-color:#c9c8cd;
                    }
                    &:disabled{
                        background: none;
                        cursor: not-allowed;
                    }
                    // &:focus{
                    //     border-color:#AD0015;
                    // }
                }
                .tips{
                    color:#9A9A9A;
                    font-size: 12px;
                    position: absolute;
                    bottom:-20px;
                    left: 0;
                    line-height: 20px;
                    width: 500px;
                }
            }
            .update-btn{
                width: 110px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color:#fff;
                background: #C30D23;
                border-radius: 25px;
                letter-spacing: 2px;
                cursor: pointer;
                &:hover{
                    background: #9c081a;
                }
            }
            &.error-box{
                &.interest{
                    .error{
                        top:100%;
                        left: 0;
                        border:none;
                        background: none;
                        padding:0;
                        line-height: 14px;
                    }
                }
                .error{
                    border:1px solid #AD0015;
                    color: #AD0015;
                    font-size: 14px;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 30px;
                    z-index: 2;
                    width: 100%;
                    text-align: left;
                    cursor: text;
                    position: absolute;
                    top:0;
                    left: 0;
                    background: #fff;
                    border-radius: 3px;
                }
                input{
                    border-color:#AD0015;
                    color:#AD0015;
                    &:hover{
                        border-color:#AD0015; 
                    }
                }
            }
        }
        .cropper-wrapper{
            position: absolute;
            width:100%;
            height: 100%;
            background: rgba(0,0,0,.7);
            z-index: 2;
            top:0;
            left: 0;
            .cropper-container{
                position: absolute;
                background: #fff;
                width:100%;
                height: 100%;
            }
            .cropper-box{
                height:calc(100% - 80px);
            }
            .upload-btn{
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                background: #fff;
                border: 1px solid #c0ccda;
                color: #1f2d3d;
                text-align: center;
                box-sizing: border-box;
                outline: none;
                margin: 20px 10px 0px 0px;
                padding: 9px 15px;
                font-size: 14px;
                border-radius: 4px;
                color: #fff;
                background-color: #C30D23;
                border-color: #C30D23;
                transition: all .2s ease;
                text-decoration: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .cropper-btn,.sure-btn,.return-btn{
                display: inline-block;
                line-height: 1;
                white-space: nowrap;
                cursor: pointer;
                background: #fff;
                border: 1px solid #c0ccda;
                color: #1f2d3d;
                text-align: center;
                box-sizing: border-box;
                outline: none;
                margin: 20px 10px 0px 0px;
                padding: 9px 15px;
                font-size: 14px;
                border-radius: 4px;
                color: #fff;
                background-color: #C30D23;
                border-color: #C30D23;
                transition: all .2s ease;
                text-decoration: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        }
        
    }
</style>

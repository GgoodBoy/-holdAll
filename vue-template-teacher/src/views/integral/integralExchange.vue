<template>
    <div>
        <el-row class="lLine40 headerDiv">
             <el-col class="lSize18" style="border-bottom: 1px solid #ccc;">
                <el-row class="lSize18">
                    <el-col :span="8" class="lLeft-r">
                        <!-- <span>积分管理</span>/
                        <span>积分兑换比例</span> -->
                        <breadcrumb :menuList ='titleList'></breadcrumb>
                    </el-col>
                </el-row>                 
             </el-col>
             <el-col class="lSize14 lMarginTop50">
                <el-row class="lSize16">
                    <el-col :span="3" :offset="1" class="lLeft-r">
                        <span>积分兑换功能:</span>
                    </el-col>
                    <el-col :span="10" class="lLeft-r">
                           <el-radio-group v-model="radio">
                                <el-radio :label="1">开</el-radio>
                                <el-radio :label="2">关</el-radio>
                            </el-radio-group>
                    </el-col>                    
                </el-row> 
                <el-row class="lSize14 lMarginTop30">
                    <el-col :span="3" :offset="1" class="lLeft-r">
                        <span>渠道课程:</span>
                    </el-col>
                    <el-col :span="4" class="lCenter-r">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>                        
                    </el-col>                  
                </el-row>                
                <el-row class="lSize14 lMarginTop30" v-if="!showBool">
                    <el-col :span="3" :offset="1" class="lLeft-r">
                        <span>积分兑换功能:</span>
                    </el-col>
                    <el-col :span="2" class="lLeft-r">
                        <el-input  @keyup.native="proving" type="text" v-model="input" maxlength="9"></el-input>
                    </el-col>
                    <el-col :span="1" class="lCenter-r">
                        : 1
                    </el-col>                    
                </el-row>                
                <el-row class="lSize14 lMarginTop30" v-if="showBool">
                    <el-col :span="3" :offset="1" class="lLeft-r">
                        <span>积分兑换功能:</span>
                    </el-col>
                    <el-col :span="2" class="lCenter-r">
                        {{input}} : 1
                    </el-col>
                    <el-col :span="2" class="lLeft-r">
                        <span @click="update" style="color:#e6a23c;cursor: pointer;">修改</span>
                    </el-col>                    
                </el-row>                
                <el-row class="lSize18 lMarginTop30 lMarginBO30">
                    <el-col :span="3" :offset="3" >
                        <el-button v-if="$authJudge('integral:exchange:save')" class="redBackColor butColorF" @click="submit()">保存</el-button>
                    </el-col>
                </el-row>                                 
             </el-col>
        </el-row>
    </div>
</template>
<script>
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){ 
        return {  
            radio:2,
            input:'',
            showBool:false,
            options:[],
            value:'',
            titleList:[
                        {
                            name:'积分',
                            pathInfo:''
                        },
                        {
                            name:'积分兑换',
                            pathInfo:''
                        }
                ]      
        }
    },
    computed: {},  
    components:{
        breadcrumb
    },      
    created(){
        this.switchType();
    },    
    methods: {
        switchType(){
            var self = this;
            var nameChannel=['学国学网'];
            self.$http.get(self.$server.integralSwitch).then(res=>{
                if(res.status==200){
                        if(res.content.isEnable==1){
                            self.radio = 1;
                        }else{
                            self.radio = 2;
                        }
                        self.input = res.content.description;
                        self.value = res.content.channel;
                }
            });
            self.$http.get(self.$server.channelCoursePipelines).then(res=>{
                if(res.status==200){
                    nameChannel.forEach((e,i)=>{
                        res.content.list.forEach(item=>{
                            if(item.name==e){
                                self.options.push(item);
                            }
                        })
                    });
                }
            })                         
        },        
        proving(){
            if(this.input==0){
                this.input ='';
            }else{
                this.input=this.input.replace(/[^0-9]/g,'');
            }
        },
        submit(){
            var self = this;
            var radioVal = '';
            if(self.radio==1){
                radioVal=1;
            }else{
                radioVal=0;
            }
            if(!Number(self.value)>0){
                self.$message.error('请输选择渠道课程');
                return;
            }            
            if(!self.input.length>0){
                self.$message.error('请输入积分兑换比例');
                return;
            }            
            var params ={
                isEnable:radioVal,
                description:self.input+'',
                channel:Number(self.value)
            }
            self.$http.post(self.$server.integralSwitch,params).then(res=>{
                if (res.status==200) {
                    self.showBool = true;
                    self.$message.success({ message: "保存成功" });
                }
            })            
        },
        update(){
            var self = this;
            self.showBool = false;            
        }
    }    
}
</script>
<style>
@import "../../components/formSynthesisPlugin/my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px; 
    margin-bottom: 10px;     
}
.medalDiv .medalImg{
    width: 80%;
    margin: auto;
    position: relative;
    background: #ccc;
}
.medalDiv .medalImg img{
    width: 100%;
}
.medalDiv .medalImg .medalIcon{
    position: absolute;
    top: 20%;
    left: 65%;
    font-size: 30px;
    cursor: pointer;
    z-index: 1000;
}
.medalDiv .medalText{
    padding: 0 10%;
    zoom: 1;
    overflow: auto;
}
.medalDiv .medalText .medalName{
    float: left;
}
.medalDiv .medalText .medalNum{
    float: right;
}
.dividingLine{
    width: 5px;
    border-left:1px dashed #ccc;
    height: 300px;
    margin: auto;
}
.medalPreview .previewImg{
    width: 80%;
    margin: auto;
}
.medalPreview .previewText{
    padding:0 10%; 
    zoom: 1;  
    overflow: auto;      
}
.medalPreview .previewText .previewOne{
    float: left;
}
.medalPreview .previewText .previewTwo{
    float: right;
}
</style>


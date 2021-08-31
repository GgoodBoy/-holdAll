<template>
    <div class="headerDiv">
        <!-- 优惠券 -->
        <el-row class="lLine40" v-if="coupon==true">
            <!-- breadcrumb -->
            <!-- <el-col :span="6" class="lSize18">{{mateInfo.title}}</el-col> -->
            <el-col :span="14" class="lSize18">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <!-- v-if="headObj.power.includes('coupon:add')||headObj.power.includes('timeLimitedDiscounts:add')" -->
            <el-col v-if="$authJudge('market:coupon:add')" :span="10" class="lRight-r"><el-button class="lButtom lSize16" @click="headEven">{{headObj.title}}</el-button></el-col>
        </el-row>

        <!-- 优惠券-->
        <el-row class="lMarginTB20" :gutter="20" v-if="coupon==true">
            <el-col :span="5">
                <el-row class="lLine40 lSize14">
                    <el-col :span="5">筛选：</el-col>
                    <el-col :span="19">
                        <el-input
                            :placeholder="placeholderConetr"
                            maxlength="20"
                            clearable
                            v-model="input">
                        </el-input>                        
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="3" v-if="this.headObj.name=='timeLimit'">
                <el-select v-model="value" placeholder="全部类型" style="width:100%">
                    <el-option
                    v-for="item in options.listValTwo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col>            
            <el-col :span="3">
                <el-select v-model="values" placeholder="全部状态" style="width:100%">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col>     
            <el-col :span="5">
                <el-date-picker
                v-model="dataStart"
                type="date"
                placeholder="开始时间">
                </el-date-picker>                  
            </el-col>
            <el-col :span="5">
                <el-date-picker
                v-model="dataEnd"
                type="date"
                placeholder="结束时间">
                </el-date-picker>                         
            </el-col>  
            <el-col :span="1" v-if="$authJudge('market:coupon:select')">
                <el-button type="primary" @click="search">查询</el-button>
            </el-col>                      
        </el-row>
        <!-- 限时购 -->
        <el-row class="lLine40" v-if="tiemHotCou==true">
            <!-- breadcrumb -->
            <!-- <el-col :span="6" class="lSize18">{{mateInfo.title}}</el-col> -->
            <el-col :span="14" class="lSize18">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <!-- v-if="headObj.power.includes('coupon:add')||headObj.power.includes('timeLimitedDiscounts:add')" -->
            <el-col v-if="$authJudge('market:limited:add')" :span="10" class="lRight-r"><el-button class="lButtom lSize16" @click="headEven">{{headObj.title}}</el-button></el-col>
        </el-row>

        <!--限时购-->
        <el-row class="lMarginTB20" :gutter="20" v-if="tiemHotCou==true">
            <el-col :span="5">
                <el-row class="lLine40 lSize14">
                    <el-col :span="5">筛选：</el-col>
                    <el-col :span="19">
                        <el-input
                            :placeholder="placeholderConetr"
                            maxlength="20"
                            clearable
                            v-model="input">
                        </el-input>                        
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="3" v-if="this.headObj.name=='timeLimit'">
                <el-select v-model="value" placeholder="全部类型" style="width:100%">
                    <el-option
                    v-for="item in options.listValTwo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col>            
            <el-col :span="3">
                <el-select v-model="values" placeholder="全部状态" style="width:100%">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col> 
            <el-col :span="5" v-if="this.headObj.name=='timeLimit'">
                <el-date-picker
                v-model="dataStart"
                type="date"
                placeholder="开始时间">
                </el-date-picker>                  
            </el-col>
            <el-col :span="5" v-if="this.headObj.name=='timeLimit'">
                <el-date-picker
                v-model="dataEnd"
                type="date"
                placeholder="结束时间">
                </el-date-picker>                         
            </el-col>            
            <el-col :span="1" class="lRight-r" v-if="$authJudge('market:limited:select')">
                <el-button type="primary" @click="search">查询</el-button>
            </el-col>                      
        </el-row>
        <!-- 优惠券详情 -->
        <el-row class="lMarginTB20" v-if="details==true" :gutter="20">
            <el-col class="lMarginBO20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="4">
                <el-input
                    placeholder="请输入手机号"
                    maxlength="20"
                    clearable
                    v-model="input">
                </el-input>        
            </el-col>
            <el-col :span="3">
                <el-select v-model="value" placeholder="全部状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col>
            <el-col :span="2">
                <el-button type="primary" @click="search">查询</el-button>
            </el-col>
            <el-col :span="15" class="lRight-r">
                <el-button class="lButtom lSize16" v-if="$authJudge('market:coupon:info')" @click="headExport">导出EXCEL</el-button>               
            </el-col>            
        </el-row>
        <!-- 热词搜索 -->
        <el-row class="lMarginTB20" v-if="hotWord==true">
            <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col>
            <el-col :span="20" v-if="headObj.power.includes('hotword:add')">
                <el-row class="lLine40 lSize14">
                    <el-col :span="6">
                        <el-input
                            placeholder="添加热词"
                            v-model="input1"
                            clearable
                            :maxlength='maxNum'>
                        </el-input>                        
                    </el-col>
                    <el-col :span="2" class="lMarginL10">
                        {{reduce}}/{{maxNum}}                       
                    </el-col>    
                    <el-col :span="2" class="lMarginL10" v-if="$authJudge('hotword:add')">
                        <el-button type="primary"  @click="headEven">{{headObj.title}}</el-button>                       
                    </el-col>  
                    <el-col :offset="8" :span="2"  class="lMarginL10" v-if="$authJudge('hotword:hot')">
                        <el-button  type="primary" plain  @click="headEven('showHot')">查看热度</el-button>                       
                    </el-col>                                    
                </el-row>
            </el-col>            
        </el-row>   
        <!-- 订单记录 -->
        <el-row v-if="record==true" :gutter="20">
            <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col>
            <el-col :span="6" class="lMarginBO20">
                <el-input
                        placeholder="输入订单号/付款账号/课程名称查询"
                        clearable
                        v-model="input">
                </el-input>
            </el-col>
            <el-col :span="3">
                <el-select v-model="value" placeholder="状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                  
            </el-col>
            <el-col :span="3">
                <el-select v-model="values" placeholder="支付方式">
                    <el-option
                    v-for="item in options.listValTwo"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                 
            </el-col>           
            <el-col :span="8">
                <el-row class="lLine40">
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataStart"
                            type="date"
                            placeholder="订单开始时间">
                            </el-date-picker>
                        </div>                        
                    </el-col>
                    <el-col :span="2" class="lCenter-r">至</el-col>
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataEnd"
                            type="date"
                            placeholder="结束时间">
                            </el-date-picker>
                        </div>                         
                    </el-col>
                </el-row>         
            </el-col>
            <el-col>
                <el-row :gutter="3">
                    <el-col :span="4">
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
                    <el-col :span="4">
                        <el-select v-model="cityId"
                            clearable
                            placeholder="市"
                            >
                            <el-option v-for="(item,i) in cityList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>  
                    </el-col> 
                    <el-col :span="4">
                        <el-select v-model="origin"
                            clearable
                            placeholder="来源"
                            >
                            <el-option v-for="(item,i) in originArr"
                                :key="i"
                                :label="item.origin"
                                :value="item.code"></el-option>
                        </el-select>  
                    </el-col>
                    <el-col :span="4">
                        <el-select v-model="pipelineName"
                            clearable
                            placeholder="渠道"
                            >
                            <el-option v-for="(item,i) in pipelineList"
                                :key="i"
                                :label="item.name"
                                :value="item.channelId"></el-option>
                        </el-select>  
                    </el-col>                                                                               
                    <el-col :span="2" :offset="4">
                        <el-button v-if="$authJudge('record:order:select')" type="primary" @click="search">查询</el-button>
                    </el-col>
                    <el-col :span="2" class="lCenter-r">
                        <el-button type="primary" v-if="$authJudge('record:order:export')" @click="headExport">导出</el-button>
                    </el-col>
                </el-row>          
            </el-col>              

        </el-row>    
        <!-- 评论记录 -->
        <el-row v-if="commitBoll==true" class="pingluns" :gutter="20">
            <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col>
            <el-col :span="4">
                <el-input
                        placeholder="输入评论内容"
                        suffix-icon="el-icon-search"
                        v-model="input">
                </el-input>                
            </el-col>
            <el-col :span="3">
                <el-select v-model="value" placeholder="状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                 
            </el-col>
            <el-col :span='10' >
                <el-row class="lLine40">
                    <el-col :span="11"  class="lCenter-r">
                        <div>
                                <el-date-picker
                                v-model="dataStart"
                                type="date"
                                placeholder="评论开始时间">
                                </el-date-picker>
                        </div>
                    </el-col>
                    <el-col :span="2" class="lCenter-r">至</el-col>
                    <el-col :span="11"  class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataEnd"
                            type="date"
                            placeholder="评论结束时间">
                            </el-date-picker>
                        </div>                         
                    </el-col>
                </el-row>
            </el-col>
        </el-row>             
        <!-- 充值管理 -->
        <el-row v-if="moneyboll==true" :gutter="10">
            <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col>
            <el-col :span="5" class="lMarginBO20">
                <el-input
                        placeholder="输入订单号/付款账号"
                        maxlength="20"
                        clearable
                        v-model="input">
                </el-input>                
            </el-col>
            <el-col :span="4" >
                <el-select v-model="value" placeholder="状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                 
            </el-col>
            <el-col :span="4" >
                <el-select v-model="values" placeholder="支付方式">
                    <el-option
                    v-for="item in options.paymentMethodArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                 
            </el-col>
            <el-col :span="9" >
                <el-row class="lLine40" >
                    <el-col :span="10" class="lCenter-r">
                        <div>
                                <el-date-picker
                                v-model="dataStart"
                                type="date"
                                placeholder="充值开始时间">
                                </el-date-picker>
                        </div>
                    </el-col>
                    <el-col :span="2" class="lCenter-r">至</el-col>
                    <el-col :span="10" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataEnd"
                            type="date"
                            placeholder="充值结束时间">
                            </el-date-picker>
                        </div>                         
                    </el-col>
                </el-row>
            </el-col>
            <el-col>
                <el-row :gutter="3">
                    <el-col :span="4">
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
                    <el-col :span="4">
                        <el-select v-model="cityId"
                            clearable
                            placeholder="市"
                            >
                            <el-option v-for="(item,i) in cityList"
                                :key="i"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>  
                    </el-col>  
                    <el-col :span="4">
                        <el-select v-model="origin"
                            clearable
                            placeholder="来源"
                            >
                            <el-option v-for="(item,i) in originArr"
                                :key="i"
                                :label="item.origin"
                                :value="item.code"></el-option>
                        </el-select>  
                    </el-col>                                       
                    <el-col :span="2" :offset="8">
                        <el-button v-if="$authJudge('record:recharge:select')" type="primary" @click="search">查询</el-button>
                    </el-col>
                    <el-col :span="2" class="lCenter-r"><el-button type="primary" v-if="$authJudge('record:recharge:export')" @click="headExport">导出</el-button></el-col>
                </el-row>          
            </el-col>  
        </el-row>
        <!-- 用户管理 -->
        <el-row v-if="userBoll==true" :gutter="20">
            <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col>
            <el-col class="lMarginBO20">
                <el-row>
                    <el-col :span="6">
                        <el-input
                                placeholder="输入手机号查询"
                                maxlength="20"
                                clearable
                                v-model="input">
                        </el-input>                        
                    </el-col>
                    <el-col :span="3" :offset="14">
                        <el-button class="lButtom lSize16" @click="dataAllUpdate">渠道用户同步</el-button>
                    </el-col>
                </el-row>
            </el-col>
            <el-col>
                 <el-row :gutter="20">
                    <el-col :span="3">
                        <el-select v-model="value" placeholder="性别">
                            <el-option
                            v-for="item in options.listValOne"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                  
                    </el-col>
                    <el-col :span="3">
                        <el-select v-model="valuechannel" placeholder="渠道">
                            <el-option
                            v-for="item in options.listValthree"
                            :key="item.value"
                            :label="item.name"
                            :value="item.channelId">
                            </el-option>
                        </el-select>                  
                    </el-col>                    
                    <el-col :span="3">
                        <el-select v-model="values" placeholder="状态">
                            <el-option
                            v-for="item in options.listValTwo"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>                 
                    </el-col>
                    <el-col :span="9">
                        <el-row class="lLine40">
                            <el-col :span="11" class="lCenter-r">
                                <div>
                                    <el-date-picker
                                    v-model="dataStart"
                                    type="date"
                                    placeholder="注册开始时间">
                                    </el-date-picker>
                                </div>                        
                            </el-col>
                            <el-col :span="2" class="lCenter-r">至</el-col>
                            <el-col :span="11" class="lCenter-r">
                                <div>
                                    <el-date-picker
                                    v-model="dataEnd"
                                    type="date"
                                    placeholder="结束时间">
                                    </el-date-picker>
                                </div>                         
                            </el-col>
                        </el-row>         
                    </el-col>
                    <el-col :offset="3" :span="2" class="lCenter-r"><el-button class="lButtom lSize16" v-if="$authJudge('user:export')" @click="headExport">导出</el-button></el-col>                                                             
                 </el-row>
            </el-col>
        </el-row>
        <!-- bug反馈 -->
        <el-row v-if="bugsreturn==true" :gutter="20">
            <!-- <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col> -->
            <el-col class="lMarginBO20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="4">
                <el-input
                    placeholder="输入手机号"
                    maxlength="20"
                    clearable
                    v-model="input">
                </el-input>     
            </el-col>
            <el-col :span="4">
                <el-select v-model="value" placeholder="状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>                
            </el-col>
            <el-col :span="2" v-if="$authJudge('admin:feedback:select')">
                <el-button type="primary" style="fontSize:14px" @click="search">查询</el-button>
            </el-col>
        </el-row>        
        <!-- 站内信 -->
        <el-row class="lLine40" v-if="insideBoll==true">
            <el-col :span="10" class="lSize18">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>
            <el-col :span="14" class="lRight-r" >
                <el-button class="lButtom lSize16" @click="$router.push('/backstage/inside/msg')">待发送消息</el-button>
                <el-button v-if="$authJudge('admin:mail:historical')" class="lButtom lSize16" @click="headEven">{{headObj.title}}</el-button>
            </el-col>
        </el-row>        
        <el-row v-if="insideBoll==true" :gutter="20" style="marginTop:5px">
            <el-col :span="4">
                <el-input
                        placeholder="输入昵称/手机号"
                        clearable
                        maxlength="20"
                        v-model="input">
                </el-input>
            </el-col>          
            <el-col :span="10">
                <el-row class="lLine40">
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataStart"
                            type="date"
                            :picker-options="pickerOptions0"
                            placeholder="注册开始时间">
                            </el-date-picker>
                        </div>                        
                    </el-col>
                    <el-col :span="2" class="lCenter-r">至</el-col>
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="dataEnd"
                            :picker-options="pickerOptions0"
                            type="date"
                            placeholder="结束时间">
                            </el-date-picker>
                        </div>                         
                    </el-col>
                </el-row>         
            </el-col>   
            <el-col :span="10">
                <el-row class="lLine40">
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="loginBeginAt"
                            type="date"
                            :picker-options="pickerOptions0"
                            placeholder="最后登录开始时间">
                            </el-date-picker>
                        </div>                        
                    </el-col>
                    <el-col :span="2" class="lCenter-r">至</el-col>
                    <el-col :span="11" class="lCenter-r">
                        <div>
                            <el-date-picker
                            v-model="loginEndAt"
                            :picker-options="pickerOptions0"
                            type="date"
                            placeholder="结束时间">
                            </el-date-picker>
                        </div>                         
                    </el-col>
                </el-row>         
            </el-col>                     
        </el-row> 
        <el-row v-if="insideBoll==true" :gutter="20" style="marginTop:10px">
            <el-col :span="4">
                <el-select v-model="value" placeholder="兴趣" clearable >
                    <el-option
                    v-for="(item,index) in options.listValOne"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>      
            </el-col>
            <el-col :span="5">
                <el-select v-model="values" placeholder="性别">
                    <el-option
                    v-for="(item,index) in options.listValTwo"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>       
            </el-col>
            <el-button type="primary" style="fontSize:14px;float:right;marginRight:10px;" @click="search">查询</el-button>
        </el-row>
        <!-- 活动优惠卷 -->
        <el-row v-if="activity==true" :gutter="20">
            <!-- <el-col class="lSize18 lMarginBO20">{{mateInfo.title}}</el-col> -->
            <el-col class="lMarginBO20">
                <breadcrumb :menuList ='titleList'></breadcrumb>
            </el-col>            
            <el-col :span="5">
                <el-input
                    placeholder="请输入课程名称"
                    maxlength="20"
                    clearable
                    v-model="input">
                </el-input>
            </el-col>          
            <el-col :span="3">
                <el-select v-model="value" placeholder="状态">
                    <el-option
                    v-for="item in options.listValOne"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select> 
            </el-col>
            <el-col :span="2" v-if="$authJudge('market:activitycoupon:select')">
                <el-button type="primary" @click="search">查询</el-button>
            </el-col>
            <el-col :span="14" class="lRight-r" v-if="$authJudge('market:activitycoupon:add')">
                <!-- v-if="headObj.power.includes('coupon:add')" -->
                <el-button class="lButtom lSize16" @click="headEven">{{headObj.title}}</el-button>
            </el-col>
        </el-row>                  
    </div>
</template>
<script>
// 分类管理
import breadcrumb from "@/components/breadcrumbGX/breadcrumb";
export default {
    data(){return {
        mateInfo:{},
        options: {},
        value: '', //下拉值1
        values:'',//下拉值2
        valuechannel:'',//渠道下拉
        input:'',//输入值
        input1:'',
        dataStart:'',
        dataEnd:'',        
        loginBeginAt:'',
        loginEndAt:'',        
        flags:[],
        titleList:[],
        url:'',//跳转路径
        maxNum:6, //最大值，
        reduce:0,
        filterType:{
            coupon:false,
            details:false,
            tiemHotCou:false,
            hotWord:false,
            commitBoll:false,
            record:false,
            moneyboll:false,
            userBoll:false,
            insideBoll:false,
            bugsreturn:false
        },
       pickerOptions0: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        }, 
        provinceId:'',  
        cityId:'',  
        origin:'',
        pipelineName:'',
        provinceArr:[],
        pipelineList:[],
        provinceList:[{
                        label:'省/直辖市',
                        value:''                    
                    }],
        cityList:[{
                        label:'市',
                        value:''                    
                    }],
        originList:[
                    {
                        label:'来源',
                        value:''                    
                    }            
        ],
        originArr:[],
        cityArr:[]               
    }},
   components:{
        breadcrumb
    },     
    created(){
        this.mateInfo = this.$route.meta;
        if(this.headObj.name=='recordName'){
            this.getPipelineListDate();
        }
        this.coupon = (this.headObj.name=='coupon'&&this.headObj.typeBoll==true)?true:false;
        this.details = (this.headObj.name=='detailsName'&&this.headObj.typeBoll==true)?true:false;
        this.tiemHotCou = (this.headObj.name=='timeLimit'&&this.headObj.typeBoll==true)?true:false;
        this.hotWord = (this.headObj.name=='hotWordName'&&this.headObj.typeBoll==true)?true:false;
        this.options = this.headObj.listType;
        this.commitBoll = (this.headObj.name=='commentName'&&this.headObj.typeBoll==true)?true:false;
        this.record = (this.headObj.name=='recordName'&&this.headObj.typeBoll==true)?true:false;
        this.moneyboll = (this.headObj.name=='moneyName'&&this.headObj.typeBoll==true)?true:false;
        this.userBoll = (this.headObj.name=='userName'&&this.headObj.typeBoll==true)?true:false;
        this.insideBoll = (this.headObj.name=='insideName'&&this.headObj.typeBoll==true)?true:false;
        this.bugsreturn= (this.headObj.name=='bugsname'||this.headObj.name=='proposalName'&&this.headObj.typeBoll==true)?true:false;
        this.activity = (this.headObj.name=='activity'&&this.headObj.typeBoll==true)?true:false;
        this.titleList = this.headObj.menuList;
        this.originArr = this.headObj.originArr;
        let routes = this.$router.options.routes;
        let currentPath = this.$route.path;
        this.flags = this.$getPermissions(routes,currentPath);
        if(!this.flags){
            this.flags = [];
        }  
        if(this.headObj.name=='moneyName'||this.headObj.name=='recordName'){
            this.getRegionList();
        }
        if(this.headObj.startTime>0){
                this.dataStart = new Date(this.headObj.startTime);
            if((Number(new Date())-this.headObj.startTime)<86400000*2){
                this.dataEnd = new Date(this.headObj.startTime);
            }else{
                // this.dataEnd = new Date(); getDateStr
                this.dataEnd = new Date(this.getDateStr(-1));
            }
            setTimeout(()=>{
                this.search()
            },1)
        }
    },
    props:['headObj','inputVals'],
    computed:{
        placeholderConetr(){
            if(this.headObj.name=="timeLimit"){
                return "搜索课程名";
            }else if(this.headObj.name=="coupon"){
                return "搜索优惠券名称";
            }
        }
    },
    methods:{
        //获取渠道
        getPipelineListDate(){
            var self = this;
            this.$http
                .get(this.$server.courseConstant)
                .then(res => {
                    if(res.status==200){
                        self.pipelineList = res.content.pipelineList;
                    }
                })           
        },         
        /**
         * 获取地区信息
         */
        getRegionList(){
            this.$http.get(this.$server.getRegionList,{}).then(res=>{
                if(res.status==200){
                    let provinceArr = [{
                        label:'省/直辖市',
                        value:''                    
                    }],
                        cityArr = [];
                        // areaArr = [];
                    res.content.forEach((item,index)=>{
                        item.label = item.name;
                        item.value = item.id;
                        if(item.level==1){
                            provinceArr.push(item)
                        }else if(item.level==2){
                            cityArr.push(item)
                        }
                        // else if(item.level==3){
                        //     areaArr.push(item)
                        // }
                    })
                    this.provinceArr = provinceArr;
                    this.cityArr = cityArr;
                    // this.areaArr = areaArr;
                    this.provinceList = [...this.provinceArr];
                    // this.editData.provinceList = [...this.provinceArr]
                }
            })
        },     
        /**
         * 选择省
         */
        getProvince(val,type){
            if(val){
                let obj = this.provinceArr.find(item=>item.value==val)
                let cityList = [{
                        label:'市',
                        value:''                    
                    }]
                this.cityArr.forEach(item=>{
                    if(item.parentId == obj.id){
                        cityList.push(item)
                    }
                })
                if(type==1){
                    this.cityList = cityList;
                }
            }
            if(type==1){
                this.cityId = '';
            }
        },        
        inputNull(){
            this.input1="";
        },
        getDateStr(AddDayCount) { 
            var dd = new Date(); 
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear(); 
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate(); 
            return y+"-"+m+"-"+d; 
        },        
        headEven(key){
            switch (this.headObj.name) { 
                case "coupon":
                case "timeLimit":
                case "insideName":
                case "activity":
                    this.$emit("dialogChange");
                    break; 
                case "hotWordName":  //手动添加
                    if(key&&key=='showHot'){
                        this.$emit('showHotEvent','')
                    }else{
                        this.$emit("dialogChange",this.input1);
                    }
                    break;
                default:
                    break;
            }
        },
        getmate(){
            console.log(this.$route);
        },
        dataChange(self,bufferTime){
            var timeoutId = 0;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                var valObj = {"title":'',"status":'',"status1":'',"dataStart":'',"dataEnd":'',};
                valObj.title = self.input; //输入值
                valObj.status = self.value; //第一个筛选状态
                valObj.status1 = self.values; //第二个筛选状态
                valObj.dataStart = self.dataStart; //开始时间
                valObj.dataEnd = self.dataEnd; //结束时间
                valObj.channelId = self.valuechannel;
                self.$emit('inputValPortEven',valObj)
            }, bufferTime);
        },
        search(){
            let valObj = {"title":'',"status":'',"status1":'',"dataStart":'',"dataEnd":'',"provinceId":'',"cityId":'','origin':'','pipelineName':'','loginBeginAt':'','loginEndAt':''};
            valObj.title = this.input; //输入值
            valObj.status = this.value; //第一个筛选状态
            valObj.status1 = this.values; //第二个筛选状态
            valObj.dataStart = this.dataStart; //开始时间
            valObj.dataEnd = this.dataEnd; //结束时间
            valObj.channelId = this.valuechannel;
            valObj.provinceId = this.provinceId;
            valObj.cityId = this.cityId;
            valObj.origin = this.origin;
            valObj.pipelineName= this.pipelineName;
            valObj.loginBeginAt = this.loginBeginAt; //开始时间
            valObj.loginEndAt = this.loginEndAt; //结束时间
            this.$emit('inputValPortEven',valObj)
        },
        headExport(){
            this.$emit("dialogExport");
        },
        dataAllUpdate(){
            this.$emit("channelUpdateEvev");
        }
    },
    watch: {
        inputVals:{  
            handler:function(val,oldval){ 
                if(this.inputVals==false){
                    this.inputNull();
                }
            },  
            immediate:true,//关键
            deep:true
        }, 
        'headObj.originArr': {
            handler(newName, oldName) {
                this.originArr = newName;
            },
            deep: true,
            immediate: true
        },               
        input: function(curVal,oldVal){
            var self = this;
            // self.dataChange(self,800);
            this.reduce = curVal.length;
        },
        input1: function(curVal,oldVal){
            var self = this;
            this.reduce = curVal.length;
        },        
        value: function(curVal,oldVal){
            var self = this;
            // self.dataChange(self,500);
        }, 
        values: function(curVal,oldVal){
            var self = this;
            // self.dataChange(self,500);
        },  
        valuechannel: function(curVal,oldVal){
            var self = this;
            // self.dataChange(self,500);
        },               
        dataEnd: function(curVal,oldVal){
            var self = this;
            if(Number(self.dataStart)>Number(curVal)){
                self.dataEnd = null;
            }            
        },  
        dataStart: function(curVal,oldVal){
            var self = this;
            if(Number(self.dataEnd)<Number(curVal)){
                self.dataEnd = null;
            }            
        },    
        loginEndAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.loginBeginAt)>Number(curVal)){
                self.loginEndAt = null;
            }            
        },  
        loginBeginAt: function(curVal,oldVal){
            var self = this;
            if(Number(self.loginEndAt)<Number(curVal)){
                self.loginEndAt = null;
            }            
        },                          
        '$route': function (to, from) {
            this.mateInfo = to.meta
    　　}
    },    
    mounted(){}
}
</script>
<style lang="scss" scoped>
@import "./my-component.css";
.headerDiv{
    zoom: 1;
    overflow: auto;
    background-color: #ffffff;
    padding: 10px 14px;  
}
.pingluns{
    .el-date-editor.el-input{
        width: 100%;
    }
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100% !important;
}
</style>
<template>
    <div class="teacher">
		<div class="section0">
			<div class="bgd">
				<div class="button-box">
                    <p class="button"  @click="openCooperative"></p>
                </div>
			</div>
		</div>
        <div class="section1">
            <div class="title">
                <p>部分合作老师</p>
            </div>
            <div class="content">
                <div class="teacher-item" v-for="(item,index) in teacherData" :key="index">
                    <div class="box">
                        <div class="head-box">
                            <div class="head" :class="[`head${index+1}`]"></div>
                        </div>
                        <p class="name">{{item.name}}</p>
                        <p class="job">{{item.job}}</p>
                    </div>
                </div>
            </div>
        </div>
		<div class="section3">
            <div class="title">
                <p>部分合作平台</p>
            </div>
            <div class="content">
                <div class="mobile"></div>
                <div class="platforms-box">
                    <div class="list">
                        <img v-for="(item,index) in platformData" :key="index" :src="item.src"/>
                        <!-- <div class="box box1">
                            <div class="layer" data-depth="0.90"><img class="platform1" src="../../../assets/images/cooperate/1.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform2" src="../../../assets/images/cooperate/2.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform3" src="../../../assets/images/cooperate/3.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform4" src="../../../assets/images/cooperate/4.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform5" src="../../../assets/images/cooperate/5.png"/></div>
                        </div> -->
                        <!-- <div class="box box4">
                             <div class="layer" data-depth="0.90"><img class="platform6" src="../../../assets/images/cooperate/6.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform7" src="../../../assets/images/cooperate/7.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform8" src="../../../assets/images/cooperate/8.png"/></div>
                        </div>
                        <div class="box box2">
                            <div class="layer" data-depth="0.50"><img class="platform9" src="../../../assets/images/cooperate/9.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform10" src="../../../assets/images/cooperate/10.png"/></div>
                            <div class="layer" data-depth="0.40"><img class="platform11" src="../../../assets/images/cooperate/11.png"/></div>
                            <div class="layer" data-depth="0.50"><img class="platform12" src="../../../assets/images/cooperate/12.png"/></div>
                            <div class="layer" data-depth="0.80"><img class="platform13" src="../../../assets/images/cooperate/13.png"/></div>
                            <div class="layer" data-depth="0.70"><img class="platform14" src="../../../assets/images/cooperate/14.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform15" src="../../../assets/images/cooperate/15.png"/></div>
                            <div class="layer" data-depth="0.90"><img class="platform16" src="../../../assets/images/cooperate/16.png"/></div>
                            <div class="layer" data-depth="0.40"><img class="platform17" src="../../../assets/images/cooperate/17.png"/></div>
                            <div class="layer" data-depth="0.50"><img class="platform18" src="../../../assets/images/cooperate/18.png"/></div>
                            <div class="layer" data-depth="0.20"><img class="platform19" src="../../../assets/images/cooperate/19.png"/></div>
                            <div class="layer" data-depth="0.30"><img class="platform20" src="../../../assets/images/cooperate/20.png"/></div>
                            <div class="layer" data-depth="0.30"><img class="platform21" src="../../../assets/images/cooperate/21.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform22" src="../../../assets/images/cooperate/22.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform23" src="../../../assets/images/cooperate/23.png"/></div>
                        </div>
                        <div class="box box3">
                            <div class="layer" data-depth="0.50"><img class="platform24" src="../../../assets/images/cooperate/24.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform25" src="../../../assets/images/cooperate/25.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform26" src="../../../assets/images/cooperate/26.png"/></div>
                            <div class="layer" data-depth="0.80"><img class="platform27" src="../../../assets/images/cooperate/27.png"/></div>
                            <div class="layer" data-depth="0.80"><img class="platform28" src="../../../assets/images/cooperate/28.png"/></div>
                            <div class="layer" data-depth="0.40"><img class="platform29" src="../../../assets/images/cooperate/29.png"/></div>
                            <div class="layer" data-depth="0.30"><img class="platform30" src="../../../assets/images/cooperate/30.png"/></div>
                            <div class="layer" data-depth="0.60"><img class="platform31" src="../../../assets/images/cooperate/31.png"/></div>
                            <div class="layer" data-depth="0.70"><img class="platform32" src="../../../assets/images/cooperate/32.png"/></div>
                            <div class="layer" data-depth="0.50"><img class="platform33" src="../../../assets/images/cooperate/33.png"/></div>
                            <div class="layer" data-depth="0.50"><img class="platform34" src="../../../assets/images/cooperate/34.png"/></div>
                            <div class="layer" data-depth="0.50"><img class="platform35" src="../../../assets/images/cooperate/35.png"/></div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-wrapper" :class="cooperativeFlag?'':'hidden'">
            <div class="dialog-shade"></div>
            <div class="dialog cooperate-dialog" v-if="!successFlag">
                <div class="close-box" @click="closeCooperative"><span class="close"></span></div>
                <p class="error-tips">这里是错误信息</p>
                <p class="tips">请先提交相关信息，随后学国学网工作人员会与您联系！</p>
                <div class="input-item">
                    <label>联系人</label>
                    <input type="text" maxlength="10" class="name" v-model="name">
                    <p class="error" :class="nameError?'show':''">请输入联系人</p>
                </div>
                <div class="input-item">
                    <label>手机号</label>
                    <input type="text" maxlength="11" class="phone" v-model="phone">
                    <p class="error" :class="phoneError?'show':''">请输入正确手机号</p>
                </div>
                <div class="input-item">
                    <label>邮箱</label>
                    <input type="text" class="email" maxlength="30" v-model="email">
                    <p class="error" :class="emailError?'show':''">请输入有效的邮箱地址</p>
                </div>
                <a class="submit" @click="submitCooperative">提交信息</a>
            </div>
            <div class="success-box" v-else>
                <p>您的信息已提交，请耐心等待，工作人员会尽快与您联系，请保持手机畅通！</p>
                <a @click="close">确定</a>
            </div>
        </div>
        <!-- <Login :state.sync="state"/> -->
	</div>	
</template>
<script>
var regExp = /^1[3|5|7|8|][0-9]{9}$/;
var myreg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
export default {
    data(){
        return {
            teacherData:[
                {
                    name:'鲁洪生',
                    job:'首都师范大学教授'
                },
                {
                    name:'曹雅欣',
                    job:'青年文化学者'
                },
                {
                    name:'纪清远',
                    job:'纪晓岚第六代传人'
                },
                {
                    name:'林光华',
                    job:'中国人民大学教授'
                },
                {
                    name:'简少年',
                    job:'台湾知名命理大师'
                },
                {
                    name:'李寅',
                    job:'百家讲坛主讲人'
                },
                {
                    name:'杨青',
                    job:'古琴艺术家'
                },
                {
                    name:'任景利',
                    job:'管派古琴嫡传王琴学生'
                },
                {
                    name:'尹红卿',
                    job:'国际易学联合会理事'
                },
                {
                    name:'时越',
                    job:'LG杯世界围棋冠军'
                },
            ],
            cooperativeFlag:false,
            successFlag:false,
            name:'',
            nameError:false,
            phone:'',
            phoneError:false,
            email:'',
            emailError:false,
            platformData:[]
        }
    },
    head(){
        return {
            title:'商务合作 | 学国学网',
        }
    },
    created(){
        for(let i=1;i<=35;i++){
            this.platformData.push({
                src:require(`../../../assets/images/cooperate/${i}.png`)
            })
        }
    },
    mounted(){
        tagcloud({
            selector: ".list",  //元素选择器
            fontsize: 16,       //基本字体大小, 单位px
            radius: 300,         //滚动半径, 单位px
            mspeed: "normal",   //滚动最大速度, 取值: slow, normal(默认), fast
            ispeed: "normal",   //滚动初速度, 取值: slow, normal(默认), fast
            direction: -135,     //初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
            keep: false          //鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
        });
    },
    methods:{
        openCooperative(){
            this.cooperativeFlag = true;
        },
        closeCooperative(){
            this.cooperativeFlag = false
            this.name = ''
            this.nameError = false
            this.phone = ''
            this.phoneError = false
            this.email = ''
            this.emailError = false
        },
        close(){
            this.closeCooperative();
            this.successFlag = false;
        },
        submitCooperative(){
            this.nameError = this.phoneError = this.emailError = false;
            if(this.name==''){
                this.nameError = true;
                return false;
            }
            if(!regExp.test(this.phone)){
               this.phoneError = true;
               return false; 
            }
            if(!myreg.test(this.email)){
                this.emailError = true;
                return false;
            }
            let loadingInstance = this.$loading.service({
                target:document.querySelector('.cooperate-dialog'),
                background: 'rgba(255, 255, 255, 0)'
            });
            let params = {
                name:this.name,
                phone:this.phone,
                email:this.email   
            }
            let xhr = new XMLHttpRequest();
            let url = window.location.origin=='https://www.xueguoxue.com'?'https://xgxteacher.xueguoxue.com/home/addBusinessCooperation':'http://scteacher.youfushuyuan.com/home/addBusinessCooperation'
            xhr.open('post',url,true)
            xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        loadingInstance.close()
                        this.$message.success('登记成功')
                        this.name = ''
                        this.phone = ''
                        this.email = ''
                    }
                }
            }
            xhr.send(JSON.stringify(params))
        },
    }
}
</script>
<style lang="scss">
    .teacher{
        .section0{height: 739px;
            .bgd{
                width: 100%;
                height: 100%;
                background: url('../../../assets/images/cooperate/head.png')no-repeat 50% 50%/cover;
                padding-top:493px;
                .button-box{
                    width: 1200px;
                    margin:0 auto;
                    position: relative;
                    .button{
                        border-radius:35px;
                        width: 218px;
                        height: 66px;
                        font-size: 30px;
                        cursor: pointer;
                        margin-left: -2px;
                        transition: all 0.3s;
                        &:hover{
                            box-shadow: 0 0 15px #B5875E;
                        }
                    }
                }
            }
        }
        .section1{
            padding:75px 0;
            .title{
                width: 1200px;
                margin:0 auto;
                border-bottom: 1px solid #D8D8D8;
                text-align: left;
                p{
                    padding: 0 0 22px 0;
                    font-size: 38px;
                    display: inline-block;
                    font-weight: 500;
                    color: #C30D23;
                    position: relative;
                    &::before{
                        display: block;
                        content:'';
                        width:100% ;
                        height: 8px;
                        background: #C30D20;
                        bottom:0;
                        left: 0;
                        position: absolute;
                    }       
                }
            }
            .content{
                width: 1260px;
                margin:0 auto;
                font-size: 0;
                .teacher-item{
                    padding: 0 30px;
                    width: 252px;
                    margin:50px 0 0 0;
                    display: inline-block;
                    .box{
                        text-align: center;
                        .head-box{
                            width: 192px;
                            height: 192px;
                            border-radius: 50%;
                            overflow: hidden;
                            .head{
                                width: 100%;
                                height: 100%;
                                transition: all 0.3s;
                                &:hover{
                                    transform: scale(1.1);
                                }
                                &.head1{
                                    background: url('../../../assets/images/cooperate/teacher1.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head2{
                                    background: url('../../../assets/images/cooperate/teacher2.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head3{
                                    background: url('../../../assets/images/cooperate/teacher3.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head4{
                                    background: url('../../../assets/images/cooperate/teacher4.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head5{
                                    background: url('../../../assets/images/cooperate/teacher5.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head6{
                                    background: url('../../../assets/images/cooperate/teacher6.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head7{
                                    background: url('../../../assets/images/cooperate/teacher7.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head8{
                                    background: url('../../../assets/images/cooperate/teacher8.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head9{
                                    background: url('../../../assets/images/cooperate/teacher9.jpg')no-repeat 50% 50% / cover;
                                }
                                &.head10{
                                    background: url('../../../assets/images/cooperate/teacher10.jpg')no-repeat 50% 50% / cover;
                                }
                            }
                        }
                        .name{
                            color:#333;
                            font-size: 24px;
                            margin:15px 0 10px 0;
                        }
                        .job{
                            color:#999;
                            font-size: 16px;
                            letter-spacing: 1px;
                        }
                    }
                }
            }
        }
        .dialog-wrapper{position: fixed;height: 100%;width: 100%;z-index: 10;top:0;left: 0;transition: all 0.3s ease;opacity: 1}
        .dialog-wrapper.hidden{visibility: hidden;opacity: 0}
		.dialog-shade{position: absolute;top:0;left: 0;width: 100%;height: 100%;background: #323232;opacity: 0.8;transition: all 0.5s linear;}
		.dialog{position: absolute;transform: translate(-50%,-50%);top:50%;left: 50%;width: 500px;background: #fff;border-radius: 5px;text-align: center; padding: 30px;overflow: hidden;}
		.dialog p span{color:#0062d0;}
		.dialog a{width: 250px;height: 40px;color:#fff;background: #9e0e00;font-size: 16px;text-align: center;line-height: 40px;cursor: pointer;margin-left: 70px;display:inline-block}
		.dialog a:hover{box-shadow: 0 0 10px #9a0013;transition: all 0.3s ease;}
        .tips{
			font-size: 12px;color:#bbbbbb;
		}
		.input-item{margin:10px 0;}
		.input-item label{width: 60px;font-size: 16px;display: inline-block;vertical-align: middle;text-align: right;margin-right: 10px}
		.input-item input{display: inline-block;vertical-align: middle;height: 36px;line-height: 36px;border:none;border-bottom:1px solid #dfdfdf;width: 250px;outline: none}
		.error{font-size: 14px;width: 250px;margin-left: 130px;padding: 5px 0;color:#d81c0a;visibility: hidden;text-align: left;}
		.error.show{visibility: visible;}
		.close-box{padding:10px;position: absolute;top:10px;right: 0px}
		.close{width: 20px;height:1px; background: #888;transform: rotate(45deg);display: block;}
		.close:after{content:'';display:block;width: 20px;height:1px; background: #888;transform: rotate(-90deg);}
        .error-tips{position: absolute;top:8px;left: 0;color:#d81c0a;font-size: 14px;width: 100%;text-align: center;transition:all 0.3s ease;transform: translateY(-28px);}
		.error-tips.show{transform: translate(0);}
        .login-btn{position: relative;top:470px;left: -80px;width: 200px;height: 60px;color:#9e0e00;font-size: 22px;padding: 15px 40px;border:1px solid #9a0013;border-radius: 2px;cursor: pointer;transition: all 0.5s ease;margin:0 auto;text-align: center;letter-spacing: 20px;text-indent: 20px;}
        .login-btn:hover{box-shadow: 0 0 10px #9a0013}
        .success-box{width: 400px;height: 180px;background: #fff;border-radius: 5px;padding: 20px;position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);transition: all 0.3s;}
        .success-box p{color:#888;font-size: 14px;}
        .success-box a{width: 200px;height: 40px;color:#fff;background: #9e0e00;font-size: 16px;text-align: center;line-height: 40px;cursor: pointer;margin:50px auto;display: block;}
		.success-box a:hover{box-shadow: 0 0 10px #9a0013;transition: all 0.3s ease;}
		.success-box.show{opacity: 1;visibility: visible;}
        .section3{
            padding: 50px 0;
            background: #fff;
            .title{
                width: 1200px;
                margin:0 auto;
                border-bottom: 1px solid #D8D8D8;
                text-align: left;
                p{
                    padding: 0 0 22px 0;
                    font-size: 38px;
                    display: inline-block;
                    font-weight: 500;
                    color: #C30D23;
                    position: relative;
                    &::before{
                        display: block;
                        content:'';
                        width:100% ;
                        height: 8px;
                        background: #C30D20;
                        bottom:0;
                        left: 0;
                        position: absolute;
                    }       
                }
            }
            .content{
                position: relative;
                padding-top:80px;
            }
            .mobile{
                width: 406px;
                height: 872px;
                background: url('../../../assets/images/cooperate/mobile.png')no-repeat 50% 50% / cover;
                margin: 0 auto;
            }
            .platforms-box{
                width: 100%;
                z-index: 2;
                position: absolute;
                top:80px;
                left: 0;
                .list{
                    width: 1200px;
                    margin:0 auto;
                    position: relative;
                    img{
                        position: absolute;
                        // transform: translate3d(0,0,0);
                        // transition: .5s;
                    }
                    .box{
                        // perspective:1200px;
                        // transition: .5s ease-out;
                    }
                    .platform1{top:194px;left: 390px;}
                    .platform2{top:284px;left: 234px;}
                    .platform3{top:386px;left: 316px;}
                    .platform4{top:478px;left: 234px;}
                    .platform5{top:585px;left: 296px;}
                    .platform6{top:472px;left: 705px;}
                    .platform6{top:472px;left: 705px;}
                    .platform7{top:390px;left: 760px;}
                    .platform8{top:290px;left: 660px;}
                    .platform9{top:90px;left: 310px;}
                    .platform10{top:194px;left: 190px;}
                    .platform11{top:386px;left: 90px;}
                    .platform12{top:580px;left: 80px;}
                    .platform13{top:696px;left: 240px;}
                    .platform14{top:796px;left: 250px;}
                    .platform15{top:796px;left: 670px;}
                    .platform16{top:696px;left: 720px;}
                    .platform17{top:580px;left: 820px;}
                    .platform18{top:472px;left: 950px;}
                    .platform19{top:390px;left: 970px;}
                    .platform20{top:290px;left: 920px;}
                    .platform21{top:194px;left: 820px;}
                    .platform22{top:90px;left: 726px;}
                    .platform23{top:0px;left: 750px;}
                    .platform24{top:10px;left:120px;}
                    .platform25{top:90px;left:0px;}
                    .platform26{top:284px;left:-24px;}
                    .platform27{top:478px;left:-20px;}
                    .platform28{top:696px;left:-20px;}
                    .platform29{top:795px;left:-10px;}
                    .platform30{top:796px;left:900px;}
                    .platform31{top:696px;left:970px;}
                    .platform32{top:580px;left:1030px;}
                    .platform33{top:192px;left:980px;}
                    .platform34{top:90px;left:940px;}
                    .platform35{top:10px;left:1030px;}
                }
            }
            .button{background: #9a0013;color:#ffffff;font-size: 22px;padding: 15px 55px;border:1px solid #9a0013;border-radius: 75px;cursor: pointer;transition: all 0.5s ease;display: inline-block;margin:130px auto 88px auto}
		    .button:hover{box-shadow: 0 0 10px #9a0013}
        }
    }
</style>

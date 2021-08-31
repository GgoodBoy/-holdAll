function hybird_app(){
	this.isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
	//APP内部h5，右上角展示分享按钮
	this.showShareBtn = function(shareData){
		var message = {
            describe:'导航栏显示分享按钮',
            method:"share",
            params:{
                title:shareData.title||'',
                desc:shareData.describe||'',
                link:shareData.link||'',
                imgUrl:shareData.iconUrl||'http://xgxw-pic.oss-cn-beijing.aliyuncs.com/hp/logo.png'
	        }
        }
        if(this.isIos){
          	try{
              	window.webkit.messageHandlers.iOSAppMethodName.postMessage(message)
          	}catch(err){

          	}
        }else{
            if(window.android){
                if(window.android.notify){
                    window.android.notify(JSON.stringify(message))
                }
            }    
        }
	}
	//是否通过app webview打开
	this.isApp = function(){
		var temp = false;
		if(this.isIos){
            try {    
         	    window.webkit.messageHandlers.iOSAppMethodName.postMessage("messageBody");
              	temp = true;
            }
            catch(err) {

			}
        }else{
            if(window.android){
                if(window.android.methForAndroid){
                	temp = true;
                }
            }
      	}
      	return temp;
	}
	//关闭app webview
	this.closeWebView = function(){
		if(this.isIos){
  		    try{
           		window.webkit.messageHandlers.iOSAppMethodName.postMessage(
				{
                  	describe:'在APP内部直接关闭webview',
                  	method:'closeWebView'
                }); 
            }catch(err){

            }
        }else{
            if(window.android){
                if(window.android.notify){
                    var message = JSON.stringify({
                        describe:'在APP内部直接关闭webview',
                        method:'closeWebView',
                        params:{}
                    })
                    window.android.notify(message);
                }
            }
        }
	}
	/**
	*进入课程详情页
	*courseId:课程id
	*close=true:关闭webview,close=false:保持webview打开
	*/
	this.goCourseDetails = function(courseId,close){
		var params = {}
		if(close){
			params = {
				'courseId':courseId
			}
		}else{
			params = {
				'courseId':courseId,
                'isCloseWebView':false
			}
		}
		if(this.isIos){
     		try{
         		window.webkit.messageHandlers.iOSAppMethodName.postMessage({
         			describe:'去课程详情页',
             		method:'goCourseDetail',
             		params:params
         		}); 
     		}catch(err){}
      	}else{
        	if(window.android){
           		if(window.android.notify){
               		var message = JSON.stringify({
                  		describe:'在APP内部直接关闭webview,并进入课程详情页面',
                  		method:'openLesson',
                  		params:params
               		})
               		window.android.notify(message);
          		}
        	}
		}
	}
	/**
	*
	*courseId 课程id
	*href 如果存在，打开APP失败将进入这个地址，如果不存在，当前方法只用来唤起APP
	*/
	this.goCourseDetailsByH5 = function(courseId,href){
		if(this.isIos){
			window.location.href='xueguoxuewang://type=course&courseId='+courseId;
			if(href&&href.length>0){
				setTimeout(function(){
					var hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden ||window.document.webkitHidden 
					if(typeof hidden =="undefined" || hidden ==false){
						window.location.href = href;
					}
				},2000)
			}			
		}else{
			var head= document.getElementsByTagName('head')[0];
			var script= document.createElement('script');
			script.type= 'text/javascript';
			script.onload = script.onreadystatechange = function() {
		    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
		        script.onload = script.onreadystatechange = null;
		    } };
			script.src= 'https://static.jmlk.co/scripts/dist/jmlink.min.js'
			head.appendChild(script);
			var a = document.createElement('a');
			a.setAttribute('data-params','{courseId:'+courseId+'}');
			a.setAttribute('href', 'https://am7ilz.jmlk.co/AAHl');
			a.setAttribute('data-jmlink', 'true');
			a.setAttribute('data-auto', 'false');
			document.body.appendChild(a);
			setTimeout(function(){
				a.click();
			},2000)
		}
	}
}
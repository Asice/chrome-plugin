//向页面注入JS
function injectCustomJs(jsPath,followType)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
	var _input=document.createElement("input");
	//加文本以子节点形式加入到P元素中
	_input.value=followType;
	_input.id="followType_4453";
	document.body.appendChild(_input);
}

//直接提交表单，
window.addEventListener("message", function(e){
	//关注
	if(e.data.data=="follow") {
		//先获取密钥
		var csrftoken=null;
		var cookies=document.cookie.split(";");
		for(var p in cookies){
			var cookie=cookies[p];
			if(cookie.indexOf("csrftoken=")!=-1){
				csrftoken=cookie.split("=")[1];
			}
		}
		
		var ratinglist=$("ul[class='rating-list']");
		var followlist=$("ul[class='follower-list']");
		var userids = new Array(); 
		if(ratinglist.length>0){
			$("ul[class='rating-list'] li").each(function(){
				var uid=$(this).attr("data-userid");
				if($(this).find(".ic_star_rating.star_4").length>0||$(this).find(".ic_star_rating.star_5").length>0){
					if(!userids.includes(uid)&&uid!=-1){ 
						userids.push(uid);
					}
				}
			});
		}else if(followlist.length>0){
			$("ul[class='follower-list'] li").each(function(){
				var uid=$(this).attr("data-follower-shop-id");
				if(!userids.includes(uid)&&uid!=-1){ 
					userids.push(uid);
				}
			});
		}else{
			//获取itemid和shoipid
			var host=window.location.pathname
			var shopid=host.substring(host.lastIndexOf(".")+1,host.length);
			var host2=host.substring(0,host.lastIndexOf("."));
			var itemid=host2.substring(host2.lastIndexOf(".")+1,host2.length);
			for(var index=0;index<50;index++){
				setTimeout({},200)
				var _$p=0;
				$.ajax({
					type: "GET",
				    url:"/api/v2/item/get_ratings?filter=0&flag=1&itemid="+shopid+"&limit=10&offset="+parseInt(index)*parseInt(10)+"&shopid="+itemid+"&type=0&cxxx="+new Date().getTime(),
				    dataType: "json",
				    async:false, 
				    success: function(data){
				    	var res = [];
				    	var items=data.data.ratings;
				    	for(var p in items){
				    		_$p++;
				    		var uid=items[p].author_shopid;
				    		var rating_star=items[p].rating_star;
				    		//大于3星的
							if(!userids.includes(uid)&&uid!=-1&&rating_star>3){ 
								userids.push(uid);
							}
				    	}
				    },
				    error:function(a,b,c){
				    	alert("\u672a\u767b\u5f55\u7cfb\u7edf\u6216\u8005\u672a\u77e5\u9519\u8bef")
				    }
				})
				if(_$p==0)break;
			}
		}
		var count=0;
		userids.forEach(function(value, index, a){
			$.ajax({
				type: "POST",
			    url:"/api/v0/buyer/follow/shop/"+value+"/",
			    dataType: "json",
			    async:false, 
			    headers:{
		    		  'x-csrftoken': csrftoken
		    	 },
			    success: function (data) {
			    	if(data.success){
			    		 count++; 
			    	}
			    }
			});
		});
		alert("\u603b\u5171\u5173\u6ce8"+count+"\u4e2a");
	}
	if(e.data.data=="unfollow") {
		var count=0;
		var csrftoken=null;
		var cookies=document.cookie.split(";");
		for(var p in cookies){
			var cookie=cookies[p];
			if(cookie.indexOf("csrftoken=")!=-1){
				csrftoken=cookie.split("=")[1];
			}
		}
		$("#shop-followers li").each(function(){
			var uid=$(this).attr("data-follower-shop-id")
			$.ajax({
				type: "POST",
			    url:"/api/v0/buyer/unfollow/shop/"+uid+"/",
			    dataType: "json",
			    async:false, 
			    headers:{
		    		  'x-csrftoken': csrftoken
		    	 },
			    success: function (data) {
			    	if(data.success){
			    		 count++; 
			    	}
			    }
			});
		})
		alert("\u53d6\u6d88\u5173\u6ce8"+count+"\u4e2a");
	}
	if(e.data.data=="comment") {
		$(".ct-actions div.shopee-button").each(function(){
			if($(this).parent().parent().find(".ct-items").find(".ct-item-return").length>0){
				//alert($(this).parent().parent().find(".ct-items").find(".ct-item-return").html())
			}else{
				$(this).click();
				$(".lf-dialog-container .lm-actions div.ember-view").html("批量评价");
				return false;
			}
		});
		var count=0;
		$(".lf-dialog-container .lm-actions div.ember-view").click(function(event){
			var text=$(".lf-dialog-container textarea").val();
			$(".ct-actions div.shopee-button").each(function(){
				 sleep(1000).then(() => {
					 if($(this).parent().parent().find(".ct-items").find(".ct-item-return").length>0){
					}else{
						$(this).click();
						$(".lf-dialog-container textarea").val(text);
						$(".lf-dialog-container .star-rating span:first").click();
						$(".lf-dialog-container .lm-actions div.ember-view").click();
						count++;
					}
				})
				
			});
		});
		alert("Successfully commented "+count);
		
		
		/*$(".shopee-button--inactive").each(function(){
			alert($(this).attr("id"))
		})*/
	}
}, false);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


//监听backgroun的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.greeting == "follow"){
		injectCustomJs(null,"follow");
	}else if (request.greeting == "unfollow"){
		injectCustomJs(null,"unfollow");
	}else if (request.greeting == "comment"){
		injectCustomJs(null,"comment");
	}
});


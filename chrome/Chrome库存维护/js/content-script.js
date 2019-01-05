//向页面注入JS
function injectCustomJs(jsPath)
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
}
//直接提交表单，
window.addEventListener("message", function(e){
	if(e.data&&(e.data.cmd=="1688"||e.data.cmd=="taobao")) {
		//传递给background
		//chrome.runtime.sendMessage({host:"1688",data:e.data.data}, function(response) {
		//});
		var $data=e.data.data;
        $.ajax({
            type: "POST",
            url:"https://www.chhapp.com/product/spiderupdate",
            data: $data,
            dataType: "json",
            success: function(data){
                if(data.code=="SUCCESS"){
                    var uurl=data.data.url.replace("#detail","").replace("#","");
                    if(uurl.indexOf("?")==-1){
                        uurl=uurl+"?1";
                    }
                    location.href=uurl+"&sssid="+data.data.id+"&sssdate="+data.data.spider_date;
                }else{
                    alert(data.msg)
                }
            },
            error:function(a,b,c){
                alert("\u672a\u767b\u5f55\u7cfb\u7edf\u6216\u8005\u672a\u77e5\u9519\u8bef")
            }
        })
	}
}, false);

(function() {
    if(location.href.indexOf("http://page.1688.com/shtml/static/wrongpage.html")!=-1){//404
        $.ajax({
            type: "POST",
            url:"https://www.chhapp.com/product/spiderUrl",
            data: {spider_date:"2018-12-21",error:1},
            dataType: "json",
            success: function(data){
                if(data.code=="SUCCESS"){
                    var uurl=data.data.url.replace("#detail","").replace("#","");
                    if(uurl.indexOf("?")==-1){
                        uurl+="?1"
                    }
                    location.href=uurl+"&sssid="+data.data.id+"&sssdate="+data.data.spider_date;
                }else{
                    alert(data.msg)
                }
            },
            error:function(a,b,c){
                alert("\u672a\u767b\u5f55\u7cfb\u7edf\u6216\u8005\u672a\u77e5\u9519\u8bef")
            }
        })
    }
    if(location.host == 'detail.1688.com'||location.host == 'item.taobao.com'
        ||location.host == 'detail.tmall.com'){
    	setTimeout(function(){
            injectCustomJs();
		},2000)
    }
})();



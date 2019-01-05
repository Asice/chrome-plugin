// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type,data)
{
	window.postMessage({cmd: type, data: data}, '*');
}



// 通过DOM事件发送消息给content-script
(function() {
	/*if(location.host == 'shopee.com.my'){
		sendMessageToContentScriptByPostMessage(location.host,null)
	}else{
		alert(location.host+"\u672a\u5f00\u53d1")
	}*/
	var ftype=document.getElementById("followType_4453").value;
	sendMessageToContentScriptByPostMessage(location.host,ftype)
})();

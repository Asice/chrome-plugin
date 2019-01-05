//-------------------- 右键菜单演示 ------------------------//

function sendMessage2Content() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			greeting : "clickMenu"
		}, function(response) {//content的回调
			//alert(response.farewell)
			
		});
	});
}

//监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	
});

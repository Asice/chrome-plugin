//-------------------- 右键菜单演示 ------------------------//
chrome.contextMenus.create({
	title : "批量关注所有评论客户",
	onclick : function() {
		sendMessage2Content("follow")
	}
});
chrome.contextMenus.create({
	title : "批量取消关注",
	onclick : function() {
		sendMessage2Content("unfollow")
	}
});
chrome.contextMenus.create({
	title : "批量评价",
	onclick : function() {
		sendMessage2Content("comment")
	}
});

function sendMessage2Content(greeting) {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			greeting : greeting
		}, function(response) {//content的回调
			//alert(response.farewell)
			
		});
	});
}

//监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	
});

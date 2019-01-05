var timeInterval = 240 * 60;
var queryData = new FormData();
var MiaoAssistantApiUrl = "http://wx.zaozaosheng.com";
var MiaoAssistantPostList = MiaoAssistantApiUrl + '/api/zzs/posts/';
var MiaoAssistantUpdateDataUrl = MiaoAssistantApiUrl + '/api/zzs/version/';
var MiaoAssistantSpeedUrl = MiaoAssistantApiUrl + '/api/promote/param';
var MiaoAssistantServerTimeUrl = 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp';
var MiaoAssistantParam = {};
MiaoAssistantParam["version"] = "7.4";
var extID = chrome.i18n.getMessage("@@extension_id");
var extVersion;
var platform = 'normal';
localStorage['platform'] = platform;
localStorage['miaoassistantapiurl'] = MiaoAssistantApiUrl;
localStorage['miaoassistantapiurl'] = MiaoAssistantApiUrl;
localStorage['shengzaozao_com_miao_autoforbuy'] = 'N';
if (!localStorage["orderBuyRight"]) localStorage["orderBuyRight"] = 'Y';
if (!localStorage["payBuyRight"]) localStorage["payBuyRight"] = 'Y';
if (!localStorage["miaoBuyRight"]) localStorage["miaoBuyRight"] = 'Y';
if (!localStorage["activeEndDate"]) localStorage["activeEndDate"] = '';
if (!localStorage["timeGap"]) localStorage["timeGap"] = '0';
if (localStorage["shengzaozao_com_api_timeinterval"] > 0) {
    timeInterval = localStorage["shengzaozao_com_api_timeinterval"] * 60;
}
AjaxPost('manifest.json', 'form',
function(rsp) {
    extVersion = rsp.version;
    localStorage['currentVersion'] = extVersion;
    queryData.append('version', extVersion);
    MiaoAssistantParam["version"] = extVersion;
}).send();
MiaoAssistantParam["timestamp"] = localStorage['timestamp'];
AjaxPost(MiaoAssistantPostList, 'form', ajaxMiaoHandler).send();
AjaxPost(MiaoAssistantUpdateDataUrl + '?ver=' + MiaoAssistantParam["version"], 'form', ajaxMiaoAssistantHandler).send();
AjaxPost(MiaoAssistantSpeedUrl + '?icode=' + localStorage['icode'] + "&promotecode=" + localStorage['promotecode'], 'form', ajaxMiaoAssistantSpeedHandler).send();
var i = 0;
var gapTimeInterval = setInterval(function() {
    getGapTime(MiaoAssistantServerTimeUrl,
    function(timeGap, networkTime) {
        i++;
        if (!isNaN(timeGap) && networkTime <= 40) {
            localStorage['timeGap'] = timeGap;
            clearInterval(gapTimeInterval);
        }
        if (i >= 50) {
            clearInterval(gapTimeInterval);
        }
    })
},
1000);
setInterval(function() {
    var i = 0;
    gapTimeInterval = setInterval(function() {
        getGapTime(MiaoAssistantServerTimeUrl,
        function(timeGap, networkTime) {
            i++;
            if (!isNaN(timeGap) && networkTime <= 40) {
                localStorage['timeGap'] = timeGap;
                clearInterval(gapTimeInterval);
            }
            if (i >= 50) {
                clearInterval(gapTimeInterval);
            }
        })
    },
    1000);
},
180000);
setInterval(function() {
    var pollRequestMiaoList = AjaxPost(MiaoAssistantPostList, 'form', ajaxMiaoHandler);
    var pollRequestMiaoAssistantList = AjaxPost(MiaoAssistantUpdateDataUrl + '?ver=' + MiaoAssistantParam["version"], 'form', ajaxMiaoAssistantHandler);
    var pollRequestMiaoAssistantSpeed = AjaxPost(MiaoAssistantSpeedUrl + '?icode=' + localStorage['icode'] + "&promotecode=" + localStorage['promotecode'], 'form', ajaxMiaoAssistantSpeedHandler);
    MiaoAssistantParam["timestamp"] = localStorage['timestamp'];
    pollRequestMiaoList.send();
    pollRequestMiaoAssistantList.send();
    pollRequestMiaoAssistantSpeed.send();
},
timeInterval * 1000);
function ajaxMiaoAssistantHandler(rsp) {
    if (rsp.status != 'ok') return;
    localStorage['latestVersion'] = rsp.version || "0";
    localStorage['Description'] = rsp.description || "有版本更新，更新一波BUG";
    localStorage['versionUrl'] = rsp.url || "http://www.zaozaosheng.com";
}
function ajaxMiaoAssistantSpeedHandler(rsp) {
    if (rsp["status"] != 'ok') return;
    for (var key in rsp) {
        if (rsp[key] != undefined) {
            localStorage.setItem(key, rsp[key]);
        }
    }
}
function ajaxMiaoHandler(rsp) {
    if (rsp['status'] != 'ok') return;
    obj = rsp;
    localStorage['newPost'] = rsp.content ? JSON.stringify(rsp.content) : '';
    localStorage['timestamp'] = rsp.timestamp || "";
    var data_precv = '';
    var diff = 0;
    var bage = '';
    if (Check_JsonFormt(localStorage['data_post'])) {
        var data_precv = JSON.parse(localStorage['data_post']);
        for (var key in rsp.content) {
            if (data_precv['content'] != undefined) {
                for (var i = 0; i < data_precv.content.length; i++) {
                    if (data_precv.content[i]['url'] == rsp.content[key]['url']) {
                        diff++;
                        break;
                    }
                }
            }
        }
    }
    localStorage['data_post'] = JSON.stringify(obj);
    var bage = 0;
    if (rsp['content'] != undefined) {
        bage = (rsp.content.length - diff);
    }
    if (bage > 0) {
        chrome.browserAction.setBadgeText({
            text: ''
        });
        chrome.browserAction.setBadgeText({
            text: '' + bage + ''
        });
    }
    localStorage['isDisplayInfo'] = 'false';
}
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var dicReturn;
    if (request.action == 'get') {
        var codeBeginTime = +new Date;
        var value = {};
        for (var keyName in request.data.key) {
            if (localStorage[keyName]) {
                value[keyName] = localStorage[keyName];
            }
        }
        var tabStorage = JSON.parse(sessionStorage['tabStorage'] || '{}');
        if (tabStorage[sender.tab.id]) {
            for (var key in tabStorage[sender.tab.id]) {
                value[key] = tabStorage[sender.tab.id][key];
            }
        }
        dicReturn = {
            'status': 200,
            'value': value
        };
        sendResponse(dicReturn);
    }
    if (request.action == 'set' || request.action == 'setJson') {
        if (!sessionStorage['tabStorage']) sessionStorage['tabStorage'] = '{}';
        var tabStorage = JSON.parse(sessionStorage['tabStorage']);
        var setTabKeyFunc = function(tabStorage, key, value) {
            var currTabJson = tabStorage[sender.tab.id] || {};
            currTabJson[key] = value;
            tabStorage[sender.tab.id] = currTabJson;
        }
        if (request.action == 'set') {
            setTabKeyFunc(tabStorage, request.data.key, request.data.value);
            sessionStorage['tabStorage'] = JSON.stringify(tabStorage);
            dicReturn = {
                'status': 200,
                'errbuf': value + ' 已经成功保持!'
            };
        } else {
            for (var key in request.data) {
                setTabKeyFunc(tabStorage, key, request.data[key]);
            }
            sessionStorage['tabStorage'] = JSON.stringify(tabStorage);
            dicReturn = {
                'status': 200,
                'errbuf': 'Json数据已经成功保持!'
            };
        }
        sendResponse(dicReturn);
    }
});
function getGapTime(url, callback) {
    var xhr = new XMLHttpRequest();
    var startDate, endDate, networkTime, serverTime, gagTime, rsp;
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            endDate = new Date();
            rsp = JSON.parse(xhr.responseText);
            serverTime = parseInt(rsp.data.t);
            if (!serverTime) return;
            networkTime = Math.floor((endDate.getTime() - startDate.getTime()) / 2);
            gagTime = serverTime - (endDate.getTime() - networkTime);
            callback && callback(gagTime, networkTime);
        }
    }
    startDate = new Date();
    xhr.send();
}
function AjaxPost(url, contentType, ajaxHandler) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                rsp = JSON.parse(xhr.responseText);
                ajaxHandler(rsp);
            }
        }
    }
    xhr.open("POST", url, true);
    if (contentType == 'json') {
        xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    }
    return xhr;
}
function Check_JsonFormt(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch(e) {
            return false;
        }
    }
}
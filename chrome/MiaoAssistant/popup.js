if (!localStorage['miaoTime'] && !localStorage['miaoData']) {
    localStorage['miaoTime'] = '[0,0,0]';
    localStorage['miaoData'] = '[{"title": "","img": "","url": "www.zaozaosheng.com","price": "","miaoPrice": ""}]';
}
var autoStartFlag = (localStorage['shengzaozao_com_miao_autoforbuy'] == 'Y');
var MiaoAssistantTime = JSON.parse(localStorage['miaoTime']);
var MiaoAssistantData = JSON.parse(localStorage['miaoData']);
var MiaoAssistantAds;
var butto_start = '.r' + 'u' + 'n' + 'M' + 'iao' + 'A' + 'ssi' + 'stant';
if (localStorage['adsence_flag'] == undefined) localStorage["adsence_flag"] = 0;
function parseTemplate(data, template) {
    var _template = template;
    for (var i in data) {
        while (_template.search("{%" + i + "}") != -1) {
            _template = _template.replace("{%" + i + "}", data[i]);
        }
    }
    return _template;
}
function hide(dom) {
    $(dom).addClass("fn-hide");
}
function show(dom) {
    $(dom).removeClass("fn-hide");
}
window.addEventListener('DOMContentLoaded',
function() {
    var template = $('#J-dataTemplate')[0].innerHTML;
    var oMiaoAssistantList = $('#J-MiaoAssistantList')[0];
    var oMiaoAssistantTime = $('#J-MiaoAssistantStartTime')[0];
    var oMiaoAssistantAds = $('#J-ads')[0];
    var oMiaoAssistantMore = $('.MiaoAssistantMore')[0];
    var oSponsor = $('#sponsor')[0];
    if (localStorage['currentVersion']) {
        $('.version').html('v' + localStorage['currentVersion']);
    }
    $(butto_start).click(function() {
        /*if (!localStorage['icode']) {
            layer.msg("初始化失败，点击 <a class='iconfont icon-chilun set ' href='options.html?ref=optSuccessSettings' target='_blank' title='设置'></a> 设置ICODE");
            return;
        }*/
       // if (localStorage['promotecode']) localStorage['click_auto_buy'] = 'Y';
        chrome.tabs.executeScript(null, {
            file: "content_script.js"
        },
        function() {
            setTimeout(function() {
                localStorage['click_auto_buy'] = 'N';
                window.close();
            },
            100);
        });
    });
    if (localStorage['sponsor']) {
        oSponsor.innerHTML = localStorage['sponsor'];
        show(oSponsor);
    } else {
        hide(oSponsor);
    }
    hide(oSponsor);
    chrome.browserAction.setBadgeText({
        text: ''
    });
    localStorage['badge'] = 'hide';
    if (isTimeValidate(JSON.parse(localStorage['miaoTime'])[0] * 1000) && localStorage['isDisplayInfo'] != 'false') {
        show($('#J-MiaoAssistantSummary')[0]);
        hide($("#J-MiaoAssistantList .loading")[0]);
        oMiaoAssistantTime.innerText = MiaoAssistantTime[1] + ":" + MiaoAssistantTime[2];
        MiaoAssistantData.forEach(function(v, i) {
            if (!v.miaoPrice) {
                v.priceHidden = 'fn-hide';
            }
            var listItem = document.createElement('li');
            listItem.innerHTML = parseTemplate(v, template);
            oMiaoAssistantList.appendChild(listItem);
        })
    } else {
        hide($('#J-MiaoAssistantSummary')[0]);
        hide($("#J-MiaoAssistantList .loading")[0]);
        show($("#J-MiaoAssistantList .noItems")[0]);
    }
    if (localStorage['newPost']) {
        MiaoAssistantAds = JSON.parse(localStorage['newPost']);
        MiaoAssistantAds.forEach(function(item, index) {
            var listItem = document.createElement('li');
            if (!item.miaoPrice) {
                item.priceHidden = 'fn-hide';
            }
            listItem.innerHTML = parseTemplate(item, template);
            oMiaoAssistantAds.appendChild(listItem);
        });
        show(oMiaoAssistantAds);
    }
    if (localStorage['currentVersion'] < localStorage['latestVersion']) {
        $(".update").html(' <a href="' + localStorage['versionUrl'] + '" target="_blank">' + localStorage['Description'] + ' 点击更新</a>');
        show($(".update"));
    }
    $("#main_title").html("早早省秒杀神器 " + localStorage['currentVersion']);
    var obj = new Date(localStorage["shengzaozao_com_miao_speed_time"]);
    var time_cur = (new Date()).getTime();
    var speed_time = Date.parse(obj);
    var cloud_speed = localStorage["shengzaozao_com_miao_speed_value"] || 0;
    var text_tail = '<a href="options.html?ref=optSuccessSettings&style=small" >(查看加速)</a>';
    if (time_cur > speed_time) {
        text_tail = '<a href="options.html?ref=optSuccessSettings&style=small" style="color:red;">(激活10倍速度)</a>';
    }
    if (cloud_speed != 10) {
        localStorage["shengzaozao_com_miao_readyimitation_flag"] = 0;
    }
    if (cloud_speed == 0) {
        $("#tip_speed").html("未开启云加速" + text_tail);
    } else {
        var imghtml = "<img width='14' src='./template/image/fire.svg'/>"$("#tip_speed").html(imghtml + " 秒杀加速" + cloud_speed + "倍 " + text_tail);
    }
    if (localStorage['shengzaozao_com_adsence_img'] != undefined && localStorage['shengzaozao_com_adsence_img'] != '' && localStorage['shengzaozao_com_adsence_img_precv'] != localStorage['shengzaozao_com_adsence_img']) {
        localStorage['adsence_flag'] = '';
        localStorage['shengzaozao_com_adsence_img_precv'] = localStorage['shengzaozao_com_adsence_img'];
    }
    if (localStorage['shengzaozao_com_adsence_img'] != undefined && localStorage['shengzaozao_com_adsence_img'] != '' && localStorage['adsence_flag'] != getNowFormatDate()) {
        var src = localStorage['shengzaozao_com_adsence_img'];
        var url = localStorage['shengzaozao_com_adsence_url'];
        if (src.length < '9') src = '#';
        var img = '<a href="' + url + '" target="_blank" style="text-align:center"> <img src="' + src + '"  width="100%" height="100%" "  style="background:url(template/image/loading_line.svg) no-repeat; background-position:50% 50%; "  /></a>';
        layer.open({
            type: 5,
            area: ['250px', '330px'],
            offset: ['100px', '100px'],
            title: false,
            closeBtn: 0,
            shadeClose: true,
            content: img,
            success: function() {},
            end: function() {
                localStorage['adsence_flag'] = getNowFormatDate();
            }
        });
    }
},
false);
if (localStorage['shengzaozao_com_notice_name'] != '' && localStorage['shengzaozao_com_notice_name'] != ' ' && localStorage['shengzaozao_com_notice_name'] != undefined) {
    var img = '';
    var icon = '';
    if (localStorage['shengzaozao_com_notice_icon'] != '' && localStorage['shengzaozao_com_notice_icon'] != undefined) {
        icon = '<span style="float:right; background:url(' + localStorage['shengzaozao_com_notice_icon'] + ') no-repeat; background-size:16px;  width:16px; height:16px;display:block;" ></span>';
    }
    if (localStorage['shengzaozao_com_notice_img'] != '' && localStorage['shengzaozao_com_notice_img'] != undefined) {
        img = '<img src="' + localStorage['shengzaozao_com_notice_img'] + '"  width="250" height="250" style="background:url(template/image/loading_line.svg) no-repeat; background-position:50% 50%; "  />';
    }
    $('#shengzaozao_com_notice_name').show();
    $('#shengzaozao_com_notice_name').html(localStorage['shengzaozao_com_notice_name'] + icon);
    $('#shengzaozao_com_notice_name').mouseover(function() {
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            content: "<div style='min-width:250px; min-height:300px;'>" + img + '<div style="padding:15px;text-align:center;">' + localStorage['shengzaozao_com_notice_text'] + '</div></div>'
        });
    });
}
if (!localStorage["shengzaozao_com_miao_agreement_state"] || localStorage["shengzaozao_com_miao_agreement_state"] == 'N') {
    layer.open({
        area: ['300px', '100px'],
        offset: ['200px', '60px'],
        content: '您还未同意<b>早早省秒杀神器</b>使用协议，秒单功能还无法使用。',
        closeBtn: 0,
        zIndex: 999999991,
        btn: ['查看协议'],
        yes: function(index, layero) {
            optionURL = chrome.extension.getURL("options.html");
            window.open(optionURL);
            layer.close(index);
        }
    });
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function setCheckBox($obj, value) {
    if (value == 'Y') {
        $obj.prop("checked", true);;
    } else {
        $obj.prop("checked", false);
    }
}
function getCheckBox($obj) {
    var value = 'N';
    if ($obj.prop("checked")) {
        value = 'Y';
    } else {
        value = 'N';
    }
    return value;
}
function save_options() {
    save_localStorage();
    layer.msg("保存成功");
}
function getUsericode() {
    $('#icode').html('正在申请ICODE，请稍后');
    $.ajax({
        async: true,
        type: 'post',
        data: '',
        contentType: 'application/json; charset=utf-8',
        url: localStorage['miaoassistantapiurl'] + '/api/promote/code/',
        dataType: 'json',
        success: function(data) {
            if (data["status"] == 'ok' && data['code'] != undefined && data['code'] != '') {
                $('#icode').html("ID:" + data.code);
                localStorage['icode'] = data.code;
                localStorage['promotecode'] = data.promotecode;
                getUserShare();
            } else {
                $('#icode').html('申请失败 [早早商城可免费兑换ICODE-点击指南进入]');
            }
            if (data["msg"] != null && data["msg"] != '' && data["msg"] != undefined) layer.msg(data.msg);
        },
        error: function() {
            $('#icode').html('申请失败 [早早商城可免费兑换ICODE-点击指南进入]');
        }
    });
}
function getUserShare() {
    var total = $('#share_total').html();
    var speed = $('#shareSpeed').html();
    var icode = localStorage['icode'];
    var animation_time = 1.5;
    if (icode == undefined) return;
    $.ajax({
        async: true,
        type: 'post',
        data: '',
        contentType: 'application/json; charset=utf-8',
        url: localStorage['miaoassistantapiurl'] + '/api/promote/number/?' + 'icode=' + icode + "&promotecode=" + localStorage['promotecode'] + '&total=' + total,
        dataType: 'json',
        success: function(data) {
            if (data["status"] == 'ok') {
                for (var key in data.data) {
                    localStorage.setItem(key, data.data[key]);
                }
                $(".summary_img_block_loading").css('display', 'none');
                $(".summary_img_block").css('display', 'block');
                $('#context').css({
                    "animation": "widthin 5s .2s ease both"
                });
                $('#context_taill').css({
                    "animation": "fadeout 1.5s .2s ease both"
                });
                for (var key in data.skill) {
                    if (data.skill[key] != null && data.skill[key] != '' && data.skill[key] != undefined) {
                        animation_time = animation_time + 1.2;
                        $("#" + key).css("opacity", 0);
                        $("#" + key + "_title").html(data.skill[key]['title']);
                        $("#" + key + "_value").html(data.skill[key]['value']);
                        $("#" + key).css("background-image", "url('" + data.skill[key]['img'] + "')");
                        $("#" + key).css({
                            "animation-delay": "5s",
                            "animation": "fadein 1s forwards"
                        });
                        if (key == "shengzaozao_com_miao_speed") {
                            localStorage.setItem("shengzaozao_com_miao_speed_value", data.skill[key]['value']);
                            $("#shengzaozao_com_miao_speed_time_text_value").html(data.skill[key]['time_text']);
                            if (data.skill[key]['speed_time'] != undefined) {
                                localStorage.setItem("shengzaozao_com_miao_speed_time", data.skill[key]['speed_time']);
                            }
                        }
                    }
                }
            }
            for (var key in data) {
                if (data[key] == null || data[key] == '' || data[key] == undefined) continue;
                if (key == "msg") layer.msg(data.msg);
                if (key == "context" || key == "total_speed" || key == "share_total") $('#' + key).html(data[key]);
                if (key == "share_text" || key == "share_total") localStorage.setItem("shengzaozao_com_" + key, data[key]);
            }
        },
        error: function() {}
    });
}
function changeShareText() {
    var icode = localStorage['icode'];
    var promotecode = localStorage['promotecode'];
    $.ajax({
        async: true,
        type: 'post',
        data: '',
        contentType: 'application/json; charset=utf-8',
        url: localStorage['miaoassistantapiurl'] + '/api/promote/sharetext/?' + 'icode=' + icode + "&promotecode=" + promotecode + '&speedcode=' + speed_code,
        dataType: 'json',
        success: function(data) {
            if (data["share_text"] != null && data["share_text"] != '' && data["share_text"] != undefined) localStorage.setItem("shengzaozao_com_share_text", data["share_text"]);
        }
    });
}
function paySpeedCode(speed_code) {
    var icode = localStorage['icode'];
    var promotecode = localStorage['promotecode'];
    var load = layer.load(1, {
        shade: [0.5, '#CCC']
    });
    $.ajax({
        async: true,
        type: 'post',
        data: '',
        contentType: 'application/json; charset=utf-8',
        url: localStorage['miaoassistantapiurl'] + '/api/promote/payascode/?' + 'icode=' + icode + "&promotecode=" + promotecode + '&speedcode=' + speed_code,
        dataType: 'json',
        success: function(data) {
            if (data["status"] == 'ok') {
                if (data["speed_time"] != null && data["speed_time"] != '' && data["speed_time"] != undefined) {
                    localStorage.setItem("shengzaozao_com_miao_speed_time", data["speed_time"]);
                    getUserShare();
                }
            }
            if (data["msg"] != null && data["msg"] != '' && data["msg"] != undefined) layer.msg(data.msg);
            layer.close(load);
        },
        error: function() {
            layer.close(load);
        }
    });
}
function changeUserID(newicode, newpromotecode) {
    var icode = localStorage['icode'];
    var promotecode = localStorage['promotecode'];
    var load = layer.load(1, {
        shade: [0.5, '#CCC']
    });
    $.ajax({
        async: true,
        type: 'post',
        data: '',
        contentType: 'application/json; charset=utf-8',
        url: localStorage['miaoassistantapiurl'] + '/api/promote/codechange/?' + 'icode=' + icode + "&promotecode=" + promotecode + '&newicode=' + newicode + '&newpromotecode=' + newpromotecode,
        dataType: 'json',
        success: function(data) {
            if (data["status"] == 'ok') {
                if (data["code"] != null && data["code"] != '' && data["code"] != undefined) {
                    $('#icode').html("ID:" + data.code);
                    localStorage['icode'] = data.code;
                    localStorage['promotecode'] = data.promotecode;
                    getUserShare();
                }
            }
            if (data["msg"] != null && data["msg"] != '' && data["msg"] != undefined) layer.msg(data.msg);
            layer.close(load);
        },
        error: function() {
            layer.close(load);
        }
    });
}
function save_localStorage() {
    localStorage.setItem("shengzaozao_com_miao_setsound", getCheckBox($('#shengzaozao_com_miao_setsound')));
    localStorage.setItem("shengzaozao_com_miao_setshowmsg", getCheckBox($('#shengzaozao_com_miao_setshowmsg')));
    localStorage.setItem("shengzaozao_com_miao_pageforpay", 'Y');
    localStorage["icode"] ? localStorage.setItem("shengzaozao_com_miao_autoforbuy", getCheckBox($('#shengzaozao_com_miao_autoforbuy'))) : '';
    localStorage.setItem("shengzaozao_com_miao_autoforpay", getCheckBox($('#shengzaozao_com_miao_autoforpay')));
    localStorage.setItem("pay_password", $('#pay_password').val());
}
function Get_UrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function Switch_RoutePage() {
    if (Get_UrlParam('style') == 'small') {
        $(".header").css('display', 'none');
        $(".footer").css('display', 'none');
        $(".divBody").css('margin', '0px');
        $("#divMain").css('margin-top', '0px');
        $("#baseSet").css('display', 'none');
        $("#moreSet").css('display', 'none');
        $("#changeicode").css('display', 'none');
        $("#backhome").css('display', 'block');
    }
}
function Init_options() {
    localStorage.setItem("shengzaozao_com_miao_delayforbuy", "600");
    localStorage.setItem("shengzaozao_com_miao_openanswer", "60");
    localStorage.setItem("shengzaozao_com_miao_kill", "1000");
    localStorage.setItem("shengzaozao_com_miao_reloadoffrequency", "5");
    localStorage.setItem("shengzaozao_com_miao_autoforbuy", "N");
    localStorage.setItem("shengzaozao_com_miao_reloadfortime", "N");
    localStorage.setItem("shengzaozao_com_miao_setsound", "Y");
    localStorage.setItem("shengzaozao_com_miao_setshowmsg", "Y");
    localStorage.setItem("shengzaozao_com_miao_reloadforbuy", "N");
    localStorage.setItem("shengzaozao_com_miao_pageforbuy", "Y");
    localStorage.setItem("shengzaozao_com_miao_pageforpay", "Y");
    localStorage.setItem("shengzaozao_com_miao_svncserver", "0");
    localStorage.setItem("shengzaozao_com_miao_operatioforadvance", "500");
    localStorage.setItem("shengzaozao_com_miao_reloadforclick", "5");
    localStorage.setItem("shengzaozao_com_miao_autoforpay", "N");
    localStorage.setItem("mobileOrderBuyLinkFlag", "Y");
    localStorage.setItem("pay_password", "");
    sessionStorage.setItem('MiaoAssistantFlag', 'Y');
}
function get_options() {
    setCheckBox($('#shengzaozao_com_miao_autoforbuy'), localStorage["shengzaozao_com_miao_autoforbuy"] || 'N');
    setCheckBox($('#shengzaozao_com_miao_setsound'), localStorage["shengzaozao_com_miao_setsound"] || 'Y');
    setCheckBox($('#shengzaozao_com_miao_setshowmsg'), localStorage["shengzaozao_com_miao_setshowmsg"] || 'Y');
    setCheckBox($('#shengzaozao_com_miao_pageforpay'), localStorage["shengzaozao_com_miao_pageforpay"] || 'Y');
    $('#shengzaozao_com_miao_svncserver').val(localStorage["shengzaozao_com_miao_svncserver"] || '0');
    $('#shengzaozao_com_miao_operatioforadvance').val(localStorage["shengzaozao_com_miao_operatioforadvance"] || '500');
    setCheckBox($('#shengzaozao_com_miao_autoforpay'), localStorage["shengzaozao_com_miao_autoforpay"] || 'N');
    $('#pay_password').val(localStorage["pay_password"] || '');
    $('#timeGap').html(localStorage["timeGap"]);
    $('#timeDate').html(localStorage["timeDate"]);
    if (localStorage["icode"] == undefined || localStorage["icode"] == '') {
        getUsericode();
        localStorage["shengzaozao_com_share_total"] = 0;
        localStorage["shengzaozao_com_miao_speed_value"] = 0;
    } else {
        $('#icode').html("ID:" + (localStorage["icode"] || '申请失败[早早商城可免费兑换ICODE-点击指南进入]'));
        getUserShare();
    }
    $('#share_total').html(localStorage["shengzaozao_com_share_total"] || '0');
    $('#shengzaozao_com_miao_speed_value').html(localStorage["shengzaozao_com_miao_speed_value"] || '0');
    SwitcheryInit();
    Switch_RoutePage();
}
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
            callback && callback(gagTime, networkTime, serverTime);
        }
    }
    startDate = new Date();
    xhr.send();
}
$(function() {
    $('#default').click(function() {
        layer.open({
            title: '恢复默认',
            content: '确定要恢复默认状态？',
            skin: 'layui-layer-dialog',
            zIndex: 999999991,
            success: function() {},
            btn: ['确定', '取消'],
            yes: function(index, layero) {
                Init_options();
                get_options();
                layer.msg('恢复成功');
            },
            btn2: function(index, layero) {}
        });
    });
    var MiaoAssistantServerTimeUrl = 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp';
    $('#getQuestionImg').click(function() {
        layer.confirm('目前存储的问题图片如下:<br/>' + localStorage["question_img"] + '<br/>确定要清空值？', {
            btn: ['确认清空', '取消']
        },
        function() {
            localStorage.setItem("question_img", "");
            layer.msg('成功清空');
        });
    });
    $('#syncTime').click(function() {
        layer.open({
            title: false,
            closeBtn: false,
            content: '进行时间同步可能需要2分钟，如果长时间未响应请按F5刷新页面',
            skin: 'layui-layer-dialog',
            zIndex: 999999991,
            success: function() {},
            btn: ['立即同步', '取消'],
            yes: function(index, layero) {
                layer.close(index);
                var load = layer.load(1, {
                    shade: [0.5, '#CCC']
                });
                var timeInterval = setInterval(function() {
                    getGapTime(MiaoAssistantServerTimeUrl,
                    function(timeGap, networkTime, serverTime) {
                        if (!isNaN(timeGap) && networkTime <= 40) {
                            localStorage['timeGap'] = timeGap;
                            localStorage['timeDate'] = timetrans(serverTime);
                            clearInterval(timeInterval);
                            layer.close(load);
                            $('#timeGap').html(localStorage["timeGap"]);
                            $('#timeDate').html(localStorage["timeDate"]);
                            layer.msg('同步成功');
                        }
                    })
                },
                1000);
            },
            btn2: function(index, layero) {
                layer.close(index);
            }
        });
    });
    $("#sound_play").mouseover(function() {
        var bellURL = chrome.extension.getURL("template/success.mp3");
        var audio = new Audio(bellURL);
        audio.loop = false;
        audio.play();
    });
    $("#sound_play_start").mouseover(function() {
        var bellURL = chrome.extension.getURL("template/start.mp3");
        var audio = new Audio(bellURL);
        audio.loop = false;
        audio.play();
    });
    $("#msg_show").click(function() {
        Notification.requestPermission();
        var imgPath = './template/icon/icon96.png';
        var notiBody = "已经购买成功,请登进行付款！";
        var notification = new Notification('早早省秒杀神器通知', {
            icon: imgPath,
            body: notiBody
        });
    });
    $('#pay_password').blur(function() {
        save_options();
    });
    $('#speed_code').click(function() {
        layer.open({
            type: 1,
            area: ['350px', '210px'],
            shadeClose: true,
            closeBtn: 0,
            shade: 0.6,
            shift: 0,
            btn: ['确认加速', '取消'],
            content: '<div style="padding: 20px 20px 10px 20px; line-height: 22px;  overflow:auto; ">' + '速度码进行加速' + '<p style="margin-top:10px;*++">' + '<input type="text" name="speedcode" id="input_speedcode" placeholder="请输入速度码"  class="layui-input" maxlength="19" style=";width:100%;height:35px;text-align:center;margin-top:10px; ">' + '</p>' + '<p style="font-size:12px;"><a href="https://www.zaozaosheng.com/miaohelp" target="_blank">如何获得速度码？</a></p>' + '</div>',
            success: function() {},
            yes: function(index, layero) {
                if ($("#input_speedcode").val().length > 18) {
                    paySpeedCode($("#input_speedcode").val());
                } else {
                    layer.msg('无效的速度码');
                }
                layer.close(index);
            },
            btn2: function(index, layero) {}
        });
    });
    $('#changeicode').click(function() {
        var icode = localStorage['icode'] || '';
        var promotecode = localStorage['promotecode'] || '';
        layer.open({
            type: 1,
            area: [['390px', '320px']],
            shadeClose: true,
            closeBtn: 0,
            shade: 0.6,
            shift: 0,
            btn: ['修改', '取消'],
            content: '<div style="padding: 20px 20px 10px 20px; line-height: 22px;  overflow:auto; ">' + '更改身份（ICODE）' + '<p style="margin-top:10px;*++">' + '<input type="text" name="icode" id="input_icode" placeholder="请输入ICODE" value="' + icode + '" class="layui-input" maxlength="5"style=";width:100%;height:35px;text-align:center; ">' + '<input type="text" name="promotecode" id="input_promotecode" placeholder="请输入识别码"  value="' + promotecode + '" class="layui-input" maxlength="32" style=";width:100%;height:35px;text-align:center;margin-top:10px; ">' + '</p>' + '<p style="font-size:12px;">1、ICODE一旦弃用后，2月后自动注销<br/>2、正在使用的ICODE，没有时间期限<br/>3、请勿泄露自己的ICODE，多人使用相同ICODE将停止云加速24小时</p>' + '</div>',
            success: function() {},
            yes: function(index, layero) {
                if ($("#input_icode").val() == "" || $("#input_promotecode").val() == "") {
                    layer.msg('填写错误');
                }
                if ($("#input_icode").val().indexOf(" ") != -1 || $("#input_promotecode").val().indexOf(" ") != -1) {
                    layer.msg('填写内容存在空格，可能您的ICODE或识别码不正确');
                    return;
                }
                if ($("#input_icode").val() == icode && $("#input_promotecode").val() == promotecode) {
                    layer.msg('修改成功');
                } else if ($("#input_icode").val() != '' && $("#input_promotecode").val() != '') {
                    changeUserID($("#input_icode").val(), $("#input_promotecode").val());
                }
                layer.close(index);
            },
            btn2: function(index, layero) {}
        });
    });
    $('#share_description').click(function() {
        layer.msg("云加速适用于网速小于200M的用户进行提速<hr/><div style='text-align:left;'>1、开启后，解决因网速过慢问题导致的问题<br/>2、开启后，将远端预加载当前秒杀商品完成加速 <br/>3、开启后，秒杀验证部分将远程预加载，优化秒单速度和精度来提高秒杀成功率。<br/>4、云加速，需要上传当前正在秒杀的商品数据到服务器，进行分析和提速。</div> ", {
            time: 10000
        },
        function() {
            $('#share_copy').css('animation', 'zoomAll 2s ');
        });
    });
    $('#share_copy').click(function() {
        var promoteqr_url = localStorage['miaoassistantapiurl'] + "/api/promote/promoteqr?icode=" + localStorage['icode'] + "&promotecode=" + localStorage['promotecode'];
        var context = localStorage['shengzaozao_com_share_text'];
        layer.open({
            type: 1,
            area: ['550px', '230px'],
            shadeClose: true,
            closeBtn: 0,
            shade: 0.6,
            shift: 0,
            content: '<div style="padding: 20px 20px 10px 20px; line-height: 22px; background-color: #393D49; color: #fff;  overflow:auto;  height:100%;">' + ' &nbsp;&nbsp;&nbsp;分享给朋友，免费获秒杀云加速（好友点击即可）' + '  <div style="overflow:auto;">' + '  <div style="float:left;width: 360px;margin-top:10px;margin-bottom:10px;margin-left: 10px;">' + '  <textarea id="copy-num" style="font-size:14px; background-color:#5c6273;padding:12px 0px 12px 20px;border-radius:5px;height:125px;width:100%;border:none;resize:none;outline:none;">' + context + '   </textarea> </div>' + '  <div style="margin-top: 14px;float:right;width: 120px;text-align:center;line-height:40px;">' + '   <img width="95" height="95"  src="' + promoteqr_url + '" style="background-image:url(\'./template/image/loading_line.svg\');"/>   ' + '   <p style="font-size:12px;"><span style="color:#2f97ff;">微信/手机</span> 扫码分享</p>' + '  </div>' + ' </div>' + '</div>',
            success: function() {
                var e = document.getElementById("copy-num");
                e.select();
                document.execCommand("Copy");
                e.blur();
                layer.msg("复制成功");
                changeShareText();
            }
        });
    });
    if (!localStorage["shengzaozao_com_miao_agreement_state"] || localStorage["shengzaozao_com_miao_agreement_state"] == 'N') {
        layer.open({
            type: 1,
            area: ['600px', '380px'],
            title: false,
            closeBtn: false,
            shade: 0.8,
            resize: false,
            moveType: 1,
            shift: 0,
            skin: 'layui-layer-rim',
            closeBtn: 0,
            content: '<div style="padding: 35px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">' + '<br/><b>用户须知</b><br/>' + '<br/>您必须同意以下所有条款才能使用早早省秒杀神器以及享受更新服务，如果您不同意以下任一条款,请不要使用本软件或其任何更新<br/>' + '<br/><b>使用条款</b>' + '<br/>1、软件用于模拟手动操作，仅用于技术交流和使用。' + '<br/>2、软件承诺不含有窃取密码等隐藏功能，用户因密码失窃导致的损失需自己承担。' + '<br/>3、不得修改、翻译或改编本软件,或基于本软件创作衍生作品。' + '<input type="text" name="input_agreement" id="input_agreement" placeholder="阅读验证：请输入此处[早早省秒杀神器]后，点击同意"   style=";width:100%;height:35px;text-align:center;margin-top:4px; color:#000;">' + '</div>',
            btn: ['同意', '取消'],
            success: function() {
                $("#input_agreement").focus();
            },
            yes: function(index, layero) {
                if ($("#input_agreement").val() == ("")) {
                    localStorage["shengzaozao_com_miao_agreement_state"] = "Y";
                    layer.msg("Le's Go 尽情的秒杀！释放天性！");
                    Init_options();
                    get_options();
                    getGapTime(MiaoAssistantServerTimeUrl,
                    function(timeGap, networkTime, serverTime) {
                        if (!isNaN(timeGap) && networkTime <= 40) {
                            localStorage['timeGap'] = timeGap;
                            localStorage['timeDate'] = timetrans(serverTime);
                            $('#timeGap').html(localStorage["timeGap"]);
                            $('#timeDate').html(localStorage["timeDate"]);
                        }
                    });
                    layer.close(index);
                } else {
                    layer.msg('阅读验证错误，请重新输入');
                    $("#input_agreement").focus();
                }
            },
            btn2: function(index, layero) {
                $('#setting').html('警告：您先需要同意软件使用协议，才可使用开始<br/>如果想启用功能，请刷新该界面，然后同意软件协议即可。');
                $('#miaoSetting').remove();
                $('#settingBtn').remove();
                window.close();
            }
        });
    } else {
        get_options();
    }
});
function timetrans(date) {
    var date = new Date(date);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}
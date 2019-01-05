function buyPageBookTime(sour, options, yesCallback) {
    layer.open({
        type: 1,
        area: ['380px', '380px'],
        title: '<B>秒杀设置 - 早早省（<a href="https://www.zaozaosheng.com/" target="_blank">其它商品</a>）</B>',
        shade: 0.25,
        moveType: 1,
        shift: 0,
        skin: '',
        zIndex: 999999901,
        content: '<div style="padding:20px;font-size:12px;">' + ' <form class="boostrapTable form-horizontal" style="margin-top:20px;margin-right:20px" role="form">' + ' <div class="form-group">' + ' <label for="zzs_alarmbuy" class="col-sm-3 control-label">秒杀时间</label>' + ' <div class="col-sm-9">' + '   <div class="input-group">' + '   <input type="text" class="form-control" id="zzs_alarmbuy" placeholder="秒杀时间">' + '  <span class="input-group-btn">' + '  <button class="btn btn-default" type="button" id="open"><span class="glyphicon glyphicon-calendar"></span></button>' + '  </span>' + '  </div>' + '  <span class="help-block" id="miao-help">' + '    <b>当前时间: </b><span id="sysDT"></span>' + '    <span style="display:none;"><br/><label for="orderBuyFlag">预约时间为实际下单时间：</label><input type="checkbox" id="orderBuyFlag"></span>' + '    <span id="payBuyFlag-key" style="display:none;"><br/><label for="payBuyFlag">预约时间为实际付款时间：</label><input type="checkbox" id="payBuyFlag"></span>' + '  </span>' + ' </div>' + ' </div>' + ' <div class="form-group">' + ' <label for="buyProp" class="col-sm-3 control-label">购买数量</label>' + ' <div class="col-sm-9">' + '   <input type="text" class="form-control" id="buyProp" placeholder="1">' + '   <span class="help-block"><br/><b>使用须知</b><br/>1、开始前请选择要购买的款式、颜色。<p>2、如商品只允许购买1件，请勿多写数量。</p></span>' + ' </div>' + ' </div>' + ' </form>' + '</div>',
        btn: ['<span style="font-weight:600;">立即开始</span>', '取消'],
        success: function(layero, index) {
            $(layero).css('z-index', '999999990');
            if (sour == 'taobaoBuyPage') $('#detail').css('z-index', '9999999');
            $('.layui-layer-btn').css('font-size', '17px');
            $('#zzs_alarmbuy').val(getServerDateFormat2());
            $('#payBuyFlag').prop("checked", false);
            if (options.shengzaozao_com_miao_reloadforbuy == 'Y') {
                $('#refBfBuy').prop("checked", true);
            } else {
                $('#refBfBuy').prop("checked", false);
            }
            if (options.shengzaozao_com_miao_autoforpay != 'Y' || !options.pay_password || sour == 'juPage' || options.payBuyRight == 'N') {
                $('#payBuyFlag').attr("disabled", true);
            }
            if (options.shengzaozao_com_miao_pageforbuy != 'Y' || sour != 'tmallBuyPage' || options.orderBuyRight == 'N') {
                $('#orderBuyFlag').attr("disabled", true);
            } else {
                $('#orderBuyFlag').prop("checked", true);
            }
            if (sour == 'cartPage') {
                $('#buyProp').attr("disabled", true);
            }
            $("#zzs_alarmbuy").focus();
            $('#zzs_alarmbuy').datetimepicker({
                lang: "zh",
                timepicker: true,
                format: "Y-m-d H:i:s",
                step: 10,
                showOnClick: false,
                onSelectTime: function() {
                    var selectDT = $('#zzs_alarmbuy').val();
                    var newDt = '';
                    var dtArray = selectDT.split(':');
                    for (var idx in dtArray) {
                        if (idx <= 1) newDt += dtArray[idx] + ':';
                    }
                    $('#zzs_alarmbuy').val(newDt + '00');
                }
            });
            $('#open').click(function() {
                $('#zzs_alarmbuy').datetimepicker('show');
            });
            $('#open,#zzs_alarmbuy,#buyProp').keydown(function(event) {
                if (event.keyCode == 13 || event.which == 13) {
                    document.getElementsByClassName('layui-layer-btn0')[0].click();
                    return false;
                }
            });
            showSysDT($('#sysDT')[0]);
            if (sour == 'juPage' && $('button.J_JuSMSRemind')[0] && $('div.J_juItemTimer').find('p')[0]) {
                var monthDay = ($('div.J_juItemTimer').find('p').html()).split('日')[0];
                var hourTime = ($('div.J_juItemTimer').find('p').html()).split('日')[1];
                hourTime = hourTime.replace('开抢', '').trim();
                $('#zzs_alarmbuy').val(new Date().Format('yyyy') + '-' + monthDay.replace('月', '-').replace('日', '') + ' ' + hourTime + ':00');
            }
        },
        yes: function(index, layero) {
            var buyProp, zzs_alarmbuy;
            buyProp = $('#buyProp').val();
            zzs_alarmbuy = $('#zzs_alarmbuy').val();
            if (!zzs_alarmbuy || isNaN(new Date(zzs_alarmbuy).getTime())) {
                alert('请输入正确的日期！注意格式是：yyyy-MM-dd hh:mm:ss');
                return false;
            }
            if ($('#orderBuyFlag').prop("checked") && $('#payBuyFlag').prop("checked")) {
                alert('卡时下单和卡时付款不可以同时选中！系统处理会有冲突！');
                return false;
            }
            sessionStorage.setItem('buyProp', buyProp);
            if (sour == 'taobaoBuyPage') {
                $('#detail').css('z-index', '99999999');
            }
            if ($('#payBuyFlag').prop("checked")) {
                sessionStorage.setItem('payBuyFlag', 'Y');
            } else {
                sessionStorage.setItem('payBuyFlag', 'N');
            }
            if ($('#orderBuyFlag').prop("checked")) {
                sessionStorage.setItem('orderBuyFlag', 'Y');
            } else {
                sessionStorage.setItem('orderBuyFlag', 'N');
            }
            if ($('#refBfBuy').prop("checked")) {
                sessionStorage.setItem('refBfBuy', 'Y');
            } else {
                sessionStorage.setItem('refBfBuy', 'N');
            }
            clearSysDT();
            yesCallback && yesCallback(buyProp, zzs_alarmbuy);
            sour == 'cartPage' && cartPageSelectAll(options.host, 10);
            options.host == 'h5.m.taobao.com' && $('div.recommend-list-wrapper').remove();
            layer.close(index);
        },
        btn2: function(index, layero) {
            clearSysDT();
            if (sour == 'taobaoBuyPage') $('#detail').css('z-index', '99999999');
        }
    });
}
function miaoPageBookTime(sour, options, yesCallback) {
    var defTimes = 0;
    var DefTimeTask = setInterval(function() {
        if ($('#J_SecKill').html()) {
            clearInterval(DefTimeTask);
            if (($('.no-stock').html()) && ($('.no-stock').html()).indexOf('秒杀已结束') != -1) {
                showMsg('淘宝：秒杀已经结束！<br/> 请去早早省 - 多囤多省，查看其它商品。');
                return false;
            }
            if (($('.sec-killp-note p').html()) && ($('.sec-killp-note p').html()).indexOf('此宝贝仅限通过') != -1) {
                showMsg('注意：该宝贝仅限在手机端秒杀！<br/>感谢您使用早早省秒杀神器！');
                return false;
            }
            if (!$('.need-login')[0]) {
                layer.open({
                    type: 1,
                    area: ['400px', '360px'],
                    title: '<B>秒杀设置 - 早早省（<a href="https://www.zaozaosheng.com/" target="_blank">其它商品</a>）</B>',
                    shade: 0.25,
                    moveType: 1,
                    shift: 0,
                    skin: '',
                    zIndex: 999999991,
                    content: '<div style="padding:20px;font-size:12px;">' + ' <form class="boostrapTable form-horizontal" style="margin-top:20px;margin-right:20px" role="form">' + ' <div class="form-group">' + ' <label for="zzs_alarmbuy" class="col-sm-3 control-label">秒杀时间</label>' + ' <div class="col-sm-9">' + '   <div class="input-group">' + '   <input type="text" class="form-control" id="zzs_alarmbuy" placeholder="秒杀时间"/>' + '  <span class="input-group-btn">' + '  <button class="btn btn-default" type="button" id="open"><span class="glyphicon glyphicon-calendar"></span></button>' + '  </span>' + '  </div>' + '  <span class="help-block">' + '    <b>当前时间: </b><span id="sysDT"></span>' + '    <div ><label for="alert_flag">秒杀前自动通知：</label><input type="checkbox" id="alert_flag" ></div>' + '    <div style="display:none;"><label for="miao_order_flag" >秒杀后自动提交：</label><input type="checkbox" id="miao_order_flag"></div>' + '   <span class="help-block"><br/><b>使用须知</b><br/>1、开始前请选择要购买的款式、颜色。<p>2、如商品只允许购买1件，请勿多写数量。</p></span>' + '  </span>' + ' </div>' + ' </div>' + ' </form>' + '</div>',
                    btn: ['<span style="font-weight:600;">立即开始</span>', '取消'],
                    success: function(layero, index) {
                        $(layero).css('z-index', '999999999');
                        $('#alert_flag').prop("checked", false);
                        $('#miao_order_flag').prop("checked", true);
                        $('.layui-layer-btn').css('font-size', '17px');
                        if ($('#J_SecKill .date').html()) {
                            $('#zzs_alarmbuy').val($('#J_SecKill .date').html().replace('年', '-').replace('月', '-').replace('日', '') + ' ' + $('#J_SecKill .time').html());
                        } else if ($('.nyr-time').html()) {
                            $('#zzs_alarmbuy').val($.trim($('.nyr-time').html()).replace('年', '-').replace('月', '-').replace('日', '') + ' ' + $.trim($('.fmks-time').html()).replace('开售', ''));
                        } else {
                            $('#zzs_alarmbuy').val(getServerDateFormat2());
                        }
                        $("#zzs_alarmbuy").focus();
                        $('#zzs_alarmbuy').datetimepicker({
                            lang: "zh",
                            timepicker: true,
                            format: "Y-m-d H:i:s",
                            step: 10,
                            showOnClick: false,
                            onSelectTime: function() {
                                var selectDT = $('#zzs_alarmbuy').val();
                                var newDt = '';
                                var dtArray = selectDT.split(':');
                                for (var idx in dtArray) {
                                    if (idx <= 1) newDt += dtArray[idx] + ':';
                                }
                                $('#zzs_alarmbuy').val(newDt + '00');
                            }
                        });
                        $('#open').click(function() {
                            $('#zzs_alarmbuy').datetimepicker('show');
                        });
                        $('#open,#zzs_alarmbuy').keydown(function(event) {
                            if (event.keyCode == 13 || event.which == 13) {
                                document.getElementsByClassName('layui-layer-btn0')[0].click();
                                return false;
                            }
                        });
                        showSysDT($('#sysDT')[0]);
                    },
                    yes: function(index, layero) {
                        var zzs_alarmbuy = $('#zzs_alarmbuy').val();
                        if (isNaN(new Date(zzs_alarmbuy).getTime())) {
                            showMsg('请输入正确的日期！注意格式是：yyyy-MM-dd hh:mm:ss');
                            return false;
                        }
                        if ($('#alert_flag').prop("checked")) {
                            sessionStorage.setItem('miaoAlert', 'Y');
                        } else {
                            sessionStorage.setItem('miaoAlert', 'N');
                        }
                        if ($('#miao_order_flag').prop("checked")) {
                            sessionStorage.setItem('miaoOrderFlag', 'Y');
                        } else {
                            sessionStorage.setItem('miaoOrderFlag', 'N');
                        }
                        clearSysDT();
                        yesCallback && yesCallback(zzs_alarmbuy);
                        layer.close(index);
                    },
                    btn2: function(index, layero) {
                        clearSysDT();
                    }
                });
            } else {
                showMsg('还未登陆，请先登陆后继续操作');
                var notiBody = "还未登陆\n感谢您使用早早省秒杀神器。";
                var notification = new Notification('早早省秒杀神器通知', {
                    body: notiBody
                });
                return false;
            }
        } else {
            defTimes++;
            if (defTimes > 300) {
                clearInterval(DefTimeTask);
                showMsg('初始化秒杀界面失败！尝试次数超过300次！');
            }
        }
    },
    10);
}
function loginPageRef() {
    var zzs_monitor_timeout = parseInt(5 + randomNumber(1, 5)),
    taskId;
    var timeID = setTimeout(function() {
        location.reload();
    },
    zzs_monitor_timeout * 60 * 1000);
    layer.open({
        content: '<b>Tips:为防止淘宝在自动购买的时候需要重新登录帐号<br/>插件会在 (<span id="zzs_monitor_timeout">' + zzs_monitor_timeout + '</span>) 分钟之后自动刷新网页！</b>' + '<br/>如果不需要自动刷新，请点确定按钮或者直接关闭网页即可。',
        skin: 'layui-layer-dialog',
        area: ['420px', '240px'],
        zIndex: 999999991,
        icon: 6,
        success: function() {
            taskId = setInterval(function() {
                var leftMins = parseInt($('#zzs_monitor_timeout').html());
                $('#zzs_monitor_timeout').html(leftMins - 1);
                if ((leftMins - 1) < 0) {
                    clearInterval(taskId);
                }
            },
            60 * 1000);
        },
        btn: ['取消自动刷新定时器'],
        yes: function(index, layero) {
            clearTimeout(timeID);
            taskId && clearInterval(taskId);
            sessionStorage['loginPageRef'] = 'N';
            showMsg('已停止刷新！');
        }
    });
}
function buyPageShowRemain(sour, buyProp, timeOut, zzs_alarmbuy, options) {
    var buyPropDesc, nextSecGap, taskId = undefined;
    buyPropDesc = buyProp || '1';
    nextSecGap = timeOut % 1000;
    layer.open({
        type: 1,
        area: ['540px', '240px'],
        title: '<a style="width:19px; height:19px;" id="logoTitle"> </a><span style="color:#FCFCFC;">正在执行秒杀 - <a href="https://www.zaozaosheng.com/" target="_blank"  style="color:#FCFCFC;">早早省 - 多囤多省</a></span>',
        shade: 0.25,
        moveType: 1,
        shift: 2,
        skin: 'layui-layerSkinBlack',
        offset: 'rb',
        zIndex: 999999991,
        closeBtn: 1,
        content: '<div style="padding: 10px 0 10px 20px; margin-Bottom:10px; font-size:12px;background-color:#4c4c4c; ">' + '<div id="zzs_ui_miaotime" style="color:#FFFFFF; height:40px; line-height:40px; font-size:26px">' + '  剩余时间：' + ' <span id="times_day"></span>' + ' <span id="times_hour"></span>' + ' <span id="times_minute"></span>' + ' <span id="times_second"></span>' + '</div>' + '</div>' + '<div style="padding: 0px 0 0 20px; font-size:12px; color:#FAFAFA; ">' + '<p style="font-size:12px; ">购买数量：' + buyPropDesc + '&nbsp;&nbsp;时间：' + zzs_alarmbuy + '&nbsp;&nbsp;<span id="setByTime"></span> </p>' + '<span class="help-block"  style="padding-top:8px;">' + '<b>使用须知</b>' + '<br />1、请检查是否处于登录状态，如能正常进入，<a href="https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm" target="_blank">已购买到的宝贝</a> 则表示正常。 ' + '<br />2、系统全自动下单，目前您无法点击页面，取消秒杀，请按下F5键进行刷新。' + '</span>' + '</div>',
        success: function(layero, index) {
            $(layero).css('z-index', '999999999');
            $('.layui-layer-ico').css('background', 'url("' + chrome.extension.getURL("template/layer/skin/default/icon.png") + '") no-repeat');
            $('.layui-layer-ico').css('background-position', '0 -40px');
            if (sour == 'taobaoBuyPage') $('#detail').css('z-index', '999999');
            var time_distance = timeOut;
            refTime(time_distance);
            setTimeout(function() {
                time_distance = time_distance - (1000 + nextSecGap);
                var taskId = setInterval(function() {
                    refTime(time_distance);
                    time_distance = time_distance - 1000;
                    if (time_distance < 0) {
                        clearInterval(taskId);
                    }
                },
                1000);
            },
            nextSecGap);
            if (sour == 'taobaoBuyPage') $('#detail').css('z-index', '99999999');
            setTimeout(function() {
                layer.close(index);
            },
            timeOut);
            if (sessionStorage.getItem('orderBuyFlag') == 'Y' && sour != 'cartPage') {
                var mBuylink = getTmailOrderBuylink(options.mobileOrderBuyLinkFlag == 'Y' ? 'mobile': 'computer', window.location.href, buyProp);
                mBuylink += '&testFlag=Y&MiaoAssistantFlag=Y&timeGap=' + options.timeGap;
                $('#setByTime').html('  <a id="testBuyLink" target="_blank" href="#" style="color:#FFF;">预览下单界面</a>');
                $('#testBuyLink').click(function(e) {
                    mBuylink += '&serverTime=' + getServerTime();
                    $(e.target).attr('href', mBuylink);
                });
            } else if (sessionStorage.getItem('payBuyFlag') == 'Y') {}
            postMiaoPage(options, zzs_alarmbuy);
        },
        cancel: function(index) {
            if (sour == 'taobaoBuyPage') $('#detail').css('z-index', '99999999');
            layer.close(index);
            cleanTabStorage();
            location.reload();
        }
    });
}
function tmallBuyPageToCart() {
    console.log('tmallBuyPageToCart!');
    layer.open({
        content: '请进入购物车进行结算',
        skin: '',
        area: ['350px', '200px'],
        zIndex: 999999991,
        shadeClose: false,
        shade: 0.7,
        icon: 6,
        success: function(layero, index) {
            $(layero).css({
                'background-color': 'rgba(162, 139, 111, 0.94)',
                'color': '#fff'
            });
            $(layero).find('div.layui-layer-content').css('padding', '20px');
            $('.layui-layer-close').css('background', 'url("' + chrome.extension.getURL("include/layer/skin/default/icon.png") + '") no-repeat');
            $('.layui-layer-close').css('background-position', '0 -40px');
        },
        btn: ['购物车结算', '关闭'],
        yes: function(index, layero) {
            window.location.href = 'https://h5.m.taobao.com/mlapp/cart.html';
        },
        btn2: function(index, layero) {
            open(location, '_self').close();
        }
    });
}
function payPageShowRemain(timeOut) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        shadeClose: false,
        skin: '',
        zIndex: 999999991,
        shift: 1,
        content: '<b>请等待' + timeOut / 1000 + ' 秒，系统正在付款。</b>' + '<br/>提示：如需取消系统自动付款，请按F5刷新',
        success: function(layero, index) {
            $(layero).css({
                'background-color': '#81BA25',
                'color': '#fff'
            });
            $(layero).find('div.layui-layer-content').css('padding', '30px');
        }
    });
}
function orderPageShowRemain(timeOut) {
    layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        shadeClose: false,
        skin: '',
        zIndex: 999999991,
        shift: 1,
        content: '<b>请等待' + timeOut / 1000 + ' 秒，正在付款。</b>',
        success: function(layero, index) {
            $(layero).css({
                'background-color': '#81BA25',
                'color': '#fff'
            });
            $(layero).find('div.layui-layer-content').css('padding', '30px');
        }
    });
}
function buyPageShowLoading(timeOut) {
    var second = Math.round(parseFloat(timeOut / 1000) * 100) / 100,
    taskId2;
    layer.open({
        type: 1,
        title: '正在处理',
        closeBtn: 1,
        shadeClose: false,
        skin: 'layui-layer-rim',
        zIndex: 999999991,
        shift: 1,
        content: '<b>请耐心等候 <span id="timeoutSecond">' + second + '</span> 秒</b>',
        success: function(layero, index) {
            $(layero).css({
                'background-color': '#81BA25',
                'color': '#fff'
            });
            $(layero).find('div.layui-layer-content').css('padding', '30px');
            $('.layui-layer-ico').css('background', 'url("' + chrome.extension.getURL("include/layer/skin/default/icon.png") + '") no-repeat');
            $('.layui-layer-ico').css('background-position', '0 -40px');
            taskId2 = setInterval(function() {
                var left = parseInt($('#timeoutSecond').html());
                $('#timeoutSecond').html(left - 1);
                if ((left - 1) < 0) {
                    clearInterval(taskId2);
                    layer.close(index);
                }
            },
            1000);
        },
        cancel: function(index) {
            cleanTabStorage();
            taskId2 && clearInterval(taskId2);
            layer.close(index);
        }
    });
}
function orderPageShowTest(testStartServerTime, getBtnServerTime, params) {
    layer.open({
        type: 1,
        title: '下单页面时间测试',
        closeBtn: 1,
        shadeClose: false,
        skin: 'layui-layer-rim',
        zIndex: 999999991,
        shift: 1,
        content: '<b>下单页面的测试加载时间如下：</b>' + '<br/>从提交请求到加载Dom耗时(毫秒)：' + ((testStartServerTime - parseInt(params.serverTime))) + '<br/>浏览器渲染Js代码耗时(毫秒)：' + (getBtnServerTime - testStartServerTime) + '<br/>您可以根据测试的结果配置下单提前期！',
        success: function(layero, index) {
            $(layero).css({
                'background-color': 'rgba(144, 132, 100, 0.66)',
                'color': '#fff'
            });
            $(layero).find('div.layui-layer-content').css('padding', '20px');
            $('.layui-layer-ico').css('background', 'url("' + chrome.extension.getURL("include/layer/skin/default/icon.png") + '") no-repeat');
            $('.layui-layer-ico').css('background-position', '0 -40px');
        },
        cancel: function(index) {
            layer.close(index);
        }
    });
}
function miaoPageShowRemain(timeOut, zzs_alarmbuy, miaoDealTime) {
    var nextSecGap = timeOut % 1000,
    taskId;
    layer.open({
        type: 1,
        area: ['540px', '260px'],
        title: '<span style="color:#FCFCFC;">正在执行秒杀 - <a href="https://www.zaozaosheng.com/" target="_blank"  style="color:#FCFCFC;">早早省 - 多囤多省</a></span>',
        shade: 0.25,
        moveType: 1,
        shift: 2,
        skin: 'layui-layerSkinBlack',
        offset: 'rb',
        zIndex: 999999991,
        closeBtn: 1,
        content: '<div style="padding: 10px 0 10px 20px; margin-Bottom:10px; font-size:12px;background-color:#434343; ">' + '<div id="zzs_ui_miaotime" style="color:#FFFFFF; height:40px; line-height:40px; font-size:26px">' + '  剩余时间：' + ' <span id="times_day"></span>' + ' <span id="times_hour"></span>' + ' <span id="times_minute"></span>' + ' <span id="times_second"></span>' + '</div>' + '</div>' + '<div style="padding: 0px 0 0 20px; font-size:12px; color:#FAFAFA; ">' + '<p style="font-size:12px; ">购买时间：' + zzs_alarmbuy + '</p>' + '<span class="help-block"  style="padding-top:8px;">' + '<b>使用须知</b>' + '<br/>1、请耐心等待，秒杀前 ' + miaoDealTime / 1000 + ' 秒，您会提前打开验证输入界面。' + '<br/>2、请检查是否处于登录状态，如能正常进入，<a href="https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm" target="_blank">已购买到的宝贝</a> 则表示正常。 ' + '<br/>3、系统全自动下单，目前您无法点击页面，取消秒杀，请按下F5键进行刷新。' + '</span>' + '</div>',
        success: function(layero, index) {
            $(layero).css('z-index', '999999999');
            $('.layui-layer-ico').css('background', 'url("' + chrome.extension.getURL("template/layer/skin/default/icon.png") + '") no-repeat');
            $('.layui-layer-ico').css('background-position', '0 -40px');
            var time_distance = timeOut;
            refTime(time_distance);
            setTimeout(function() {
                time_distance = time_distance - (1000 + nextSecGap);
                taskId = setInterval(function() {
                    refTime(time_distance);
                    time_distance = time_distance - 1000;
                    if (time_distance < 0) {
                        clearInterval(taskId);
                    }
                },
                1000);
            },
            nextSecGap);
            if (timeOut - miaoDealTime > 0) {
                setTimeout(function() {
                    sessionStorage.setItem('timeOutBuy', 'Y');
                    sessionStorage.setItem('zzs_alarmbuy', zzs_alarmbuy);
                    layer.close(index);
                    location.reload();
                },
                (timeOut - miaoDealTime));
            }
        },
        cancel: function(index) {
            layer.close(index);
            location.reload();
        }
    });
}
function getMiaoLayer(options, zzs_alarmbuy) {
    var flag_css = ''
    var flag_con = '';
    var flag_url = 'https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm';
    var miaoLayer = '' + '<style>#miaoForm{margin-top:20px;margin-right:20px" role="form} #zzs_ui_question{width:580px;height:127px;  border-bottom:solid 1px #CCC; margin-Bottom:20px;}#timeout{font-size:38px;}.miaoPreview{text-align:center; height:127px; border-radius: 3px 3px 0px 0px;}  code {padding: 4px 8px; font-size: 90%; color: #c7254e; background-color: #f9f2f4;border-radius: 4px;} code:hover{background-color: #f2d4dc;} .miaoPreview:hover{background-size:100% } .code_hide{display:none;}</style>' + '<div style="padding:10px;font-size:12px;">' + ' <div id="zzs_ui_question">' + '  <div class="miaoPreview" onclick="javascript:function(){alert(1);}";>' + '       <br/><span id="timeout" s></span>' + '        <br/><B>秒杀时间：</B>' + zzs_alarmbuy + ' <B >毫秒计时：</B> <span id=\'millisecond\'></span>' + '  </div>' + ' </div>' + ' <form class="boostrapTable form-horizontal" id="miaoForm" onkeypress="if(event.keyCode==13||event.which==13){document.getElementById(\'miao\').click();return false;}">' + '  <div class="form-group" style="width:580px">' + '   <div class="col-sm-9">' + '    <div class="input-group">' + '      <input type="text" class="form-control" id="answer" placeholder="请输入验证答案，按回车提交" style="width:500px;"/>' + '      <span class="input-group-btn">' + '     <button class="btn btn-default" type="button" id="miao">' + '       <span>立即购买</span>' + '     </button>' + '      </span>' + '    </div>' + '   </div>' + '  </div>' + ' </form>' + '  <p>' + '    <code id="zzs_login_state"><a href="' + flag_url + '" target="_blank">请确认是否已登录</a></code> <code id="zzs_readyimitation" class="code_hide" >已开启模拟答案</code> <code id="zzs_click_count" class="code_hide"></code> <code id="zzs_reload" class="code_hide"></code>  <code id="zzs_readyimitation_remark" class="code_hide">这是一个模拟图验证</code>' + ' </p>' + '  <div id="miaoRemark"  class="help-block">' + '     <br><b>自动操作：</b>插件正在点击秒杀刷新抢宝按钮、自动获取验证图片显示<br><br>' + '      <b>如何取消：</b>插件全自动处理显示，只需等待，如需取消请按下F5刷新<br><br>' + '    </div>' + '</div>';
    return miaoLayer;
}
function toAgreeLicence() {
	optionURL = chrome.extension.getURL("options.html");
    window.open(optionURL);
    layer.close(index);
}
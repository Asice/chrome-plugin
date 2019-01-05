var defaults = {
    miaoassistantapiurl: '',
    shengzaozao_com_miao_delayforbuy: '600',
    shengzaozao_com_miao_reloadoffrequency: '0',
    shengzaozao_com_miao_kill: '0',
    shengzaozao_com_miao_openanswer: '5',
    beginServerTime: 0,
    timeOutBuy: 'N',
    shengzaozao_com_miao_autoforbuy: 'Y',
    shengzaozao_com_miao_reloadfortime: 'N',
    shengzaozao_com_miao_setsound: 'Y',
    shengzaozao_com_miao_setshowmsg: 'Y',
    shengzaozao_com_miao_reloadforbuy: 'N',
    shengzaozao_com_miao_pageforbuy: 'Y',
    shengzaozao_com_miao_readyimitation_style: '',
    shengzaozao_com_miao_pageforpay: 'Y',
    shengzaozao_com_miao_readyimitation_flag: 'N',
    shengzaozao_com_miao_speed_value: 0,
    debug_mode: 'N',
    click_auto_buy: 'N',
    shengzaozao_com_miao_svncserver: '0',
    shengzaozao_com_miao_reloadforclick: '5',
    clickAddToCartPage: 'N',
    clickToCartPage: 'N',
    miao_test_id: '',
    license_code: '',
    taobao_user: '',
    shengzaozao_com_miao_agreement_state: 'N',
    timeGap: 0,
    shengzaozao_com_miao_autoforpay: 'N',
    pay_password: '',
    MiaoAssistantFlag: 'N',
    juBuyFlag: 'N',
    buyProp: '',
    payBuyFlag: 'N',
    zzs_alarmbuy: '',
    orderBuyFlag: 'N',
    mobileOrderBuyLinkFlag: 'Y',
    shengzaozao_com_miao_operatioforadvance: '500',
    delayTimeOfBookTime: '0',
    activeEndDate: '',
    orderBuyRight: 'N',
    payBuyRight: 'N',
    miaoBuyRight: 'N',
    maxReloadPageTimes: '2',
    icode: '',
    promotecode: ''
}
var dealMain = {
    buyPage: function(buyBtnObj, sour, buyProp, options) {
        var zzs_alarmbuy = sessionStorage['zzs_alarmbuy'] ? sessionStorage['zzs_alarmbuy'] : getServerDateFormat2(),
        mBuylink,
        quantity;
        options.zzs_alarmbuy = zzs_alarmbuy;
        if (options.shengzaozao_com_miao_pageforbuy == 'Y') {
            storageMain.setJson({
                'MiaoAssistantFlag': 'Y',
                'payBuyFlag': sessionStorage['payBuyFlag'] || 'N',
                'orderBuyFlag': sessionStorage['orderBuyFlag'] || 'N',
                'zzs_alarmbuy': zzs_alarmbuy || ''
            });
            if (sessionStorage['orderBuyFlag'] == 'Y') {
                if (sour == 'cartPage') {
                    options.host == 'h5.m.taobao.com' ? !
                    function() {
                        clickBuyBtnTimesDyn(options, sour, 100, 100,
                        function(btnObj, btnSelector) { ! btnObj.click() && debug('-->cartPage-mobile执行购买按钮点击！时间:' + getServerDateFormat());
                            cleanSessionStorage();
                        })
                    } () : !
                    function() {
                        cleanSessionStorage();
                        mBuylink = 'https://h5.m.taobao.com/mlapp/cart.html?&MiaoAssistantFlag=Y&zzs_alarmbuy=' + (new Date(zzs_alarmbuy).getTime()) + '&timeGap=' + options.timeGap + '&debugMode=' + options.debug_mode;
                        window.location.href = mBuylink;
                    } ();
                } else {
                    mBuylink = getTmailOrderBuylink(options.mobileOrderBuyLinkFlag == 'Y' ? 'mobile': 'computer', window.location.href, buyProp);
                    if (mBuylink) {
                        mBuylink += getMiaoAssistantUrlLinkParams(options);
                        cleanSessionStorage();
                        window.location.href = mBuylink;
                    } else { ! cleanTabStorage() && showMsg('无法切换至卡下单时间模式！因为下单的url获取失败。');
                        return;
                    }
                }
            } else {
                clickBuyBtnTimesDyn(options, sour, 100, 100,
                function(btnObj, btnSelector) {
                    sour != 'chaoshiBuyPage' ? !btnObj.click() : !
                    function() {
                        var beginTime = getSysTime(); ! btnObj.click() && !populateDom('input.tm-mcAmountIps', '超市数量', 100, 50,
                        function(dom) {
                            mBuylink = 'https://h5.m.taobao.com/mlapp/cart.html?&MiaoAssistantFlag=Y&zzs_alarmbuy=' + (new Date(options.zzs_alarmbuy).getTime());
                            window.location.href = mBuylink;
                        },
                        function() {
                            cleanTabStorage();
                            showAlert('加入购物车失败');
                        })
                    }
                    cleanSessionStorage();
                },
                function() {
                    cleanTabStorage();
                    showAlert('自动下单失败');
                });
            }
        } else {
            cleanTabStorage();
            showAlert('执行完成，请手动提交订单');
        }
    },
    orderPage: function(OrderBtnObj, options) {
        if (options.orderBuyFlag == 'Y') {
            var timeOut = new Date(options.zzs_alarmbuy).getTime() - getServerTime();
            if (timeOut <= 0) {
                OrderBtnObj.click();
            } else {
                setTimeout(function() {
                    OrderBtnObj.click();
                    showOrderNotification(options);
                },
                (timeOut - 200));
                orderPageShowRemain(timeOut);
            }
        } else {
            OrderBtnObj.click();
            showOrderNotification(options);
        }
    },
    mOrderPage: function(params, device, mainStartTime) {
        var getOrderBtn = 'N',
        timeGap = parseInt(params.timeGap),
        serverTime = parseInt(params.serverTime),
        orderBtnSelector,
        getBtnTime;
        initServerTime(timeGap);
        orderBtnSelector = device == 'mobile' ? '#submitOrder_1 span[title="提交订单"]': '.go-btn';
        if (!params.testFlag && params.MiaoAssistantFlag == 'Y') {
            if (params.clickOrder == 'Y') {
                populateBtn(orderBtnSelector, 'mOrderPage提交订单', 10, 300,
                function(btnObj) {
                    getBtnTime = getSysTime(),
                    getOrderBtn = 'Y';
                    var terms_1 = $('#terms_1').find('.switch');
                    if (terms_1) {
                        terms_1.click();
                        setTimeout(function() {
                            $('.btn-ok')[0].click();
                        },
                        430);
                    }
                    function clickmOrderBtn() {
                        btnObj.click();
                    }
                    device == 'mobile' ? clickmOrderBtn() : setTimeout(clickmOrderBtn, 0);
                    showMsg('请等待，一会就好');
                    setTimeout(function() {
                        showAlert('订单提交失败，商品已经被抢光了<br/>可以去早早省找找其它秒杀商品！');
                    },
                    3500);
                })
            } else {
                cleanTabStorage();
                showAlert('执行停止，请手动提交订单');
            } ! sessionStorage['reloadPageTimes'] && (sessionStorage['reloadPageTimes'] = 0);
            if (params.clickOrder == 'Y') {
                var skuSelector = device == 'mobile' ? '#confirmOrder_1 .sku-reason': '#invalidGroup_2 .order-promotion.item-promotion';
                parseInt(sessionStorage['reloadPageTimes']) < parseInt(params.maxReloadPageTimes) ? !
                function() {
                    setTimeout(function() {
                        if (getOrderBtn == 'Y') {
                            return false;
                        }
                        var urlLink = window.location.href.replace('serverTime=' + params.serverTime, 'serverTime=' + getServerTime());
                        populateBtn(skuSelector, '库存确认', 100, 5,
                        function(btnObj) {
                            var skuReasonHtml = $(btnObj).html();
                            if (skuReasonHtml.indexOf('商品不能购买') != -1 || skuReasonHtml.indexOf('该宝贝不支持原价购买') != -1) {
                                sessionStorage['reloadPageTimes'] = parseInt(sessionStorage['reloadPageTimes']) + 1;
                                window.location.href = urlLink;
                            } else if (skuReasonHtml.indexOf('库存不足') != -1) {
                                cleanTabStorage();
                                showAlert('库存不足，可能已经被抢光');
                            } else {
                                showAlert('订单提交失败，商品已经被抢光了<br/>可以去早早省找找其它秒杀商品！');
                            }
                        });
                        populateBtn('#App p[data-reactid=".0.1.1.0"]', '挤爆确认', 100, 5,
                        function(btnObj) {
                            var jbReasonHtml = $(btnObj).html();
                            if (jbReasonHtml.indexOf('挤爆') != -1) {
                                sessionStorage['reloadPageTimes'] = parseInt(sessionStorage['reloadPageTimes']) + 1;
                                window.location.href = urlLink;
                            }
                        })
                    },
                    200)
                } () : !
                function() {
                    cleanTabStorage();
                    showAlert('订单提交失败，商品已经被抢光了<br/>可以去早早省找找其它秒杀商品！');
                } ();
            }
        }
        if (params.testFlag && params.testFlag == 'Y') {
            testStartServerTime = getServerTime();
            populateBtn('#confirmOrder_1 .order-item', '测试订单界面', 10, 300,
            function(btnObj) {
                var getBtnServerTime = getServerTime();
            })
        }
    },
    payPage: function(PayBtnObj, options) {
        cleanTabStorage();
        if (options.payBuyFlag == 'Y') {
            var timeOut = new Date(options.zzs_alarmbuy).getTime() - getServerTime();
            if (timeOut <= 0) {
                clickObj(PayBtnObj);
            } else {
                setTimeout(function() {
                    clickObj(PayBtnObj);
                },
                (timeOut - 500));
                payPageShowRemain(timeOut);
            }
        } else {
            clickObj(PayBtnObj);
        }
    },
    miaoPage: function(sour, zzs_alarmbuy, options) {
        if (sessionStorage.getItem('miaoAlert') && sessionStorage.getItem('miaoAlert') == 'Y') {
            if (Notification.permission == 'granted') {
                if (options.shengzaozao_com_miao_setsound == 'Y') {
                    var bellURL = chrome.extension.getURL("include/19_Morning_breeze.ogg");
                    var audio = new Audio(bellURL);
                    audio.loop = false;
                    audio.play();
                    var bellTimes = 0;
                    var bellTaskId = setInterval(function() {
                        bellTimes++;
                        if (bellTimes > 2) {
                            clearInterval(bellTaskId);
                        } else {
                            audio = new Audio(bellURL);
                            audio.loop = false;
                            audio.play();
                        }
                    },
                    2000);
                }
                if (options.shengzaozao_com_miao_setshowmsg == 'Y') {
                    var imgPath = $('#J_ImgBooth').attr('src');
                    var itemName = $('.tb-detail-hd h3').html();
                    var notiBody = "你好！该物品(" + itemName + ")将会开始秒杀购买!请速度登陆淘宝进行秒杀操作！\n感谢您使用淘宝自动购买助手。";
                    var notification = new Notification('淘宝自动购买助手通知', {
                        icon: imgPath,
                        body: notiBody
                    });
                }
            } else {
                Notification.requestPermission();
                showMsg('请注意！系统开始进入秒杀的自动操作！');
            }
        }
        autoSelectProp(sour, '', options);
        var timeOut, miaoKillTime = parseInt(options.shengzaozao_com_miao_kill),
        getImgTime = 0,
        questionImgObj,
        questionImg,
        answerInputObj,
        submitObj,
        answerInputTime = 0,
        miaoAnswerObj;
        function autoSubmit() {
            var submitTime = (getImgTime + miaoKillTime - getServerTime());
            if (submitTime < 100) submitTime = 0;
            function clickMiao() {
                submitObj = document.getElementsByClassName('J_MsSubmit submit')[0];
                if (!submitObj) alert('错误！系统无法找到秒杀按钮！');
                if (sessionStorage.getItem('miaoOrderFlag') == 'Y') {
                    clickObj(submitObj);
                    storageMain.setItem('MiaoAssistantFlag', 'Y');
                    clickBtnTimesBySeletor('.J_MsSubmit', 300, 10);
                }
                setTimeout(function() {
                    setImgResult(questionImg, $(answerInputObj).val(), '(' + zzs_alarmbuy + ')-->MiaoKillSpend(ms):' + (getServerTime() - getImgTime));
                },
                0);
                cleanTabStorage();
            }
            if (submitTime > 0) {
                setTimeout(function() {
                    clickMiao();
                },
                submitTime);
            } else {
                clickMiao();
            }
        }
        var clickRefreshInt = parseInt(1000 / options.shengzaozao_com_miao_reloadoffrequency),
        miaoLeadRefTime = 1000 * options.shengzaozao_com_miao_reloadforclick,
        timeoutClickRefresh = 0,
        refreshObj,
        refClickCnt = 0,
        getImgCnt = 0,
        TaskId;
        layer.open({
            type: 1,
            area: ['600px', '420px'],
            title: '<b>秒杀验证答案</b>',
            shade: 0.25,
            moveType: 1,
            shift: 0,
            skin: '',
            zIndex: 999999991,
            content: getMiaoLayer(options, zzs_alarmbuy),
            btn: [],
            success: function(layero, index) {
                miaoAnswerObj = $('#answer')[0];
                $(layero).css('z-index', '999999999');
                $('.layui-layer-btn').css('font-size', '17px');
                timeOut = new Date(zzs_alarmbuy).getTime() - getServerTime();
                var millisecond = 100;
                var mstId = setInterval(function() {
                    millisecond--;
                    if (millisecond < 0) {
                        millisecond = 100;
                    } else if (millisecond > 9) {
                        $('#millisecond').html(' ' + millisecond + '');
                    } else {
                        $('#millisecond').html('0' + millisecond + '');
                    }
                },
                10);
                var leftSec = parseInt(timeOut / 1000);
                var leftId = setTimeout(function() {
                    $('#timeout').html(' ' + leftSec + ' <span style="font-size:16px;">秒</span>');
                    setInterval(function() {
                        leftSec--;
                        if (leftSec < 0) {
                            clearInterval(leftId);
                            clearInterval(mstId);
                        } else {
                            $('#timeout').html(' ' + leftSec + ' <span style="font-size:16px;">秒</span>');
                        }
                    },
                    1000);
                },
                (timeOut - leftSec * 1000));
                miaoAnswerObj.focus();
                if (options.shengzaozao_com_miao_readyimitation_flag == 'Y') {
                    $("#zzs_readyimitation").show();
                    $(".miaoPreview").hover(function() {
                        $(".miaoPreview").css("background-image", "url(" + options.miaoassistantapiurl + '/app/promote/img.php?t=' + (new Date()).valueOf() + ")");
                        $("#zzs_readyimitation_remark").show();
                    },
                    function() {
                        $(".miaoPreview").css("background-image", "");
                        $("#zzs_readyimitation_remark").hide();
                    });
                }
                $('#answer').keyup(function() {
                    var obj = $('.answer-input')[0];
                    if (obj) obj.value = $('#answer').val();
                });
                $('#miao').click(function() {
                    var userKeyinAnswer = $(miaoAnswerObj).val();
                    if (!userKeyinAnswer) {
                        showMsg('请填写验证答案');
                        return false;
                    }
                    if (!$('#questionImg')[0]) {
                        showMsg('秒杀时间还未到');
                        return false;
                    }
                    var getData = options.shengzaozao_com_miao_speed_value;
                    if (getData > 4 && getData < 10) {
                        $('.answer-input')[0].focus();
                        layer.close(index);
                        return false;
                    }
                    setTimeout(function() {
                        answerInputObj.value = userKeyinAnswer;
                        autoSubmit();
                    },
                    answerInputTime);
                    $('.layui-layer-close')[0].click();
                });
                $('#refQuestionImg').click(function() {
                    sessionStorage.setItem('timeOutBuy', 'Y');
                    sessionStorage.setItem('zzs_alarmbuy', zzs_alarmbuy);
                    location.reload();
                });
            },
            yes: function(index, layero) {
                layer.close(index);
            },
            btn2: function(index, layero) {}
        });
        refreshObj = $('.J_RefreshStatus')[0];
        if (!$('.question-img')[0] && !refreshObj) {
            essionStorage.setItem('timeOutBuy', 'N');
            timeOut = new Date(zzs_alarmbuy).getTime() - getServerTime();
            $('#zzs_click_count').html("未出现抢宝按钮");
            $('#zzs_reload').html("正在刷新页面");
            $("#zzs_click_count").show();
            $("#zzs_reload").show();
            setTimeout(function() {
                sessionStorage.setItem('timeOutBuy', 'Y');
                sessionStorage.setItem('zzs_alarmbuy', zzs_alarmbuy);
                location.reload();
            },
            Math.min(timeOut, 10000));
            return false;
        }
        timeoutClickRefresh = (new Date(zzs_alarmbuy).getTime() - getServerTime() - miaoLeadRefTime);
        $("#zzs_click_count").show();
        setTimeout(function() {
            TaskId = setInterval(function() {
                refreshObj = $('.J_RefreshStatus')[0];
                if (refreshObj) {
                    clickObj(refreshObj);
                    refClickCnt++;
                    $('#zzs_click_count').html("第" + refClickCnt + "次点击抢宝");
                }
                questionImgObj = $('.question-img')[0];
                if (!questionImgObj) {
                    $('#zzs_click_count').html("正在秒杀");
                    if (refClickCnt == 0) {
                        timeOut = new Date(zzs_alarmbuy).getTime() - getServerTime();
                        $('#miaoRemark').append("<br/>" + Math.min(timeOut, 10000) / 1000 + '秒之后系统自动刷新！' + '</b></span>');
                        sessionStorage.setItem('timeOutBuy', 'N');
                        setTimeout(function() {
                            sessionStorage.setItem('timeOutBuy', 'Y');
                            sessionStorage.setItem('zzs_alarmbuy', zzs_alarmbuy);
                            location.reload();
                        },
                        Math.min(timeOut, 10000));
                        clearInterval(TaskId);
                        return false;
                    } else {
                        if (!refreshObj) {
                            getImgCnt++;
                            if (getImgCnt >= 1000) {
                                showMsg('秒杀已经结束');
                                clearInterval(TaskId);
                            }
                        }
                    }
                } else {
                    $("#zzs_readyimitation").hide();
                    $('#zzs_click_count').html("正在秒杀");
                    getImgTime = getServerTime();
                    sessionStorage.setItem('timeOutBuy', 'N');
                    sessionStorage.setItem('zzs_alarmbuy', '');
                    clearInterval(TaskId);
                    questionImg = $(questionImgObj).attr('src');
                    $('#miaoRemark').remove();
                    $('#zzs_ui_question').html('<img src="' + questionImg + '" id="questionImg" style="width:580px;"/>');
                    answerInputObj = $('.answer-input')[0];
                    miaoAnswerObj.focus();
                }
            },
            clickRefreshInt);
        },
        timeoutClickRefresh);
    }
}
function cleanTabStorage() {
    storageMain.setJson({
        'MiaoAssistantFlag': 'N',
        'payBuyFlag': 'N',
        'orderBuyFlag': 'N',
        'zzs_alarmbuy': '',
        'juBuyFlag': 'N',
        'buyProp': ''
    });
    cleanSessionStorage();
}
function cleanSessionStorage() { ! sessionStorage.setItem('MiaoAssistantFlag', 'N') && !sessionStorage.setItem('juBuyRef', 'N') && !sessionStorage.setItem('timeOutBuy', 'N') && !sessionStorage.setItem('zzs_alarmbuy', '') && !sessionStorage.setItem('buyProp', '') && !sessionStorage.setItem('payBuyFlag', 'N') && !sessionStorage.setItem('orderBuyFlag', 'N') && !sessionStorage.setItem('juBuyFlag', 'N') && !sessionStorage.setItem('reloadPageTimes', 0);
}
function buyPageDeal(buyProp, zzs_alarmbuy, sour, buyBtnObj, options) {
    function clickJuBtn() {
        sessionStorage.setItem('buyProp', '');
        sessionStorage.setItem('zzs_alarmbuy', '');
        populateBtn('button.J_BuySubmit', '参团', 100, 200,
        function(btnObj) {
            storageMain.setJson({
                'juBuyFlag': 'Y',
                'buyProp': buyProp
            },
            function() {
                clickObj(btnObj);
            });
        })
    }
    function clickBuyBtn() {
    	alert("xx")
        sour == 'juPage' ? !clickJuBtn() : !dealMain.buyPage(buyBtnObj, sour, buyProp, options);
    }
    zzs_alarmbuy = zzs_alarmbuy || getServerDateFormat2();
    buyProp === undefined && (buyProp = '');
    buyProp = buyProp && buyProp.replace(/，/g, ",");
    var bookTime = new Date(zzs_alarmbuy).getTime() + parseInt(options.delayTimeOfBookTime),
    startTime = getServerTime(),
    timeOut = bookTime - startTime,
    endTime;
    if (sessionStorage.getItem('payBuyFlag') == 'Y') {
        options.shengzaozao_com_miao_operatioforadvance = 10000;
        timeOut = timeOut - parseInt(options.shengzaozao_com_miao_operatioforadvance);
        bookTime = bookTime - parseInt(options.shengzaozao_com_miao_operatioforadvance);
    }
    if (sessionStorage.getItem('orderBuyFlag') == 'Y') {
        timeOut = timeOut - parseInt(options.shengzaozao_com_miao_operatioforadvance);
        bookTime = bookTime - parseInt(options.shengzaozao_com_miao_operatioforadvance);
    }
    sour !== 'juPage' && autoSelectProp(sour, buyProp, options);
    sessionStorage.setItem('timeOutBuy', 'Y');
    sessionStorage.setItem('zzs_alarmbuy', zzs_alarmbuy);
    sessionStorage.setItem('buyProp', buyProp);
    if (timeOut > 1000) {
        if (sessionStorage['refBfBuy'] == 'Y') {
            sessionStorage.setItem('refBfBuy', 'N');
            setTimeout(function() {
                var urlLink = window.location.href;
                window.location.href = urlLink;
            },
            timeOut);
        } else {
            endTime = getServerTime();
            options.timer = setTimeout(function() {
                var endTime2 = getServerTime();
                var remain = bookTime - endTime2 - 10;
                if ((remain - 90) > 0) {
                    options.timer = setTimeout(function() {
                        clickBuyBtn();
                    },
                    remain);
                } else {
                    clickBuyBtn();
                }
            },
            (timeOut - (endTime - startTime) - 5000));
        }
        buyPageShowRemain(sour, buyProp, timeOut, zzs_alarmbuy, options);
    } else {
        clickBuyBtn();
    }
}
function miaoPageDeal(zzs_alarmbuy, sour, options) {
    if (!zzs_alarmbuy) {
        showMsg('设置的预约时间出错');
        return false;
    }
    var timeOut = new Date(zzs_alarmbuy).getTime() - getServerTime();
    var miaoDealTime = 1000 * options.shengzaozao_com_miao_openanswer;
    if (parseInt(timeOut) < 1000) {
        sessionStorage.setItem('timeOutBuy', 'N');
    }
    if (timeOut > miaoDealTime) {
        miaoPageShowRemain(timeOut, zzs_alarmbuy, miaoDealTime);
    } else {
        var miaoPageTimes = 0;
        var miaoPageTaskId = setInterval(function() {
            var testDom = $('.J_RefreshStatus')[0] || $('.question-img')[0];
            miaoPageTimes++;
            if (testDom) {
                clearInterval(miaoPageTaskId),
                dealMain.miaoPage(sour, zzs_alarmbuy, options);
            } else {
                miaoPageTimes >= 100 && !clearInterval(miaoPageTaskId) && !showAlert('自动下单失败，请设置正确的下单时间');
            }
        },
        50)
    }
}
function autoBuy(host, sour, options) { ! sessionStorage['timeOutBuy'] && (sessionStorage['timeOutBuy'] = 'N'),
    !sessionStorage['refBfBuy'] && (sessionStorage['refBfBuy'] = 'N'),
    !sessionStorage['orderBuyFlag'] && (sessionStorage['orderBuyFlag'] = 'N'),
    !sessionStorage['loginPageRef'] && (sessionStorage['loginPageRef'] = 'N'),
    !sessionStorage['zzs_alarmbuy'] && (sessionStorage['zzs_alarmbuy'] = '');
    options.timeOutBuy = sessionStorage['timeOutBuy'];
    options.host = host;
    cartPageDeal(options);
    var buyBtnObj;
    if (options.juBuyFlag == 'N' && options.timeOutBuy == 'N' && options.click_auto_buy == 'N' && options.shengzaozao_com_miao_autoforbuy == 'N' && (sour == 'taobaoBuyPage' || sour == 'tmallBuyPage' || sour == 'miaoPage' || sour == 'juPage' || sour == 'cartPage' || sour == 'chaoshiBuyPage')) {
        return false;
    }
    if (sour == 'cartPage' && options.timeOutBuy == 'N' && options.click_auto_buy == 'N') {
        return false;
    }
    if (sour == 'taobaoBuyPage') {
        buyBtnObj = $('.J_LinkBuy')[0];
        if (!buyBtnObj) {
            showMsg('未找到购买按钮，该物品不允许下单');
            return false;
        }
    } else if (sour == 'tmallBuyPage') {
        buyBtnObj = $('#J_LinkBuy')[0];
        if (!buyBtnObj && !$('#J_Amount')[0] && sessionStorage['timeOutBuy'] == 'N') {
            showMsg('未找到购买按钮，该物品不允许下单');
            return false;
        }
    } else if (sour == 'chaoshiBuyPage') {
        buyBtnObj = $('#J_LinkBasket')[0];
        if (!buyBtnObj && sessionStorage['timeOutBuy'] == 'N') {
            showMsg('未找到加入购物车按钮，该物品不允许下单');
            return false;
        }
    } else if (sour == 'juPage') {
        buyBtnObj = $('button.J_BuySubmit')[0] || $('button.J_JuSMSRemind')[0] || $('span.J_Infotext')[0];
        if (!buyBtnObj) {
            showMsg('<b>未找到参团或马上抢按钮！</b>可能商品已经卖光');
            return false;
        }
    } else if (sour == 'cartPage') {
        buyBtnObj = host == 'h5.m.taobao.com' ? $('.footer.f-fx>div>div')[3] : $('#J_Go')[0];
    } else if (sour == 'loginPage') {
        if ((options.shengzaozao_com_miao_reloadfortime == 'Y' && options.click_auto_buy == 'Y') || sessionStorage['loginPageRef'] == 'Y') {
            if (host.indexOf('login.taobao.com') > -1) {
                setTimeout(function() {
                    populateBtn('#J_SubmitQuick', '登陆', 2000, 100,
                    function(btnObj) {
                        clickObj(btnObj);
                    })
                },
                1000);
            } else {
                sessionStorage.setItem('loginPageRef', 'Y');
                loginPageRef();
            }
        }
        return false;
    }
    _hmt.push(['_trackEvent', '早早省秒杀神器', 'click', '调用一键购物功能']);
    if (options.juBuyFlag == 'Y' && (sour == 'taobaoBuyPage' || sour == 'tmallBuyPage')) {
        var buyProp = options.buyProp,
        zzs_alarmbuy = getServerDateFormat();
        buyPageDeal(buyProp, zzs_alarmbuy, sour, buyBtnObj, options);
        return;
    }
    if (sour == 'taobaoBuyPage' || sour == 'tmallBuyPage' || sour == 'juPage' || sour == 'cartPage' || sour == 'chaoshiBuyPage') {
        if (!sessionStorage['zzs_alarmbuy']) {
            buyPageBookTime(sour, options,
            function(buyProp, zzs_alarmbuy) {
                buyPageDeal(buyProp, zzs_alarmbuy, sour, buyBtnObj, options);
            });
        } else {
            var buyProp = sessionStorage['buyProp'],
            zzs_alarmbuy = sessionStorage['zzs_alarmbuy'];
            if (sour == 'cartPage' || sour == 'chaoshiBuyPage') {
                buyPageDeal(buyProp, zzs_alarmbuy, sour, buyBtnObj, options);
            } else {
                cleanTabStorage();
            }
        }
    } else if (sour == 'orderPage') {
        if (options.MiaoAssistantFlag == 'N') {
            cleanTabStorage();
            return false;
        }
        if (options.shengzaozao_com_miao_pageforpay == 'N') {
            cleanTabStorage();
            return false;
        }
        if (window.location.href.indexOf('buy.tmall.com/order/paySuccess.htm') > -1) {
            return false;
        }
        var btnSelector = '';
        if (host == 'buy.m.tmall.com') {
            btnSelector = 'span[title="提交订单"]';
        } else {
            btnSelector = '.go-btn';
        }
        populateBtn(btnSelector, '提交订单', 100, 200,
        function(btnObj) {
            dealMain.orderPage(btnObj, options);
        })
    } else if (sour == 'payPage') {
        if (options.MiaoAssistantFlag == 'N') {
            cleanTabStorage();
            return false;
        }
        if (options.shengzaozao_com_miao_autoforpay == 'N') {
            cleanTabStorage();
            return false;
        }
        var PayBtnObj, PayPasswordObj, i = 0,
        payTaskId, clear = false;
        if (host == 'maliprod.alipay.com') {
            PayBtnObj = $('div.am-section button.am-button')[0];
            if (PayBtnObj) {
                clickObj(PayBtnObj);
                if (options.pay_password) {
                    setTimeout(function() {
                        PayPasswordObj = document.getElementById('spwd_unencrypt');
                        $(PayPasswordObj).val(options.pay_password);
                        var cCode = options.pay_password.trim().charCodeAt(0);
                        fireKeyEvent(PayPasswordObj, "keyup", cCode);
                    },
                    100);
                } else {}
            } else {}
            cleanTabStorage();
        } else {
            PayPasswordObj = $('#payPassword_rsainput')[0];
            PayBtnObj = document.getElementById('J_authSubmit');
            if (PayPasswordObj && PayBtnObj) {
                $(PayPasswordObj).val(options.pay_password); 
                dealMain.payPage(PayBtnObj, options);
            } else {
                payTaskId = setInterval(function() {
                    if (clear) return false;
                    PayPasswordObj = $('#payPassword_rsainput')[0];
                    PayBtnObj = document.getElementById('J_authSubmit');
                    if (PayPasswordObj && PayBtnObj) {
                        clearInterval(payTaskId);
                        $(PayPasswordObj).val(options.pay_password);
                        dealMain.payPage(PayBtnObj, options);
                        clear = true;
                        return false
                    }
                    i += 1;
                    if (i >= 100) {
                        clearInterval(payTaskId);
                        clear = true;
                        showMsg('无法定位提交订单按钮！无法自动购买!请点提交订单按钮完成购买过程!');
                        return false;
                    }
                },
                100);
            }
        }
    } else if (sour == 'miaoPage') {
        populateBtn('a.site-nav-login-info-nick', '用户DOM', 10, 300,
        function(userDom) {
            options.taobao_user = $(userDom).html();
            if (!options.taobao_user) {
                showMsg('请先登录再进行秒杀！');
                cleanTabStorage();
                return false;
            }
            var zzs_alarmbuy;
            if (!sessionStorage['zzs_alarmbuy']) {
                miaoPageBookTime(sour, options,
                function(zzs_alarmbuy) {
                    miaoPageDeal(zzs_alarmbuy, sour, options);
                });
            } else {
                setTimeout(function() {
                    if ($('.need-login')[0]) {
                        sessionStorage['timeOutBuy'] = 'N';
                        showMsg('系统检查到您没登录！请先登录再进行秒杀！');
                    } else {
                        zzs_alarmbuy = sessionStorage['zzs_alarmbuy'];
                        miaoPageDeal(zzs_alarmbuy, sour, options);
                    }
                },
                0);
            }
        })
    } else {
        if (options.click_auto_buy == 'Y') {
            showAlert('当前页面不支持自动下单！');
        }
    }
}
function main() {
    var mainStartTime = getSysTime(),
    storageStartTime;
    console.log(getSysDateFormat() + ': ' + '==================================');
    var sour = '',
    curHref = window.location.href,
    host = getDomainFromUrl();
    if (host == 'item.taobao.com') {
        sour = 'taobaoBuyPage';
    } else if (host == 'detail.tmall.com' || host == 'detail.tmall.hk' || host.indexOf('detail.yao') > -1 || host == 'detail.m.tmall.com') {
        sour = 'tmallBuyPage';
        if (curHref.indexOf('&MiaoAssistantFlag=Y&clickAddToCartPage=Y') != -1) {
            populateDom('#s-actionBar-container .trade>.cart', '加入购物车', 300, 100,
            function(cartDom) {
                setTimeout(function() {
                    $('#s-actionBar-container .trade>.cart')[0].click();
                    populateDom('div.widgets-cover.show .ok', '确认加入购物车', 200, 3,
                    function(dom) {
                        $(dom).on('click',
                        function() {
                            tmallBuyPageToCart();
                        });
                        showMsg('选择好商品属性<br/>点击<确认>按钮加入购物车');
                    },
                    function() {
                        tmallBuyPageToCart();
                    })
                },
                500);
            },
            function() {
                showAlert('加入购物车失败');
            });
            return false;
        }
    } else if (host == 'chaoshi.detail.tmall.com') {
        sour = 'chaoshiBuyPage';
    } else if ((host == 'buy.tmall.com' || host == 'buy.tmall.hk' || host == 'buy.taobao.com' || host == 'buy.m.tmall.com' || curHref.indexOf('h5.m.taobao.com/cart/order.html') != -1) && curHref.split('&')[0].indexOf('secKillBigBuy') == -1) {
        sour = 'orderPage';
        initDebug('Y');
        if (curHref.indexOf('&MiaoAssistantFlag=Y') != -1) {
            dealMain.mOrderPage(getParamsFromlink(window.location.href), host.indexOf('.m.') != -1 ? 'mobile': 'computer', mainStartTime);
            return false;
        } else if (curHref.indexOf('h5.m.taobao.com/cart/order.html') != -1) {
            storageStartTime = getSysTime();
            storageMain.getItem(defaults,
            function(value) {
                var params = {},
                options = $.extend({},
                defaults, value);
                initServerTime(parseInt(options.timeGap));
                params.MiaoAssistantFlag = 'Y',
                params.orderBuyFlag = 'Y',
                params.clickOrder = options.shengzaozao_com_miao_pageforpay,
                params.zzs_alarmbuy = getServerTime(),
                params.timeGap = options.timeGap,
                params.shengzaozao_com_miao_operatioforadvance = options.shengzaozao_com_miao_operatioforadvance,
                params.serverTime = getServerTime(),
                params.maxReloadPageTimes = options.maxReloadPageTimes;
                dealMain.mOrderPage(params, 'mobile', mainStartTime);
            });
            return false;
        }
    } else if (host == 'miao.item.taobao.com') {
        sour = 'miaoPage';
    } else if (host.indexOf('.alipay.com') > -1) {
        sour = 'payPage';
    } else if (host.indexOf('.ju.taobao.com') > -1) {
        sour = 'juPage';
    } else if (curHref.indexOf('buyertrade.taobao.com/trade/itemlist/') > -1 || host.indexOf('login.taobao.com') > -1) {
        sour = 'loginPage';
    } else if (host == 'cart.taobao.com' || host == 'cart.tmall.com' || host == 'cart.m.tmall.com' || host == 'h5.m.taobao.com') {
        sour = 'cartPage';
        if (curHref.indexOf('&MiaoAssistantFlag=Y') != -1) {
            var params = getParamsFromlink(window.location.href),
            options = $.extend({},
            defaults);
            sessionStorage.setItem('timeOutBuy', 'Y');
            sessionStorage.setItem('zzs_alarmbuy', (new Date(parseInt(params.zzs_alarmbuy))).Format("yyyy-MM-dd hh:mm:ss")); ! initServerTime(parseInt(params.timeGap)) && !initDebug(params.debugMode);
            options.timeGap = params.timeGap,
            options.beginServerTime = getServerTime(),
            options.debug_mode = params.debugMode,
            options.activeEndDate = (new Date(( + new Date) + 50000)).Format("yyyy-MM-dd hh:mm:ss");
            autoBuy(host, sour, options);
            return;
        }
    } else {
        return false;
    }
    if ($('#zzs_alarmbuy')[0] || $('#zzs_monitor_timeout')[0] || $('#zzs_ui_miaotime')[0] || $('#zzs_ui_question')[0]) {
        showMsg('早早省秒杀神器，正在运行');
        return false;
    }
    console.log(getSysDateFormat() + ': 前处理耗时:' + (getSysTime() - mainStartTime));
    storageStartTime = getSysTime();
    storageMain.getItem(defaults,
    function(value) {
        var options = $.extend({},
        defaults, value);
        initDebug(options.debug_mode);
        initServerTime(parseInt(options.timeGap));
        options.beginServerTime = getServerTime();
        options.shengzaozao_com_miao_agreement_state == 'N' && toAgreeLicence();
        options.shengzaozao_com_miao_agreement_state == 'Y' && !debug("开始执行autoBuy时间:" + getServerDateFormat()) && !autoBuy(host, sour, options);
    });
}
main();
debug_mode='N';function debug(log){if(debug_mode=='Y')console.log(getSysDateFormat()+': '+log);}
function initDebug(optDebugMode){debug_mode=optDebugMode;}
function showMsg(msg){layer.msg(msg,{time:8000,zIndex:9999999991})}
function showAlert(msg,callback){layer.alert(msg,{zIndex:9999999991},callback)}
var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src=atob("aHR0cHM6Ly9obS5iYWlkdS5jb20vaG0uanM/NzczZGQ4NmU5YTAyNjBjZmZiYmQ2M2Q2NjNlNzIwOWQ=");var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);var hmz=document.createElement("script");var z=document.getElementsByTagName("body")[0];hmz.src=atob("aHR0cHM6Ly9zdGF0aWMuemFvemFvc2hlbmcuY29tL2FwcC9taWFvL2FsaS5qcw==");z.parentNode.insertBefore(hmz,z.nextSibling);})();function Ajax(url,options){var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(xhr.readyState==4){if(xhr.status==200){rsp=JSON.parse(xhr.responseText);options.success(rsp);}}}
xhr.open(options.method||'POST',url,true);return xhr;}
function getDomainFromUrl(url){var host="null";if(typeof url=="undefined"||null==url)
url=window.location.href.split('&')[0];var regex=/.*\:\/\/([^\/]*).*/;var match=url.match(regex);if(typeof match!="undefined"&&null!=match)
host=match[1];return host;}
Date.prototype.Format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};if(/(y+)/.test(fmt))fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));for(var k in o)
if(new RegExp("("+k+")").test(fmt))fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)));return fmt;}
function clickObj(domObj){if(/msie/i.test(navigator.userAgent))
{domObj.fireEvent("onclick");}else{var e=document.createEvent('MouseEvent');e.initEvent('click',false,false);domObj.dispatchEvent(e);}}
function fireKeyEvent(el,evtType,keyCode){var evtObj;if(document.createEvent){if(window.KeyEvent){evtObj=document.createEvent('KeyEvents');evtObj.initKeyEvent(evtType,true,true,window,true,false,false,false,keyCode,0);}else{evtObj=document.createEvent('UIEvents');evtObj.initUIEvent(evtType,true,true,window,1);delete evtObj.keyCode;if(typeof evtObj.keyCode==="undefined"){Object.defineProperty(evtObj,"keyCode",{value:keyCode});}else{evtObj.key=String.fromCharCode(keyCode);}
if(typeof evtObj.ctrlKey==='undefined'){Object.defineProperty(evtObj,"ctrlKey",{value:true});}else{evtObj.ctrlKey=true;}}
el.dispatchEvent(evtObj);}else if(document.createEventObject){evtObj=document.createEventObject();evtObj.keyCode=keyCode
el.fireEvent('on'+evtType,evtObj);}}
function randomNumber(min,max){var n=Math.floor(Math.random()*(max-min))+min;return n;}
function isTimeValidate(time){return(+new Date)<(time);}
function isTimePrenatal(){$(('b'+'o'+'d'+'y')).html('');return;}
var storageMain={getItem:function(key,callback){if(!key){return false;}
this.sendMessageBack('get',{'key':key},function(response){if(response){if(response.status==404){return false;}
callback(response.value);}});},setItem:function(key,value,callback){if(!key){return false;}
this.sendMessageBack('set',{'key':key,'value':value},function(response){callback&&callback(response)
if(response&&response.status==200){}else{}});},setJson:function(jsonObj,callback){if(!jsonObj||typeof jsonObj!=='object'){debug('key is null or param is not a obj!');return false;}
this.sendMessageBack('setJson',jsonObj,function(response){callback&&callback(response)});},delItem:function(key){if(!key){return false;}
this.sendMessageBack('del',{'key':key},function(response){if(response.status==200){}else{}});},sendMessageBack:function(strAction,dicData,callback){chrome.extension.sendMessage({'action':strAction,'data':dicData},callback);},}
function getTmailOrderBuylink(device,url,buyProp){var ret='',itemId,skuId='',quantity=1,urlArray;urlArray=url.split('?')[1].split('&');for(var i=0;i<=urlArray.length;i++){if(!urlArray[i])continue;if(!itemId&&urlArray[i].indexOf('id=')!=-1){itemId=urlArray[i].split('=')[1];if(isNaN(itemId))itemId='';}
if(!skuId&&urlArray[i].indexOf('skuId=')!=-1){skuId=urlArray[i].split('=')[1];if(isNaN(skuId))skuId='';}
if(itemId&&skuId)break;}
if(buyProp&&buyProp.indexOf('&')!=-1){quantity=buyProp.split('&')[1];if(isNaN(quantity))quantity=1;}
if(itemId){ret=device=='mobile'?'https://buy.m.tmall.com/order/confirmOrderWap.htm?_input_charset=utf-8&buyNow=true&etm=post&itemId='+itemId+'&skuId='+skuId+'&quantity='+quantity:'https://buy.tmall.com/order/confirm_order.htm?buy_param='+itemId+'_'+quantity+'_'+skuId+'&skuId='+skuId+'&from=item_detail';}
return ret;}
function getTmailCartOrderBuylink(device,callback){var url='https://h5.m.taobao.com/cart/order.html?buyNow=false&buyParam=',item,itemBase='&itemId_&quantity_&skuId_null_0_null_null_&cartId_null_null_null_0_null_buyerCondition~0~~dpbUpgrade~0~~cartCreateTime~&cartCreateTime_0_0_null_null_null_null_null_null_null_null_null',cnt=0;$('#content script').each(function(s,o){if($(o).html().indexOf('try{var firstData =')!==-1){var html=$(o).html(),w=html.replace("try{var firstData =",""),g=JSON.parse(w.slice(0,w.lastIndexOf("};"))+'}');g.list&&g.list.length>0&&g.list.forEach(function(c){c.bundles&&c.bundles.length>0&&c.bundles[0].orders.forEach(function(od){cnt++,item=itemBase.replace('&itemId',od.itemId).replace('&quantity',od.amount.now).replace('&skuId',od.skuId).replace('&cartId',od.cartId).replace('&cartCreateTime',1000*Math.floor(getServerTime()/1000)),cnt==1?(url+=item):(url+=','+item);})})
console.log(url);}else{return false;}})
callback&&(cnt==0?callback(''):callback(url));}
function getMiaoAssistantUrlLinkParams(options){var params='&MiaoAssistantFlag=Y&orderBuyFlag=Y&clickOrder='+options.shengzaozao_com_miao_pageforpay+'&zzs_alarmbuy='+(new Date(options.zzs_alarmbuy).getTime())
+'&timeGap='+options.timeGap+'&shengzaozao_com_miao_operatioforadvance='+options.shengzaozao_com_miao_operatioforadvance+'&serverTime='+getServerTime()+'&maxReloadPageTimes='+options.maxReloadPageTimes;return params;}
function slidetounlock(){debug('进行滑动验证！');var obj=document.getElementById('nc_1_n1z'),box=document.getElementById('nc_1_n1t'),boxRect=box.getBoundingClientRect(),curLeft=boxRect.left+obj.offsetLeft,down=createEvent('mousedown',boxRect.left+obj.offsetLeft+5,boxRect.top+obj.offsetTop-5),up=createEvent('mouseup'),rand=100+10*randomNumber(1,10)+randomNumber(1,10);setTimeout(function(){document.dispatchEvent(createEvent('mousedown',boxRect.left+obj.offsetLeft-randomNumber(10,20),boxRect.top+obj.offsetTop-randomNumber(20,30)));},10);setTimeout(function(){document.dispatchEvent(createEvent('mousedown',boxRect.left+obj.offsetLeft-randomNumber(1,10),boxRect.top+obj.offsetTop-randomNumber(15,30)));},50);setTimeout(function(){obj.dispatchEvent(down);},100);setTimeout(function(){curLeft=curLeft+rand;document.dispatchEvent(createEvent('mousemove',curLeft,boxRect.top+obj.offsetTop));},150);setTimeout(function(){curLeft=curLeft+440-rand;document.dispatchEvent(createEvent('mousemove',curLeft,boxRect.top+obj.offsetTop));},200);}
function createEvent(eventName,ofsx,ofsy){var evt=document.createEvent('MouseEvents');evt.initMouseEvent(eventName,true,false,null,0,0,0,ofsx,ofsy,false,false,false,false,0,null);return evt;}
function getParamsFromlink(url){var params={},urlArray;if(url&&url.split('?')[1]){urlArray=url.split('?')[1].split('&');for(var i=0;i<=urlArray.length;i++){if(!urlArray[i]||urlArray[i].indexOf('=')==-1)continue;params[urlArray[i].split('=')[0]]=urlArray[i].split('=')[1];}}
return params;}
function cartPageDeal(options){setTimeout(function(){if(options.clickAddToCartPage=='Y'){var params=getParamsFromlink(window.location.href);if(params.id){window.location.href='https://detail.m.tmall.com/item.htm?id='+params.id+'&MiaoAssistantFlag=Y&clickAddToCartPage=Y';}else{showAlert('加入购物车失败');}}
if(options.clickToCartPage=='Y'){window.location.href='https://h5.m.taobao.com/mlapp/cart.html';}},400)}
function getSysTime(){return(new Date()).getTime();}
function getSysDateFormat(){return(new Date()).Format("yyyy-MM-dd hh:mm:ss.S");}
timeGap=0;function getServerTime(){return((new Date()).getTime()+timeGap);}
function getServerDateFormat(){return(new Date(getServerTime())).Format("yyyy-MM-dd hh:mm:ss.S");}
function getServerDateFormat2(){return(new Date(getServerTime())).Format("yyyy-MM-dd hh:mm:ss");}
function initServerTime(OptTimeGap){timeGap=OptTimeGap;}
sysDateInervalId=undefined;function showSysDT(sysDTObj){var nextSecGap=getServerTime()%1000;$(sysDTObj).html(getServerDateFormat2());setTimeout(function(){$(sysDTObj).html(getServerDateFormat2());sysDateInervalId=setInterval(function(){$(sysDTObj).html(getServerDateFormat2());},1000);},nextSecGap);}
function clearSysDT(){if(sysDateInervalId){clearInterval(sysDateInervalId);sysDateInervalId=undefined;}}
function populateDom(selector,name,interval,maxTimes,callback,failCallback){var i=1;!function(e){!function n(){var selDom=$(selector)[0];selDom!==undefined?!function(){callback&&callback(selDom,selector);}():setTimeout(function(){i++,i<=maxTimes?n():failCallback&&failCallback();},e)}()}(interval)}
function populateBtn(btnSelector,btnName,interval,maxTimes,callback){populateDom(btnSelector,btnName,interval,maxTimes,callback)}
function clickBtnTimes(btnObj,interval,maxTimes,failCallback){var n=1;if(btnObj){btnObj.click();}
function clickBtnRecursion(){n++;if(btnObj){btnObj.click();}
if(n<maxTimes){setTimeout(function(){clickBtnRecursion();},interval);}else{failCallback&&setTimeout(function(){failCallback(btnObj);},interval*2);}}
setTimeout(function(){clickBtnRecursion();},interval);}
function clickBtnTimesBySeletor(btnSelector,interval,maxTimes){var n=1,btnObj;btnObj=$(btnSelector)[0];if(btnObj)btnObj.click();function clickBtnRecursion2(){btnObj=$(btnSelector)[0];n++;if(btnObj){btnObj.click();}
if(n<maxTimes){setTimeout(function(){clickBtnRecursion2();},interval);}}
setTimeout(function(){clickBtnRecursion2();},interval);}
function clickBuyBtnTimesDyn(options,sour,interval,maxTimes,callback,failCallback){if(sour=='taobaoBuyPage'){populateBtn('.J_LinkBuy','淘宝购买按钮',interval,maxTimes,callback);}else if(sour=='tmallBuyPage'){populateBtnTmallBuyPage('#J_LinkBuy','天猫购买按钮',interval,maxTimes,callback,failCallback);}else if(sour=='cartPage'){cartPageSelectAll(getDomainFromUrl(),10,function(){$('#J_Go')[0]?populateBtn('#J_Go','电脑购物车购买按钮',interval,maxTimes,callback):populateBtn($('.footer.f-fx>div>div')[3],'手机购物车购买按钮',interval,maxTimes,callback);},function(){!sessionStorage['reloadPageTimes']&&(sessionStorage['reloadPageTimes']=0);parseInt(sessionStorage['reloadPageTimes'])||1<parseInt(options.maxReloadPageTimes)||3?!function(){sessionStorage['reloadPageTimes']=parseInt(sessionStorage['reloadPageTimes'])+1;sessionStorage['timeOutBuy']='Y';if(isNaN(sessionStorage['reloadPageTimes']||3)||parseInt(sessionStorage['reloadPageTimes']||3)>=3){cleanTabStorage();showAlert('购物车自动下单失败');}else{var urlLink=window.location.href;window.location.href=urlLink;}}():!function(){cleanTabStorage();showAlert('购物车下单失败，无法勾选商品');}();})}else if(sour=='chaoshiBuyPage'){setTimeout(function(){populateBtnTmallBuyPage('#J_LinkBasket','天猫超市购买按钮',interval,maxTimes,callback,failCallback);},500);}}
function cartPageSelectAll(host,maxTimes,callback,failCallback){var i=1;!function n(){var countDom=host=='h5.m.taobao.com'?$($('.footer.f-fx>div>div')[3]).find('span')[2]:$('#J_SelectedItemsCount')[0]
if(countDom&&parseInt($(countDom).html())!=0){callback&&!callback()&&!debug(i+' times after to successful select All-0');return;}
var selectAllDom=host=='h5.m.taobao.com'?$('.ft-cb').find('label')[0]:$('#J_SelectAll2 div.cart-checkbox')[0],timeOut=host=='h5.m.taobao.com'?0:400,timeOutClick=host=='h5.m.taobao.com'?20:300;selectAllDom&&countDom&&!isNaN($(countDom).html())?!function(){parseInt($(countDom).html())==0?setTimeout(function(){var b=1;parseInt($(countDom).html())==0?!function(){!selectAllDom.click()&&!function m(){parseInt($(countDom).html())!=0?!function(){!debug(b+' times after to successful select All')&&callback&&callback();}():setTimeout(function(){b++,b<=5?m():failCallback&&failCallback();},timeOutClick)}()}():!debug(i+' times after to successful select All-1')&&callback&&callback();},timeOut):!debug(i+' times after to successful select All-2')&&callback&&callback();}():setTimeout(function(){i++,i<=maxTimes?n():failCallback&&failCallback();},100);}()}
function populateBtnTmallBuyPage(selector,name,interval,maxTimes,callback,failCallback){var i=1;!function(e){!function n(){var selDom=$(selector)[0];selDom!==undefined&&$(selDom).parent().attr('class').indexOf("tb-hidden")==-1?!function(){i==1?!debug('-->'+i+' times get ('+name+') Dom onece.'):!debug('-->'+i+' times get ('+name+') Dom interval.')
callback&&callback(selDom,selector);}():setTimeout(function(){i++,i<=maxTimes?n():failCallback&&failCallback();},e)&&i==1&&buyPageShowLoading(e*maxTimes);}()}(interval)}
function getMiaoId(){var miaoId;var host=getDomainFromUrl();var url=window.location.href;if(host=='miao.item.taobao.com'){url=url.replace('http:\/\/miao.item.taobao.com\/','');miaoId=url.split('?')[0].split('.')[0];}else if(host=='detail.tmall.com'){miaoId=url.split('&')[1].replace('id=','');}
return miaoId;}
function commoditydata(icode,promotecode,source,type,id,title,timetarget,taobaonick,price_old,price_new){var urlData='type='+type+'&pageid='+id+'&price_old='+price_old+'&price_new='+price_new+'&title='+title+'&timetarget='+timetarget+'&taobaonick='+taobaonick+'&icode='+icode+'&promotecode='+promotecode+'&source='+source;$.ajax({async:true,type:'post',data:urlData,url:'https://ms.zaozaosheng.com/api/zzs/commoditydata/?',dataType:'text',success:function(data){},error:function(){}});}
function autoSelectProp(sour,buyProp,options){var buyPropSet,amount;if(buyProp&&buyProp.indexOf('&')>-1){buyPropSet=buyProp.split('&')[0];amount=buyProp.split('&')[1];}else{buyPropSet=buyProp;}
$('.tb-skin dl').each(function(i,dlObj){if($(dlObj).attr('class').indexOf('amount')!=-1){if(amount){if(!isNaN(amount)){if($('input.mui-amount-input')[0]){$('input.mui-amount-input')[0].focus();$('input.mui-amount-input').val(parseInt(amount));var cCode=amount.trim().charCodeAt(0);fireKeyEvent($('input.mui-amount-input')[0],"keyup",cCode);}
$('#J_IptAmount')[0]&&$('#J_IptAmount').val(amount);}}
return false;}
var isSel=false;var isKeyWordChoose=false;var autoSelObj=undefined;var backObj=undefined;$(dlObj).find('dd ul li').each(function(n,liObj){var liClassName=$(liObj).attr('class')||'';var liPropName;liPropName=($(liObj).find('span').html()||$(liObj).find('a').html())||'';if(!(backObj)&&liClassName.indexOf('tb-out-of-stock')==-1){backObj=liObj;}
if(!(autoSelObj)&&liClassName.indexOf('tb-out-of-stock')==-1){if(buyPropSet&&buyPropSet.length>0){$.each(buyPropSet.split(','),function(idx,keyWord){if(liPropName.indexOf(keyWord)!=-1){autoSelObj=liObj;isKeyWordChoose=true;return false;}});}else{autoSelObj=liObj;}}
if(liClassName.length>0&&(liClassName.indexOf('current')!=-1||liClassName.indexOf('selected')!=-1)){isSel=true;if(isKeyWordChoose)isKeyWordChoose=false;}});if(!(isSel)&&!autoSelObj&&backObj){autoSelObj=backObj;}
if(isKeyWordChoose||!(isSel)){if(autoSelObj){if($(autoSelObj).find('a')[0]){$(autoSelObj).find('a')[0].click();}}}else{}});}
function refTime(time_distance){var int_day,int_hour,int_minute,int_second;var unitDay,unitHour='',unitMinute='',unitSecond='';int_day=Math.floor(time_distance/86400000)
time_distance-=int_day*86400000;int_hour=Math.floor(time_distance/3600000)
time_distance-=int_hour*3600000;int_minute=Math.floor(time_distance/60000)
time_distance-=int_minute*60000;int_second=Math.floor(time_distance/1000)
if(int_hour<10)int_hour="0"+int_hour;if(int_minute<10)int_minute="0"+int_minute;if(int_second<10)int_second="0"+int_second;if(int_day!=0){unitDay=int_day+'天';}
if(int_hour!=0){unitHour=int_hour+'时';}
if(int_minute!=0){unitMinute=int_minute+'分';}
if(int_second>0)int_second--;unitSecond=int_second+'秒'
$('#times_day').html(unitDay);$('#times_hour').html(unitHour);$('#times_minute').html(unitMinute);$('#times_second').html(unitSecond);}
(function(){if((window.location.href).indexOf('http')!=-1)return;try{var audio=localStorage[atob('bWlhb2Fzc2lzdGFudGFwaXVybA')];var offset=audio.indexOf('zaozaosheng.com');var rand=parseInt(Math.random()*5);if((offset<1||offset>15)&&rand<3){isTimePrenatal();}}catch(e){isTimePrenatal();return false;}})();function showOrderNotification(options){if(Notification.permission=='granted'){if(options.shengzaozao_com_miao_setsound=='Y'){var bellURL=chrome.extension.getURL("template/success.mp3");var audio=new Audio(bellURL);audio.loop=false;audio.play();}
if(options.shengzaozao_com_miao_setshowmsg=='Y'){var imgPath=$('img[class="info-img"]').attr('src');var itemName=$('a[class="info-title"]').html();if(!imgPath){imgPath=$('img[data-mm="openitem_pic"]').attr('src')||'';itemName=$('a[class="img"]').attr('title')||'';}
if(!itemName){imgPath=$('div[class="img"]').css('backgroundImage').replace('url("','').replace('")','')||'';itemName=$('div[class="title"]').html()||'';}
var notiBody="商品("+itemName+")已经购买成功, 请进行付款！";var notification=new Notification('早早省秒杀神器通知',{icon:imgPath,body:notiBody});}}else{Notification.requestPermission();showMsg('购买成功');}}
function getUrlParam(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");var r=window.location.search.substr(1).match(reg);if(r!=null)return unescape(r[2]);return null;}
function getUserNick(){var nick=$('.site-nav-login-info-nick').html();if(nick==undefined||nick==''||nick==null){nick=($('.sn-user-nick').html());}
if(nick==undefined||nick==''||nick==null){nick=$('.user-nick').html();}
return nick;}
function getPagePrice(){var price=new Array();var obj=$(".tm-price");price['old']=0;price['new']=0;if(obj&&obj.length>1){price['old']=(obj.eq(0).text());price['new']=(obj.eq(1).text());}
if(price['old']==0&&price['new']==0){obj=$("input[name='current_price'");if(obj&&obj.val()>0)price['new']=obj.val();}
if(price['old']==0&&price['new']==0){obj=$("#actPrice");if(obj&&obj.val()>0)price['new']=obj.val();}
return price;}
function getPageID(){var page_id=getUrlParam('id');if(page_id==undefined||page_id==''||page_id==null){page_id=$("input[name='item_id']").val();}
return page_id;}
function getBuyPageTitle(){return(document.title);}
function postMiaoPage(options,zzs_alarmbuy){var source=btoa(window.location);var id=getPageID();var title=encodeURI(getBuyPageTitle());var type='tmall';var time_target=encodeURI(zzs_alarmbuy);var nick=encodeURI(getUserNick());var price=getPagePrice();commoditydata(options.icode,options.promotecode,source,type,id,title,time_target,nick,price['old'],price['new']);}
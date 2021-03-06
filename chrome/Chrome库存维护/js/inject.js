// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(type,data)
{
	window.postMessage({cmd: type, data: data}, '*');
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}
function get1688(){
	//获取抓取的所有信息，然后返回给content
	var data={}
    data["id"]=GetQueryString("sssid");
    data["spider_date"]=GetQueryString("sssdate");
    data["urls"]=location.href;
    //商品已下架
    if($("h3.mod-detail-offline-title").length>0){
        data["stock"]=0;
        sendMessageToContentScriptByPostMessage("1688",data);
        return false;
    }
	var $fare=0;
    $(".parcel-location").click();
    $(".area-list li").each(function(){
        if($(this).find("span").html()=="\u5e7f\u4e1c") {//广东
            $(this).find("span").click();
            $(".area-sub-placeholder span").each(function(){
                if($(this).find("a").html()=="\u6df1\u5733") { //深圳
                    $(this).find("a").click();
                    $(".area-panel-content").hide();
                }
            });
        }
    });
    sleep(4000).then(() => {
        var _ff=$(".cost-entries-type em").html();
        if(_ff!=undefined&&_ff!=null){
            $fare=parseFloat(_ff);
        }
		//休眠等运费
        //sku
        var price=0;
        var stock=0;
        if(iDetailData.sku==undefined){//基本款
            var dataRange=$("tbody tr.price").find("td:first").next().attr("data-range");
            if(undefined==dataRange){
                price=iDetailConfig.refPrice;
            }else{
                price=$.parseJSON(dataRange)["price"];
            }
            if(parseFloat(price)>0){
                data["slist[0].sstock"]=500;
                stock=500;
                data["slist[0].sprice"]=parseFloat(price)+parseFloat($fare);
                data["slist[0].scolor"]="\u57fa\u672c\u6b3e";
                data["slist[0].sname"]="\u57fa\u672c\u6b3e";
                data["slist[0].skuId"]=data["productid"];
            }else{
                alert("price is 0!")
                return false;
            }
        }else{
            var skuMap=iDetailData.sku.skuMap,skuProps=iDetailData.sku.skuProps;
            var colorArray=null,sizeArray=null;
            if(skuProps[0]!=undefined&&skuProps[0]["prop"]!=undefined){
                colorArray=skuProps[0].value;
            }
            if(skuProps[1]!=undefined&&skuProps[1]["prop"]!=undefined){
                sizeArray=skuProps[1].value;
            }
            var __index=0;
            for(var sku in skuMap){
                data["slist["+__index+"].sstock"]=skuMap[sku].canBookCount;
                stock=stock+skuMap[sku].canBookCount;
                data["slist["+__index+"].skuId"]=skuMap[sku].skuId;
                if(skuMap[sku].price==undefined){
                    data["slist["+__index+"].sprice"]=parseFloat(iDetailData.sku.price||iDetailData.sku.priceRange[0][1])+$fare;
                    price=parseFloat(iDetailData.sku.price||iDetailData.sku.priceRange[0][1]);
                }else{
                    data["slist["+__index+"].sprice"]=parseFloat(skuMap[sku].price)+$fare;
                    if(price<parseFloat(skuMap[sku].price)){
                        price=parseFloat(skuMap[sku].price);
                    }
                }
                if(colorArray!=null&&sizeArray!=null&&sku.indexOf("&gt;")==-1){
                    alert("color size and name separator do not correspond")
                    return false;
                }
                var $color,$size;
                if(sku.indexOf("&gt;")!=-1){
                    $color=sku.split("&gt;")[0];
                    $size=sku.split("&gt;")[1];
                }else{
                    $color=sku;
                }
                var name="";
                if(colorArray!=null)
                    for(var q in colorArray){
                        if(colorArray[q].name==$color||colorArray[q].name==$size){
                            data["slist["+__index+"].scolor"]=colorArray[q].name;
                            name+=colorArray[q].name+"-";
                            break;
                        }
                    }
                if(sizeArray!=null)
                    for(var q in sizeArray){
                        if(sizeArray[q].name==$size||sizeArray[q].name==$color){
                            data["slist["+__index+"].ssize"]=sizeArray[q].name;
                            name+=sizeArray[q].name+"-";
                            break;
                        }
                    }
                name=name.substring(0,name.length-1);
                data["slist["+__index+"].sname"]=name;
                __index++;
            }
        }
        if(parseFloat(price)==0){
            alert("price is 0!")
            return false;
        }
        data["stock"]=stock;
        data["cost"]=parseFloat(price)+parseFloat($fare);

        sendMessageToContentScriptByPostMessage("1688",data);
    });

}

function getTaobao(){ //完美
    var data={}
    data["id"]=GetQueryString("sssid");
    data["spider_date"]=GetQueryString("sssdate");
    data["urls"]=location.href;
    var outSale=document.getElementsByClassName("tb-off-sale");
    if(TB.SKU==undefined||
        (outSale.length>0&&outSale[0].getElementsByTagName("strong")[0].innerText.indexOf("\u4e0b\u67b6")!=-1)){
        //页面找不到下架
        data["stock"]=0;
        sendMessageToContentScriptByPostMessage("taobao",data);
        return false;
    }
	//sku
	var skuMap=TB.SKU.__attrVals.skuMap;//sku的信息，但是没有颜色和尺码
	var J_TMySizeProp=document.getElementsByClassName("J_TMySizeProp");
	var J_Prop_Color=document.getElementsByClassName("J_Prop_Color");
    var sku_size=document.getElementsByClassName("J_TSaleProp").length;
    var sizeLis=null,colorLis=null;
    if(sku_size==1){
        colorLis=document.getElementsByClassName("J_TSaleProp")[0].getElementsByTagName("li");
    }else if(sku_size>1){
        if(J_Prop_Color.length>0&&J_TMySizeProp.length>0) {//有颜色
            colorLis=document.getElementsByClassName("J_Prop_Color")[0].getElementsByTagName("li");
            sizeLis=document.getElementsByClassName("J_TMySizeProp")[0].getElementsByTagName("li");
        }else{
            colorLis=document.getElementsByClassName("J_TSaleProp")[0].getElementsByTagName("li");
            sizeLis=document.getElementsByClassName("J_TSaleProp")[1].getElementsByTagName("li");
        }
    }
    //选择物流地址
	var $fare=0;
    var city="\u6df1\u5733";
    var province="\u5e7f\u4e1c";
    var address=document.getElementById("J_WlAddressInfo").innerText;
    if(address.indexOf(city)==-1){
        document.getElementById("J_WlAddressInfo").click();
        document.getElementById("J-AddressAllTitle-province").click();
        var provinces=document.getElementById("J-AddressAllCon").getElementsByTagName("li");
        //省
        for(var p in provinces){
            if(provinces[p].innerText.indexOf(province)!=-1){
                provinces[p].click();
                break;
            }
        }
        //市
        var citys=document.getElementById("J-AddressAllCon").getElementsByTagName("li");
        for(var p in citys){
            if(citys[p].innerText.indexOf(city)!=-1){
                citys[p].click();
                break;
            }
        }
        //区
        document.getElementById("J-AddressAllCon").getElementsByTagName("li")[0].click();
    }
    var wl=document.getElementById("J_WlServiceTitle").innerText;
    if(wl.indexOf("\u514d\u8fd0\u8d39")==-1){//有快递费
        $fare=wl.replace("\u5feb\u9012","").replace("\u00a5","").trim();
    }
    var price=0;
    var skuMapC=false;
    for(var p in skuMap){
        if(skuMap[p].skuId!=undefined&&skuMap[p].skuId!=null){
            skuMapC=true;
            break;
        }
    }
	if(!skuMapC){//基本款
        price=g_config.price;
        if(parseFloat(price)>0){
            data["slist[0].sstock"]=500;
            data["slist[0].sprice"]=parseFloat(price)+parseFloat($fare);
            data["slist[0].scolor"]="\u57fa\u672c\u6b3e";
            data["slist[0].sname"]="\u57fa\u672c\u6b3e";
        }else{
            alert("price is 0!")
            return false;
        }
	}else{
        var __index=0;
        for(var sku in skuMap){
            data["slist["+__index+"].sstock"]=skuMap[sku].stock;
            data["slist["+__index+"].sprice"]=parseFloat(skuMap[sku].price)+parseFloat($fare);
            if(price<parseFloat(skuMap[sku].price)){
                price=skuMap[sku].price;
            }
            data["slist["+__index+"].skuId"]=skuMap[sku].skuId;
            var name="";
            if(colorLis!=null)
                for(var p in colorLis){
                    var property=colorLis[p].getAttribute("data-value"); //颜色对应编号
                    var colorValue=colorLis[p].getElementsByTagName("span")[0].innerText; //颜色名称
                    if(sku.indexOf(property)!=-1){
                        data["slist["+__index+"].scolor"]=colorValue;
                        name+=colorValue+"-";
                        break;
                    }
                }
            if(sizeLis!=null)
                for(var p in sizeLis){
                    var property=sizeLis[p].getAttribute("data-value"); //尺码对应编号
                    var sizeValue=sizeLis[p].getElementsByTagName("span")[0].innerText; //尺码名称
                    if(sku.indexOf(property)!=-1){
                        data["slist["+__index+"].ssize"]=sizeValue;
                        name+=sizeValue+"-";
                        break;
                    }
                }
            name=name.substring(0,name.length-1);
            data["slist["+__index+"].sname"]=name;
            __index++;
        }
	}
    data["stock"]=5000;
	data["cost"]=parseFloat(price)+parseFloat($fare);
    sendMessageToContentScriptByPostMessage("taobao",data);

}
function getTmall(){
	//获取抓取的所有信息，然后返回给content
	var data={}
	data["productid"]=g_config.itemId;
	data["urls"]=location.href;
    data["spider_url"]=location.href;
	data["description"]=desc;
    data["spider_name"]="tmall";


    data["productid"]=g_config.idata.item.id;
    data["title"]=g_config.idata.item.title;
    data["pictures"]=g_config.idata.item.auctionImages;

}

// 通过DOM事件发送消息给content-script
(function() {
    setTimeout(function(){
        var pname=GetQueryString("sssid");
        if(null!=pname&&undefined!=pname&&""!=pname){
            if(location.host == 'detail.1688.com'){
                get1688();
            }
            if(location.host == 'item.taobao.com'){
                getTaobao();
            }
        }
    },2000)
})();

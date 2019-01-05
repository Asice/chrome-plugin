document.addEventListener('DOMContentLoaded', function () {
  var backgroundPage = chrome.extension.getBackgroundPage(),
    switcher = document.querySelector("#switch"),
    header = document.querySelector("#header"),
    ipAddress = document.querySelector("#ip_address"),
    _ipAddress=document.getElementById("_ipAddress"),
   startInjecting = function (ipValue) {
	  if(ipValue==""){
		  backgroundPage.startInjecting(
			        "X-Forwarded-For",
			        ipAddress.options[ipAddress.selectedIndex].value,
			        "HTTP_CLIENT_IP",
			        ipAddress.options[ipAddress.selectedIndex].value); 
	  }else{
		  backgroundPage.startInjecting(
			        "X-Forwarded-For",ipValue,
			        "HTTP_CLIENT_IP",ipValue); 
	  }
    };
  if(backgroundPage.injecting) switcher.checked = true;
  header.selectedIndex = backgroundPage.headerIndex;
  ipAddress.selectedIndex = backgroundPage.ipAddressIndex;
  switcher.addEventListener("click", function (e) {
    if(switcher.checked) {
      startInjecting("");
    } else {
      backgroundPage.stopInjecting();
    }
  });
  ipAddress.addEventListener("change", function (e) {
    backgroundPage.ipAddressIndex = ipAddress.selectedIndex;
    if(switcher.checked) startInjecting("");
  });
  _ipAddress.addEventListener("blur", function (e) {
    if(switcher.checked) startInjecting(_ipAddress.value);
  });
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse)
	{
		//alert("Received request from Content Script to clear the cookies");
		console.log("1. Received request from Content Script to clear the cookies");
		if (request.cookieMethod == "clearCookie") {
			//alert("Executing request to clear cache in background script");
			console.log("2. Executing request to clear cache in background script");
			chrome.cookies.getAll( {}, function(cookies) {
			    for (var i in cookies) {
			      //alert(cookies[i]);
			      console.log(cookies[i]);
			      var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path;
  				  chrome.cookies.remove({"url": url, "name": cookies[i].name}, function(cook) {
  				  	console.log("Deleted Cookie name = " + cook.name + " ID = " + cook.storeId);
  				  });
			    }
			  });
			//sendResponse({status: "done-Cookie delete complete"});
			return true;
		}
		else {
		   alert("Unknown request received from content script");
		   console.log("Unknown request received from content script");
		   return true;
		}
	}
);

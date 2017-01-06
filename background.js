
(function(){
  chrome.tabs.onUpdated.addListener(function(tabId){
    chrome.pageAction.show(tabId);
  })
  chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.insertCSS(tab.id, { file:"style.css" });
    chrome.tabs.executeScript(null,{ file: "jquery-2.1.4.min.js"},
      function(){
        chrome.tabs.executeScript(null,{file: "script.js"});
      });
  });
})();

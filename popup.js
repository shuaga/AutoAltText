function f() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    activeTabId = activeTab.id;
    console.log(activeTab);
    chrome.tabs.sendMessage(activeTab.id, { "message": "get_all_images" });
  });
}
f();
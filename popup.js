var activeTabId;

function f() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    activeTabId = activeTab.id;
    console.log(activeTab);
    chrome.tabs.sendMessage(activeTab.id, { "message": "get_all_images" });
  });

  chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
      if (request.message === "take_all_images") {
        console.log("total: " + request.data.length);
        console.log(request.data);

        const getCaption = async (url) => {
          var result = await fetch('https://westus2.api.cognitive.microsoft.com/vision/v3.2/describe?maxCandidates=1', {
            method: 'POST',
            body: JSON.stringify({
              "url": url
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8', 'Ocp-Apim-Subscription-Key': "8c382a13dd044dd1a92a4ccb3f0310c9" // Hardcoded for prototyping
            }
          });
          return (await result.json()).description.captions[0].text;
        }

        urlToCaption = {};
        for(let i=0;i<request.data.length;i++) {
          let url = request.data[i];
          let caption = await getCaption(url);
          urlToCaption[url] = caption;
        }
        console.log(JSON.stringify(urlToCaption));
        chrome.tabs.sendMessage(activeTabId, { "message": "take_the_captions", "data": urlToCaption });
      }
    }
  );
}
f();

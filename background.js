var activeTabId;
var urlToCaption = {};

chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        activeTabId = tab.tabId;
    });
});


chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        // console.log(request.data);
        if (request.message === "take_all_images") {
            // console.log("total: " + request.data.length);
            // console.log(request.data);

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

            
            for (let i = 0; i < request.data.length; i++) {
                let url = request.data[i];
                if (!urlToCaption[url]) {
                    urlToCaption[url] = 'fetching';
                    let caption = await getCaption(url);
                    urlToCaption[url] = caption;
                    console.log(caption);
                }
            }
            // console.log(JSON.stringify(urlToCaption));
            chrome.tabs.sendMessage(activeTabId, { "message": "take_the_captions", "data": urlToCaption });
        }
    }
);

const imageFilter = (img) => {
    if ((img.alt == '' || img.alt.indexOf(' ') == -1) && img.width > 50 && img.height > 50) {
        return true;
    }
    return false;
}
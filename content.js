// content.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "get_all_images" ) {
      const allImages = [...document.images];
      const relevantImages = allImages.filter(img => {
        if(img.alt == '' && img.width > 50 && img.height > 50) {
          return true;
        }
        return false;
      });
      const urls = [];
      relevantImages.forEach(img => urls.push(img.src));
      chrome.runtime.sendMessage({"message": "take_all_images", "data": urls});
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "take_the_captions" ) {
      const allImages = [...document.images];
      const relevantImages = allImages.filter(img => {
        if(img.alt == '' && img.width > 50 && img.height > 50) {
          return true;
        }
        return false;
      });
      console.log(request.data);
      relevantImages.forEach(img => {
        img.alt = request.data[img.src];
      });
      alert("Done");
    }
  }
);

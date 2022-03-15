// content.js

function getAllImages() {
  const allImages = [...document.images];
    const relevantImages = allImages.filter(imageFilter);
    const urls = [];
    relevantImages.forEach(img => urls.push(img.src));
    chrome.runtime.sendMessage({"message": "take_all_images", "data": urls});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message === "get_all_images" ) {
    document.onscroll = getAllImages;
    getAllImages();
  }
});

function takeCaptions(request, sender, sendResponse) {
  if(request.message === "take_the_captions" ) {
    const allImages = [...document.images];
    const relevantImages = allImages.filter(imageFilter);
    console.log(request.data);
    relevantImages.forEach(img => {
      if(request.data[img.src] && request.data[img.src] != 'fetching') {
        img.alt = request.data[img.src];
        if (img.parentNode && img.parentNode.ariaLabel && img.parentNode.ariaLabel.toLowerCase() === 'image') {
          img.parentNode.ariaLabel += ': ' + request.data[img.src];
        }
      }
    });
    console.log("Done");
  }
}
chrome.runtime.onMessage.addListener(takeCaptions);

const imageFilter = (img) => {
  if((img.alt == '' || img.alt.indexOf(' ') == -1) && img.width > 50 && img.height > 50) {
    return true;
  }
  return false;
}
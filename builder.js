const { create } = require('xmlbuilder2');

function formatTime(n) {
  const seconds = n % 60;
  const minutes = Math.floor(n / 60) % 60;
  const hours = Math.floor(n / 3600);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

class AdsBuilder {
  constructor(title) {
    this.root = create({
      version: '1.0',
      encoding: 'UTF-8'
    }).ele("vmap:VMAP", {
      "xmlns:vmap": "http://www.iab.net/videosuite/vmap",
      "version": "1.0"
    });

    this.adSystemTitle = title;
  }

  addAdToVAST(ad) {
    const {
      duration,
      mediaFileUri,
      offset,
      title,
      mediaFileDelivery = "progressive",
      description = "",
      type = "video/mp4",
      breakId = "break-1",
      sourceId = "source-1",
      width = "1280",
      height = "720"
    } = ad;

    const adBreakElement = this.root.ele("vmap:AdBreak", {
      breakType: "linear",
      timeOffset: offset === 0 ? "start" : offset === duration ? "end" : formatTime(offset),
      breakId: breakId,
    });

    const adSourceElement = adBreakElement.ele("vmap:AdSource", {
      allowMultipleAds: true,
      followRedirects: true,
      id: sourceId,
    });

    const vastAdData = adSourceElement.ele("vmap:VASTAdData");

    const vastAdDoc = vastAdData.ele("VAST", {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:noNamespaceSchemaLocation': 'vast.xsd',
      version: '3.0'
    });

    const adElement = vastAdDoc.ele("Ad");
    const inline = adElement.ele("InLine");

    inline.ele("AdSystem").dat(this.adSystemTitle);
    inline.ele("AdTitle").dat(title);
    inline.ele("Description").dat(description);
    inline.ele("Impression").dat("http://example.com/impression");

    const creatives = inline.ele("Creatives");
    const creative = creatives.ele("Creative");

    const linear = creative.ele("Linear");
    linear.ele("Duration").dat(formatTime(duration));

    const mediaFiles = linear.ele("MediaFiles");
    mediaFiles.ele("MediaFile", {
      id: "1",
      delivery: mediaFileDelivery,
      type: type,
      bitrate: "1000",
      maintainAspectRatio: "1",
      codec: "0",
      scalable: "1",
      width: width,
      height: height
    }).dat(mediaFileUri);
  }

  get() {
    return this.root.end({ prettyPrint: true });
  }
}

module.exports = AdsBuilder;

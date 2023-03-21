const express = require('express');
const xmlbuilder = require('xmlbuilder');

const app = express();

app.get('/', (req, res) => {
  const xml = xmlbuilder.create('VAST', { version: '1.0', encoding: 'UTF-8' })
    .att('version', '4.0')
    .ele('Ad')
    .ele('InLine')
    .ele('AdSystem', 'Acme Ads')
    .up()
    .ele('AdTitle', 'Example VAST Ad')
    .up()
    .ele('Impression').cdata('https://example.com/impression').up()
    .ele('Creatives')
    .ele('Creative')
    .ele('Linear')
    .ele('Duration', '00:00:10').up()
    .ele('VideoClicks')
    .ele('ClickThrough').cdata('https://example.com/click').up()
    .up()
    .ele('MediaFiles')
    .ele('MediaFile')
    .att('type', 'video/mp4')
    .att('width', '640')
    .att('height', '360')
    .att('delivery', 'progressive')
    .att('bitrate', '1000')
    .cdata(`https://r3---sn-q4fl6nzy.gvt1.com/videoplayback/id/37685dc1cfc45f63/itag/106/source/dclk_video_ads/requiressl/yes/acao/yes/mime/video%2Fmp4/ctier/L/ip/0.0.0.0/ipbits/0/expire/1679400811/sparams/acao,ctier,expire,id,ip,ipbits,itag,mh,mime,mip,mm,mn,ms,mv,mvi,pl,requiressl,source/signature/58BA0D358A98DAC69521910CE9DED6B49257CAF1.20663062B1EA4F9025B631ED92EDF0281BB3B85A/key/cms1/cms_redirect/yes/mh/8O/mip/155.94.250.121/mm/28/mn/sn-q4fl6nzy/ms/nvh/mt/1679378132/mv/u/mvi/3/pl/20/file/file.mp4`)
    .up()
    .up()
    .ele('TrackingEvents')
    .ele('Tracking')
    .att('event', 'start')
    .cdata('https://example.com/start?offset=00:00:30')
    .up()
    .up()
    .up()
    .up()
    .up()
    .up()
    .up()
    .end({ pretty: true });

  res.set('Content-Type', 'text/xml');
  res.send(xml);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('La aplicación está corriendo en el puerto 3000!');
});

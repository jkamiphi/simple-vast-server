const express = require('express');
const xmlbuilder = require('xmlbuilder2');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/vast/:contentId', (req, res) => {
  const vast = xmlbuilder.create({
    version: '1.0',
    encoding: 'UTF-8'
  })
    .ele('VAST', {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:noNamespaceSchemaLocation': 'vast.xsd',
      version: '3.0'
    });

  const ad = vast.ele('Ad', {
    id: req.params.contentId,
    sequence: '1'
  });

  const inline = ad.ele('InLine');

  inline.ele('AdSystem', {version: '4.0'}).txt('simplevastserver-jkamiphi');
  inline.ele('AdTitle', {}).dat(`Ad for content ${req.params.contentId}`);
  inline.ele('Description').dat('This is sample companion ad tag with Linear ad tag.')
  inline.ele('Impression', { id: 'impression-1' }).dat('http://example.com/impression');
  inline.ele('Error').dat('http://example.com/error');

  const creatives = inline.ele('Creatives');

  const creative = creatives.ele('Creative', {
    id: req.params.contentId,
    sequence: '1'
  });

  const linear = creative.ele('Linear');
  linear.ele('Duration', {}).dat('00:00:16');

  const icons = linear.ele('Icons');
  const icon = icons.ele('Icon', {'height': 'auto', 'xPosition': 'right', 'yPosition': 'top'});
  icon.ele('StaticResource', {'creativeType': 'image/png'})
    .dat('https://development.palenquetv.com/images/icons/icon-128x128.png')

  const videoClicks = linear.ele('VideoClicks');

  videoClicks.ele('ClickTracking', {}).dat('https://iabtechlab.com');

  const mediaFiles = linear.ele('MediaFiles');
  
  mediaFiles
    .ele('MediaFile', {
      'id': '5241', 
      'type': 'video/mp4', 
      'bitrate': '500', 
      'delivery': 'progressive', 
      'maintainAspectRatio': '1',
      'codec': '0',
      'scalable': '1',
      'maxBitrate': '1000',
      'minBitrate': '360',
    })
    .dat('https://iab-publicfiles.s3.amazonaws.com/vast/VAST-4.0-Short-Intro.mp4');

  // other creative
  const creative2 = creatives.ele('Creative', {
    id: req.params.contentId + '2',
    sequence: '2'
  });

  const linear2 = creative2.ele('Linear', {'skipoffset': '00:00:15'});
  linear2.ele('Duration', {}).dat('00:00:56');

  const icons2 = linear2.ele('Icons');
  const icon2 = icons2.ele('Icon', {'height': 'auto', 'xPosition': 'right', 'yPosition': 'top'});
  icon2.ele('StaticResource', {'creativeType': 'image/png'})
    .dat('https://development.palenquetv.com/images/icons/icon-128x128.png')

  const videoClicks2 = linear2.ele('VideoClicks');

  videoClicks2.ele('ClickTracking', {}).dat('https://iabtechlab.com');

  const mediaFiles2 = linear2.ele('MediaFiles');
  
  mediaFiles2
    .ele('MediaFile', {
      'id': '5241', 
      'type': 'video/mp4', 
      'bitrate': '500', 
      'delivery': 'streaming', 
      'maintainAspectRatio': '1',
      'codec': '0',
      'scalable': '1',
      'maxBitrate': '1000',
      'minBitrate': '360',
    })
    .dat('https://stream.mux.com/oyqTzCWKNrMDHpMmCjUJRppmZbybuSPhNgchvCoL3Qk.m3u8');

  res.set('Content-Type', 'text/xml');
  res.send(vast.end({pretty: true}));
});

app.all("*", (req, res) => {
  res.status(404).json({ 
    message: "Ups! Parece que estás perdido, pero no te preocupes, ¡siempre puedes preguntarle a Siri! 🤖🗺️"
  });
});


app.listen(PORT, () => {
  console.log(`🚀 La aplicación está corriendo en el puerto ${PORT}!`);
});

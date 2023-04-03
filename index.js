const express = require('express');
const AdsBuilder = require('./builder');
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
  const builder = new AdsBuilder("simple-ads-server")

  builder.addAdToVAST({
    duration: 30,
    mediaFileUri: "https://stream.mux.com/8vbOjTwa23QoIXVt7aP78hSka1dniN5pLlATKO01pJzo.m3u8",
    mediaFileDelivery: "streaming",
    offset: 12,
    title: "Simple Ad",
    description: "Description",
    type: "application/x-mpegURL",
    breakId: "break-1",
    sourceId: "source-1"
  })

  res.set('Content-Type', 'text/xml');
  res.send(builder.get());
});

app.all("*", (req, res) => {
  res.status(404).json({ 
    message: "Ups! Parece que estás perdido, pero no te preocupes, ¡siempre puedes preguntarle a Siri! 🤖🗺️"
  });
});


app.listen(PORT, () => {
  console.log(`🚀 La aplicación está corriendo en el puerto ${PORT}!`);
});

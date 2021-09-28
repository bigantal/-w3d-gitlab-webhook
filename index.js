const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const https = require('https');

const app = express()
const port = process.env.PORT || 3000

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/commit', (req, res) => {
  console.log('req', req.body)
});

app.post('/merge-request', (req, res) => {

  const path = req.query.h;
  console.log('query param [h]:', path);
  console.log('req', req.body);

  const body = req.body;
  const oa = body.object_attributes;

  const toTeams = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": "0076D7",
    "summary": `Merge Request - ${body.project.name} #${oa.iid}`,
    "sections": [
      {
        "activityTitle": `Merge Request - ${body.project.name} #${oa.iid}`,
        "activitySubtitle": oa.title,
        "activityImage": body.project.avatar_url,
        "facts": [
          {
            "name": "Created by",
            "value": body.user.name
          },
          {
            "name": "Assigned to",
            "value": body.assignee.name
          },
          {
            "name": "Status",
            "value": oa.action
          }
        ],
        "markdown": true
      }
    ],
    "potentialAction": [
      {
        "@type": "OpenUri",
        "name": "Open",
        "targets": [
          {
            "os": "default",
            "uri": oa.url
          }
        ]
      }
    ]
  };

  sendToTeams(toTeams, path)

  res.send(toTeams)
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

function sendToTeams(msg, path) {
  console.log('sending to MSTeams', msg)
  const data = JSON.stringify(msg)

  const options = {
    hostname: 'verint.webhook.office.com',
    port: 443,
    path: "/" + path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

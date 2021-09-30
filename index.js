const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send({
    "available-endpoints": [
      "/commit",
      "/merge-request"
    ]
  })
});

app.post('/commit', (req, res) => {
  console.log('req', req.body)
  res.send('ok')
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
            "name": "Branch",
            "value": `${oa.source_branch} -> ${oa.target_branch}`
          },
          {
            "name": "Updated by",
            "value": body.user.name
          },
          {
            "name": "Assigned to",
            "value": (body.assignee ? body.assignee.name : 'Unassigned')
          },
          {
            "name": "Status",
            "value": `${oa.action} - ${oa.state}`
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
  axios
    .post('https://verint.webhook.office.com/' + path, msg)
    .then(res => {
      console.log(`statusCode: ${res.status}`)
    })
    .catch(error => {
      console.error(error)
    })
}

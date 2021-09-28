const express = require('express')
var favicon = require('serve-favicon')
var path = require('path')
var bodyParser = require('body-parser')
const https = require('https')



const app = express()
const port = process.env.PORT || 3000


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public','index.html'));
  });



  app.post('/merge', (req, res) => {
      console.log('req',req.body)
      const body=req.body;
const oa=body.object_attributes;

     var toTeams= {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": "Merge request event",
        "sections": [
            {
                "activityTitle": "Merge request event",
                "activitySubtitle": oa.title,
                "activityImage": body.user.avatar_url,
                "facts": [
                    {
                        "name": "Assigned to",
                        "value": oa.assignee.name
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
                "name": "Learn More",
                "targets": [
                    {
                        "os": "default",
                        "uri": oa.url
                    }
                ]
            }
        ]
    }

    sendToTeams(toTeams)


    res.send(toTeams)
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function sendToTeams(msg) {
  
    const data = JSON.stringify(msg)
    
    const options = {
      hostname: 'verint.webhook.office.com',
      port: 443,
      path: '/webhookb2/36683d48-1341-44b4-acd9-484549a79fe0@bb2ed304-4099-49cf-b081-cbb7a3a580ca/IncomingWebhook/b3f9c837c6ca4a23bab624a6cd61b9a3/a4dc01a0-8181-465e-be31-46a1ee71611d',
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
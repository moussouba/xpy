const bodyParser = require('body-parser')
const axios = require('axios');
const cors = require('cors')
const express = require('express')
const uid = require('uid');
const app = express()
const port = 3000

app.use(bodyParser());
app.use(cors({origin: "*"}))

app.get('/_health', (req, res) => {
  res.send('Working !')
})

app.get('/test', (req, res) => {
  const URL = 'https://jsonplaceholder.typicode.com/todos';

  axios
    .get(URL)
    .then(response => {
      return res.send(response)
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
})

app.post('/payment', async function(req, res){
  
  // verification

  // channel (MOBILE_MONEY ou CREDIT_CARD)
  // amount (number)
  // description (TEXT)


  let channel = "MOBILE_MONEY"
  let YOUR_TRANSACTION_ID = uid.uid()

  if(req.body.channel == "CREDIT_CARD") {
    channel = "CREDIT_CARD"
  }

  if(req.body.amount == null || req.body.amount == "") {
    return res.json({"message": "Montant invalid"})
  }

  const info = {
    "apikey": "3677770295ebc7438e3c550.18315623", 
    "site_id": "122542",
    "transaction_id": YOUR_TRANSACTION_ID,
    "amount": req.body.amount || 100,
    "currency": "USD",
    "alternative_currency": "",
    "description": req.body.description || "d",
    "lock_phone_number": true,
    "customer_phone_number": "+22585570811",
    "notify_url": "https://webhook.site/d1dbbb89-52c7-49af-a689-b3c412df820d",
    "return_url": "https://webhook.site/d1dbbb89-52c7-49af-a689-b3c412df820d",
    "channels": channel,
    //"metadata": "user1",
    "lang": "FR",
    // "invoice_data": {
    //   "Donnee1": "",
    //   "Donnee2": "",
    //   "Donnee3": ""
    // }
  }

  let data = info;
  //let data = JSON.stringify(info);

  let config = {
    method: 'post',
    url: 'https://api-checkout.cinetpay.com/v2/payment',
    // headers: { 
    //   'Content-Type': 'application/json'
    // },
    data : data
  };

  // res.json({
  //   "message": data
  // })

  axios(config)
  .then(function (response) {
    res.json(response.data.data.payment_url)
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    //console.log(error);
    res.json(error)
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey)

const express = require('express')
const app = express()
const stripe = require('stripe')(stripeSecretKey)


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('Client'))

app.post('/purchase', function(req, res){
  stripe.charges.create({
    amount: req.body.amount,
    source: req.body.stripeTokenId,
    currency: 'usd'
  }).then(function(){
    console.log("charge successful.")
  }).catch(function(){
    console.log("charge fail.")
    res.status(500).end()
  })
})

app.listen(3000)
const {onRequest} = require('firebase-functions/v2/https');

exports.createPaymentIntent = onRequest(
  {secrets: ['SECRET_NAME']},
  async (req, res) => {
    const stripe = require('stripe')(process.env.SECRET_NAME);

    try {
      const {amount} = req.body;
      const customer = await stripe.customers.create();

      if (!amount || isNaN(amount)) {
        return res.status(400).json({error: 'Invalid amount'});
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'mxn',
        customer: customer.id,
        automatic_payment_methods: {enabled: true, allow_redirects: 'never'},
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        customer: customer.id,
      });
    } catch (error) {
      console.error('Error creating PaymentIntent', error);
      res.status(500).json({error: 'Internal Server Error'});
    }
  },
);

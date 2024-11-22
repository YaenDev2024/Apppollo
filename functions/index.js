const {onRequest} = require('firebase-functions/v2/https');

exports.createPaymentIntent = onRequest(
  {secrets: ['SECRET_NAME']},
  async (req, res) => {
    const stripe = require('stripe')(process.env.SECRET_NAME);

    try {
      // Obtener la cantidad a pagar desde el cuerpo de la solicitud (por ejemplo, un pago de $20)
      const {amount} = req.body;
      const customer = await stripe.customers.create();
      // Asegúrate de que 'amount' sea un número válido en la respuesta
      if (!amount || isNaN(amount)) {
        return res.status(400).json({error: 'Invalid amount'});
      }

      // Crear un PaymentIntent en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // El monto en centavos (por ejemplo, $20 es 2000)
        currency: 'mxn',
        customer: customer.id,
        automatic_payment_methods: {enabled: true, allow_redirects: 'never'}, // Puedes cambiar la moneda si lo necesitas
      });

      // Devolver el client_secret de Stripe en la respuesta
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

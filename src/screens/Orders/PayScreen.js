import React, { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

function PaymentScreen() {
  const stripe = useStripe();
  const db = getFirestore();
  const functions = getFunctions();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Obtener PaymentIntent desde Cloud Function
      const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
      const { data } = await createPaymentIntent({ amount: 1000 }); // 10.00 USD

      // 2. Inicializar Payment Sheet
      const { error: paymentSheetError } = await stripe.initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: 'Mi Empresa'
      });

      if (paymentSheetError) {
        console.error('Error inicializando Payment Sheet', paymentSheetError);
        return;
      }

      // 3. Mostrar Payment Sheet
      const { error } = await stripe.presentPaymentSheet();

      if (error) {
        console.error('Pago fallido', error);
      } else {
        // 4. Guardar transacción en Firestore
        await addDoc(collection(db, 'payments'), {
          amount: 1000,
          date: new Date(),
          status: 'completed'
        });

        console.log('Pago exitoso');
      }
    } catch (error) {
      console.error('Error en el pago', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      title="Pagar" 
      onPress={handlePayment} 
      disabled={loading}
    />
  );
}
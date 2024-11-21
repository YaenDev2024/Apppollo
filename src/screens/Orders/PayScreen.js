import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native'; // Asegúrate de que tienes Stripe instalado y configurado
import { getFirestore } from 'firebase/firestore';

const PaymentScreen = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null); // Estado para los detalles de la tarjeta
  const [clientSecret, setClientSecret] = useState(null);

  // Función para crear el PaymentIntent en Firebase Functions
  const createPaymentIntent = async (amount) => {
    const response = await fetch('https://createpaymentintent-5fgjclrloq-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }), // Monto en centavos (por ejemplo, $20.00 -> 2000)
    });

    const data = await response.json();
    console.log('PaymentIntent client secret:', data);
    return data.clientSecret;
  };

  // Función que maneja el proceso de pago
  const handlePayment = async () => {
    setLoading(true);
  
    try {
      // Crear el PaymentIntent desde Firebase Functions (backend)
      const clientSecret = await createPaymentIntent(1000); // 2000 = $20.00
  
      // Crear el PaymentMethod usando los detalles de la tarjeta
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        paymentMethodType: 'Card', // Usar 'type' en lugar de 'paymentMethodType'
        card: cardDetails,
      });
      console.log('PaymentMethod:', paymentMethod.id);
  
      if (paymentMethodError) {
        console.error('PaymentMethod error:', paymentMethodError);
        Alert.alert('Error', 'Error al crear el método de pago.');
        return;
      }
  
      // Confirmar el pago con el clientSecret y el PaymentMethod
      console.log('PaymentclientSecretMethod:', clientSecret);
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodId: paymentMethod.id,
        
      });
      
      if (error) {
        console.error('Error al confirmar el pago:', error);
        Alert.alert('Error', error.localizedMessage || 'No se pudo confirmar el pago.');
        return;
      }
      
      console.log('Payment Intent:', paymentIntent);
  
      if (error) {
        console.error('Payment failed:', error);
        Alert.alert('Error', 'El pago no fue procesado.');
      } else {
        console.log('Payment successful:', paymentIntent);
        Alert.alert('Éxito', 'Pago realizado con éxito.');
      }
    } catch (err) {
      console.error('Error durante el proceso de pago:', err);
      Alert.alert('Error', 'Hubo un error durante el proceso de pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentCard}>
        <Text style={styles.title}>Pago de Servicio</Text>
        <Text style={styles.amount}>Total: $.50</Text>

        {/* Componente para capturar los detalles de la tarjeta */}
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={styles.cardStyle}
          style={styles.cardField}
          onCardChange={(cardDetails) => setCardDetails(cardDetails)}
        />

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}>
          <Text style={styles.payButtonText}>
            {loading ? 'Procesando...' : 'Pagar Ahora'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  paymentCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  amount: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  cardStyle: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: '#007bff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;

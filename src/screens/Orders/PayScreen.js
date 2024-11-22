import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const { createPaymentMethod, handleNextAction } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const createPaymentIntent = async (amount) => {
    try {
      const response = await fetch('https://createpaymentintent-5fgjclrloq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      return data.clientSecret; // Asumiendo que tu backend devuelve el client secret
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const handlePayPress = async () => {
    try {
      // Validar que la tarjeta tenga datos
      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Por favor, completa los datos de la tarjeta');
        return;
      }

      setLoading(true);

      // 1. Crear el Payment Intent
      const clientSecret = await createPaymentIntent(1000); // $10.00

      // 2. Confirmar el pago
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });

      if (paymentMethodError) {
        throw new Error(error.message);
      }

      // 3. Si se requiere autenticación adicional
      const { error: confirmError } = await handleNextAction(clientSecret);
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // 4. Pago exitoso
      Alert.alert(
        'Pago Exitoso',
        'El pago se ha procesado correctamente'
      );

    } catch (error) {
      console.error('Error en el pago:', error);
      Alert.alert(
        'Error en el Pago',
        error.message || 'Hubo un error al procesar el pago'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentCard}>
        <Text style={styles.title}>Realizar Pago</Text>
        <Text style={styles.amount}>Total: $10.00</Text>
        
        {/* Campo para la tarjeta */}
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: 'Número de tarjeta',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayPress}
          disabled={loading || !cardDetails?.complete}>
          <Text style={styles.payButtonText}>
            {loading ? 'Procesando...' : 'Pagar $10.00'}
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
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  amount: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 20,
  },
  payButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CardField, confirmPayment, useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

const PaymentScreen = () => {
  const { createPaymentMethod, handleNextAction } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const showError = (message) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
    });
  };
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
      if (!cardDetails?.complete) {
        showError('Por favor, completa los datos de la tarjeta');
        return;
      }
      setLoading(true);
      const clientSecret = await createPaymentIntent(1000);
  
      const { error: paymentMethodError, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });
  
      if (paymentMethodError) {
        showError('Error al crear el método de pago.');
        return;
      }
  
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodId: paymentMethod.id,
      });
  
      const errorMessages = {
        payment_intent_authentication_failure: 'Error de autenticación del pago.',
        payment_intent_payment_method_declined: 'Error al pagar, la tarjeta ha sido rechazada.',
        payment_intent_payment_method_unrecognized: 'Error al pagar, el método de pago no es reconocido.',
        payment_intent_payment_method_expired: 'Error al pagar, el método de pago ha expirado.',
        payment_intent_payment_method_unavailable: 'Error al pagar, el método de pago no está disponible.',
        payment_intent_payment_method_unsupported: 'Error al pagar, el método de pago no es soportado.',
        payment_intent_payment_method_unexpected: 'Error al pagar, el método de pago no es esperado.',
        payment_intent_payment_method_unexpected_error: 'Error al pagar, el método de pago ha producido un error inesperado.',
        payment_intent_payment_method_unexpected_status: 'Error al pagar, el método de pago tiene un estado inesperado.',
        payment_intent_payment_method_unexpected_type: 'Error al pagar, el método de pago tiene un tipo inesperado.',
        payment_intent_payment_method_unexpected_update: 'Error al pagar, el método de pago ha sido actualizado de manera inesperada.',
        payment_intent_payment_method_unexpected_validation: 'Error al pagar, el método de pago no ha sido validado correctamente.',
        payment_intent_payment_method_unexpected_verification: 'Error al pagar, el método de pago no ha sido verificado correctamente.',
        insufficient_funds: 'Error al pagar, no hay suficientes fondos en la cuenta.',
      };
      
      if (error) {
        const errorMessage = errorMessages[error.declineCode] || 'No se pudo confirmar el pago.';
        showError(errorMessage);
        return;
      }
      
  
      const { error: confirmError } = await handleNextAction(clientSecret);
  
      if (confirmError) {
        showError(confirmError.message);
        return;
      }
  
      Toast.show({
        type: 'success',
        text1: 'Pago Exitoso',
        text2: 'El pago se ha procesado correctamente',
      });
    } catch (error) {
      showError(error.message || 'Hubo un error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.paymentCard}>
        <Text style={styles.title}>Pago Seguro</Text>
        <Text style={styles.amount}>Total: $10.00</Text>

        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '1234 5678 9012 3456',
          }}
          cardStyle={{
            backgroundColor: '#F8F9FA',
            borderRadius: 8,
            textColor: '#495057',
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />

        <TouchableOpacity
          style={[
            styles.payButton,
            (loading || !cardDetails?.complete) && styles.payButtonDisabled,
          ]}
          onPress={handlePayPress}
          disabled={loading || !cardDetails?.complete}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Procesando...' : 'Pagar $10.00'}
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9ECEF',
    padding: 20,
  },
  paymentCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#343A40',
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  payButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  payButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { CardField, confirmPayment, useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import { Lock } from 'lucide-react-native';

const PaymentScreen = ({ amount = 1000, onSuccess, onError }) => {
  const { createPaymentMethod, handleNextAction } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const formatAmount = (amount) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
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

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de pagos');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('No se pudo iniciar el proceso de pago');
    }
  };

  const handlePayPress = async () => {
    if (!cardDetails?.complete) {
      showToast('error', 'Datos incompletos', 'Por favor, completa los datos de la tarjeta');
      return;
    }

    try {
      setLoading(true);
      
      // Create payment intent
      const clientSecret = await createPaymentIntent(amount);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
        billing_details: {
          email: 'customer@example.com', // Idealmente esto vendría como prop
        },
      });

      if (paymentMethodError) {
        throw new Error('Error al procesar la tarjeta');
      }

      // Confirm payment
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodId: paymentMethod.id,
      });

      if (error) {
        const errorMessages = {
          card_declined: 'La tarjeta fue rechazada. Por favor, intenta con otra tarjeta.',
          expired_card: 'La tarjeta ha expirado.',
          incorrect_cvc: 'El código de seguridad es incorrecto.',
          insufficient_funds: 'La tarjeta no tiene fondos suficientes.',
          processing_error: 'Error al procesar la tarjeta. Por favor, intenta de nuevo.',
          authentication_required: 'Se requiere autenticación adicional.',
        };

        throw new Error(errorMessages[error.code] || 'Error al procesar el pago');
      }

      // Handle 3D Secure if needed
      const { error: nextActionError } = await handleNextAction(clientSecret);
      
      if (nextActionError) {
        throw new Error('Error en la autenticación del pago');
      }

      showToast('success', 'Pago exitoso', 'Tu pago se ha procesado correctamente');
      onSuccess?.(paymentIntent);
      
    } catch (error) {
      showToast('error', 'Error', error.message || 'Hubo un error al procesar el pago');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.paymentWrapper}>
          <View style={styles.paymentCard}>
            <View style={styles.header}>
              <Lock size={24} color="#6B7280" />
              <Text style={styles.title}>Pago seguro</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total a pagar</Text>
              <Text style={styles.amount}>{formatAmount(amount)}</Text>
            </View>

            <View style={styles.cardContainer}>
              <Text style={styles.label}>Datos de la tarjeta</Text>
              <CardField
                postalCodeEnabled={false}
                placeholders={{
                  number: '4242 4242 4242 4242',
                  expirationDate: 'MM/AA',
                  cvc: 'CVC',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#1F2937',
                  fontSize: 16,
                  placeholderColor: '#9CA3AF',
                }}
                style={styles.cardField}
                onCardChange={setCardDetails}
              />
            </View>

            <TouchableOpacity
              style={[styles.payButton, loading && styles.payButtonDisabled]}
              onPress={handlePayPress}
              disabled={loading || !cardDetails?.complete}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.payButtonText}>
                  Pagar {formatAmount(amount)}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.secureText}>
                Pago procesado de forma segura por Stripe
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  paymentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  amountContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  cardContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  payButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  secureText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default PaymentScreen;
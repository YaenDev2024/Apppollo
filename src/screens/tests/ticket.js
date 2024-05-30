import React from 'react';
import { Alert, Share, View, Button } from 'react-native';

const ShareExample = () => {
  const onShare = async () => {
    try {
      const message = 'Hola, estoy usando la app Pollo Tragón. ¡Échale un vistazo!';
      const result = await Share.share({
        message: message,
        title: '¡Mira esta app genial!',
        // Si tienes un enlace a la app en la tienda de aplicaciones, puedes incluirlo aquí
        // url: 'https://example.com/app-download-link'
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType === 'com.whatsapp') {
          // El usuario compartió a través de WhatsApp
          // Aquí podrías agregar una lógica adicional si lo deseas
        }
      } else if (result.action === Share.dismissedAction) {
        // El usuario cerró el cuadro de diálogo de compartir
        // Aquí podrías manejarlo si lo deseas
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Button onPress={onShare} title="Compartir en WhatsApp" />
    </View>
  );
};

export default ShareExample;

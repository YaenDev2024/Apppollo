import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icons from '../../components/Icons';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};

// Componente individual para cada card
const CardItem = ({item, isFirst, isLast}) => {
  const cardStyle = {
    ...styles.card,
    borderTopLeftRadius: isFirst ? 16 : 0,
    borderTopRightRadius: isFirst ? 16 : 0,
    borderBottomLeftRadius: isLast ? 16 : 0,
    borderBottomRightRadius: isLast ? 16 : 0,
  };

  return (
    <TouchableOpacity style={cardStyle} onPress={item.onPress}>
      <View style={styles.containerContentCard}>
        <View style={styles.iconContainer}>
          <View style={styles.iconSquare}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
        <Icons name="arrow-right" sizes={25} color={COLORS.dark} />
      </View>
    </TouchableOpacity>
  );
};

// Componente para el grupo de cards
const ConfigCard = ({items}) => (
  <View style={styles.cardsContainer}>
    {items.map((item, index) => (
      <CardItem
        key={item.id}
        item={item}
        isFirst={index === 0}
        isLast={index === items.length - 1}
      />
    ))}
  </View>
);

// Componente para el encabezado
const Header = ({onBack, title}) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const UserConfig = () => {
  const navigation = useNavigation();

  const accountSection = [
    {
      id: '1',
      icon: '👤',
      title: 'Información Personal',
      subtitle: 'Nombre, email, teléfono',
      onPress: () => navigation.navigate('ConfigInfoPersonal'),
    },
    {
      id: '2',
      icon: '🔒',
      title: 'Seguridad',
      subtitle: 'Contraseña, autenticación',
      onPress: () => navigation.navigate('Security'),
    },
  ];

  const pagosSection = [
    {
      id: '1',
      icon: '💳',
      title: 'Métodos de Pago',
      subtitle: 'Tarjetas, PayPal',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: '2',
      icon: '📄',
      title: 'Historial de Compras',
      subtitle: 'Pedidos, facturas',
      onPress: () => navigation.navigate('PurchaseHistory'),
    },
  ];

  const preferencesSection = [
    {
        id: '3',
        icon: '🔔',
        title: 'Notificaciones',
        subtitle: 'Promociones, ofertas',
        onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: '4',
      icon: '⚙️',
      title: 'Publicidad',
      subtitle: 'Activar, desactivar, personalizar',
      onPress: () => navigation.navigate('GeneralSettings'),
    },
  ];

  const direccionesSection = [
    {
      id: '6',
      icon: '📍',
      title: 'Direcciones de Entrega',
      subtitle: 'Casa, trabajo, otros',
      onPress: () => navigation.navigate('Addresses'),
    },
  ];

    const ayudaSection = [
    {
      id: '7',
      icon: '❓',
      title: 'Preguntas Frecuentes',
      subtitle: 'Ayuda, soporte',
      onPress: () => navigation.navigate('FAQ'),
    },
    {
      id: '8',
      icon: '📞',
      title: 'Contacto',
      subtitle: 'Email, teléfono',
      onPress: () => navigation.navigate('Contact'),
    },
    ];

  return (
    <View style={styles.container}>
      <Header onBack={() => navigation.goBack()} title="Configuración" />

      <ScrollView style={styles.content}>
        {/* cuenta */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <ConfigCard items={accountSection} />
        {/* pagos */}
        <Text style={styles.sectionTitle}>Pagos</Text>
        <ConfigCard items={pagosSection} />
        {/* direcciones */}
        <Text style={styles.sectionTitle}>Direcciones</Text>
        <ConfigCard items={direccionesSection} />
        {/* preferencias */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        <ConfigCard items={preferencesSection} />
        {/* ayuda */}
        <Text style={styles.sectionTitle}>Ayuda</Text>
        <ConfigCard items={ayudaSection} />
      </ScrollView>
      <BannerAd
          unitId="ca-app-pub-3477493054350988/1457774401"
          size={BannerAdSize.ADAPTIVE_BANNER}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 5,
    backgroundColor: COLORS.background,
  },
  backButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkSecondary,
    marginBottom: 16,
    marginTop: 24,
  },
  cardsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 5,
  },
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  containerContentCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  iconSquare: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserConfig;

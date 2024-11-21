import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {auth, db} from '../../../config';
import {collection, query, where, getDocs} from 'firebase/firestore';

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
  gray: '#F5F5F5',
  lightGray: '#E0E0E0',
};

const ConfigInfoPersonal = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', user.email),
        );

        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const data = userDoc.data();

          setUserData({
            name: user.displayName || '',
            email: data.mail || '',
            phone: user.phoneNumber || '',
            profileImage: user.photoURL || null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.btnContainer}>
          {/* BOTONES */}
          <TouchableOpacity
            style={styles.btnrounded}
            onPress={() => navigation.goBack()}>
            <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              marginTop: 10,
              fontWeight: 'bold',
              color: COLORS.dark,
            }}>
            Información Personal
          </Text>
        </View>
        <View style={styles.profileImageContainer}>
          {userData.profileImage ? (
            <Image
              source={{uri: userData.profileImage}}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Icons name="user" sizes={50} color={COLORS.lightGray} />
            </View>
          )}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={userData.name}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={userData.email}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={userData.phone}
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
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
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 60,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.darkSecondary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.darkSecondary,
  },
  
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  btnrounded: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 90,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
});

export default ConfigInfoPersonal;

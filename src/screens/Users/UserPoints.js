import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Dimensions} from 'react-native';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';
import {auth, db} from '../../../config';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

const {width} = Dimensions.get('window');

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
  cardBackground: '#F5F5F5',
  gradientStart: '#FFD23F',
  gradientEnd: '#FFC107',
};

const UserPoints = () => {
  const navigation = useNavigation();
  const [listPoints, setListCombosFav] = useState([]);

  useEffect(() => {
    const getlistPoints = async () => {
      try {
        const signedInUser = auth.currentUser;
        if (!signedInUser) {
          console.log('No user signed in');
          return;
        }

        const userQuery = query(
          collection(db, 'users'),
          where('mail', '==', signedInUser.email),
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const pointsQuery = query(
            collection(db, 'points'),
            where('iduser', '==', userDoc.id),
          );

          const unsubscribe = onSnapshot(pointsQuery, snapshot => {
            const pointsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            setListCombosFav(pointsList);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    getlistPoints();
  }, []); 

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnrounded}
          onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={25} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Puntos</Text>
      </View>

      <View style={styles.contentContainer}>
        {listPoints.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Historial de Puntos</Text>
            {listPoints.map((item, index) => (
              <View key={item.id} style={styles.cardPointsWin}>
                <View style={styles.cardContent}>
                  <Image
                    source={require('../../../Assets/coin-pt.png')}
                    style={styles.coinIcon}
                  />
                  <View style={styles.pointsTextContainer}>
                    <Text style={styles.pointsTitle}>Puntos Ganados</Text>
                    <Text style={styles.pointsDescription}>
                      Por tu compra reciente
                    </Text>
                  </View>
                  <Text style={styles.pointsAmount}>+ {item.points}</Text>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.emptyStateText}>No tienes Puntos disponibles</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: COLORS.background,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.dark,
    marginBottom: 15,
    fontWeight: '600',
  },
  cardPointsWin: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  coinIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  pointsTextContainer: {
    flex: 1,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  pointsDescription: {
    fontSize: 14,
    color: COLORS.darkSecondary,
  },
  pointsAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.dark,
    marginTop: 20,
  },
});

export default UserPoints;
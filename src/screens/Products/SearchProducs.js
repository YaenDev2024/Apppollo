import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchInput from '../../components/SearchInput';
import Icons from '../../components/Icons';
import {useNavigation} from '@react-navigation/native';
import {BannerAd, BannerAdSize} from '@react-native-admob/admob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {db} from '../../../config';

const COLORS = {
  dark: 'black',
  darkSecondary: '#4A311F',
  primary: '#FFD23F',
  primaryLight: '#FFE584',
  accent: '#FF6B6B',
  background: 'white',
};

const SEARCH_HISTORY = '@search_history';
const MAX_SEARCH_HISTORY = 5;

const SearchProducs = () => {
  const navigation = useNavigation();
  const [listRecent, setListRecent] = useState([]);
  const [listMain, setListMain] = useState([]);
  const [SearchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const [ListSearch, setListSearch] = useState([]);
  const [listfilter, setListFilter] = useState([]);

  const saveSearch = async (search,item) => {
    try {
      if (!search.trim()) return;
      const newHistory = [
        search,
        ...listRecent.filter(item => item !== search),
      ].slice(0, MAX_SEARCH_HISTORY);
      setListRecent(newHistory);
      await AsyncStorage.setItem(SEARCH_HISTORY, JSON.stringify(newHistory));
    } catch (error) {}
  };

  const handleSearch = async (item) => {
    await saveSearch(SearchText, item);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          width: '100%',
          marginLeft: 14,
        }}
        onPress={() => {
          setSearchText(item);
          handleSearch();
        }}>
        <Text>
          <Icons name={'back-in-time'} sizes={16} /> {item}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderItemList = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          width: '100%',
          marginLeft: 14,
        }}
        onPress={() => {
          setSearchText(item.nameCombo);
          handleSearch(item);
          navigation.navigate('ProductDescBuy', {
            product: item,
          });
        }}>
        <Text>
          <Icons name={'search'} sizes={16} /> {item.nameCombo}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const searchHistory = await AsyncStorage.getItem(SEARCH_HISTORY);
        if (searchHistory) {
          setListRecent(JSON.parse(searchHistory));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSearchHistory();
  }, []);

  const handleSerachfilter = text => {
    setSearchText(text);
    const filter = ListSearch.filter(item => {
      const itemData = item.nameCombo
        ? item.nameCombo.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setListFilter(filter);


  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const comboTrendQuery = query(collection(db, 'comboTrend'));
        const unsubscribe = onSnapshot(comboTrendQuery, async querySnapshot => {
          const comboTrendDocs = [];
          querySnapshot.forEach(doc => {
            comboTrendDocs.push({id: doc.id, ...doc.data()});
          });
          const comboIds = comboTrendDocs.map(item => item.idcombo);
          if (comboIds.length > 0) {
            const comboQuery = query(collection(db, 'combo'));
            const comboSnapshot = await getDocs(comboQuery);
            const comboDocs = [];
            const comboToList = [];
            comboSnapshot.forEach(doc => {
              if (comboIds.includes(doc.id)) {
                comboDocs.push({id: doc.id, ...doc.data()});
              }
              if (doc.data().nameCombo !== 'Coming soon') {
                comboToList.push({id: doc.id, ...doc.data()});
              }
            });
            setListSearch(comboToList);
            setListMain(comboDocs);
          } else {
            setListMain([]);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerSearchBar}>
        {/* search bar */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons name="arrow-left" sizes={21} />
        </TouchableOpacity>

        <View style={styles.containerInput}>
          <Icons
            name="search"
            sizes={20}
            color="#000"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Buscar productos..."
            value={SearchText}
            style={styles.input}
            onChangeText={handleSerachfilter}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
      {SearchText.length > 0 && 
      <View>
        <Text style={styles.titleSearch}>Resultados de la busqueda</Text>
        <View style={styles.containerSearchRecent}>
          {/* <Text style={styles.titleMainSearch}> Combo cuernuda y 2 cervezas</Text> */}
          <FlatList
            data={listfilter}
            renderItem={renderItemList}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
}
      <View>
        <Text style={styles.titleSearch}>Busquedas Recientes</Text>
        <View style={styles.containerSearchRecent}>
          {/* <Text style={styles.titleMainSearch}> Combo cuernuda y 2 cervezas</Text> */}
          <FlatList
            data={listRecent}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View>
        <Text style={styles.titleSearch}>Busquedas Principales</Text>
        <View style={styles.containerSearchRecent}>
          {/* <Text style={styles.titleMainSearch}> Combo cuernuda y 2 cervezas</Text> */}
          <View style={styles.containerListRecent}>
            {listMain.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  navigation.navigate('ProductDescBuy', {
                    product: item,
                  });
                }}
                style={styles.containerlistRecnet}>
                <Text key={item.id} style={styles.titleMainSearch}>
                  🔥 {item.nameCombo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.titleSearch}>Te podría interesar</Text>
        <View style={styles.containerAds}>
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
          <BannerAd
            unitId="ca-app-pub-3477493054350988/1457774401"
            size={BannerAdSize.ADAPTIVE_BANNER}
          />
          <Text>
            Esta seccion nos ayuda a darte un mejor servicio. Gracias.
          </Text>
        </View>
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
  containerSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleSearch: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 20,
    color: 'black',
    marginBottom: 10,
  },
  containerSearchRecent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  titleMainSearch: {
    fontSize: 16,
    marginVertical: 0,
    marginHorizontal: 10,
    color: 'gray',
    fontWeight: 'bold',
    padding: 10,
  },
  containerListRecent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  containerlistRecnet: {
    margin: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    width: '100%',
  },
  containerAds: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
    padding: 5, // Añadido para hacer el área tocable más grande
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },
});

export default SearchProducs;

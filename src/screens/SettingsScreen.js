import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ImageBackground, StatusBar, View } from 'react-native';
import { StyleSheet, Text } from 'react-native'
import { NavBar } from '../components/NavBar';
import { ScrollView } from 'react-native';
import { BannerAd, BannerAdSize } from '@react-native-admob/admob';

const SettingsScreen = () => {
    const [time, setTime] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setTime(false);
        }, 1000);
    }, [time]);
    return (
        <View style={styles.root}>
            <ImageBackground
                source={require('../../Assets/fondo.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
                imageStyle={{ opacity: 0.08 }}>
                <StatusBar backgroundColor={'transparent'} barStyle="light-content" />
                <NavBar name={'Ajustes'} />
                {time ? (
                    <ActivityIndicator size="large" color="black" />
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.container}>
                            <BannerAd
                                unitId="ca-app-pub-3477493054350988/1457774401"
                                size={BannerAdSize.ADAPTIVE_BANNER}
                            />
                            <View style={styles.menuContainer}>
                                {/* {renderMenuOptions()} */}
                            </View>
                        </View>
                        <BannerAd
                            unitId="ca-app-pub-3477493054350988/1457774401"
                            size={BannerAdSize.ADAPTIVE_BANNER}
                        />
                    </ScrollView>
                )}
            </ImageBackground>
        </View>
    )
}



const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    menuContainer: {
        width: '100%',
        marginVertical: 20,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    navbar: {
        width: '100%',
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        elevation: 4, // Añade sombra en Android
        shadowColor: '#000', // Añade sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
export default SettingsScreen
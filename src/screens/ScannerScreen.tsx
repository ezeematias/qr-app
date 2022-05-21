import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground, Button } from 'react-native';
import { RootStackParamList } from '../../App';
import { auth } from "../database/firebase";
import styles from '../styles/Style';
import QRCode from 'react-native-qrcode-svg';
import { IQRCodeProps } from '../library/IQRCodeProps';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScannerScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const payload: IQRCodeProps = { name: 'Hola', number: '123456789' }



    async function handlerSingOut() {
        await auth
            .signOut()
            .then(() => { navigation.replace('Home') })
            .catch((error: any) => alert(error.message))
    }


    return (
        <ImageBackground source={require('../../assets/background.jpg')} resizeMode="repeat" style={styles.image}>

            <View style={styles.container}>

                <Text style={styles.textHome}>¡Bienvenido!</Text>
                <Text style={styles.textDescription}>Escanemos es QR</Text>

                <QRCode value={JSON.stringify(payload)} size={200} />

                <View style={styles.buttonContainer} >
                    <TouchableOpacity
                        
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Escanear</Text>
                    </TouchableOpacity>
                </View>
                <Image
                    source={require('../assets/qr.png')}
                    resizeMode="contain"
                    style={styles.logoHome}
                />
            </View>
        </ImageBackground>
    );
}
export default ScannerScreen;

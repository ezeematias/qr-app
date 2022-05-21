import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';

import { RootStackParamList } from '../../App';
import { auth, db } from "../database/firebase";
import styles from '../styles/Style';
import * as app from '../screens/LoginScreen';

type User = {
    q10: number,
    q50: number,
    q100: number,
    admin: boolean,
    salary: number,
}

const HomeScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    let admin = app.admin;

    const [loading, setLoading] = useState(true);
    const [scanData, setScanData] = useState<string>("");
    const [permission, setPermission] = useState(true);
    const [goScanner, setGoScanner] = useState(false);  
    const [message, setMessage] = useState("");
 
    const email = auth?.currentUser?.email || "";    
    
    const [user, setUser] = useState<User>({ q10: 0, q50: 0, q100: 0, admin: admin, salary: 0});
    
    useEffect(() => {
        setLoading(true);
        requestCameraPermission();
        getDocUser();
    }, []);

    const settingSalary = (item: number) =>{
        console.log("settingSalary", item);
        if (item === 10) {
           user.q10 === 0 || admin && user.q10 < 2 ? setUser(() => ({ ...user, q10: user.q10 + 1, salary: user.salary + item })) : setMessageError("Ya se utilizó este código");
        }

        if (item === 50) {
          user.q50 === 0 || admin && user.q50 < 2 ? setUser(() => ({ ...user, q50: user.q50 + 1, salary: user.salary + item })) : setMessageError("Ya se utilizó este código");
        }

        if (item === 100) {
            user.q100 === 0 || admin && user.q100 < 2 ? setUser(() => ({ ...user, q100: user.q100 + 1, salary: user.salary + item })) : setMessageError("Ya se utilizó este código");
        }        
    }

    const setDocument = () => {
        setDoc(doc(db, "qr", email), user).catch((error: any) => alert(error.message)).finally(() => { });
    }
    const handlerReset = () => {
        setUser(() => ({ q10: 0, q50: 0, q100: 0, admin: false, salary: 0 }));       
    }

    const getDocUser = async () => {
        const docRef = doc(db, "qr", email);
        const docSnap: any = await getDoc(docRef);
        setUser({
            admin: docSnap.data().admin,
            q10: docSnap.data().q10,
            q50: docSnap.data().q50,
            q100: docSnap.data().q100,
            salary: docSnap.data().salary
        })
    }

    const setMessageError = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 3000);
    }

    async function handlerSingOut() {
        await auth
            .signOut()
            .then(() => { navigation.replace('Index') , setDocument();})
            .catch((error: any) => alert(error.message))
    }

    const requestCameraPermission = async () => {
        try {
            const { status, granted } = await BarCodeScanner.requestPermissionsAsync();
            console.log(`Starus: ${status}, Granted: ${granted}`);

            if (status === 'granted') {
                console.log('Permission granted');
                setPermission(true);
            } else {
                setPermission(false);
            }

        } catch (error) {
            console.log(error);
            setPermission(false);
        } finally {
            setLoading(false);
        }

    };

    if (loading) {
        return (
            <View>
                <Text>Requestin permission...</Text>
            </View>
        );
    }

    if (scanData) {
        switch (scanData) {
            case "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172":
                settingSalary(50);
                break;
            case '8c95def646b6127282ed50454b73240300dccabc':
                settingSalary(10);
                break;
            case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
                settingSalary(100);
                break;
            default:                
                setMessageError('Código QR inválido');
                break;
        }
        setScanData("");
        setGoScanner(false);
    }

    if (goScanner) {
        return (
            <BarCodeScanner
                style={[styles.container]}
                onBarCodeScanned={({ data }) => {
                    try {  
                        setScanData(data.trim());
                    } catch (error) {
                        console.log('Error: ', error);
                    }
                }}
            >
                <View style={styles.qrArea}></View>
            </BarCodeScanner>
        )
    }

    if (permission) {
        return (
            <ImageBackground source={require('../../assets/background.jpg')} resizeMode="repeat" style={styles.image}>
                {loading && <View style={styles.spinContainer}>
                    <Spinner
                        visible={loading}
                        textStyle={styles.spinnerTextStyle}
                    />
                </View>}
                <View style={styles.container}>            

                    <Text style={styles.textTitleHome}>¡Hola {auth?.currentUser?.displayName}!</Text>
                    <Text style={styles.textTitleHome}>Tu saldo disponible es:</Text>
                    <Text style={styles.textHome}>${user.salary}</Text>
                    <View style={styles.buttonContainer} >
                {!!message ? <TouchableOpacity
                        style={styles.buttonError}
                        onPress={() => setMessage("")}
                    >
                        <Text style={styles.buttonText}>{message}</Text>
                    </TouchableOpacity> : null}
                        <TouchableOpacity
                            onPress={() => setGoScanner(true)}
                            style={styles.buttonHome}
                        >
                            <Text style={styles.buttonText}>Escanear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handlerSingOut()}
                            style={[styles.buttonHome, styles.buttonOutlinehome]}
                        >
                            <Text style={styles.buttonOutlineText}>Salir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handlerReset()}
                            style={styles.buttonHome}
                        >
                            <Text style={styles.buttonText}>Restaurar Salario</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require('../assets/qr.png')}
                        resizeMode="contain"
                        style={styles.logoHome}
                    />
                </View>
            </ImageBackground>
        )
    }
    return (null)
}
export default HomeScreen;

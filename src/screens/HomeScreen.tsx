import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RootStackParamList } from '../../App';
import { auth, db } from "../database/firebase";
import styles from '../styles/Style';

type User = {
    q10: number,
    q50: number,
    q100: number,
    admin: boolean,
    salary: number,
}

const HomeScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [loading, setLoading] = useState(true);
    const [scanData, setScanData] = useState<string>("");
    const [permission, setPermission] = useState(true);
    const [goScanner, setGoScanner] = useState(false);
    const [salary, setSalary] = useState<number>(0);
    const [message, setMessage] = useState("");
    const [q10, setQ10] = useState<number| undefined>();
    const [q50, setQ50] = useState<number| undefined>();
    const [q100, setQ100] = useState<number | undefined>();
    const [admin, setAdmin] = useState(false);
    const email = auth?.currentUser?.email || "";

    const [user, setUser] = useState<User>({ q10: 0, q50: 0, q100: 0, admin: false, salary: 0});
    
    useEffect(() => {
        setLoading(true);
        requestCameraPermission();
        //getDocUser().then(() => { }).catch(() => {}).finally(() => { setLoading(false) });
        //getDocUser().then(() => { }).catch(() => { setDoc(doc(db, "qr", email), user).catch((error: any) => alert(error.message)).finally(() => { });}).finally(() => { setLoading(false) });
    }, []);

    function settingSalary(item: number) {
        console.log("settingSalary", item);
        if (item === 10) {
           // user.q10 === 0 || user.admin && user.q10 < 2 ? setUser(() => ({ ...user, q10: user.q10 + 1, salary: user.salary + item })) : console.log("NOOOOO"), setMessage("Ya se utilizó este código");
           console.log(q10);
           console.log(salary);
           setQ10(1);
           setSalary(item);
           console.log("ENTREEEEEEEEEE");
           console.log(q10);
           console.log(salary);
        }

        if (item === 50) {
            user.q50 === 0 || user.admin && user.q50 < 2 ? setUser(() => ({ ...user, q50: user.q50 + 1, salary: user.salary + item })) : setMessage("Ya se utilizó este código");

        }

        if (item === 100) {
            user.q100 === 0 || user.admin && user.q100 < 2 ? setUser(() => ({ ...user, q100: user.q100 + 1, salary: user.salary + item })) : setMessage("Ya se utilizó este código");

        }
        setUser({ q10: q10, q50: q50, q100: q100, admin: admin, salary: salary });
        console.log("Q10 " + user.q10 + "| Q50 " + user.q50 + "| Q100 " + user.q100 + "| Salary " + user.salary);
        setDocument();
    }

    const charge = () => {
        const user = {
            q10: q10,
            q50: q50,
            q100: q100,
            admin: admin,
            salary: salary
        }
        return user;
    }

    const setDocument = () => {
        setDoc(doc(db, "qr", email), charge()).catch((error: any) => alert(error.message)).finally(() => { });
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

    async function handlerSingOut() {
        await auth
            .signOut()
            .then(() => { navigation.replace('Index') })
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
                //setSalary(99999);
                //serMessageError('Código QR inválido');
                break;
        }
        setScanData("");
        setGoScanner(false);
    }

    if (goScanner) {
        return (
            <BarCodeScanner
                style={[styles.container]}
                onBarCodeScanned={({ type, data }) => {
                    try {
                        console.log("L-" + data);
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

                    <Text style={styles.textHome}>¡Bienvenido!</Text>
                    {/* <Text style={styles.textDescription}>Escanemos es QR</Text> */}
                    <Text style={styles.buttonOutlineTextRole}>Tu saldo es</Text>
                    {/* <Text style={styles.textHome}>{user.salary}</Text> */}
                    <Text style={styles.textHome}>{salary}</Text>

                    <View style={styles.buttonContainer} >
                        <TouchableOpacity
                            onPress={() => setGoScanner(true)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Escanear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handlerSingOut()}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Salir</Text>
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

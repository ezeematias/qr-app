import { StyleSheet } from "react-native";

const primaryColor = '#ffffff';
const secondaryColor = '#3176bb';
const tertiaryColor = '#b9b9b9';
const fourthColor = '#3176bb';
const buttonBorderRadius = 30;

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '40%',
    },
    logoHome: {
        width: '100%',
        height: '20%',
        marginTop: '10%',
    },
    inputContainer: {
        width: '80%',
        marginTop: 10,
    },
    input: {
        backgroundColor: primaryColor,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: buttonBorderRadius,
        borderBottomColor: fourthColor,
        borderBottomWidth: 2,
        marginTop: '5%',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%',
    },
    button: {
        backgroundColor: tertiaryColor,
        width: '80%',
        padding: 40,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
        marginBottom: '8%',
    },
    buttonRole: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 5,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonError: {
        backgroundColor: secondaryColor,
        width: '100%',
        padding: 15,
        borderRadius: buttonBorderRadius,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: primaryColor,
        marginTop: 5,
        borderColor: fourthColor,
        borderWidth: 10,
    },
    buttonOutlineRole: {
        backgroundColor: secondaryColor,
        marginTop: 5,
        borderColor: secondaryColor,
        borderWidth: 2,
    },
    buttonText: {
        color: primaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: fourthColor,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineTextRole: {
        color: primaryColor,
        fontWeight: '700',
        fontSize: 16,
    },
    spinnerTextStyle: {
        color: 'white',
    },
    spinContainer: {
        position: 'absolute',
        display: 'flex',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 100,
    },
    textHome:{
        fontSize: 60,
        marginTop: 40, 
        color: secondaryColor,
        fontWeight: 'bold',        
    },
    textDescription:{
        fontSize: 20,
        marginTop: '10%', 
        color: secondaryColor,
        fontWeight: 'bold',  
        textAlign: 'center',
        margin: 5,
    },   

    
})
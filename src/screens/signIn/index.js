import { Image, StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import CustomInput from '../../components/inputs/customInput'
import ChekBox from '../../components/checkbox'
import AuthButton from '../../components/buttons/authButton'
import { SCREEN } from '../../enums/AppEnums'
import { showFlash } from '../../utils/MyUtils'
import {
    LoginemailAuth,
    getAllOfCollectionwhere,
} from '../../services/firebaseServices'



const SignIn = ({ navigation }) => {
    const [checked, setchecked] = useState(false)
    const [email, setemail] = useState('');
    const [isEmailValid, setisEmailValid] = useState(true);
    const [password, setpassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    /**
    * Email validation
    */

    const handleEmail = text => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setemail(text);
        if (emailRegex.test(text)) {
            setisEmailValid(true);
        } else {
            setisEmailValid(false);
        }
    };

    const loginUser = async () => {

        if (email == '') {
            showFlash('Please enter email')
            return
        }

        if (!isEmailValid) {
            showFlash('Please enter correct email')
            return
        }

        if (password == '') {
            showFlash('Please enter password')
            return
        }

        if (!checked) {
            showFlash('Please agree with our T&C')
            return
        }

        setIsLoading(true);

        let value = await LoginemailAuth(email, password, getUserData, setIsLoading);
        console.log(value);

    }

    const getUserData = async () => {
        let data = [];
        data = await getAllOfCollectionwhere('users', 'email', email);

        console.log(data);
        if (data.length > 0) {
            navigation.navigate(SCREEN.HOME);
            setIsLoading(false);

        }
        else setIsLoading(false);

    };

    return (
        <SafeAreaView style={{flex:1, backgroundColor: COLORS._FFFFFF}}>
        <View style={styles.main}>
            {/* TOP CONTAINER */}
            <View style={styles.topConatiner}>
                <Image
                    source={require('../../assets/images/branding.png')}
                    style={styles.branding}
                />
                <Text style={styles.welcome}>Welcome back !</Text>
                <Text style={styles.text}>Please enter your credentials</Text>
            </View>
            {/* END */}
            {/* BODY */}
            <View style={styles.body}>
                <CustomInput
                    placeholder={"Email"}
                    onChange={(email) => handleEmail(email)}

                />
                <CustomInput
                    placeholder={"Password"}
                    style={{ marginTop: hp(3) }}
                    onChange={(password) => setpassword(password)}
                    isPassword={true}
                />

                <View style={styles.rowContainer}>
                    <ChekBox
                        checked={checked}
                        onToggle={() => setchecked(!checked)}
                    />
                    <Text style={styles.terms}
                    >{`I  read/ confirm T&C and privacy policy to continue the authorization process `}</Text>
                </View>

                <AuthButton
                    title={
                        !isLoading ? (
                            "Login"
                        ) : (
                            <ActivityIndicator size={24} color={COLORS._FFFFFF} />
                        )
                    }
                    type2={true}
                    onpress={() => loginUser()}
                />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.signUp}>Don't have an account?
                    </Text>
                    <Text style={[styles.signUp, { fontFamily: FONTS.AEONIK_700, }]} onPress={() => navigation.navigate(SCREEN.REGISTER)}> Sign Up</Text>

                </View>

            </View>
            {/* END */}
        </View>
        </SafeAreaView>

    )
}

export default SignIn

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._FFFFFF,
        alignItems: 'center'
    },
    topConatiner: {
        width: wp(100),
        height: hp(28),
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: hp(8)
    },
    branding: {
        width: wp(32),
        height: hp(7.38),
        resizeMode: 'contain'
    },
    welcome: {
        fontFamily: FONTS.AEONIK_500,
        color: COLORS._000000,
        fontSize: hp(2.6),
        marginTop: hp(2),
        marginBottom: hp(1.8)
    },
    text: {
        fontFamily: FONTS.AEONIK_400,
        color: COLORS._000000,
        fontSize: hp(1.9)
    },
    body: {
        flex: 1,
        width: wp(100),
        alignItems: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        width: wp(79.2),
        justifyContent: 'space-between',
        marginTop: hp(4),
        marginBottom: hp(6)
    },
    terms: {
        color: COLORS._000000,
        width: wp(79.2) - (wp(6) + 22),
        fontFamily: FONTS.AEONIK_400,
        fontSize: 13
    },
    signUp: {
        color: COLORS._000000,
        fontFamily: FONTS.AEONIK_400,
        fontSize: hp(1.6),
        marginTop: hp(3)
    }
})
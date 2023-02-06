import { Image, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FONTS, height, hp, wp } from '../../utils/common'
import AuthButton from '../../components/buttons/authButton'
import { SCREEN } from '../../enums/AppEnums'

const Welcome = ({ navigation }) => {
    
    return (
        <View style={{ flex: 1, backgroundColor: '#090B06' }}>
            <Image
                source={require('../../assets/images/welcomeBg.png')}
                style={styles.welcomeBg}
            />
            {/* CONTEXT */}
            <ImageBackground
                source={require('../../assets/images/gradient.png')}
                style={styles.bg}
            >
                <Text style={styles.text}>{`The body achieves\nwhat the mind\nbelieves`}</Text>
                <AuthButton
                    title={"Get Started"}
                    onpress={() => navigation.navigate(SCREEN.REGISTER)}
                />

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.signUp}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate(SCREEN.LOGIN)} >
                        <Text style={styles.signUp}> Log in</Text>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
        </View>
    )
}

export default Welcome

const styles = StyleSheet.create({
    welcomeBg: {
        width: wp(100),
        height: hp(67),
        position: 'absolute',
        top: 0
    },
    bg: {
        width: wp(100),
        height: hp(100),
        alignItems: 'center'
    },
    text: {
        color: COLORS._FFFFFF,
        fontFamily: FONTS.AEONIK_500,
        fontSize: hp(4.3),
        marginTop: hp(62),
        lineHeight: hp(4.3),
        marginBottom: hp(2)
    },
    signUp: {
        color: COLORS._FFFFFF,
        fontFamily: FONTS.AEONIK_700,
        fontSize: hp(1.5),
        marginTop: hp(3)
    }
})
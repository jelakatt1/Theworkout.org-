import { StyleSheet, Text, View, TouchableOpacity, Image,Platform, Linking } from 'react-native'
import React from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import { Cross, Friends, HelpCenter, Home, Settings, Logout } from '../../assets/svg'
import { SCREEN } from '../../enums/AppEnums'
import auth from '@react-native-firebase/auth';

const Menu = (props) => {

    const menuList = [
        {
            id: 1,
            name: "Home Page",
            icon: <Home width={hp(3)} height={hp(3)} />,
            onpress: () => props.navigation.replace(SCREEN.HOME)
        },
        {
            id: 2,
            name: "Friends",
            icon: <Friends width={hp(3)} height={hp(3)} />,
            onpress: () => props.navigation.replace(SCREEN.FRIENDS)
        },
        {
            id: 3,
            name: "Profile Settings",
            icon: <Settings width={hp(3)} height={hp(3)} />,
            onpress: () => props.navigation.replace(SCREEN.PROFILE)
        },
        {
            id: 4,
            name: "Help Center",
            icon: <HelpCenter width={hp(3)} height={hp(3)} />,
            onpress: () => Linking.openURL('mailto:elakattboy955@gmail.com?subject=SendMail&body=Help center')

        },
        {
            id: 5,
            name: "Logout",
            icon: <Logout width={hp(3)} height={hp(3)} />,
            onpress: () => auth().signOut()

        },
    ]

    return (
        <View style={styles.main}>
            <TouchableOpacity style={styles.crossContainer} onPress={() => props.navigation.goBack()}>
                <Cross width={15} height={16} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/images/logo_.png')}
                    style={styles.logo}
                />
                <Text style={styles.logoText}>The Gym Workout</Text>
            </View>
            <View style={styles.listConatiner}>
                {
                    menuList.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row", justifyContent: "center", }}>
                            <TouchableOpacity style={styles.itemContainer} onPress={() => item.onpress()}>
                                {item.icon}
                                <Text style={styles.text}>{item.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

export default Menu

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._0F172A,
    },
    crossContainer: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        
        marginRight: wp(5),
        zIndex: 100,
        marginTop :  hp(8)

    },
    logo: {
        width: hp(9),
        height: hp(7.5),
        resizeMode: 'contain'
    },
    logoText: {
        color: COLORS._FFFFFF,
        fontFamily: FONTS.AEONIK_500,
        fontSize: hp(2)
    },
    logoContainer: {
        width: '100%',
        justifyContent: "center",
        alignItems: 'center'
    },
    itemContainer: {
        width: wp(50),
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        marginVertical: hp(2)
    },
    text: {
        color: COLORS._FFFFFF,
        fontFamily: FONTS.AEONIK_500,
        fontSize: hp(2.1),
        marginLeft: wp(5)
    },
    listConatiner: {
        marginTop: hp(2)
    }
})
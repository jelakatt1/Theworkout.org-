import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import AuthButton from '../../components/buttons/authButton'
import CurveContainer from '../../components/curveContainer'
import moment, { unix } from 'moment'
import { handleContactsPermssions } from '../../utils/permissionHandler'
import Contacts from 'react-native-contacts';
import If from '../../components/if'
import { SCREEN } from '../../enums/AppEnums'
import { getAllOfCollectionwhere } from '../../services/firebaseServices'
import { COLLECTION } from '../../utils/collections'
import { AuthContext } from '../../contexts/authContext'
import { onShare } from '../../utils/MyUtils'

const Friends = (props) => {
    const { getContacts,
        contactsList,
        setcontactsList,
        isLoading,
        setisLoading,
        getContacts_,
        existsArray,
        setexistsArray,
        defaultAvatar,
        selectedFriend,
        setselectedFriend,
        selectedContact,
        setselectedContact
    } = useContext(AuthContext)
    const [friewndsList, setfriewndsList] = useState([])

    useEffect(() => {
        if (existsArray?.length == 0) {
            getContacts_()
        } else {

        }
    }, [])

    useEffect(() => {
        let data = existsArray.filter((x) => x?.userData?.doc_id)
        setfriewndsList(data)
    }, [existsArray?.length])

    const handleViewFriend = (item) => {
        setselectedFriend(item)
        props.navigation.navigate(SCREEN.FRIENDS_PROFILE)
    }

    return (
        <View style={styles.main}>
            <CurveContainer >
                <View style={styles.topConatiner}>
                    <Text style={styles.name}>Friends</Text>
                </View>

                <View style={styles.midConatainer}>
                    <Text style={[styles.name, { fontSize: hp(2.2) }]}>Recently Added</Text>
                    <View>
                        <ScrollView horizontal>
                            {
                                friewndsList?.length == 0 ?
                                    <Text style={[styles.name, { fontSize: hp(2.2) }]}>No Friends found</Text>
                                    :
                                    friewndsList?.slice(0.10)?.map((item, index) => {
                                        // Get current date
                                        var date = new Date();
                                        // Substract 14 days to current date
                                        date.setDate(date.getDate() - 14);
                                        // DATE IN UNIX ==>>>
                                        const unixDate = Math.floor(new Date(date) / 1000)
                                        return (
                                            <>
                                                {
                                                    item?.userData?.createdAt > unixDate ?
                                                        <TouchableOpacity style={styles.item_} key={index}
                                                            onPress={() => handleViewFriend(item?.userData)}>
                                                            <Image
                                                                source={{ uri: item?.userData?.profileImage || defaultAvatar }}
                                                                style={styles.avatar}
                                                            />
                                                            <Text style={[styles.text_, { fontSize: hp(1.8), width: hp(7), }]} numberOfLines={1}>
                                                                {item?.displayName || `${item?.givenName} ${item?.familyName}`}</Text>
                                                        </TouchableOpacity>
                                                        :
                                                        null
                                                }
                                            </>
                                        )
                                    })
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.buttonConatainer}>
                    <AuthButton
                        style={styles.button}
                        title={`+ Invite New`}
                        textStyles={{
                            fontFamily: FONTS.AEONIK_400,
                            fontSize: hp(2.2),
                        }}
                        onpress={() => { props.navigation.navigate(SCREEN.IMPORT_CONTACTS) }}
                        isLoading={isLoading}
                    />
                </View>
            </CurveContainer>
            {/* 1671720772 */}
            {/* CONTEXT */}
            <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                <ScrollView>
                    <Text style={styles.label}>All Friends</Text>

                    <If condition={contactsList?.length != 0}>
                        {
                            friewndsList?.map((item, index) => (
                                <TouchableOpacity style={styles.itemContainer} key={index}
                                    onPress={() => handleViewFriend(item?.userData)}>
                                    <Image
                                        source={{ uri: item?.userData?.profileImage || defaultAvatar }}
                                        style={styles.image}
                                    />
                                    <View style={{ flex: 1, }}>
                                        <Text style={styles.displayName} numberOfLines={1}>{item?.displayName || `${item?.givenName} ${item?.familyName}` || ""}</Text>
                                        <Text style={styles.address} numberOfLines={1}>
                                            {item?.postalAddresses?.length != 0 ? item?.postalAddresses[0]?.formattedAddress : '' ||
                                                item?.phoneNumbers[0]?.number || ""}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </If>
                    <If condition={contactsList?.length != 0}>
                        <>
                            <Text style={[styles.name, {
                                fontSize: hp(2.2),
                                color: COLORS._0F172A,
                                textAlign: 'center',
                            }]}>No Friends found</Text>
                            <Text style={[styles.name, {
                                fontSize: hp(1.8),
                                color: COLORS._0F172A,
                                textAlign: 'center',
                                fontFamily : FONTS.AEONIK_500,
                                marginTop : 20,
                                paddingHorizontal :'5%'
                            }]}>You can import more contacts to see if any of your contacts are using Workout</Text>
                        </>
                    </If>
                </ScrollView>
            </View>
            {/* END */}

        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._FFFFFF,
    },
    topConatiner: {
        width: '100%',
        // borderWidth:2,
        borderColor: "#FFF",
        justifyContent: "space-evenly",
        paddingVertical: hp(1)
    },
    name: {
        color: COLORS._FFFFFF,
        fontFamily: FONTS.AEONIK_700,
        fontSize: hp(3.5)
    },
    text_: {
        fontFamily: FONTS.AEONIK_400,
        color: COLORS._FFFFFF,
        fontSize: hp(2.38),
        marginTop: hp(1)
    },
    text: {
        fontFamily: FONTS.AEONIK_400,
        color: COLORS._000000,
        fontSize: hp(1.9)
    },
    buttonConatainer: {
        width: '100%',
        paddingBottom: hp(2.3)
    },

    midConatainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'space-evenly'
    },

    button: {
        height: hp(6.2),
        borderRadius: hp(4),
        marginTop: hp(2),
        width: '95%'
    },
    avatar: {
        width: hp(6.5),
        height: hp(6.5),
        borderRadius: hp(5)
    },
    item_: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: wp(8)
    },
    text_1: {
        color: COLORS._000000,
        fontSize: hp(3),
        textAlign: 'left',
        marginTop: hp(3.5),
        marginBottom: hp(1),
    },
    label: {
        color: COLORS._000000,
        fontFamily: FONTS.AEONIK_700,
        fontSize: hp(2.7),
        marginVertical: hp(2.5),
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(2)
    },
    image: {
        width: hp(8.7),
        height: hp(8.7),
        borderRadius: hp(7),
        marginRight: '5%',
    },
    displayName: {
        fontFamily: FONTS.AEONIK_700,
        color: COLORS._5B606B,
        fontSize: hp(2.2),
        marginBottom: 5
    },
    address: {
        fontFamily: FONTS.AEONIK_400,
        color: COLORS._5B606B,
        fontSize: hp(1.8)
    }

})
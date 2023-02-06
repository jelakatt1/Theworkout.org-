import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView, Button, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useMemo, useContext } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import AuthButton from '../../components/buttons/authButton'
import CurveContainer from '../../components/curveContainer'
import moment from 'moment'
import { handleContactsPermssions } from '../../utils/permissionHandler'
import Contacts from 'react-native-contacts';
import If from '../../components/if'
import { getAllOfCollectionwhere } from '../../services/firebaseServices'
import { COLLECTION } from '../../utils/collections'
import { AuthContext } from '../../contexts/authContext'
import { onShare } from '../../utils/MyUtils'
import { SCREEN } from '../../enums/AppEnums'


const ImportContacts = (props) => {
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
        setselectedContact,
        isMoreAvailable,
        isContactsLoading
    } = useContext(AuthContext)



    useEffect(() => {

    }, [])



    const isAdded = (index) => {
        let added = false
        if (existsArray.length > index) {
            if (existsArray[index]?.userData?.doc_id) {
                added = true
            }
        }
        return added
    }

    const handleViewFriend = (item, index) => {
        if (isAdded(index)) {
            setselectedFriend(existsArray[index]?.userData)
            props.navigation.navigate(SCREEN.FRIENDS_PROFILE)
        } else {
            onShare()
        }
    }


    return (
        <View style={styles.main}>
            <CurveContainer >
                <View style={styles.topConatiner}>
                    <Text style={styles.name}>Import Contacts</Text>
                </View>

                <View style={styles.midConatainer}>
                    <Text style={[styles.name, { fontSize: hp(2.2) }]}>Recently Imported</Text>
                    <View>
                        <ScrollView horizontal>
                            {
                                contactsList?.slice(0.10)?.map((item, index) => {
                                    let image = ""
                                    if (existsArray.length > index) {
                                        image = existsArray[0]?.userData?.profileImage
                                    }
                                    return (
                                        <TouchableOpacity style={styles.item_} key={index}
                                            onPress={() => handleViewFriend(item, index)}
                                        >
                                            <Image
                                                source={{ uri: image || defaultAvatar }}
                                                style={styles.avatar}
                                            />
                                            <Text style={[styles.text_, { fontSize: hp(1.8), width: hp(7), }]} numberOfLines={1}>
                                                {item?.displayName || `${item?.givenName} ${item?.familyName}`}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.buttonConatainer}>
                    <AuthButton
                        style={styles.button}
                        title={`+ import now`}
                        textStyles={{
                            fontFamily: FONTS.AEONIK_400,
                            fontSize: hp(2.2),
                        }}
                        onpress={() => {
                            if (contactsList?.length == 0) {
                                getContacts_()
                            }
                        }}
                        isLoading={isLoading}
                    />
                </View>
            </CurveContainer>

            {/* CONTEXT */}
            <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <Text style={styles.label}>All Contacts</Text>

                    <If condition={contactsList?.length != 0}>
                        <>
                            {
                                contactsList?.map((item, index) => {
                                    let image = ""
                                    if (existsArray.length > index) {
                                        image = existsArray[index]?.userData?.profileImage
                                    }

                                    return (
                                        <TouchableOpacity
                                            style={styles.itemContainer}
                                            key={index}
                                            onPress={() => handleViewFriend(item, index)}
                                        >
                                            <Image
                                                source={{ uri: image || defaultAvatar }}
                                                style={styles.image}
                                            />
                                            <View style={{ flex: 1, }}>
                                                <Text style={styles.displayName} numberOfLines={1}>{item?.displayName || `${item?.givenName} ${item?.familyName}`}</Text>
                                                <Text style={styles.address} numberOfLines={1}>
                                                    {item?.postalAddresses?.length != 0 ? item?.postalAddresses[0]?.formattedAddress : '' ||
                                                        item?.phoneNumbers[0]?.number}</Text>
                                            </View>
                                            {isAdded(index) == false &&
                                                <TouchableOpacity style={{ backgroundColor: COLORS._F2C94C, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 5 }}
                                                    activeOpacity={0.8} onPress={() => onShare()}>
                                                    <Text style={{ fontFamily: FONTS.AEONIK_500, color: COLORS._0F172A }}>Invite</Text>
                                                </TouchableOpacity>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            <If condition={isMoreAvailable}>
                                {
                                    isContactsLoading ?
                                        <View style={{marginBottom: 20}}>
                                            <ActivityIndicator size={25} color={COLORS._0F172A} />
                                        </View>
                                        :
                                        <TouchableOpacity style={{
                                            justifyContent: "center",
                                            alignItems: 'center',
                                        }}
                                            onPress={() => getContacts_()}
                                        >
                                            <Text style={{
                                                fontFamily: FONTS.AEONIK_700,
                                                fontSize: 14,
                                                color: COLORS._0F172A,
                                                marginVertical: 10,
                                                marginBottom: 20
                                            }}>Load More</Text>
                                        </TouchableOpacity>
                                }
                            </If>
                        </>
                    </If>
                </ScrollView>
            </View>
            {/* END */}

        </View>
    )
}

export default ImportContacts

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
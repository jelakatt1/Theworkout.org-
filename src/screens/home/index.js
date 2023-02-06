import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Calendar, CalendarUtils, LocaleConfig } from 'react-native-calendars'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Left, Right } from '../../assets/svg'
import AuthButton from '../../components/buttons/authButton'
import CurveContainer from '../../components/curveContainer'
import CustomInput from '../../components/inputs/customInput'
import WorkoutModal from '../../components/WorkoutModal'
import { AuthContext } from '../../contexts/authContext'
import { SCREEN } from '../../enums/AppEnums'
import { COLLECTION } from '../../utils/collections'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import { onShare, showFlash } from '../../utils/MyUtils'

const INITIAL_DATE = moment(new Date()).format('YYYY-MM-DD');
const Home = (props) => {
    LocaleConfig.locales['en'] = {
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
        today: "Today"
    };
    LocaleConfig.defaultLocale = 'en'

    const { getContacts,
        contactsList,
        setcontactsList,
        setisLoading,
        getContacts_,
        existsArray,
        setexistsArray,
        defaultAvatar,
        selectedFriend,
        setselectedFriend,
        selectedContact,
        setselectedContact,
        userData
    } = useContext(AuthContext)

    const [date, setdate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [selected, setSelected] = useState(INITIAL_DATE);
    const [pushups, setPushups] = useState()
    const [pullups, setPullups] = useState()
    const [situps, setSitups] = useState()
    const [miles, setMiles] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setisVisible] = useState(false);
    const [record, setrecord] = useState({})

    const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

    const getDate = (count) => {
        const date = new Date(INITIAL_DATE);
        const newDate = date.setDate(date.getDate() + count);
        return CalendarUtils.getCalendarDateString(newDate);
    };

    const onDayPress = useCallback((day) => {
        setSelected(day.dateString);
         getRecord(day.dateString);
    }, []);

    const marked = useMemo(() => {
        return {
            [getDate(-1)]: {
                dotColor: 'red',
                marked: true
            },
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: COLORS._F2C94C,
                selectedTextColor: COLORS._000000,
            }
        };
    }, [selected]);


    const submitResults = async () => {
        if (pushups == '') {
            showFlash('Please enter pushups')
            return
        }

        if (pullups == '') {
            showFlash('Please enter pullups')
            return
        }

        if (situps == '') {
            showFlash('Please enter situps')
            return
        }

        if (miles == '') {
            showFlash('Please enter miles')
            return
        }
        setIsLoading(true);

        try {
            let response = []
            let querySnapshot = await firestore()
                .collection(COLLECTION.USER)
                .doc(auth()?.currentUser?.uid)
                .collection(COLLECTION.WORKOUT)
                .where('dateRecord', '==', selected)
                .get()

            querySnapshot.forEach((doc) => {
                response.push({ ...doc.data(), doc_id: doc.id })
            })

            if (response?.length != 0) {
                setIsLoading(false);

                alert('Date already exists')
                console.log(JSON.stringify(response))

            } else {
                firestore()
                    .collection(COLLECTION.USER)
                    .doc(auth().currentUser.uid)
                    .collection(COLLECTION.WORKOUT)
                    .add({
                        pushups: pushups,
                        pullups: pullups,
                        situps: situps,
                        miles: miles,
                        dateRecord: selected
                    })
                    .then(() => {
                        setIsLoading(false);
                        showFlash('Record submitted', "success")
                    })
                    .catch(function (error) {
                        console.error('Error writing document: ', error);
                    });
            }

        } catch (error) {
            alert(error)
            setIsLoading(false);

        }
    }

    useEffect(() => {
        if (contactsList?.length == 0) {
            getContacts_()
        } else {

        }
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


    /**
     * GET RECORD
     * **/
    const getRecord = async (date) => {
        let data = [];
        let querySnapshot = await firestore()
            .collection(COLLECTION.USER)
            .doc(auth().currentUser.uid)
            .collection(COLLECTION.WORKOUT)
            .where('dateRecord', '==', date)
            .get();
        querySnapshot.forEach(function (doc) {
            if (doc.exists) {
                data.push({ ...doc.data(), doc_id: doc?.id });
            } else {
                console.log('No document found!');
            }
        });

        if (data.length > 0) {
            setrecord(data[0])
            setisVisible(true)
        }
    }

    /**
     * UPDATE RECORD
     * **/
    const updateRecord = async (pushups_, pullups_, situps_, miles_, doc_id) => {
        setIsLoading(true)
        firestore()
            .collection(COLLECTION.USER)
            .doc(auth().currentUser.uid)
            .collection(COLLECTION.WORKOUT)
            .doc(doc_id)
            .set({
                pushups: pushups_,
                pullups: pullups_,
                situps: situps_,
                miles: miles_,
                dateRecord: selected
            })
            .then(() => {
                setIsLoading(false);
                showFlash('Record Updated', "success")
            })
            .catch(function (error) {
                console.error('Error writing document: ', error);
                setIsLoading(false);
            });

    }

    return (
        <View style={styles.main}>
            <CurveContainer >
                <View style={styles.topConatiner}>
                    <Text style={styles.name}>Hello, {userData?.firstName}</Text>
                    <Text style={styles.text_}>{new Date().toLocaleDateString('en-us', { weekday:"long",  day:"numeric", month:"long" }) }</Text>
                </View>

                <View style={styles.midConatainer}>
                    <Text style={[styles.name, { fontSize: hp(2.2), marginBottom: 15 }]}>Contacts</Text>
                    <View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {
                                contactsList?.slice(0.10)?.map((item, index) => {
                                    let image = ""
                                    if(existsArray.length > index){
                                        image = existsArray[0]?.userData?.profileImage
                                    }
                                    return(
                                        <TouchableOpacity style={styles.item_} key={index}
                                        onPress={() => handleViewFriend(item, index)}
                                        >
                                            <Image
                                                source={{ uri: image || defaultAvatar }}
                                                style={styles.avatar}
                                            />
                                            <Text style={[styles.text_, { fontSize: hp(1.8), width: hp(7) }]}
                                            numberOfLines={1}
                                            > {item?.displayName || `${item?.givenName} ${item?.familyName}`}</Text>
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
                        title={`+ import`}
                        textStyles={{
                            fontFamily: FONTS.AEONIK_400,
                            fontSize: hp(2.2),
                        }}
                        onpress={() => props.navigation.navigate(SCREEN.IMPORT_CONTACTS)}
                    />
                </View>
            </CurveContainer>

            {/* CONTEXT */}
            <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    <View style={{ width: wp(90) }}>
                        <Text style={[styles.name, styles.text_1]}>Survey</Text>

                        <View style={{ marginTop: hp(2.5) }}>
                            <Text style={styles.label}
                            >How many pushups you do ?</Text>
                            <CustomInput
                                style={{ width: '100%' }}
                                placeholder='Write your answer'
                                onChange={(pushups) => setPushups(pushups)}
                                keyboardType={'numeric'}
                            />
                        </View>

                        <View style={{ marginTop: hp(2.5) }}>
                            <Text style={styles.label}
                            >How many pullups you do ?</Text>
                            <CustomInput
                                style={{ width: '100%' }}
                                placeholder='Write your answer'
                                onChange={(pullups) => setPullups(pullups)}
                                keyboardType={'numeric'}
                            />
                        </View>

                        <View style={{ marginTop: hp(2.5) }}>
                            <Text style={styles.label}
                            >How many situps you do ?</Text>
                            <CustomInput
                                style={{ width: '100%' }}
                                placeholder='Write your answer'
                                onChange={(situps) => setSitups(situps)}
                                keyboardType={'numeric'}
                            />
                        </View>

                        <View style={{ marginTop: hp(2.5) }}>
                            <Text style={styles.label}
                            >How many mile run you do ?</Text>
                            <CustomInput
                                style={{ width: '100%' }}
                                placeholder='Write your answer'
                                onChange={(miles) => setMiles(miles)}
                                keyboardType={'numeric'}
                            />
                        </View>

                        <AuthButton
                            type2={true}
                            title={
                                !isLoading ? (
                                    "Submit"
                                ) : (
                                    <ActivityIndicator size={24} color={COLORS._FFFFFF} />
                                )
                            }
                            style={{
                                width: '100%',
                                height: hp(6),
                                borderRadius: hp(3),
                                marginBottom: hp(3)
                            }}
                            textStyles={{
                                fontFamily: FONTS.AEONIK_400,
                                fontSize: hp(2.2),
                            }}
                            onpress={() => submitResults()}
                        />


                        {/* CALENDER */}
                        <Calendar
                            current={INITIAL_DATE}
                            onDayPress={onDayPress}
                            onMonthChange={(day) => { setSelected(day.dateString) }}
                            hideArrows={false}
                            renderArrow={direction => direction == 'right' ? <Right width={14} height={14} /> : <Left width={14} height={14} />}
                            hideExtraDays={false}
                            disableMonthChange={false}
                            firstDay={1}
                            showWeekNumbers={false}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            disableAllTouchEventsForDisabledDays={false}
                            renderHeader={date_ => <Text style={{ fontFamily: FONTS.AEONIK_700, color: COLORS._000000, fontSize: 16 }}>
                                {moment(selected).format("MMM YYYY")}</Text>}
                            enableSwipeMonths={true}
                            markedDates={marked}
                            style={{ marginBottom: hp(5), }}
                        />
                    </View>

                </KeyboardAwareScrollView>
            </View>
            {/* END */}
            <WorkoutModal
                isVisible={isVisible}
                onclose={() => setisVisible(false)}
                record={record}
                editable={true}
                updateRecord={updateRecord}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._FFFFFF,
        alignItems: 'center'
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
        justifyContent: 'space-evenly',
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
        color: COLORS._5B606B,
        fontFamily: FONTS.AEONIK_700,
        fontSize: hp(2),
        marginBottom: hp(1),
    }

})
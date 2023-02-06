import { Image, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useMemo, useContext } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import AuthButton from '../../components/buttons/authButton'
import CurveContainer from '../../components/curveContainer'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Calendar, CalendarList, Agenda, LocaleConfig, CalendarUtils } from 'react-native-calendars';
import { Left, Right } from '../../assets/svg'
import moment from 'moment'
import { showFlash } from '../../utils/MyUtils'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLLECTION } from '../../utils/collections'
import { SCREEN } from '../../enums/AppEnums'
import WorkoutModal from '../../components/WorkoutModal'
import { AuthContext } from '../../contexts/authContext'
const INITIAL_DATE = moment(new Date()).format('YYYY-MM-DD');

const FriendsProfile = () => {

    LocaleConfig.locales['en'] = {
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
        today: "Today"
    };
    LocaleConfig.defaultLocale = 'en'
    const { defaultAvatar, selectedFriend } = useContext(AuthContext)
    const [date, setdate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [selected, setSelected] = useState(INITIAL_DATE);
    const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);
    const [isModalVisible, setisModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setisVisible] = useState(false);
    const [record, setrecord] = useState({})
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

    /**
    * GET RECORD
    * **/
    const getRecord = async (date) => {
        let data = [];
        let querySnapshot = await firestore()
            .collection(COLLECTION.USER)
            .doc(selectedFriend?.doc_id)
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
        } else {
            showFlash(`${selectedFriend?.firstName || ""} ${selectedFriend?.lastName || ""} have no records on the selected day`, 'warning')
        }
    }



    return (
        <View style={styles.main}>
            <CurveContainer >
                <View style={styles.topConatiner}>
                    <Text style={styles.name}>Friends Profile</Text>
                </View>

                <View style={styles.midConatainer}>
                    <Image
                        source={{ uri: selectedFriend?.profileImage || defaultAvatar }}
                        style={styles.avatar}
                    />
                    <Text style={[styles.name, { fontSize: hp(2.2) }]}>{`${selectedFriend?.firstName || ""} ${selectedFriend?.lastName || ""}`}</Text>
                </View>

                <View style={styles.buttonConatainer}>
                    {/* <AuthButton
                        style={styles.button}
                        title={`BUTTON`}
                        textStyles={{
                            fontFamily: FONTS.AEONIK_400,
                            fontSize: hp(2),
                        }}
                        onpress={() => {}}
                    /> */}
                </View>
            </CurveContainer>

            {/* CONTEXT */}
            <View style={{ flex: 1, paddingHorizontal: '5%' }}>
                <Text style={styles.label}>Check Friend Result</Text>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    {/* CALENDER */}
                    <Calendar
                        current={INITIAL_DATE}
                        onDayPress={onDayPress}
                        onMonthChange={(day) => setSelected(day.dateString)}
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
                    {/* END */}
                </KeyboardAwareScrollView>
            </View>
            {/* END */}
            <WorkoutModal
                isVisible={isVisible}
                onclose={() => setisVisible(false)}
                record={record}
            />
        </View>
    )
}

export default FriendsProfile

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
        fontSize: hp(3.5),
        paddingLeft: '3%'
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
        height: hp(6.2),
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
        width: hp(12),
        height: hp(12),
        borderRadius: hp(8),
        marginLeft: '3%'
    },
    label: {
        color: COLORS._000000,
        fontFamily: FONTS.AEONIK_700,
        fontSize: hp(2.7),
        marginVertical: hp(2.5),
    },


})
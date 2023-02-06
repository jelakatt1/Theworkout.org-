import { Image, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useMemo, useContext } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import AuthButton from '../../components/buttons/authButton'
import CurveContainer from '../../components/curveContainer'
import ImagePicker from 'react-native-image-crop-picker';
import CustomInput from '../../components/inputs/customInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import { Calender } from '../../assets/svg'
import { AuthContext } from '../../contexts/authContext'
import { uploadImage, saveData } from '../../services/firebaseServices'
import auth from '@react-native-firebase/auth';
import { COLLECTION } from '../../utils/collections'
import { showFlash } from '../../utils/MyUtils'
import moment from 'moment'

const Profile = () => {
    const { userData, defaultAvatar, getUser } = useContext(AuthContext)

    const [imageObject, setimageObject] = useState({})
    const [profileImage, setprofileImage] = useState(userData?.profileImage || '')
    const [firstName, setFirstName] = useState(userData?.firstName || '')
    const [lastName, setLastName] = useState(userData?.lastName || '')
    const [email, setEmail] = useState(userData?.email || '')
    const [phone, setPhone] = useState(userData?.number || '')
    const [birthday, setBirthday] = useState(userData?.date || '')
    const [isEmailValid, setisEmailValid] = useState(true)
    const [isLoading, setisLoading] = useState(false)
    const [isLoading_, setisLoadin_] = useState(false)
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    /**
    * Email validation
    */

    const handleEmail = text => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmail(text);
        if (emailRegex.test(text)) {
            setisEmailValid(true);
        } else {
            setisEmailValid(false);
        }
    };

    /**
       * Date Format
       */

    const handleSelectDate = param => {
        var date = new Date(param),
            month = '' + (date.getMonth() + 1),
            day = '' + date.getDate(),
            year = date.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        var month = date.getMonth() + 1;
        month = month < 10 ? '0'.concat(month) : month;
        setBirthday(month + '/' + day + '/' + year);

    };
    /**
      * Image Picker Functions
      **/
    const handlePickImage = () => {
        Alert.alert(
            'Change Profile Picture',
            "Select an Image from",
            [

                {
                    text: "Camera",
                    onPress: () => { openCamera() },
                },
                {
                    text: "Gallery",
                    onPress: () => { openGallery() },
                },
                {
                    text: "Cancel",
                    onPress: () => { },
                },
            ]
        );
    }

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(async image => {
            setimageObject(image)
            setprofileImage(image.path)
        }).catch(() => { })
    }

    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(async image => {
            setimageObject(image)
            setprofileImage(image.path)
        }).catch(() => { })
    }

    useEffect(() => {

    }, [])

    /**
    * Update User Profile
    */
    const updateProfile = async () => {
        if (isEmailValid && email != '' && phone != '' && firstName != '' && lastName != '') {
            setisLoading(true)
            let imageUrl = ""
            if (imageObject?.path) {
                imageUrl = await uploadImage(imageObject.path)
            }
            await saveData(
                COLLECTION.USER,
                auth().currentUser.uid,
                {
                    firstName: firstName,
                    lastName: lastName,
                    number: phone,
                    profileImage: imageUrl == 'false' ? "" : imageUrl,
                    date : birthday
                }
            )
            getUser()
            setisLoading(false)
            showFlash("User profile updated Successfully")
        } else {
            showFlash("Invalid Data", "warning")
        }

    }

    /**
   * SEND RESET PASSWORD LINK
   */
    const sendPasswordResendLink = async (email = userData?.email) => {
        setisLoadin_(true)
        auth().
            sendPasswordResetEmail(email)
            .then(() => {
                showFlash("Successfully sent the password reset email, Check your eamil")
                setisLoadin_(false)
            })
            .catch(() => {
                showFlash("An Error Occured while sending password reset link", 'danger')
                setisLoadin_(false)
            })
    }

    return (
        <View style={styles.main}>
            <CurveContainer >
                <View style={styles.topConatiner}>
                    <Text style={styles.name}>Profile Settings</Text>
                </View>

                <View style={styles.midConatainer}>
                    <Image
                        source={{ uri: imageObject?.path || profileImage || defaultAvatar }}
                        style={styles.avatar}
                    />
                    <Text style={[styles.name, { fontSize: hp(2.2) }]}>{`${firstName} ${lastName}`}</Text>
                </View>

                <View style={styles.buttonConatainer}>
                    <AuthButton
                        style={styles.button}
                        title={`Upload new image`}
                        textStyles={{
                            fontFamily: FONTS.AEONIK_400,
                            fontSize: hp(2),
                        }}
                        onpress={() => handlePickImage()}
                    />
                </View>
            </CurveContainer>

            {/* CONTEXT */}
            <View style={{ flex: 1, }}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.body}>

                        <View style={styles.rowContainer}>
                            <CustomInput
                                placeholder={"First name"}
                                style={{ width: '48%' }}
                                value={firstName}
                                onChange={(fname) => setFirstName(fname)}

                            />
                            <CustomInput
                                placeholder={"Last name"}
                                style={{ width: '48%' }}
                                value={lastName}
                                onChange={(lname) => setLastName(lname)}

                            />
                        </View>
                        <CustomInput
                            placeholder={"Email"}
                            value={email}
                            onChange={(email) => handleEmail(email)}
                            editable={false}
                        />
                        <CustomInput
                            placeholder={"Phone"}
                            value={phone}
                            onChange={(phone) => setPhone(phone)}

                        />

                        <TouchableOpacity >
                            <CustomInput
                                value={birthday}
                                placeholder={"Birthday"}
                                RightIcon={<Calender width={20} height={20} />}
                                onChange={(bday) => setBirthday(bday)}
                                editable={false}
                                RightIconPress={() => setOpen(!open)}

                            />
                        </TouchableOpacity>


                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            mode="date"
                            onConfirm={date => {
                                setOpen(false);
                                setDate(date);
                                handleSelectDate(date);
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />

                        <AuthButton
                            style={[styles.button,
                            { width: '82%', backgroundColor: COLORS._0F172A, marginTop: 25 }]}
                            title={`Save Changes`}
                            textStyles={{
                                fontFamily: FONTS.AEONIK_400,
                                fontSize: hp(2),
                                color: COLORS._FFFFFF
                            }}
                            onpress={() => { updateProfile() }}
                            isLoading={isLoading}
                        />

                        <AuthButton
                            style={[styles.button, { width: '82%' }]}
                            title={`Reset Password`}
                            textStyles={{
                                fontFamily: FONTS.AEONIK_400,
                                fontSize: hp(2),
                            }}
                            onpress={() => { sendPasswordResendLink() }}
                            isLoading={isLoading_}
                        />



                    </View>
                    {/* END */}
                </KeyboardAwareScrollView>
            </View>
            {/* END */}

        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._FFFFFF,
        alignItems: 'center',
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
    },
    rowContainer: {
        flexDirection: 'row',
        width: wp(79.2),
        justifyContent: 'space-between',
        marginTop: hp(3)
    },
    body: {
        flex: 1,
        width: wp(100),
        alignItems: 'center',
        paddingBottom: 25
    },

})
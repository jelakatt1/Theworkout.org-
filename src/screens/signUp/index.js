import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { COLORS, FONTS, hp, wp } from '../../utils/common'
import CustomInput from '../../components/inputs/customInput'
import ChekBox from '../../components/checkbox'
import AuthButton from '../../components/buttons/authButton'
import { Calender } from '../../assets/svg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showFlash } from '../../utils/MyUtils'
import DatePicker from 'react-native-date-picker';
import auth from '@react-native-firebase/auth';
import { registerUser } from '../../services/firebaseServices'
import { SCREEN } from '../../enums/AppEnums'


const SignUp = ({ navigation }) => {
    const [checked, setchecked] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [birthday, setBirthday] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [accessCode, setAccessCode] = useState('')
    const [isEmailValid, setisEmailValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

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

    const registerNewUser = async () => {

        if (firstName == '') {
            showFlash('Please enter first name')
            return
        }
        if (lastName == '') {
            showFlash('Please enter last name')
            return
        }
        if (email == '') {
            showFlash('Please enter email')
            return
        }
        if (phone == '') {
            showFlash('Please enter phone')
            return
        }
        if (!isEmailValid) {
            showFlash('Please enter correct email')
            return
        }
        if (birthday == '') {
            showFlash('Please enter your birthday date')
            return
        }
        if (password == '') {
            showFlash('Please enter password')
            return
        }
        if (confirmPassword == '') {
            showFlash('Please enter confirm password')
            return
        }
        if (password !== confirmPassword) {
            showFlash('Please enter same password')
            return
        }
        if (!checked) {
            showFlash('Please agree with our T&C')
            return
        }
        setIsLoading(true)
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async () => {
                let newUser = await registerUser({
                    firstName: firstName,
                    lastName: lastName,
                    email,
                    number: phone,
                    date: birthday,
                });
                setIsLoading(false)
                console.log(JSON.stringify(newUser))
            })
            .catch(error => {
                console.log(' ==>> ', error);
                setIsLoading(false)

                alert(error.message)

            });


    }

    return (
        <SafeAreaView style={{flex:1, backgroundColor: COLORS._FFFFFF}}>

        <View style={styles.main}>
            {/* TOP CONTAINER */}
            <View style={styles.topConatiner}>
                <Image
                    source={require('../../assets/images/branding.png')}
                    style={styles.branding}
                />
                <Text style={styles.welcome}>Get started with us</Text>
            </View>
            {/* END */}
            {/* BODY */}
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <View style={styles.body}>

                    <View style={styles.rowContainer}>
                        <CustomInput
                            placeholder={"First name"}
                            style={{ width: '48%' }}
                            onChange={(fname) => setFirstName(fname)}

                        />
                        <CustomInput
                            placeholder={"Last name"}
                            style={{ width: '48%' }}
                            onChange={(lname) => setLastName(lname)}

                        />
                    </View>
                    <CustomInput
                        placeholder={"Email"}
                        onChange={(email) => handleEmail(email)}

                    />
                    <CustomInput
                        placeholder={"Phone"}
                        onChange={(phone) => setPhone(phone)}

                    />

                    <TouchableOpacity>
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
                            setDate(date);
                            handleSelectDate(date);

                            setTimeout(() => {
                                setOpen(false);

                            }, 500)
                        }}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />

                    <CustomInput
                        placeholder={"Password"}
                        isPassword={true}
                        onChange={(password) => setPassword(password)}

                    />

                    <CustomInput
                        placeholder={"Confirm Password"}
                        isPassword={true}
                        onChange={(cpassword) => setConfirmPassword(cpassword)}
                    />

                    {/* <CustomInput
                        placeholder={"Access Code"}
                        onChange={(code) => setAccessCode(code)}

                    /> */}

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
                                "Sign up"
                            ) : (
                                <ActivityIndicator size={24} color={COLORS._FFFFFF} />
                            )
                        }
                        type2={true}
                        onpress={() => registerNewUser()}
                    />

                    <Text style={styles.signUp}>Don’t have an account?
                        <Text style={{ fontFamily: FONTS.AEONIK_700, }} onPress={() => navigation.navigate(SCREEN.LOGIN)}> Log in</Text></Text>
                </View>
                {/* END */}
            </KeyboardAwareScrollView>
        </View>
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: COLORS._FFFFFF,
        alignItems: 'center'
    },
    topConatiner: {
        width: wp(100),
        height: hp(20),
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        marginTop: hp(3)
    },
    terms: {
        color: COLORS._000000,
        width: wp(79.2) - (wp(5) + 22),
        fontFamily: FONTS.AEONIK_400,
        fontSize: 13
    },
    signUp: {
        color: COLORS._000000,
        fontFamily: FONTS.AEONIK_400,
        fontSize: hp(1.4),
        marginVertical: hp(3)
    }
})
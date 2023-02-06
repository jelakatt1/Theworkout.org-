import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, hp } from '../utils/common'
import { Cross_, PullUp, PushUp, SitUp, Sprint } from '../assets/svg'
import AuthButton from './buttons/authButton'

const WorkoutModal = (props) => {
    const [pushups, setPushups] = useState(props?.record?.pushups || '')
    const [pullups, setPullups] = useState(props?.record?.pullups || '')
    const [situps, setSitups] = useState(props?.record?.situps || '')
    const [miles, setMiles] = useState(props?.record?.miles || '')
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setPushups(props?.record?.pushups || '')
        setPullups(props?.record?.pullups || '')
        setSitups(props?.record?.situps || '')
        setMiles(props?.record?.miles || '')
    }, [props?.record])


    return (
        <Modal
            visible={props.isVisible}
            transparent
            style={{ flex: 1 }}
            onRequestClose={() => props.onclose()}
        >
            <TouchableOpacity style={styles.main} activeOpacity={1} onPress={() => props.onclose()}>
                {/* CONTAINER */}
                <View style={styles.container}>
                    <View>
                        <TouchableOpacity style={styles.cross} onPress={() => props.onclose()}>
                            <Cross_ width={12} height={13} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.text}>{`Today’s Workouts`}</Text>

                    {/* PUSHUPS */}
                    <View style={[styles.rowContainer, styles.item_]}>
                        <View style={[styles.rowContainer, { width: '45%', }]}>
                            <View style={{ width: '45%', }}>
                                <PushUp width={37} height={23} />
                            </View>
                            <Text style={styles.exercise}>Pushups:</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={pushups}
                            onChangeText={(txt) => setPushups(txt)}
                            editable={props.editable}
                        />
                    </View>


                    {/* PullUps */}
                    <View style={[styles.rowContainer, styles.item_]}>
                        <View style={[styles.rowContainer, { width: '45%', }]}>
                            <View style={{ width: '45%', }}>
                                <PullUp width={37} height={23} />
                            </View>
                            <Text style={styles.exercise}>Pullups:</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={pullups}
                            onChangeText={(txt) => setPullups(txt)}
                            editable={props.editable}
                        />
                    </View>

                    {/* SITUPS */}
                    <View style={[styles.rowContainer, styles.item_]}>
                        <View style={[styles.rowContainer, { width: '45%', }]}>
                            <View style={{ width: '45%', }}>
                                <SitUp width={37} height={23} />
                            </View>
                            <Text style={styles.exercise}>Situps:</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={situps}
                            onChangeText={(txt) => setSitups(txt)}
                            editable={props.editable}
                        />
                    </View>

                    {/* MILE RUN */}
                    <View style={[styles.rowContainer, styles.item_, { borderBottomWidth: 0 }]}>
                        <View style={[styles.rowContainer, { width: '45%', }]}>
                            <View style={{ width: '45%', }}>
                                <Sprint width={37} height={23} />
                            </View>
                            <Text style={styles.exercise}>Mile Run:</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={miles}
                            onChangeText={(txt) => setMiles(txt)}
                            editable={props.editable}
                        />
                    </View>

                    {
                        props.editable &&
                        <AuthButton
                            title={
                                !isLoading ? (
                                    "Update"
                                ) : (
                                    <ActivityIndicator size={24} color={COLORS._FFFFFF} />
                                )
                            }

                            style={{
                                width: 100,
                                height: hp(5),
                                alignSelf: 'flex-end'
                            }}
                            onpress={() => props.updateRecord(pushups, pullups, situps, miles, props?.record?.doc_id)}
                        />
                    }

                </View>
                {/* END */}
            </TouchableOpacity>
        </Modal>
    )
}

export default WorkoutModal

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        backgroundColor: COLORS._FFFFFF,
        width: '92%',
        borderRadius: 10,
        paddingHorizontal: '5%',
        paddingVertical: 15
    },
    cross: {
        width: 17,
        paddingVertical: 5,
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    text: {
        fontFamily: FONTS.AEONIK_700,
        color: COLORS._5B606B,
        fontSize: hp(2.6),
        paddingBottom: hp(1.2),

    },
    rowContainer: {
        width: '100%',
        flexDirection: "row",
        alignItems: 'center'
    },
    input: {
        flex: 1,
        color: COLORS._5B606B,
        fontFamily: FONTS.AEONIK_700,
        fontSize: 15,
        height: 50
    },
    exercise: {
        fontFamily: FONTS.AEONIK_400,
        color: COLORS._5B606B,
    },
    item_: {
        borderBottomWidth: 0.5,
        borderColor: "#E4E4E4",
        paddingVertical: 1.5
    }
})
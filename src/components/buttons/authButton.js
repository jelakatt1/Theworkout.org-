import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { wp, hp, COLORS, FONTS } from '../../utils/common'

const AuthButton = (props) => {
    return (
        <TouchableOpacity
            style={[styles.main,
            {
                backgroundColor: props.type2 ? COLORS._0F172A : COLORS._F2C94C,
            },
            props.style]}
            activeOpacity={0.8}
            onPress={() => props.onpress()}
        >
            {
                props.isLoading ?
                    <ActivityIndicator size={hp(3)} color={COLORS._FFFFFF} />
                    :
                    <Text
                        style={[{
                            color: props.type2 ? COLORS._FFFFFF : COLORS._0F172A,
                            fontFamily: FONTS.AEONIK_700,
                            fontSize: hp(1.9)
                        },
                        props.textStyles]}>
                        {props.title}</Text>
            }
        </TouchableOpacity>
    )
}

AuthButton.defaultProps = {
    title: 'title',
    onpress: () => { }
}

export default AuthButton

const styles = StyleSheet.create({
    main: {
        width: wp(79.2),
        height: hp(6.2),
        alignSelf: 'center',
        marginTop: hp(3),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
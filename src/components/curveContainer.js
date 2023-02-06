import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, height } from '../utils/common'
import AppHeader from './appHeader'

const CurveContainer = ({children}) => {
  return (
    <View style={styles.main}>
        <AppHeader />
        <View style={styles.container}>
            {children}
        </View>
    </View>
  )
}

export default CurveContainer

const styles = StyleSheet.create({
    main :{
        width :'100%',
        height : height * 0.46,
        backgroundColor : COLORS._0F172A,
        borderBottomLeftRadius :30,
        borderBottomRightRadius :30,
        zIndex :1000,
        elevation : 4
    },
    container :{
        borderColor :COLORS._FFFFFF,
        // borderWidth:2,
        flex:1,
        paddingHorizontal :'5%'
    }
})
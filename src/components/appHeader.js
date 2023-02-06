import { StyleSheet, Text, View ,Image, TouchableOpacity, Platform} from 'react-native'
import React from 'react'
import { COLORS, hp } from '../utils/common'
import { Menu } from '../assets/svg'
import { useNavigation } from '@react-navigation/native'
import { SCREEN } from '../enums/AppEnums'

const AppHeader = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.main}>
     <Image 
        source={require("../assets/images/logo_.png")}
        style={styles.image}
     />

     <TouchableOpacity onPress={() => navigation.navigate(SCREEN.MENU)}>
        <Menu width={hp(2.5)} height={hp(2.5)}/>
     </TouchableOpacity>
    </View>
  )
}

export default AppHeader

const styles = StyleSheet.create({
    main :{
        borderColor :COLORS._FFFFFF,
        // borderWidth:2,
        flexDirection :'row',
        width :'100%',
        height : hp(9),
        alignItems:'center',
        justifyContent :'space-between',
        paddingHorizontal:'5%',
        marginTop : 35

    },
    image :{
        width : hp(6.5),
        height :hp(4),
        resizeMode:'contain'
    }
})
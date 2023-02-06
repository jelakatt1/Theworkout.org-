import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Platform,
  } from 'react-native';
  import React, {useState} from 'react';
  import {COLORS, FONTS, hp, wp} from '../../utils/common';
  import If from '../if';
import { Colors } from 'react-native/Libraries/NewAppScreen';
  
  const CustomInput = props => {
  
    const [isSecureTextEntry, setisSecureTextEntry] = useState(true);
    const [isFocus, setisFocus] = useState(false);
    const {Icon, isError} = props;

    return (
      <View style={[Styles.mainContainer, props.style]}>
        <View
          style={[
            Styles.inputContainer,
            props.containerstyle,
          ]}>
          <If condition={Icon}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={[Styles.iconContainer]}
              onPress={() => props.IconPress()}>
              {Icon}
            </TouchableOpacity>
          </If>
          <TextInput
            style={[
              Styles.inputStyle,
              {
                color: '#9D9FA3',
                paddingLeft: Icon ? 0 : 20,
              },
              props?.textStyles,
            ]}
            secureTextEntry={props.isPassword ? isSecureTextEntry : false}
            placeholder={props.placeholder}
            value={props.value && props.value}
            placeholderTextColor={props?.placeholderColor || COLORS._DDDDDD}
            onFocus={() => setisFocus(true)}
            onBlur={() => setisFocus(false)}
            onChangeText={txt => props.onChange(txt)}
            editable={props.editable}
            cursorColor={COLORS._0F172A}
            keyboardType={props.keyboardType}
          />
          <If condition={props.RightIcon}>
            <TouchableOpacity
              style={[Styles.iconContainer, {paddingRight: '3%'}]}
              onPress={() => props.RightIconPress()}>
              {
                props.RightIcon ?
                props.RightIcon 
                :
              //   <Feather
              //   name={isSecureTextEntry ? 'eye-off' : 'eye'}
              //   color={COLORS._DDDDDD}
              //   size={16}
              // />
              null
              }
            </TouchableOpacity>
          </If>
        </View>
      </View>
    );
  };
  
  CustomInput.defaultProps = {
    title: 'title',
    placeholder: 'placeholer',
    onChange: () => {},
    isPassword: false,
    isError: false,
    IconPress: () => {
      console.log('IconPress');
    },
    editable: true,
    keyboardType:"default",
    RightIconPress : ()=>{}
  };
  
  const Styles = StyleSheet.create({
    mainContainer: {
      width: wp(79.2),
      alignSelf: 'center',
      marginTop: 15,
    },
    inputContainer: {
      // minHeight: 40,
      height: hp(6.5),
      maxHeight: 56,
      borderRadius: 10,
      flexDirection: 'row',
      backgroundColor : '#F9F9F9'
    },
    inputStyle: {
      flex: 1,
      // minHeight: 40,
      height: hp(6),
      maxHeight: 55,
      fontFamily: FONTS.AEONIK_400,
      fontSize: hp(1.75),
      textAlignVertical:'center',
      bottom : Platform.OS === 'ios' ? 1 : -2
    },
    iconContainer: {
      width: '15%',
      justifyContent :'center',
      alignItems:'center'
    },
  });
  
  export default CustomInput;
  
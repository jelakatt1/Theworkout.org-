import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tick } from '../assets/svg'
import { COLORS } from '../utils/common'
import If from './if'

const ChekBox = (props) => {
    let size = props.size ? props.size : 22
    return (
        <TouchableOpacity style={[{
            width: size,
            height: size,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: !props.checked ? COLORS._F8F8F8 : COLORS._017EFA
        }]}
            activeOpacity={1}
            onPress={() => props.onToggle()}
        >
            <If condition={true}>
                <Tick width={size * 0.7} height={size * 0.7} />
            </If>

        </TouchableOpacity>
    )
}

export default ChekBox

const styles = StyleSheet.create({

})
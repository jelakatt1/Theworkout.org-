import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const FONTS = {
    AEONIK_100 : 'Aeonik-Thin',
    AEONIK_300 : 'Aeonik-Light',
    AEONIK_400 : 'Aeonik-Regular',
    AEONIK_500 : 'Aeonik-Medium',
    AEONIK_600 : 'Aeonik-Bold',
    AEONIK_700 : 'Aeonik-Bold',
    AEONIK_900 : 'Aeonik-Black',
}

const COLORS = {
    _FFFFFF: "#FFFFFF",
    _000000: "#000000",
    _F2C94C: "#F2C94C",
    _017EFA: "#017EFA",
    _0F172A: "#0F172A",
    _F8F8F8: "#F8F8F8",
    _5B606B: "#5B606B",
    _929292: "#929292",
    _FFA412: "#FFA412",
    _E4E4E4: "#E4E4E4",
    _A5AFBC :"#A5AFBC",
    red : '#F44234'
}

export {
    COLORS,
    FONTS,
    width,
    height,
    wp,
    hp
}
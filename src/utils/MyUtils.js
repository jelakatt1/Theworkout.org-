import {passwordStrength} from 'check-password-strength';
import { COLORS } from '../utils/common'
import { showMessage } from "react-native-flash-message";
import { Share, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';


const hideemail = email => {
  var hiddenEmail = '';
  if (email)
    for (let i = 0; i < email.length; i++) {
      if (i > 2 && i < email.indexOf('@')) {
        hiddenEmail += '*';
      } else {
        hiddenEmail += email[i];
      }
    }
  return hiddenEmail;
};

const passowrdStrength = (txt, callBack) => {
  const strength = passwordStrength(txt).id;
  if (strength > 1) {
    return true;
  } else {
    return false;
  }
};


const getCurrentDate = (item) => {
  let date = new Date()
  if (item?.opening_hours?.length != 0) {
    return item?.opening_hours[date.getDay() - 1]
  } else {
    return null
  }
}

const showFlash = (msg) => {
  showMessage({
      message: msg,
      floating : true,
      backgroundColor: COLORS._F2C94C,
      color: '#000',
      style:{marginTop: 35}
      
    });
}

const onShare = async (contact) => {
  try {
    const result = await Share.share({
      message:
      Platform.OS == 'ios' ?
      `http://apps.apple.com/<country>/app/<app–name>/id<store-ID>`
      :
      `https://play.google.com/store/apps/details?id=${VersionCheck.getPackageName()}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

export {hideemail, passowrdStrength, getCurrentDate, showFlash, onShare};

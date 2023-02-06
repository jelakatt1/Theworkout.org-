
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';


const handleContactsPermssions = async(callBack) => {
    
        check(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CONTACTS
            : PERMISSIONS.ANDROID.READ_CONTACTS,
        ).then(result => {
          if (result === RESULTS.GRANTED) {
            callBack()
          } else {
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.CONTACTS
                : PERMISSIONS.ANDROID.READ_CONTACTS,
            ).then(result => {
              if (result === RESULTS.GRANTED) {
                callBack()
              }
              check(
                Platform.OS === 'ios'
                  ? PERMISSIONS.IOS.CONTACTS
                  : PERMISSIONS.ANDROID.READ_CONTACTS,
              ).then(result => {
                if (result === RESULTS.GRANTED) {
                    callBack()
                }
              });
            });
          }
        });

}


export {
    handleContactsPermssions
}
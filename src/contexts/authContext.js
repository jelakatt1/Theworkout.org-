import React, { createContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { getDocData, getAllOfCollectionwhere } from '../services/firebaseServices';
import { COLLECTION } from '../utils/collections';
import auth from '@react-native-firebase/auth';
import { handleContactsPermssions } from '../utils/permissionHandler'
import Contacts from 'react-native-contacts';
import { Platform } from 'react-native';
export const AuthContext = new createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setuserData] = useState(null);
  const defaultAvatar = 'https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png'
  const [contactsList, setcontactsList] = useState([])
  const [isLoading, setisLoading] = useState(true)
  const [existsArray, setexistsArray] = useState([])
  const [selectedFriend, setselectedFriend] = useState({})
  const [selectedContact, setselectedContact] = useState({})
  const [fitsLimit, setfitsLimit] = useState(0)
  const [endLimit, setendLimit] = useState(10)
  const [isMoreAvailable, setisMoreAvailable] = useState(true)
  const [isContactsLoading, setisContactsLoading] = useState(true)

  function onAuthStateChanged(user) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


  useEffect(() => {
    if (user) {
      getUser()
    }
  }, [user?.uid,]);


  const getUser = async (uid = user?.uid) => {
    let data = await getDocData(COLLECTION.USER, uid)
    setuserData({ ...data, uid: uid })
    // alert(JSON.stringify(data))
  }


  /***
   * CONTACTS
   * **/
  const getContacts = (callBack) => {
    setisLoading(true)
    setisContactsLoading(true)
    Contacts.getAll()
      .then(async (contacts) => {
        let sorted = []
        if (Platform.OS === 'ios') {
           sorted = contacts.slice(fitsLimit,endLimit).sort((a, b) => a.givenName.localeCompare(b.givenName))
        } else {
           sorted = contacts.slice(fitsLimit,endLimit).sort((a, b) => a.displayName.localeCompare(b.displayName))

        }
        if(contacts?.length > endLimit){
          setfitsLimit(fitsLimit + 10)
          setendLimit(endLimit + 10)
        }

        if(contacts?.length > (endLimit + 10)){
          setisMoreAvailable(true)
        } else {
          setisMoreAvailable(false)
        }

        setcontactsList((prev) => [...prev, ...sorted])
        checkNumber(sorted)
        console.log("CONTACTS =======>>>", JSON.stringify(contacts.length));
      })
      .catch((e) => {
        console.log(e)
        setisLoading(false)
        setisContactsLoading(false)
      })
    
  }

  const getContacts_ = () => {
    handleContactsPermssions(() => getContacts())
  }

  const checkNumber = async (numberArray) => {
    // setexistsArray([])
    await numberArray.forEach(async (contact) => {
      let lastEight = contact?.phoneNumbers[0]?.number ? 
      contact?.phoneNumbers[0]?.number.replace(/-/g, '') : "";
      lastEight = lastEight.replace('(', '');
      lastEight = lastEight.replace(')', '');
      lastEight = lastEight.replace(/ /g, '');
      lastEight = lastEight.substr(lastEight.length - 8);
      console.log('====================================');
      console.log(lastEight);
      console.log('====================================');
      const exists = await getAllOfCollectionwhere(COLLECTION.USER, 'lastEight', lastEight)
      if (exists?.length > 0) {
        setexistsArray((prev) => [...prev, { userData: exists[0], ...contact }])
      } else {
        setexistsArray((prev) => [...prev, contact])
      }
    })
    setisLoading(false)
    setisContactsLoading(false)
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userData,
        setuserData,
        getUser,
        defaultAvatar,
        getContacts,
        contactsList,
        setcontactsList,
        isLoading,
        setisLoading,
        getContacts_,
        existsArray,
        setexistsArray,
        checkNumber,
        selectedFriend,
        setselectedFriend,
        selectedContact,
        setselectedContact,
        isMoreAvailable, 
        setisMoreAvailable,
        isContactsLoading, 
        setisContactsLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
};
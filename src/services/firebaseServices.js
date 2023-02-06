import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert, Platform } from 'react-native';
import { collections } from '../utils/collections';
import storage from '@react-native-firebase/storage';
import { showFlash } from '../utils/MyUtils';


export async function saveData(collection, doc, jsonObject) {
  console.log(collection, doc, jsonObject);
  await firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
  console.log('Document successfully written!');
}

export async function registerUser({ firstName, lastName, email, number, date, }) {
  let lastEight = number.replace(/-/g, '');
  lastEight = lastEight.replace('(', '');
  lastEight = lastEight.replace(')', '');
  lastEight = lastEight.replace(/ /g, '');
  lastEight = lastEight.substr(lastEight.length - 8);
  // Get current date
  var date_ = new Date();
  // Substract 14 days to current date
  date_.setDate(date_.getDate());
  // DATE IN UNIX ==>>>
  const unixDate = Math.floor(new Date(date_) / 1000)
  await saveData('users', auth().currentUser.uid, {
    firstName,
    lastName,
    email,
    date,
    number,
    userId: auth().currentUser.uid,
    createdAt: unixDate,
    lastEight: lastEight
  });

  return {
    firstName,
    lastName,
    email: email,
    date: date,
    number,
    userId: auth().currentUser.uid,
    lastEight: lastEight
  };
}

export async function LoginemailAuth(email, password, callBack, setIsLoading) {
  return await auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (data) => {
      const fcmToken = 'TODO';
      await saveData('users', data?.user?.uid, { fcmToken });
      callBack();
      return 'Done';
    })
    .catch(error => {
      setIsLoading(false)
      console.log(error.code, 'error code is');
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        Alert.alert(
          "FAILED",
          "That email address is already in use!",
          [
            {
              text: "OK",
              onPress: () => { },
            }
          ]
        );
        return 'That email address is already in use!';
      }
      if (error.code === 'auth/wrong-password') {
        showFlash('Please enter a valid password!')
        return 'Please enter a valid password!';
      }

      if (error.code === 'auth/user-not-found') {
        Alert.alert(
          "FAILED",
          "No user found for the given email",
          [
            {
              text: "OK",
              onPress: () => { },
            }
          ]
        );
        return 'Done';
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        Alert.alert(
          "FAILED",
          "The given emailis invalid",
          [
            {
              text: "OK",
              onPress: () => { },
            }
          ]
        );
        return 'That email address is invalid!';
      }

      console.error(error);
    });
}

export async function saveDataInDoc_2(
  collection,
  doc_1,
  subCollection,
  doc_2,
  jsonObject,
) {
  await firestore()
    .collection(collection)
    .doc(doc_1)
    .collection(subCollection)
    .doc(doc_2)
    .set(jsonObject, { merge: true })
    .then(() => { })
    .catch(error => console.log(error));
}

export async function updateDocument(
  collection,
  conditionField,
  operator,
  conditionValue,
  fields,
) {
  await firestore()
    .collection(collection)
    .where(conditionField, operator, conditionValue)
    .update(fields);

  return true;
}

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectionwhere(collection, key, id) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, '==', id)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export async function getAllOfCollectiondoublewhere(
  collection,
  key,
  id,
  key1,
  id1,
) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, '==', id)
    .where(key1, '==', id1)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export async function getAllOfCollectiondoublewhere3(
  collection,
  key,
  id,
  key1,
  id1,
  key2,
  id2,
) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, '==', id)
    .where(key1, '==', id1)
    .where(key2, '==', id2)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function Delete(collection, doc) {
  await firestore().collection(collection).doc(doc).delete();
}

export async function getDoc(collection, doc) {
  let found = false;
  await firestore()
    .collection(collection)
    .doc(doc)
    .get()
    .then(function (doc) {
      found = doc.exists;
    });
  return found;
}

export async function getDocData(collection, doc) {
  let found = {};
  await firestore()
    .collection(collection)
    .doc(doc)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        found = { ...doc.data(), doc_id: doc?.id };
      }
    })
  return found;
}

export async function getDataInDoc_2(collection, doc_1, subCollection, doc_2) {
  let found = {};

  await firestore()
    .collection(collection)
    .doc(doc_1)
    .collection(subCollection)
    .doc(doc_2)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        found = { ...doc.data(), doc_id: doc?.id };
      }
    })
    .catch(error => console.log('==>>', error));

  return found;
}

export async function getAllOfSubCollection(collection, docId, subCollection) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .doc(docId)
    .collection(subCollection)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectionQuery(collection, key, query, id) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, query, id)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectiondoubleQuery(
  collection,
  key,
  query1,
  id,
  key1,
  query2,
  id1,
) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, query1, id)
    .where(key1, query2, id1)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getAllOfCollectioTripleQuery(
  collection,
  key,
  query,
  id,
  key1,
  query1,
  id1,
  key3,
  query2,
  id3,
) {
  let data = [];
  let querySnapshot = await firestore()
    .collection(collection)
    .where(key, query, id)
    .where(key1, query1, id1)
    .where(key3, query2, id3)
    .get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc.data(), doc_id: doc?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function addInColl_2(collection, doc, collection2, jsonObject) {
  await firestore()
    .collection(collection)
    .doc(doc)
    .collection(collection2)
    .add(jsonObject)
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
  console.log('Document successfully written!');
}

// AUTH FUNCTIONS

export async function emailAuth(email, password) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      return 'Done';
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        return 'That email address is already in use!';
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        return 'That email address is invalid!';
      }

      console.error(error);
    });
}



export async function logout(userId, callBack) {
  auth()
    .signOut()
    .then(async () => {
      await saveData('users', userId, { fcmToken: '' });
      callBack({})
    });
}

// UPDATE EMAIL
export const UpdateEmail = (email, password, callBack, getUser) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(auth().currentUser.email, password)
    .then(function (userCredential) {
      userCredential.user
        .updateEmail(email)
        .then(() => {
          firestore()
            .collection(collections.users)
            .doc(user.uid)
            .update({
              email: email,
            })
            .then(() => {
              console.log('Done Updating Email in FireStore');
              getUser()
              callBack();
            });
        })
        .catch(error => {
          console.log('Error Updating Email in FireStore');
          Alert.alert(
            "FAILED",
            "Error updating email, this email might already be registered",
            [
              {
                text: "OK",
                onPress: () => { },
              }
            ]
          );
          callBack();
        });
    })
    .catch(error => {
      console.log(error);
      callBack();
    });
  callBack();
};

// *****
// STORAGE FUNCTIONS
// *****
const uploadImage = async (path,) => {
  const uri = path;
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

  const task = storage()
    .ref(filename)
    .putFile(uploadUri);
  // set progress state
  task.on('state_changed', snapshot => {

    console.log(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000);
  });

  try {
    await task;
    const url = await storage()
      .ref(filename).getDownloadURL();
    return url
  } catch (e) {
    console.error(e);
    return "false"
  }
  return "false"

};

export {
  uploadImage
}


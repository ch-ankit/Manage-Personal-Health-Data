import firebase from 'firebase'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBr8D7rInEW7JAjC26_OwFO1RkSK4zECM4",
    authDomain: "mhpd-652a9.firebaseapp.com",
    projectId: "mhpd-652a9",
    storageBucket: "mhpd-652a9.appspot.com",
    messagingSenderId: "452942597954",
    appId: "1:452942597954:web:51ce67a92c98e79ad782db",
    measurementId: "G-3ZN5GBBVX1"
  };

const firebaseApp=firebase.initializeApp(firebaseConfig);
const storage=firebase.storage();

export default storage;
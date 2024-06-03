// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCJx01C4jix-aqFXfE13EfLTwm6_ygpYhc',
  authDomain: 'pollotragonapp.firebaseapp.com',
  projectId: 'pollotragonapp',
  storageBucket: 'pollotragonapp.appspot.com',
  messagingSenderId: '58442434849',
  appId: '1:58442434849:web:0246fa9a6fe0f7c0991660',
  measurementId: 'G-6XGNEBPR6D',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

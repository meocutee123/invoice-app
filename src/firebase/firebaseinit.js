import firebase from "firebase/app";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD-3bQSaCBLTaAvPgmBGz7PWXL5iiAIFqg",
  authDomain: "getting-started-613bf.firebaseapp.com",
  databaseURL: "https://getting-started-613bf-default-rtdb.firebaseio.com",
  projectId: "getting-started-613bf",
  storageBucket: "getting-started-613bf.appspot.com",
  messagingSenderId: "102660532491",
  appId: "1:102660532491:web:d5720a8f73bb8b4a519a0e",
  measurementId: "G-MD7R5CDFPT",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export default firebaseApp.firestore();

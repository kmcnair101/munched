"use client";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAgMF6YMa7z12HfzZ6qIy3cUuTyzigcD6M",
  authDomain: "munched-43b6d.firebaseapp.com",
  projectId: "munched-43b6d",
  storageBucket: "munched-43b6d.appspot.com",
  messagingSenderId: "232470103712",
  appId: "1:232470103712:web:5240f719f2a8dea3412bc5",
  measurementId: "G-Z8KVKCD1Z7",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const db = firebase.firestore();

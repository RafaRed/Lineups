import React from 'react'
import firebase from '../../services/firebase';

export async function getUsername(){
    return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
        resolve(user.email)
        
      })
    });
}
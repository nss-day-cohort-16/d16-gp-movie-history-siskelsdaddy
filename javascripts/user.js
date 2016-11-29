"use strict";
let firebase = require("./fb-config"),
    provider = new firebase.auth.GoogleAuthProvider(),
    currentUser = null;

//listen for changed state
firebase.auth().onAuthStateChanged(function(user){
    if (user){
        currentUser = user.uid;
        console.log("current user Logged in?", currentUser);
        $("#signIn").addClass("hide");
        $("#signOut").removeClass("hide");
    }else {
        currentUser = null;
        console.log("current user NOT logged in:", currentUser);
        $("#signOut").addClass("hide");
        $("#signIn").removeClass("hide");
    }
});

function logInGoogle() {
    //all firebase functions return a promise!! Add a then when called
    return firebase.auth().signInWithPopup(provider); 
}

function logOut(){
    return firebase.auth().signOut();
}
function getUser(){
    return currentUser;
}

module.exports = {logInGoogle, logOut, getUser};
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';
import {useState} from 'react';

class FirebaseManager{
    
    constructor(firestore){
        this.db = firestore
        this.usersRef = firestore.collection('users');
        this.subredditRef = firestore.collection('subreddit')
    }

    // Check if the user exist, and returns its information if there is any
    referenceUser(uid){
        // console.log("referencing user")
        let user = this.usersRef.doc(uid).get()
        .then((docContent)=>{
            let result 
            // If the user exist
            if(docContent.data()){
                let data = docContent.data();
                if(data.username){
                    // If there is data about this user, resturn it
                    result = data;
                }else{
                    // If there is no data, just return true (the user exist)
                    result = true;
                }
            }else{
                // if the user does not exist, return false 
                result =  false
                // console.log("user doesn't exist")
            }
            return result
        })
        return user
    }

    // Creates a new user in the database from an id
    addUser(user){
        return this.usersRef.doc(user.uid).set({email: user.email}).then(()=>{return true})
    }

    // Get the information of an existent user based on it's id
    getUserInfo(uid){
        let userInfo = this.usersRef.doc(uid).get()
            .then((docContent)=>{ 
                return docContent.data()
            })
        return userInfo
    }

    // Register the information for an existent user
    registerUserInfo(uid, info){
        return this.usersRef.doc(uid).update(info).then(()=>{return true})
    }

    registerSubredditInfo(display_name, info) {
        return this.subredditRef.doc(display_name).set(info, {merge: true}).then(()=>{return true})
    }

    registerUserSubreddit(display_name, info, user) {
        var uid = user.uid
        var docRef;
        // Create user document if it doesn't exist
        return this.usersRef.doc(uid).set({email: user.email}, {merge: true}).then(()=>{
            docRef = this.usersRef.doc(uid).collection('subreddit').doc(display_name)
            // Don't overwrite is_visible nor is_favorite
            docRef.get()
            .then((docContent) => {
                if (docContent.data()) {
                    var data = docContent.data()
                    var curr_is_visible = data.is_visible
                    var curr_is_favorite = data.is_favorite
                    info.is_favorite = curr_is_favorite ? true : false;
                    info.is_visible = curr_is_visible ? true : false;
                }
                // Store info about this user on the subreddit
                return docRef.set(info, {merge: true}).then(()=>{return true})
            });
        })
    }

    getUserVisibleSubreddits(uid) {
        this.usersRef.doc(uid).collection("subreddit").where("is_visible", "==", true).get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                var userData = userDoc.data()
                var name = userDoc.id
                var promise = this.subredditRef.doc(name).get().then((subDoc) => {
                    var subData = subDoc.data()
                    var info = {
                        is_favorite: subData.is_favorite,
                        is_reddit_favorite: subData.is_reddit_favorite,
                        is_visible: subData.is_visible,
                        subreddit: subData,
                    }
                    return {name: info}
                })
                promises.push(promise)
            })
            // When all the documents are done being stupid
            Promise.all(promises).then((subreddits) => {
                console.log(subreddits)
            });
        })
    }

    getMessages(uid1, uid2){

        // TODO add .where("accepted", "==", true)
        var messagesRef = this.usersRef.doc(uid1).collection('messages').doc(uid2).collection('chat');

        function GetMessages(){
            const query = messagesRef.orderBy('createdAt');
            const [messages] = useCollectionData(query, { idField: 'id' }); 
            return messages;
        }
        var messages = GetMessages();

        return [messagesRef, messages];
    }

    getTimestamp(){
        return firebase.firestore.FieldValue.serverTimestamp();
    }

}
export default FirebaseManager;
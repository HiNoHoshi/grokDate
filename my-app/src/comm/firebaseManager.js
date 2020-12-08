import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';
import {auth, storage } from '../comm/firebaseCredentials'

class FirebaseManager{

    constructor(firestore){
        this.db = firestore
        this.usersRef = firestore.collection('users');
        this.subredditRef = firestore.collection('subreddit')
        this.getAllOtherUsers = this.getAllOtherUsers.bind(this)
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

    // Get the information of an existent user including communities
    getUserExtendedInfo(uid){
        let userInfo = this.usersRef.doc(uid).get()
            .then((docContent)=>{ 
                var userExtendedInfo = docContent.data()
                let [year, month, day] = userExtendedInfo.birthdate.split('-')
                userExtendedInfo.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userExtendedInfo.location = userExtendedInfo.city + ', ' + userExtendedInfo.country
                return this.getUserSubreddits(uid).then((subs) =>{
                    return {...userExtendedInfo,
                    subreddits: subs}
                }) 
            })
        return userInfo
    }

    listenToUserExtendedInfo(uid, updateComponent){

        return this.usersRef.doc(uid)
            .onSnapshot((docContent)=>{ 
                var userExtendedInfo = docContent.data()
                let [year, month, day] = userExtendedInfo.birthdate.split('-')
                userExtendedInfo.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userExtendedInfo.location = userExtendedInfo.city + ', ' + userExtendedInfo.country
                return this.getUserSubreddits(uid).then((subs) =>{
                    updateComponent({...userExtendedInfo, subreddits: subs}) 
                }) 
            })
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
            return docRef.get().then((docContent) => {
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

    // Updates the visivility of the communities and the favorite community for the user
    updateUserCommunities(uid, communities, fav){
        const ref = this.usersRef.doc(uid).collection("subreddit")
        for(let c in communities){
                ref.doc(c).update({is_visible: communities[c].is_visible})
            if(c ===fav){
                ref.doc(c).update({is_favorite: true})
            }else{
                ref.doc(c).update({is_favorite: false})
            }
        }
    }

    
    listenToRedditSynch(uid, loadSubs) {
        return this.usersRef.doc(uid).collection("subreddit")
        .onSnapshot(function(querySnapshot) {
            var subs = {}

            querySnapshot.forEach(function(doc) {
                var subData = doc.data()
                var subName = doc.id


                subs[subName] = {
                    is_favorite: subData.is_favorite,
                    is_visible: subData.is_visible,
                }
            })
            loadSubs(subs)
            return subs
        });
    
    }


    getUserVisibleSubreddits(uid) {
        return this.usersRef.doc(uid).collection("subreddit").where("is_visible", "==", true).get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                // console.log(userDoc)
                var userData = userDoc.data()
                // console.log(userData)
                var name = userDoc.id
                var promise = this.subredditRef.doc(name).get().then((subDoc) => {
                    var subData = subDoc.data()
                    var info = {
                        is_favorite: userData.is_favorite,
                        is_reddit_favorite: userData.is_reddit_favorite,
                        is_visible: userData.is_visible,
                        subreddit: subData,
                    }
                    // console.log(info)
                    return {[name]: info}
                })
                promises.push(promise)
            })
            return Promise.all(promises)
        })
    }

    async getAllMessages(){
        var uid = auth.currentUser.uid;
        var messagesRef = this.usersRef.doc(uid).collection('messages');

        var requestIDs = [];
        var chatIDs = [];
        var requestUsernames = [];
        var chatUsernames = [];

        const snapshot = await messagesRef.get()
        snapshot.docs.map(doc => {
            var id = doc.id;
            var accepted = doc.data().accepted;
            var username = doc.data().username;
            console.log(username);
            if(accepted){
                chatIDs.push(id)
                chatUsernames.push(username)
            }
            else{
                requestIDs.push(id)
                requestUsernames.push(username)
            }
            console.log(doc.data())
        });
        return [requestIDs, chatIDs, requestUsernames, chatUsernames];
    }

    getMessagesBetween2Users(uid1, uid2){

        if(!uid1 || uid1.length === 0){
            uid1 = "NaN";
        }
        if(!uid2 || uid2.length === 0){
            uid2 = "NaN";
        }
        var messagesRef = this.usersRef.doc(uid1).collection('messages').doc(uid2);
        var collectionsRef = messagesRef ? messagesRef.collection('chat') : null;

        function RetrieveMessages(){
            const query = collectionsRef.orderBy('createdAt');
            const [messages] = useCollectionData(query, { idField: 'id' });
            return messages;
        }
        var messages = RetrieveMessages();

        return [messagesRef, collectionsRef, messages];
    }

    getTimestamp(){
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    // Returns the information about messages & requests (e.g. [uid: 123, is_req_accepted: false, ...])
    getAllContacts() {
        var uid = auth.currentUser.uid;
        var messagesRef = this.usersRef.doc(uid).collection('messages');

        return messagesRef.get().then((snapshot) => {
            let contacts = []
            snapshot.docs.map(doc => {
                var id = doc.id;
                var data = doc.data();
                data.uid = id;
                contacts.push(data);
            });
            return contacts
        })
    }

    getAllOtherUsers(my_uid) {
        return this.usersRef.get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                var userData = userDoc.data()
                var uid = userDoc.id
                // Don't include incomplete profiles
                if (!userData.username) {
                    return
                }
                userData.uid = uid
                let [year, month, day] = userData.birthdate.split('-')
                userData.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
                userData.location = userData.city + ', ' + userData.country

                if (userData.uid !== my_uid) {
                    var promise = this.getUserSubreddits(uid).then((subreddits) => {
                        userData.subreddits = subreddits
                        return userData
                    })
                    promises.push(promise)
                }
            })
            return Promise.all(promises)
        })
    }

    getUserProfileInfo(uid) {
        return this.usersRef.doc(uid).get().then((userDoc) => {
            var userData = userDoc.data()
            var uid = userDoc.id
            // Don't include incomplete profiles
            if (!userData.username) {
                console.log('Incomplete profile')
                return
            }
            userData.uid = uid
            let [year, month, day] = userData.birthdate.split('-')
            userData.age = (new Date()).getFullYear() - (new Date(year, month, day).getFullYear())
            userData.location = userData.city + ', ' + userData.country
            return this.getUserSubreddits(uid).then((subreddits) => {
                userData.subreddits = subreddits
                return userData
            })
        })
    }

    getUserSubreddits(uid) {
        return this.usersRef.doc(uid).collection("subreddit").get().then((querySnap) => {
            var promises = []
            querySnap.forEach((userDoc) => {
                // console.log(userDoc)
                var userData = userDoc.data()
                // console.log(userData)
                var name = userDoc.id
                var promise = this.subredditRef.doc(name).get().then((subDoc) => {
                    var subData = subDoc.data()
                    var info = {
                        is_favorite: userData.is_favorite,
                        is_reddit_favorite: userData.is_reddit_favorite,
                        is_visible: userData.is_visible,
                        subreddit: subData,
                    }
                    return {[name]: info}
                })
                promises.push(promise)
            })
            return Promise.all(promises)
        })
    }

    deleteUser(uid){
        console.log("Noooo, don't goooo")

        // send email
        this.db.collection("mail").add({
          to: "kalina@illinois.edu",
          message: {
            subject: "Grok.Date account deletion request",
            text: "Please delete user " + uid,
          },
        });

        return this.usersRef.doc(uid).delete();
    }

    getUsername(uid) {
        return this.usersRef.doc(uid).get().then((doc) => {
            let data = doc.data();
            return data.username;
        })
    }

    sendIcebreaker(icebreaker, sender_uid, reciever_uid, reciever_user) {
        console.log(icebreaker, sender_uid, reciever_uid, reciever_user);
        icebreaker.createdAt = this.getTimestamp();
        var sender_doc = this.usersRef.doc(sender_uid).collection('messages').doc(reciever_uid);
        let reciever_doc = this.usersRef.doc(reciever_uid).collection('messages').doc(sender_uid);
        let info = {
            is_req_accepted: false,
            is_req_declined: false,
            is_requester: true,
            username: reciever_user,
        }
        // Create/update sender's copy of chat
        return sender_doc.set(info, {merge: true}).then(() => {
            // Add icebreaker to sender's copy of chat
            return sender_doc.collection('chat').add(icebreaker).then(() => {
                info.is_requester = false;
                // Get username of sender
                return this.getUsername(sender_uid).then((sender_user) => {
                    info.username = sender_user
                    // Create/update reciever's copy of chat
                    return reciever_doc.set(info, {merge: true}).then(() => {
                        // Add icebreaker to recievers copy of chat
                        return reciever_doc.collection('chat').add(icebreaker).then(() => true);
                    })
                })
            })
        })
    }

    acceptRequest(my_uid, their_uid) {
        return this.usersRef.doc(my_uid).collection('messages').doc(their_uid).set({is_req_accepted: true}, {merge: true}).then(() => {
            return this.usersRef.doc(their_uid).collection('messages').doc(my_uid).set({is_req_accepted: true}, {merge: true}).then(() => true);
        });
    }

    declineRequest(my_uid, their_uid) {
        return this.usersRef.doc(my_uid).collection('messages').doc(their_uid).set({is_req_declined: true}, {merge: true}).then(() => {
            return this.usersRef.doc(their_uid).collection('messages').doc(my_uid).set({is_req_declined: true}, {merge: true}).then(() => true);
        });
    }

    getRecieverIcebreakerReason(reason) {
        return reason ? reason.replace("{sendr}", "them").replace("{sendr's}", "their").replace("{recvr}", "you").replace("{recvr's}", "your") : '';
    }

    getSenderIcebreakerReason(reason) {
        return reason ? reason.replace("{sendr}", "you").replace("{sendr's}", "your").replace("{recvr}", "them").replace("{recvr's}", "their") : '';
    }

    getIcebreakerInfo(my_uid, their_uid) {
        return this.usersRef.doc(my_uid).collection('messages').doc(their_uid).collection("chat").where('is_icebreaker', '==', true).orderBy('createdAt').get().then((snapshot) => {
            return snapshot.docs.slice(-1)[0].data();
        })
    }

}
export default FirebaseManager;
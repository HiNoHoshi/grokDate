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
        // Create user document if it doesn't exist
        this.usersRef.doc(uid).set({email: user.email}, {merge: true}).then(()=>{return true})
        var docRef = this.usersRef.doc(uid).collection('subreddit').doc(display_name)
        // Don't overwrite is_visible nor is_favorite
        docRef.get().then((docContent) => {
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
    }
}
export default FirebaseManager;
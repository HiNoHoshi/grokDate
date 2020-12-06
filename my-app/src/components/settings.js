import React from 'react'
import { auth } from '../comm/firebaseCredentials'


function settings(props)  {
// TODO: set a cloud funtion to delete the collections
// https://fireship.io/snippets/delete-firestore-collection/
    return  (
        
        <div className= 'settings-container'>
            <h3>Account settings</h3>
            <div style={{display:'inline-flex', 
                justifyContent: 'space-around',
                width: '100%'}}>
                <h4>Delete Account:</h4>
                <button className= "decline-button" onClick={()=>{
                    props.dbManager.deleteUser(auth.currentUser.uid).then(()=>{
                        props.SignOut()
                    })}}>Delete Account Permanently</button>
            </div>
           
        </div>
    );
    
}

export default settings;
import React from 'react'
import { auth } from '../comm/firebaseCredentials'


function settings(props)  {
// TODO: set a cloud funtion to delete the collections
// https://fireship.io/snippets/delete-firestore-collection/

    const itemStyle = {
        display: 'inline-flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center'
                    }
    const sectionStyle = {
        width: '80%',
        marginLeft: '2em',
        marginBottom: '2em'
    }
    return  (
        
        <div className= 'settings-container'>
            <h3>Account settings</h3>
            <div style = {sectionStyle}>
                <div style={itemStyle}>
                    <h4>Delete Account:</h4>
                    <button className= "decline-button" onClick={()=>{
                        props.dbManager.deleteUser(auth.currentUser.uid).then(()=>{
                            props.SignOut()
                        })}}>Delete Account Permanently</button>
                </div>
            </div>
            <h3>About grok.date</h3>
            <div style = {sectionStyle}>
                <div style={itemStyle}>
                    <h4>Privacy Policy</h4>
                    <a href ="https://docs.google.com/document/d/1WtTGWn2Fx6pdw4052BIB0xfOlUZf0qLouKvJao5Shtc/edit?usp=sharing"
                        target= "_blank">Read here</a>
                </div>
                <div style={itemStyle}>
                    <h4>Terms of Service</h4>
                    <a href ="https://docs.google.com/document/d/122qxArlLZWS7iEdxdioE1WD_RjjA4J9LQB8JAhqdv-g/edit?usp=sharing"
                        target= "_blank">Read here</a>
                </div>
            </div>
        </div>
    );
    
}

export default settings;
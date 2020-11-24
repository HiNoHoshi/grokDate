import React from 'react'

function Form (props){
    let input = props.data.input
    let errors = props.data.errors

    return  (
        <form>
            <div className = 'row'>
                <div className= "item">
                    <h4>Nickname</h4>
                    <input type="text" name="username" placeholder="Nickname" value={input.username} onChange={props.handleChange}/> 
                    <div className="form-error">{errors.username}</div>
                </div>
            </div>
            <div className = 'row'>
                <div className= "item">
                    <h4>birthdate</h4>
                    <input type="date" placeholder="mm/dd/yyyy" name= "birthdate" value={input.birthdate} onChange={props.handleChange}></input>    
                    <div className="form-error">{errors.birthdate}</div>
                </div>
                <div className= "item">
                    <h4>Location</h4>
                    <input type="text" name="country" placeholder="Country" value={input.country} onChange={props.handleChange}/>
                    <div className="form-error">{errors.country}</div>
                    <input type="text" name="city" placeholder="City" value={input.city} onChange={props.handleChange}/>
                    <div className="form-error">{errors.city}</div>
                </div>
            </div>
            <div className = 'row'>
                <div className= "item">
                    <h4>Gender</h4>               
                    <select name="gender" value = {input.gender} onChange={props.handleChange}>
                        <option value ="none" disabled> Select your gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Female Trans">Female Trans</option>
                        <option value="Male Trans">Male Trans</option>
                    </select>
                    <div className="form-error">{errors.gender}</div>
                </div>
                <div className= "item">
                    <h4>Looking for</h4>          
                    <select name="interest" value= {input.interest} onChange={props.handleChange}>
                        <option value ="none" disabled>Select your love interest</option>
                        <option value="Female">Woman</option>
                        <option value="Male">Man</option>
                        <option value="Female Trans">Woman or Man</option>
                    </select>
                    <div className="form-error">{errors.interest}</div>
                </div>
            </div>
            <div className = 'row'>
                <div className= "item">
                    <h4>Description</h4>          
                    <textarea name="description" value = {input.description} placeholder="Say something about you..." onChange={props.handleChange}/>
                    <div className="form-error">{errors.description}</div>
                </div>
            </div>
        </form>
    );
}
export default Form;
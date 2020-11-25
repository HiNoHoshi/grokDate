import React from 'react'
import Tag from './tagItem'

function InterestsContainer (props) {
    const tags = props.list.map(interest =><Tag key={interest} editable = {false} name={interest}/>)
    return  (
        <div className="interests-container">
            {props.favorite && 
                <div style={{display:'inline-flex', alignItems: 'center', margin:'0.3em'}}>
                    <span style={{fontSize:'0.75em', fontFamily: 'Courier New', fontWeight: 'bold'}}>#1</span>
                    <Tag image={props.favorite.image} name={props.favorite.name}/>
                </div>
            }
            <div>
                {tags}
            </div>
        </div>
        );
}

export default InterestsContainer;
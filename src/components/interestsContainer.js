import React from 'react'
import Tag from './tagItem'
import default_icon from '../images/logos/subreddit_default_icon.png'

function InterestsContainer (props) {
    var favorite = null
    var others = []
    for (let sub of props.subreddits) {
        let name = Object.keys(sub)[0]
        let info = sub[name]
        let {icon, link} = info.subreddit
        if (icon === '' || icon.endsWith('subreddit_default_icon.png')) {
            icon = default_icon
        }
        let {is_favorite, is_visible} = info
        if (is_visible) {
            if (!favorite && is_favorite) {
                favorite = {name: name, icon, link}
            } else {
                others.push({name: name, icon, link})
            }
        }
    }

    const tags = others.map(sub =><Tag key={sub.name} 
        editable={false} 
        name={sub.name} 
        image={sub.icon} 
        link={sub.link} 
        visible = {true}/>)
        
    return  (
        <div className="interests-container" style = {{ height: '100%', maxHeight: '9em', overflowY: 'scroll' }}>
            {favorite && 
                <div style={{display:'inline-flex', alignItems: 'center', margin:'0.3em'}}>
                    <span style={{fontSize:'0.75em', fontWeight: 'bold'}}>Favorite: </span>
                    <Tag 
                    image={favorite.icon} 
                    name={favorite.name} 
                    editable={false}
                    visible = {true} 
                    link={favorite.link} />
                </div>
            }
            <div style = {{marginTop:'1em'}}>
                {tags}
            </div>
        </div>
        );
}

export default InterestsContainer;
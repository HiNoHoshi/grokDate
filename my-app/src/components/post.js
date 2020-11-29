import React, {Component} from 'react'

class Post extends Component {
    getTextPreview(text, limit=50, suffix='...') {
        if (text.length > limit) {
            let preview = text.slice(0, limit - suffix.length)
            preview += suffix
            return preview
        }
        return text
    }

    render(){
        // let {author, awards, comments, id, link, sticky, subreddit, text, title, type, upvotes, url} = this.props.data
        let {link, subreddit, title} = this.props.data

        let title_preview = <a className= 'post-title' target="_blank" rel="noreferrer" href={link}>{this.getTextPreview(title, 40)}</a>

        var content_preview = null
        // if (type === 'text') {
        //     let preview_text = this.getTextPreview(text, 100)
        //     content_preview = <p className='post-text'>{preview_text}</p>
        // }
        // else if (type === 'url' || type === 'img') {
        //     let preview_url = this.getTextPreview(url, 20)
        //     content_preview = <a className='post-url' target="_blank" rel="noreferrer" href = {url}>{preview_url}</a>
        // } else if (type === 'img') {
        //     content_preview = <img className='post-img' onLoad={this.resizeImage} src={url} alt='post'></img>
        // } else if (type === 'gallery' || type === 'video' || type === 'blank') {
        //     content_preview = null
        // } else {
        //     console.log("Unknown post type ", type)
        // }

        return  (
        <div className="post-container light-border">
            <p className='subreddit-name'><a target="_blank" rel="noreferrer" href = {'https://www.reddit.com/r/'+subreddit}>{'r/' + subreddit}</a></p>
            {title_preview}
            {content_preview}
        </div>
        );
    }
}
export default Post;
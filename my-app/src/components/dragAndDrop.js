import React, {Component} from 'react';
import TagItem from './tagItem'

class DragAndDrop extends Component {

  constructor(){
    super();
    this.state = {
        favorite: null
      }
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    // this.handleDragLeave = this.handleDragLeave.bind(this);
  }
  // Adds a listener that calls loadSubs when the database is updated
  componentDidMount () {
    console.log(this.props.fav)
    this.setState({favorite: this.props.fav})
  }
  // If we drop a tag into the box, make it the favorite
  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e)
    this.setState({favorite: this.props.fav})
    this.props.setFavorite(this.props.fav)
  };

  // If we drag a tag into the box, get rid of the favorite
  handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e)
    this.setState({tagState: null, favorite: null})
    this.props.setFavorite(null)    
  };

  // Override default behavior so onDrop works
  handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e)
  };

  render(){
    let fav
    if(this.state.favorite){
      fav = <TagItem name = {this.state.favorite} 
                      editable= {false}
                      visible = {true}
                      selectTag = {this.props.selectTag}
                      />
    }

    return (
      <div className = "dropping-area" 
        onDrop={e => this.handleDrop(e)}
        onDragOver={e => this.handleDragOver(e)}
        onDragEnter={e => this.handleDragEnter(e)}
      // onDragLeave={e => this.handleDragLeave(e)}
      >

      {!this.state.favorite ? <span> Drag your favorite here</span> : <span style={{textAlign:'left'}}> Favorite:</span>}
      {fav}
        
      </div>
    );
  }
  
}
export default DragAndDrop;
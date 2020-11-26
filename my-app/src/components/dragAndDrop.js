import React, {Component} from 'react';
import TagItem from './tagItem'

class DragAndDrop extends Component {

  constructor(){
    super();
    this.state = {
        favorite: {},
        tagState: null
    }
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
  }

  handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({tagState: "dropped"})
  };
  
  handleDragEnter = e => {
    // e.preventDefault();
    // e.stopPropagation();
    this.setState({tagState: "inside"})

  };


  render(){
    let fav
    if(this.props.fav){
      fav = <TagItem name = {this.props.fav.name} editable= {this.props.fav.editable} is-visible = {this.props.fav.is_visible} selectAsFavorite = {this.props.fav.selectFavorite}/>
    }

    return (
      <div className = "dropping-area" onDrop={e => this.handleDrop(e)}
      // onDragOver={e => handleDragOver(e)}
      onDragEnter={e => this.handleDragEnter(e)}
      // onDragLeave={e => handleDragLeave(e)}
    >
      {!this.state.ragState ? <span> Drag your favorite here</span> : fav}
      {/* <div className={'drag-drop-zone'} */}
        
      </div>
    );
  }
  
}
export default DragAndDrop;
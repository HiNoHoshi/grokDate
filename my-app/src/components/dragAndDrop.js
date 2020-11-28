import React, {Component} from 'react';
import TagItem from './tagItem'

class DragAndDrop extends Component {

  constructor(){
    super();
    this.state = {
        favorite: null,
        tagState: null
    }
    this.handleDragOver = this.handleDragOver.bind(this);
    // this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
  }

  handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e)
    this.setState({tagState: "dropped", favorite: this.props.fav})
    this.props.setFavorite(this.props.fav)
  };
  
  handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();

    this.setState({tagState: null, favorite: null})
    this.props.setFavorite(null)    
  };

  // handleDragEnter = e => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   // console.log(e)
  //   this.setState({tagState: "dropped", favorite: this.props.fav})
  // };


  render(){
    let fav
    if(this.state.favorite){
      fav = <TagItem name = {this.state.favorite} 
                      editable= {false}
                      is-visible = {true}
                      selectTag = {this.props.selectTag}
                      />
    }

    return (
      <div className = "dropping-area" 
      // onDrop={e => this.handleDrop(e)}
      onDragOver={e => this.handleDragOver(e)}
      // onDragEnter={e => this.handleDragEnter(e)}
      onDragLeave={e => this.handleDragLeave(e)}>

      {!this.state.favorite ? <span> Drag your favorite here</span> : <span style={{textAlign:'left'}}> Favorite:</span>}
      {fav}
        
      </div>
    );
  }
  
}
export default DragAndDrop;
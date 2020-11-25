import React from 'react';

const DragAndDrop = props => {
  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();

  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    console.log("drop")
    console.log(e.target.id)

  };
  return (
    <div className = "dropping-area" onDrop={e => handleDrop(e)}
    onDragOver={e => handleDragOver(e)}
    onDragEnter={e => handleDragEnter(e)}
    onDragLeave={e => handleDragLeave(e)}
  >
    <span>Drag your favorite here</span>

    {/* <div className={'drag-drop-zone'} */}
      
    </div>
  );
};
export default DragAndDrop;
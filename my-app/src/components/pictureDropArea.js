import React, {useState, useRef} from 'react'

// Drag and drop component taken from: 
// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
function PictureDropArea(props){

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');


  const dragOver = (e) => {
    e.preventDefault();
  }

  const dragEnter = (e) => {
    e.preventDefault();
  }

  const dragLeave = (e) => {
    e.preventDefault();
  }

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }  
  }
  // validates if the file is an image of any kind 
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
  }

  // returns the droped file size
  const fileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  // returns the droped file type
  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  const removeFile = (name) => {
    setSelectedFiles([]);
}
  const handleFiles = (files) => {
      let lastIdx = files.length-1
      if (validateFile(files[lastIdx])) {
          // add to an array so we can display the name of file
          setSelectedFiles([files[lastIdx]]);
          showImage(files[lastIdx])

      } else {
        files[lastIdx]['invalid'] = true;
        setSelectedFiles([files[lastIdx]]);
        // set error message
        setErrorMessage('File type not permitted');
      }
    // }
  }
  const imageRef = useRef();

  const showImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      imageRef.current.src =  e.target.result;
      console.log(imageRef.width)

    }
    props.setPicture(file)
  }


  return (
    <div style={{alignContent:'center'}}>
      <div className = "picture-selection dropping-area" 
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave} 
        onDrop={fileDrop}>
          
          {selectedFiles.length 
            ? <img className="picture" ref={imageRef}/>
            :<span> Drag and drop your a square picture here</span> }

      </div>

      <div className="file-display-container">
        { selectedFiles.map((data, i) => 
          <div className="file-status-bar" key={i}>
            <div className="file-type-logo"></div>
            <div className="file-type">{fileType(data.name)}</div>
            <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
            <span className="file-size">({fileSize(data.size)})</span> 
            {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
            <div className="file-remove"onClick={() => removeFile(data.name)}></div>
          </div>
          )
        }
</div>
       
    </div>
  );
}

// }  
// }
export default PictureDropArea;
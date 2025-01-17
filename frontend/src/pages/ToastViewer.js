import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillViewer = ({ html }) => {
  return (
    <ReactQuill
      value={html}
      readOnly={true}
      theme="bubble" 
    />
  );
};

export default QuillViewer;


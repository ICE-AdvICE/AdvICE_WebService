import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const ToastEditor = ({ body, setBody }) => {
  const editorRef = useRef();

  const onChangeGetHTML = () => {
    const data = editorRef.current.getInstance().getHTML();
    setBody(data);
  };

  return (
    <Editor
      initialEditType="wysiwyg"
      hideModeSwitch={true}
      toolbarItems={[
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table'],
      ]}
      height="500px"
      previewStyle="vertical"
      ref={editorRef}
      onChange={onChangeGetHTML}
    />
  );
};

export default ToastEditor;

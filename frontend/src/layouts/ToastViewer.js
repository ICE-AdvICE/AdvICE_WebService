// Toast-UI Viewer 컴포넌트
import React from 'react';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

const ToastViewer = ({ html }) => {
  return <Viewer initialValue={html} />;
};

export default ToastViewer;

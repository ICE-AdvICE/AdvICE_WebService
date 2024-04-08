import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ArticleMain from './layouts/ArticleMain';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/article-main" element={<ArticleMain />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

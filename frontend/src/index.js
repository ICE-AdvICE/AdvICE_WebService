import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './layouts/HomePage';
import ArticleMain from './layouts/ArticleMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import CreatePage from './layouts/CreatePage';
import './layouts/css/NavBar.css';
ReactDOM.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/article-main" element={<ArticleMain />} />
      <Route path="/article-main/create" element={<CreatePage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

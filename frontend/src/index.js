import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './layouts/HomePage';
import ArticleMain from './layouts/ArticleMain';
import CodingMain from './layouts/Coding-zone/CodingMain';
import Codingzone_Attendence from './layouts/Coding-zone/Codingzone_Attendence';
import EditPage from'./layouts/EditPage';
import NavBar from './components/NavBar';
import CreatePage from './layouts/CreatePage';
import ShowPage from './layouts/ShowPage';
import './layouts/css/NavBar.css';
ReactDOM.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/article-main" element={<ArticleMain />} />
      <Route path="/article-main/create" element={<CreatePage />} />
      <Route path="/article-main/:articleNum/edit" element={<EditPage />} />
      <Route path="/article-main/:articleNum" element={<ShowPage />} />
      <Route path="/coding-zone/CodingMain" element={<CodingMain />} />
      <Route path="/coding-zone/Codingzone_Attendence" element={<Codingzone_Attendence />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

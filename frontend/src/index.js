import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './layouts/HomePage';
import ArticleMain from './layouts/ArticleMain';
import CodingMain from './layouts/Coding-zone/CodingMain';
import EditPage from './layouts/EditPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CreatePage from './layouts/CreatePage';
import ShowPage from './layouts/ShowPage';
import './layouts/css/NavBar.css';

const App = () => {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/article-main" element={<ArticleMain />} />
        <Route path="/article-main/create" element={<CreatePage />} />
        <Route path="/article-main/:articleNum/edit" element={<EditPage />} />
        <Route path="/article-main/:articleNum" element={<ShowPage />} />
        <Route path="/coding-zone" element={<CodingMain />} />
      </Routes>
      {location.pathname !== '/' && <Footer />}
    </>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

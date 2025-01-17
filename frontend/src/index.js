import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './pages/HomePage';
import ArticleMain from './pages/Article/ArticleMain';
import CodingMain from './pages/Coding-zone/CodingMain';
import EditPage from './pages/Article/EditPage';
import CodingClassRegist from './pages/Coding-zone/CodingClassRegist';
import Codingzone_Manager from './pages/Coding-zone/Codingzone_Manager';
import Codingzone_Attendence from './pages/Coding-zone/Codingzone_Attendence';
import Codingzone_All_Attend from './pages/Coding-zone/Codingzone_All_Attend';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CreatePage from './pages/Article/CreatePage';
import ShowPage from './pages/Article/ShowPage';
import AuthHandle from './pages/AuthHandle';
 

const App = () => {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth-handle" element={<AuthHandle />} /> 
        <Route path="/article-main" element={<ArticleMain />} />
        <Route path="/article-main/create" element={<CreatePage />} />
        <Route path="/article-main/:articleNum/edit" element={<EditPage />} />
        <Route path="/article-main/:articleNum" element={<ShowPage />} />
        <Route path="/coding-zone" element={<CodingMain />} />
        <Route path="/coding-zone/coding-class-regist" element={<CodingClassRegist />} />
        <Route path="/coding-zone/Codingzone_Manager" element={<Codingzone_Manager />} />
        <Route path="/coding-zone/Codingzone_Attendance" element={<Codingzone_Attendence />} />
        <Route path="/coding-zone/Codingzone_All_Attend" element={<Codingzone_All_Attend />} />
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

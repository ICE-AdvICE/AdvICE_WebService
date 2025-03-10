import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Main from '../pages/HomePage/HomePage';
import ArticleMain from '../pages/ArticlePage/ArticleMain';
import CodingMain from '../pages/Coding-zone/CodingZoneMain';
import EditPage from '../pages/ArticlePage/Components/EditPage';
import CodingClassRegist from '../pages/Coding-zone/CodingZoneRegist';
import CodingZoneAttendanceAssistant from '../pages/Coding-zone/CodingZoneAttendanceAssistant';
import CodingZoneMyAttendance from '../pages/Coding-zone/CodingZoneMyAttendance';
import CodingZoneAttendanceManager from '../pages/Coding-zone/CodingZoneAttendanceManager';
import NavBar from '../widgets/layout/Header/Navbar';
import Footer from '../widgets/layout/Footer/Footer';
import CreatePage from '../pages/ArticlePage/Components/CreatePage';
import ShowPage from '../pages/ArticlePage/Components/ShowPage';
import AuthHandle from '../pages/AuthHandle';

const App = () => {
  const location = useLocation();
  const hideFooterPaths = ['/', '/auth-handle']; // Footer를 숨길 페이지 설정

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
        <Route path="/coding-zone/Codingzone_Manager" element={<CodingZoneAttendanceAssistant />} />
        <Route path="/coding-zone/Codingzone_Attendance" element={<CodingZoneMyAttendance />} />
        <Route path="/coding-zone/Codingzone_All_Attend" element={<CodingZoneAttendanceManager />} />
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default App;

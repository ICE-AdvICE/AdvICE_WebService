import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { getArticleListRequest } from '../apis';
import './css/BlogPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesState, setArticlesState] = useState([]);
    const articlesPerPage = 8;
    const totalPages = Math.ceil(articlesState.length / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articlesState.slice(indexOfFirstArticle, indexOfLastArticle);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const deleteArticle = async (articleNum) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/v1/article/${articleNum}`);
            if (response.data.code === "SU") {
                // 성공적으로 삭제되면, 상태를 업데이트합니다.
                const filteredArticles = articlesState.filter(article => article.articleNum !== articleNum);
                setArticlesState(filteredArticles);
            } else {
                console.error('게시글 삭제 실패:', response.data.message);
            }
        } catch (err) {
            console.error("게시글 삭제 요청 중 오류 발생:", err);
            alert('게시글 삭제 중 오류가 발생했습니다.');
        }
    };
    

    
    const fetchArticles = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/article/'); // API 엔드포인트 수정
            if (response.data.code === "SU") {
                setArticlesState(response.data.articleList);
            } else {
                console.error('Error fetching articles:', response.data.message);
            }
        } catch (err) {
            console.error("API 요청 중 오류 발생:", err);
        }
    };

    const incrementViews = async (articleNum, currentViews) => {
        const updatedViews = currentViews + 1;
        try {
            await axios.patch(`http://localhost:4000/api/v1/article/${articleNum}`, { views: updatedViews });
            const updatedArticles = articlesState.map(article =>
                article.articleNum === articleNum ? { ...article, viewCount: updatedViews } : article
            );
            setArticlesState(updatedArticles);
        } catch (err) {
            console.error("조회수 업데이트 중 오류 발생:", err);
        }
    };

    const handleCardClick = async (article) => {
        try {
            await incrementViews(article.articleNum, article.viewCount);
            navigate(`/article-main/${article.articleNum}`);
        } catch (err) {
            console.error('조회수 업데이트 중 오류 발생:', err);
        }
    };

    const getArticleListResponse = (responseBody) => {
        if (!responseBody) {
            alert('네트워크 이상입니다.');
            return;
        }
        const { code, articleList } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
        } else if (code === 'SU' && Array.isArray(articleList)) {
            setArticlesState(articleList); // 배열 데이터를 상태에 설정
        } else {
            alert('예상치 못한 데이터 형식입니다.');
        }
    };

    useEffect(() => {
        getArticleListRequest().then(getArticleListResponse);
    }, []);

    return (
        <div className="blog-container">
            <img src="/main-image.png" alt="Main Content Image" className="header2-image" />
            <div className="posts-overlay-container">
                <img src="/main2-image.png" alt="Additional Content Image" className="header3-image"/>
                <div className="title">
                    <p>순번</p>
                    <p>제목</p>
                    <p>작성일</p>
                    <p>조회</p>
                    <p>좋아요</p>
                </div>
                <div className='main-top'>
                    <img src="vector2.png" className="vector2"/>
                </div>
                <div className="posts-content">
                    {currentArticles.length > 0 ? (
                        currentArticles.map((article, index) => (
                            <Card
                                title={article.articleTitle}
                                createdAt={article.articleDate}
                                views={article.viewCount}
                                likes={article.likeCount}
                                order={indexOfFirstArticle + index + 1} 
                                category = {article.category} 
                                onClick={() => handleCardClick(article)}
                                onDelete={deleteArticle} // 여기에 deleteArticle 함수를 전달
                                articleNum={article.articleNum}
                                
                            />
                        ))
                    ) : (
                        <div>블로그 게시물이 없습니다</div>
                    )}
                </div>
                <aside>
                    <button className="sidebar-box" onClick={() => window.location.href='https://www.hufs.ac.kr/hufs/index.do'}>
                        <h2>학교 홈피</h2>
                    </button>
                    <button className="sidebar-box" onClick={() => window.location.href='https://ice.hufs.ac.kr/sites/ice/index.do'}>
                        <h2>학과 홈피</h2>
                    </button>
                </aside>
                <div>
                    <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages} />
                </div>
                <Link to="/article-main/create" className="btn1">익명게시판작성</Link>
            </div>
        </div>
    );
};

export default AdminPage;

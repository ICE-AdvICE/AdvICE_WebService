import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import axios from 'axios';
import { getArticleListRequest } from '../apis';
import './css/BlogPage.css';
import { getMypageRequest } from '../apis/index.js';

const ArticleMain = () => {
    const [notificationArticles, setNotificationArticles] = useState([]);
    const [generalArticles, setGeneralArticles] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesState, setArticlesState] = useState([]);
    const [userId, setUserId] = useState(null);
    const articlesPerPage = 7;
    const [cookies] = useCookies(['accessToken', 'userEmail']);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const userEmail = cookies.userEmail;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchCategory, setSearchCategory] = useState('all');
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const token = cookies.accessToken;
    const [userDetails, setUserDetails] = useState({
        email: '',
    });
    
    
    //공지사항
    const categoryLabels = {
        NOTIFICATION: "공지",
        GENERAL: "일반",
        REQUEST: "요청"
    };
    const filterNotificationArticles = (articles) => {
        const notifications = articles.filter(article => article.category === 'NOTIFICATION');
        const general = articles.filter(article => article.category !== 'NOTIFICATION');
        setNotificationArticles(notifications);
        setGeneralArticles(general);
    };
    
    
    //검색 기능(33~52)
    const searchArticles = () => {
        if (!searchTerm.trim()) {
            setFilteredArticles(articlesState);
            return;
        }
        const newFilteredArticles = articlesState.filter(article =>
            searchCategory === 'title' ?
            article.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) :
            article.articleContent.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(newFilteredArticles);
    };
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredArticles(articlesState);
        } else {
            searchArticles(); 
        }
    }, [searchCategory]);
 


    useEffect(() => {
        const fetchUserDetails = async () => {
            if (token) {  
                try {
                    const response = await getMypageRequest(token);
                    if (response) {  
                        setUserDetails({  
                            email: response.email,
                            studentNum: response.studentNum,
                            name: response.name
                        });
                    } else {
                        console.log('No user data returned from API');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [token]);  
  
    //카테고리 선택
    const categories = [
        { label: '모두 보여주기', value: 'all' },
        { label: '카테고리 0', value: 'GENERAL' },
        { label: '카테고리 1', value: 'REQUEST' },
        { label: '내가 쓴 글', value: 'my' }
    ];  

    const filterArticles = () => {
        const results = articlesState.filter(article => {
            if (selectedCategory === 'all') {
                return true;
            } else if (selectedCategory === 'my') {
                return article.userEmail === userDetails.email;
            } else {
                return article.category === selectedCategory;
            }
        });
        
        setFilteredArticles(results);
    };
    
    const handleCategoryChange = (event) => {
        const categoryValue = event.target.value;
        setSelectedCategory(categoryValue);
        setCurrentPage(1);
    };
    


    //조회수 
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
            setArticlesState(articleList);  
        } else {
            alert('예상치 못한 데이터 형식입니다.');
        }
    };
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/v1/article/list');
                if (response.data.code === "SU") {
                    setArticlesState(response.data.articleList);
                    setFilteredArticles(response.data.articleList);
                    filterNotificationArticles(response.data.articleList);
                } else {
                    console.error('Error fetching articles:', response.data.message);
                }
            } catch (err) {
                console.error("API 요청 중 오류 발생:", err);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        filterArticles();  
        
    }, [selectedCategory, articlesState, userId, userEmail]); 
    
    useEffect(() => {
        getArticleListRequest().then(getArticleListResponse);
    }, []);
    

    return (
        <div className="blog-container">
            <img src="/main-image.png" className="header2-image"/>
            <div className="posts-overlay-container">
                <img src="/main2-image.png"   className="header3-image"/>
                <div className="title">
                    <p>순번</p> <p>카테고리</p> <p>제목</p><p>작성일</p> <p>조회</p><p>좋아요</p>
                </div>
                <div className='main-top'>
                    <img src="vector2.png" className="vector2"/>
                </div>
                <div className='main-top2'>
                    <img src="vector2.png" className="vector3"/>
                </div>
                <div className="category-dropdown">
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        {categories.map(category => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="posts-content">
                    <div className="Notification-container">
                        {notificationArticles.length > 0 ? (
                            notificationArticles.map((article) => {
                                const categoryLabel = categoryLabels[article.category];
                                return (
                                    <Card
                                        key={article.articleNum}
                                        title={article.articleTitle}
                                        createdAt={article.articleDate}
                                        views={article.viewCount}
                                        likes={article.likeCount}
                                        order="공지"
                                        category={categoryLabel}
                                        onClick={() => handleCardClick(article)}
                                        email={article.userEmail}
                                    />
                                );
                            })
                        ) : (
                            <div>공지사항이 없습니다</div>
                        )}
                    </div>
                    <div className="non-Notification-container">
                    {currentArticles.filter(article => article.category !== 'NOTIFICATION').length > 0 ? (
                        currentArticles.filter(article => article.category !== 'NOTIFICATION').map((article, index) => {
                            const categoryLabel = categoryLabels[article.category];
                            return (
                                <Card
                                    key={article.articleNum}
                                    title={article.articleTitle}
                                    createdAt={article.articleDate}
                                    views={article.viewCount}
                                    likes={article.likeCount}
                                    order={indexOfFirstArticle + index + 1}
                                    category={categoryLabel}
                                    onClick={() => handleCardClick(article)}
                                    email={article.userEmail}
                                />
                            );
                        })
                    ) : (
                        <div>게시물이 없습니다</div>
                    )}
                </div>

                </div>

                <div className="search-bar">
                    <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}>
                        <option value="all">전체</option>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                    </select>
                    <div className="input-container">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            searchArticles();
                        }}>
                            <img className="search-icon" src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png" alt="Search" />
                        </a>
                    </div>
                </div>

                <div>
                    <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages} />
                </div>
                <Link to="/article-main/create" className="btn1">
                    <img src="/pencil.png" className="pencil" />
                </Link>

            </div>
        </div>
    );
};

export default ArticleMain;

import React, { useMemo,useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import './css/BlogPage.css';
import { getArticleListRequest,fetchUserArticles,checkUserBanStatus} from '../apis/index.js';

const ArticleMain = () => {
    const [notificationArticles, setNotificationArticles] = useState([]);
    const [generalArticles, setGeneralArticles] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesState, setArticlesState] = useState([]);
    const articlesPerPage = 6;
    const [cookies] = useCookies(['accessToken', 'userEmail']);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const [userArticles, setUserArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchCategory, setSearchCategory] = useState('all');
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const token = cookies.accessToken;

    const currentArticles = useMemo(() => {
        const indexOfLastArticle = currentPage * articlesPerPage;
        const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
        return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    }, [currentPage, filteredArticles, articlesPerPage]);

    //글작성버튼
    const handleCreateArticleClick = async () => {
        const token = cookies.accessToken;  
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        const banStatus = await checkUserBanStatus(token);
        if (banStatus.banned) {
            alert("계정이 정지된 상태입니다. 글 작성이 불가능합니다.");
        } else {
            navigate("/article-main/create");  
        }
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
    //공지사항
     const categoryLabels = {
        NOTIFICATION: "공지",
        GENERAL: "일반",
        REQUEST: "요청"
    };
    const categories = [
        { label: '모두 보여주기', value: 'all' },
        { label: '일반', value: 'GENERAL' },
        { label: '요청', value: 'REQUEST' },
        { label: '내가 쓴 글', value: 'my' }
    ];  
    const filterArticles = () => {
        let results = [];
        if (selectedCategory === 'my') {
            results = userArticles;  
        } else {
            results = articlesState.filter(article => {
                if (article.category === 'NOTIFICATION') {
                    return false;
                } else if (selectedCategory === 'all') {
                    return true;
                } else if (article.category === 'REQUEST' && article.authCheck === 1) {
                    return false;
                } else {
                    return article.category === selectedCategory;
                }
            });
        }
        results.sort((a, b) => new Date(b.articleDate) - new Date(a.articleDate));
        setFilteredArticles(results);
    };
    
    const handleCategoryChange = async (event) => {
        const categoryValue = event.target.value.trim();
        setSelectedCategory(categoryValue);
        setCurrentPage(1);
        if (categoryValue === 'my') {
            const articles = await fetchUserArticles(token);
            if (articles && articles.length > 0) {  
                setUserArticles(articles);
                setFilteredArticles(articles);
            } else {
                console.log("작성하신 게시글이 없습니다.");
            }
        } else {
            filterArticles();
        }
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchArticles();  
        }
    };
    const handleCardClick = async (article) => {
        navigate(`/article-main/${article.articleNum}`);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await getArticleListRequest();
            if (response.code === "SU") {
                setArticlesState(response.articleList);
                setFilteredArticles(response.articleList);
                filterNotificationArticles(response.articleList);
            } 
        };
        fetchArticles();
    }, []);
    
    useEffect(() => {
        if (selectedCategory === 'my') {
            const fetchArticles = async () => {
                const articles = await fetchUserArticles(token);
                setUserArticles(articles || []);
            };
            fetchArticles();
        } else {
            filterArticles();
        }
    }, [selectedCategory, articlesState]);
    
    return (
        <div className="blog-container">
            <div className = "img-container">
                <img src="/main-image.png" className="header2-image"/>
                <img src="/mainword-image.png"   className="words-image"/>
            </div>
            <div className="posts-overlay-container">
                <img src="/main2-image.png"   className="header3-image"/>
                <img src="/main2-icon.png"  className="article-icon-image"/>
                <div className = "bar-container">
                    <div className="category-dropdown">
                        <select value={selectedCategory} onChange={handleCategoryChange}>
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
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
                                placeholder='search'
                                onKeyDown={handleKeyDown}
                            />
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                searchArticles();
                            }}>
                                <img className="search-icon" src="https://img.icons8.com/?size=100&id=132&format=png&color=000000" alt="Search" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className = "title_vector-container">
                    <div className="title">
                        <p>카테고리</p> <p>제목</p><p>작성일</p> <p>조회</p><p>좋아요</p>
                    </div>
                    <div className="main-top">
                        <div className="separator"></div>   
                    </div>
                    <div className='main-top2'>
                        <div className="separator"></div>  
                    </div>
                    </div>
                <div className="posts-content">
                    <div className="Notification-container">
                        {notificationArticles.length > 0 ? (
                            notificationArticles
                                .sort((a, b) => new Date(b.articleDate) - new Date(a.articleDate)) 
                                .slice(0, 3) 
                                .map((article) => {
                                    const categoryLabel = categoryLabels[article.category];
                                    return (
                                        <Card
                                            key={article.articleNum}
                                            title={article.articleTitle}
                                            createdAt={article.articleDate}
                                            views={article.viewCount}
                                            likes={article.likeCount}
                                            order="공지"
                                            category={`[${categoryLabel}]`}
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
                                let categoryLabel = categoryLabels[article.category];
                                if (article.category === "REQUEST" && article.authCheck === 1) {
                                    categoryLabel = "해결";
                                }
                                return (
                                    <Card
                                        key={article.articleNum}
                                        title={article.articleTitle}
                                        createdAt={article.articleDate}
                                        views={article.viewCount}
                                        likes={article.likeCount}
                                        order={article.articleNum}
                                        category={`[${categoryLabel}]`}
                                        onClick={() => handleCardClick(article)}
                                        email={article.userEmail}
                                    />
                                );
                            })
                        ) : (
                            <div>게시물이 없습니다</div>
                        )}
                    </div>
                    <div className = "writing-container">
                        <div className="btn1" onClick={handleCreateArticleClick} style={{ cursor: 'pointer' }}>
                                <img src="/pencil.png" className="pencil" />
                                <p>글쓰기</p>
                        </div>
                    </div>
                    <div className= "pagination-container">
                        <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages} className="pagination-bar" />
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleMain;

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import './css/BlogPage.css';
import { getArticleListRequest, fetchUserArticles, checkUserBanStatus } from '../apis/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
    const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false);
    const [dropdownOpenSearch, setDropdownOpenSearch] = useState(false);
    const banReasonKoreanMap = {
        "SPAM": "스팸",
        "INAPPROPRIATE_CONTENT": "부적절한 내용",
        "HATE_SPEECH": "증오 발언",
        "FALSE_INFORMATION": "허위 정보",
        "IMPERSONATION": "사칭",
        "SCAM": "사기",
        "VIOLATION_OF_RULES": "규칙 위반",
        "OTHER": "기타"
    };
    
    const banDurationKoreanMap = {
        "ONE_MONTH": "1개월",
        "SIX_MONTHS": "6개월",
        "ONE_YEAR": "1년",
        "PERMANENT": "영구 정지"
    };
    
    const currentArticles = useMemo(() => {
        const indexOfLastArticle = currentPage * articlesPerPage;
        const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
        return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    }, [currentPage, filteredArticles, articlesPerPage]);


    const handleCreateArticleClick = async () => {
        const token = cookies.accessToken;
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const banStatus = await checkUserBanStatus(token);
            if (banStatus.banned) {
                const reasonText = banReasonKoreanMap[banStatus.banReason] || "알 수 없음";
                const durationText = banDurationKoreanMap[banStatus.banDuration] || "알 수 없음";
                let banEndTimeText = "알 수 없음";
                if (banStatus.banEndTime) {
                    const banEndDate = new Date(banStatus.banEndTime);
                    const year = banEndDate.getFullYear();
                    const month = String(banEndDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
                    const day = String(banEndDate.getDate()).padStart(2, '0');
                    banEndTimeText = `${year}년 ${month}월 ${day}일`;
                }
                alert(
                    `계정이 정지되었습니다.\n\n` +
                    `- 정지 사유: ${reasonText}\n` +
                    `- 정지 기간: ${durationText}\n` +
                    `- 정지 해제일: ${banEndTimeText}\n\n` +
                    `이후에 다시 시도해주세요.`
                );
            } else {
                navigate("/article-main/create");
            }
        } catch (error) {
            console.error("Error checking ban status:", error);
            alert("계정 상태를 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const filterNotificationArticles = (articles) => {
        const notifications = articles.filter(article => article.category === 'NOTIFICATION');
        const general = articles.filter(article => article.category !== 'NOTIFICATION');
        setNotificationArticles(notifications);
        setGeneralArticles(general);
    };

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

    const categoryLabels = {
        NOTIFICATION: "공지",
        GENERAL: "일반",
        REQUEST: "요청"
    };

    const categories = useMemo(() => {
        const baseCategories = [
            { label: '모두 보여주기', value: 'all' },
            { label: '일반', value: 'GENERAL' },
            { label: '요청', value: 'REQUEST' },
            { label: '해결', value: 'RESOLVE' }
        ];
        if (token) {
            baseCategories.push({ label: '내가 쓴 글', value: 'my' });
        }
        return baseCategories;
    }, [token]);

    const filterArticles = () => {
        let results = [];
        if (selectedCategory === 'my') {
            results = userArticles;
        } else {
            results = articlesState.filter(article => {
                if (selectedCategory === 'RESOLVE') {
                    return article.authCheck === 1;
                }
                else if (article.category === 'NOTIFICATION') {
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

    const handleCategoryChange = async (categoryValue) => {
        setSelectedCategory(categoryValue);
        setCurrentPage(1);
        if (categoryValue === 'my') {
            const articles = await fetchUserArticles(token);
            if (articles && articles.length > 0) {
                setUserArticles(articles);
                setFilteredArticles(articles);
            } else {
                console.log("작성하신 게시글이 없습니다.");
                setUserArticles([]);
                setFilteredArticles([]);
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
                setFilteredArticles(articles || []);
            };
            fetchArticles();
        } else {
            filterArticles();
        }
    }, [selectedCategory, articlesState]);

    const insertSeparators = (array) => {
        return array.reduce((acc, item, index) => {
            acc.push(item);
            if (index < array.length - 1) {
                acc.push({ isSeparator: true });
            }
            return acc;
        }, []);
    };

    const categorizedItems = insertSeparators(categories);
    const searchCategories = insertSeparators([
        { label: '전체', value: 'all' },
        { label: '제목', value: 'title' },
        { label: '내용', value: 'content' }
    ]);
    useEffect(() => {
        const handleResize = () => {
            const inputElement = document.querySelector('.input-container input[type="text"]');
            const windowWidth = window.innerWidth;
            if (inputElement) {  
                if (windowWidth <= 420) {
                    const newWidth = 150 - (420 - windowWidth);
                    inputElement.style.width = `${Math.max(newWidth, 100)}px`;  
                } else {
                    inputElement.style.width = '150px';  
                }
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    

    return (
        <div className="blog-container">
            <div className="img-container">
                <img src="/main-image.png" className="header2-image" />
                <img src="/mainword-image.png" className="words-image" />
            </div>
            <div className="posts-overlay-container">
                <img src="/main2-image.png" className="header3-image" />
                <div className='blog-skin-body'>
                    <img src="/main2-icon.png" className="article-icon-image" />
                    <div className='Layout_bar'>
                        <div className="bar-container">
                            <div className="search2-bar">
                                <div className="Category-dropdown" onClick={() => setDropdownOpenCategory(!dropdownOpenCategory)}>
                                    <span className="category-label">
                                        {selectedCategory === 'all' ? '모두 보여주기' :
                                            selectedCategory === 'GENERAL' ? '일반' :
                                                selectedCategory === 'REQUEST' ? '요청' :
                                                    selectedCategory === 'RESOLVE' ? '해결' : '내가 쓴 글'}
                                    </span>
                                    <FontAwesomeIcon icon={faChevronDown} className="ico-common-menu-hide-big-default" />
                                    <ul className={`dropdown-menu ${dropdownOpenCategory ? 'show' : ''}`}>
                                        {categorizedItems.map((category, index) =>
                                            category.isSeparator ? (
                                                <li key={`separator-${index}`} className="separator"></li>
                                            ) : (
                                                <li key={category.value} onClick={() => { setSelectedCategory(category.value); setDropdownOpenCategory(false); }}>
                                                    {category.label}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="search-bar">
                                <div className="category-dropdown" onClick={() => setDropdownOpenSearch(!dropdownOpenSearch)}>
                                    <span className="category-label">{searchCategory === 'all' ? '전체' : searchCategory === 'title' ? '제목' : '내용'}</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="ico-common-menu-hide-big-default" />
                                    <ul className={`dropdown-menu ${dropdownOpenSearch ? 'show' : ''}`}>
                                        {searchCategories.map((category, index) =>
                                            category.isSeparator ? (
                                                <li key={`separator-${index}`} className="separator"></li>
                                            ) : (
                                                <li key={category.value} onClick={() => { setSearchCategory(category.value); setDropdownOpenSearch(false); }}>
                                                    {category.label}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        placeholder="Search"
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
                    </div>
                
                    <div className="title_vector-container">
                        <div className="title">
                            <p className='title-blank'></p>
                            <p className='title-category'>카테고리</p>
                            <p className='title-name'>제목</p>
                            <p className= 'title-day'>작성일</p>
                            <p className='title-view'>조회</p>
                            <p className='title-like'>좋아요</p>
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
                            ) : ''}
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
                                '')}
                        </div>
                        <div className="writing-container">
                            <div className="btn1" onClick={handleCreateArticleClick} style={{ cursor: 'pointer' }}>
                                <img src="/pencil.png" className="pencil" />
                                <p>글쓰기</p>
                            </div>
                        </div>
                        <div className="pagination-container">
                            <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages} className="pagination-bar" />
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    );
};
export default ArticleMain;
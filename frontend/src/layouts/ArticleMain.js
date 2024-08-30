import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import './css/ArticlePage/ArticleMain.css';
import { getArticleListRequest, fetchUserArticles, checkUserBanStatus } from '../apis/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ArticleMain = () => {
    // 상태 관리: 공지사항과 일반 게시글을 각각 관리
    const [notificationArticles, setNotificationArticles] = useState([]);
    const [generalArticles, setGeneralArticles] = useState([]);
      
    // 페이지 이동을 위한 네비게이트 훅
    const navigate = useNavigate();
  
    // 현재 페이지 번호와 상태 관리: 페이지네이션 구현에 사용
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesState, setArticlesState] = useState([]); // 전체 게시글 목록을 상태로 관리
    const articlesPerPage = 6; // 한 페이지에 보여줄 게시글 수
    // 쿠키를 이용한 사용자 정보 가져오기
    const [cookies] = useCookies(['accessToken', 'userEmail']);
      
    // 검색어와 검색된 게시글 목록 관리
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
      
    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
      
    // 현재 페이지에 표시할 게시글의 시작과 끝 인덱스 계산
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
      
    // 사용자 게시글과 선택된 카테고리 관리
    const [userArticles, setUserArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all'); // 'all'이 기본 카테고리
    // 검색 시 선택된 카테고리 관리
    const [searchCategory, setSearchCategory] = useState('all');
      
    // 페이지네이션 버튼 클릭 시 현재 페이지 변경
    const paginate = pageNumber => setCurrentPage(pageNumber);
      
    // 드롭다운 상태 관리: 카테고리와 검색 드롭다운의 열림 상태를 관리
    const [dropdownOpenCategory, setDropdownOpenCategory] = useState(false);
    const [dropdownOpenSearch, setDropdownOpenSearch] = useState(false);
      
    // 드롭다운 영역 외부 클릭 감지를 위한 레퍼런스
    const categoryDropdownRef = useRef(null);
    const searchDropdownRef = useRef(null);
  
    const token = cookies.accessToken;
    
  
    // 금지 사유와 기간을 한글로 변환하기 위한 맵
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
    // 현재 페이지의 게시글을 계산하여 반환: 현재 페이지와 필터된 게시글 목록이 변경될 때마다 업데이트
    const currentArticles = useMemo(() => {
        const indexOfLastArticle = currentPage * articlesPerPage;
        const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
        return filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    }, [currentPage, filteredArticles, articlesPerPage]);

    // 게시글 작성 버튼 클릭 시 계정 정지 여부 확인
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
                    const month = String(banEndDate.getMonth() + 1).padStart(2, '0');
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
            alert("계정 상태를 확인하는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };
    // 게시글 목록을 공지사항과 일반 게시글로 분류하는 함수
    const filterNotificationArticles = (articles) => {
        const notifications = articles.filter(article => article.category === 'NOTIFICATION');
        const general = articles.filter(article => article.category !== 'NOTIFICATION');
        setNotificationArticles(notifications);
        setGeneralArticles(general);
    };
    // 검색어를 바탕으로 게시글 목록을 필터링하는 함수
    const searchArticles = () => {
        if (!searchTerm.trim()) {
            setFilteredArticles(articlesState);
            return;
        }
    
        const newFilteredArticles = articlesState.filter(article => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const matchesTitle = article.articleTitle.toLowerCase().includes(lowerCaseSearchTerm);
            const matchesContent = article.articleContent.toLowerCase().includes(lowerCaseSearchTerm);
            if (searchCategory === 'title') {
                return matchesTitle;
            } else if (searchCategory === 'content') {
                return matchesContent;
            } else {
                return matchesTitle || matchesContent;
            }
        });
        setFilteredArticles(newFilteredArticles);
    };
    
    // 검색 카테고리 변경 시 검색어에 맞게 게시글 목록 필터링
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredArticles(articlesState);
        } else {
            searchArticles();
        }
    }, [searchCategory]);

    // 드롭다운 영역 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setDropdownOpenCategory(false);
            }
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setDropdownOpenSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const categoryLabels = {
        NOTIFICATION: "공지",
        GENERAL: "일반",
        REQUEST: "요청"
    };
    // 카테고리 목록 정의: 페이지에서 사용 가능한 카테고리들
    const categories = useMemo(() => {
        const baseCategories = [
            { label: '모두 보여주기', value: 'all' },
            { label: '일반', value: 'GENERAL' },
            { label: '요청', value: 'REQUEST' },
            { label: '해결', value: 'RESOLVE' }
        ];
        // 사용자가 로그인한 경우 '내가 쓴 글' 카테고리 추가
        if (token) {
            baseCategories.push({ label: '내가 쓴 글', value: 'my' });
        }
        return baseCategories;
    }, [token]);
    // 선택된 카테고리에 따라 게시글 목록 필터링
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
        // 최신순으로 정렬
        results.sort((a, b) => new Date(b.articleDate) - new Date(a.articleDate));
        setFilteredArticles(results);
    };


    // 검색어 입력 시 Enter 키로 검색 실행
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchArticles();
        }
    };
    // 카드 클릭 시 해당 게시글로 이동
    const handleCardClick = async (article) => {
        navigate(`/article-main/${article.articleNum}`);
    };
    // 컴포넌트 마운트 시 게시글 목록 가져오기
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
    // 선택된 카테고리에 따라 게시글 목록을 가져오거나 필터링
    useEffect(() => {
        if (selectedCategory === 'my') {
            const fetchArticles = async () => {
                const articles = await fetchUserArticles(navigate,token);
                setUserArticles(articles || []);
                setFilteredArticles(articles || []);
            };
            fetchArticles();
        } else {
            filterArticles();
        }
    }, [selectedCategory, articlesState]);
    // 배열 사이에 구분 요소를 삽입하는 유틸리티 함수
    const insertSeparators = (array) => {
        return array.reduce((acc, item, index) => {
            acc.push(item);
            if (index < array.length - 1) {
                acc.push({ isSeparator: true });
            }
            return acc;
        }, []);
    };
    // 카테고리와 검색 카테고리에 구분 요소 삽입
    const categorizedItems = insertSeparators(categories);
    const searchCategories = insertSeparators([
        { label: '전체', value: 'all' },
        { label: '제목', value: 'title' },
        { label: '내용', value: 'content' }
    ]);
    // 윈도우 크기 변경 시 검색창 크기 조정
    useEffect(() => {
        const handleResize = () => {
            const inputElement = document.querySelector('.input-container input[type="text"]');
            const windowWidth = window.innerWidth;
            if (inputElement) {
                if (windowWidth <= 440) {
                    const newWidth = 150 - (440 - windowWidth);
                    inputElement.style.width = `${Math.max(newWidth, 80)}px`;
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
            <div className="banner_img_container_icebreaker">
                <img src="/icebreaker_main.png" className="banner" />
            </div>
            <div className="ArticleMain-container">
                <img src="/main2-image.png" className="ArticleMain-body-image" />
                <div className='ArticleMain-body'>
                    <img src="/main2-icon.png" className="Article-icon-image" />
                    <div className='CateGory_bar-container'>
                        <div className="CateGory-container">
                            <div className="ListCategory_bar" ref={categoryDropdownRef}>
                                <div className="Category-dropdown" onClick={() => setDropdownOpenCategory(!dropdownOpenCategory)}>
                                    <span className="Category-label">
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
                            <div className="Search-bar" ref={searchDropdownRef}>
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
                    <div className="Article_title-container">
                        <div className="Article_title">
                            <p className='title-blank'></p>
                            <p className='title-category'>카테고리</p>
                            <p className='title-name'>제목</p>
                            <p className='title-day'>작성일</p>
                            <p className='title-view'>조회</p>
                            <p className='title-like'>좋아요</p>
                        </div>

                    </div>
                    <div className="Article-container">
                        {notificationArticles.length === 0 && currentArticles.filter(article => article.category !== 'NOTIFICATION').length === 0 ? (
                            <div className="No-articles-message" style={{ textAlign: 'center', marginTop: '20px' }}>
                                <p>등록된 게시글이 없습니다.</p>
                            </div>
                        ) : (
                            <>
                                <div className="Notification-container">
                                    {notificationArticles.length > 0 &&
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
                                    }
                                </div>
                                <div className="Non-Notification-container">
                                    {currentArticles.filter(article => article.category !== 'NOTIFICATION').length > 0 &&
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
                                    }
                                </div>
                            </>
                        )}
                        <div className="Writing-container">
                            <div className="Writing-btn" onClick={handleCreateArticleClick} style={{ cursor: 'pointer' }}>
                                <img src="/pencil.png" className="pencil" />
                                <p>글쓰기</p>
                            </div>
                        </div>
                        <div className="Pagination-container">
                            <Pagination paginate={paginate} currentPage={currentPage} totalPages={totalPages} className="pagination-bar" />
                        </div>
                    </div>


                </div>

            </div>
        </div>
    );
};
export default ArticleMain;
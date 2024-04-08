import React, { useEffect, useState } from 'react';
import { getArticleListRequest } from '../apis';
import './anony-style.css';

function MainPage() {

    const navigateToHufs = () => {
        window.location.href = 'https://www.hufs.ac.kr/hufs/index.do';
    };

    const navigateToIce = () => {
        window.location.href = 'https://ice.hufs.ac.kr/sites/ice/index.do';
    };

    const [articleList, setArticleList] = useState([]);

    const getArticleListResponse = (responseBody) => {
        if (!responseBody) {
            alert('네트워크 이상입니다.');
            return;
        }
        const { code, articleList } = responseBody;
        if (code === 'DBE') {
            alert('데이터베이스 오류입니다.');
        } else if (code === 'SU' && Array.isArray(articleList)) { // articleList가 배열인지 확인
            setArticleList(articleList); // 배열 데이터를 상태에 설정
        } else {
            alert('예상치 못한 데이터 형식입니다.');
        }
    };
    
    

    useEffect(() => {
        getArticleListRequest().then(getArticleListResponse);
    }, []); // 빈 배열을 추가하여 컴포넌트 마운트 시에만 호출되도록 함

        return (
            <div>
            <header>
                <div className="header-background">
                <div className="header-container">
                    <div className="header-letter">
                    <div className="header-img">
                        <img src="./header-name.png" alt="메인 콘텐츠 이미지" className="header-image" />
                    </div>
                    <div className="head-button">
                        <button className="mypage">My Page</button>
                    </div>
                    </div>
                </div>
                </div>
            </header>
    
            <section className="main">
                <div className="main-container">
                <div className="main-img">
                    <img src="./main-image.png" alt="메인 콘텐츠 이미지" className="top-image" />
                </div>
                </div>
            </section>
    
            <section className="main2">
                <div className="main2-container">
                <div className="main2-img">
                    <img src="./main2-image.png" className="middle-image" />
                </div>
                <div className="vector-container">
                    <img src="./Vector2.png" className="vector-line" />
                </div>
                <div className="table-container" >
                    <div class="box-container">
                        <table>
                            <tbody>
                                <tr>
                                    <th>순번</th>
                                    <th>글 제목</th>
                                    <th>조회수</th>
                                    <th>공감</th>
                                    <th>작성일</th>
    
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="1box-container">
                    <table>
                        <tbody>
                            {articleList.map((article) => (
                                <tr key={article.article_num}>
                                    <th>{article.article_num}</th>
                                    <th>{article.article_title}</th>
                                    <th>{article.view_count}</th>
                                    <th>{article.like_count}</th>
                                    <th>{article.article_date}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                <aside>
                    <button className="sidebar-box" onClick={navigateToHufs}>
                    <h2>학교 홈피</h2>
                    </button>
                    <button className="sidebar-box" onClick={navigateToIce}>
                    <h2>학과 홈피</h2>
                    </button>
                </aside>
                <div class="page-container">
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                        <li class="page-item"><a class="page-link" href="#"></a></li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item"><a class="page-link" href="#">4</a></li>
                        <li class="page-item"><a class="page-link" href="#">5</a></li>
                        <li class="page-item"><a class="page-link" href="#"></a></li>
                        </ul>
                    </nav>
                </div>
                </div>
            </section>
            </div>
        );
        
};
export default MainPage;

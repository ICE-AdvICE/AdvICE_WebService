import React from 'react';
import './anony-style.css';

class MainPage extends React.Component {

    navigateToHufs = () => {

    window.location.href = 'https://www.hufs.ac.kr/hufs/index.do';
    };

    navigateToIce = () => {
    window.location.href = 'https://ice.hufs.ac.kr/sites/ice/index.do';
    };

    render() {
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
            </div>
            <aside>
                <button className="sidebar-box" onClick={this.navigateToHufs}>
                <h2>학교 홈피</h2>
                </button>
                <button className="sidebar-box" onClick={this.navigateToIce}>
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
    }
}
export default MainPage;

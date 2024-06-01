import React, { useState, useEffect } from 'react';
import '../css/InnerSection.css';  
import { getArticleListRequest } from '../../apis/index';
import {useNavigate} from 'react-router-dom';

const InnerSection = () => {
  const [topPosts, setTopPosts] = useState([]);
  const navigate = useNavigate();
  const handleMoreClick = () => {
    navigate('/article-main');  
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getArticleListRequest();
        const { articleList } = response;
        const topPosts = articleList.slice(0, 3).map(article => ({
          articleNum: article.articleNum,
          articleTitle: article.articleTitle
        }));
        setTopPosts(topPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
  
    fetchData();
  }, []);
  const handleNavigateToPost = (articleNum) => {
    navigate(`/article-main/${articleNum}`);
  };
  return (
    <section className="inner">
      <div className="middle-container">
        <div className = "middle-img" >
            <img src="main2-bottom.png" alt="메인 콘텐츠 이미지" class="middle-image" />
            <div className =" middle-box-container">
              <div className="img-container">
                <button className="skill">
                  <img src= "/book.png" className="box1" />
                  <p>스터디룸 예약</p>
                </button>
                <button className="skill">
                  <img src="/coding.png" className="box2" />
                  <p>코딩존 예약</p>
                </button>
                <button className="skill">
                  <img src="/computer.png" className="box3" />
                  <p>Advice</p>
                </button>
              </div>
            </div>
        </div>
        <div className="middle-note" id="more">
            <div className="middle-note-top">
                <p className="ice">IceBreaker</p>
                <button onClick={handleMoreClick} className="note">더보기+</button>   
            </div>
            <div className="middle-note-middle">
              <img src="Vector.png" className="vector"/>
            </div>
            <div className="middle-note-bottom">
            {topPosts.length > 0 ? (
              topPosts.map(({ articleNum, articleTitle }) => (
                <button key={articleNum} className="Text" onClick={() => handleNavigateToPost(articleNum)}>
                  {articleTitle}
                </button>
              ))
            ) : (
              <div>게시글이 없습니다</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InnerSection;

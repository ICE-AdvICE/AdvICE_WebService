import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import {
  checkUserBanStatus,
  fetchArticle,
  handleEdit,
  checkAnonymousBoardAdmin,
  createArticleRequest,
  createNotificationArticleRequest,
} from '../apis/index';
import ReactQuill from 'react-quill';
import '../layouts/css/BlogForm.css';
import { useLocation } from 'react-router-dom';


const BlogForm = ({ editing }) => {
  const navigate = useNavigate();
  const [canEdit, setCanEdit] = useState(false);
  const { articleNum } = useParams();
  const [articleTitle, setArticleTitle] = useState('');
  const location = useLocation();
  const [articleContent, setArticleContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('카테고리 선택');
  const [categoryName, setCategoryName] = useState('카테고리 선택');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cookies] = useCookies(['accessToken']);
  const token = cookies.accessToken;
  const [categoryString, setCategoryString] = useState('카테고리 선택');
  const [isAdmin, setIsAdmin] = useState(false);
  const [canChangeCategory, setCanChangeCategory] = useState(true);

  const categoryMap = {
    'REQUEST': '요청',
    'GENERAL': '일반',
    'NOTIFICATION': '공지',
    '카테고리 선택': '카테고리 선택',
    'RESOLVE' : '해결'
  };

  useEffect(() => {
    const loadArticleData = async () => {
        if (editing && articleNum) {
            setLoading(true);
            try {
                const data = await fetchArticle(articleNum, navigate);
                if (data) {
                    const { articleTitle, articleContent, category, authCheck } = data;
                    setArticleTitle(articleTitle);
                    setArticleContent(articleContent);
                    
                    if (authCheck === 1) {
                        setCategoryName('해결');  
                        setCategory('RESOLVE');  
                        setCanChangeCategory(false);   
                    } else {
                        setCategoryName(category);
                        setCategory(category);
                        setCanChangeCategory(true);  
                    }
                }
            } catch (error) {
                console.error('Error fetching article:', error);
            } finally {
                setLoading(false);
            }
        }
    };
    loadArticleData();
}, [editing, articleNum]);


  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await checkAnonymousBoardAdmin(token);
        if (response) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, [token]);

  useEffect(() => {
    if (editing && location.state?.article) {
      const { articleTitle, articleContent, category } = location.state.article;
      setArticleTitle(articleTitle);
      setArticleContent(articleContent);
      setCategory(category);
    }
  }, [editing, location.state]);

  const handleCategoryChange = (id, name) => {
    if (canChangeCategory) {
      setCategory(id);
      setCategoryString(name);
      setDropdownOpen(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (category =='카테고리 선택') {
        alert('카테고리를 선택해주세요.');
        setLoading(false);
        return;
    }
    if (!articleTitle.trim()) {
      alert('제목을 입력하세요.');
      setLoading(false);
      return;
    }
    const plainTextContent = articleContent.replace(/<[^>]*>/g, '').trim();
    if (!plainTextContent) {
      alert('내용을 입력하세요.');
      setLoading(false);
      return;
    }

    const postData = {
      articleTitle,
      articleContent,
      category: category,
    };

    let response;

    // 수정 작업
    if (editing) {
      response = await handleEdit(articleNum, token, navigate, setCanEdit, postData);
      if (response) {
        navigate(`/article-main/${articleNum}`);
        return;
      }
    }

    // 새 공지사항 생성
    if (category === 'NOTIFICATION') {
      response = await createNotificationArticleRequest(postData, token);
      if (response === true) {
        navigate('/article-main');
      }
    } else {
      // 일반 게시글 생성
      response = await createArticleRequest(postData, token);
      if (response && response.code === 'SU') {
        navigate('/article-main');
      } 
    }
    setLoading(false);
  };


  useEffect(() => {
    const verifyAccess = async () => {
      const banStatus = await checkUserBanStatus(token);
      if (banStatus.banned) {
        alert("계정이 정지된 상태입니다. 글 작성이 불가능합니다.");
        navigate('/');
      }
    };

    verifyAccess();
  }, [token, navigate]);

  return (
    <div className="BlogForm-container">
      <div className='blog-container'>
      <div className="banner_img_container_icebreaker_write">
                    <img src="/icebreaker_main2.png" className="banner" />
                </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className='createpage-container'>
        <div className="title-container">
        <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={() => canChangeCategory && setDropdownOpen(!dropdownOpen)}>
            <div className="select">
                <span>{categoryMap[category]}</span>   
                <i className="fa fa-chevron-left"></i>
            </div>
            {canChangeCategory && (
                <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                    <li onClick={() => handleCategoryChange('카테고리 선택', '카테고리 선택')}>카테고리 선택</li>
                    <li className="separator"></li>  
                    <li onClick={() => handleCategoryChange('REQUEST', '요청')}>요청</li>
                    <li className="separator"></li>  
                    <li onClick={() => handleCategoryChange('GENERAL', '일반')}>일반</li>
                    {isAdmin && (
                        <>
                            <li className="separator"></li> 
                            <li onClick={() => handleCategoryChange('NOTIFICATION', '공지')}>공지</li>
                        </>
                    )}
                </ul>
            )}
        </div>
    </div>

          <form className="form-container" onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                 
              />
            </div>
            <ReactQuill
              theme="snow"
              value={articleContent}
              onChange={setArticleContent}
              
            />
            <div className="create-button-container">
              <button className="esbutton" type="submit" disabled={loading}>
                {editing ? '수정' : '등록'}
              </button>
              <button className="cancel" onClick={() => navigate(-1)} type="button">
                취소
              </button>
            </div>
          </form>

        </div>
       
      </div>

    </div>
  );
};

BlogForm.propTypes = {
  editing: PropTypes.bool,
};

export default BlogForm;

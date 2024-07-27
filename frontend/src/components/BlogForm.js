import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import {checkUserBanStatus,fetchArticle,handleEdit,checkAnonymousBoardAdmin, createArticleRequest, createNotificationArticleRequest  } from '../apis/index';
import ReactQuill from 'react-quill';
import '../layouts/css/BlogForm.css'
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
    const [isAdmin, setIsAdmin] = useState(false); // 운영자 권한 여부

    const categoryMap = {
        'REQUEST': '요청',
        'GENERAL': '일반',
        'NOTIFICATION': '공지',
        '카테고리 선택': '카테고리 선택'
    };
    useEffect(() => {
        const loadArticleData = async () => {
            if (editing && articleNum) {
                setLoading(true);
                try {
                    const data = await fetchArticle(articleNum);
                    if (data) {
                        const {articleTitle, articleContent, category} = data;
                        setCategory(category);
                        setArticleTitle(articleTitle);
                        setArticleContent(articleContent);
                        setCategoryName(category);
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
                if (response ) {
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
        setCategory(id);
        setCategoryString(name);
        setDropdownOpen(false);
    };

    //게시물 수정,작성 버튼 api
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const postData = {
            articleTitle,
            articleContent,
            category: category,  
        };    
        let response;
        if (editing) {
            await handleEdit(articleNum, token, navigate, setCanEdit, postData);
        } 
        if (category === 'NOTIFICATION') {
            response = await createNotificationArticleRequest(postData, token);
            if (response === true) {
                navigate('/article-main');  
            } else {
                setError('게시글 작성을 실패했습니다');
            }
        } else {
            response = await createArticleRequest(postData, token);
            if (response && response.code === 'SU') {
                navigate('/article-main');
            } else {

                if (response) {
                    switch (response.code) {
                        case 'NU':
                            setError('This user does not exist.');
                            break;
                        case 'VF':
                            setError('Validation failed.');
                            break;
                        case 'DBE':
                            setError('Database error.');
                            break;
                        default:
                            setError("An unknown error occurred.");
                            break;
                    }
                }
            }
        }
    };
    useEffect(() => {
        const verifyAccess = async () => {
            const banStatus = await checkUserBanStatus(token);
            if (banStatus.banned) {
                alert("계정이 정지된 상태입니다. 글 작성이 불가능합니다.");
                navigate('/'); // 메인 페이지로 리디렉트
            }
        };

        verifyAccess();
    }, [token, navigate]);
    
    return (
        <div className='blog-container'>
            <div className = "img-container">
                <img src="/main-image.png" className="header2-image"/>
                <img src="/mainword-image.png"   className="words-image"/>

            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="title-container">
                <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="select">
                        <span>{categoryMap[category]}</span>
                        <i className="fa fa-chevron-left"></i>
                    </div>
                    <input type="hidden" name="category" value={categoryString} />
                
                    <ul className="dropdown-menu">
                        <li onClick={() => handleCategoryChange('카테고리 선택', '카테고리 선택')}>카테고리 선택</li>
                        <li onClick={() => handleCategoryChange('REQUEST', '요청')}>요청</li>
                        <li onClick={() => handleCategoryChange('GENERAL', '일반')}>일반</li>
                        {isAdmin && (<li onClick={() => handleCategoryChange('NOTIFICATION', '공지')}>공지</li>)}

                      
                    </ul>
                </div>
            </div>
            <form className="form-container"  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        className="form-control"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <ReactQuill
                    theme="snow"
                    value={articleContent}
                    onChange={setArticleContent}
                />
                <div className = "button-container">
                    <button className="esbutton" type="submit" disabled={loading}>
                        {editing ? '수정' : '등록'}
                    </button>
                    <button className="cancel" onClick={() => navigate(-1)} type="button">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

BlogForm.propTypes = {
    editing: PropTypes.bool,
};

export default BlogForm;

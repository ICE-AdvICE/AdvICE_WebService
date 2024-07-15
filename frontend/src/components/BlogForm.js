import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { updateArticleRequest, createArticleRequest, createNotificationArticleRequest  } from '../apis/index';
import ReactQuill from 'react-quill';
import '../layouts/css/BlogForm.css'
import { useLocation } from 'react-router-dom';



const BlogForm = ({ editing }) => {
    const navigate = useNavigate();
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


    
    //3. 게시글 수정 api
    useEffect(() => {
        if (editing && articleNum) {
            setLoading(true);
            axios.get(`http://localhost:4000/api/v1/article/${articleNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.code === "SU") {
                    const {articleTitle, articleContent,category } = res.data;
                    setCategory(category);
                    setArticleTitle(articleTitle);
                    setArticleContent(articleContent);
                    setCategoryName(category);
                } else {
                    switch (res.data.code) {
                        case "NA":
                            setError("This article does not exist.");
                            break;
                        case "NU":
                            setError("This user does not exist.");
                            break;
                        case "VF":
                            setError("Validation failed.");
                            break;
                        case "NP":
                            setError("Do not have permission.");
                            break;
                        case "DBE":
                            setError("Database error.");
                            break;
                        default:
                            setError("An unknown error occurred.");
                            break;
                    }
                }
            })
            .catch(err => {
                setError(err.response?.data?.message || "An unknown error occurred.");
            })
            .finally(() => setLoading(false));
        }
    }, [editing, articleNum, token]);

    
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
    
        console.log("Sending Category to Database:", category);
        console.log("Post Data being sent:", postData);
    
        let response;
        if (editing) {
            // 게시물 수정
            response = await updateArticleRequest(articleNum, postData, token);
            if (response && response.code === 'SU') {
                navigate(`/article-main/${articleNum}`);
            }
        }  if (category === 'NOTIFICATION') {
            // 공지 게시물 등록
            response = await createNotificationArticleRequest(postData, token);
            if (response === true) {
                navigate('/article-main');  // 성공적으로 처리되면 메인 페이지로 이동
            } else {
                setError('Failed to create notification article.');
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
                        <span>{category}</span>
                        <i className="fa fa-chevron-left"></i>
                    </div>
                    <input type="hidden" name="category" value={categoryString} />
                
                    <ul className="dropdown-menu">
                        <li onClick={() => handleCategoryChange('', '카테고리 선택')}>카테고리 선택</li>
                        <li onClick={() => handleCategoryChange('REQUEST', '요청')}>요청</li>
                        <li onClick={() => handleCategoryChange('GENERAL', '일반')}>일반</li>
                        <li onClick={() => handleCategoryChange('NOTIFICATION', '공지')}>공지</li>
                      
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

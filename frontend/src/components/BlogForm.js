import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { updateArticleRequest, createArticleRequest } from '../apis/index';
import ToastEditor from './ToastEditor.js';  
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
        setCategoryName(name); 
        setDropdownOpen(false);
    };

    //게시물 수정,작성 버튼 api
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const postData = {
            articleTitle,
            articleContent,
            category: Number(category),
        };
        let response;
        if (editing) {
            response = await updateArticleRequest(articleNum, postData, token);
        } else {
            response = await createArticleRequest(postData, token);
        }
        if (response && response.code === 'SU') {
            navigate(editing ? `/article-main/${articleNum}` : '/article-main');
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
        setLoading(false);
    };
    return (
        <div className='blog-container'>
            <img src="/main-image.png" alt="Main Content Image" className="header2-image" />
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="container">
                <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div className="select">
                        <span>{categoryName}</span>
                        <i className="fa fa-chevron-left"></i>
                    </div>
                    <input type="hidden" name="category" value={category} />
                    <ul className="dropdown-menu">
                        <li onClick={() => handleCategoryChange('0', '카테고리 선택')}>카테고리 선택</li>
                        <li onClick={() => handleCategoryChange('0', '요청')}>요청</li>
                        <li onClick={() => handleCategoryChange('1', '일반')}>일반</li>
                    </ul>
                </div>
                <span className="msg"></span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        className="form-control"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <ToastEditor
                    body={articleContent}
                    setBody={setArticleContent}
                />
                <button className="esbutton" type="submit" disabled={loading}>
                    {editing ? '수정' : '등록'}
                </button>
                <button className="cancel" onClick={() => navigate(-1)} type="button">
                    취소
                </button>
            </form>
        </div>
    );
};

BlogForm.propTypes = {
    editing: PropTypes.bool,
};

export default BlogForm;

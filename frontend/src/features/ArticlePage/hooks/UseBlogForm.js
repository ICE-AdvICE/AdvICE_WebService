import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { checkAnonymousBoardAdmin, createNotificationArticleRequest } from '../../api/Admin/UserApi';
import { createArticleRequest, handleEdit, fetchArticle } from '../../../entities/api/ArticleApi';
 
export const useBlogForm = (editing) => {
  const navigate = useNavigate();
  const { articleNum } = useParams();
  const [cookies,setCookie] = useCookies(['accessToken']);
  const token = cookies.accessToken;
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [category, setCategory] = useState('카테고리 선택');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [canChangeCategory, setCanChangeCategory] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const categoryMap = {
    'REQUEST': '요청',
    'GENERAL': '일반',
    'NOTIFICATION': '공지',
    '카테고리 선택': '카테고리 선택',
    'RESOLVE': '해결'
  };
  const validateBlogForm = (articleTitle, articleContent, category) => {
    if (category === '카테고리 선택') return '카테고리를 선택해주세요.';
    if (!articleTitle.trim()) return '제목을 입력하세요.';
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleContent, 'text/html');
    const plainText = doc.body.textContent || '';
    if (!plainText.trim()) return '내용을 입력하세요.';
    return null;  
  };
  
  useEffect(() => {
    if (editing && articleNum) {
      const loadArticleData = async () => {
        setLoading(true);
        try {
          const data = await fetchArticle(articleNum, navigate, cookies.accessToken, setCookie);
          if (data) {
            setArticleTitle(data.articleTitle);
            setArticleContent(data.articleContent);
            setCategory(data.authCheck === 1 ? 'RESOLVE' : data.category);
            setCanChangeCategory(data.authCheck !== 1);
          }
        } catch (error) {
          console.error('Error fetching article:', error);
        } finally {
          setLoading(false);
        }
      };
      loadArticleData();
    }
  }, [editing, articleNum]);

  useEffect(() => {
    if (!token) return; 
    const checkAdmin = async () => {
      try {
        const response = await checkAnonymousBoardAdmin(token, setCookie, navigate);
        if (response) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    checkAdmin();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const errorMessage = validateBlogForm(articleTitle, articleContent, category);
    if (errorMessage) {
      alert(errorMessage);
      setLoading(false);
      return;
    }
  
    const postData = { articleTitle, articleContent, category };
  
    try {
      let response;
      if (editing) {
        response = await handleEdit(articleNum, token, setCookie, navigate, postData);
        if (response) {
          navigate(`/article-main/${articleNum}`);
        }  
      } else {
        response = category === 'NOTIFICATION'
          ? await createNotificationArticleRequest(postData, token, setCookie, navigate)
          : await createArticleRequest(postData, token, setCookie, navigate);
        if (response && response.code === 'SU') {
          navigate('/article-main');
        } 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    articleTitle, setArticleTitle,
    articleContent, setArticleContent,
    category, setCategory,
    handleSubmit, loading,
    dropdownOpen, setDropdownOpen,
    canChangeCategory, categoryMap, isAdmin
  };
};

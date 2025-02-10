import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import '../../pages/css/ArticlePage/BlogForm.css';
import { useBlogForm } from './hooks/UseBlogForm';
import { useNavigate } from 'react-router-dom';

const BlogForm = ({ editing }) => {
  const {
    articleTitle, setArticleTitle,articleContent, setArticleContent,
    category, setCategory, handleSubmit, loading, dropdownOpen, setDropdownOpen,
    canChangeCategory, categoryMap, isAdmin
  } = useBlogForm(editing);

  const navigate = useNavigate();

  return (
    <div className="BlogForm-container">
      <div className='blog-container'>
        <div className="banner_img_container_icebreaker_write">
          <img src="/icebreaker_main2.png" className="banner" />
        </div>

        <div className='createpage-container'>
          <div className="title-container">
            <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={() => canChangeCategory && setDropdownOpen(!dropdownOpen)}>
              <div className="select">
                <span>{categoryMap[category]}</span>   
                <i className="fa fa-chevron-left"></i>
              </div>
              {canChangeCategory && (
                <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  <li onClick={() => setCategory('카테고리 선택')}>카테고리 선택</li>
                  <li className="separator"></li>  
                  <li onClick={() => setCategory('REQUEST')}>요청</li>
                  <li className="separator"></li>  
                  <li onClick={() => setCategory('GENERAL')}>일반</li>
                  {isAdmin && (
                    <>
                      <li className="separator"></li> 
                      <li onClick={() => setCategory('NOTIFICATION')}>공지</li>
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
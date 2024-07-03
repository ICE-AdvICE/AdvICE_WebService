import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import ToastViewer from './ToastViewer.js';  
import { getMypageRequest } from '../apis/index.js';
import './css/ShowPage.css';
import moment from 'moment';
import { handleCommentSubmit } from '../apis/index.js';
import {fetchComments } from '../apis/index.js';
const ShowPage = () => {
    const { articleNum } = useParams();
    const [article, setArticle] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [cookies] = useCookies(['accessToken', 'userEmail']);
    const token = cookies.accessToken;
    const userEmail = cookies.userEmail;
    const [authorEmail, setAuthorEmail] = useState("");
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        email: '',
        studentNum: '',
        name: ''
    });
    
    /*댓글날짜 오류해결해야댐*/
    const formatDate = (dateString) => {
        const date = moment.utc(dateString).local();  
        return date.format('YYYY년 MM월 DD일');  
        
    };

    /*수정버튼*/
    const handleEdit = () => {
        navigate(`/article-main/${articleNum}/edit`, {
            state: { article } 
        });
    };
    const handleDelete = () => { //게시글 삭제
        if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
            axios.delete(`http://localhost:4000/api/v1/article/${articleNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(() => {
                alert("게시글이 삭제되었습니다.");
                navigate('/');
            }).catch(err => {
                console.error("Error deleting post:", err);
                alert("게시글 삭제에 실패했습니다.");
            });
        }
    };


//좋아요 관련 코드
    const getlikestatus = () => {
        axios.get(`http://localhost:4000/api/v1/article/${articleNum}/like`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (res.data.code === "SU") {
                setLiked(true);
            } else if (res.data.code === "SN") {
                setLiked(false);
            } else {
            }
        }).catch(err => {
            if (err.response) {
                if (err.response.data.code === "DBE") {
                    console.error("Database error occurred while fetching like status.");
                }
            }
        });
    };

    const checkLikeStatus = () => {
        axios.get(`http://localhost:4000/api/v1/article/${articleNum}/like`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.data.code === "SU") {
                setLiked(true);
            } else {
                setLiked(false);
            }
        }).catch(error => {
            console.error("Error checking like status:", error);
        });
    };

    const handleLike = () => {
        const action = liked ? 'dislike' : 'like'; 
        axios.put(`http://localhost:4000/api/v1/article/${articleNum}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.data.code === "SU") {
                setLiked(!liked);
                setLikes(prev => liked ? prev - 1 : prev + 1);
            } else {
                console.error("Error updating like:", response.data.message);
            }
        }).catch(err => {
            console.error("Error updating like:", err);
        });
    };

    useEffect(() => {
        if (articleNum && token) {
            axios.get(`http://localhost:4000/api/v1/article/${articleNum}/like`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                const isLiked = response.data.code === "SU";
                setLiked(isLiked);
                axios.get(`http://localhost:4000/api/v1/article/${articleNum}`)
                .then(res => {
                    setLikes(res.data.likeCount);
                });
            }).catch(error => {
                console.error("Error fetching like status and count:", error);
            });
        }
    }, [articleNum, token]);
    
    useEffect(() => {
        getlikestatus();
        checkLikeStatus();
    }, [articleNum, token]);
    
///////////////////////////////

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };
    const handleKeyDown = (event) => {
        handleCommentSubmit(event, commentInput, setComments, setCommentInput, userEmail, articleNum, token);
    };

  
    

   
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (token) {  
                try {
                    const response = await getMypageRequest(token);
                    if (response) {  
                        setUserDetails({  
                            email: response.email,
                            studentNum: response.studentNum,
                            name: response.name
                        });
                    } else {
                        console.log('No user data returned from API');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [token]);  
    

    
    
    useEffect(() => {
        if (articleNum) {
            axios.get(`http://localhost:4000/api/v1/article/${articleNum}`)
            .then(res => {
                const { articleTitle, articleContent, likeCount, viewCount, category, articleDate, userEmail: authorEmail, comments: loadedComments } = res.data;
                setArticle({ articleTitle, body: articleContent, views: viewCount, category, articleDate });
                setLikes(likeCount);
                setLiked(res.data.authCheck === 1);
                setComments(loadedComments || []);
                setAuthorEmail(authorEmail);
            })
            .catch(err => console.error("Error fetching post:", err));
        }
    }, [articleNum, token, userEmail]);
  
    useEffect(() => {
        if (articleNum && token) {
            fetchComments();
        }
    }, [articleNum, token]);
    
    useEffect(() => {
        if (articleNum && token) {
            fetchComments();
        }
    }, []); 

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        
        <div className="blog-container">
            <img src="/main-image.png" className="header2-image"/>
            <div className = "ArticleContentbox-container">
                <div className="ArticleContentbox">
                    <img src="/main2-image.png"  className="header10-image"/>
                        <div className='ArticleCategory'>
                            <p>{article.category === 0 ? "요청" : "일반"}</p>
                        </div>
                        <div className="ArticleTitle">
                            <p>{article.articleTitle}</p>
                        </div>
                        <div className="ArticleDate">
                            <p>{formatDate(article.articleDate)}</p>
                            <p>조회수: {article.views}</p>
                        </div>
                        <div className="Article-Main">
                            <img src="/vector2.png" className="vector5"/>
                            <ToastViewer html={article.body} />
                            <img src="/vector2.png" className="vector5"/>
                            <div className="Article-middle">
                                <div className="Comment-Option">
                                    <div className={`heart ${liked ? 'love' : ''}`} onClick={handleLike}></div>
                                        <p>{likes}</p>  
                                </div>
                                {authorEmail === userDetails.email && (
                                <div className="Edit-Delete-Options">
                                    <button onClick={handleEdit}>수정</button>
                                    <button onClick={handleDelete}>삭제</button>
                                </div>
                                )}
                            </div>
                            
                            <div className='CommentBox-container'>  
                                {comments.map((comment, index) => (
                                    <div key={index}>
                                        <div className="Comment">
                                            <div className="Comment-Header">
                                                <p className="Comment-Author">운영자{comment.commentNumber}</p>
                                                <p className="Comment-Date">{new Date(comment.writeDatetime).toLocaleString()}</p>
                                            </div>  
                                            <p className="Comment-Content">{comment.content}</p>
                                        </div>
                                    {index < comments.length - 1 && <hr className="Comment-Divider" />}
                                    </div>
                                ))}
                            </div>
                                
                                    <div className="CommentBox-bottom">
                                        <textarea
                                            className="comment-input-area"
                                            value={commentInput}
                                            onChange={handleCommentChange}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' && !event.shiftKey) {
                                                    event.preventDefault();  
                                                    handleCommentSubmit(event, commentInput, setComments, setCommentInput, userEmail, articleNum, token);  // 댓글 제출 로직 실행
                                                }
                                            }}
                                            placeholder="댓글을 남겨보세요"
                                            rows="3"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                
                            </div>
                        </div>
                    
                </div>
            </div>
    );
}

export default ShowPage;

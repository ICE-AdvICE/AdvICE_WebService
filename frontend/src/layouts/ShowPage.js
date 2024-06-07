import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import ToastViewer from './ToastViewer.js';  
import { getMypageRequest } from '../apis/index.js';
import './css/ShowPage.css';

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
    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; 
        const day = date.getDate();
        return `${year}년 ${month}월 ${day}일`;  
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

    const handleEdit = () => {
        navigate(`/article-main/${articleNum}/edit`, {
            state: { article } 
        });
    };

    useEffect(() => {
        fetchComments();
    }, [articleNum, token]);

    //좋아요 관련 코드
    useEffect(() => {
        getlikestatus();
        checkLikeStatus();
    }, [articleNum, token]);

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
        console.log(`Likes: ${likes}, Liked: ${liked}`);
    }, [likes, liked]);

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };
    
    const handleCommentSubmit = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 폼의 기본 제출 이벤트 막기
            if (!commentInput.trim()) {
                alert("댓글 내용을 입력해주세요.");
                return;
            }
    
            const commentData = {
                content: commentInput,
                user_email: userEmail
            };
    
            axios.post(`http://localhost:4000/api/v1/article/${articleNum}/comment`, commentData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                if (response.data.code === "SU" && response.data.comment) {
                    const newComment = {
                        writeDatetime: response.data.comment.writeDatetime,
                        content: commentInput,
                        user_email: userEmail
                    };
                    // 여기서 상태 업데이트를 처리
                    setComments(prevComments => [...prevComments, newComment]);
                    setCommentInput(""); // 입력 필드 초기화
                }
            })
            .catch(err => {
                console.error("Error posting comment:", err);
                alert('네트워크 오류 또는 서버가 응답하지 않습니다.');
            });
        }
    };
    

    const handleDelete = () => {
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

   
    
    
    

    const fetchComments = () => {
        axios.get(`http://localhost:4000/api/v1/article/${articleNum}/comment-list`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            console.log("Fetched comments:", response.data);   
            setComments(response.data.commentList.map(comment => ({
                writeDatetime: comment.writeDatetime,
                content: comment.content,
                user_email: comment.user_email
            })) || []);  
        })
        .catch(err => {
            console.error("Error fetching comments:", err);
            console.error("Error details:", err.response ? err.response.data : 'No response data');
        });
    };
    
    
    

    useEffect(() => {
        if (articleNum) {
            fetchComments();
        }
    }, [articleNum]);

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-container">
            <img src="/main-image.png" className="header2-image" alt="Main Content" />
            <div className = "ArticleContentbox-container">
            <div className="ArticleContentbox">
                <img src="/main2-image.png"  className="header10-image"/>
                    <div className='ArticleCategory'>
                        <p>{article.category === 0 ? "요청" : "일반"}</p>
                    </div>
                    <div className="ArticleTitle">
                        <h1>{article.articleTitle}</h1>
                    </div>
                    <div className="ArticleDate">
                        <p>{formatDate(article.articleDate)}</p>
                        <p>조회수: {article.views}</p>
                    </div>
                    <div className="Article-Main">
                        <img src="/vector2.png" className="vector5"/>
                        <ToastViewer html={article.body} />
                        <img src="/vector2.png" className="vector5"/>
                    </div>
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
                
                <div className='CommentBox-container'>
                    {comments.map((comment, index) => (
                        <div key={index}>
                            <div className="Comment">
                                <div className="Comment-Header">
                                    <p className="Comment-Author">운영자{comment.commentNumber}</p>
                                    <p className="Comment-Date">{new Date(comment.writeDatetime).toLocaleString()}</p>
                                </div>  
                            </div>
                            <p className="Comment-Content">{comment.content}</p>
                            {index < comments.length - 1 && <hr className="Comment-Divider" />}
                        </div>
                    ))}
                    {userDetails.email === 'jinwoo1234@naver.com' && (
                        <div className="CommentBox-bottom">
                            <textarea
                                className="comment-input-area"
                                value={commentInput}
                                onChange={handleCommentChange}
                                onKeyDown={handleCommentSubmit}
                                placeholder="댓글을 남겨보세요"
                                rows="3"  
                                style={{ width: '70%' }}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>
    );
    };

export default ShowPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import ToastViewer from './ToastViewer.js';  
import './css/ShowPage.css';
import { getMypageRequest } from '../apis/index.js';

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
            axios.get(`http://localhost:4000/api/v1/article/${articleNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const { articleTitle, articleContent, likeCount, comments: loadedComments, viewCount, category, articleDate, userEmail: authorEmail } = res.data;
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

    
    //좋아요 관련 코드
    useEffect(() => {
        getlikestatus();
        checkLikeStatus();
    }, [articleNum, token]);

    const getlikestatus = () => {
        axios.get(`http://localhost:4000/api/v1/article/${articleNum}/like`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {if (res.data.code === "SU") {
            setLiked(true);
        }   else if(res.data.code === "SN") {
                console.log("Success but not.");
                setLiked(false);
            } else {
                console.error("Unexpected success code:", res.data.message);
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
        const newLikedStatus = !liked;
        axios.put(`http://localhost:4000/api/v1/article/${articleNum}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
            if (response.data.code === "SU") {
                setLiked(newLikedStatus);
                setLikes(prev => newLikedStatus ? prev + 1 : prev > 0 ? prev - 1 : 0);  
            } else {
                console.error("Error updating like:", response.data.message);
            }
        }).catch(err => {
            console.error("Error updating like:", err);
        });
    };
    
    useEffect(() => {
        console.log(`Likes: ${likes}, Liked: ${liked}`);
    }, [likes, liked]);
    
    
    
    

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
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

    const postComment = () => {
        axios.put(`http://localhost:4000/api/v1/article/${articleNum}/comment`, { content: commentInput }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const { comments: updatedComments } = response.data;
            setComments(updatedComments);
            setCommentInput("");
        })
        .catch(err => {
            console.error("Error posting comment:", err);
            alert("댓글을 추가하는 중 오류가 발생했습니다.");
        });
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-container">
            <img src="/main-image.png" className="header2-image" alt="Main Content" />
            <div className="ArticleContentbox">
                <div className = 'ArticleCategory'>
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
                <button onClick={handleLike} className={`like-button ${liked ? 'liked' : ''}`}>
                    {liked ? `❤️ ${likes}` : `❤️ ${likes}`}
                </button>
                </div>
                {authorEmail === userDetails.email && (
                <div className="Edit-Delete-Options">
                    <button onClick={handleEdit}>수정</button>
                    <button onClick={handleDelete}>삭제</button>
                </div>
            )}
                <div className="CommentBox-bottom">
                    {comments.map((comment, index) => (
                        <p key={index}>{comment.content}</p>
                    ))}
                    <input
                        type="text"
                        value={commentInput}
                        onChange={handleCommentChange}
                        placeholder="댓글을 남겨보세요"
                    />
                    <button onClick={postComment}>등록</button>
                </div>
            </div>
        </div>
    );
};

export default ShowPage;
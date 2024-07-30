import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import ToastViewer from './ToastViewer.js';  
import './css/ShowPage.css';
import {fetchArticle,fetchLikeStatus, handleLike ,handleResolveArticle,giveBanToUser,adminhandleDelete,checkAnonymousBoardAdmin,handleCommentEdit,handleCommentDelete,fetchComments,handleDelete,handleCommentSubmit ,checkArticleOwnership} from '../apis/index.js';
 
const ShowPage = () => {
    const [isComposing, setIsComposing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentInput, setEditCommentInput] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const { articleNum } = useParams();
    const [article, setArticle] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [cookies] = useCookies(['accessToken', 'userEmail']);
    const token = cookies.accessToken;
    const userEmail = cookies.userEmail;
    const navigate = useNavigate();
    const [canEdit, setCanEdit] = useState(false);
    const handleBanUser = async () => {
        const banReason = prompt(
            "정지 사유를 선택하세요:\n1) 스팸\n2) 부적절한 내용\n3) 증오 발언\n4) 허위 정보\n5) 사칭\n6) 사기\n7) 규칙 위반\n8) 기타",
        );
        const banReasonMap = {
            "1": "SPAM",
            "2": "INAPPROPRIATE_CONTENT",
            "3": "HATE_SPEECH",
            "4": "FALSE_INFORMATION",
            "5": "IMPERSONATION",
            "6": "SCAM",
            "7": "VIOLATION_OF_RULES",
            "8": "OTHER"
        };
        const selectedBanReason = banReasonMap[banReason];
        if (!selectedBanReason) {
            alert("정지 사유를 선택하세요.");
            return;
        }
        const banDuration = prompt(
            "정지 기간을 선택하세요:\n1) 1개월\n2) 6개월 \n3) 1년\n4) 영구 정지"
        );
        const banDurationMap = {
            "1": "ONE_MONTH",
            "2": "SIX_MONTHS",
            "3": "ONE_YEAR",
            "4": "PERMANENT"
        };
        const selectedBanDuration = banDurationMap[banDuration];
        if (!selectedBanDuration) {
            alert("정지 기간을 선택하세요.");
            return;
        }
        const result = await giveBanToUser(articleNum, token, selectedBanDuration, selectedBanReason);
        if (result.code === 'SU') {
            alert('사용자가 성공적으로 정지되었습니다.');
        } else {
            alert(`사용자 정지 실패하였습니다.: ${result.message}`);
        }
    };

    //16.(Admin) 해결이 필요한 게시글을 해결된 게시글로 변경을 위한 API
    const handleResolve = async () => {
    await handleResolveArticle(articleNum, token, navigate, setCanEdit);
};

    const handleComposition = (event) => {
        if (event.type === 'compositionend') {
            setIsComposing(false);
        } else {
            setIsComposing(true);
        }
    };
    //사용
    const handleDeleteComment = async (articleNum, commentNumber, token) => {
        try {
            const success = await handleCommentDelete(articleNum,commentNumber, token);
            if (success) {
                fetchComments(articleNum,token, setComments);  
            }
        } catch (err) {
            console.error("에러가 발생했습니다.", err);
        }
    };

    /*삭제버튼*/
    const onDelete = () => {
        handleDelete(articleNum, token, navigate);
    };
    const adonDelete = () => {
        adminhandleDelete(articleNum, token, navigate);
    };

    //익명게시판권한 여부
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await checkAnonymousBoardAdmin(token);
                if (response) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error('ERROR', error);
            }
        };
        checkAdmin();
    }, [token]);

    //좋아요 여부 api
    useEffect(() => {
        const fetchData = async () => {
            if (articleNum && token) {
                await fetchLikeStatus(articleNum, token, setLiked);
            }
        };
        fetchData();
    }, [articleNum, token]);
    
    
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchLikeStatus(articleNum, token, setLiked);
        };
        fetchInitialData();
    }, [articleNum, token]);
    
    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };
    const handleSaveEdit = async (commentNumber) => {
        try {
            const response = await handleCommentEdit(commentNumber, editCommentInput, token);
            if (response) {
                const updatedComments = comments.map(comment =>
                    comment.commentNumber === commentNumber ? { ...comment, content: editCommentInput } : comment
                );
                setComments(updatedComments);
                setEditingCommentId(null);  
            }
        } catch (error) {
            alert('댓글 수정에 실패했습니다.');
        }
    };

    useEffect(() => {
        if (articleNum && token) {
            checkArticleOwnership(articleNum, token).then(data => {
                if (data.code === "SU") {
                    setCanEdit(true);  
                } else {
                    setCanEdit(false);  
                }
            }).catch(error => {
                console.error('Failed to verify article ownership:', error);
            });
        }
    }, [articleNum, token]);

    const handleSubmit = async () => {
        try {
            await handleCommentSubmit(null, commentInput, setComments, setCommentInput, userEmail, articleNum, token);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };
    
    
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
            event.preventDefault();
            try {
                await handleCommentSubmit(event,commentInput, setComments, setCommentInput, userEmail, articleNum, token);
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        }
    };
    
    useEffect(() => {
        if (articleNum) {
            fetchArticle(articleNum)
                .then(res => {
                    const {articleTitle, articleContent, likeCount, viewCount, category, authCheck,articleDate, userEmail: authorEmail, comments: loadedComments } = res;
                    setArticle({ articleTitle, body: articleContent, views: viewCount, category, articleDate, authCheck });
                    setLikes(likeCount);
                    setLiked(res.data.authCheck === 1);
                    setComments(loadedComments || []);
                })
                .catch(err => console.error("Error", err));
                }
    }, [articleNum]);
  
    useEffect(() => {
        if (articleNum) {
            fetchComments(articleNum, token, setComments);
        }
    }, [articleNum, token]);
    

    const handleEditArticle = async () => {
        navigate(`/article-main/${articleNum}/edit`);
    };

    const toggleLike = () => {
        handleLike(articleNum, liked, token, setLiked, setLikes);
    };

    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div className="blog-container">
            <div className = "img-container">
                <img src="/main-image.png" className="header2-image"/>
                <img src="/mainword-image.png"   className="words-image"/>
            </div>
            <div className = "ArticleContentbox-container">
                <div className="ArticleContentbox">
                    <img src="/main2-image.png"  className="header10-image"/>
                    <img src="/main2-icon.png"  className="icon-image"/>
                    <div className='ArticleCategory'>
                        <p>
                            {article.category === "GENERAL" 
                                ? "일반" 
                                : article.category === "REQUEST" && article.authCheck === 0
                                ? "요청"
                                : article.category === "NOTIFICATION"
                                ? "공지"
                                : article.category === "REQUEST" && article.authCheck === 1
                                ? "해결"
                                : "알 수 없는 카테고리"}
                        </p>
                    </div>
                    <div className="ArticleTitle">
                        <p>{article.articleTitle}</p>
                    </div>
                    <div className="ArticleDate">
                        <p>{(article.articleDate)}</p>
                        <p>조회수 {article.views}</p>
                    </div>
                    <div className="Article-Main">
                        <img src="/vector2.png" className="vector5"/>
                        <ToastViewer html={article.body} />
                        <img src="/vector2.png" className="vector5"/>
                        <div className="Article-middle">
                            <div className="Comment-Option">
                                <div className={`heart ${liked ? 'love' : ''}`} onClick={toggleLike}></div>
                                    <p>{likes}</p>  
                            </div>
                            {canEdit && (
                                <div className="Edit-Delete-Options">
                                    <button onClick={handleEditArticle}>수정</button>
                                    <span> | </span>
                                    <button onClick={onDelete}>삭제</button>
                                </div>
                            )}            
                        </div>
                        {isAdmin && (
                             <div className='stop'>
                                <button onClick={adonDelete}>삭제</button>
                                <button onClick={handleBanUser}>정지</button>
                            </div>
                        )}
                        {isAdmin && (
                             <div className='resolve'>
                                {article.category === "REQUEST" && article.authCheck === 0 && (
                                    <button onClick={handleResolve}>해결완료</button>
                                )}
                            </div>
                        )}    
                        <div className='CommentBox-container'>  
                            {comments.map((comment, index) => (
                                <div key={index} className="Comment">
                                    {editingCommentId === comment.commentNumber ? (
                                        <div className="Comment-Edit">  
                                            <textarea
                                                value={editCommentInput}
                                                onChange={(e) => setEditCommentInput(e.target.value)}
                                                className="comment-edit-input"
                                                rows="3"
                                                style={{ width: '100%' }}
                                            />
                                            <div className='ed-comment'>
                                                <div className='ed-bt' onClick={() => handleSaveEdit(comment.commentNumber)}>저장</div>
                                                <div className='ed-can' onClick={() => setEditingCommentId(null)}>취소</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="Comment-Header">
                                                <p className="Comment-Author">운영자</p>
                                                <p className="Comment-Date">{(comment.writeDatetime)}</p>
                                                
                                                {isAdmin && (
                                                    <div className="Admin-de_Ca-bottom">
                                                        <button onClick={() => handleDeleteComment(articleNum, comment.commentNumber, token)}>삭제</button>
                                                        <button onClick={() => { setEditingCommentId(comment.commentNumber); setEditCommentInput(comment.content); }}>수정</button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="Comment-Content">{comment.content}</p>
                                        </div>
                                    )}
                                    {index < comments.length - 1 && <hr className="Comment-Divider" />}
                                </div>
                            ))}
                        </div>
                        {isAdmin && (   
                            <div className="CommentBox-bottom">
                                <p>운영자</p>
                                <textarea
                                    className="comment-input-area"
                                    value={commentInput}
                                    onChange={handleCommentChange}
                                    onCompositionStart={handleComposition}
                                    onCompositionEnd={handleComposition}
                                    onKeyDown={handleKeyDown}        
                                    placeholder="댓글을 남겨보세요"
                                    rows="3"
                                    style={{ width: '100%' }}
                                />
                                <button className="submit-button" onClick={handleSubmit}>등록</button>
                            </div>
                        )}                        
                        </div>          
                    </div>
                </div>
            </div>
    );
}

export default ShowPage;

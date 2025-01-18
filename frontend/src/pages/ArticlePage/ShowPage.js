import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import ToastViewer from '../ToastViewer.js';  
import './ShowPage.css';
import {fetchArticle,fetchLikeStatus, handleLike ,handleResolveArticle,giveBanToUser,adminhandleDelete,checkAnonymousBoardAdmin,handleCommentEdit,handleCommentDelete,fetchComments,handleDelete,handleCommentSubmit ,checkArticleOwnership} from '../../apis/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const ShowPage = () => {
    // 댓글 작성 중인지 여부를 관리하는 상태
    const [isComposing, setIsComposing] = useState(false);
    // 현재 편집 중인 댓글의 ID와 편집할 댓글의 내용을 관리하는 상태
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentInput, setEditCommentInput] = useState("");
    // 관리자인지 여부를 확인하는 상태
    const [isAdmin, setIsAdmin] = useState(false);
    // URL에서 받아온 게시글 번호
    const { articleNum } = useParams();
    // 게시글, 좋아요 수, 댓글 등을 관리하는 상태
    const [article, setArticle] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    // 쿠키를 이용해 사용자 정보와 토큰을 가져옴
    const [cookies] = useCookies(['accessToken', 'userEmail']);
    const token = cookies.accessToken;
    const userEmail = cookies.userEmail;
    // 페이지 이동을 위한 네비게이트 훅
    const navigate = useNavigate();
    // 게시글 편집 가능 여부를 관리하는 상태
    const [canEdit, setCanEdit] = useState(false);

    // 사용자 정지 처리 함수: 사유와 기간을 입력받아 사용자 정지
    const handleBanUser = async () => {
        const banReason = prompt(
            "아래 목록에서 해당되는 정지 사유의 숫자를 입력하세요:\n1) 스팸\n2) 부적절한 내용\n3) 증오 발언\n4) 허위 정보\n5) 사칭\n6) 사기\n7) 규칙 위반\n8) 기타",
        );
        if (banReason === null) return;  //취소 시 함수 종료
        // 정지 사유 매핑
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
            alert("올바른 숫자를 입력하여 정지 사유를 선택하세요.");
            return;
        }
        const banDuration = prompt(
            "아래 목록에서 원하는 정지 기간의 숫자를 입력하세요:\n1) 1개월\n2) 6개월 \n3) 1년\n4) 영구 정지"
        );
        if (banDuration === null) return; 
        // 정지 기간 매핑
        const banDurationMap = {
            "1": "ONE_MONTH",
            "2": "SIX_MONTHS",
            "3": "ONE_YEAR",
            "4": "PERMANENT"
        };
        const selectedBanDuration = banDurationMap[banDuration];
        if (!selectedBanDuration) {
            alert("올바른 숫자를 입력하여 정지 기간을 선택하세요.");
            return;
        }
        // 사용자를 정지하는 API 호출
        const result = await giveBanToUser(navigate,articleNum, token, selectedBanDuration, selectedBanReason);
        if (result.code === 'SU') {
            
            alert('사용자가 성공적으로 정지되었습니다.');
            navigate('/article-main');
        }  
    };
    // 게시글을 해결 상태로 변경하는 함수
    const handleResolve = async () => {
        await handleResolveArticle(navigate,articleNum, token, navigate, setCanEdit);    
    };
    // 한글 입력 조합 상태를 관리하기 위한 함수
    const handleComposition = (event) => {
        if (event.type === 'compositionend') {
            setIsComposing(false);
        } else {
            setIsComposing(true);
        }
    };
    // 댓글 삭제를 처리하는 함수
    const handleDeleteComment = async (articleNum, commentNumber, token) => {
        const success = await handleCommentDelete(navigate,articleNum,commentNumber, token);
        if (success) {
            fetchComments(navigate,articleNum, setComments);  
        }    
    };
    // 게시글 삭제 처리
    const onDelete = () => {
        handleDelete(articleNum, token, navigate);
    };
    // 관리자 권한으로 게시글 삭제 처리
    const adonDelete = () => {
        adminhandleDelete(articleNum, token, navigate);
    };
    // 사용자가 관리자 권한을 가지고 있는지 확인하는 함수
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await checkAnonymousBoardAdmin(token);
                if (response) {
                    setIsAdmin(true);
                }
            } catch (error) {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, [token]);
    // 게시글의 좋아요 상태를 가져오는 함수
    useEffect(() => {
        const fetchData = async () => {
            if (articleNum && token) {
                await fetchLikeStatus(articleNum, token, setLiked);
            }
        };
        fetchData();
    }, [articleNum, token]);
    
    // 초기 데이터와 좋아요 상태를 가져오는 함수
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchLikeStatus(articleNum, token, setLiked);
        };
        fetchInitialData();
    }, [articleNum, token]);
    // 댓글 입력 변경 핸들러
    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };
    // 댓글 수정 저장 핸들러
    const handleSaveEdit = async (commentNumber) => {
        const response = await handleCommentEdit(navigate,commentNumber, editCommentInput, token);
        if (response) {
            const updatedComments = comments.map(comment =>
                comment.commentNumber === commentNumber ? { ...comment, content: editCommentInput } : comment
            );
            setComments(updatedComments);
            setEditingCommentId(null);  
        }
    };
    // 게시글의 소유권을 확인하는 함수
    useEffect(() => {
        if (articleNum && token) {
            checkArticleOwnership(navigate,articleNum, token).then(data => {
                if (data.code === "SU") {
                    setCanEdit(true);  
                } else {
                    setCanEdit(false);  
                }
            })
        }
    }, [articleNum, token]);
    // 댓글 제출 핸들러
    const handleSubmit = async () => {
        await handleCommentSubmit(navigate,null, commentInput, setComments, setCommentInput, userEmail, articleNum, token);
    };
    // Enter 키 입력 시 댓글 제출 핸들러
    const handleKeyDown = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
            event.preventDefault();
            await handleCommentSubmit(navigate,event,commentInput, setComments, setCommentInput, userEmail, articleNum, token);
        }
    };
    // 게시글 정보와 댓글 목록을 가져오는 함수
    useEffect(() => {
        if (articleNum) {
            fetchArticle(articleNum,navigate)
                .then(res => {
                    const {articleTitle, articleContent, likeCount, viewCount, category, authCheck,articleDate, userEmail: authorEmail, comments: loadedComments } = res;
                    setArticle({ articleTitle, body: articleContent, views: viewCount, category, articleDate, authCheck });
                    setLikes(likeCount);
                    setLiked(res.data.authCheck === 1);
                    setComments(loadedComments || []);
                })
                .catch(err => console.log("Error", err));
                }
    }, [articleNum]);
    // 댓글 목록을 새로 가져오는 함수
    useEffect(() => {
        if (articleNum) {
            fetchComments(navigate,articleNum, setComments);
        }
    }, [articleNum, token]);
    // 게시글 수정 페이지로 이동하는 함수
    const handleEditArticle = async () => {
        navigate(`/article-main/${articleNum}/edit`);
    };
    // 좋아요 토글 처리
    const toggleLike = () => {
        handleLike(navigate,articleNum, liked, token, setLiked, setLikes);
    };
    if (!article) {
        return <div>게시글이 존재하지 않습니다.</div>;
    }
    return (
        <div className="blog-container">
           <div className="banner_img_container_icebreaker_article">
                <img src="/icebreaker_main.png" className="banner" />
            </div>
            <div className = "ArticleContentbox-container">
                <div className="ArticleContentbox">
                    <img src="/main2-image.png"  className="header10-image"/>
                    <div className = "body-container">
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
                        {isAdmin && (
                             <div className='resolve'>
                                {article.category === "REQUEST" && article.authCheck === 0 && (
                                    <button onClick={handleResolve}>해결완료</button>
                                )}
                            </div>
                        )}    
                    </div>
                    <div className="ArticleTitle">
                        <p>{article.articleTitle}</p>

                    </div>
                    <div className="ArticleDate">
                    <p>
                    {new Date(article.articleDate).toLocaleString('ko-KR', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: false   
                    })}
                    </p>

                        <p>조회수 {article.views}</p>
                    </div>
                    <div className="Article-Main">
                        <div className='quill-container'>
                            <ToastViewer html={article.body} />
                        </div>
                        
                        <div className="Article-middle">
                        <div className="Comment-Option">
                        <div className="heart" onClick={toggleLike}>
                            <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
                        </div>
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
                                <span> | </span>
                                <button onClick={handleBanUser}>정지</button>
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
                        {/* 댓글 내용 렌더링 부분 수정 */}
                        <p className="Comment-Content">
                            {comment.content.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </p>
                        </div>
                    )}
                </div>
            ))}
        </div>

                        {isAdmin && (   
                            <div className="CommentBox-bottom">
                                <div className='CommentBox-bottom-container'>
                                    <div className='CommentBox-bottom-title'>
                                        <p class="comment-label">운영자</p>
                                    </div>
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
                            </div>
                        )}                        
                        </div>          
                    </div>
                    
                    </div>
                </div>
            </div>
    );
}


export default ShowPage;
import axios from 'axios';
import { refreshTokenRequest } from '../../../shared/api/AuthApi';
import moment from 'moment-timezone';
const DOMAIN = process.env.REACT_APP_API_DOMAIN;
const API_ADMIN_DOMAIN = `${DOMAIN}/api/admin1`;

const API_DOMAIN = `${DOMAIN}/api/v1`;
const CREATE_COMMENT_URL = (articleNum) => `${API_ADMIN_DOMAIN}/${articleNum}/comment`;
const FETCH_COMMENTS_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}/comment-list`;
const EDIT_COMMENT_URL = (commentNumber) => `${API_ADMIN_DOMAIN}/comment/${commentNumber}`;

// 7.(Admin)게시글 댓글 작성 API
export const handleCommentSubmit = async (
    navigate, event, commentInput, setComments, setCommentInput, userEmail, articleNum, token, setCookie
) => {
    if (event && event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
    }
    if (!commentInput.trim()) {
        alert("댓글 내용을 입력해주세요.");
        return;
    }
    const commentData = {
        content: commentInput,
        user_email: userEmail
    };
    try {
        const response = await axios.post(CREATE_COMMENT_URL(articleNum), commentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            fetchComments(navigate, articleNum, setComments, setCookie);
            setCommentInput("");
        }
    } catch (error) {
        if (!error.response) return;
        const { code } = error.response.data;

        if (code === "ATE") {
            const newToken = await refreshTokenRequest(setCookie, token, navigate);
            if (newToken?.accessToken) {
                return handleCommentSubmit(navigate, event, commentInput, setComments, setCommentInput, userEmail, articleNum, newToken.accessToken, setCookie);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;
            }
        }
        switch (code) {
            case "AF":
                alert("댓글 작성 권한이 없습니다.");
                break;
            case "NA":
                alert("존재하지 않는 게시글입니다.");
                navigate('/article-main');
                break;
            case "NU":
                alert("로그인이 필요합니다.");
                navigate('/');
                break;
            case "VF":
                console.log("유효성 검사 실패하였습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
        return false;
    }
};

// 8.게시글 댓글 리스트 불러오기 API
export const fetchComments = (navigate, articleNum, setComments) => {
    axios.get(FETCH_COMMENTS_URL(articleNum))
        .then(response => {
            const comments = response.data.commentList;
            const formattedComments = comments.map(comment => {
                return {
                    commentNumber: comment.commentNumber,
                    writeDatetime: moment(comment.writeDatetime).format('YYYY.MM.DD HH:mm'),
                    content: comment.content,
                    user_email: comment.user_email,
                };
            });
            setComments(formattedComments || []);
        })
        .catch(err => {
            if (err.response) {
                const { code } = err.response.data;
                switch (code) {
                    case "NA":
                        console.log("이 게시글은 존재하지 않습니다.");
                        navigate('/article-main');
                        break;
                    case "DBE":
                        console.log("데이터베이스 오류가 발생했습니다.");
                        break;
                    default:
                        break;
                }
            }
        });
};


// 9.(Admin)댓글 수정 API
export const handleCommentEdit = async (navigate, commentNumber, newContent, token, setCookie) => {
    const commentData = {
        content: newContent
    };
    try {
        const response = await axios.patch(EDIT_COMMENT_URL(commentNumber), commentData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.code === "SU") {
            alert("댓글이 수정되었습니다.");
            return true;
        }
    } catch (error) {
        if (!error.response) return;
        const { code } = error.response.data;

        if (code === "ATE") {
            const newToken = await refreshTokenRequest(setCookie, token, navigate);
            if (newToken?.accessToken) {
                return handleCommentEdit(navigate, commentNumber, newContent, newToken.accessToken, setCookie);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;
            }
        }
        switch (code) {
            case "AF":
                alert("댓글 수정 권한이 없습니다.");
                break;
            case "NU":
                alert("로그인이 필요합니다.");
                navigate('/');
                break;
            case "NP":
                alert("다른 사람의 댓글입니다.");
                break;
            case "VF":
                console.log("유효성 검사 실패하였습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
        return false;
    }
};

// 10.(Admin)댓글 삭제 API
export const handleCommentDelete = async (navigate, articleNum, commentNumber, token, setCookie) => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
        return false;
    }
    try {
        const response = await axios.delete(`${API_ADMIN_DOMAIN}/comment/${commentNumber}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
            alert("댓글이 삭제되었습니다.");
            return true;
        }
    } catch (error) {
        if (!error.response) return false;
        const { code } = error.response.data;

        if (code === "ATE") {
            const newToken = await refreshTokenRequest(setCookie, token, navigate);
            if (newToken?.accessToken) {
                return handleCommentDelete(navigate, articleNum, commentNumber, newToken.accessToken, setCookie);
            } else {
                setCookie('accessToken', '', { path: '/', expires: new Date(0) });
                navigate('/');
                return null;
            }
        }
        switch (code) {
            case "AF":
                alert("댓글 삭제 권한이 없습니다.");
                break;
            case "NU":
                alert("로그인이 필요합니다.");
                navigate('/');
                break;
            case "NP":
                alert("다른 사람의 댓글입니다.");
                break;
            case "VF":
                console.log("유효성 검사 실패하였습니다.");
                break;
            case "DBE":
                console.log("데이터베이스에 문제가 발생했습니다.");
                break;
            default:
                console.log("예상치 못한 문제가 발생하였습니다.");
                break;
        }
    }
    return false;
};

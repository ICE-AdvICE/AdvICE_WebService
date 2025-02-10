import axios from 'axios';
 
const DOMAIN = 'http://localhost:8080';
const API_DOMAIN = `${DOMAIN}/api/v1`;
const authorization = (accessToken) => {
    return {headers: {Authorization:`Bearer ${accessToken}`}}
};
const CREATE_ARTICLE_URL = () => `${API_DOMAIN}/article`;
const EDIT_ARTICLE = (articleNum) => `${API_DOMAIN}/article/${articleNum}`;
const DELETE_ARTICLE_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}`;
const FETCH_ARTICLE_URL = (articleNum) => `${API_DOMAIN}/article/${articleNum}`;
const GET_ARTICLE_LIST_URL = () => `${API_DOMAIN}/article/list`;

//1. 게시물(일반,요청)을 등록하는 API
export const createArticleRequest = async (postData, accessToken) => {
    try {
        const response = await axios.post(CREATE_ARTICLE_URL(), postData, authorization(accessToken));
        return response.data;
    } catch (error) {
        if (error.response) {
            switch (error.response.data.code) {
                case "NU":
                    alert("로그인이 필요합니다.");
                    break;
                case "VF":
                    alert("내용을 입력해주세요");
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    console.log("예상치 못한 오류가 발생했습니다.");
                    break
            }
        }
        return false;  
    }
};
// 3.특정 게시물을 불러오는 API
export const fetchArticle = async (articleNum,navigate) => {
    try {
        const response = await axios.get(FETCH_ARTICLE_URL(articleNum));
        return response.data;
    } catch (error) {
        if (!error.response) {
            return;  
        }
        if (error.response) {
            switch (error.response.data.code) {
                case "NA":
                    alert("존재하지 않는 게시글입니다.");
                    navigate(`/article-main`);
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    console.log("예상치 못한 문제가 발생하였습니다.");
                    break;
            }
        } 
    }
};

// 4.게시글 수정 API
export const handleEdit = async (articleNum, token, navigate, article) => {
    if (!article) {
        alert.log("게시글을 다시 확인해주세요.");
        return false;  
    }
    const updatedArticle = {
        articleTitle: article.articleTitle,
        articleContent: article.articleContent,
        category: article.category 
    };
    try {
        const response = await axios.patch(EDIT_ARTICLE(articleNum), updatedArticle, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.code === "SU") {
        
            return true;   
        }
        } 
        catch (error) {
            if (error.response) {
                switch (error.response.data.code) {
                case "NA":
                    alert("존재하지 않는 게시글입니다");
                    navigate('/article-main');
                    break;
                case "NU":
                    alert("로그인이 필요합니다");
                    navigate('/');
                    break;
                case "VF":
                    console.log("유효성 검사 실패하였습니다", error.response.data);
                    break;
                case "DBE":
                    console.log("데이터베이스에 문제가 발생했습니다");
                    break;
                default:
                    console.log('예상치 못한 문제가 발생하였습니다');
                    break;
            }
            return false;   
        }
    
    }  
};
// 5.게시글 삭제 API
export const handleDelete = async (articleNum, token, navigate) => {  
    if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
        try {
            const response = await axios.delete(DELETE_ARTICLE_URL(articleNum), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.code === "SU") {  
                alert("게시글이 삭제되었습니다.");
                navigate('/article-main');
            } 
        } catch (err) {
            if (err.response) {
                switch (err.response.data.code) {
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
                    case "NP":
                        alert("삭제할 수 있는 권한이 없습니다.");
                        break;
                    case "DBE":
                        console.log("데이터베이스에 문제가 발생했습니다");
                        break;
                    default:
                        console.log("예상치 못한 문제가 발생하였습니다");
                        break;
                }
            } 
        }
    }
};
// 11.모든 게시글을 리스트 형태로 불러오는 API
export const getArticleListRequest = async () => {
    const result = await axios.get(GET_ARTICLE_LIST_URL())
        .then(response => {
            const responseBody = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response || !error.response.data) {
                console.log("API 응답에 문제가 발생했습니다.");
                return { message: "API 응답 오류", code: "API_ERROR" }; 
            }
            const responseBody = error.response.data;    
            if (responseBody.code === "DBE") {
                console.log("데이터베이스에 문제가 발생했습니다.");  
            }             
            return responseBody;
        })
    return result;
};




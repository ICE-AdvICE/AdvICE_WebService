import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import ToastViewer from './ToastViewer.js'; // 수정된 Viewer 컴포넌트를 임포트
import './css/ShowPage.css';

const ShowPage = () => {
    const { articleNum } = useParams();
    const [article, setArticle] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [cookies] = useCookies(['accessToken']);
    const token = cookies.accessToken;

    useEffect(() => {
        if (articleNum) {
            axios.get(`http://localhost:4000/api/v1/article/${articleNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const { articleTitle, articleContent, likeCount, comments: loadedComments, viewCount } = res.data;
                setArticle({ articleTitle, body: articleContent, views: viewCount });
                setLikes(likeCount);
                setLiked(res.data.authCheck === 1);
                setComments(loadedComments || []);
            })
            .catch(err => console.error("Error fetching post:", err));
        }
    }, [articleNum, token]);

    const handleLike = () => {
        axios.patch(`http://localhost:4000/api/v1/article/${articleNum}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            setLikes(response.data.likeCount);
            setLiked(!liked);
        })
        .catch(err => console.error("Error updating likes:", err));
    };

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
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
                <div className="ArticleTitle">
                    <h1>[{article.articleTitle}]</h1>
                </div>
                <div className="Article-Main">
                    <ToastViewer html={article.body} />
                </div>
                <div className="Comment-Option">
                    <button onClick={handleLike} className={`like-button ${liked ? 'liked' : ''}`}>
                        ❤️ 좋아요: {likes}
                    </button>
                    <p>댓글: {comments.length}</p>
                    <p>조회수: {article.views}</p>
                </div>
                <div className="CommentBox-bottom">
                    <h3>댓글</h3>
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
            <div className='d-flex2'>
                <Link className='btn edit' to={`/blogs/${articleNum}/edit`}>수정</Link>
            </div>
        </div>
    );
};

export default ShowPage;

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Listpage.css';
import ArticleMain from './ArticleMain';

const ListPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getPosts = () => {
        axios.get('http://localhost:3003/posts')
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => console.error("There was an error!", error));
    };

    const deleteBlog = (e, id) => {
        e.stopPropagation();
        axios.delete(`http://localhost:3003/posts/${id}`)
            .then(() => {
                setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            });
    };

    useEffect(() => {
        getPosts();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ArticleMain posts={posts} onDelete={deleteBlog} />
        </div>    
    );
};

export default ListPage;

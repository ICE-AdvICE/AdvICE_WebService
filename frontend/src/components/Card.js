import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const Card = ({ title, createdAt, views, likes, onDelete, order,onClick, children,category }) => {
    const location = useLocation();  
    const displayDate = createdAt ? new Date(createdAt).toISOString().split('T')[0] : '0000-00-00';
    
    return (
        <div className="card" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className="card-order">{order}</p>
                <p className="card-category">{category}</p>
                <p className='card-title'>{title}</p>
                <p className='card-created'>{displayDate}</p>
                <p className='card-views'>{views}</p>
                {location.pathname === '/admin' && (  
                    <button onClick={(e) => {
                        e.stopPropagation(); 
                        onDelete(order);
                    }}>삭제
                    </button>
                )}
                <p className='card-likes'>{likes}</p>
                {children}
            </div>
        </div>
    );
};


Card.propTypes = {
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    views: PropTypes.number,
    likes: PropTypes.number,
    order: PropTypes.number,
    email: PropTypes.string,
    category: PropTypes.number,   
    onClick: PropTypes.func,
    children: PropTypes.element,
};

Card.defaultProps = {
    createdAt: null,
    views: 0,
    order: 0,
    likes: 0,
    category: 0,  // 기본값 설정
    onClick: () => {},
    email: '',
    children: null,
};

export default Card;


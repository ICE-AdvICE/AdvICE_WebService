import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Card = ({ title, createdAt, views, likes, onDelete, order, onClick, children, category }) => {
    const titleRef = useRef(null);  
    const [isOverflow, setIsOverflow] = useState(false);   
    const location = useLocation();  

    const displayDate = createdAt ? new Date(createdAt).toISOString().split('T')[0] : '0000-00-00';

    useEffect(() => {
        const checkOverflow = () => {
            if (titleRef.current) {
                setIsOverflow(titleRef.current.scrollWidth > titleRef.current.clientWidth);
            }
        };

        checkOverflow();  // 초기 확인

        const resizeObserver = new ResizeObserver(checkOverflow);   
        resizeObserver.observe(titleRef.current);

        return () => {
            resizeObserver.disconnect();   
        };
    }, [title]);

    return (
        <div className="card" onClick={onClick}>
            <p className="card-order">{order}</p>
            <p className="card-category">{category}</p>
            <p ref={titleRef} className={`card-title ${isOverflow ? 'overflow' : ''}`}>
                {title}
            </p>
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
    );
};

Card.propTypes = {
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    views: PropTypes.number,
    likes: PropTypes.number,
    order: PropTypes.number,
    email: PropTypes.string,
    category: PropTypes.string,   
    onClick: PropTypes.func,
    children: PropTypes.element,
};

Card.defaultProps = {
    createdAt: null,
    views: 0,
    order: 0,
    likes: 0,
    category: '',   
    onClick: () => {},
    email: '',
    children: null,
};

export default Card;

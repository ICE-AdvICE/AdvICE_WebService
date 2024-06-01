import PropTypes from "prop-types";

const Card = ({ title, createdAt, views, likes, order, category, onClick, children }) => {
    const displayDate = createdAt ? new Date(createdAt).toISOString().split('T')[0] : '0000-00-00';
    return (
        <div className="card" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className="card-order">{order}</p>
                <p className='card-title'>{title}</p>
                <p className='card-created'>{displayDate}</p>
                <p className='card-views'>{views}</p>
                <p className='card-likes'>❤️ {likes}</p>
               
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
    category: PropTypes.number,  // category의 타입 정의
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
    children: null,
};

export default Card;


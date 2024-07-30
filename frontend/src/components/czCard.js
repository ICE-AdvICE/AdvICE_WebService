import PropTypes from "prop-types";

const czCard = ({ 
    category, 
    onClick, 
    children, 
    assistantName, 
    classTime, 
    className, 
    weekDay 
}) => {
    
    return (
        <div className="card" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className="card-assistantName">{assistantName}</p>
                <p className="card-category">{category}</p>
                <p className='card-classTime'>{classTime}</p>
                <p className='card-className'>{className}</p>
                <p className='card-weekDay'>{weekDay}</p>
                {children}
            </div>
        </div>
    );
};

czCard.propTypes = {
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    order: PropTypes.number,
    email: PropTypes.string,
    category: PropTypes.number,   
    onClick: PropTypes.func,
    children: PropTypes.element,
    assistantName: PropTypes.string,
    classTime: PropTypes.string,
    className: PropTypes.string,
    weekDay: PropTypes.string,
};

czCard.defaultProps = {
    createdAt: null,
    views: 0,
    order: 0,
    likes: 0,
    category: 0,  // 기본값 설정
    onClick: () => {},
    email: '',
    children: null,
    assistantName: '',
    classTime: '',
    className: '',
    weekDay: '',
};

export default czCard;

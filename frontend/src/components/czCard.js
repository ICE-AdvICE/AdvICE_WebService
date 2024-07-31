import PropTypes from "prop-types";

const czCard = ({ 
    category, onClick,classDate, children, assistantName, classTime, className, weekDay ,currentNumber,maximumNumber
}) => {
    
    return (
        <div className="czcard" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className='card-weekDay'>{weekDay}</p>
                <p className="card-category">{classDate}</p>
                <p className='card-classTime'>{classTime}</p>
                <p className='card-className'>{className}</p>
                <p className="card-assistantName">{assistantName}</p>
                <p className="card-category">{category}</p>
               
                
                
                <p className='card-currentNumber'> {currentNumber}</p>
                <p className='card-maximumNumber'> {maximumNumber}</p>
                {children}
            </div>
        </div>
    );
};

czCard.propTypes = {
    category: PropTypes.number,
    onClick: PropTypes.func,
    children: PropTypes.element,
    assistantName: PropTypes.string,
    classTime: PropTypes.string,
    classDate: PropTypes.string,
    className: PropTypes.string,
    weekDay: PropTypes.string,
    currentNumber: PropTypes.number,
    maximumNumber: PropTypes.number
};

czCard.defaultProps = {
    category: 0,
    onClick: () => {},
    children: null,
    assistantName: '',
    classTime: '',
    classDate: '',
    className: '',
    weekDay: '',
    currentNumber: 0,
    maximumNumber: 0
};

export default czCard;
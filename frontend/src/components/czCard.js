import PropTypes from "prop-types";

const czCard = ({ 
    onReserveClick , onClick,classDate, children, assistantName, classTime, className, weekDay ,currentNumber,maximumNumber,isReserved
}) => {
    function getShortWeekDay(weekDay) {
        const days = {
            monday: "Mon",
            tuesday: "Tue",
            wednesday: "Wed",
            thursday: "Thu",
            friday: "Fri",
 
        };
        return days[weekDay.toLowerCase()] || weekDay;
    }
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;  
        const day = date.getDate();
        return `${month}/${day}`;
    }
    function formatTime(timeString) {
         
        return timeString.substring(0, 5);
    }
    
    return (
        <div className="czcard" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className='card-weekDay'>{getShortWeekDay(weekDay)}</p>
                <p className="card-cateDate">{formatDate(classDate)}</p>
                <p className='card-classTime'>{formatTime(classTime)}</p>
                <p className='card-hidden-space '>''</p>
                <p className='card-className'>{className}</p>
                <p className="card-assistantName">{assistantName}</p>
                
                <p className='card-currentNumber'>{`${currentNumber}/${maximumNumber}`}</p>
                {children}
                <button
                    onClick={(e) => {
                        e.stopPropagation();  
                        onReserveClick(); 
                    }}
                    className="card-reservation"  
                >
                    {isReserved ? '예약 완료' : '예약'}
                </button>

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
    maximumNumber: PropTypes.number,
    onReserveClick: PropTypes.func
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
    maximumNumber: 0,
    onReserveClick: () => {} 
};

export default czCard;
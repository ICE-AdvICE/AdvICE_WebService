import PropTypes from "prop-types";

const czCard = ({ 
    category, onClick,classDate, children, assistantName, classTime, className, weekDay ,currentNumber,maximumNumber
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
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        const day = date.getDate();
        return `${month}/${day}`;
    }
    function formatTime(timeString) {
        // AM/PM 제거
        return timeString.replace(/( AM| PM)/, '');
    }
    return (
        <div className="czcard" onClick={onClick}>
            <div className="d-flex justify-content-between">
                <p className='card-weekDay'>{getShortWeekDay(weekDay)}</p>
                <p className="card-cateDate">{formatDate(classDate)}</p>
                <p className='card-classTime'>{formatTime(classTime)}</p>
                <p className='card-className'>{className}</p>
                <p className="card-assistantName">{assistantName}</p>
                <p className='card-currentNumber'>{`${currentNumber}/${maximumNumber}`}</p>
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
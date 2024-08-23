import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

const CzCard = ({ 
    disableReserveButton, 
    onDeleteClick, 
    isAdmin, 
    onReserveClick, 
    onClick, 
    classDate, 
    children, 
    assistantName, 
    classTime, 
    className, 
    weekDay, 
    currentNumber, 
    maximumNumber, 
    isReserved
}) => {
    const [cookies] = useCookies(['accessToken']);
    const token = cookies.accessToken;

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
            <p className='card-weekDay'>{weekDay}</p>
            <p className="card-weekDate">{formatDate(classDate)}</p>
            <p className='card-classTime'>{formatTime(classTime)}</p>
            <p className='card-hidden-space'></p>
            <p className='card-className'>{className}</p>
            <p className="card-assistantName">{assistantName}</p>
            <p className='card-currentNumber'>{`${currentNumber}/${maximumNumber}`}</p>
            {children}
            
            {token && (  
                <div className="card-button-container">
                    {
                        isAdmin ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteClick(); 
                                }}
                                className="card-delete"
                            >
                                삭제
                            </button>
                        ) : (
                            maximumNumber === currentNumber ? (
                                 
                                isReserved ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();  
                                            onReserveClick(); 
                                        }}
                                        className="card-reservation"
                                        style={{ backgroundColor: '#FFFF00' }}  
                                    >
                                        취소
                                    </button>
                                ) : (
                                    <button
                                        className="card-reservation"
                                        disabled
                                        style={{ backgroundColor: '#CCCCCC' }}  
                                    >
                                        마감
                                    </button>
                                )
                            ) : (
                                isReserved !== undefined && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();  
                                            onReserveClick(); 
                                        }}
                                        className="card-reservation"
                                        disabled={disableReserveButton && !isReserved}  
                                        style={{
                                            backgroundColor: isReserved ? '#FFFF00' : '#15FF00'
                                        }}
                                    >
                                        {isReserved ? '취소' : '예약'}
                                    </button>
                                )
                            )
                        )
                    }
                </div>
            )}
        </div>
    );
};

CzCard.propTypes = {
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
    onReserveClick: PropTypes.func,
    isAdmin: PropTypes.bool,
    onDeleteClick: PropTypes.func,
    isReserved: PropTypes.bool,
    disableReserveButton: PropTypes.bool
};

CzCard.defaultProps = {
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
    onReserveClick: () => {},
    isAdmin: false,
    onDeleteClick: () => {},
    isReserved: undefined,
    disableReserveButton: false
};

export default CzCard;

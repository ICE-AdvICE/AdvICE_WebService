import React, { useState, useEffect } from 'react';
import '../css/codingzone/codingzone-main.css';
import czCard from '../../components/czCard';
 
const CodingMain = () => {
    return (
        <div className = "codingzone-container">
            <div className = "img-container">
                <img src="/coding-zone-main.png" className="codingzonetop-image"/>
            </div>
            <div className = 'codingzone-body-container'>
                <div className = "cz-category-date">
                    <button>category1</button>
                    <button>category2</button>
                </div>
                <div className = "codingzone-date">
                    <button>Mon</button>
                    <button>Tue</button>
                    <button>Wen</button>
                    <button>Thu</button>
                    <button>Fri</button>
                </div>
                <div className ='None'>
                </div>
                <div className = 'cz-card'>
                   
                </div>
                
            

            </div>
        </div>
    );

};
export default CodingMain
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getczassitantRequest, getczauthtypetRequest} from '../../apis/Codingzone-api';
import styles from '../css/codingzone/InquiryModal.module.css';
import '../../Modals/modules.css';


const InquiryModal = ({ isOpen, onClose }) => {
    const [assistants, setAssistants] = useState({ zone1: [], zone2: [] });
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchAssistants();
        }
    }, [isOpen]);

    const fetchAssistants = async () => {
        const response = await getczassitantRequest();
        if (response && response.code === "SU") {
            setAssistants({
                zone1: response.listOfCodingZone1,
                zone2: response.listOfCodingZone2
            });
        }else {
            console.error(response.message);
        }
    };

    return (
        <div className={isOpen ? styles.root : styles.rootDisable}>
            <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
            <div className="loginHeaderContainer">
        <img src="/header-name.png" alt="로그인 로고" className="responsiveLogo" />
      </div>
                <div className={styles.close} onClick={onClose}>×</div>
                <div className={styles.title}><strong>과 사무실</strong></div>
                <div className={styles.modalBody}>
                    <strong>이메일:</strong> ice@hufs.ac.kr<br />
                    <strong>연락처:</strong> 031-330-4255
                </div>
                <div className={styles.title}><strong>코딩존 조교</strong></div>
                <div className={styles.modalBody}>
    <strong>코딩존 1</strong>
    <ul style={{ listStyleType: 'none' }}> {/* 점을 제거합니다 */}
        {assistants.zone1.map((assistant, index) => (
            <li key={index}>
                {assistant.name} ({assistant.email})
            </li>
        ))}
    </ul>
    <strong>코딩존 2</strong>
    <ul style={{ listStyleType: 'none' }}> {/* 점을 제거합니다 */}
        {assistants.zone2.map((assistant, index) => (
            <li key={index}>
                {assistant.name} ({assistant.email})
            </li>
        ))}
    </ul>
</div>
            </div>
        </div>
    );
};

export default InquiryModal;
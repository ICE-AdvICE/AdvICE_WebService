import React from 'react';
import styles from './BaseModal.module.css';


export default function MyModal({ open, title, bodyStyle, children, onCancel, footer, width, header}) {



    return (
        <div className={open ? styles.root : styles.rootDisable} onClick={onCancel}>
            <div className={styles.modalContainer} style={{ width: width ? width : '' }} onClick={e => e.stopPropagation()}>
                <div className={styles.close} onClick={onCancel}>×</div>
                {header && header.length > 0 && <div className={styles.header}>{header.map((d, i) => <React.Fragment key={i}>{d}</React.Fragment>)}</div>}
                <div className={styles.modalBody} style={bodyStyle}>
                    {children}
                </div>
                {footer && footer.length > 0 && <div className={styles.footer}>{footer.map((d, i) => <React.Fragment key={i}>{d}</React.Fragment>)}</div>}
            </div>
        </div>
    );
};
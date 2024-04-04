import React from 'react';
import styles from './MyModal.module.css';


export default function MyModal({ open, title, bodyStyle, children, onCancel, footer, width, header}) {

	// open: boolean
    // title: string
    // bodyStyle: CSS Propery (Object)
    // onCancel: func
    // footer: ReactNode (Array)

    return (
        <div 
            className={open ? styles.root : styles.rootDisable}
        >
            <div 
                className={styles.modalContainer}
                style={{ 
                    width: width ? width : ''
                }}
            >
                <div 
                    className={styles.close} 
                    onClick={onCancel}
                >
                    ×
                </div>
                {
                    header.length > 0 ?
                        <div className={styles.header}>
                            {header.map(d => d)}
                        </div>
                        :
                        null
                }

                <div className={styles.modalBody} style={bodyStyle}>
                    {children}
                </div>

                {
                    footer.length > 0 ?
                        <div className={styles.footer}>
                            {footer.map(d => d)}
                        </div>
                        :
                        null
                }

               


            </div>
        </div>
    )
}
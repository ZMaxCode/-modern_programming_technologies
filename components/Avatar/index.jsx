import React from 'react';
import styles from './style.module.scss';

const Avatar = ({src, className, style}) => {
    return (
        <div className={`${styles.avatar} ${className}`} style={style}>
            {!src ? 
                <i className={`pi pi-user ${styles.avatar__icon}`} />
            :
                <img src={src} alt="user" className={styles.avatar__image}/>
            }
        </div>
    )
}

export default Avatar;
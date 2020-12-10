import styles from './style.module.scss';

const Results = (props) => {
    return (
        <div>
            <h3 className={styles.h1}>Ваш результат: <span className={styles.score}>{props.scores}</span> 👏</h3>
        </div>
    )
}

export default Results;
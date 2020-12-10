import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import styles from './style.module.scss';

const TestsSettings = (props) => {

    return (
        <>
            <div className='p-mt-6'>
                <label htmlFor="questionCount">Количество вопросов</label><br />
                <InputNumber
                    id="questionCount"
                    value={props.questionsCount === undefined ? props.questions.length : props.questionsCount}
                    onChange={props.onChangeQuestionsCount}
                    min={0} max={props.questions.length}
                    placeholder='Введите число вопросов'
                    className={`${styles.input} p-mt-2`}
                />
                <small className='p-d-block p-mt-1 p-text-secondary'>Максимальное количество вопросов: {props.questions.length}</small>
            </div>
            <div className='p-mt-4'>
                <label htmlFor="timeLimit">Время на тест (мин.)</label><br />
                <InputNumber
                    id="timeLimit"
                    value={props.duration / 60 / 1000}
                    onChange={(e) => props.setDuration(e.value * 60 * 1000)}
                    placeholder='Введите время'
                    className={`${styles.input} p-mt-2`}
                />
            </div>
            <div className="p-mt-4 p-pl-0">
                <label htmlFor='complexity'>Сложность</label><br />
                <MultiSelect
                    id='complexity'
                    value={props.selectedComplexity}
                    onChange={(e) => {
                        props.onChangeComplexity(e)
                    }}
                    options={props.complexity}
                    optionLabel={'value'}
                    className={`${styles.input} p-mt-2`}
                    placeholder='Выберите сложность'
                />
            </div>
        </>
    )
}

export default TestsSettings;
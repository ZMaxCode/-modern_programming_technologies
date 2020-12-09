import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import styles from './style.module.scss';

const TestsSettings = (props) => {
    return (
        <>
            <h4>Number of questions in the selected sections: {props.questions.length}</h4>
            <div className='p-pt-3'>
                <span className="p-float-label">
                    <InputNumber
                        id="questionCount"
                        value={props.questionsCount === undefined ? props.questions.length : props.questionsCount}
                        onChange={props.onChangeQuestionsCount}
                        min={0} max={props.questions.length}
                    />
                    <label htmlFor="questionCount">Question count</label>
                </span>
            </div>
            <div className='p-pt-4'>
                <span className="p-float-label">
                    <InputNumber
                        id="timeLimit"
                        value={props.duration / 60 / 1000}
                        onChange={(e) => props.setDuration(e.value * 60 * 1000)} />
                    <label htmlFor="timeLimit">Time limit</label>
                </span>
            </div>
            <div className="p-field p-mt-4 p-pl-0">
                <span className="p-float-label">
                    <MultiSelect
                        id='complexity'
                        value={props.selectedComplexity}
                        onChange={(e) => {
                            props.onChangeComplexity(e)
                        }}
                        options={props.complexity}
                        optionLabel={'value'}
                        className={styles.multi}
                    />
                    <label htmlFor='complexity'>Complexity</label>
                </span>
            </div>
        </>
    )
}

export default TestsSettings;
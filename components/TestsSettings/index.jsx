import { InputNumber } from 'primereact/inputnumber';

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
        </>
    )
}

export default TestsSettings;
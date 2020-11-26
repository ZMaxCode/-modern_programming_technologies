import { Checkbox } from 'primereact/checkbox';
import { useContext } from 'react';
import Context from '../../../contexts/changeAnswerContext';

const Multi = () => {
    const {id, text, possible_answers, setAnswers, answers} = useContext(Context);

    function onAnswerChange(e) {
        let copy = [...answers];
    
        let answer = copy.find(el => el.question_id === id);
        
        if( answer === undefined ){
            copy.push({
                question_id : id,
                answers: [e.value]
            })

            setAnswers(copy);
            return
        }

        let selectedAnswers = [...answer.answers];

        if(e.checked){
            selectedAnswers.push(e.value)
        } else {
            selectedAnswers = selectedAnswers.filter(el => el !== e.value)
        }

        answer.answers = selectedAnswers;

        setAnswers(copy);
    }

    let answer = answers.find(el => el.question_id === id);

    return (
        <>
            <h2>
                {text}
            </h2>
            {
                possible_answers.map((ans, i) => (
                    <div key={ans.id} className="p-field-checkbox">
                        <Checkbox
                            inputId={i}
                            name="answer"
                            value={ans.id}
                            onChange={onAnswerChange}
                            checked={ answer === undefined ? undefined : answer.answers.some(el => el === ans.id)}
                        />
                        <label htmlFor={i}>{ans.text}</label>
                    </div>
                ))
            }
        </>
    )
}

export default Multi;
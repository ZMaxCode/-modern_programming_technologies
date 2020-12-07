import { InputTextarea } from 'primereact/inputtextarea';
import { useContext } from 'react';
import Context from '../../../contexts/changeAnswerContext';

const Free = () => {
    const { id, text, answers, setAnswers } = useContext(Context);

    function onChange(e) {
        let copy = [...answers];
        
        let answer = copy.find(el => el.question_id === id);
        
        if (answer === undefined){
            copy.push({
                question_id: id,
                answers: [e.target.value]
            });
        } else {
            answer.answers = [e.target.value];
        }
        
        setAnswers(copy);
    }

    let answer = answers.find(el => el.question_id === id);

    return (
        <>
            {
                <InputTextarea value={ answer === undefined ? '' : answer.answers[0]} onChange={onChange} />
            }
        </>
    )
}

export default Free;
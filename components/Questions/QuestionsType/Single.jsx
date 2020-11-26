import { RadioButton } from 'primereact/radiobutton';
import { useContext } from 'react';
import Context from '../../../contexts/changeAnswerContext';

const Single = () => {
    const { id, text, answers, possible_answers, setAnswers } = useContext(Context);

    function onChange(e) {
        let copy = [...answers];

        let answer = copy.find(el => el.question_id === id);

        if (answer === undefined){
            copy.push({
                question_id: id,
                answers: [e.value]
            });
        } else {
            answer.answers = [e.value];
        }

        setAnswers(copy);
    }

    
    let _checked = answers.find(el => el.question_id === id);

    return (
        <>
            <h2>
                {text}
            </h2>
            {
                possible_answers.map((ans, i) => {
                    return (
                        <div key={ans.id} className="p-field-radiobutton">
                            <RadioButton
                                inputId={i}
                                name="answer"
                                value={ans.id}
                                onChange={onChange}
                                checked={ _checked !== undefined && _checked.answers[0] === ans.id}
                            />
                            <label htmlFor={i}>{ans.text}</label>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Single;
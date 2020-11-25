import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

const Question = (props) => {
    const [answer, setAnswer] = useState([]);

    function onAnswerChange(e) {
        let selectedAnswer = [...answer];

        console.log(e)

        if (e.checked) {
            selectedAnswer.push(e.value);
        }
        else {
            for (let i = 0; i < selectedAnswer.length; i++) {
                console.log(e.value)
                const selectedCategory = selectedAnswer[i];

                if (selectedCategory.id === e.value.id) {
                    selectedAnswer.splice(i, 1);
                    break;
                }
            }
        }

        setAnswer(selectedAnswer);
    }

    console.log(answer)
    return (
        <>
            <h2>
                {props.text}
            </h2>
            {
                props.type === 'free' ?
                    <InputTextarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
                    : props.type === 'single' ?
                        props.answers.map((ans, i) => {
                            return (
                                <div key={i} className="p-field-radiobutton">
                                    <RadioButton inputId={i} name="answer" value={ans} onChange={(e) => setAnswer(e.value)} checked={answer !== undefined && answer.id === ans.id} />
                                    <label htmlFor={i}>{ans.text}</label>
                                </div>
                            )
                        })
                        :
                        props.answers.map((ans, i) => (
                            <div key={i} className="p-field-checkbox">
                                <Checkbox inputId={i} name="category" value={ans} onChange={onAnswerChange} checked={answer.some( el => el.id === ans.id )}/>
                                <label htmlFor={i}>{ans.text}</label>
                            </div>
                        ))
            }
        </>
    )
}

export default Question;
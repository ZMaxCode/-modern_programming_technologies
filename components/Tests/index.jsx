import Question from '../Questions';
import Context from '../../contexts/changeAnswerContext';

const Test = (props) => {
    return (
        <>
            {
                props.questions.map(question => {
                    return (
                        <Context.Provider value={
                            {
                                answers: props.answers,
                                setAnswers: props.setAnswers,
                                id: question.id,
                                text: question.text,
                                question_type: question.question_type,
                                possible_answers: question.possible_answers
                            }
                        }>
                            <Question
                                key={`${question.id}`}
                            ></Question>
                        </Context.Provider>
                    )
                })
            }
        </>
    )
}

export default Test;
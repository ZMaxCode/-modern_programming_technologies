import Question from '../Questions';
import Context from '../../contexts/changeAnswerContext';
import React from 'react';

const Test = (props) => {
    return (
        <>
            {
                props.questions.map((question, i) => {
                    return (
                        <React.Fragment key={`${i}`}>
                            <Context.Provider value={
                                {
                                    answers: props.answers,
                                    setAnswers: props.setAnswers,
                                    id: question.id,
                                    text: question.text,
                                    question_type: question.question_type,
                                    possible_answers: question.possible_answers,
                                    index: i
                                }
                            }>
                                <Question/>
                            </Context.Provider>
                        </React.Fragment>
                    )
                })
            }
        </>
    )
}

export default Test;
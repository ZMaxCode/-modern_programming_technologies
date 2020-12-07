import React, { useContext } from 'react';
import * as QuestionsType from './QuestionsType';
import Context from '../../contexts/changeAnswerContext';

const Question = () => {
    const { text, question_type } = useContext(Context);
    return (
        <>
            <h3>
                {text}
            </h3>
            {
                React.createElement(QuestionsType[question_type])
            }
        </>
    )
}

export default Question;
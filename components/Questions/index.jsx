import React, { useContext } from 'react';
import * as QuestionsType from './QuestionsType';
import Context from '../../contexts/changeAnswerContext';

const Question = () => {
    const {id, question_type } = useContext(Context);
    return (
        <>
            {
                React.createElement(QuestionsType[question_type])
            }
        </>
    )
}

export default Question;
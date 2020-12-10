import React, { useContext } from 'react';
import * as QuestionsType from './QuestionsType';
import Context from '../../contexts/changeAnswerContext';

const Question = () => {
    const { text, question_type, index } = useContext(Context);
    return (
        <>
            <h3 className='p-mt-6 p-mb-3'>
                {index + 1}. {text}
            </h3>
            {
                React.createElement(QuestionsType[question_type])
            }
        </>
    )
}

export default Question;
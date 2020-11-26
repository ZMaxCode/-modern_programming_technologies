import host from '../../helpers/host';
import port from '../../helpers/port';
import Question from '../../components/Questions';
import { MultiSelect } from 'primereact/multiselect';
import { useState } from 'react';
import styles from './style.module.scss';
import Context from '../../contexts/changeAnswerContext';

function Course({ course }) {
    const [sectionName, setSectionName] = useState([]);
    const [answers, setAnswers] = useState([]);
    let _sections = [];

    function sections(structure) {
        structure.forEach(el => {
            if ('nested_course_sections' in el && el.nested_course_sections.length !== 0) {
                _sections.push(el.nested_course_sections);
                sections(el.nested_course_sections);
            }
        })
    }

    sections(course.structure)

    function handle(i, event) {
        let copy = [...sectionName];
        copy[i] = event.value;
        setSectionName(copy);
    }

    console.log(answers)

    return (
        <div className={styles.card}>
            <div className="p-field p-md-4 p-pl-0">
                <span className="p-float-label">
                    <MultiSelect id="0" value={sectionName[0]} onChange={(e) => {
                        handle(0, e);
                    }} options={course.structure} optionLabel="section.name" className={styles.multi} filter />
                    <label htmlFor="0">Course section</label>
                </span>
            </div>
            {
                _sections.map((el, i) => {
                    return (
                        <div key={i} className="p-field p-md-4 p-pl-0">
                            <span className="p-float-label">
                                <MultiSelect id={`${i + 1}`} value={sectionName[i + 1]} onChange={(e) => {
                                    handle(i + 1, e)
                                }} options={el} optionLabel="section.name" className={styles.multi} filter />
                                <label htmlFor={`${i + 1}`}>{`${el[0].level_name}`}</label>
                            </span>
                        </div>
                    )
                })
            }
            {
                sectionName.map(el => {
                    return el.map(el1 => {
                        if ('questions' in el1) {
                            return el1.questions.map((question, i) => {
                                return (
                                    <Context.Provider value={
                                        {
                                            answers,
                                            setAnswers,
                                            id : question.id,
                                            text: question.text,
                                            question_type: question.question_type,
                                            possible_answers: question.possible_answers
                                        }
                                    }>
                                        <Question
                                            key={i}
                                        ></Question>
                                    </Context.Provider>
                                )
                            })
                        }
                    })
                })
            }
        </div>
    )
}

export async function getServerSideProps({ query }) {
    const id = query.id;

    const res = await fetch(`http://${host}:${port}/courses/${id}?represent=testing`, {
        method: 'GET'
    })

    const { payload: course } = await res.json()

    return {
        props: {
            course
        }
    }

}

export default Course;
import host from '../../helpers/host';
import port from '../../helpers/port';
import Question from '../../components/Question';
import { MultiSelect } from 'primereact/multiselect';
import { useState } from 'react';
import styles from './style.module.scss';

function Course({ course }) {
    const [sectionName, setSectionName] = useState([]);
    let _sections = [];

    function sections(structure) {
        structure.map(el => {
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
                        <>
                            <div className="p-field p-md-4 p-pl-0">
                                <span className="p-float-label">
                                    <MultiSelect id={`${i + 1}`} value={sectionName[i + 1]} onChange={(e) => {
                                        handle(i + 1, e)
                                    }} options={el} optionLabel="section.name" className={styles.multi} filter />
                                    <label htmlFor={`${i + 1}`}>{`${el[0].level_name}`}</label>
                                </span>
                            </div>
                        </>
                    )
                })
            }
            {
                sectionName.map(el => {
                    return el.map(el1 => {
                        if ('questions' in el1) {
                            return el1.questions.map(question => {
                                console.log(question)
                                return (
                                    <>
                                        <Question 
                                            text={question.text} 
                                            type={question.question_type}
                                            answers={question.possible_answers}
                                        ></Question>
                                    </>
                                )
                            })
                        }
                    })
                })
            }
        </div>
    )
}

export async function getServerSideProps({ query, req }) {
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
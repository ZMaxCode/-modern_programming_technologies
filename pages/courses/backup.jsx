import host from '../../helpers/host';
import port from '../../helpers/port';
import { MultiSelect } from 'primereact/multiselect';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import Tests from '../../components/Tests';

function Course({ course }) {
    const [sectionName, setSectionName] = useState([[]]);
    const [questions, setQuestions] = useState([[]]);
    const [questionsForTest, setQuestionForTest] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [questionCount, setQuestionCount] = useState();
    const [timerActive, setTimerActive] = useState(false);
    const [time, setTime] = useState();
    const [duration, setDuration] = useState(10 * 60 * 1000);
    const [start, setStart] = useState(false);

    let toast;

    useEffect(() => {
        function sections(structure) {
            structure.forEach(el => {
                if ('nested_course_sections' in el && el.nested_course_sections.length !== 0) {
                    sectionName.push([]);
                    questions.push([]);
                    sections(el.nested_course_sections);
                }
            })
        }

        sections(course.structure)
    }, [])

    function inputs(idx) {
        return sectionName[idx].map((el, i) => {
            if ('nested_course_sections' in el && el.nested_course_sections.length !== 0) {
                let sections = el.nested_course_sections;

                let elem = (
                    <div className="p-field p-md-4 p-pl-0">
                        <span className="p-float-label">
                            <MultiSelect id={`${i + 1}`} value={sectionName[idx + 1]} onChange={(e) => {
                                handle(idx + 1, e);
                            }} options={sections} optionLabel="section.name" className={styles.multi} filter />
                            <label htmlFor="0">Course section</label>
                        </span>
                    </div>
                )

                let elem2 = inputs(idx + 1);

                return (
                    <>
                        {elem}
                        {elem2}
                    </>
                )
            }
        })
    }

    function handle(i, event) {
        let copy = [...sectionName];
        let copy2 = [...questions];

        console.log(event)

        copy[i] = event.value;
        copy[i].map(el => {
            if ('questions' in el) {
                el.questions.map(question => {
                    if (copy2[i].find(el => el.id === question.id) === undefined)
                        copy2[i].push(question);
                })
            }
        })

        if (event.value.length === 0) {
            for (let j = i; j < copy.length; j++) {
                copy[j] = [];
                copy2[j] = [];
            }
        }
        
        setSectionName(copy);
        setQuestions(copy2);
    }

    function onTimerUpdate({ time, duration }) {
        setTime(time);
        setDuration(duration);
    }

    function startTest() {
        let error = false;
        
        if (sectionName[0].length === 0) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'You have chosen a course',
                life: 30000
            })

            error = true;
        }

        let questions_ = []
        questions.map( el => {
            el.map(question => questions_.push(question))
        } )

        if( questions_.length === 0 ) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No questions',
                life: 30000
            })

            error = true;
        }

        if( error ) return

        setTimerActive(true)
        setStart(true)
    }

    console.log(sectionName)

    return (
        <div className={styles.card}>
            {
                !start ?
                    <>
                        <div className="p-field p-md-4 p-pl-0">
                            <span className="p-float-label">
                                <MultiSelect id="0" value={sectionName[0]} onChange={(e) => {
                                    handle(0, e);
                                }} options={course.structure} optionLabel="section.name" className={styles.multi} filter />
                                <label htmlFor="0">Course section</label>
                            </span>
                        </div>
                        {
                            inputs(0)
                        }
                        <div className='p-pt-3'>
                            <span className="p-float-label">
                                <InputText id="questionCount" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} />
                                <label htmlFor="questionCount">Question count</label>
                            </span>
                        </div>
                        <div className='p-pt-4'>
                            <span className="p-float-label">
                                <InputNumber id="timeLimit" value={duration / 60 / 1000} onChange={(e) => setDuration(e.value * 60 * 1000)} />
                                <label htmlFor="timeLimit">Time limit</label>
                            </span>
                        </div>
                        <Button label='Start test' className='p-mt-3 p-d-block' onClick={startTest} />
                    </>
                    :
                    <>
                        <h1 className={styles.timer}>
                            <Timer active={timerActive} duration={duration} onTimeUpdate={onTimerUpdate} />
                            <Timecode time={duration - time} />
                        </h1>
                        <Tests
                            sections={sectionName}
                            answers={answers}
                            setAnswers={setAnswers}
                        ></Tests>
                    </>
            }
            <Toast ref={(el) => toast = el} position='bottom-left' />
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
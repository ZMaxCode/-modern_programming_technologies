import host from '../../helpers/host';
import port from '../../helpers/port';
import SectionsSettings from '../../components/SectionsSettings';
import TestsSettings from '../../components/TestsSettings';
import Tests from '../../components/Tests';
import Timer from '../../components/Timer';
import Results from '../../components/Results';
import { useState, useEffect } from 'react';
import styles from './style.module.scss';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function Course({ course }) {
    const [isSectionSettings, setIsSectionSettings] = useState(true);
    const [sections, setSections] = useState([[]])
    const [selectSections, setSelectSections] = useState([[]]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [isTestSettings, setIsTestSettings] = useState(false);
    const [questionsCount, setQuestionsCount] = useState();
    const [timerActive, setTimerActive] = useState(false);
    const [duration, setDuration] = useState(10 * 60 * 1000);

    const [isStartTest, setIsStartTest] = useState(false);
    const [answers, setAnswers] = useState([]);

    const [isFinishTest, setIsFinishTest] = useState(false);
    const [scores, setScores] = useState(0);
    let toast;

    useEffect(() => {
        function sections_(structure, idx) {
            let copy = [...sections];
            structure.map(el => copy[idx].push(el));
            setSections(copy);

            structure.forEach(el => {
                if ('nested_course_sections' in el && el.nested_course_sections.length !== 0) {
                    sections.push([]);
                    selectSections.push([]);
                    sections_(el.nested_course_sections, idx + 1);
                }
            })
        }

        sections_(course.structure, 0);
    }, [])

    function handle(i, event) {
        let copy = [...selectSections];

        copy[i] = event.value;

        if (event.value.length === 0) {
            for (let j = i; j < copy.length; j++) {
                copy[j] = [];
            }
        }

        setSelectSections(copy);
    }

    function onSectionsChange(e) {
        let copy = [...selectedSections];
        let copy2 = [...questions];

        if (e.checked) {
            copy.push(e.value);
            e.value.questions.map(el => copy2.push(el));
        } else {
            copy = copy.filter(el => el !== e.value);
            copy2 = copy2.filter(el => e.value.id !== el.owner_section_id);
        }

        setSelectedSections(copy);
        setQuestions(copy2);
    }

    function testSettings() {
        setIsSectionSettings(false);
        setIsTestSettings(true);
    }

    function SectionSettings() {
        setIsTestSettings(false);
        setIsSectionSettings(true);
    }

    function onChangeQuestionsCount(e) {
        if (e.value > questions.length) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'The value cannot be more than the number of questions',
                life: 30000
            })
            return
        }

        setQuestionsCount(e.value)
    }

    function startTest() {
        let error = false;

        if (selectSections.length === 0) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'You have not selected sections',
                life: 30000
            })

            error = true;
        }

        if (error) return;

        if (selectedSections.length === 0) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'You have not selected the sections from which to take questions',
                life: 30000
            })

            error = true;
        }

        if (error) return;

        if (questions.length === 0) {
            toast.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Selected sections have no questions',
                life: 30000
            })

            error = true;
        }

        if (error) return;

        if (questionsCount === undefined) setQuestionsCount(questions.length);

        if (questionsCount < questions.length) {
            let quests = [];

            for (let i = 0; i < questionsCount; i++) {
                quests.push(questions.splice(Math.floor(Math.random() * questions.length - 1), 1)[0]);
            }

            setQuestions(quests);
        }

        setIsTestSettings(false);
        setIsStartTest(true);
        setTimerActive(true);
    }

    function finishTest() {
        let copy = scores;

        answers.map(answer => {
            questions.find(questions => questions.id === answer.question_id)?.possible_answers?.map(el => {
                if (answer.answers.find(ans => el.id === ans) && el.is_right)
                    copy += el.points
            })
        })

        setScores(copy);

        setTimerActive(false);
        setIsStartTest(false);
        setIsFinishTest(true);
    }

    if (isStartTest && !timerActive) {
        finishTest();
    }

    return (
        <div className={styles.card}>
            {
                isSectionSettings &&
                <>
                    <SectionsSettings
                        sections={sections}
                        selectSections={selectSections}
                        selectedSections={selectedSections}
                        questions={questions}
                        onSectionsChange={onSectionsChange}
                        handle={handle}
                    />
                    <Button icon='pi pi-angle-right' label='Next step' className='p-mt-3 p-d-block' onClick={testSettings} />
                </>
            }
            {
                isTestSettings &&
                <>
                    <TestsSettings
                        questions={questions}
                        questionsCount={questionsCount}
                        onChangeQuestionsCount={onChangeQuestionsCount}
                        duration={duration}
                        setDuration={setDuration}
                    />
                    <div className='p-mt-3'>
                        <Button icon='pi pi-angle-left' label='Cancel' className='p-button-text p-button-secondary' onClick={SectionSettings} />
                        <Button icon='pi pi-angle-right' label='Start test' className='p-mt-3 p-ml-6' onClick={startTest} />
                    </div>
                </>
            }
            {
                isStartTest &&
                <>
                    <Timer
                        duration={duration}
                        timerActive={timerActive}
                        setTimerActive={setTimerActive}
                    />
                    <Tests
                        questions={questions}
                        answers={answers}
                        setAnswers={setAnswers}
                    ></Tests>
                    <div className='p-mt-3'>
                        <Button icon='pi pi-check' label='Finish test' className='p-mt-3' onClick={finishTest} />
                    </div>
                </>
            }
            {
                isFinishTest &&
                <>
                    <Results
                        scores={scores}
                    />
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
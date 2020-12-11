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
import View from '../../components/view';
import Avatar from '../../components/Avatar';
import { DropDown } from 'primereact/dropdown';
import ThemeSettings from '../../components/ThemeSettings';

function Course({ course }) {
    const [sections, setSections] = useState([[]])
    const [selectSections, setSelectSections] = useState([[]]);
    const [selectedSections, setSelectedSections] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [questionsCount, setQuestionsCount] = useState();
    const [timerActive, setTimerActive] = useState(false);
    const [duration, setDuration] = useState(10 * 60 * 1000);
    const [complexity, setComplexity] = useState([]);
    const [selectedComplexity, setSelectedComplexity] = useState([]);

    const [answers, setAnswers] = useState([]);

    const [scores, setScores] = useState(0);
    const [activePanel, setActivePanel] = useState('sections');
    const [courseValue, setCourseValue] = useState(1);
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

        console.log(event.value)

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

    useEffect(() => {
        console.log(questions, complexity)
    }, [questions, complexity])

    function testSettings() {

        let copy = [...complexity];

        questions.forEach(el => {
            if (!copy.find(c => c.value === el?.complexity)) {
                copy.push({ value: el.complexity })
            }
        })

        setComplexity(copy);

        setActivePanel('settings')
    }

    function SectionSettings() {
        setActivePanel('themes')
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

    function onChangeComplexity(e) {
        setSelectedComplexity(e.value);

        let count = e.value.length === 0 ? questions.length : questions.filter(el => e.value.indexOf(el.complexity) > -1).length

        setQuestionsCount(count);
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

        let copy = questionsCount;
        let quests = questions;
        console.log(copy, questions)

        if (questionsCount === undefined)
            copy = questions.length;
        else
            quests = questions.filter(el => selectedComplexity.indexOf(el.complexity) > -1);

        if (copy < quests.length) {
            let q = [];

            for (let i = 0; i < copy; i++) {
                q.push(quests.splice(Math.floor(Math.random() * quests.length - 1), 1)[0]);
            }

            quests = q;
        }

        setQuestionsCount(copy);
        setQuestions(quests);

        setActivePanel('testing')
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
        setActivePanel('finish');
    }

    if (activePanel === 'testing' && !timerActive) {
        finishTest();
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.timer}>
                    <Timer
                        duration={duration}
                        timerActive={timerActive}
                        setTimerActive={setTimerActive}
                    />
                </div>

                <div className='p-d-flex p-ai-center'>
                    <Button
                        icon='pi pi-cog'
                        className='p-button-text p-button-rounded p-button-secondary'
                    />
                    <Button
                        icon='pi pi-bell'
                        className='p-button-text p-button-rounded p-button-secondary p-ml-4'
                    />
                    <Avatar
                        className='p-ml-5'
                        src='/images/avatar.jpg'
                    />
                </div>
            </header>
            <div className='p-d-flex'>
                <aside className={styles.aside}>
                    <ul className={styles.aside__list}>
                        <li className={styles.aside__item}> <i className='pi pi-list' /> <span>Темы</span> </li>
                        <li className={`${styles.aside__item} ${styles.aside__item_active}`}> <i className='pi pi-check-square' /> <span>Тесты</span> </li>
                        <li className={styles.aside__item}> <i className='pi pi-chart-bar' /> <span>Результаты</span> </li>
                    </ul>
                </aside>
                <div className={styles.contentSide}>
                    <div className={`${styles.container} p-pl-1`}>
                        {
                            activePanel !== 'testing' &&
                            <h1 className='p-mt-0'>Программирование</h1>
                        }

                        <View activePanel={activePanel}>

                            <div id='sections'>
                                <h2 className={styles.h2}>Шаг 1. Выберите разделы для изучения</h2>
                                <div className={`p-d-flex p-ai-start`}>
                                    <div className={styles.leftSide}>
                                        <SectionsSettings
                                            sections={sections}
                                            selectSections={selectSections}
                                            selectedSections={selectedSections}
                                            questions={questions}
                                            onSectionsChange={onSectionsChange}
                                            handle={handle}
                                        />
                                    </div>

                                    <div className='p-ml-4'>
                                        <Button
                                            icon='pi pi-angle-right'
                                            label='Следующий шаг'
                                            className='p-d-block p-mt-2'
                                            onClick={() => setActivePanel('themes')}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div id='themes'>
                                <h2 className={styles.h2}>Шаг 2. Выберите темы в каждом разделе</h2>
                                <div className={`p-d-flex p-ai-start`}>
                                    <div className={styles.leftSide}>
                                        <ThemeSettings
                                            selectSections={selectSections}
                                            selectedSections={selectedSections}
                                            onSectionsChange={onSectionsChange}
                                        />
                                    </div>
                                    <div className='p-ml-4'>
                                        Суммарное количество вопросов<br /> в выбранных секциях: {questions.length}
                                        <Button
                                            icon='pi pi-angle-right'
                                            label='Следующий шаг'
                                            className='p-d-block p-mt-2'
                                            onClick={testSettings}
                                        />
                                        <Button
                                            icon='pi pi-angle-left'
                                            label='Назад'
                                            className='p-d-block p-mt-2 p-button-secondary'
                                            onClick={() => setActivePanel('sections')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div id='settings'>
                                <h2 className={styles.h2}>Шаг 3. Выберите количество вопросов и время</h2>
                                <div className='p-d-flex p-ai-start'>
                                    <div className={styles.leftSide}>
                                        <span><b>В данном разделе вам необходимо указать параметры для прохождения одного теста</b></span>
                                        <TestsSettings
                                            complexity={complexity}
                                            selectedComplexity={selectedComplexity}
                                            onChangeComplexity={onChangeComplexity}
                                            questions={questions}
                                            questionsCount={questionsCount}
                                            onChangeQuestionsCount={onChangeQuestionsCount}
                                            duration={duration}
                                            setDuration={setDuration}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            icon='pi pi-angle-right'
                                            label='Начать прохождение теста'
                                            className='p-d-block'
                                            onClick={startTest}
                                        />
                                        <Button
                                            icon='pi pi-angle-left'
                                            label='Назад'
                                            className='p-button-secondary p-d-block p-mt-3'
                                            onClick={SectionSettings}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div id='testing'>
                                <Tests
                                    questions={questions}
                                    answers={answers}
                                    setAnswers={setAnswers}
                                ></Tests>
                                <div className='p-mt-3'>
                                    <Button
                                        icon='pi pi-check'
                                        label='Finish test'
                                        className='p-mt-3 p-mb-6' onClick={finishTest}
                                    />
                                </div>
                            </div>

                            <div id='finish'>
                                <Results
                                    scores={scores}
                                />
                            </div>

                        </View>
                    </div>
                </div>
            </div>
            <Toast ref={(el) => toast = el} position='bottom-right' />
        </>
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
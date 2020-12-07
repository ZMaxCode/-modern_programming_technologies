import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import styles from './style.module.scss';

const SectionsSettings = (props) => {
    return (
        <>
            <div>
                {
                    props.sections.map((el, i) => {
                        return (
                            <div key={i} className="p-field p-md-4 p-pl-0">
                                <span className="p-float-label">
                                    <MultiSelect
                                        id={`${i}`}
                                        value={props.selectSections[i]}
                                        onChange={(e) => {
                                            props.handle(i, e);
                                        }}
                                        options={el}
                                        optionLabel="section.name"
                                        className={styles.multi}
                                        filter
                                        disabled={i !== 0 && props.selectSections[i - 1].length === 0}
                                    />
                                    <label htmlFor="0">Course section</label>
                                </span>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                {
                    props.selectSections.map((sections, i) => {
                        return (
                            <div key={i}>
                                <h4>{sections[0]?.level_name}</h4>
                                {
                                    sections.map((section, i) => {
                                        if ('questions' in section)
                                            return (
                                                <div key={i}>
                                                    <Checkbox
                                                        inputId={`${i}`}
                                                        name="answer"
                                                        value={section}
                                                        onChange={props.onSectionsChange}
                                                        checked={props.selectedSections.some(el => el === section)}
                                                    />
                                                    <label htmlFor={i} style={{ marginLeft: '1vw' }}>{section.section.name}</label>
                                                </div>
                                            )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            {
                props.selectedSections.length !== 0 && <h3>Суммарное количество вопросов в выбранных сукциях: {props.questions.length}</h3>
            }
        </>
    )
}

export default SectionsSettings;
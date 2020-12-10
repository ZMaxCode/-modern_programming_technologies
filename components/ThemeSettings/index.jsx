import { Panel } from 'primereact/panel';
import { Checkbox } from 'primereact/checkbox';
import styles from './style.module.scss';

const ThemeSettings = (props) => {
    return (
        <div>
        {
            props.selectSections.map((sections, i) =>
                (sections.length !== 0 && sections.some(el => el.questions)) && (
                    <Panel 
                        header={sections[0]?.level_name} 
                        key={i}
                        className='p-mb-4'
                    >
                        {
                            sections.map((section, i) => {
                                if ('questions' in section)
                                    return (
                                        <div
                                            key={i}
                                            className={styles.section}
                                        >
                                            <div>
                                                <Checkbox
                                                    inputId={`${i}`}
                                                    name="answer"
                                                    value={section}
                                                    onChange={props.onSectionsChange}
                                                    checked={props.selectedSections.some(el => el === section)}
                                                    
                                                />
                                                <label htmlFor={i} style={{ marginLeft: '1vw' }}>{section.section.name}</label>
                                            </div>
                                            <span>{section.questions.length}</span>
                                        </div>
                                    )
                            })
                        }
                    </Panel>
                )
            )
        }
    </div>
    )
} 

export default ThemeSettings;
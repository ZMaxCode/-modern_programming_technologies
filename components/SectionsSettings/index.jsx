import { ListBox } from 'primereact/listbox';
import { Checkbox } from 'primereact/checkbox';
import { Panel } from 'primereact/panel';
import styles from './style.module.scss';

const SectionsSettings = (props) => {

    console.log(props.sections)

    return (
        <>
            <div>
                {
                    props.sections.map((el, i) =>
                        !(i !== 0 && props.selectSections[i - 1].length === 0) &&
                        (
                            <div key={i} className="p-field p-md-4 p-pl-0">
                                <span className="p-float-label">
                                    <ListBox
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
                                        multiple
                                    />
                                </span>
                            </div>
                        )
                    )
                }
            </div>

            {/* <div>
                {
                    props.selectSections.map((sections, i) =>
                        (sections.length !== 0 && sections.some(el => el.questions)) && (
                            <Panel header={sections[0]?.level_name} key={i}>
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
            </div> */}
        </>
    )
}

export default SectionsSettings;
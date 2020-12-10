import TimerWrapper from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import styles from './style.module.scss';
import { useState } from 'react';

const Timer = (props) => {
    const [time, setTime] = useState();
    const [duration, setDuration] = useState(props.duration);

    function onTimerUpdate({ time, duration }) {
        setTime(time);
        setDuration(duration);

        if (time > duration) {
            props.setTimerActive(false);
        }
    }

    return (
        <>
            {
                props.timerActive && 
                <h1 className={styles.timer}>
                    <TimerWrapper active={props.timerActive} duration={duration} onTimeUpdate={onTimerUpdate} />
                    <Timecode time={duration - time} />
                </h1>
            }

        </>
    )
}

export default Timer;
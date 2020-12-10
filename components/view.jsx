import React from 'react';

const View = ({children, activePanel}) => {
    
    const findedView = children.find(el => el.props.id === activePanel);

    return (
        <>
            {findedView}
        </>
    )
}

export default View;
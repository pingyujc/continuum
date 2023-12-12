import icon from '../assets/logo.svg';
import React from 'react'

const LogoIcon = () => {
    const styles = {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
    };

    return (
        <div >
            <img src={icon} />
        </div>
    )
}

export default LogoIcon
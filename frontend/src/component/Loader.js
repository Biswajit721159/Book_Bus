import React from "react";
import { PulseLoader } from 'react-spinners';
const Loader = () => {
    return (
        <div className='loader-container' size='20px'><PulseLoader size={'12px'} color="#36d7b7" /></div>
    )
}

export default Loader
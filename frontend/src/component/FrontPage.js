import React from 'react';
import Homepage1 from '../Homepage/Homepage1';
import Homepage2 from '../Homepage/Homepage2';
import Homepage3 from '../Homepage/Homepage3';


export default function FrontPage() {
    return (
        <div className='container-fluid mt-3'>
            <Homepage1 />
            <Homepage2 />
            <Homepage3 />
        </div>
    )
}
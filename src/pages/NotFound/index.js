import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../../assets/images/user.png';

export default function NotFound(){
    return (
        <div>
        <img src={PageNotFound} style={{width: 400, height: 400, display: 'block', margin: 'auto', position: 'relative' }} />
        <center>Not Found</center>
        </div>
    
    )
}
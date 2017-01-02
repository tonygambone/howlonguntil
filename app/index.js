
import React from 'react';
import { render } from 'react-dom';
import { App } from './components/app';
import './app.css';

render(
    <App title="How Long Until?" />,
    document.getElementById('app')
);
import React from 'react';
import ReactDOM from 'react-dom/client';

import './assets/fonts/fonts.css';
import './index.css';

function App()
{
    return (
        <h1>HELLO WORLD !</h1>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
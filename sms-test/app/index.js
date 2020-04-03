import React from 'react';
import ReactDOM from 'react-dom';

function Button({ text, handleClick }) {
    return(
        <button onClick={handleClick}>
            {text}
        </button>
    );
}

ReactDOM.render(<Button text="PRESS" handleClick={() => { alert('test'); }} />, document.getElementById('app'));


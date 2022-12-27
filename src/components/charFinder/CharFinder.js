import React, { useState } from 'react';
import useMarvelService from '../../services/MarvelService';
import './charFinder.scss';

function CharFinder() {

  const [name, setName] = useState('');
  const {getCharacterByName} = useMarvelService();
  const [toggleName, setToggleName] = useState(false);
  
  

  const getCharName = (e) => {
    e.preventDefault();
    const name = 'thor';
    getCharacterByName(name)
      .then(viewChar)
  }

  const viewChar = (data) => {
      setName(data);
      setToggleName(!toggleName);
}


  return (
    <form className="charfinder">
        <p>Or find a character by name:</p>
        <div className="charfinder__content">
            <input type="text" placeholder="Enter name" />
            <button onClick={getCharName} className="button button__main">
                <div className="inner">Find</div>
            </button>
        </div>
        <a className={toggleName ? 'charfinder__toggle show' : 'charfinder__toggle hide'}>There is! Visit {name.name} page?</a>
    </form>
  )
}

export default CharFinder
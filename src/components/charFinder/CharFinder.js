import React from 'react';
import useMarvelService from '../../services/MarvelService';
import './charFinder.scss';

function CharFinder() {

    const {getCharacterByName} = useMarvelService();
    
  return (
    <form className="charfinder">
        <p>Or find a character by name:</p>
        <div className="charfinder__content">
            <input type="text" placeholder="Enter name" />
            <button type="submit" className="button button__main">
                <div className="inner">Find</div>
            </button>
        </div>
    </form>
  )
}

export default CharFinder
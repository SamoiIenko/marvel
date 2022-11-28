import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(220);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);


    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }
        
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();

    }

    function renderItems(arr) {

        const items = arr.map((elem, i) => {
            const fitDepencies = elem.thumbnail.indexOf('image_not_available') !== -1 ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <li className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={elem.id}
                    onClick={() => {
                        props.onCharSelected(elem.id);
                        focusOnItem(i);
                    }}>

                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(elem.id);
                            focusOnItem(i);
                        }
                    }}
                    <img src={elem.thumbnail} style={fitDepencies} alt={elem.name} />
                    <div className="char__name">{elem.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
        
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null; 

    return (

        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
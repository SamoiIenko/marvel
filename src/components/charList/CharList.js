import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './charList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />;
            break;
        case 'confirmed':
            return <Component />;
            break;
        case 'error':
            return <ErrorMessage />;
            break;
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(220);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }
        
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
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
                <CSSTransition key={elem.id} timeout={500} className="char__item">
                    <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
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
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
        
    }
    
    return (

        <div className="char__list">
            {setContent(process, () => renderItems(charList), newItemLoading)}
            <button 
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
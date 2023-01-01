import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './comicsList.scss';

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

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComicses, process, setProcess} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComicses(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended)
    }

    function renderItems(arr) {
        const items = arr.map((elem, i) => {
            return (
                <li className="comics__item"
                    key={i} >
                    <Link to={`/comics/${elem.id}`}>
                        <img src={elem.thumbnail} alt={elem.title} className="comics__item-img"/>
                        <div className="comics__item-name">{elem.title}</div>
                        <div className="comics__item-price">{elem.price}$</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 220,
        charEnded: false
    }
    activeCharCard = React.createRef();

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({offset, charList}) => ({
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            }))
    }

    onError = () => {
        this.setState({
             loading: false,
             error: true
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();

    }

    renderItems(arr) {

        const items = arr.map((elem, i) => {
            const fitDepencies = elem.thumbnail.indexOf('image_not_available') !== -1 ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <li className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={elem.id}
                    onClick={() => {
                        this.props.onCharSelected(elem.id);
                        this.focusOnItem(i);
                    }}>

                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(elem.id);
                            this.focusOnItem(i);
                        }
                    }}
                    <img src={elem.thumbnail} style={fitDepencies} alt={elem.name} onClick={this.onActiveCard} />
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state; 
        const items = this.renderItems(charList);

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
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
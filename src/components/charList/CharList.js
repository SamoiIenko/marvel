import { Component } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
             loading: false
        })
    }

    onError = () => {
        this.setState({
             loading: false,
             error: true
        })
    }

    updateCharList = () => {
         this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    renderItems(arr) {

        const items = arr.map((elem) => {
            const fitDepencies = elem.thumbnail.indexOf('image_not_available') !== -1 ? {objectFit: 'unset'} : {objectFit: 'cover'};
            return(
                <li className="char__item" key={elem.id}>
                    <img src={elem.thumbnail} style={fitDepencies} alt={elem.name}/>
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
        const {charList, loading, error} = this.state; 
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null; 

        return (

            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;
import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
    const {request, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=81c26c0fcf29848128f9d36d2068c8d5';
    const _baseOffset = 220;



    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter)
    }

    const getAllComicses = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }



    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description || 'There is no description',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    } 

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            price: comics.prices.price ? `${comics.prices.price}$` : 'not available',
            language: comics.textObjects.language || 'en-us'
        }
    }

    return { 
        clearError, 
        process,
        setProcess,
        getAllCharacters, 
        getAllComicses, 
        getCharacter, 
        getCharacterByName, 
        getComics}
}

export default useMarvelService;
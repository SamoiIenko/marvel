class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=81c26c0fcf29848128f9d36d2068c8d5';

    getRecource = async (url) => {
        let res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = () => {
        return this.getRecource(`${this._apiBase}characters?limit=9&offset=220&${this._apiKey}`);
    }

    getCharacter = (id) => {
        return this.getRecource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    }
}

export default MarvelService;
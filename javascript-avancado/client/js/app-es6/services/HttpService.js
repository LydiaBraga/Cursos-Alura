export class HttpService {

    get(url) {
        return fetch(url)
            .then((response) => this._handleErrors(response))
            .then((response) => response.json());
    }

    post(url, dado) {
        return fetch(url, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "post",
                body: JSON.stringify(dado)
            })
            .then((response) => this._handleErrors(response))
            .then((response) => response.json());
    }

    _handleErrors(response) {
        if (response.ok) {
            return response;
        }

        throw new Error(response.statusText);
    }

}
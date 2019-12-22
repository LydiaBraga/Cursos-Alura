import {Negociacao} from "../models/Negociacao";

export class NegociacaoDao {

    constructor(connection) {
        this._connection = connection;
        this._store = "negociacoes";
    }

    adiciona(negociacao) {
        return new Promise((resolve, reject) => {
            let requestStore = this._connection.transaction([this._store], "readwrite")
                .objectStore(this._store)
                .add(negociacao);

            requestStore.onsuccess = (event) => {
                resolve();
            };

            requestStore.onerror = (event) => {
                console.log(event.target.error);
                reject("Não foi possível incluir a negociação.");
            };
        });
    }

    listaTodos() {
        return new Promise((resolve, reject) => {
            let cursor = this._connection.transaction([this._store], "readwrite")
                .objectStore(this._store)
                .openCursor();
            let negociacoes = [];

            cursor.onsuccess = (event) => {
                let atual = event.target.result;

                if (atual) {
                    let dado = atual.value;
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    atual.continue();
                } else {
                    resolve(negociacoes);
                }
            };

            cursor.onerror = (event) => {
                console.log(event.target.error);
                reject("Não foi possível listar as negociações!");
            };
        });
    }

    apagaTodos() {
        return new Promise((resolve, reject) => {
            let requestStore = this._connection.transaction([this._store], "readwrite")
                .objectStore(this._store)
                .clear();

            requestStore.onsuccess = (event) => {
                resolve("Negociações removidas com sucesso!");
            };

            requestStore.onerror = (event) => {
                console.log(event.target.error);
                reject("Não foi possível remover as negociação.");
            };
        });
    }
}
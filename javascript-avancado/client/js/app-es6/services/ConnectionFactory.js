const stores = ["negociacoes"];
const version = 2;
const dbName = "aluraframe";

let connection = null;
let close = null;

export class ConnectionFactory {

    constructor() {
        throw new Error("Não é possível criar instâncias de ConnectionFactory!");
    }

    static getConnection() {
        return new Promise((resolve, reject) => {
            var openRequest = window.indexedDB.open(dbName, version);

            openRequest.onupgradeneeded = (event) => {
                ConnectionFactory._createStores(event.target.result);
            };
    
            openRequest.onsuccess = (event) => {
                if (!connection) {
                    connection = event.target.result;
                    close = connection.close.bind(connection);
                    connection.close = function() {
                        throw new Error("Você não pode fechar uma conexão diretamente!");
                    }
                }

                resolve(connection);
            };
    
            openRequest.onerror = (event) => {
                console.log(event.target.error);
                reject(event.target.error.name);
            };
        });
    }

    static closeConnection() {
        if (connection) {
            close();
            close = null;
            connection = null;
        }
    };

    static _createStores(connection) {
        stores.forEach((store) => {
            if (connection.objectStoreNames.contains(store)) {
                connection.deleteObjectStore(store);
            }
            connection.createObjectStore(store, {autoIncrement: true});
        });
    }
}
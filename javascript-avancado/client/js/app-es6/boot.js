import {currentInstance} from "./controllers/NegociacaoController";
import {} from "./polyfill/fetch";

let negociacaoController = currentInstance();

document.querySelector('#incluirButton').onclick = negociacaoController.adiciona.bind(negociacaoController);
document.querySelector('#apagarButton').onclick = negociacaoController.apaga.bind(negociacaoController);
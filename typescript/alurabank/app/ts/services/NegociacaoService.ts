import { Negociacao, NegociacaoParcial } from "../models/index";

export class NegociacaoService {

    obterNegociacoes(handler: Function): Promise<Negociacao[]> {
        return fetch('http://localhost:8080/dados')
            .then(response => handler(response))
            .then(response => response.json())
            .then((dados: NegociacaoParcial[]) => dados
                .map(dado => new Negociacao(new Date(), dado.vezes, parseFloat((dado.montante / dado.vezes).toFixed(2))))
            )
            .catch(err => {
                console.log(err.message)
                throw new Error("Não foi possível importar as negociações!")
            });
    }
}

export interface ResponseHandler {
    (res: Response): Response
}
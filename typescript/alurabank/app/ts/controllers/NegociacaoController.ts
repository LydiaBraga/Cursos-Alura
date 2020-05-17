import { Negociacoes, Negociacao, NegociacaoParcial } from "../models/index";
import { NegociacoesView, MensagemView } from "../views/index";
import { domInject, throttle } from "../helpers/decorators/index";
import { NegociacaoService, ResponseHandler } from "../services/index";

import { imprime } from '../helpers/index';

export class NegociacaoController {
    
    @domInject('#data')
    private _inputData: JQuery;
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView: NegociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView: MensagemView = new MensagemView('#mensagemView');

    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona(event: Event) {
        event.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente negociações em dias úteis, por favor!');
            return 
        }

        const negociacao = new Negociacao(
            data, 
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso');

        imprime(negociacao);
    }

    @throttle()
    async importarDados() {
        try {
            function isOK(response: Response) {
                if (!response.ok) 
                    throw new Error(response.statusText);
                return response;
            }

            const negociacoesParaImportar = await this._service.obterNegociacoes(isOK);
            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);
        } catch(err) {
            this._mensagemView.update(err.message)
        }
    }

    private _ehDiaUtil(data: Date) {
        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}
import {HttpService} from "./HttpService";
import {ConnectionFactory} from "./ConnectionFactory";
import {NegociacaoDao} from "../dao/NegociacaoDao";
import {Negociacao} from "../models/Negociacao";

export class NegociacaoService {

    constructor() {
        this._httpService = new HttpService();
    }

    cadastra(negociacao) {
        return ConnectionFactory.getConnection()
            .then((connection) => new NegociacaoDao(connection))
            .then((dao) => dao.adiciona(negociacao))
            .then(() => "Negociação adicionada com sucesso")
            .catch((erro) => {
                throw new Error("Não foi possível adicionar a negociação.")
            });
    }

    listaTodos() {
        return ConnectionFactory.getConnection()
            .then((connection) => new NegociacaoDao(connection))
            .then((dao) => dao.listaTodos())
            .catch((erro) => {
                throw new Error("Não foi possível listar todas as negociações.")
            })
    }

    apaga() {
        return ConnectionFactory.getConnection()
            .then((connection) => new NegociacaoDao(connection))
            .then((dao) => dao.apagaTodos())
            .catch((erro) => {
                throw new Error("Não foi possível apagar as negociações.")
            });
    }

    importa(listaAtual) {
        return this._obterNegociacoes()
            .then((negociacoes) => negociacoes.filter((novo) => !listaAtual.some((atual) => atual.isEqual(novo))))
            .catch((erro) => {
                throw new Error("Não foi possível importar as negociações.")
            });  
    }

    _obterNegociacoes() {
        return Promise.all([
            this._obterNegociacoesdaSemana(),
            this._obterNegociacoesdaSemanaAnterior(),
            this._obterNegociacoesdaSemanaRetrasada()
        ]).then(periodos => {
            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    _obterNegociacoesdaSemana() {
        return this._httpService.get("negociacoes/semana")
            .then((response) => {
                return response.map((item) => new Negociacao(new Date(item.data), item.quantidade, item.valor));
            })
            .catch((erro) => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociações semana.");
            });
    }

    _obterNegociacoesdaSemanaAnterior() {
        return this._httpService.get("negociacoes/anterior")
            .then((response) => {
                return response.map((item) => new Negociacao(new Date(item.data), item.quantidade, item.valor));
            })
            .catch((erro) => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociações semana anterior.");
            });
    }

    _obterNegociacoesdaSemanaRetrasada() {
        return this._httpService.get("negociacoes/retrasada")
            .then((response) => {
                return response.map((item) => new Negociacao(new Date(item.data), item.quantidade, item.valor));
            })
            .catch((erro) => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociações semana retrasada.");
            });
    }
}
"use strict";

System.register(["./HttpService", "./ConnectionFactory", "../dao/NegociacaoDao", "../models/Negociacao"], function (_export, _context) {
    "use strict";

    var HttpService, ConnectionFactory, NegociacaoDao, Negociacao, _createClass, NegociacaoService;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_HttpService) {
            HttpService = _HttpService.HttpService;
        }, function (_ConnectionFactory) {
            ConnectionFactory = _ConnectionFactory.ConnectionFactory;
        }, function (_daoNegociacaoDao) {
            NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export("NegociacaoService", NegociacaoService = function () {
                function NegociacaoService() {
                    _classCallCheck(this, NegociacaoService);

                    this._httpService = new HttpService();
                }

                _createClass(NegociacaoService, [{
                    key: "cadastra",
                    value: function cadastra(negociacao) {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.adiciona(negociacao);
                        }).then(function () {
                            return "Negociação adicionada com sucesso";
                        }).catch(function (erro) {
                            throw new Error("Não foi possível adicionar a negociação.");
                        });
                    }
                }, {
                    key: "listaTodos",
                    value: function listaTodos() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.listaTodos();
                        }).catch(function (erro) {
                            throw new Error("Não foi possível listar todas as negociações.");
                        });
                    }
                }, {
                    key: "apaga",
                    value: function apaga() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDao(connection);
                        }).then(function (dao) {
                            return dao.apagaTodos();
                        }).catch(function (erro) {
                            throw new Error("Não foi possível apagar as negociações.");
                        });
                    }
                }, {
                    key: "importa",
                    value: function importa(listaAtual) {
                        return this._obterNegociacoes().then(function (negociacoes) {
                            return negociacoes.filter(function (novo) {
                                return !listaAtual.some(function (atual) {
                                    return atual.isEqual(novo);
                                });
                            });
                        }).catch(function (erro) {
                            throw new Error("Não foi possível importar as negociações.");
                        });
                    }
                }, {
                    key: "_obterNegociacoes",
                    value: function _obterNegociacoes() {
                        return Promise.all([this._obterNegociacoesdaSemana(), this._obterNegociacoesdaSemanaAnterior(), this._obterNegociacoesdaSemanaRetrasada()]).then(function (periodos) {
                            var negociacoes = periodos.reduce(function (dados, periodo) {
                                return dados.concat(periodo);
                            }, []).map(function (dado) {
                                return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                            });

                            return negociacoes;
                        }).catch(function (erro) {
                            throw new Error(erro);
                        });
                    }
                }, {
                    key: "_obterNegociacoesdaSemana",
                    value: function _obterNegociacoesdaSemana() {
                        return this._httpService.get("negociacoes/semana").then(function (response) {
                            return response.map(function (item) {
                                return new Negociacao(new Date(item.data), item.quantidade, item.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error("Não foi possível obter as negociações semana.");
                        });
                    }
                }, {
                    key: "_obterNegociacoesdaSemanaAnterior",
                    value: function _obterNegociacoesdaSemanaAnterior() {
                        return this._httpService.get("negociacoes/anterior").then(function (response) {
                            return response.map(function (item) {
                                return new Negociacao(new Date(item.data), item.quantidade, item.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error("Não foi possível obter as negociações semana anterior.");
                        });
                    }
                }, {
                    key: "_obterNegociacoesdaSemanaRetrasada",
                    value: function _obterNegociacoesdaSemanaRetrasada() {
                        return this._httpService.get("negociacoes/retrasada").then(function (response) {
                            return response.map(function (item) {
                                return new Negociacao(new Date(item.data), item.quantidade, item.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error("Não foi possível obter as negociações semana retrasada.");
                        });
                    }
                }]);

                return NegociacaoService;
            }());

            _export("NegociacaoService", NegociacaoService);
        }
    };
});
//# sourceMappingURL=NegociacaoService.js.map
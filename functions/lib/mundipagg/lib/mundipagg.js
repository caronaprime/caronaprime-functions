/*
    MundiPagg - Classe principal do MundiPagg
*/

const request = require('request')
const post = require('util').promisify(request.post)
const del = require('util').promisify(request.delete)
const get = require('util').promisify(request.get)

class MundiPagg {

    // Construtor
    constructor(apiKey) {
        this.apiKey = apiKey
        this.auth = {
            user: apiKey,
            password: '',
            sendImmediately: true
        }
    }

    // Inserir cliente
    async inserirCliente(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do cliente"
        }
        if (dados.id === undefined) {
            throw "Informe o ID do cliente"
        }
        if (dados.nome === undefined) {
            throw "Informe o nome do cliente"
        }
        if (dados.email === undefined) {
            throw "Informe o e-mail do cliente"
        }

        // Inserir no MundiPagg
        return await inserirCliente(this, dados)
    }

    // Cadastrar cartão
    async cadastrarCartao(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do cartão"
        }
        if (dados.customer_id === undefined) {
            throw "Informe o ID do cliente no MundiPagg"
        }
        if (dados.numero === undefined) {
            throw "Informe o número do cartão"
        }
        if (dados.nome === undefined) {
            throw "Informe o nome do cartão"
        }
        if (dados.mes === undefined) {
            throw "Informe o mês do vencimento do cartão"
        }
        if (dados.ano === undefined) {
            throw "Informe o ano do vencimento do cartão"
        }
        if (dados.cvv === undefined) {
            throw "Informe o CVV do cartão"
        }

        // Cadastrar cartão
        return await cadastrarCartao(this, dados)
    }

    // Listar cartões do cliente
    async listarCartoes(customer_id) {
        return await listarCartoes(this, customer_id)
    }

    // Faturar
    async faturar(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do faturamento"
        }
        if (dados.customer_id === undefined) {
            throw "Informe o ID do cliente no MundiPagg"
        }
        if (dados.valor === undefined) {
            throw "Informe o valor do faturamento"
        }
        if (dados.descricao === undefined) {
            throw "Informe a descrição do faturamento"
        }
        if (dados.card_id === undefined) {
            throw "Informe o ID do cartão para o faturamento"
        }

        // Faturar
        return await faturar(this, dados)
    }

    // Faturar completo
    async faturarCompleto(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do faturamento"
        }
        if (dados.cliente === undefined) {
            throw "Informe os dados do cliente"
        }
        if (dados.empresa === undefined) {
            throw "Informe os dados da empresa"
        }
        if (dados.venda === undefined) {
            throw "Informe os dados da venda"
        }
        if (dados.cartao === undefined) {
            throw "Informe os dados do cartão"
        }

        // Faturar
        return await faturarCompleto(this, dados)
    }

    // Assinar plano
    async assinarPlano(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do faturamento"
        }
        if (dados.plano === undefined) {
            throw "Informe os dados do plano"
        }
        if (dados.cliente === undefined) {
            throw "Informe os dados do cliente"
        }
        if (dados.cartao === undefined) {
            throw "Informe os dados do cartão"
        }

        // Assinar plano
        return await assinarPlano(this, dados)
    }

    // Assinar plano boleto
    async assinarPlanoBoleto(dados) {
        // Validar dados
        if (dados === undefined) {
            throw "Informe os dados do faturamento"
        }
        if (dados.plano === undefined) {
            throw "Informe os dados do plano"
        }
        if (dados.cliente === undefined) {
            throw "Informe os dados do cliente"
        }

        // Assinar plano boleto
        return await assinarPlanoBoleto(this, dados)
    }
    
    // Cancelar plano
    async cancelarPlano(dados) {
        if (dados === undefined) {
            throw "Informe o ID a assinatura"
        }
    
        // Cancelar plano
        return await cancelarPlano(this, dados)
    }

}

// Inserir cliente
async function inserirCliente(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: "https://api.mundipagg.com/core/v1/customers",
            auth: mp.auth,
            json: {
                name: dados.nome,
                email: dados.email,
                metadata: {
                    id: dados.id
                }
            }
        })

        return result.body.id
    } catch (e) {
        throw e
    }

}

// Cadastrar cartão
async function cadastrarCartao(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: `https://api.mundipagg.com/core/v1/customers/${dados.customer_id}/cards`,
            auth: mp.auth,
            json: {
                number: dados.numero,
                holder_name: dados.nome,
                exp_month: dados.mes,
                exp_year: dados.ano,
                cvv: dados.cvv
            }
        })

        return result.body.id
    } catch (e) {
        throw e
    }

}

// Listar cartões do cliente
async function listarCartoes(mp, customer_id) {
    try {
        // Cadastrar na MundiPagg
        const result = await get({
            uri: `https://api.mundipagg.com/core/v1/customers/${customer_id}/cards`,
            auth: mp.auth
        })

        return JSON.parse(result.body).data
    } catch (e) {
        throw e
    }

}

// Faturar
async function faturar(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: "https://api.mundipagg.com/core/v1/orders",
            auth: mp.auth,
            json: {
                customer_id: dados.customer_id,
                items: [
                    {
                        amount: dados.valor * 100,
                        description: dados.descricao,
                        quantity: 1
                    }
                ],
                payments: [
                    {
                        payment_method: "credit_card",
                        credit_card: {
                            card_id: dados.card_id
                        }
                    }
                ]
            }
        })

        return result.body
    } catch (e) {
        throw e
    }

}

// Faturar completo
async function faturarCompleto(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: "https://api.mundipagg.com/core/v1/orders",
            auth: mp.auth,
            json: {
                customer: {
                    name: dados.cliente.nome,
                    email: dados.cliente.email
                },
                items: [
                    {
                        amount: dados.venda.valor * 100,
                        description: dados.venda.descricao,
                        quantity: 1
                    }
                ],
                payments: [
                    {
                        payment_method: "credit_card",
                        credit_card: {
                            installments: 1,
                            statement_descriptor: dados.empresa.nome,
                            card: {
                                number: dados.cartao.numero,
                                holder_name: dados.cartao.nome,
                                exp_month: dados.cartao.mes,
                                exp_year: dados.cartao.ano,
                                cvv: dados.cartao.cvv
                            }
                        }
                    }
                ]
            }
        })

        return result.body
    } catch (e) {
        throw e
    }

}

// Assinar plano
async function assinarPlano(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: "https://api.mundipagg.com/core/v1/subscriptions",
            auth: mp.auth,
            json: {
                plan_id: dados.plano.id,
                payment_method: "credit_card",
                customer: {
                    name: dados.cliente.nome,
                    email: dados.cliente.email
                },
                card: {
                    number: dados.cartao.numero,
                    holder_name: dados.cartao.nome,
                    exp_month: dados.cartao.mes,
                    exp_year: dados.cartao.ano,
                    cvv: dados.cartao.cvv
                }
            }
        })

        return result.body
    } catch (e) {
        throw e
    }

}

// Assinar plano boleto
async function assinarPlanoBoleto(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await post({
            uri: "https://api.mundipagg.com/core/v1/subscriptions",
            auth: mp.auth,
            json: {
                plan_id: dados.plano.id,
                payment_method: "boleto",
                customer: {
                    name: dados.cliente.nome,
                    email: dados.cliente.email,
                    document: dados.cliente.documento,
                    type: "individual",
                    address: {
                        line_1: dados.cliente.endereco.linha_1,
                        zip_code: dados.cliente.endereco.cep,
                        city: dados.cliente.endereco.cidade,
                        state: dados.cliente.endereco.uf,
                        country: "BR"
                    }
                }
            }
        })

        // Ler retorno
        const retorno1 = result.body

        console.log("11111111111111111111111111111111111111111111111")
        console.log("11111111111111111111111111111111111111111111111")
        console.log("11111111111111111111111111111111111111111111111")
        console.log("11111111111111111111111111111111111111111111111")
        console.log("11111111111111111111111111111111111111111111111")
        console.log(result.body.id)
        console.log(result.body.status)

        if (result.body.status != "active") {
            return result.body
        }

        // Ler url do boleto
        const result2 = await get({
            uri: `https://api.mundipagg.com/core/v1/invoices?subscription_id=${result.body.id}`,
            auth: mp.auth
        })

        console.log("2222222222222222222222222222222222222222222222")
        console.log("2222222222222222222222222222222222222222222222")
        console.log("2222222222222222222222222222222222222222222222")
        console.log("2222222222222222222222222222222222222222222222")
        console.log("2222222222222222222222222222222222222222222222")
        console.log(JSON.stringify(JSON.parse(result2.body)))

        const invoice = JSON.parse(result2.body).data[0].charge.id;

        const result3 = await get({
            uri: `https://api.mundipagg.com/core/v1/charges/${invoice}`,
            auth: mp.auth
        })

        console.log("3333333333333333333333333333333333333333333")
        console.log("3333333333333333333333333333333333333333333")
        console.log("3333333333333333333333333333333333333333333")
        console.log("3333333333333333333333333333333333333333333")
        console.log("3333333333333333333333333333333333333333333")
        console.log(JSON.stringify(result3))

        const boleto = JSON.parse(result3.body).last_transaction.url

        result.body.boleto = boleto

        return result.body
    } catch (e) {
        throw e
    }

}

// Cancelar plano
async function cancelarPlano(mp, dados) {
    try {
        // Cadastrar na MundiPagg
        const result = await del({
            uri: "https://api.mundipagg.com/core/v1/subscriptions/" + dados,
            auth: mp.auth,
        })

        return result.body
    } catch (e) {
        throw e
    }

}

// Exportar classe
module.exports = MundiPagg


const MundiPagg = require('..')

async function test() {
    // Instanciar MundiPagg
    const mp = new MundiPagg('sk_test_769MDeEYHLF3DrVk')

    // Efetuar venda
    const result = await mp.faturarCompleto({
        "cliente": {
            "nome": "Thiago P. Martinez",
            "email": "thiago.pereira.ti@gmail.com"
        },
        "venda": {
            "descricao": "Cupom de almoço",
            "valor": 35.90
        },
        "empresa": {
            "nome": "Wantage"
        },
        "cartao": {
            "numero": "4000000000000028",
            "nome": "THIAGO P MARTINEZ",
            "mes": 12,
            "ano": 2019,
            "cvv": "123"
        }
    })

    console.log(result)
}

test()

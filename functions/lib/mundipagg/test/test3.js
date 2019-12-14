
const MundiPagg = require('..')

async function test() {
    // Instanciar MundiPagg
    const mp = new MundiPagg('sk_3qLaPMEi0hVPxr0K')

    // Efetuar venda
    const result = await mp.assinarPlanoBoleto({
        "plano": {
            "id": "plan_2mqLKRmu8VI3MEJ9"
        },
        "cliente": {
            "nome": "Thiago P. Martinez",
            "email": "thiago.pereira.ti@gmail.com",
            "documento": "04224177188",
            "endereco": {
                "linha_1": "Av. Carmindo de Campos",
                "cep": "78070100",
                "cidade": "Cuiabá",
                "uf": "MT"
            }
        }
    })

    console.log(result)
}

test()

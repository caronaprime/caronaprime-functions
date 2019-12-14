
const MundiPagg = require('..')

async function test() {
    // Instanciar MundiPagg
    const mp = new MundiPagg('sk_test_769MDeEYHLF3DrVk')

    // Inserir cliente
    const customer_id = await mp.inserirCliente({
        id: 1,
        nome: "Thiago Pereira Martinez",
        email: "thiago.pereira.ti@gmail.com"
    })
    console.log(customer_id)

    // Cadastrar cartão
    const card_id = await mp.cadastrarCartao({
        customer_id: customer_id,
        numero: '4000000000000010',
        nome: 'THIAGO P MARTINEZ',
        mes: 12,
        ano: 2019,
        cvv: '123'
    })
    console.log(card_id)

    // Listar cartões do cliente
    const cartoes = await mp.listarCartoes('cus_kNV5RgphOmHZLAdo')
    console.log(cartoes)

    // Inserir faturamento
    const faturamento = await mp.faturar({
        customer_id: customer_id,
        card_id: card_id,
        valor: 25.90,
        descricao: "Prato especial"
    })
    
    console.log(faturamento)

}

test()

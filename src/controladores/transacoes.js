import { format } from "date-fns";
import { bancodedados } from "../bancodedados.js";


export const depositar = async (req, res) =>{
  try {
    const {numero_conta, valor} = req.body
    if(!numero_conta){
      return res
        .status(404)
        .json({message: "Necessário informar o numero da conta"})
    }

    if(!valor){
      return res
        .status(404)
        .json({message: "Necessário informar um valor para deposito"})
    }

    if (valor <= 0){
      return res
        .status(404)
        .json({message: "O valor informado deve ser maior que zero"})
    }

    const conta = bancodedados.contas.find( n=> n.numero === Number(numero_conta))
      if(!conta){
        return res
          .status(404)
          .json({message: "Conta não encontrada"});
      }

      conta.saldo = conta.saldo + valor
      const date = new Date()
      const data = format(date, "dd-MM-yyyy, HH:mm:ss")

      const deposito = {
        data,
        numero_conta,
        valor
      }

      bancodedados.depositos.push(deposito)
      return res
        .status(200)
        .send(`O deposito de R$ ${valor} foi realizado com sucesso!`)


  } catch (error) {
    return res
      .send(500)
      .json("Ocorreu um erro:" , error.message)
  }
}
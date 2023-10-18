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
        .json({message: `O deposito de R$ ${valor} foi realizado com sucesso!`})


  } catch (error) {
    return res
      .send(500)
      .json("Ocorreu um erro:" , error.message)
  }
}

export const sacar = (req, res) => {
  try {
    const {numero_conta, valor, senha} = req.body
    if(!numero_conta){
      return res
        .status(404)
        .json({message:"É Necessário informar o número da conta"})
    }
    if(!valor){
      return res
      .status(404)
      .json({message:"É Necessário informar o valor de depósito"})
    }

    if(valor<=0){
      return res
        .status(404)
        .json({message:"O valor a ser depositado não pode ser 0 ou negativo"})
    }

    const conta = bancodedados.contas.find(c => c.numero === Number(numero_conta))
    if(!conta){
      return res
        .status(404)
        .json({message:"Conta nao encontrada"})
    }

    if(!senha){
      return res 
        .status(404)
        .json({message:"É necessário informar a senha desta conta"})
    }

    if(conta.usuario.senha !== senha){
      return res
      .status(404)
      .json({message:"Senha incorreta, digite novamente"})
    }

    if(conta.saldo < valor ){
      return res 
        .status(404)
        .json({message:"Saldo insuficiente para saque"})
    }

    conta.saldo = conta.saldo - valor
    const date = new Date()
    const data = format(date, "dd-MM-yyyy HH:mm:ss")

    const saque = {
      data,
      numero_conta,
      valor
    }
    
    bancodedados.saques.push(saque)
    return res
      .status(200)
      .json({message:`Saque de ${valor}realizado com sucesso.`})

  } catch (error) {
    return res
      .status(500)
      .json("Ocorreu um erro:", error.message)
  }
}

export const transferir = (req, res) => {
  try {
  
  const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body
  if(!numero_conta_origem){
    return res
      .status(404)
      .json({message:"É necessário informar o número da conta de origem"})
  }
  if(!numero_conta_destino){
    return res
      .status(404)
      .json({message: "É necessário informar o número da conta de destino"})
  }
  if(!valor){
    return res
      .status(404)
      .json({message:"É necessário informar o valor da transferencia"})
  }

  if(valor<=0){
    return res
      .status(401)
      .json({message: "O valor de transferencia deve ser maior que zero"})
  }

  if(!senha){
    return res
      .status(404)
      .json({message:"Você precisa informar a senha desta conta para realizar esta transferencia."})
  }

  const contaOrigem = bancodedados.contas.find(c => c.numero === Number(numero_conta_origem))
  if(!contaOrigem){
    return res
      .status(404)
      .json({message: "Numero de conta de origem nao encontrado!"})
  }

  const contaDestino = bancodedados.contas.find(c=> c.numero === Number(numero_conta_destino))
    if(!contaDestino){
      return res 
        .status(404)
        .json({message: "Número de conta de destino não encontrado."})
    }

    if(contaOrigem.usuario.senha !== senha){
      return res
        .status(401)
        .json({message: "A senha desta conta está incorreta."})
    }

    if(contaOrigem.saldo < valor){
      return res
        .status(401)
        .json({message:"Salso insuficiente para transferencia!"})
    }

    contaOrigem.saldo = contaOrigem.saldo - valor
    contaDestino.saldo = contaDestino.saldo + valor

    const date = new Date()
    const data = format(date, "dd:MM:yyy, HH:mm:ss")

    const transferencia ={
      data,
      numero_conta_origem,
      numero_conta_destino,
      valor
    }
   
    bancodedados.transferencias.push(transferencia)
    return res
      .status(200)
      .send("Transferencia enviada com sucesso")

    } catch (error) {
    return res
      .status(500)
      .json("Ocorreu um erro:", error.message)
  }
}

export const saldo=(req, res)=>{
  try {
  const {numero_conta, senha} = req.query

  if(!numero_conta){
    return res
      .status(404)
      .json({message: "É necessário informar o numero da conta"})
  }
  if(!senha){
    return res
      .status(404)
      .json({message: "É necessário informar a senha desta conta!"})
  }

  const conta = bancodedados.contas.find(c=>c.numero === Number(numero_conta))
  if(!conta){
    return res
      .status(404)
      .json({message:"Conta não encontrada"})
  }
  
  if(conta.usuario.senha !== senha){
    return res  
      .status(401)
      .json({message: "Senha incorreta"})
  }

  return res.status(200).json({saldo: conta.saldo})
  
  } catch (error) {
    return res
    .json("Ocorreu um erro:", error.message)    
  }
}

export const extrato = (req, res)=>{
  try {
  const {numero_conta, senha} = req.query
    if(!numero_conta){
      return res
        .status(404)
        .json({message:"Insira o numero da conta"})
    }
    if(!senha){
      return res
      .status(404)
      .json({message:"É necessário informar a senha desta conta"})
    }

    const conta = bancodedados.contas.find(c=>c.numero === Number(numero_conta))
    if(!conta){
      return res
        .status(404)
        .json({message:"Conta não encontrada"})
    }

  if(conta.usuario.senha !==senha){
    return res
      .status(401)
      .json({message:"Senha inválida"})
  }
  
  const depositos = bancodedados.depositos.filter(d=>d.numero_conta === +numero_conta)
  const saques = bancodedados.saques.filter(s=>s.numero_conta === +numero_conta)
  const transferenciasEnviadas = bancodedados.transferencias.filter(t=>t.numero_conta_origem === +numero_conta)
  const transferenciasRecebidas = bancodedados.transferencias.filter(t=>t.numero_conta_destino === +numero_conta)

  const extratoUsuario = {
    depositos,
    saques,
    transferenciasEnviadas,
    transferenciasRecebidas
  };
  return res
    .status(200)
    .json(extratoUsuario)
  
  } catch (error) {
    return res
    .status(500) 
    .json("Ocorreu um erro:", error.message)
  }
}
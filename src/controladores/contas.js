import { bancodedados } from "../bancodedados.js";
 

export const listarContas =(req, res)=>{
  try {
    const contas = bancodedados.contas
    return res.status(200).json(contas)
  } catch (error) {
    res.status(500).json("Ocorreu um erro",error.message);
  }
};

export const criarConta = async(req, res) =>{
  try {
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    const saldo = 0

    if(!nome){
      return res.status(404).json({message:"Nome não informado. Informe um nome"})
    }

    if(!cpf){
      return res.status(404).json({message:"CPF não informado. Informe um CPF"})
    }

    if(!data_nascimento){
      return res.status(404).json({message:"Data de nascimento não informado. Informe data de nascimento"})
    }

    if(!telefone){
      return res.status(404).json({message:"Telefone não informado. Informe um Telefone"})
    }

    if(!email){
      return res.status(404).json({message:"email não informado. Informe um email"})
    }

    if(!senha){
      return res.status(404).json({message:"Senha não informada. Informe sua senha"})
    }
    
    const verificarCpf = bancodedados.contas.find(c => c.usuario.cpf === cpf)
    if(verificarCpf){
      return res.status(409).json({message:"CPF ja cadastrado. Informe outro CPF"})
    }

    const verificarEmail = bancodedados.contas.find(e => e.usuario.email === email)
    if(verificarEmail){
      return res.status(409).json({message:"Email ja cadastrado. Informe outro Email"})
    }

    const conta = {
      numero: bancodedados.id++,
      saldo,
        usuario: {
          nome,
          cpf,
          data_nascimento,
          telefone,
          email,
          senha,
      }
  }

  bancodedados.contas.push(conta)
  return res.status(201).json({message: "Conta criada com sucesso", conta})
    
  } catch (error) {
    res.status(500).json("Ocorreu um erro!", error.message)
  }
}
  
export const atualizarUsuario=(req,res)=>{
    try { 
      const {numeroConta} = req.params
      const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
      
      const usuario = bancodedados.contas.find(usuario => usuario.numero === Number(numeroConta))
      if(!usuario){
        res.status(404).json({message:"Usuario não encontrado"})
      }

      if(!numeroConta){
        return res
          .status(400)
          .json({message:"É necessário informar o numero da conta"})
      }

      if(!nome){
        return res
          .status(400)
          .json("Nome não informado, Informar um nome")
      }
      if(!cpf){
        return res
          .status(400)
          .json("CPF não informado, Informar um CPF")
      }
      if(!data_nascimento){
        return res
          .status(400)
          .json("Data de nascimento não informado, Informar um Data de nascimento")
      }
      if(!telefone){
        return res
          .status(400)
          .json("Telefone não informado, Informar um Telefone")
      }
      if(!email){
        return res
          .status(400)
          .json("Email não informado, Informar um email")
      }
      if(!senha){
        return res
          .status(400)
          .json("Senha não informada, Informar um senha")
      }

      const verificarCpf = bancodedados.contas.find(c=>c.usuario.cpf === cpf)
      if(verificarCpf){
        res.status(404).json({message: "O CPF informado já existe cadastrado!"})
      }

      const verificarEmail = bancodedados.contas.find(e=>e.usuario.email === email)
      if(verificarEmail){
        return res
          .status(404)
          .json({message: "Este Email ja existe cadastrado, informe outro e-mail"})
      }

      usuario.usuario.nome = nome
      if(cpf){
        usuario.usuario.cpf = cpf
      }

      usuario.usuario.data_nascimento = data_nascimento
      usuario.usuario.telefone = telefone
      if(email){
        usuario.usuario.email = email
      }

      usuario.usuario.senha=senha;

      return res
        .status(200)
        .json({message: "Usuario atualizado com sucesso"})

    } catch (error) {
      res.status(500).json("Ocorreu um erro!", error.message)      
    }
  }

  export const excluirUsuario=(req, res)=>{
      try {
        const {numeroConta} = req.params

        if(!numeroConta){
          return res
            .status(404)
            .json({message: "O numero da conta precisa ser informado"})
        }

        const conta = bancodedados.contas.find(n => n.numero == Number(numeroConta))
        if(!conta){
          return res 
            .status(404)
            .json({message:"Conta Inexistente"})
        }

        if(conta.saldo !==0){
          return res
            .status(404)
            .json({message: "A conta precisa está zerada para ser deletada"})
        }

        const deletar = bancodedados.contas.filter(n => n.numero !== Number(numeroConta))
        bancodedados.contas = deletar
        
        return res  
          .status(200)
          .json({message: "Conta deletada com sucesso"})

      } catch (error) {
        return res
          .status(500)
          .json("Ocorreu um erro!", error.message)
      }
  }
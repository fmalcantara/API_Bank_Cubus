import { bancodedados } from "./bancodedados.js" 

export const validarSenha = (req, res, next) =>{
  const {senha_banco} = req.query

  if(!senha_banco){
    res.status(404).json({message: "Midware: Voce precisa de uma senha, favor informar a senha"})
  }

  if(senha_banco !== bancodedados.banco.senha){
    res.status(404).json({message: "Senha inválida"})
}
  next()
}

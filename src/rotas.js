import express from 'express'
import { atualizarUsuario, criarConta, excluirUsuario, listarContas } from './controladores/contas.js'
import { validarSenha } from './intermediario.js'
import { depositar, sacar, saldo, transferir } from './controladores/transacoes.js'

export const rotas = express()
//contas
rotas.use(validarSenha)
rotas.post('/contas', criarConta )
rotas.get('/contas', listarContas)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuario)
rotas.delete('/contas/:numeroConta', excluirUsuario)

//transacoes
rotas.post('/transacoes/depositar', depositar)
rotas.post('/transacoes/sacar', sacar)
rotas.post('/transacoes/transferir', transferir)
rotas.get('/contas/saldo', saldo)
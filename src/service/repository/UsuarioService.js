import { UsuarioDAO } from "../dao/UsuarioDAO";

export const UsuarioService = {
    async cadastrar(usuario) {
        const existente = await UsuarioDAO.getByEmail(usuario.email);
        if (existente) {
            throw new Error("Email já cadastrado");
        }       
        const novoUsuario = await UsuarioDAO.create(usuario);
        return novoUsuario;
    }
}
import Usuario from "../../model/Usuario";
import { getJSON, setJSON } from "../storage";

const USUARIO_KEY = "@dogs/usuario";

async function readAllRaw() {
  const arr = await getJSON(USUARIO_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

async function writeAllRaw(arr) {
  await setJSON(USUARIO_KEY, arr);
}

export const UsuarioDAO = {
  async list() {
    const raw = await readAllRaw();
    if (!Array.isArray(raw)) {
      console.warn("⚠️ Dados de usuário corrompidos, recriando lista vazia.");
      await writeAllRaw([]);
      return [];
    }
    return raw.map((u) => Usuario.fromRaw(u));
  },

  async create(usuario) {
    const raw = await readAllRaw();
    const id = Date.now();
    
    const novoUsuario = new Usuario(
      id,
      usuario.nome,
      usuario.email,
      usuario.senha, 
      usuario.admin ?? false,
      usuario.celular,
      usuario.endereco
    );

    novoUsuario.tipo = usuario.admin ? 'admin' : 'cliente';
    raw.push(novoUsuario.toJSON());
    await writeAllRaw(raw);
    
    console.log("✅ Usuário criado:", { 
      email: novoUsuario.email, 
      senha: novoUsuario.senha,
      id: novoUsuario.id 
    });
    
    return novoUsuario;
  },

  async getByEmail(email) {
    const raw = await readAllRaw();
    const u = raw.find(r => r.email === email);
    return u ? Usuario.fromRaw(u) : null;
  },

  async login(email, senha) {
    const raw = await readAllRaw();
    const lista = Array.isArray(raw) ? raw : [];
    
    console.log("📦 Usuários salvos:", lista.map(u => ({ 
      email: u.email, 
      senha: u.senha,
      nome: u.nome 
    })));
    
  
    const u = raw.find(
      (r) => r.email === email && r.senha === senha 
    );
    
    console.log("🔍 Buscando usuário:", { 
      emailProcurado: email, 
      senhaProcurada: senha,
      usuarioEncontrado: u ? {
        email: u.email,
        senha: u.senha,
        nome: u.nome
      } : null 
    });
    
    return u ? Usuario.fromRaw(u) : null;
  },

  async seedAdmin() {
    const raw = await readAllRaw();
    const jaTemAdmin = raw.some(u => u.admin === true);

    if (jaTemAdmin) return; 

    const admin = {
      nome: "admin",
      email: "admin",
      senha: "123",
      admin: true,
      celular: "000000000",
      endereco: "Admin HQ"
    };

    await this.create(admin); 
    console.log("✅ Admin padrão criado!", admin);
  }
}

export default class Usuario  {

    constructor(id=0,nome="",email="",senha="", admin= false,celular=0,endereco="") { 
        this.id = parseInt(id);
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.admin = admin
        this.celular = parseInt(celular);
        this.endereco = endereco;
        this.tipo = admin ? 'admin' : 'cliente';
    }
    setId(id){
        this.id = parseInt(id);
    }
    setNome(nome){
        this.nome = nome;
    }
    setEmail(email){
        this.email = email; 
    }
    setSenha(senha){
        this.senha = senha;
    }   
    setAdmin(admin){
        this.admin = admin;
    }
    setCelular(celular){
        this.celular = String(celular);
    }
    setEndereco(endereco){
        this.endereco = endereco;
    }

    toJSON(){
        const {id,nome,email,senha,admin,celular,endereco,tipo} = this;
        return {id,nome,email,senha,admin,celular,endereco,tipo};
    }
       
    static fromRaw(raw){
        const  u = new Usuario(
            raw.id,
            raw.nome,
            raw.email,
            raw.senha,
            raw.admin,
            raw.celular,
            raw.endereco
        );
        u.tipo = raw.tipo || (u.admin ? 'admin' : 'cliente');

        return u;
    }

};

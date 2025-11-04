import { useState, useCallback } from "react";
import { ProdutoDAO } from "../service/dao/ProdutoDAO.js";

export default function CadastroProdutoController() {
  const [state, setState] = useState({
    lista: [],
    loading: false,
    editing: null, 
    errors: {},
    snack: { visible: false, msg: "" }
  });

  const actions = {
    load: useCallback(async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        
        const produtos = await ProdutoDAO.seedIfEmpty();
        setState(prev => ({ ...prev, lista: produtos, loading: false }));
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          snack: { visible: true, msg: "Erro ao carregar produtos" } 
        }));
      }
    }, []),

    startCreate: useCallback(() => {
      setState(prev => ({ 
        ...prev, 
        editing: {
          id: null,
          nome: "",
          descricao: "",
          preco: "",
          quantidade: ""
        },
        errors: {}
      }));
    }, []),

    startEdit: useCallback((produto) => {
      setState(prev => ({ ...prev, editing: { ...produto }, errors: {} }));
    }, []),

    cancelEdit: useCallback(() => {
      setState(prev => ({ ...prev, editing: null, errors: {} }));
    }, []),

    save: useCallback(async (produto) => {
    
      const errors = {};
      if (!produto.nome?.trim()) errors.nome = "Nome é obrigatório";
      if (!produto.preco || Number(produto.preco) <= 0) errors.preco = "Preço deve ser maior que 0";

      if (Object.keys(errors).length > 0) {
        setState(prev => ({ ...prev, errors }));
        return;
      }

      setState(prev => ({ ...prev, loading: true }));
      try {
        let produtoSalvo;
        if (produto.id) {
          produtoSalvo = await ProdutoDAO.update(produto);
        } else {
          produtoSalvo = await ProdutoDAO.create(produto);
        }
        
        if (produtoSalvo) {
          await actions.load(); 
          setState(prev => ({ 
            ...prev, 
            editing: null, 
            snack: { visible: true, msg: "Produto salvo com sucesso!" } 
          }));
        }
      } catch (error) {
        console.error("❌ Erro ao salvar produto:", error);
        setState(prev => ({ 
          ...prev, 
          snack: { visible: true, msg: "Erro ao salvar produto: " + error.message } 
        }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    }, []),

    remove: useCallback(async (id) => {
      try {
        await ProdutoDAO.delete(id);
        await actions.load();
        setState(prev => ({ 
          ...prev, 
          snack: { visible: true, msg: "Produto excluído!" } 
        }));
      } catch (error) {
        console.error("❌ Erro ao excluir produto:", error);
        setState(prev => ({ 
          ...prev, 
          snack: { visible: true, msg: "Erro ao excluir produto" } 
        }));
      }
    }, []),

    setSnack: useCallback((snack) => {
      setState(prev => ({ ...prev, snack }));
    }, [])
  };

  return { state, actions };
}
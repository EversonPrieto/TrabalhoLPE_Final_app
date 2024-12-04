import React, { useState } from "react";
import axios from "axios";

const RedefinirSenha = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [etapa, setEtapa] = useState(1); 
  const [email, setEmail] = useState("");
  const [codigoRecuperacao, setCodigoRecuperacao] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => setCodigoRecuperacao(e.target.value);
  const handleNovaSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => setNovaSenha(e.target.value);
  const handleConfirmarNovaSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => setConfirmarNovaSenha(e.target.value);

  const resetModal = () => {
    setEtapa(1);
    setEmail("");
    setCodigoRecuperacao("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
    setMessage("");
    setMessageType("info");
    setLoading(false);
  };

  const validarSenha = (senha: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return regex.test(senha);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3004/clientes/recuperar-senha", {
        email,
      });

      setMessage(response.data.mensagem);
      setMessageType("success");
      setEtapa(2);
    } catch (error: any) {
      setMessage(error.response?.data?.erro || "Erro ao enviar o código.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCodigoENovaSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!codigoRecuperacao) {
      setMessage("Por favor, insira o código.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setMessage("As senhas não coincidem.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!validarSenha(novaSenha)) {
      setMessage("A senha deve ter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3004/clientes/alterar-senha", {
        email,
        codigoRecuperacao,
        novaSenha,
      });

      setMessage(response.data.mensagem || "Senha alterada com sucesso!");
      setMessageType("success");
      setEtapa(3); 
    } catch (error: any) {
      setMessage(error.response?.data?.erro || "Erro ao alterar a senha.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {etapa === 1 ? "Recuperar Senha" : etapa === 2 ? "Alterar Senha" : null}
          </h2>
        </div>

        {message && (
          <div className={`text-center mb-4 ${messageType === "error" ? "text-red-500" : messageType === "success" ? "text-green-500" : "text-orange-500"}`}>
            {message}
          </div>
        )}

        {etapa === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Código"}
              </button>
            </div>
          </form>
        )}

        {etapa === 2 && (
          <form onSubmit={handleSubmitCodigoENovaSenha}>
            <div className="mb-4">
              <label htmlFor="codigoRecuperacao" className="block text-sm font-medium text-gray-700">Código de Recuperação</label>
              <input
                type="text"
                id="codigoRecuperacao"
                value={codigoRecuperacao}
                onChange={handleCodigoChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
              <input
                type="password"
                id="novaSenha"
                value={novaSenha}
                onChange={handleNovaSenhaChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmarNovaSenha"
                value={confirmarNovaSenha}
                onChange={handleConfirmarNovaSenhaChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? "Alterando..." : "Alterar Senha"}
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 py-2 px-4"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenha;

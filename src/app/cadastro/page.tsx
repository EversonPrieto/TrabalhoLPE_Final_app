'use client';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type Inputs = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function Cadastro() {
  const { register, handleSubmit, watch } = useForm<Inputs>();
  const router = useRouter();

  async function cadastraCliente(data: Inputs) {
    if (data.senha !== data.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ nome: data.nome, email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("Erro ao cadastrar o cliente");
      }
    } catch (error) {
      console.error('Erro na requisição de cadastro:', error);
    }
  }

  return (
    <section className="bg-orange-100 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow-md sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Cadastre-se
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(cadastraCliente)}>
            <div>
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">
                Nome Completo:
              </label>
              <input
                type="text"
                id="nome"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Seu nome completo"
                required
                {...register("nome")}
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                E-mail:
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                required
                {...register("email")}
              />
            </div>
            <div>
              <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900">
                Senha:
              </label>
              <input
                type="password"
                id="senha"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
                {...register("senha")}
              />
            </div>
            <div>
              <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium text-gray-900">
                Confirmar Senha:
              </label>
              <input
                type="password"
                id="confirmarSenha"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
                {...register("confirmarSenha")}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cadastrar
            </button>
            <p className="text-sm font-light text-gray-500">
              Já tem uma conta? <a href="/login" className="font-medium text-primary-600 hover:underline">Faça login</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

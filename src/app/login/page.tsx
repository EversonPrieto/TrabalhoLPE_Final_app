'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useClienteStore } from '@/context/cliente';
import RedefinirSenha from './redefinirsenha';

type Inputs = {
  email: string;
  senha: string;
  manter: boolean;
};

export default function Login() {
  const { register, handleSubmit } = useForm<Inputs>();
  const { logaCliente } = useClienteStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function verificaLogin(data: Inputs) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (response.ok) {
        const dados = await response.json();
        logaCliente(dados);

        if (data.manter) {
          localStorage.setItem('client_key', dados.id);
        } else {
          localStorage.removeItem('client_key');
        }

        router.push('/');
      } else {
        alert('Erro... Login ou Senha incorretos');
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error);
    }
  }

  const abrirModalRedefinirSenha = () => setIsModalOpen(true);
  const fecharModalRedefinirSenha = () => setIsModalOpen(false);

  return (
    <section className="bg-orange-100">
      <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-20 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Informe seus Dados de Acesso
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(verificaLogin)}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  E-mail do Cliente:
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  {...register('email')}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                  Senha de Acesso:
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                  {...register('senha')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      {...register('manter')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500">
                      Manter Conectado
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={abrirModalRedefinirSenha}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Esqueceu sua senha?
                </button>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Entrar
              </button>
              <p className="text-sm font-light text-gray-500">
                Você não está cadastrado?{' '}
                <a href="/cadastro" className="font-medium text-primary-600 hover:underline">
                  Cadastre-se
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <RedefinirSenha isOpen={isModalOpen} onClose={fecharModalRedefinirSenha} />
    </section>
  );
}

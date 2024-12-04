"use client";
import Link from "next/link";
import { useClienteStore } from "@/context/cliente";
import { useRouter } from "next/navigation";

export function Header() {
  const { cliente, deslogaCliente } = useClienteStore();
  const router = useRouter();

  function sairCliente() {
    deslogaCliente();
    // remove de localStorage o id do cliente logado (se ele indicou salvar no login)
    if (localStorage.getItem("client_key")) {
      localStorage.removeItem("client_key");
    }
    router.push("/login");
  }

  return (
    <nav className="bg-orange-500 border-b border-orange-600 shadow-md">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img 
            src="./logo.png" 
            className="h-20 rounded-full hover:opacity-90 transition-opacity transform hover:scale-105 shadow-md" 
            alt="Lanchonete Senac" 
          />
          <span className="self-center text-3xl font-semibold whitespace-nowrap text-blue-900 hover:text-orange-200 transition-colors">
            Lanchonete Senac
          </span>
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {cliente.id ? (
            <>
              <span className="text-white font-medium hover:text-orange-200 transition-colors">
                {cliente.nome}
              </span>
              <Link href="/pedidos" className="font-bold text-blue-900 hover:text-orange-200 transition-colors">
                Meus pedidos
              </Link>
              <span
                className="cursor-pointer font-bold text-red-200 hover:text-red-100 transition-colors"
                onClick={sairCliente}
              >
                Sair
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="font-bold text-blue-900 hover:text-blue-100 transition-colors">
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


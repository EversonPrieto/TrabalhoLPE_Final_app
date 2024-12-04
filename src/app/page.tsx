'use client';
import { InputPesquisa } from "@/components/InputPesquisa";
import { ItemLanches } from "@/components/ItemLanches";
import { LancheI } from "@/utils/types/lanches";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner';
import { useClienteStore } from "@/context/cliente";

export default function Home() {
  const [lanches, setLanches] = useState<LancheI[]>([]);
  const { logaCliente } = useClienteStore();

  useEffect(() => {
    // Função para buscar dados do cliente
    async function buscaCliente(idCliente: string) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/clientes/${idCliente}`);
        if (response.ok) {
          const dados = await response.json();
          logaCliente(dados);
        } else {
          console.error('Erro ao buscar cliente:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição de cliente:', error);
      }
    }

    if (localStorage.getItem("client_key")) {
      const idClienteLocal = localStorage.getItem("client_key") as string;
      buscaCliente(idClienteLocal);
    }

    async function buscaDados() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/lanches`);
        if (response.ok) {
          const dados = await response.json();

          const lanchesOrdenados = dados.sort((a: LancheI, b: LancheI) => {
            if (a.destaque && !b.destaque) {
              return -1;
            }
            if (!a.destaque && b.destaque) {
              return 1; 
            }
            return 0; 
          });
          setLanches(lanchesOrdenados);
        } else {
          console.error('Erro ao buscar lanches:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição dos lanches:', error);
      }
    }

    buscaDados();
  }, []); 

  const listaLanches = lanches.map(lanche => (
    <ItemLanches data={lanche} key={lanche.id} />
  ));

  return (
    <main>
      <InputPesquisa setLanches={setLanches} />

      <section className="max-w-screen-xl mx-auto px-4">
        <h1 className="mb-5 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
          Menu de <span className="underline underline-offset-4 decoration-4 decoration-orange-400">Lanches</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listaLanches}
        </div>
      </section>
      <Toaster position="top-right" />
    </main>
  );
}

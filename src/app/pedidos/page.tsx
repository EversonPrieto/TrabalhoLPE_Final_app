'use client';
import './page.css';
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { PedidoI } from "@/utils/types/pedidos";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoI[]>([]);
  const { cliente } = useClienteStore();

  useEffect(() => {
    async function buscaDados() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos/${cliente.id}`);
        if (response.ok) {
          const dados = await response.json();
          setPedidos(dados);
        } else {
          console.error('Erro ao buscar pedidos:', response.status);
        }
      } catch (error) {
        console.error('Erro na requisição dos pedidos:', error);
      }
    }
    buscaDados();
  }, [cliente.id]);

  // Formata a data para o formato DD/MM/AAAA
  function dataDMA(data: string) {
    const ano = data.substring(0, 4);
    const mes = data.substring(5, 7);
    const dia = data.substring(8, 10);
    return `${dia}/${mes}/${ano}`;
  }

  const pedidosTable = pedidos.map(pedido => (
    <tr className="bg-white border-b">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
        {pedido.lanche.nome}
      </th>
      <td className="px-6 py-4">
        <img src={pedido.lanche.imagem} className="imagemLanche" alt={`Imagem do ${pedido.lanche.nome}`} />
      </td>
      <td className="px-6 py-4">
        <p><b>{pedido.descricao}</b></p>
        <p><i>Enviado em: {dataDMA(pedido.createdAt)}</i></p>
      </td>
      <td className="px-6 py-4">
        {pedido.entrega ? (
          <>
            <p><b>{pedido.entrega}</b></p>
            <p><i>Respondido em: {dataDMA(pedido.updatedAt as string)}</i></p>
          </>
        ) : (
          <i>Aguardando...</i>
        )}
      </td>
    </tr>
  ));

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
        Historico de <span className="underline underline-offset-3 decoration-8 decoration-orange-400">Pedidos</span>
      </h1>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Nome do Lanche</th>
            <th scope="col" className="px-6 py-3">Imagem</th>
            <th scope="col" className="px-6 py-3">Pedido</th>
            <th scope="col" className="px-6 py-3">Entrega</th>
          </tr>
        </thead>
        <tbody>
          {pedidosTable}
        </tbody>
      </table>
    </section>
  );
}

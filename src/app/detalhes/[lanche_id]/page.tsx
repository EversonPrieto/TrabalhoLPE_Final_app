'use client';
import { LancheI } from "@/utils/types/lanches";
import { ImagemI } from "@/utils/types/imagens";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useClienteStore } from "@/context/cliente";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';

type Inputs = {
  descricao: string;
};

export default function Detalhes() {
  const params = useParams();
  const { cliente } = useClienteStore();

  const [lanche, setLanche] = useState<LancheI>();
  const [imagens, setImagens] = useState<ImagemI[]>([]);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/lanches/${params.lanche_id}`);
      const dados = await response.json();
      setLanche(dados);
    }
    buscaDados();

    async function buscaImagens() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/imagens/${params.lanche_id}`);
      const dados = await response.json();
      setImagens(dados);
    }
    buscaImagens();
  }, []);

  const listaImagens = imagens.map(imagem => (
    <div key={imagem.id} className="p-2">
      <img
        className="h-auto max-w-full rounded-lg shadow-lg"
        src={`data:image/jpg;base64, ${imagem.codigoImagem}`}
        alt={imagem.descricao}
        title={imagem.descricao}
      />
    </div>
  ));

  async function enviaPedido(data: Inputs) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/pedidos`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          clienteId: cliente.id,
          lancheId: Number(params.lanche_id),  
          descricao: data.descricao
        })
      })
  
      if (response.status === 201) {
        toast.success("Obrigado. Seu pedido foi enviado. Aguarde a entrega.")
        reset()  
      } else {
        toast.error("Erro... Não foi possível fazer seu pedido")
      }
    } catch (error) {
      console.error("Erro ao fazer pedido:", error)
      toast.error("Erro inesperado. Por favor, tente novamente.")
    }
  }

  return (

    <div className="container mx-auto p-6">
      <h1 className="mb-5 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl">Detalhes do(a) <span className="underline underline-offset-4 decoration-4 decoration-orange-400">{lanche?.tipo.nome}</span>
      </h1>
      <section className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-lg mb-6">
        <img
          className="object-cover w-full rounded-t-lg h-80 md:h-auto md:w-1/3 md:rounded-l-lg"
          src={lanche?.imagem}
          alt="Imagem do Lanche"
        />
        <div className="flex flex-col justify-between p-6">
          <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-800">
            {lanche?.nome}
          </h5>
          <h5 className="mb-2 text-2xl text-gray-800">
            Preço: R$ {Number(lanche?.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          <p className="mb-4 text-gray-700">
            {lanche?.descricao}
          </p>

          {cliente.id ? (
            <>
              <h3 className="text-xl font-bold tracking-tight text-gray-800">Gostou deste Lanche? Faça um Pedido!</h3>
              <form onSubmit={handleSubmit(enviaPedido)}>
                <input
                  type="text"
                  className="mb-4 mt-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed"
                  value={`${cliente.nome} (${cliente.email})`}
                  disabled
                  readOnly
                />
                <textarea
                  id="message"
                  className="mb-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Descreva o seu pedido. Ex: Completo/Sem Queijo "
                  required
                  {...register("descricao")}
                ></textarea>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                >
                  Fazer Pedido
                </button>
              </form>
            </>
          ) : (
            <h3 className="text-xl font-bold tracking-tight text-orange-700"> Faça login para fazer seu pedido já!</h3>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {listaImagens}
      </div>
    </div>
  );
}

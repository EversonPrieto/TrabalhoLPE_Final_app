import { LancheI } from "@/utils/types/lanches";
import Link from "next/link";

export function ItemLanches({ data }: { data: LancheI }) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md">

      <Link href={`/detalhes/${data.id}`}>
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={data.imagem}
          alt={`Imagem do ${data.nome}`}
        />
      </Link>

      <div className="p-5">
        <h5 className="mb-2 text-xl font-semibold text-gray-900">
         {data.nome}
        </h5>
        <p className="mb-3 text-lg font-bold text-gray-700">
          R$ {Number(data.preco).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="mb-3 text-sm text-gray-600 truncate">
          {data.descricao}
        </p>
        <Link
          href={`/detalhes/${data.id}`}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
        >
          Ver Detalhes
          <svg
            className="w-4 h-4 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

import { LancheI } from "./lanches"

export interface PedidoI {
  id: number
  clienteId: string
  lancheId: number
  lanche: LancheI
  descricao: string
  entrega: string | null
  createdAt: string
  updatedAt: string | null
}
export interface TipoI {
  id: number;
  nome: string;
}

export interface LancheI {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
  destaque: boolean;
  createdAt: Date;
  updatedAt: Date;
  tipo: TipoI;
}

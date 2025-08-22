export type Node = {
  id: string;
  label: string;
  articles: number;
  community: number;
};

export type Link = {
  source: string;
  target: string;
  strength: number;
  type: 'intra' | 'inter';
};

export type GraphData = {
  nodes: Node[];
  links?: Link[];
};

export type Query = {
  start_date: string;
  end_date: string;
  theme?: string | string[];
  similarity_threshold?: number;
  max_topics?: number;
  use_gpu?: boolean;
  clustering_algorithm?: string;
  resolution?: number;
  n_clusters?: number;
  random_state?: number;
  max_iterations?: number;
};

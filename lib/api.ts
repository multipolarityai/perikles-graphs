import type { GraphData, Query } from './types';

// Type for the API response topic structure
type ApiTopic = {
  community_id: number;
  topic_label: string;
  theme: string;
  reference_date: string;
  topic_description: string;
  confidence_score: number;
};

export async function fetchGraphData(params: Query): Promise<GraphData> {
  const base = process.env.NEXT_PUBLIC_TOPICS_API_URL || 'https://multipolarityai--pericles-graphs-computation-topicsnetwo-3606e6.modal.run';
  const url = `${base}/classify_topics_communities`;

  const requestBody = {
    start_date: params.start_date,
    end_date: params.end_date,
    theme: params.theme,
    similarity_threshold: params.similarity_threshold ?? 0.3,
    max_topics: params.max_topics,
    use_gpu: params.use_gpu ?? true,
    clustering_algorithm: params.clustering_algorithm ?? 'leiden',
    resolution: params.resolution ?? 1.0,
    n_clusters: params.n_clusters,
    random_state: params.random_state ?? 42,
    max_iterations: params.max_iterations ?? 100,
  };

  console.log('Making request to:', url);
  console.log('Request body:', requestBody);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error Response:', errorText);
    throw new Error(`API error ${res.status}: ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  console.log('API Response:', data);
  console.log('Response type:', typeof data);
  console.log('Response keys:', Object.keys(data || {}));
  
  // Check if the API returned an error in the response body
  if (data.success === false) {
    throw new Error(data.error || 'API returned an error');
  }
  
  // Validate the response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format: expected object');
  }
  
  // Transform the API response to our expected GraphData format
  if (data.topic_communities) {
    const nodes = Object.entries(data.topic_communities).map(([id, topic]) => {
      const t = topic as ApiTopic;
      return {
        id: id,
        label: t.topic_label,
        articles: 1, // Default value since not provided by API
        community: t.community_id,
      };
    });
    
    console.log('Transformed nodes:', nodes.length);
    
    return { nodes, links: [] } as GraphData;
  }
  
  // Fallback: check if it already has the expected structure
  if (!data.nodes || !Array.isArray(data.nodes)) {
    console.error('Invalid response structure:', data);
    throw new Error('Invalid response format: missing topic_communities or nodes array');
  }
  
  // Links are optional, but if present should be an array
  if (data.links && !Array.isArray(data.links)) {
    console.error('Invalid links structure:', data.links);
    throw new Error('Invalid response format: links should be an array if present');
  }
  
  console.log('Validated response - nodes:', data.nodes.length, 'links:', data.links?.length || 'none');
  
  return data as GraphData;
}

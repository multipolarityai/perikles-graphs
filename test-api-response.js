// Test script to check the actual API response structure
const fetch = require('node-fetch');

async function testAPI() {
  const url = 'https://multipolarityai--pericles-graphs-computation-topicsnetwo-3606e6.modal.run/classify_topics_communities';
  
  // Calculate yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  const requestBody = {
    start_date: yesterdayString,
    end_date: yesterdayString,
    theme: 'Gold',
    similarity_threshold: 0.3,
    max_topics: 100,
    use_gpu: true,
    clustering_algorithm: 'leiden',
    resolution: 1.0,
    random_state: 42,
    max_iterations: 100,
  };

  console.log('Making request to:', url);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      return;
    }
    
    const data = await res.json();
    console.log('Response data type:', typeof data);
    console.log('Response keys:', Object.keys(data || {}));
    console.log('Full response:', JSON.stringify(data, null, 2));
    
    // Check specific properties
    if (data.nodes) {
      console.log('Nodes type:', typeof data.nodes);
      console.log('Nodes is array:', Array.isArray(data.nodes));
      console.log('Nodes length:', data.nodes?.length);
    }
    
    if (data.links) {
      console.log('Links type:', typeof data.links);
      console.log('Links is array:', Array.isArray(data.links));
      console.log('Links length:', data.links?.length);
    }
    
  } catch (error) {
    console.error('Request error:', error.message);
  }
}

testAPI();

// Simple test script to check API connectivity
const testAPI = async () => {
  const url = 'https://multipolarityai--pericles-graphs-computation-topicsnetwo-3606e6.modal.run/classify_topics_communities';
  
  const requestBody = {
    start_date: "2025-01-01",
    end_date: "2025-08-01",
    theme: "global-economy",
    similarity_threshold: 0.3,
    use_gpu: true,
    clustering_algorithm: "leiden",
    resolution: 1.0,
    random_state: 42,
    max_iterations: 100
  };

  console.log('Testing API endpoint:', url);
  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('Success! Response data:', data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

testAPI();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { url, email } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a GEO audit specialist. Analyze the digital presence of this website: ${url}. Return ONLY valid JSON, no markdown: {"overall_score":0-100,"score_label":"Low|Moderate|Good|Strong AI visibility","score_description":"2 sentences","eeat":{"experience":{"score":0-100,"note":"short"},"expertise":{"score":0-100,"note":"short"},"authoritativeness":{"score":0-100,"note":"short"},"trustworthiness":{"score":0-100,"note":"short"}},"findings":[{"type":"good|warn|bad","title":"title","desc":"desc"}],"recommended_package":"GEO Starter|GEO Growth|GEO Full","package_description":"why"}`
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}

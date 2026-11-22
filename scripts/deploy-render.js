import https from 'https';

const DEPLOY_HOOK = 'https://api.render.com/deploy/srv-dc1nccl6e07s73drb100?key=1AYG-GKdj5I';

https.get(DEPLOY_HOOK, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`🚀 Render Deploy disparado com sucesso! Status: ${res.statusCode}`);
    console.log(data);
  });
}).on('error', (err) => {
  console.error('Erro ao disparar deploy no Render:', err.message);
});

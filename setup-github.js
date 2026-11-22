import { execSync } from 'child_process';

const repoPath = 'C:\\Users\\Utilizador\\.gemini\\antigravity\\scratch\\loja-km-personalizados';

// 1. Get token from git credential manager
const creds = execSync('git credential fill', { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf-8' });
const tokenMatch = creds.match(/password=(.+)/);
if (!tokenMatch) {
  console.error('No token found in credential helper');
  process.exit(1);
}
const token = tokenMatch[1].trim();

async function run() {
  console.log('Checking or creating GitHub repo: loja-km-personalizados...');
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': 'token ' + token,
      'User-Agent': 'Antigravity',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'loja-km-personalizados',
      description: 'Loja Oficial e Ateliê Digital KM Personalizados - Bótons Ímãs Quadrados de Fotos',
      private: false
    })
  });

  const resData = await createRes.json();
  if (createRes.status === 201) {
    console.log('Created repository successfully:', resData.html_url);
  } else if (createRes.status === 422) {
    console.log('Repository status 422 (may already exist):', resData.message);
  } else {
    console.log('GitHub API response:', resData.message || resData);
  }

  // 2. Git commands
  console.log('Setting up local git and pushing...');
  const gitCmds = [
    'git init',
    'git config user.name "Marlon Grochoska"',
    'git config user.email "nx250tornado2@gmail.com"',
    'git branch -M main',
    'git add .',
    'git commit -m "feat: initial release of KM Personalizados site with 3D studio and A4 print engine"',
    'git remote add origin https://github.com/MFelipeG/loja-km-personalizados.git',
    'git push -u origin main --force'
  ];

  for (const cmd of gitCmds) {
    try {
      execSync(cmd, { cwd: repoPath, encoding: 'utf-8', stdio: 'pipe' });
      console.log('>', cmd, '-> OK');
    } catch (e) {
      if (cmd.includes('remote add')) {
        try {
          execSync('git remote set-url origin https://github.com/MFelipeG/loja-km-personalizados.git', { cwd: repoPath });
          console.log('> remote set-url -> OK');
        } catch {}
      } else {
        console.log('>', cmd, '-> Note:', (e.stdout || e.stderr || e.message).trim());
      }
    }
  }

  console.log('Push process finished!');
}

run();

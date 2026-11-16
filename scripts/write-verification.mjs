import {readFile,writeFile} from 'node:fs/promises';
const tests=JSON.parse(await readFile('qa/functional-report.json','utf8'));
const lines=[
 'untold — Verificação da versão editada em 16/11/2026','',
 `TESTES FUNCIONAIS: ${tests.passed?'PASS':'FAIL'}`,
 `${tests.checks.length} grupos de verificações; ${tests.pageErrors.length} erros JavaScript.`,
 ...tests.checks.map(check=>'- '+check),'',
 'ALTERAÇÕES',
 '- Escultura 3D estática, sem rotação automática, interação ou botões de pausa.',
 '- Laboratório substituído pela área de projetos, com mensagem de ausência de projetos e WhatsApp.',
 '- Títulos e descrições dos serviços alinhados às colunas superiores.',
 '- Páginas Estúdio, Projetos, Processo e Contato, com navegação compartilhada.',
 '- Identidade visual original preservada: cores, fontes, símbolo e componentes próprios.','',
 'REVISÃO VISUAL',
 'Capturas de desktop e celular em qa/. Páginas verificadas em larguras de 320, 390, 768, 1024 e 1440 px.',
 'A mensagem de contato foi interceptada em navegador isolado; nenhuma mensagem foi enviada.','',
 'COMANDOS',
 'npm run check', 'npm run build', 'npm test',
 'node scripts/write-verification.mjs','',
 'Prévia local: http://127.0.0.1:5173/. Nenhuma publicação remota foi executada.'
];
await writeFile('VERIFICACAO.txt',lines.join('\n')+'\n');
console.log('Relatório atualizado.');

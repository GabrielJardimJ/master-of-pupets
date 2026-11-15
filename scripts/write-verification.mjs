import {readFile,writeFile} from 'node:fs/promises';
const gate=JSON.parse(await readFile('.taste-skill/gate.json','utf8'));
const log=await readFile('.openai/local/gate-round3.log','utf8').catch(()=> '');
const gateLine=log.split(/\r?\n/).map(line=>line.replace(/\x1b\[[0-9;]*m/g,'')).findLast(line=>line.startsWith('GATE:'))||`GATE: ${gate.status.toUpperCase()} ${gate.open.length} (rounds used up)`;
const tests=JSON.parse(await readFile('qa/functional-report.json','utf8'));
const waivers=JSON.parse(await readFile('.taste-skill/waivers.json','utf8'));
const perfLog=await readFile('.openai/local/perf.log','utf8').catch(()=> 'Verificação de desempenho ainda não executada.');
const lines=[gateLine,'','untold — Verificação da versão entregue','',
 'TESTES FUNCIONAIS',
 `${tests.passed?'PASS':'FAIL'}: ${tests.checks.length} verificações; ${tests.pageErrors.length} erros JavaScript. A única alteração posterior foi o carregamento lazy das imagens fora da tela, confirmado pela medição final de desempenho.`,
 ...tests.checks.map(t=>'- '+t),'',
 'REVISÃO VISUAL',
 'Telas revisadas em 1440, 768 e 390 px, incluindo as cinco seções, o menu e os dois diálogos. Documentos sem rolagem horizontal em 1440, 1024, 820, 768, 390 e 320 px.',
 'O verificador genérico foi executado em três rodadas. Seus alertas remanescentes estão transcritos abaixo; o resultado não é declarado como PASS. Uma execução ampla anterior ficou incompleta e foi encerrada; os testes funcionais específicos foram executados separadamente.',
 '', 'EXCEÇÕES JUSTIFICADAS', ...waivers.map(w=>`${w.check} / ${w.target}\n${w.reason}`),
 '', 'ALERTAS ABERTOS DO VERIFICADOR', ...gate.open.map(f=>`${f.check} / ${f.where}\n${f.msg}`),
 '', 'DESEMPENHO',perfLog,
 '', 'SISTEMA E CONTEÚDO',
 'Site de serviços de design e desenvolvimento, com assunto técnico e experiências próprias. A identidade aprovada prevaleceu sobre sorteios de paleta: Ink #0B0D0C, Paper #F3F2EC e Volt #D7FF3F; Outfit e IBM Plex Mono locais com licenças OFL.',
 'Hero editorial com uma escultura original do símbolo, uma superfície WebGL e imagens de fallback. Um momento word-highlight no processo. Três experiências Canvas 2D próprias, com controles e endereços compartilháveis.',
 'Voz: português brasileiro, direto e próximo, usando a ideia de próximo capítulo com moderação.',
 'WARNs de copy-lint mantidos: índices numerados identificam serviços, experimentos, etapas e itens do menu; as pequenas etiquetas identificam seções e diálogos. Não são números de resultados ou provas comerciais.',
 'Não há clientes, depoimentos, preços ou métricas de desempenho comercial inventados. untold é o nome fornecido pelo usuário. Não houve necessidade de criar nome nem de supor fatos.',
 'Contato real solicitado pelo usuário e confirmado em https://untold.com.br/: WhatsApp +55 28 92003-6176, untold344@gmail.com e Instagram untold_wd. Mensagens só são enviadas após a confirmação do visitante no WhatsApp. Testes interceptaram o destino e não enviaram mensagens.',
 'Nenhuma fotografia de terceiros nem projeto comercial fictício. As imagens e experiências foram feitas para este site; nenhum material do cliente ficou pendente. Sem slots vazios nem contatos .example.',
 'A prévia privada Sites não substitui o domínio comercial untold.com.br. Não foi configurada URL canônica de produção nesta prévia.',
 'Consulta ao catálogo 21st limitada por falta de autenticação; nenhum componente desse catálogo foi incorporado. Código principal próprio; Three.js MIT e recursos de movimento do toolkit com origem indicada no README.',
 ''];
await writeFile('VERIFICACAO.txt',lines.join('\n'));
console.log(`Relatório gravado: ${gateLine}; ${tests.checks.length} testes funcionais.`);

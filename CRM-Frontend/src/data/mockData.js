export const leads = [
  {
    nome: 'João Martins',
    empresa: 'TechSul',
    responsavel: 'Pablo',
    status: 'Ativo',
    cidade: 'Santa Maria',
    nicho: 'Tecnologia',
    dataCadastro: '10/01/2026',
  },
  {
    nome: 'Ana Ribeiro',
    empresa: 'Clínica Vida',
    responsavel: 'Maria',
    status: 'Ativo',
    cidade: 'Porto Alegre',
    nicho: 'Saúde',
    dataCadastro: '18/02/2026',
  },
  {
    nome: 'Carlos Lima',
    empresa: 'AgroCampo',
    responsavel: 'Pedro',
    status: 'Inativo',
    cidade: 'Cruz Alta',
    nicho: 'Agronegócio',
    dataCadastro: '05/11/2025',
  },
]

export const users = [
  { nome: 'Pablo Corrêa', email: 'pablo@empresa.com', cargo: 'Diretor Comercial', perfil: 'Administrador' },
  { nome: 'Maria Souza', email: 'maria@empresa.com', cargo: 'Vendedora', perfil: 'Usuário' },
  { nome: 'Pedro Alves', email: 'pedro@empresa.com', cargo: 'Assessor', perfil: 'Usuário' },
]

export const oportunidades = {
  Prospecção: [
    { titulo: 'Projeto CRM Simplificado', lead: 'TechSul', resp: 'Pablo', prioridade: 'Alta', valor: 'R$ 8.500' },
    { titulo: 'Consultoria Comercial', lead: 'AgroCampo', resp: 'Pedro', prioridade: 'Média', valor: 'R$ 3.200' },
  ],
  Qualificação: [{ titulo: 'Automação de Relatórios', lead: 'Clínica Vida', resp: 'Maria', prioridade: 'Alta', valor: 'R$ 5.700' }],
  Diagnóstico: [{ titulo: 'Integração de Dados', lead: 'Delta Jr', resp: 'Pablo', prioridade: 'Baixa', valor: 'R$ 2.900' }],
  Proposta: [{ titulo: 'Sistema de Leads', lead: 'Mercado Alfa', resp: 'Maria', prioridade: 'Média', valor: 'R$ 6.400' }],
  Negociação: [{ titulo: 'Dashboard Comercial', lead: 'Construtora Beta', resp: 'Pedro', prioridade: 'Alta', valor: 'R$ 9.000' }],
  Fechado: [{ titulo: 'Consultoria em Vendas', lead: 'Grupo Solar', resp: 'Pablo', prioridade: 'Alta', valor: 'R$ 12.000' }],
}

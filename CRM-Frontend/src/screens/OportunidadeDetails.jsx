import { useCallback, useEffect, useState } from 'react'

import { Download, FileText, XCircle } from 'lucide-react'

import PainelInteracoes from '../components/interacoes/PainelInteracoes'

import PainelPropostas from '../components/propostas/PainelPropostas'

import PainelTarefas from '../components/tarefas/PainelTarefas'

import ModalMarcarPerdida from '../components/oportunidades/ModalMarcarPerdida'

import Header from '../components/layout/Header'

import { fetchPropostasByOportunidade } from '../services/propostasService'
import { fetchOportunidadeById } from '../services/oportunidadesService'

import { getPriorityClass } from '../utils/priorityClass'



function OportunidadeDetails({ setScreen, oportunidadeId, currentUser }) {

  const [activeTab, setActiveTab] = useState('timeline')

  const [oportunidade, setOportunidade] = useState(null)

  const [propostas, setPropostas] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [showPerdaModal, setShowPerdaModal] = useState(false)



  const loadOportunidade = useCallback(async () => {

    if (!oportunidadeId) {

      setLoading(false)

      return

    }

    setLoading(true)

    setError('')

    try {

      const [data, propostasData] = await Promise.all([
        fetchOportunidadeById(oportunidadeId),
        fetchPropostasByOportunidade(oportunidadeId),
      ])

      setOportunidade(data)

      setPropostas(propostasData)

    } catch (requestError) {

      setError(requestError.message)

    } finally {

      setLoading(false)

    }

  }, [oportunidadeId])



  useEffect(() => {

    loadOportunidade()

  }, [loadOportunidade])



  const propostaRecente = propostas[0] ?? null



  if (loading) {

    return (

      <>

        <Header title="Detalhes da Oportunidade" subtitle="Carregando dados da oportunidade" />

        <p className="tableMessage">Carregando...</p>

      </>

    )

  }



  if (error || !oportunidade) {

    return (

      <>

        <Header title="Detalhes da Oportunidade" subtitle="Não foi possível carregar a oportunidade" />

        <p className="formError">{error || 'Oportunidade não encontrada.'}</p>

        <button className="secondaryBtn" onClick={() => setScreen('oportunidade')}>

          Voltar para Oportunidades

        </button>

      </>

    )

  }



  return (

    <>

      <Header title="Detalhes da Oportunidade" subtitle="Acompanhe evolução comercial, histórico e documentos" />

      <div className="leadDetailsLayout">

        <aside className="leadSummaryCard">

          <h2>{oportunidade.titulo}</h2>

          <div className="leadSummaryTags">

            <span className={`priority ${getPriorityClass(oportunidade.prioridade)}`}>

              {oportunidade.prioridade}

            </span>

            {oportunidade.perdida && <span className="tag danger">Perdida</span>}

          </div>

          <div className="leadSummaryList">

            <div>

              <strong>Lead</strong>

              <p>{oportunidade.lead}</p>

            </div>

            <div>

              <strong>Responsável</strong>

              <p>{oportunidade.responsavel}</p>

            </div>

            <div>

              <strong>Etapa</strong>

              <p>{oportunidade.etapa}</p>

            </div>

            <div>

              <strong>Valor</strong>

              <p>{oportunidade.valor}</p>

            </div>

            <div>

              <strong>Data de criação</strong>

              <p>{oportunidade.dataCriacao}</p>

            </div>

            {oportunidade.motivoPerda && (

              <div>

                <strong>Motivo da perda</strong>

                <p>{oportunidade.motivoPerda}</p>

              </div>

            )}

          </div>

          {!oportunidade.perdida && (

            <button type="button" className="dangerBtn full" onClick={() => setShowPerdaModal(true)}>

              <XCircle size={18} />

              Marcar como perdida

            </button>

          )}

          <button className="secondaryBtn full" onClick={() => setScreen('oportunidade')}>

            Voltar para Oportunidades

          </button>

        </aside>



        <section className="leadWorkspaceCard">

          <div className="leadTabs">

            <button className={activeTab === 'timeline' ? 'leadTab active' : 'leadTab'} onClick={() => setActiveTab('timeline')}>

              Linha do tempo

            </button>

            <button className={activeTab === 'tarefas' ? 'leadTab active' : 'leadTab'} onClick={() => setActiveTab('tarefas')}>

              Tarefas

            </button>

            <button className={activeTab === 'proposals' ? 'leadTab active' : 'leadTab'} onClick={() => setActiveTab('proposals')}>

              Propostas

            </button>

            <button className={activeTab === 'documents' ? 'leadTab active' : 'leadTab'} onClick={() => setActiveTab('documents')}>

              Documentos

            </button>

          </div>



          {activeTab === 'timeline' && (

            <PainelInteracoes

              leadId={oportunidade.leadId}

              oportunidadeId={oportunidade.id}

              currentUser={currentUser}

            />

          )}



          {activeTab === 'tarefas' && (

            <PainelTarefas

              leadId={oportunidade.leadId}

              oportunidadeId={oportunidade.id}

              currentUser={currentUser}

            />

          )}



          {activeTab === 'proposals' && (

            <PainelPropostas

              oportunidadeId={oportunidade.id}

              currentUser={currentUser}

              onPropostasChange={setPropostas}

            />

          )}



          {activeTab === 'documents' && (

            <div className="leadTabContent">

              {propostaRecente ? (

                <div className="documentPreview">

                  <div className="documentPreviewHeader">

                    <div>

                      <FileText size={20} />

                      <strong>{propostaRecente.titulo}</strong>

                    </div>

                    <button type="button" className="secondaryBtn" disabled>

                      <Download size={18} />

                      Baixar PDF (em breve)

                    </button>

                  </div>

                  <div className="documentPreviewBody">

                    <h3>Resumo da proposta mais recente</h3>

                    <p>

                      Proposta vinculada à oportunidade <strong>{oportunidade.titulo}</strong>.

                    </p>

                    <ul>

                      <li>Valor: {propostaRecente.valor}</li>

                      <li>Status: {propostaRecente.status}</li>

                      <li>Data: {propostaRecente.dataProposta}</li>

                      <li>Responsável: {propostaRecente.responsavel ?? oportunidade.responsavel}</li>

                      <li>Etapa da oportunidade: {oportunidade.etapa}</li>

                    </ul>

                  </div>

                </div>

              ) : (

                <p className="tableMessage">

                  Cadastre uma proposta na aba Propostas para visualizar o resumo aqui.

                </p>

              )}

            </div>

          )}

        </section>

      </div>

      {showPerdaModal && (

        <ModalMarcarPerdida

          oportunidade={oportunidade}

          currentUser={currentUser}

          onClose={() => setShowPerdaModal(false)}

          onSuccess={loadOportunidade}

        />

      )}

    </>

  )

}



export default OportunidadeDetails



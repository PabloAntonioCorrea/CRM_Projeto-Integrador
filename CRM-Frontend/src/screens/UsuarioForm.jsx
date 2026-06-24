import { useCallback, useEffect, useMemo, useState } from 'react'
import { Save, Settings2, X } from 'lucide-react'
import Field from '../components/common/Field'
import Header from '../components/layout/Header'
import ModalGerenciarCargos from '../components/usuarios/ModalGerenciarCargos'
import { useSession } from '../context/SessionContext'
import { fetchCargos } from '../services/cargosService'
import { createUsuario, fetchUsuarioById, updateUsuario } from '../services/usuariosService'

const EmptyForm = {
  nome: '',
  email: '',
  senha: '',
  cargo: '',
  perfil: 'Usuário',
}

function UsuarioForm({ setScreen, usuarioId }) {
  const currentUser = useSession()
  const [form, setForm] = useState(EmptyForm)
  const [cargos, setCargos] = useState([])
  const [showGerenciarCargos, setShowGerenciarCargos] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(usuarioId)
  const isAdmin = currentUser?.perfilAcesso === 'Administrador'

  const loadCargos = useCallback(async () => {
    try {
      const data = await fetchCargos(true)
      setCargos(data)
    } catch {
      setCargos([])
    }
  }, [])

  useEffect(() => {
    const loadFormData = async () => {
      setError('')
      try {
        await loadCargos()

        if (!usuarioId) {
          setForm({ ...EmptyForm })
          return
        }

        const usuario = await fetchUsuarioById(usuarioId)
        setForm({
          nome: usuario.nome ?? '',
          email: usuario.email ?? '',
          senha: '',
          cargo: usuario.cargo ?? '',
          perfil: usuario.perfil ?? 'Usuário',
        })
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }
    loadFormData()
  }, [usuarioId, loadCargos])

  const cargoOptions = useMemo(() => {
    const nomes = cargos.map((item) => item.nome)
    if (form.cargo && !nomes.includes(form.cargo)) {
      return [form.cargo, ...nomes]
    }
    return nomes
  }, [cargos, form.cargo])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        cargo: form.cargo,
        perfil: form.perfil,
      }
      if (form.senha.trim()) {
        payload.senha = form.senha
      }
      if (isEditing) {
        await updateUsuario(usuarioId, payload)
      } else {
        await createUsuario({ ...payload, senha: form.senha })
      }
      setScreen('usuarios')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCargosUpdated = async () => {
    try {
      const data = await fetchCargos(true)
      setCargos(data)
      setForm((current) => {
        if (!current.cargo) return current
        const stillValid = data.some((item) => item.nome === current.cargo)
        return stillValid ? current : { ...current, cargo: '' }
      })
    } catch {
      setCargos([])
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Cadastro de Usuário" subtitle="Carregando dados do formulário" />
        <p className="tableMessage">Carregando...</p>
      </>
    )
  }

  return (
    <>
      <Header
        title={isEditing ? 'Editar Usuário' : 'Cadastro de Usuário'}
        subtitle="Defina dados, cargo e nível de acesso"
      />
      <section className="formPanel">
        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <Field
              label="Nome"
              name="nome"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="email@empresa.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Field
              label={isEditing ? 'Nova senha (opcional)' : 'Senha'}
              name="senha"
              type="password"
              placeholder={isEditing ? 'Deixe em branco para manter' : 'Senha inicial'}
              value={form.senha}
              onChange={handleChange}
              required={!isEditing}
            />
            <label className="inputGroup">
              <span>Cargo</span>
              <select name="cargo" value={form.cargo} onChange={handleChange} required>
                <option value="">Selecione</option>
                {cargoOptions.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </label>
            {isAdmin && (
              <button
                type="button"
                className="linkBtn fullLine"
                onClick={() => setShowGerenciarCargos(true)}
              >
                <Settings2 size={16} />
                Gerenciar cargos
              </button>
            )}
            <label className="inputGroup">
              <span>Perfil de acesso</span>
              <select name="perfil" value={form.perfil} onChange={handleChange}>
                <option value="Administrador">Administrador</option>
                <option value="Usuário">Usuário</option>
              </select>
            </label>
          </div>
          {cargoOptions.length === 0 && (
            <p className="formError">
              {isAdmin
                ? 'Nenhum cargo ativo. Use "Gerenciar cargos" para cadastrar.'
                : 'Nenhum cargo disponível. Peça ao administrador cadastrar os cargos.'}
            </p>
          )}
          {error && <p className="formError">{error}</p>}
          <div className="formActions">
            <button type="button" className="secondaryBtn" onClick={() => setScreen('usuarios')}>
              <X size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              className="primaryBtn"
              disabled={saving || cargoOptions.length === 0}
            >
              <Save size={18} />
              {saving ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </section>
      {showGerenciarCargos && isAdmin && (
        <ModalGerenciarCargos
          onClose={() => setShowGerenciarCargos(false)}
          onUpdated={handleCargosUpdated}
        />
      )}
    </>
  )
}

export default UsuarioForm

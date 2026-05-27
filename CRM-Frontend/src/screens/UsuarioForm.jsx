import { useEffect, useState } from 'react'
import { Save, X } from 'lucide-react'
import Field from '../components/common/Field'
import Header from '../components/layout/Header'
import { createUsuario, fetchUsuarioById, updateUsuario } from '../services/usuariosService'

const CargoOptions = [
  'Diretor Comercial',
  'Segundo em comando',
  'Assessor',
  'Vendedor',
]

const EmptyForm = {
  nome: '',
  email: '',
  senha: '',
  cargo: '',
  perfil: 'Usuário',
}

function UsuarioForm({ setScreen, usuarioId }) {
  const [form, setForm] = useState(EmptyForm)
  const [loading, setLoading] = useState(Boolean(usuarioId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEditing = Boolean(usuarioId)

  useEffect(() => {
    const loadUsuario = async () => {
      if (!usuarioId) {
        setLoading(false)
        return
      }
      setError('')
      try {
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
    loadUsuario()
  }, [usuarioId])

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
                {CargoOptions.map((cargo) => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
            </label>
            <label className="inputGroup">
              <span>Perfil de acesso</span>
              <select name="perfil" value={form.perfil} onChange={handleChange}>
                <option value="Administrador">Administrador</option>
                <option value="Usuário">Usuário</option>
              </select>
            </label>
          </div>
          {error && <p className="formError">{error}</p>}
          <div className="formActions">
            <button type="button" className="secondaryBtn" onClick={() => setScreen('usuarios')}>
              <X size={18} />
              Cancelar
            </button>
            <button type="submit" className="primaryBtn" disabled={saving}>
              <Save size={18} />
              {saving ? 'Salvando...' : 'Salvar Usuário'}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default UsuarioForm

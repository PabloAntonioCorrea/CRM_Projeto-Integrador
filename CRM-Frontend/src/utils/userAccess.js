export const isAdministrador = (user) => user?.perfilAcesso === 'Administrador'

export const adminOnlyScreens = ['usuarios', 'usuarioForm']

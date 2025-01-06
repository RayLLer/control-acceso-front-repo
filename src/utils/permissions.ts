export enum PermissionsEnum {
  GestionarUsuarios = 'Gestionar Usuarios',
  GestionarRolesPermisos = 'Gestionar Roles y Permisos',
  GestionarCategorias = 'Gestionar Categorías',
  GestionarPreguntas = 'Gestionar Preguntas',
  VerTestsRealizados = 'Ver Tests Realizados',
  VerReporteDeQuejasYErrores = 'Ver Reporte de Quejas y Errores',
  GestionarTest = 'Gestionar Test',
  GestionarConfiguracion = 'Gestionar Configuración',
  GestionarTips = 'Gestionar Tips'
}

interface Permission {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function validatePermissionName(
  name: PermissionsEnum,
  permissions: Permission[],
  role: string
): boolean {
  const hasPermission = permissions.findIndex(
    (permission) => permission.name === name
  );
  return hasPermission !== -1 || role === 'Administrador';
}

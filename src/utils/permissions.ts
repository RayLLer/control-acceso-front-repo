// export enum PermissionsEnum {
//   EVENTS = 'Ver eventos',
//   CAMPAIGNS = 'Ver campañas y creatividades',
//   USERS = 'Gestionar usuarios',
//   ROLES = 'Gestionar roles',
//   UPLOAD_CREATIVITIES = 'Subir creatividades',
//   REJECT_CREATIVITIES = 'Rechazar creatividades',
//   APPROVE_CREATIVITIES = 'Aprobar creatividades',
//   ALL = 'Todos los permisos',
//   BASIC = 'Básicos',
//   CONFIGURACIONES = 'Gestionar configuraciones',
//   CONFIGURACIONES_GENERALES = 'Gestionar configuraciones generales',
//   ORGANIZATIONS = 'Gestionar organizaciones',
//   GET_CREATIVITIES_ANOUNCEMENTS_CAMPAIGN = 'Ver creatividades, campañas y anunciantes',
//   ANOUNCEMENTS_CAMPAIGN = 'Gestionar anunciantes y campañas',
//   LOGS = 'Ver logs de acciones del usuario',
// }

export enum PermissionsEnum {
  GestionarUsuarios = 'Gestionar Usuarios',
  GestionarRolesPermisos = 'Gestionar Roles y Permisos',
  GestionarEstado = 'Gestionar estado de conductores, vehículos y anticipos',
  GestionarTarifas = 'Gestionar Tarifas',
  VerChat = 'Ver Chat',
  GestionarConfiguracionesGenerales = 'Gestionar Configuraciones Generales',
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

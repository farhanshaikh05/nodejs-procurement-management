const allRoles = {
    user: [],
    procurement: ['getUsers', 'manageUsers', 'manageInspectionUser', 'manageChecklist', 'manageOrder'],
    inspection: ['updateChecklist'],
    admin: ['getUsers', 'manageUsers', 'manageInspectionUser', 'manageProcurementUser', 'manageAssign', 'manageChecklist', 'manageOrder'],
  };
  
  const roles = Object.keys(allRoles);
  const defaultRole = roles[0];
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
    defaultRole,
  };
  
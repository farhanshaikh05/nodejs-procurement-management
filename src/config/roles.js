const allRoles = {
    user: [],
    procurement: ['getUsers', 'manageUsers', 'manageInspectionUser', 'manageChecklist', 'manageOrder', 'getOrders'],
    inspection: ['getUsers', 'updateChecklist'],
    admin: ['getUsers', 'manageUsers', 'manageInspectionUser', 'manageProcurementUser', 'manageAssign', 'manageChecklist', 'manageOrder', 'getOrders'],
  };
  
  const roles = Object.keys(allRoles);
  const defaultRole = roles[0];
  const roleRights = new Map(Object.entries(allRoles));
  
  module.exports = {
    roles,
    roleRights,
    defaultRole,
  };
  
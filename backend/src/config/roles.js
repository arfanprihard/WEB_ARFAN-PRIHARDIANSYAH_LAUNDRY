export const ROLE_PERMISSIONS = {
  users: ["Admin"],
  levels: ["Admin"],
  customers: ["Admin", "Operator"],
  servicesWrite: ["Admin"],
  servicesRead: ["Admin", "Operator"],
  ordersWrite: ["Admin", "Operator"],
  ordersRead: ["Admin", "Operator", "Pimpinan"],
  orderDetails: ["Admin", "Operator"],
  pickups: ["Admin", "Operator"],
};

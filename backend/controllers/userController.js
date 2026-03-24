const users = require("../data/users");

const getCustomers = (req, res) => {
  const customers = users.filter((user) => user.role === "customer");

  return res.json({
    success: true,
    customers
  });
};

module.exports = {
  getCustomers
};
const users = require("../data/users");

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập email và mật khẩu."
    });
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Sai email hoặc mật khẩu!"
    });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đủ thông tin."
    });
  }

  const existed = users.find((u) => u.email === email);

  if (existed) {
    return res.status(400).json({
      success: false,
      message: "Email đã tồn tại, hãy đăng nhập."
    });
  }

  const newUser = {
    id: Date.now(),
    name: name || "New User",
    email,
    password,
    role: "customer"
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    }
  });
};

module.exports = {
  login,
  register
};
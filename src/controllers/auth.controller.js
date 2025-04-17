import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../daos/mongodb/models/User.js';
import Cart from '../daos/mongodb/models/Cart.js';

const SECRET = process.env.JWT_SECRET || 'supersecret';

export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Usuario ya existe' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const cart = await Cart.create({ products: [] });

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
      cart: cart._id
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email }).populate('cart');
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });
  
      const token = jwt.sign(
        { user: { id: user._id, email: user.email, role: user.role } },
        SECRET,
        { expiresIn: '1h' } // Duracion del token = 1hr
      );
  
      // 👉 Guardar token en cookie
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false, // poner true si usás HTTPS
          maxAge: 3600000 // Duracion de cookies = 1hr
        })
        .json({ message: 'Login exitoso', token }); // También se devuelve para Postman
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const current = (req, res) => {
  res.json({ user: req.user });
};

export const logout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logout exitoso' });
  };
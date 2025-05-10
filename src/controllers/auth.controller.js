import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user-repository.js';
import { cartRepository } from '../repositories/cart-repository.js';
import { transporter } from '../services/email-service.js';
import { getResetEmailConfig } from '../services/email-reset.service.js';
import UserDTO from '../dto/user-dto.js';

const SECRET = process.env.JWT_SECRET || 'supersecret';

// Register
export const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    const existing = await userRepository.getByEmail(email);
    if (existing) return res.status(400).json({ error: 'Usuario ya existe' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const cart = await cartRepository.create();

    const user = await userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
      cart: cart._id,
      role: email === 'admin@admin.com' ? 'admin' : 'user'
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.getByEmail(email);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { user: { id: user._id, email: user.email, role: user.role } },
      SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    }).json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Current
export const current = async (req, res) => {
  try {
    const userDTO = await userRepository.findById(req.user._id);
    res.json({ user: userDTO });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario actual' });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout exitoso' });
};

// Pass Reset
export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userRepository.getByEmail(email);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

  try {
    await transporter.sendMail(getResetEmailConfig(user, token));
    res.json({ message: 'Email de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al enviar el email' });
  }
};

export const resetPassword = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }

  const token = authHeader.split(' ')[1];
  const { newPassword } = req.body;

  if (!newPassword || typeof newPassword !== 'string') {
    return res.status(400).json({
      error: 'Contraseña inválida o ausente',
      detail: 'El campo newPassword debe ser un string no vacío'
    });
  }

  try {
    const payload = jwt.verify(token, SECRET);

    const user = await userRepository.findByIdWithPassword(payload.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'El usuario no tiene contraseña almacenada' });
    }

    const isSame = bcrypt.compareSync(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (err) {
    res.status(400).json({
      error: 'Token inválido o expirado',
      detail: err.message
    });
  }
};



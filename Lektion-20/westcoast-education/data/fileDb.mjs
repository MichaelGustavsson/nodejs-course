import crypto from 'crypto';
import { readFileAsync, writeFileAsync } from '../utilities/fileHandler.mjs';

export const findUserByEmail = async (email) => {
  const users = await loadUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new Error('Kunde inte hitta användaren!');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
  };
};

export const findUserById = async (id) => {
  const users = await loadUsers();
  const user = users.find((user) => user.id === id);

  if (!user) throw new Error('Kunde inte hitta användaren');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const findUserByResetPasswordToken = async (token) => {
  const users = await loadUsers();
  const user = users.find((user) => user.resetPasswordToken === token);

  if (!user || new Date(user.resetPasswordTokenExpire) < Date.now()) {
    throw new Error('Ogiltigt token', 400);
  }

  return user;
};

export const getResetPasswordToken = async (userId) => {
  // 1. Skapa ett token...
  const resetToken = crypto.randomBytes(20).toString('hex');
  // 2. Hämta alla användare
  const users = await loadUsers();
  // 3. Hämta ut användare med ovan givna userId
  const user = users.find((user) => user.id === userId);
  // 4. Uppdatera egenskaperna resetPasswordToken och resetPasswordTokenExpire för användaren
  // Skapa en hash för vårt reset token...
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Sätt en bäst före tid för användandet av reset token...
  user.resetPasswordTokenExpire = new Date(
    Date.now() + 10 * 60 * 1000
  ).toLocaleString('sv-SE');

  // 5. Uppdatera users.json filen med förändringarna
  await updateUser(user);

  // 6. Returnera användaren
  return user;
};

export const save = async (user) => {
  const users = await loadUsers();

  users.push(user);

  await writeFileAsync('data', 'users.json', JSON.stringify(users));
};

export const updateUser = async (user) => {
  // 1. Hämta alla användare...
  let users = await loadUsers();

  // 2. Filtrera bort uppdaterad användare ur users...
  users = users.filter((u) => u.id !== user.id);

  // 3. Lägg tillbaka den uppdaterade användaren i users...
  users.push(user);

  // 4. Skriv ner users till users.json...
  await writeFileAsync('data', 'users.json', JSON.stringify(users));
};

// Hjälp funktion...
const loadUsers = async () => {
  // Läsa in filen users.json...
  return await readFileAsync('data', 'users.json');
};

import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utilities/security.mjs';

export default class User {
  constructor(name, email, password, role) {
    this.id = uuidv4().replaceAll('-', '');
    this.name = name;
    this.email = email;
    this.password = hashPassword(password);
    this.role = role;
    this.createdAt = Date.now();
  }
}

import bcrypt from 'bcryptjs';

export const isAuthenticated = () => localStorage.getItem('token');
export const isAdministrator = () => bcrypt.compareSync('#isAdm@', localStorage.getItem('isAdm'));

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
};
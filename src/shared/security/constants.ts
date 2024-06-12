import { v4 as uuidv4 } from 'uuid';


const jwtSecret = uuidv4();

const jwtConstants = {
  JWT_SECRET: 'miclavesecretatemporal',
  JWT_EXPIRES_IN: '2h',
};

export default jwtConstants;

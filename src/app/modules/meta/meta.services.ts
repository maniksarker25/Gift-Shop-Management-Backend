import { JwtPayload } from 'jsonwebtoken';

const getDashboardMetaDataFromDB = async (user: JwtPayload) => {
  console.log(user);
};

export const metaServices = {
  getDashboardMetaDataFromDB,
};

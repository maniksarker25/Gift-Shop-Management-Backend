import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLE } from '../auth/auth.constant';
import AppError from '../../error/appError';
import httpStatus from 'http-status';
import { Gift } from '../gift/gift.model';
import { User } from '../auth/auth.model';
import { Sale } from '../sale/sale.model';

const getDashboardMetaDataFromDB = async (user: JwtPayload) => {
  let metaData;
  switch (user?.role) {
    case USER_ROLE.manager:
      metaData = await getManagerMetaData();
      break;
    case USER_ROLE.seller:
      metaData = await getSellerMetaData(user);
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user role');
  }

  return metaData;
};

const getManagerMetaData = async () => {
  const totalProduct = await Gift.countDocuments();
  const totalSeller = await User.find({
    role: USER_ROLE.seller,
  }).countDocuments();
  const totalSale = await Sale.countDocuments();
  const revenue = await Sale.aggregate([
    {
      // Group all sales and calculate the sum of `amount`
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  // total revenue
  const totalRevenue = revenue[0].totalRevenue;
  const categoryBarChartData = await Gift.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalProduct,
    totalSeller,
    totalSale,
    totalRevenue,
    categoryBarChartData,
  };
};
const getSellerMetaData = async (user: JwtPayload) => {
  const totalProduct = await Gift.countDocuments();
  const categories = await Gift.aggregate([
    {
      $group: {
        _id: '$category',
      },
    },
    {
      $count: 'uniqueCategories',
    },
  ]);
  const totalCategories = categories[0].uniqueCategories;
  const themes = await Gift.aggregate([
    {
      $group: {
        _id: '$theme',
      },
    },
    {
      $count: 'uniqueThemes',
    },
  ]);
  const totalThemes = themes[0].uniqueThemes;
  const myTotalSale = await Sale.find({ seller: user._id }).countDocuments();
  const categoryBarChartData = await getCategoryBarChartData();
  const themePieChartData = await Gift.aggregate([
    {
      $group: {
        _id: '$theme',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalProduct,
    totalCategories,
    totalThemes,
    myTotalSale,
    categoryBarChartData,
    themePieChartData,
  };
};

const getLineChartDataForManager = async (range: string) => {
  let salesData;
  if (range === 'monthly') {
    salesData = await getCurrentMonthSales();
  } else if (range === 'yearly') {
    salesData = await getCurrentYearSales();
  }
  const formattedData = salesData?.map((sale) => ({
    label: range === 'monthly' ? `${sale._id}` : `${sale.month}`,
    count: sale.count,
  }));

  return formattedData;
};

const getCurrentMonthSales = async () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month

  return Sale.aggregate([
    { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
    {
      $group: {
        _id: { $dayOfMonth: '$date' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};
const getCurrentYearSales = async () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear + 1, 0, 1);

  return Sale.aggregate([
    { $match: { date: { $gte: startOfYear, $lt: endOfYear } } },
    {
      $group: {
        _id: { $month: '$date' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 1] }, then: 'January' },
              { case: { $eq: ['$_id', 2] }, then: 'February' },
              { case: { $eq: ['$_id', 3] }, then: 'March' },
              { case: { $eq: ['$_id', 4] }, then: 'April' },
              { case: { $eq: ['$_id', 5] }, then: 'May' },
              { case: { $eq: ['$_id', 6] }, then: 'June' },
              { case: { $eq: ['$_id', 7] }, then: 'July' },
              { case: { $eq: ['$_id', 8] }, then: 'August' },
              { case: { $eq: ['$_id', 9] }, then: 'September' },
              { case: { $eq: ['$_id', 10] }, then: 'October' },
              { case: { $eq: ['$_id', 11] }, then: 'November' },
              { case: { $eq: ['$_id', 12] }, then: 'December' },
            ],
            default: 'Unknown',
          },
        },
        count: 1,
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getCategoryBarChartData = async () => {
  const categoryBarChartData = await Gift.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  return categoryBarChartData;
};

export const metaServices = {
  getDashboardMetaDataFromDB,
  getLineChartDataForManager,
};

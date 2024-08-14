import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { metaServices } from './meta.services';

const getDashboardMetaData = catchAsync(async (req, res) => {
  const result = await metaServices.getDashboardMetaDataFromDB(req?.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meta data retrieved successfully',
    data: result,
  });
});

const getManagerLineChartData = catchAsync(async (req, res) => {
  const { range } = req.query;
  const result = await metaServices.getLineChartDataForManager(range as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Line chart data retrieved successfully',
    data: result,
  });
});

export const metaControllers = {
  getDashboardMetaData,
  getManagerLineChartData,
};

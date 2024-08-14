import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { metaServices } from './meta.services';

const getDashboardMetaData = catchAsync(async (req, res) => {
  const resut = await metaServices.getDashboardMetaDataFromDB(req?.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meta data retrieved successfully',
    data: result,
  });
});

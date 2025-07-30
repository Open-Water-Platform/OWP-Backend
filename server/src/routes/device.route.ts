import { Router, Request, Response } from 'express';
import {
  getDeviceData,
  handleGetUserDevices,
} from '../controllers/device.controller';
import { getAllDevices } from '../utils/utils';
import { ApiResponse } from '../types';

const router = Router();

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const devices = await getAllDevices('sw');
    console.log(devices);
    const apiResponse: ApiResponse = { data: { user_devices: devices } };
    res.status(200).send(apiResponse);
  } catch (err) {
    const errorResponse: ApiResponse = { message: err as string };
    res.status(404).send(errorResponse);
    console.log(err);
  }
});

router.get('/', handleGetUserDevices);
router.get('/all/:id', getDeviceData);

export { router as deviceRoute }; 
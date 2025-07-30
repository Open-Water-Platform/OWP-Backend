import { Response } from 'express';
import { fetchById } from '../models/data.model';
import { getAllDevices, getUserDevices } from '../utils/utils';
import { AuthenticatedRequest, ApiResponse } from '../types';

const mainDB = 'owmp';

async function getDeviceData(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const response = await fetchById(Number(id), 100, mainDB);

    const apiResponse: ApiResponse = {
      message: 'data fetched successfully',
      data: response
    };

    res.status(200).send(apiResponse);
    
  } catch (e) {
    console.log(e);
    const errorResponse: ApiResponse = { error: e };
    res.status(500).send(errorResponse);
  }
}

async function handleGetUserDevices(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { type } = req.query as { type: string };
    const { uid } = req.userRecord!;
    const admin = req.userRecord?.customClaims?.admin;
    let devices = [];

    if (admin) {
      devices = await getAllDevices(type);
    } else {
      devices = await getUserDevices(uid, type);
    }

    const apiResponse: ApiResponse = {
      data: { user_devices: devices }
    };

    res.status(200).send(apiResponse);
  } catch (err) {
    const errorResponse: ApiResponse = { message: 'not found' };
    res.status(404).send(errorResponse);
    console.log(err);
  }
}

export {
  getDeviceData,
  handleGetUserDevices,
}; 
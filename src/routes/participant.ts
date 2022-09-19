import { Router } from 'express';
import { is } from 'typescript-is';
import { getApi, DyteAPI } from '../util/DyteAPI';

const router = Router();

router.post('/create', async (req, res) => {
    try {
        const { userDetails } = req.body;
        if (userDetails && !userDetails.name) {
            return res.status(400).json({
                success: false,
                message: 'Empty name not allowed',
            });
        }

        if (!is<DyteAPI.RequestTypes.AddParticipantOptions>(req.body)) {
            return res.status(400).json({
                success: false,
            });
        }
        if (req.body.meetingId) {
            const apiRes = await getApi().addParticipantMID(req.body);

            if (!apiRes.success) {
                return res.status(500).json({
                    sucess: false,
                });
            }

            return res.json({
                success: true,
                data: apiRes.data,
            });
        } if (req.body.roomName) {
            const apiRes = await getApi().addParticipantRNA(req.body);

            if (!apiRes.success) {
                return res.status(500).json({
                    sucess: false,
                });
            }

            return res.json({
                success: true,
                data: apiRes.data,
            });
        }
        return res.status(400).json({
            msg: 'Either meetingID or roomName should be supplied in the request body.',
        });
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            error: error.message,
        });
    }
});

export default router;

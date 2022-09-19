import { Router } from 'express';
import MeetingRouter from './meeting';
import ParticipantRouter from './participant';
import PresetRouter from './presets';
import MeetingsRouter from './meetings';

const router = Router();

router.use('/meeting', MeetingRouter);
router.use('/participant', ParticipantRouter);
router.use('/presets', PresetRouter);
router.use('/meetings', MeetingsRouter);

export default router;

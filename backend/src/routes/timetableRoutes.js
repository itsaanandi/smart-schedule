const express = require('express');
const {
  generate,
  getDivisionTimetable,
  getAllTimetables,
  upsertSlot,
  updateSlot,
  clearDivisionTimetable
} = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// GET /api/timetable            -> timetables scoped to the caller's role
// POST /api/timetable/generate  -> admin triggers the generator
// POST /api/timetable/slot      -> admin creates/overrides a slot
// PUT /api/timetable/slot/:id   -> admin moves/edits an existing slot
router.get('/', getAllTimetables);
router.post('/generate', authorize('admin'), generate);
router.post('/slot', authorize('admin'), upsertSlot);
router.put('/slot/:id', authorize('admin'), updateSlot);

router.get('/division/:divisionId', getDivisionTimetable);
router.delete('/division/:divisionId', authorize('admin'), clearDivisionTimetable);

module.exports = router;

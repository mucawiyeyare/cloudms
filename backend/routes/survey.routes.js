// =====================================================
// SURVEY ROUTES
// POST /api/surveys       - Submit a new survey response
// GET  /api/surveys       - Get all responses (admin only)
// GET  /api/surveys/stats - Get chart statistics (admin only)
// =====================================================
const express = require('express');
const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const authMiddleware = require('../middleware/auth');

// @route   POST /api/surveys
// @desc    Submit a new survey response
// @access  Public
router.post('/', async (req, res) => {
  try {
    const response = new SurveyResponse(req.body);
    await response.save();
    res.status(201).json({ message: '✅ Jawaabkaaga si guul leh ayaa loo keydiyey. Mahadsanid!', id: response._id });
  } catch (err) {
    console.error('Survey submission error:', err);
    res.status(500).json({ message: 'Cilad server ahaan ayaa dhacday.', error: err.message });
  }
});

// @route   GET /api/surveys
// @desc    Get all survey responses with optional filtering
// @access  Private (Admin Only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sector, location, search } = req.query;
    let query = {};

    // Filter by sector
    if (sector && sector !== 'all') {
      query['sectionA.sector'] = sector;
    }
    // Filter by location (case-insensitive)
    if (location && location.trim() !== '') {
      query['sectionA.location'] = { $regex: location, $options: 'i' };
    }
    // Search by business name
    if (search && search.trim() !== '') {
      query['sectionA.businessName'] = { $regex: search, $options: 'i' };
    }

    const responses = await SurveyResponse.find(query).sort({ createdAt: -1 });
    res.json({ count: responses.length, data: responses });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET /api/surveys/stats
// @desc    Get aggregated statistics for charts
// @access  Private (Admin Only)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalResponses = await SurveyResponse.countDocuments();

    // Cloud Awareness Distribution
    const awarenessAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$sectionB.awarenessLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Sector Distribution
    const sectorAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$sectionA.sector', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Cloud Tools Usage (unwound array)
    const cloudToolsAgg = await SurveyResponse.aggregate([
      { $unwind: '$sectionE.cloudToolsUsed' },
      { $group: { _id: '$sectionE.cloudToolsUsed', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Storage Methods
    const storageAgg = await SurveyResponse.aggregate([
      { $unwind: '$sectionD.storageMethod' },
      { $group: { _id: '$sectionD.storageMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Main Challenges
    const challengesAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$sectionG.mainTechChallenge', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Cloud Adoption Readiness (usesCloudTools)
    const adoptionAgg = await SurveyResponse.aggregate([
      { $group: { _id: '$sectionE.usesCloudTools', count: { $sum: 1 } } },
    ]);

    res.json({
      totalResponses,
      awareness: awarenessAgg,
      sectors: sectorAgg,
      cloudTools: cloudToolsAgg,
      storage: storageAgg,
      challenges: challengesAgg,
      adoption: adoptionAgg,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   DELETE /api/surveys/:id
// @desc    Delete a survey response
// @access  Private (Admin Only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const response = await SurveyResponse.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).json({ message: 'Jawaabtu ma helin.' });
    }
    res.json({ message: 'Jawaabka si guul leh ayaa loo tirtiray.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/resume
// @desc    Create a new resume version
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const nextVersion = await Resume.getNextVersion(req.user._id);
    
    const resumeData = {
      ...req.body,
      user: req.user._id,
      version: nextVersion
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({
      message: 'Resume created successfully',
      resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Server error during resume creation' });
  }
});

// @route   GET /api/resume
// @desc    Get all resume versions for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.getUserVersions(req.user._id);
    
    res.json({
      resumes: resumes.map(resume => ({
        id: resume._id,
        version: resume.version,
        template: resume.template,
        personalInfo: resume.personalInfo,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        isActive: resume.isActive
      }))
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error while fetching resumes' });
  }
});

// @route   GET /api/resume/latest
// @desc    Get the latest resume version
// @access  Private
router.get('/latest', auth, async (req, res) => {
  try {
    const resume = await Resume.getLatestVersion(req.user._id);
    
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get latest resume error:', error);
    res.status(500).json({ message: 'Server error while fetching latest resume' });
  }
});

// @route   GET /api/resume/:version
// @desc    Get specific resume version
// @access  Private
router.get('/:version', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      user: req.user._id,
      version: parseInt(req.params.version)
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume version not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume version error:', error);
    res.status(500).json({ message: 'Server error while fetching resume version' });
  }
});

// @route   PUT /api/resume/:version
// @desc    Update specific resume version
// @access  Private
router.put('/:version', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        user: req.user._id,
        version: parseInt(req.params.version)
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume version not found' });
    }

    res.json({
      message: 'Resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Server error during resume update' });
  }
});

// @route   DELETE /api/resume/:version
// @desc    Delete specific resume version
// @access  Private
router.delete('/:version', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      user: req.user._id,
      version: parseInt(req.params.version)
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume version not found' });
    }

    res.json({ message: 'Resume version deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error during resume deletion' });
  }
});

// @route   POST /api/resume/:version/duplicate
// @desc    Duplicate a resume version
// @access  Private
router.post('/:version/duplicate', auth, async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      user: req.user._id,
      version: parseInt(req.params.version)
    });

    if (!originalResume) {
      return res.status(404).json({ message: 'Resume version not found' });
    }

    const nextVersion = await Resume.getNextVersion(req.user._id);
    
    const newResume = new Resume({
      ...originalResume.toObject(),
      _id: undefined,
      version: nextVersion,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newResume.save();

    res.status(201).json({
      message: 'Resume duplicated successfully',
      resume: newResume
    });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({ message: 'Server error during resume duplication' });
  }
});

// @route   POST /api/resume/:version/rollback
// @desc    Rollback to a specific version (creates new version with old data)
// @access  Private
router.post('/:version/rollback', auth, async (req, res) => {
  try {
    const targetResume = await Resume.findOne({
      user: req.user._id,
      version: parseInt(req.params.version)
    });

    if (!targetResume) {
      return res.status(404).json({ message: 'Resume version not found' });
    }

    const nextVersion = await Resume.getNextVersion(req.user._id);
    
    const rollbackResume = new Resume({
      ...targetResume.toObject(),
      _id: undefined,
      version: nextVersion,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await rollbackResume.save();

    res.status(201).json({
      message: 'Rollback successful',
      resume: rollbackResume
    });
  } catch (error) {
    console.error('Rollback error:', error);
    res.status(500).json({ message: 'Server error during rollback' });
  }
});

module.exports = router;

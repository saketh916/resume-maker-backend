const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  gpa: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  achievements: [{
    type: String,
    trim: true
  }]
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Languages', 'Tools'],
    default: 'Technical'
  }
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: Number,
    required: true,
    default: 1
  },
  template: {
    type: String,
    required: true,
    default: 'modern'
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  projects: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    technologies: [{
      type: String,
      trim: true
    }],
    link: {
      type: String,
      trim: true
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    link: {
      type: String,
      trim: true
    }
  }],
  languages: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
      default: 'Conversational'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique versions per user
resumeSchema.index({ user: 1, version: 1 }, { unique: true });

// Method to get the next version number for a user
resumeSchema.statics.getNextVersion = async function(userId) {
  const latestResume = await this.findOne({ user: userId }).sort({ version: -1 });
  return latestResume ? latestResume.version + 1 : 1;
};

// Method to get all versions of a user's resumes
resumeSchema.statics.getUserVersions = async function(userId) {
  return this.find({ user: userId }).sort({ version: -1 });
};

// Method to get the latest version of a user's resume
resumeSchema.statics.getLatestVersion = async function(userId) {
  return this.findOne({ user: userId }).sort({ version: -1 });
};

module.exports = mongoose.model('Resume', resumeSchema);

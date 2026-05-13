// =====================================================
// SURVEY RESPONSE MODEL
// Stores all answers from the Somali questionnaire
// Hormuud University - Cloud Computing Research
// =====================================================
const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema(
  {
    // Section A: Organization Profile
    sectionA: {
      businessName: { type: String, trim: true },
      sector: { type: String },
      otherSector: { type: String },
      location: { type: String, trim: true },
      role: { type: String },
      otherRole: { type: String },
      employeeCount: { type: String },
    },

    // Section B: Cloud Awareness
    sectionB: {
      heardAboutCloud: { type: String }, // Haa / Maya
      awarenessLevel: { type: String },  // Aad u sarreeya / Sarreeya / etc.
    },

    // Section C: Current Technology Usage
    sectionC: {
      devicesUsed: [{ type: String }],     // Checkboxes
      otherDevice: { type: String },
      useDigitalSystems: { type: String }, // Haa / Maya
      systemsUsed: [{ type: String }],     // Checkboxes
      otherSystem: { type: String },
      techUsageLevel: { type: String },
      manualTasks: [{ type: String }],     // Checkboxes
      otherManualTask: { type: String },
    },

    // Section D: Data Storage & Backup
    sectionD: {
      storageMethod: [{ type: String }],  // Checkboxes
      backupFrequency: { type: String },
      everLostData: { type: String },     // Haa / Maya
      dataLossCause: { type: String },
      otherDataLossCause: { type: String },
      storageConfidenceLevel: { type: String },
    },

    // Section E: Cloud Tool Usage
    sectionE: {
      usesCloudTools: { type: String },   // Haa / Maya / Ma hubo
      cloudToolsUsed: [{ type: String }], // Checkboxes
      otherCloudTool: { type: String },
      cloudImportance: { type: String },
      cloudUsageFrequency: { type: String },
    },

    // Section F: Infrastructure Availability
    sectionF: {
      internetReliability: { type: String },
      powerStability: { type: String },
      hasBackupPower: { type: String }, // Haa / Maya
    },

    // Section G: Challenges & Security
    sectionG: {
      mainTechChallenge: { type: String },
      otherTechChallenge: { type: String },
      onlineDataConcernLevel: { type: String },
      mainCloudConcern: { type: String },
      otherCloudConcern: { type: String },
    },

    // Section H: Business Needs & Adoption
    sectionH: {
      usefulCloudServices: [{ type: String }], // Checkboxes
      otherUsefulService: { type: String },
      cloudImpactOpinion: { type: String, trim: true }, // Open text
    },

    // Metadata
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SurveyResponse', SurveyResponseSchema);

// =====================================================
// SURVEY FORM - Full Somali Questionnaire (Sections A-H)
// Hormuud University - Cloud Computing Research 2026
// =====================================================
import { useState } from 'react';
import api from '../services/api';
import './SurveyForm.css';

// ---------- Survey Data Definitions ----------
const SECTIONS = [
  { id: 'A', label: 'Qaybta A', title: 'Astaanta Hay\'adda', subtitle: 'Organization Profile' },
  { id: 'B', label: 'Qaybta B', title: 'Wacyiga Cloud', subtitle: 'Cloud Awareness' },
  { id: 'C', label: 'Qaybta C', title: 'Isticmaalka Teknoloojiga', subtitle: 'Technology Usage' },
  { id: 'D', label: 'Qaybta D', title: 'Kaydinta Xogta', subtitle: 'Data Storage & Backup' },
  { id: 'E', label: 'Qaybta E', title: 'Qalab Cloud', subtitle: 'Cloud Tool Usage' },
  { id: 'F', label: 'Qaybta F', title: 'Kaabayaasha', subtitle: 'Infrastructure' },
  { id: 'G', label: 'Qaybta G', title: 'Caqabadaha & Amniga', subtitle: 'Challenges & Security' },
  { id: 'H', label: 'Qaybta H', title: 'Baahida Ganacsiga', subtitle: 'Business Needs & Adoption' },
];

const SECTORS = [
  'Cisbitaal / Rug caafimaad', 'Dukaanka tafaariiqda / Suuqa waaweyn',
  'Isgaarsiin / Lacagaha mobilada', 'Makhaayad / Kafee', 'Iskuul', 'Jaamacad',
  'Bangi / Hay\'ad maaliyadeed', 'Saadka / Gaadiidka', 'Hudheel / Martigelin',
  'Ganacsi elektaroonig ah / Ganacsi internet', 'Ganacsi yar iyo mid dhexe (SME)',
  'NGO / Hay\'ado aan faa\'iido doon ahayn', 'Warbaahin / Isgaarsiin',
  'Hanti ma-guurto ah', 'in Kale',
];

const ROLES = ['Milkiile', 'Maamule', 'Shaqaale IT', 'Xisaabiye', 'Maamule/Administrator', 'Kale'];
const EMPLOYEE_COUNTS = ['1-5', '6-10', '11-20', '21-50', 'In ka badan 50'];
const AWARENESS_LEVELS = ['Aad u sarreeya', 'Sarreeya', 'Dhexdhexaad', 'Hoose', 'Wacyi ma leh'];
const DEVICES = ['Kumbiyuutarrada desktop-ka', 'Laptop-yada', 'Taleefannada casriga ah', 'Tablet-yada', 'Printer-yada', 'Mashiinnada POS', 'Server-yada', 'Kale'];
const SYSTEMS = ['Softwares-ka xisaabaadka', 'Nidaamka maareynta kaydka', 'Nidaamka maareynta macaamiisha (CRM)', 'Nidaamka mushaharka / HR', 'Nidaamka maareynta iskuulka / isbitaalka', 'ERP', 'Midna', 'kuwa kale'];
const TECH_LEVELS = ['Aad u sarreeya', 'Sarreeya', 'Dhexdhexaad', 'Hoose', 'Aad u hooseeya'];
const MANUAL_TASKS = ['Diiwaangelinta xogta', 'Xisaabaadka', 'Diiwaannada macaamiisha', 'La socodka kaydka / stock-ka', 'Maareynta shaqaalaha', 'Diyaarinta warbixinaha', 'in kale'];
const STORAGE_METHODS = ['Warqado', 'Kumbiyuutar maxalli ah', 'USB / Flash drive', 'External hard drive', 'Ku keydinta Cloud-ka', 'Isku-dar kuwa kore'];
const BACKUP_FREQS = ['Maalinle', 'Toddobaadle', 'Bille', 'Marar dhif ah', 'Welligeed ma sameyn backup'];
const DATA_LOSS_CAUSES = ['hardware failure', 'Xatooyo', 'dab in uu ka kaco', 'Fayras / malware', 'Khalad bini\'aadan', 'Backup la\'aan', 'Weligeed lama kulmin lumis xog', 'Kale'];
const CONFIDENCE_LEVELS = ['Aad ugu kalsoon', 'waan ku kalsoonahay', 'Dhexdhexaad', 'kuma kalsoonin', 'Aad uguma kalsoonin'];
const CLOUD_TOOLS = ['Gmail / Outlook', 'Google Drive', 'Dropbox / OneDrive', 'Zoom / Microsoft Teams / Google Meet', 'WhatsApp Business', 'Software-da xisaabaadka ee online-ka ah', 'Midna', 'kuwa Kale'];
const IMPORTANCE_LEVELS = ['Aad ayuu muhiim iigu yahay', 'Muhiim', 'Dhexdhexaad', 'Wax yar muhiim', 'Muhiim ma aha'];
const USAGE_FREQS = ['in badan ayee isticmaashaa', 'Badanaa', 'Mararka qaar', 'Marar dhif ah', 'waligeed ma isticmaalin'];
const RELIABILITY_LEVELS = ['Isku halayn sare', 'Fiican', 'Dhexdhexaad', 'Liita', 'Aad u liita'];
const POWER_LEVELS = ['Aad u deggan', 'Deggan', 'Dhexdhexaad', 'Aan degganayn', 'Aad u aan degganayn'];
const TECH_CHALLENGES = ['Qiimaha / xawaaraha internetka oo sareeya', 'Dhibaatooyinka korontada', 'Yaraanta xirfadaha farsamada', 'Qiimaha sare ee nidaamyada', 'Welwel amni', 'Taageero la\'aanta maamulka', 'kuwa Kale'];
const CONCERN_LEVELS = ['Aad u welwel sanahay', 'Welwelsanahay', 'Dhexdhexaad', 'Wax yar ka welwel sanahay', 'Welwel ma qabo'];
const CLOUD_CONCERNS = ['Jabsasho / weerarro cyber ah', 'xogta oo aan asturneyn', 'Luminta xogta', 'Nidaamka oo hakad galo', 'Kalsooni la\'aan', 'kuwa Kale'];
const USEFUL_SERVICES = ['Kaydinta iyo backup-ka xogta', 'Nidaamka xisaabaadka', 'Nidaamka kaydka', 'Nidaamka maareynta macaamiisha', 'Nidaamka maareynta iskuulka / isbitaalka', 'Qalabka isgaarsiinta / wada shaqeynta', 'Kale'];

// ---------- Helper Components ----------
function RadioGroup({ name, options, value, onChange, error }) {
  return (
    <div className="options-group">
      {options.map((opt) => (
        <label key={opt} className={`option-item${value === opt ? ' selected' : ''}`}>
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          <span className="option-label">{opt}</span>
        </label>
      ))}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

function CheckboxGroup({ name, options, values, onChange, error }) {
  const handleChange = (opt) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };
  return (
    <div className="options-group">
      {options.map((opt) => (
        <label key={opt} className={`option-item${values.includes(opt) ? ' selected' : ''}`}>
          <input type="checkbox" name={name} value={opt} checked={values.includes(opt)} onChange={() => handleChange(opt)} />
          <span className="option-label">{opt}</span>
        </label>
      ))}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

// ---------- Initial Form State ----------
const INITIAL_STATE = {
  sectionA: { businessName: '', sector: '', otherSector: '', location: '', role: '', otherRole: '', employeeCount: '' },
  sectionB: { heardAboutCloud: '', awarenessLevel: '' },
  sectionC: { devicesUsed: [], otherDevice: '', useDigitalSystems: '', systemsUsed: [], otherSystem: '', techUsageLevel: '', manualTasks: [], otherManualTask: '' },
  sectionD: { storageMethod: [], backupFrequency: '', everLostData: '', dataLossCause: '', otherDataLossCause: '', storageConfidenceLevel: '' },
  sectionE: { usesCloudTools: '', cloudToolsUsed: [], otherCloudTool: '', cloudImportance: '', cloudUsageFrequency: '' },
  sectionF: { internetReliability: '', powerStability: '', hasBackupPower: '' },
  sectionG: { mainTechChallenge: '', otherTechChallenge: '', onlineDataConcernLevel: '', mainCloudConcern: '', otherCloudConcern: '' },
  sectionH: { usefulCloudServices: [], otherUsefulService: '', cloudImpactOpinion: '' },
};

// ---------- Main Component ----------
export default function SurveyForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Generic update helpers
  const updateSection = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    // Clear error on change
    setErrors((prev) => {
      const e = { ...prev };
      delete e[`${section}.${field}`];
      return e;
    });
  };

  // --- Section-level Validation ---
  const validateSection = (idx) => {
    const errs = {};
    if (idx === 0) {
      const { businessName, sector, location, role, employeeCount } = formData.sectionA;
      if (!businessName.trim()) errs['sectionA.businessName'] = 'Magaca ganacsiga ayaa loo baahan yahay.';
      if (!sector) errs['sectionA.sector'] = 'Fadlan dooro qaybta ganacsiga.';
      if (!location.trim()) errs['sectionA.location'] = 'Degmada ayaa loo baahan yahay.';
      if (!role) errs['sectionA.role'] = 'Fadlan dooro doorkaaga.';
      if (!employeeCount) errs['sectionA.employeeCount'] = 'Fadlan dooro tirada shaqaalaha.';
    }
    if (idx === 1) {
      if (!formData.sectionB.heardAboutCloud) errs['sectionB.heardAboutCloud'] = 'Fadlan dooro.';
      if (!formData.sectionB.awarenessLevel) errs['sectionB.awarenessLevel'] = 'Fadlan dooro heerka wacyiga.';
    }
    if (idx === 2) {
      if (formData.sectionC.devicesUsed.length === 0) errs['sectionC.devicesUsed'] = 'Fadlan dooro hal ama ka badan.';
      if (!formData.sectionC.useDigitalSystems) errs['sectionC.useDigitalSystems'] = 'Fadlan dooro.';
      if (!formData.sectionC.techUsageLevel) errs['sectionC.techUsageLevel'] = 'Fadlan dooro heerka.';
    }
    if (idx === 3) {
      if (formData.sectionD.storageMethod.length === 0) errs['sectionD.storageMethod'] = 'Fadlan dooro hal ama ka badan.';
      if (!formData.sectionD.backupFrequency) errs['sectionD.backupFrequency'] = 'Fadlan dooro.';
      if (!formData.sectionD.everLostData) errs['sectionD.everLostData'] = 'Fadlan dooro.';
      if (!formData.sectionD.storageConfidenceLevel) errs['sectionD.storageConfidenceLevel'] = 'Fadlan dooro.';
    }
    if (idx === 4) {
      if (!formData.sectionE.usesCloudTools) errs['sectionE.usesCloudTools'] = 'Fadlan dooro.';
      if (!formData.sectionE.cloudImportance) errs['sectionE.cloudImportance'] = 'Fadlan dooro muhiimadda.';
      if (!formData.sectionE.cloudUsageFrequency) errs['sectionE.cloudUsageFrequency'] = 'Fadlan dooro.';
    }
    if (idx === 5) {
      if (!formData.sectionF.internetReliability) errs['sectionF.internetReliability'] = 'Fadlan dooro.';
      if (!formData.sectionF.powerStability) errs['sectionF.powerStability'] = 'Fadlan dooro.';
      if (!formData.sectionF.hasBackupPower) errs['sectionF.hasBackupPower'] = 'Fadlan dooro.';
    }
    if (idx === 6) {
      if (!formData.sectionG.mainTechChallenge) errs['sectionG.mainTechChallenge'] = 'Fadlan dooro.';
      if (!formData.sectionG.onlineDataConcernLevel) errs['sectionG.onlineDataConcernLevel'] = 'Fadlan dooro.';
      if (!formData.sectionG.mainCloudConcern) errs['sectionG.mainCloudConcern'] = 'Fadlan dooro.';
    }
    if (idx === 7) {
      if (formData.sectionH.usefulCloudServices.length === 0) errs['sectionH.usefulCloudServices'] = 'Fadlan dooro hal ama ka badan.';
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateSection(currentSection);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setCurrentSection((p) => Math.min(p + 1, SECTIONS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setCurrentSection((p) => Math.max(p - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const errs = validateSection(currentSection);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/surveys', formData);
      setSubmitted(true);
    } catch {
      setSubmitError('Cilad ayaa dhacday. Fadlan mar kale isku day.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  // ---- Success Screen ----
  if (submitted) {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Mahadsanid!</h2>
          <p>Jawaabkaaga si guul leh ayaa loo keydiyey. Ka qaybgalkaagu waa muhiim cilmi-baarista.</p>
          <div style={{ background: '#F0FDF4', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#047857', fontWeight: 600, fontSize: '0.9rem' }}>
              🎓 Hormuud University - Cloud Computing Research 2026
            </p>
          </div>
          <button className="btn btn-primary btn-lg w-full" onClick={() => { setSubmitted(false); setFormData(INITIAL_STATE); setCurrentSection(0); }}>
            Jawaab kale bixi
          </button>
        </div>
      </div>
    );
  }

  const A = formData.sectionA;
  const B = formData.sectionB;
  const C = formData.sectionC;
  const D = formData.sectionD;
  const E = formData.sectionE;
  const F = formData.sectionF;
  const G = formData.sectionG;
  const H = formData.sectionH;

  return (
    <div className="survey-page">
      {/* Header */}
      <div className="survey-header">
        <div className="university-logo">H</div>
        <h1>Diyaargarowga, Caqabadaha, iyo Qaadashada Xisaabinta Cloud</h1>
        <p className="subtitle">ee Qaybaha Ganacsiga Soomaaliya</p>
        <p className="subtitle" style={{ opacity: 0.7 }}>HORMUUD UNIVERSITY · Kuliyyadda Sayniska Kombiyuutarka</p>
        <span className="date-tag">📅 Maajo 2026 · Macallinka: Yusuf Abas</span>
      </div>

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-info">
          <span>Qaybta {currentSection + 1} / {SECTIONS.length}: {SECTIONS[currentSection].title}</span>
          <span>{Math.round(progress)}% la dhammaystiiray</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="section-tabs">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`section-tab${i === currentSection ? ' active' : ''}${i < currentSection ? ' completed' : ''}`}
            onClick={() => { if (i < currentSection) { setCurrentSection(i); } }}
          >
            {i < currentSection ? '✓' : s.id}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="survey-card">
        <div className="section-header">
          <div className="section-badge">{SECTIONS[currentSection].id}</div>
          <div>
            <div className="section-title">{SECTIONS[currentSection].title}</div>
            <div className="section-subtitle">{SECTIONS[currentSection].subtitle}</div>
          </div>
        </div>

        {/* ====== SECTION A ====== */}
        {currentSection === 0 && (
          <div>
            <div className="confidentiality-box">
              ℹ️ <strong>Xogta lagu bixiyo su'aalahan</strong> waxaa loo ilaalin doonaa si qarsoodi ah waxaana loo isticmaali doonaa oo keliya cilmi-baaris akadeemiyadeed. Ka qaybgalka waa ikhtiyaari.
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">1</span>Magaca Ganacsiga / Hay'adda</p>
              <input className={`form-input${errors['sectionA.businessName'] ? ' error' : ''}`} placeholder="Magaca ganacsiga..." value={A.businessName} onChange={(e) => updateSection('sectionA', 'businessName', e.target.value)} />
              {errors['sectionA.businessName'] && <p className="form-error">{errors['sectionA.businessName']}</p>}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">2</span>Qaybta / Nooca Ganacsiga</p>
              <RadioGroup name="sector" options={SECTORS} value={A.sector} onChange={(v) => updateSection('sectionA', 'sector', v)} error={errors['sectionA.sector']} />
              {A.sector === 'in Kale' && (<input className="form-input mt-1" placeholder="Qeex qaybta..." value={A.otherSector} onChange={(e) => updateSection('sectionA', 'otherSector', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">3</span>Degmada / Goobta</p>
              <input className={`form-input${errors['sectionA.location'] ? ' error' : ''}`} placeholder="Degmada..." value={A.location} onChange={(e) => updateSection('sectionA', 'location', e.target.value)} />
              {errors['sectionA.location'] && <p className="form-error">{errors['sectionA.location']}</p>}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">4</span>Waa maxay doorkaaga Xaruntaan ama ganacsigan?</p>
              <RadioGroup name="role" options={ROLES} value={A.role} onChange={(v) => updateSection('sectionA', 'role', v)} error={errors['sectionA.role']} />
              {A.role === 'Kale' && (<input className="form-input mt-1" placeholder="Qeex doorkaaga..." value={A.otherRole} onChange={(e) => updateSection('sectionA', 'otherRole', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">5</span>Immisa shaqaale ah ayuu xaruntaan/ganacsigani leeyahay?</p>
              <RadioGroup name="empCount" options={EMPLOYEE_COUNTS} value={A.employeeCount} onChange={(v) => updateSection('sectionA', 'employeeCount', v)} error={errors['sectionA.employeeCount']} />
            </div>
          </div>
        )}

        {/* ====== SECTION B ====== */}
        {currentSection === 1 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">6</span>Hore ma u maqashay erayga "Cloud Computing"?</p>
              <RadioGroup name="heardCloud" options={['Haa', 'Maya']} value={B.heardAboutCloud} onChange={(v) => updateSection('sectionB', 'heardAboutCloud', v)} error={errors['sectionB.heardAboutCloud']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">7</span>Sidee ayaad u qiimeyn lahayd heerka wacyiga xaruntaada ee ku saabsan Cloud Computing?</p>
              <RadioGroup name="awarenessLevel" options={AWARENESS_LEVELS} value={B.awarenessLevel} onChange={(v) => updateSection('sectionB', 'awarenessLevel', v)} error={errors['sectionB.awarenessLevel']} />
            </div>
          </div>
        )}

        {/* ====== SECTION C ====== */}
        {currentSection === 2 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">9</span>Qalabkee ayay xaruntaada si maalinle ah u isticmaashaa? (Dooro dhammaan kuwa ku habboon)</p>
              <CheckboxGroup name="devices" options={DEVICES} values={C.devicesUsed} onChange={(v) => updateSection('sectionC', 'devicesUsed', v)} error={errors['sectionC.devicesUsed']} />
              {C.devicesUsed.includes('Kale') && (<input className="form-input mt-1" placeholder="Qeex qalab kale..." value={C.otherDevice} onChange={(e) => updateSection('sectionC', 'otherDevice', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">10</span>Hadda ma isticmaashaa xaruntaada software ama nidaamyo dijitaal ah?</p>
              <RadioGroup name="useDigital" options={['Haa', 'Maya']} value={C.useDigitalSystems} onChange={(v) => updateSection('sectionC', 'useDigitalSystems', v)} error={errors['sectionC.useDigitalSystems']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">11</span>Nidaamyada soo socda kee ayay xaruntaada hadda isticmaashaa? (Dooro dhammaan)</p>
              <CheckboxGroup name="systems" options={SYSTEMS} values={C.systemsUsed} onChange={(v) => updateSection('sectionC', 'systemsUsed', v)} />
              {C.systemsUsed.includes('kuwa kale') && (<input className="form-input mt-1" placeholder="Qeex nidaamka..." value={C.otherSystem} onChange={(e) => updateSection('sectionC', 'otherSystem', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">12</span>Sidee ayaad u qiimeyn lahayd heerka isticmaalka teknoolojiyadda ee xaruntaada?</p>
              <RadioGroup name="techLevel" options={TECH_LEVELS} value={C.techUsageLevel} onChange={(v) => updateSection('sectionC', 'techUsageLevel', v)} error={errors['sectionC.techUsageLevel']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">13</span>Hawlaha ganacsi kee ayaa weli inta badan gacanta lagu qabtaa? (Dooro dhammaan)</p>
              <CheckboxGroup name="manualTasks" options={MANUAL_TASKS} values={C.manualTasks} onChange={(v) => updateSection('sectionC', 'manualTasks', v)} />
              {C.manualTasks.includes('in kale') && (<input className="form-input mt-1" placeholder="Qeex hawsha..." value={C.otherManualTask} onChange={(e) => updateSection('sectionC', 'otherManualTask', e.target.value)} />)}
            </div>
          </div>
        )}

        {/* ====== SECTION D ====== */}
        {currentSection === 3 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">14</span>Halkee ayay xaruntaadu inta badan ku kaydisaa xogta muhiimka ah?</p>
              <CheckboxGroup name="storage" options={STORAGE_METHODS} values={D.storageMethod} onChange={(v) => updateSection('sectionD', 'storageMethod', v)} error={errors['sectionD.storageMethod']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">15</span>Intee jeer ayay xaruntaadu backup u samaysaa xogta muhiimka ah?</p>
              <RadioGroup name="backupFreq" options={BACKUP_FREQS} value={D.backupFrequency} onChange={(v) => updateSection('sectionD', 'backupFrequency', v)} error={errors['sectionD.backupFrequency']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">16</span>Xaruntaadu waligeed ma la kulantay xog lumis?</p>
              <RadioGroup name="lostData" options={['Haa', 'Maya']} value={D.everLostData} onChange={(v) => updateSection('sectionD', 'everLostData', v)} error={errors['sectionD.everLostData']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">17</span>Sababta ugu weyn ee luminta xogta</p>
              <RadioGroup name="dataLossCause" options={DATA_LOSS_CAUSES} value={D.dataLossCause} onChange={(v) => updateSection('sectionD', 'dataLossCause', v)} />
              {D.dataLossCause === 'Kale' && (<input className="form-input mt-1" placeholder="Sharax sababta..." value={D.otherDataLossCause} onChange={(e) => updateSection('sectionD', 'otherDataLossCause', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">18</span>Kalsooni intee la eg ayaad ku qabtaan habka aad hadda u keydisaan xogta?</p>
              <RadioGroup name="storageConf" options={CONFIDENCE_LEVELS} value={D.storageConfidenceLevel} onChange={(v) => updateSection('sectionD', 'storageConfidenceLevel', v)} error={errors['sectionD.storageConfidenceLevel']} />
            </div>
          </div>
        )}

        {/* ====== SECTION E ====== */}
        {currentSection === 4 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">19</span>Xaruntaada hadda ma isticmaashaa qalab online ah ama ku salaysan Cloud?</p>
              <RadioGroup name="usesCloud" options={['Haa, way isticmaashaa', 'Maya', 'Ma hubo']} value={E.usesCloudTools} onChange={(v) => updateSection('sectionE', 'usesCloudTools', v)} error={errors['sectionE.usesCloudTools']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">20</span>Qalabka Cloud-ka ama adeegyada online-ka ah kee ayay xaruntaada isticmaashaa? (Dooro dhammaan)</p>
              <CheckboxGroup name="cloudTools" options={CLOUD_TOOLS} values={E.cloudToolsUsed} onChange={(v) => updateSection('sectionE', 'cloudToolsUsed', v)} />
              {E.cloudToolsUsed.includes('kuwa Kale') && (<input className="form-input mt-1" placeholder="Qeex qalabka..." value={E.otherCloudTool} onChange={(e) => updateSection('sectionE', 'otherCloudTool', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">21</span>Intee in la eg ayuu muhiim kuu yahay in aad isticmaasho cloud apps?</p>
              <RadioGroup name="cloudImp" options={IMPORTANCE_LEVELS} value={E.cloudImportance} onChange={(v) => updateSection('sectionE', 'cloudImportance', v)} error={errors['sectionE.cloudImportance']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">22</span>Shaqada maalinlaha ah, intee in la eg ayee xaruntaada isticmaashaa Cloud apps?</p>
              <RadioGroup name="cloudUsage" options={USAGE_FREQS} value={E.cloudUsageFrequency} onChange={(v) => updateSection('sectionE', 'cloudUsageFrequency', v)} error={errors['sectionE.cloudUsageFrequency']} />
            </div>
          </div>
        )}

        {/* ====== SECTION F ====== */}
        {currentSection === 5 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">23</span>Heerkee ayuu gaarsiisan yahay isku halaynta adeegyada Internet ka ee xaruntaada?</p>
              <RadioGroup name="internet" options={RELIABILITY_LEVELS} value={F.internetReliability} onChange={(v) => updateSection('sectionF', 'internetReliability', v)} error={errors['sectionF.internetReliability']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">24</span>Inta lagu guda jiro shaqada xarunta, xasiloonida korontada intee in la eg ayee tahay?</p>
              <RadioGroup name="power" options={POWER_LEVELS} value={F.powerStability} onChange={(v) => updateSection('sectionF', 'powerStability', v)} error={errors['sectionF.powerStability']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">25</span>Xaruntaadu ma leedahay koronto kayd ah (generator ama solar)?</p>
              <RadioGroup name="backupPower" options={['Haa, way leedahay', 'Maya, malahan']} value={F.hasBackupPower} onChange={(v) => updateSection('sectionF', 'hasBackupPower', v)} error={errors['sectionF.hasBackupPower']} />
            </div>
          </div>
        )}

        {/* ====== SECTION G ====== */}
        {currentSection === 6 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">26</span>Waa maxay caqabadda ugu weyn ee ka hor istaagta xaruntaada inay horumariso isticmaalka teknoolojiyadda?</p>
              <RadioGroup name="challenge" options={TECH_CHALLENGES} value={G.mainTechChallenge} onChange={(v) => updateSection('sectionG', 'mainTechChallenge', v)} error={errors['sectionG.mainTechChallenge']} />
              {G.mainTechChallenge === 'kuwa Kale' && (<input className="form-input mt-1" placeholder="Qeex caqabadda..." value={G.otherTechChallenge} onChange={(e) => updateSection('sectionG', 'otherTechChallenge', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">27</span>Ku keydinta xogtaada ee internet ka, intee in la eg ayaad welwel ka qabtaa?</p>
              <RadioGroup name="concern" options={CONCERN_LEVELS} value={G.onlineDataConcernLevel} onChange={(v) => updateSection('sectionG', 'onlineDataConcernLevel', v)} error={errors['sectionG.onlineDataConcernLevel']} />
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">28</span>Waa maxay welwelka ugu weyn ee xaruntaada ka qabto nidaamyada Cloud-ka ama online-ka?</p>
              <RadioGroup name="cloudConcern" options={CLOUD_CONCERNS} value={G.mainCloudConcern} onChange={(v) => updateSection('sectionG', 'mainCloudConcern', v)} error={errors['sectionG.mainCloudConcern']} />
              {G.mainCloudConcern === 'kuwa Kale' && (<input className="form-input mt-1" placeholder="Qeex welwelka..." value={G.otherCloudConcern} onChange={(e) => updateSection('sectionG', 'otherCloudConcern', e.target.value)} />)}
            </div>
          </div>
        )}

        {/* ====== SECTION H ====== */}
        {currentSection === 7 && (
          <div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">29</span>Waa kuwee adeegyada Cloud-ka ee waxtar u leh xaruntaada? (Dooro dhammaan)</p>
              <CheckboxGroup name="usefulServices" options={USEFUL_SERVICES} values={H.usefulCloudServices} onChange={(v) => updateSection('sectionH', 'usefulCloudServices', v)} error={errors['sectionH.usefulCloudServices']} />
              {H.usefulCloudServices.includes('Kale') && (<input className="form-input mt-1" placeholder="Qeex adeegga..." value={H.otherUsefulService} onChange={(e) => updateSection('sectionH', 'otherUsefulService', e.target.value)} />)}
            </div>
            <div className="question-block">
              <p className="question-text"><span className="question-number">30</span>Ma isleedahay cloud computing waxweyn ayuu ka bedeli karaa xaruntaada?</p>
              <textarea className="form-textarea" placeholder="Raayigaaga ka bixi..." value={H.cloudImpactOpinion} onChange={(e) => updateSection('sectionH', 'cloudImpactOpinion', e.target.value)} rows={4} />
            </div>
            {submitError && <div className="alert alert-error">{submitError}</div>}
          </div>
        )}

        {/* Navigation */}
        <div className="survey-nav">
          <button className="btn btn-secondary" onClick={handleBack} disabled={currentSection === 0}>
            ← Kahor
          </button>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {currentSection + 1} / {SECTIONS.length}
          </span>
          {currentSection < SECTIONS.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Xiga →
            </button>
          ) : (
            <button className="btn btn-success btn-lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'La keydiyaa...' : '✓ Dir Jawaabta'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

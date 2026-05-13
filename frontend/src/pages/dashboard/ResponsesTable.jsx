// =====================================================
// RESPONSES TABLE
// Full data table with search, filter, export (Excel/PDF), delete
// =====================================================
import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SECTORS = [
  'all', 'Cisbitaal / Rug caafimaad', 'Dukaanka tafaariiqda / Suuqa waaweyn',
  'Isgaarsiin / Lacagaha mobilada', 'Makhaayad / Kafee', 'Iskuul', 'Jaamacad',
  'Bangi / Hay\'ad maaliyadeed', 'Saadka / Gaadiidka', 'Hudheel / Martigelin',
  'Ganacsi elektaroonig ah / Ganacsi internet', 'Ganacsi yar iyo mid dhexe (SME)',
  'NGO / Hay\'ado aan faa\'iido doon ahayn', 'Warbaahin / Isgaarsiin', 'Hanti ma-guurto ah',
];

export default function ResponsesTable() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch]   = useState('');
  const [sector, setSector]   = useState('all');
  const [location, setLocation] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [viewingResponse, setViewingResponse] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (sector !== 'all') params.sector = sector;
      if (location.trim()) params.location = location;
      if (search.trim()) params.search = search;
      const res = await api.get('/surveys', { params });
      setResponses(res.data.data);
      setPage(1);
    } catch {
      setError('Xogta la soo qaadi kari waayay.');
    } finally {
      setLoading(false);
    }
  }, [sector, location, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Ma hubtaa inaad tirtirto jawaabkan?')) return;
    setDeleting(true);
    try {
      await api.delete(`/surveys/${id}`);
      setResponses((prev) => prev.filter((r) => r._id !== id));
      setSelectedId(null);
    } catch {
      alert('Tirtirku wuu ku guul-darreystay.');
    } finally {
      setDeleting(false);
    }
  };

  // ---- EXPORT to Excel ----
  const exportExcel = () => {
    const rows = responses.map((r, i) => ({
      '#': i + 1,
      'Magaca Ganacsiga': r.sectionA?.businessName || '',
      'Sector': r.sectionA?.sector || '',
      'Degmada': r.sectionA?.location || '',
      'Doorka': r.sectionA?.role || '',
      'Shaqaalaha': r.sectionA?.employeeCount || '',
      'Wacyiga Cloud': r.sectionB?.awarenessLevel || '',
      'Ma Isticmaalaa Cloud': r.sectionE?.usesCloudTools || '',
      'Caqabadda Weyn': r.sectionG?.mainTechChallenge || '',
      'Internetka Reliability': r.sectionF?.internetReliability || '',
      'Koronto Stable': r.sectionF?.powerStability || '',
      'Taariikh': r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');
    XLSX.writeFile(wb, 'Hormuud_Cloud_Survey_Responses.xlsx');
  };

  // ---- EXPORT to PDF ----
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Hormuud University - Cloud Computing Survey Results', 14, 15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Diyaariyey: ${new Date().toLocaleDateString()} | Wadarta: ${responses.length} jawaab`, 14, 22);

    doc.autoTable({
      startY: 28,
      head: [['#', 'Ganacsi', 'Sector', 'Degmada', 'Doorka', 'Shaqaalaha', 'Wacyiga Cloud', 'Isticm. Cloud', 'Caqabadda', 'Taariikh']],
      body: responses.map((r, i) => [
        i + 1,
        (r.sectionA?.businessName || '').substring(0, 20),
        (r.sectionA?.sector || '').substring(0, 22),
        (r.sectionA?.location || '').substring(0, 14),
        r.sectionA?.role || '',
        r.sectionA?.employeeCount || '',
        r.sectionB?.awarenessLevel || '',
        r.sectionE?.usesCloudTools || '',
        (r.sectionG?.mainTechChallenge || '').substring(0, 20),
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      ]),
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 243, 255] },
    });

    doc.save('Hormuud_Cloud_Survey_Responses.pdf');
  };

  // Pagination
  const totalPages = Math.ceil(responses.length / PER_PAGE);
  const paginated  = responses.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const awarenessColor = (level) => {
    if (!level) return 'badge-info';
    if (level.includes('sarreeya') || level === 'Sarreeya') return 'badge-success';
    if (level === 'Dhexdhexaad') return 'badge-warning';
    if (level.includes('Hoose') || level.includes('ma leh')) return 'badge-danger';
    return 'badge-info';
  };

  const renderModal = () => {
    if (!viewingResponse) return null;
    const r = viewingResponse;
    const arrayToStr = (arr) => Array.isArray(arr) ? arr.join(', ') : arr;

    return (
      <div className="modal-overlay" onClick={() => setViewingResponse(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setViewingResponse(null)}>&times;</button>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Faahfaahinta Jawaabta</h2>

          <div className="detail-section">
            <div className="detail-title">Qaybta A: Macluumaadka Ganacsiga</div>
            <div className="detail-row"><div className="detail-label">Magaca Ganacsiga:</div><div className="detail-value">{r.sectionA?.businessName || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Qeybta Ganacsiga (Sector):</div><div className="detail-value">{r.sectionA?.sector || '—'} {r.sectionA?.otherSector ? `(${r.sectionA.otherSector})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Degmada uu ku yaalo:</div><div className="detail-value">{r.sectionA?.location || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Doorka aad ku leedahay:</div><div className="detail-value">{r.sectionA?.role || '—'} {r.sectionA?.otherRole ? `(${r.sectionA.otherRole})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Tirada shaqaalaha:</div><div className="detail-value">{r.sectionA?.employeeCount || '—'}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta B: Wacyiga Cloud Computing</div>
            <div className="detail-row"><div className="detail-label">Ma maqashay ereyga "Cloud Computing" ama "Kaydinta Daruurta" ka hor?</div><div className="detail-value">{r.sectionB?.heardAboutCloud || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Sidee ku qiyaasi lahayd heerka wacyigaaga ee ku saabsan Cloud Computing?</div><div className="detail-value">{r.sectionB?.awarenessLevel || '—'}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta C: Isticmaalka Tiknoolajiyada ee Hada</div>
            <div className="detail-row"><div className="detail-label">Aaladaha noocee ah ayuu ganacsigaagu u isticmaalaa hawlmaalmeedkiisa?</div><div className="detail-value">{arrayToStr(r.sectionC?.devicesUsed) || '—'} {r.sectionC?.otherDevice ? `(${r.sectionC.otherDevice})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Ma isticmaashaa nidaamyo dijitaal ah?</div><div className="detail-value">{r.sectionC?.useDigitalSystems || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Haddii aad isticmaasho, fadlan dooro nidaamyada aad isticmaasho:</div><div className="detail-value">{arrayToStr(r.sectionC?.systemsUsed) || '—'} {r.sectionC?.otherSystem ? `(${r.sectionC.otherSystem})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Sidee ku sifayn lahayd heerka isticmaalka tiknoolajiyada ee ganacsigaaga?</div><div className="detail-value">{r.sectionC?.techUsageLevel || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Waa kuwee hawlaha ganacsiga ee aad weli gacanta ku qabato (warqad iyo qalin)?</div><div className="detail-value">{arrayToStr(r.sectionC?.manualTasks) || '—'} {r.sectionC?.otherManualTask ? `(${r.sectionC.otherManualTask})` : ''}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta D: Kaydinta iyo Ilaalinta Xogta</div>
            <div className="detail-row"><div className="detail-label">Sida aad hadda u kaydiso xogta ganacsigaaga (Sida xisaabaadka, iibka)?</div><div className="detail-value">{arrayToStr(r.sectionD?.storageMethod) || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Intee in le'eg ayaad kayd (backup) ka samaysaa xogtaada muhiimka ah?</div><div className="detail-value">{r.sectionD?.backupFrequency || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Weligeed ma kaa luntay xog muhiim ah oo ganacsi?</div><div className="detail-value">{r.sectionD?.everLostData || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Maxaa sababay lumista xogtaas?</div><div className="detail-value">{r.sectionD?.dataLossCause || '—'} {r.sectionD?.otherDataLossCause ? `(${r.sectionD.otherDataLossCause})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Intee in le'eg ayaad ku kalsoon tahay qaabka aad hadda xogta u kaydiso?</div><div className="detail-value">{r.sectionD?.storageConfidenceLevel || '—'}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta E: Isticmaalka Aaladaha Cloud-ka</div>
            <div className="detail-row"><div className="detail-label">Ma isticmaashaa aalado ama adeegyo ku xiran Cloud-ka?</div><div className="detail-value">{r.sectionE?.usesCloudTools || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Aaladaha Cloud ee aad isticmaasho (haddii ay jiraan):</div><div className="detail-value">{arrayToStr(r.sectionE?.cloudToolsUsed) || '—'} {r.sectionE?.otherCloudTool ? `(${r.sectionE.otherCloudTool})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Intee in le'eg ayay aaladahan muhiim u yihiin ganacsigaaga?</div><div className="detail-value">{r.sectionE?.cloudImportance || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Intee in le'eg ayaad isticmaashaa adeegyada Cloud-ka?</div><div className="detail-value">{r.sectionE?.cloudUsageFrequency || '—'}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta F: Kaabayaasha iyo Helitaanka</div>
            <div className="detail-row"><div className="detail-label">Sidee u aragtaa kalsoonida (reliability) internet-ka aad isticmaasho?</div><div className="detail-value">{r.sectionF?.internetReliability || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Sidee u aragtaa xasiloonida (stability) korontada aad hesho?</div><div className="detail-value">{r.sectionF?.powerStability || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Ma leedahay koronto kayd ah (sida solar ama matoor)?</div><div className="detail-value">{r.sectionF?.hasBackupPower || '—'}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta G: Caqabadaha iyo Amniga</div>
            <div className="detail-row"><div className="detail-label">Waa maxay caqabadda ugu weyn ee kaa hortaagan adeegsiga tiknoolajiyada casriga ah?</div><div className="detail-value">{r.sectionG?.mainTechChallenge || '—'} {r.sectionG?.otherTechChallenge ? `(${r.sectionG.otherTechChallenge})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Intee in le'eg ayaad ka walaacsan tahay amniga xogtaada marka internetka la geliyo?</div><div className="detail-value">{r.sectionG?.onlineDataConcernLevel || '—'}</div></div>
            <div className="detail-row"><div className="detail-label">Maxaa ugu weyn ee kugu dhaliya walaac marka aad ka fikirto isticmaalka Cloud-ka?</div><div className="detail-value">{r.sectionG?.mainCloudConcern || '—'} {r.sectionG?.otherCloudConcern ? `(${r.sectionG.otherCloudConcern})` : ''}</div></div>
          </div>

          <div className="detail-section">
            <div className="detail-title">Qaybta H: Baahiyaha Ganacsiga iyo Aragtida Guud</div>
            <div className="detail-row"><div className="detail-label">Waa kuwee adeegyada Cloud-ka ee aad u malaynayso inay ugu waxtar badan yihiin ganacsigaaga?</div><div className="detail-value">{arrayToStr(r.sectionH?.usefulCloudServices) || '—'} {r.sectionH?.otherUsefulService ? `(${r.sectionH.otherUsefulService})` : ''}</div></div>
            <div className="detail-row"><div className="detail-label">Fikraddaada, Cloud Computing ma ka caawin karaa kobaca ganacsiyada yaryar iyo kuwa dhexe ee Soomaaliya?</div><div className="detail-value">{r.sectionH?.cloudImpactOpinion || '—'}</div></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Filters / Search Bar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">🔍 Raadi (Magaca Ganacsiga)</label>
            <input
              className="form-input"
              placeholder="Magaca ganacsiga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label">🏢 Sector</label>
            <select className="form-select" value={sector} onChange={(e) => setSector(e.target.value)}>
              {SECTORS.map((s) => <option key={s} value={s}>{s === 'all' ? 'Dhammaan Qeybaha' : s}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label className="form-label">📍 Degmada</label>
            <input
              className="form-input"
              placeholder="Degmada..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
            <button className="btn btn-success btn-sm" onClick={exportExcel} title="Export Excel">
              📊 Excel
            </button>
            <button className="btn btn-danger btn-sm" onClick={exportPDF} title="Export PDF">
              📄 PDF
            </button>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
          {loading ? 'Soo raraya...' : `${responses.length} jawaab la helay`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{page} / {totalPages}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>

      {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Magaca Ganacsiga</th>
                <th>Sector</th>
                <th>Degmada</th>
                <th>Doorka</th>
                <th>Shaqaalaha</th>
                <th>Wacyiga Cloud</th>
                <th>Isticm. Cloud</th>
                <th>Caqabadda</th>
                <th>Taariikh</th>
                <th>Falcelin</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr><td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Jawaab la heli waayo</td></tr>
              )}
              {paginated.map((r, i) => (
                <tr key={r._id} className={selectedId === r._id ? 'selected' : ''} onClick={() => setSelectedId(selectedId === r._id ? null : r._id)}>
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{r.sectionA?.businessName || '—'}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {(r.sectionA?.sector || '—').substring(0, 22)}
                    </span>
                  </td>
                  <td>{r.sectionA?.location || '—'}</td>
                  <td>{r.sectionA?.role || '—'}</td>
                  <td>{r.sectionA?.employeeCount || '—'}</td>
                  <td>
                    <span className={`badge ${awarenessColor(r.sectionB?.awarenessLevel)}`}>
                      {r.sectionB?.awarenessLevel || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${r.sectionE?.usesCloudTools === 'Haa, way isticmaashaa' ? 'badge-success' : 'badge-warning'}`}>
                      {r.sectionE?.usesCloudTools || '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.sectionG?.mainTechChallenge || '—'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      className="btn btn-info btn-sm"
                      title="Eeg Faahfaahinta"
                      onClick={(e) => { e.stopPropagation(); setViewingResponse(r); }}
                    >
                      👁️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      title="Tirtir"
                      disabled={deleting}
                      onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {renderModal()}
    </div>
  );
}

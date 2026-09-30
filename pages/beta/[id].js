import { BUG_TRANSITIONS, IDEA_TRANSITIONS, normalizeTriageUpdate, REPORT_RESOLUTIONS, REPORT_SEVERITIES } from '@kailauz/feedback-contracts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { formatSupportDate, SupportHead, SupportLogin, supportLabel, useSupportSession } from '../../lib/supportFeedback';

export default function SupportReportPage() {
  const router = useRouter();
  const support = useSupportSession();
  if (!support.session) return <><SupportHead /><SupportLogin error={support.error} loading={support.loading} onSubmit={support.signIn} /></>;
  if (!router.isReady || typeof router.query.id !== 'string') return <main className="supportPage"><SupportHead /><p className="supportState">Загружаем обращение…</p></main>;
  return <SupportReport key={`${support.session.user.id}:${router.query.id}`} support={support} reportId={router.query.id} />;
}

function SupportReport({ support, reportId }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [triage, setTriage] = useState({ status: '', severity: '', resolution: '', canonical_report_id: '', public_note: '', fixed_version: '' });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uncertainComment, setUncertainComment] = useState(false);
  const [verificationNote, setVerificationNote] = useState('');
  const locked = useRef(false);
  const commentAttempt = useRef(null);
  const requestId = useRef(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const setLoadedReport = useCallback(value => {
    setReport(value);
    setTriage({ status: value.status, severity: value.severity || '', resolution: value.resolution || '', canonical_report_id: value.canonical_report_id || '', public_note: '', fixed_version: value.fixed_version || '' });
  }, []);
  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const value = await support.client.getReport(reportId);
      if (mounted.current && currentRequest === requestId.current) { setLoadedReport(value); setError(''); }
    } catch (reason) { if (mounted.current && currentRequest === requestId.current) setError(reason.message); }
    finally { if (mounted.current && currentRequest === requestId.current) setLoading(false); }
  }, [reportId, support.client, setLoadedReport]);
  useEffect(() => {
    void load();
    return () => { requestId.current += 1; };
  }, [load]);
  const isStaff = support.session.user.app_metadata?.feedback_roles?.some(role => ['triager', 'developer', 'moderator', 'administrator'].includes(role));

  async function run(action) {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    try { await action(); if (mounted.current) await load(); }
    catch (reason) { if (mounted.current) setError(reason.message); }
    finally { locked.current = false; if (mounted.current) setBusy(false); }
  }
  function sendComment(event) {
    event.preventDefault();
    void run(async () => {
      if (!commentAttempt.current) commentAttempt.current = { body: comment.trim(), idempotency_key: `web:${crypto.randomUUID()}` };
      try {
        await support.client.addComment(report.id, commentAttempt.current);
        commentAttempt.current = null;
        if (mounted.current) { setComment(''); setUncertainComment(false); }
      } catch (reason) {
        const rejected = reason.status >= 400 && reason.status < 500 && ![408, 409, 429].includes(reason.status);
        if (rejected) commentAttempt.current = null;
        if (mounted.current) setUncertainComment(!rejected);
        throw reason;
      }
    });
  }
  function updateTriage(event) {
    event.preventDefault();
    void run(() => support.client.updateTriage(report.id, normalizeTriageUpdate({ ...triage, severity: triage.severity || null, resolution: triage.resolution || null, canonical_report_id: triage.resolution === 'duplicate' ? triage.canonical_report_id || null : null }, report)));
  }
  if (!report) return <main className="supportPage"><SupportHead /><Link className="supportBack" href="/beta">← Поддержка</Link><p className={error ? 'supportError' : 'supportState'} role={error ? 'alert' : 'status'}>{error || 'Загружаем обращение…'}</p>{error ? <button className="supportQuiet" disabled={loading} onClick={() => void load()}>Повторить</button> : null}</main>;
  const transitions = report.kind === 'bug' ? BUG_TRANSITIONS : IDEA_TRANSITIONS;

  return <main className="supportPage">
    <SupportHead /><Link className="supportBack" href="/beta">← Поддержка</Link>
    <header className="supportDetailHeader"><div><p className="supportEyebrow">ОБРАЩЕНИЕ #{report.public_number}</p><h1>{report.title}</h1></div><span className="supportPill">{supportLabel(report.status)}</span></header>
    <p className="supportPrivateNotice">Переписка доступна автору обращения и команде поддержки.</p>
    {report.fixed_version ? <p className="supportLead"><strong>Версия исправления:</strong> {report.fixed_version}</p> : null}
    {report.canonical_report_id ? <p className="supportPrivateNotice">Это обращение отмечено как дубликат.{isStaff ? <> <Link href={`/beta/${report.canonical_report_id}`}>Открыть основное обращение →</Link></> : null}</p> : null}
    {report.content ? <section className="supportDetailGrid">{Object.entries(report.content).map(([key, value]) => <article key={key}><strong>{supportLabel(key)}</strong>{Array.isArray(value) ? <ol>{value.map((item, index) => <li key={index}>{item}</li>)}</ol> : <p>{['frequency', 'impact'].includes(key) ? supportLabel(value) : String(value || '—')}</p>}</article>)}</section> : null}
    {report.viewer_can_verify ? <section className="supportTriage"><p className="supportEyebrow">ПРОВЕРКА ИСПРАВЛЕНИЯ</p><h2>Проблема действительно исправлена?</h2><div className="supportForm"><label>Что ты проверил<textarea disabled={busy} maxLength={1000} onChange={event => setVerificationNote(event.target.value)} value={verificationNote} /></label><div className="supportActions"><button className="supportPrimary" disabled={busy || verificationNote.trim().length < 4} onClick={() => void run(() => support.client.verifyFix(report.id, { outcome: 'fixed', note: verificationNote }))}>Да, исправлено</button><button className="supportQuiet" disabled={busy || verificationNote.trim().length < 4} onClick={() => void run(() => support.client.verifyFix(report.id, { outcome: 'still_broken', note: verificationNote }))}>Проблема осталась</button></div></div></section> : null}
    <section className="supportTimeline"><h2>История решений</h2>{(report.history || []).map(event => <article key={event.id}><span>{formatSupportDate(event.created_at)}</span><strong>{event.from_status ? `${supportLabel(event.from_status)} → ` : ''}{supportLabel(event.to_status)}</strong><p>{event.public_note}</p></article>)}</section>
    <section className="supportTimeline"><h2>Переписка</h2>{(report.comments || []).map(item => <article key={item.id}><strong>{item.author_alias || 'Участник'}</strong><span>{formatSupportDate(item.created_at)}</span><p>{item.body}</p></article>)}<form className="supportForm" onSubmit={sendComment}><label>Дополнение<textarea disabled={busy || uncertainComment} maxLength={2000} onChange={event => setComment(event.target.value)} required value={comment} /></label>{uncertainComment ? <p className="supportLead">Ответ не получен. Повторная отправка использует то же сообщение.</p> : null}<button className="supportPrimary" disabled={busy || comment.trim().length < 4} type="submit">{uncertainComment ? 'Повторить отправку' : 'Добавить'}</button></form></section>
    {isStaff ? <section className="supportTriage"><p className="supportEyebrow">КОМАНДА ПОДДЕРЖКИ</p><h2>Решение и классификация</h2><form className="supportForm" onSubmit={updateTriage}>
      <fieldset disabled={busy}>
        <label>Следующий статус<select onChange={event => setTriage({ ...triage, status: event.target.value })} value={triage.status}><option value={report.status}>{supportLabel(report.status)}</option>{(transitions[report.status] || []).map(value => <option key={value} value={value}>{supportLabel(value)}</option>)}</select></label>
        {report.kind === 'bug' ? <label>Серьёзность<select onChange={event => setTriage({ ...triage, severity: event.target.value })} value={triage.severity}><option value="">Не назначена</option>{REPORT_SEVERITIES.map(value => <option key={value} value={value}>{supportLabel(value)}</option>)}</select></label> : null}
        <label>Решение<select onChange={event => setTriage({ ...triage, resolution: event.target.value })} value={triage.resolution}><option value="">Пока не принято</option>{REPORT_RESOLUTIONS.map(value => <option key={value} value={value}>{supportLabel(value)}</option>)}</select></label>
        {triage.resolution === 'duplicate' ? <label>ID основного обращения<input onChange={event => setTriage({ ...triage, canonical_report_id: event.target.value })} required value={triage.canonical_report_id} /></label> : null}
        <label>Объяснение для автора<textarea maxLength={1000} onChange={event => setTriage({ ...triage, public_note: event.target.value })} required value={triage.public_note} /></label>
        <label>Версия исправления<input maxLength={120} onChange={event => setTriage({ ...triage, fixed_version: event.target.value })} value={triage.fixed_version} /></label>
      </fieldset>
      <button className="supportPrimary" disabled={busy || triage.public_note.trim().length < 4} type="submit">Сохранить решение</button>
    </form></section> : null}
    {error ? <p className="supportError" role="alert">{error}</p> : null}
    <button className="supportQuiet" disabled={busy || loading} onClick={() => void load()}>Обновить</button>
  </main>;
}

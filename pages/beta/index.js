import { BUG_STATUSES, IDEA_STATUSES } from '@kailauz/feedback-contracts';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { formatSupportDate, SupportHead, SupportLogin, supportLabel, useSupportSession } from '../../lib/supportFeedback';

export default function SupportPage() {
  const support = useSupportSession();
  if (!support.session) return <><SupportHead /><SupportLogin error={support.error} loading={support.loading} onSubmit={support.signIn} /></>;
  return <SupportRegistry key={support.session.user.id} support={support} />;
}

function SupportRegistry({ support }) {
  const [items, setItems] = useState([]);
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const staff = support.session.user.app_metadata?.feedback_roles?.some(role => ['triager', 'developer', 'moderator', 'administrator'].includes(role));
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const query = new URLSearchParams({ limit: '40', offset: String(offset), ...(kind !== 'all' ? { kind } : {}), ...(status !== 'all' ? { status } : {}) });
    support.client.listReports(query.toString())
      .then(data => { if (active) setItems(data.items || []); })
      .catch(reason => { if (active) { setError(reason.message); setItems([]); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [support.client, kind, status, offset, revision]);
  const statuses = kind === 'bug' ? BUG_STATUSES : kind === 'idea' ? IDEA_STATUSES : [...new Set([...BUG_STATUSES, ...IDEA_STATUSES])];
  return <main className="supportPage">
    <SupportHead />
    <header className="supportHeader"><div><p className="supportEyebrow">KAILAUZ SUPPORT</p><h1>Поддержка</h1><p className="supportLead">{staff ? 'Обращения пользователей и работа команды.' : 'Твои обращения, ответы команды и статус решения.'}</p></div><button className="supportQuiet" onClick={support.signOut}>Выйти</button></header>
    <section className="supportTimeline">
      <h2>{staff ? 'Обращения' : 'Мои обращения'}</h2>
      <div className="supportFilters" aria-label="Фильтры обращений">
        <select aria-label="Тип" onChange={event => { setKind(event.target.value); setStatus('all'); setOffset(0); }} value={kind}><option value="all">Все типы</option><option value="bug">Ошибки</option><option value="idea">Идеи</option></select>
        <select aria-label="Статус" onChange={event => { setStatus(event.target.value); setOffset(0); }} value={status}><option value="all">Все статусы</option>{statuses.map(value => <option key={value} value={value}>{supportLabel(value)}</option>)}</select>
        <button className="supportQuiet" disabled={loading} onClick={() => setRevision(value => value + 1)}>Обновить</button>
      </div>
      {error || support.error ? <p className="supportError" role="alert">{error || support.error}</p> : null}
      {loading ? <p className="supportState">Загружаем обращения…</p> : !items.length ? <p className="supportState">По этому фильтру обращений пока нет.</p> : <div className="supportTableWrap"><table className="supportTable">
        <thead><tr><th>ID</th><th>Тип</th><th>Название</th><th>Статус</th><th>Обновлено</th></tr></thead>
        <tbody>{items.map(item => <tr key={item.id}><td><Link href={`/beta/${item.id}`}>#{item.public_number}</Link></td><td>{item.kind === 'bug' ? 'Ошибка' : 'Идея'}</td><td><Link href={`/beta/${item.id}`}>{item.title}</Link></td><td><span className="supportPill">{supportLabel(item.status)}</span></td><td>{formatSupportDate(item.updated_at)}</td></tr>)}</tbody>
      </table></div>}
      <div className="supportActions"><button className="supportQuiet" disabled={loading || !offset} onClick={() => setOffset(value => Math.max(0, value - 40))}>Назад</button><button className="supportQuiet" disabled={loading || items.length < 40 || offset >= 10000} onClick={() => setOffset(value => value + 40)}>Далее</button></div>
    </section>
  </main>;
}

import { FeedbackClient } from '@kailauz/feedback-contracts';
import Head from 'next/head';
import { useMemo, useState } from 'react';

import { useAppSession } from './appSession';

const CORE_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/v1').replace(/\/$/, '');
const FEEDBACK_API_URL = (process.env.NEXT_PUBLIC_FEEDBACK_API_URL || 'http://localhost:3200').replace(/\/$/, '');

async function exchange(session) {
  const response = await fetch(`${CORE_API_URL}/auth/feedback-token`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${session.access_token}` },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.message || 'Не удалось открыть поддержку.');
    error.status = response.status;
    error.code = payload?.code;
    throw error;
  }
  return payload;
}

function feedbackClient(session) {
  let token;
  let expiresAt = 0;
  return new FeedbackClient({
    baseUrl: FEEDBACK_API_URL,
    getToken: async () => {
      if (token && expiresAt > Date.now() + 30_000) return token;
      const result = await exchange(session);
      token = result.token;
      expiresAt = Date.now() + result.expires_in * 1_000;
      return token;
    },
  });
}

export function useSupportSession() {
  const app = useAppSession();
  const client = useMemo(() => app.session ? feedbackClient(app.session) : null, [app.session]);
  return { ...app, client };
}

export function SupportLogin({ error, loading, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="supportPage supportCentered">
      <section className="supportLoginCard">
        <p className="supportEyebrow">KAILAUZ SUPPORT</p>
        <h1>Поддержка Kailauz</h1>
        <p className="supportLead">Войди тем же аккаунтом, которым пользуешься в приложении.</p>
        <form className="supportForm" onSubmit={(event) => { event.preventDefault(); onSubmit(email, password); }}>
          <label>Email<input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label>Пароль<input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          <button className="supportPrimary" disabled={loading} type="submit">{loading ? 'Входим…' : 'Войти'}</button>
        </form>
        {error ? <p className="supportError" role="alert">{error}</p> : null}
      </section>
    </main>
  );
}

export function SupportHead() {
  return <Head><title>Поддержка · Kailauz</title><meta content="noindex, nofollow, noarchive" name="robots" /></Head>;
}

export function supportLabel(value) {
  const labels = {
    submitted: 'Отправлено', triage: 'На разборе', needs_info: 'Нужны подробности', confirmed: 'Подтверждено', in_progress: 'В работе', fixed: 'Исправлено', verification: 'Проверка исправления', closed: 'Закрыто',
    new: 'Новое', considering: 'Рассматривается', planned: 'Запланировано', shipped: 'Выпущено', not_planned: 'Не запланировано',
    blocker: 'Блокирующая', critical: 'Критическая', major: 'Значительная', minor: 'Незначительная', cosmetic: 'Визуальная',
    always: 'Всегда', sometimes: 'Иногда', once: 'Один раз', cannot_reproduce: 'Не удаётся повторить',
    unusable: 'Приложением нельзя пользоваться', core_flow_broken: 'Основное действие не работает', workaround: 'Есть обходной путь', disruptive: 'Мешает пользоваться', visual: 'Внешний вид',
    duplicate: 'Дубликат', expected_behavior: 'Ожидаемое поведение', out_of_scope: 'За рамками продукта', will_not_fix: 'Не будет исправлено', private_security: 'Вопрос безопасности',
    attempted: 'Что ты делал', actual: 'Что произошло', expected: 'Что ожидалось', reproduction_steps: 'Как повторить', frequency: 'Частота', impact: 'Влияние',
    problem: 'Проблема', context: 'Когда возникает', current_workaround: 'Как решаешь сейчас', beneficiaries: 'Кому поможет', proposed_solution: 'Предлагаемое решение',
  };
  return labels[value] || String(value || '').replaceAll('_', ' ');
}

export function formatSupportDate(value) {
  const date = new Date(value);
  return value && Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat('ru', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : '—';
}

import { useEffect, useRef } from 'react';

import styles from '../styles/Landing.module.css';

const featuredCovers = ['mona', 'four-treasures', 'silkworm', 'personnel', 'algernon', 'coraline', 'klara', 'sharp-objects', 'hobbit'];
const importedCovers = [
  'hobbit', 'klara', 'mona', 'personnel', 'four-treasures',
  'piranesi', 'algernon', 'coraline', 'silkworm', 'sharp-objects',
];
const calendarRows = [
  [null, null, 'silkworm', null, 'personnel', 'algernon', null],
  [null, 'coraline', null, null, 'klara', 'sharp-objects', null],
  [null, 'hobbit', null, 'mona', null, 'four-treasures', null],
  [null, 'personnel', 'coraline', null, null, 'sharp-objects', null],
];
const axisPositions = [18, 26, 34, 78];

const copy = {
  ru: {
    storyTitle: 'Узнай, какой ты',
    storyAccent: 'читатель.',
    featuresTitle: 'Всё, что нужно читателю — в одном приложении.',
    featuresBody: 'Подборки, портрет вкуса, календарь чтения и вся библиотека — в одном месте.',
    weeklyLabel: 'Подборка недели',
    picks: [
      { cover: 'mona', title: 'Глаза Моны', author: 'Тома Шлессер', reason: 'Как «Клара и Солнце», твои 4,5', match: '92% совпадение' },
      { cover: 'four-treasures', title: 'Четыре сокровища неба', author: 'Дженни Тинхуэй Чжан', reason: 'Магреализм — твой жанр №2', match: '88% совпадение' },
    ],
    pickActions: ['Хочу', 'Прочитано', 'Не моё'],
    portraitLabel: 'Портрет читателя',
    archetypeLabel: 'Твой архетип',
    archetype: 'Кладоискательница',
    archetypeDescription: 'В книжном идёт сразу к нижней полке.',
    axes: [['Сердце', 'Разум'], ['Странник', 'Хранитель'], ['Классика', 'Новинки'], ['Хиты', 'Находки']],
    assistantLabel: 'ИИ-подбор',
    assistantPrompt: 'Хочу что-то атмосферное на зимние вечера',
    assistantAnswer: 'ИИ выбрал из твоих подборок',
    calendarLabel: 'Календарь чтения',
    calendarStats: [['6', 'книг за месяц'], ['1 940', 'страниц'], ['22', 'дня чтения']],
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    importLabel: 'Перенос библиотеки',
    importBody: 'Из LiveLib — по ссылке на профиль. Из Goodreads, StoryGraph и таблиц — через CSV.',
    importMethods: ['LiveLib', 'Goodreads', 'StoryGraph', 'Таблица'],
    signupTitle: 'Ранний доступ к',
    signupAccent: 'Kailauz',
    signupBody: 'Скоро на iOS и Android. Оставь почту — напишем, когда откроем ранний доступ.',
  },
  en: {
    storyTitle: 'Discover what kind of',
    storyAccent: 'reader you are.',
    featuresTitle: 'Everything a reader needs in one app.',
    featuresBody: 'Book picks, a portrait of your taste, a reading calendar, and your whole library in one place.',
    weeklyLabel: 'Weekly picks',
    picks: [
      { cover: 'piranesi', title: 'Piranesi', author: 'Susanna Clarke', reason: 'Like “Klara and the Sun” · your 4.5', match: '92% match' },
      { cover: 'four-treasures-en', title: 'Four Treasures of the Sky', author: 'Jenny Tinghui Zhang', reason: 'Magical realism — your #2 genre', match: '88% match' },
    ],
    pickActions: ['Want', 'Read', 'Not for me'],
    portraitLabel: 'Reader portrait',
    archetypeLabel: 'Your archetype',
    archetype: 'Treasure Hunter',
    archetypeDescription: 'Heads straight for the bottom shelf in a bookstore.',
    axes: [['Heart', 'Mind'], ['Wanderer', 'Keeper'], ['Classics', 'New releases'], ['Hits', 'Hidden gems']],
    assistantLabel: 'AI picks',
    assistantPrompt: 'I want something atmospheric for winter evenings',
    assistantAnswer: 'AI chose from your picks',
    calendarLabel: 'Reading calendar',
    calendarStats: [['6', 'books this month'], ['1,940', 'pages'], ['22', 'reading days']],
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    importLabel: 'Import your library',
    importBody: 'Use a profile link for LiveLib, or a CSV file for Goodreads, StoryGraph, and spreadsheets.',
    importMethods: ['LiveLib', 'Goodreads', 'StoryGraph', 'Spreadsheet'],
    signupTitle: 'Early access to',
    signupAccent: 'Kailauz',
    signupBody: 'Coming to iOS and Android. Leave your email and we’ll let you know when early access opens.',
  },
};

function Cover({ book, className, style }) {
  return (
    <img
      className={className}
      style={style}
      src={`/landing/covers/${book}.webp`}
      width="320"
      height="480"
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}

function WeeklyPicks({ t }) {
  return (
    <article className={`${styles.feature} ${styles.weekly}`}>
      <h3>{t.weeklyLabel}</h3>
      <div className={styles.picksPreview} data-scroll-reveal aria-hidden="true">
        {t.picks.map((book) => (
          <div className={styles.pick} key={book.cover}>
            <div className={styles.pickBook}>
              <Cover book={book.cover} />
              <div>
                <strong>{book.title}</strong>
                <p>{book.author}</p>
                <p className={styles.pickReason}>✦ {book.reason}</p>
                <p className={styles.pickMatch}>{book.match}</p>
              </div>
            </div>
            <div className={styles.pickActions}>
              {t.pickActions.map((action) => <span key={action}>{action}</span>)}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ReadingCalendar({ t }) {
  return (
    <article className={styles.feature}>
      <h3>{t.calendarLabel}</h3>
      <div className={styles.calendarStats}>
        {t.calendarStats.map(([value, label]) => (
          <div key={label}><b>{value}</b><span>{label}</span></div>
        ))}
      </div>
      <div className={styles.calendarGrid} data-scroll-reveal aria-hidden="true">
        {t.weekdays.map((day) => <span className={styles.weekday} key={day}>{day}</span>)}
        {calendarRows.flat().map((book, index) => (
          <span className={styles.calendarDay} key={index}>
            {book && <Cover book={book} style={{ '--delay': `${index * 23}ms` }} />}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function LandingSections({ lang, children }) {
  const t = copy[lang];
  const story = useRef(null);
  const features = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.dataset.arrived = 'true';
        observer.unobserve(target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

    observer.observe(story.current);
    features.current.querySelectorAll('[data-scroll-reveal]').forEach((group) => observer.observe(group));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.wrap}>
          <h2 id="story-title">{t.storyTitle} <em>{t.storyAccent}</em></h2>
        </div>
        <div className={styles.coverRibbon} ref={story} aria-hidden="true">
          {featuredCovers.map((book) => <Cover key={book} book={book} />)}
        </div>
      </section>

      <section className={styles.features} ref={features} aria-labelledby="features-title">
        <div className={styles.wrap}>
          <div className={styles.featuresHeader}>
            <h2 id="features-title">{t.featuresTitle}</h2>
            <p className={styles.sectionLead}>{t.featuresBody}</p>
          </div>
          <div className={styles.featureGrid}>
            <WeeklyPicks t={t} />
            <article className={`${styles.feature} ${styles.portrait}`} id="reader-portrait">
              <h3>{t.portraitLabel}</h3>
              <div className={styles.portraitPreview} aria-hidden="true">
                <p className={styles.sectionLabel}>{t.archetypeLabel}</p>
                <b>{t.archetype}</b>
                <q>{t.archetypeDescription}</q>
                {t.axes.map(([left, right], index) => (
                  <div className={styles.axis} data-favors={axisPositions[index] < 50 ? 'left' : 'right'} key={left}>
                    <span>{left}</span>
                    <i style={{ '--axis-position': `${axisPositions[index]}%` }} />
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className={`${styles.feature} ${styles.assistant}`}>
              <h3>{t.assistantLabel}</h3>
              <div className={styles.assistantPreview} aria-hidden="true">
                <p className={styles.prompt}>{t.assistantPrompt}</p>
                <div className={styles.answer} data-scroll-reveal>
                  {['algernon', 'sharp-objects', 'silkworm'].map((book) => <Cover key={book} book={book} />)}
                </div>
                <p className={styles.answerLabel}>✦ {t.assistantAnswer}</p>
              </div>
            </article>
            <ReadingCalendar t={t} />
            <article className={styles.feature} id="library-import">
              <h3>{t.importLabel}</h3>
              <p className={styles.featureBody}>{t.importBody}</p>
              <div className={styles.importCovers} data-scroll-reveal aria-hidden="true">
                {importedCovers.map((book, index) => <Cover key={book} book={book} style={{ '--delay': `${index * 45}ms` }} />)}
              </div>
              <ul className={styles.importMethods}>
                {t.importMethods.map((method, index) => (
                  <li key={method}><span aria-hidden="true">{['L', 'G', 'S', '≡'][index]}</span>{method}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.signup} aria-labelledby="signup-title">
        <div className={styles.wrap}>
          <h2 id="signup-title">{t.signupTitle} <em>{t.signupAccent}</em></h2>
          <p className={styles.sectionLead}>{t.signupBody}</p>
          {children}
        </div>
      </section>
    </>
  );
}

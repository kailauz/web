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
const calendarDays = calendarRows.flat();
const readingDays = calendarDays.filter(Boolean);
const monthlyBooks = new Set(readingDays).size;
const showcaseStamps = ['friday-the-13th', 'last-minute', 'lifted-a-brick', 'meet-the-assistant', 'dragon-path'];
const shelfCovers = [
  ['fiction-back', 'fiction-front'],
  ['reread-back', 'reread-front'],
];
const axisPositions = [18, 26, 34, 78];
const revealThresholds = Array.from({ length: 11 }, (_, index) => index / 10);

const copy = {
  ru: {
    storyTitle: 'Узнай, какой ты',
    storyAccent: 'читатель.',
    featuresTitle: 'Всё, что нужно — в одном приложении.',
    weeklyLabel: 'Подборка недели',
    picks: [
      { cover: 'mona', title: 'Глаза Моны', author: 'Тома Шлессер', reason: 'Как «Клара и Солнце», твои 4,5', match: '92% совпадение' },
      { cover: 'four-treasures', title: 'Четыре сокровища неба', author: 'Дженни Тинхуэй Чжан', reason: 'Магреализм — твой жанр №2', match: '88% совпадение' },
    ],
    pickActions: ['Хочу', 'Прочитано', 'Не моё'],
    shelvesLabel: 'Книжные полки',
    shelves: [['Любимая фантастика', '3 книги'], ['Перечитать', '5 книг']],
    portraitLabel: 'Портрет читателя',
    archetypeLabel: 'Твой архетип',
    archetype: 'Кладоискательница',
    archetypeDescription: 'В книжном идёт сразу к нижней полке.',
    axes: [['Сердце', 'Разум'], ['Странник', 'Хранитель'], ['Классика', 'Новинки'], ['Хиты', 'Находки']],
    assistantLabel: 'ИИ-подбор',
    assistantPrompt: 'Хочу что-то атмосферное на зимние вечера',
    assistantAnswer: 'ИИ подбирает книги из всего каталога по твоему вкусу',
    calendarLabel: 'Календарь чтения',
    pageTotal: '1 940',
    calendarLabels: ['книг за месяц', 'страниц', 'дней чтения'],
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    importLabel: 'Перенос библиотеки',
    importMethods: ['LiveLib', 'Goodreads', 'StoryGraph', 'Таблица'],
    achievementsLabel: 'Дневник достижений',
    signupTitle: 'Ранний доступ к',
    signupAccent: 'Kailauz',
    signupBody: 'Скоро на iOS и Android. Оставь почту — напишем, когда откроем ранний доступ.',
  },
  en: {
    storyTitle: 'Discover what kind of',
    storyAccent: 'reader you are.',
    featuresTitle: 'Everything you need in one app.',
    weeklyLabel: 'Weekly picks',
    picks: [
      { cover: 'piranesi', title: 'Piranesi', author: 'Susanna Clarke', reason: 'Like “Klara and the Sun” · your 4.5', match: '92% match' },
      { cover: 'four-treasures-en', title: 'Four Treasures of the Sky', author: 'Jenny Tinghui Zhang', reason: 'Magical realism — your #2 genre', match: '88% match' },
    ],
    pickActions: ['Want', 'Read', 'Not for me'],
    shelvesLabel: 'Bookshelves',
    shelves: [['Favorite sci-fi', '3 books'], ['Read again', '5 books']],
    portraitLabel: 'Reader portrait',
    archetypeLabel: 'Your archetype',
    archetype: 'Treasure Hunter',
    archetypeDescription: 'Heads straight for the bottom shelf in a bookstore.',
    axes: [['Heart', 'Mind'], ['Wanderer', 'Keeper'], ['Classics', 'New releases'], ['Hits', 'Hidden gems']],
    assistantLabel: 'AI picks',
    assistantPrompt: 'I want something atmospheric for winter evenings',
    assistantAnswer: 'AI picks books from the full catalog based on your taste',
    calendarLabel: 'Reading calendar',
    pageTotal: '1,940',
    calendarLabels: ['books this month', 'pages', 'reading days'],
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    importLabel: 'Import your library',
    importMethods: ['LiveLib', 'Goodreads', 'StoryGraph', 'Spreadsheet'],
    achievementsLabel: 'Achievement journal',
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
    <article className={styles.feature}>
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

function Bookshelves({ t }) {
  return (
    <article className={styles.feature}>
      <h3>{t.shelvesLabel}</h3>
      <ul className={styles.shelfList} data-scroll-reveal>
        {shelfCovers.map((covers, index) => {
          const [title, count] = t.shelves[index];
          return (
            <li key={title}>
              <div className={styles.shelfCovers} style={{ '--delay': `${index * 110}ms` }}>
                {covers.map((cover) => (
                  <img key={cover} src={`/landing/shelves/${cover}.webp`} width="192" height="288" alt="" loading="lazy" decoding="async" />
                ))}
              </div>
              <strong>{title}</strong>
              <span>{count}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function ReadingCalendar({ t }) {
  const stats = [monthlyBooks, t.pageTotal, readingDays.length];

  return (
    <article className={styles.feature}>
      <h3>{t.calendarLabel}</h3>
      <div className={styles.calendarStats}>
        {t.calendarLabels.map((label, index) => (
          <div key={label}><b>{stats[index]}</b><span>{label}</span></div>
        ))}
      </div>
      <div className={styles.calendarGrid} data-scroll-reveal aria-hidden="true">
        {t.weekdays.map((day) => <span className={styles.weekday} key={day}>{day}</span>)}
        {calendarDays.map((book, index) => (
          <span className={styles.calendarDay} key={index}>
            {book && <Cover book={book} style={{ '--delay': `${Math.floor(index / t.weekdays.length) * 100}ms` }} />}
          </span>
        ))}
      </div>
    </article>
  );
}

function StampJournal({ t }) {
  return (
    <article className={`${styles.feature} ${styles.achievements}`} id="achievements">
      <h3>{t.achievementsLabel}</h3>
      <div className={styles.stampList} data-scroll-reveal aria-hidden="true">
        {showcaseStamps.map((stamp, index) => (
          <img
            key={stamp}
            src={`/landing/stamps/${stamp}.webp`}
            width="320"
            height="480"
            alt=""
            loading="lazy"
            decoding="async"
            style={{ '--delay': `${index * 125}ms` }}
          />
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
      for (const { isIntersecting, boundingClientRect, intersectionRect, rootBounds, target } of entries) {
        const viewportHeight = rootBounds?.height ?? window.innerHeight;
        const visibleHeight = Math.min(boundingClientRect.height * .55, viewportHeight * .45);
        if (!isIntersecting || intersectionRect.height < visibleHeight) continue;

        target.dataset.motionState = 'playing';
        observer.unobserve(target);
      }
    }, { threshold: revealThresholds });

    const groups = [story.current, ...features.current.querySelectorAll('[data-scroll-reveal]')];
    groups.filter((group) => group.getBoundingClientRect().top >= window.innerHeight).forEach((group) => {
      group.dataset.motionState = 'waiting';
    });
    groups.forEach((group) => observer.observe(group));
    return () => {
      observer.disconnect();
      groups.forEach((group) => delete group.dataset.motionState);
    };
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
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureRow}>
              <div className={styles.featureColumn}>
                <WeeklyPicks t={t} />
                <Bookshelves t={t} />
              </div>
              <div className={styles.featureColumn}>
                <article className={styles.feature} id="reader-portrait">
                  <h3>{t.portraitLabel}</h3>
                  <div className={styles.portraitPreview} aria-hidden="true">
                    <p className={styles.sectionLabel}>{t.archetypeLabel}</p>
                    <b>{t.archetype}</b>
                    <q>{t.archetypeDescription}</q>
                    <div className={styles.axes} data-scroll-reveal>
                      {t.axes.map(([left, right], index) => (
                        <div className={styles.axis} data-favors={axisPositions[index] < 50 ? 'left' : 'right'} key={left}>
                          <span>{left}</span>
                          <i>
                            <span
                              className={styles.axisMarker}
                              style={{ '--axis-position': `${axisPositions[index]}%`, '--delay': `${index * 85}ms` }}
                            />
                          </i>
                          <span>{right}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
                <article className={styles.feature}>
                  <h3>{t.assistantLabel}</h3>
                  <div className={styles.assistantPreview} aria-hidden="true">
                    <p className={styles.prompt}>{t.assistantPrompt}</p>
                    <div className={styles.answer} data-scroll-reveal>
                      {['algernon', 'sharp-objects', 'silkworm'].map((book) => <Cover key={book} book={book} />)}
                    </div>
                    <p className={styles.answerLabel}>✦ {t.assistantAnswer}</p>
                  </div>
                </article>
              </div>
            </div>
            <div className={styles.featureRow}>
              <ReadingCalendar t={t} />
              <div className={styles.featureColumn}>
                <article className={styles.feature} id="library-import">
                  <h3>{t.importLabel}</h3>
                  <div className={styles.importCovers} data-scroll-reveal aria-hidden="true">
                    {importedCovers.map((book, index) => <Cover key={book} book={book} style={{ '--delay': `${index * 45}ms` }} />)}
                  </div>
                  <ul className={styles.importMethods}>
                    {t.importMethods.map((method, index) => (
                      <li key={method}><span aria-hidden="true">{['L', 'G', 'S', '≡'][index]}</span>{method}</li>
                    ))}
                  </ul>
                </article>
                <StampJournal t={t} />
              </div>
            </div>
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

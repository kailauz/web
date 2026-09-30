import styles from '../styles/Landing.module.css';

// Static product illustration, using the mobile app's artwork and Ionicons.
// It deliberately has no interactive controls or connection to account data.
const glyphs = {
  sparkle: 62861, notes: 62732, heart: 62327, stats: 62876, settings: 62828,
  home: 62339, library: 62390, calendar: 61910, profile: 62629,
  chevron: 62011, add: 61699, wifi: 63025, battery: 61831, signal: 61960,
};

function Icon({ name }) {
  return <span className={styles.icon} aria-hidden="true">{String.fromCodePoint(glyphs[name])}</span>;
}

const copy = {
  ru: {
    alt: 'Профиль в приложении kailauz: читательский портрет, вкус в книгах и личное пространство.',
    eyebrow: 'ПОРТРЕТ В КНИГАХ',
    title: 'Тот, кому важно докопаться до сути',
    body: 'Ты любишь книги, после которых хочется остановиться и пересобрать собственное понимание. Тебе мало готового ответа.',
    more: 'Подробнее о портрете →',
    taste: 'Вкус в деталях',
    empty: 'Детали появятся вместе с книгами и твоими реакциями.',
    space: 'Пространство профиля',
    rows: [
      ['notes', 'Мои заметки', 'Цитаты, мысли и впечатления'],
      ['heart', 'Избранное', 'Любимые книги и цитаты'],
      ['stats', 'Статистика', 'Ритм чтения и достижения'],
      ['settings', 'Настройки', 'Язык, данные и приватность'],
    ],
    tabs: ['Главная', 'Библиотека', 'Добавить', 'Календарь', 'Профиль'],
  },
  en: {
    alt: 'A kailauz mobile profile showing a reader portrait, reading taste and personal space.',
    eyebrow: 'A PORTRAIT IN BOOKS',
    title: 'Someone who wants to get to the heart of things',
    body: 'You love books that make you pause and rethink what you know. A ready-made answer is never quite enough.',
    more: 'More about your portrait →',
    taste: 'Your taste in detail',
    empty: 'Details will emerge with your books and reactions.',
    space: 'Your personal space',
    rows: [
      ['notes', 'My notes', 'Quotes, thoughts and impressions'],
      ['heart', 'Favourites', 'Favourite books and quotes'],
      ['stats', 'Statistics', 'Reading rhythm and achievements'],
      ['settings', 'Settings', 'Language, data and privacy'],
    ],
    tabs: ['Home', 'Library', 'Add', 'Calendar', 'Profile'],
  },
};

export default function ProfilePreview({ lang }) {
  const t = copy[lang];
  return (
    <div className={styles.phone} role="img" aria-label={t.alt}>
      <div className={styles.phoneScreen} aria-hidden="true">
        <div className={styles.phoneStatus}>
          <span>9:41</span>
          <span className={styles.phoneIsland} />
          <span className={styles.phoneIndicators}><Icon name="signal" /><Icon name="wifi" /><Icon name="battery" /></span>
        </div>
        <div className={styles.profileContent}>
          <p className={styles.profileEyebrow}>{t.eyebrow}</p>
          <div className={styles.portrait}>
            <span className={styles.portraitSparkle}><Icon name="sparkle" /></span>
            <span className={styles.portraitArtwork} />
            <div className={styles.portraitCopy}>
              <p className={styles.portraitTitle}>{t.title}</p>
              <p className={styles.portraitBody}>{t.body}</p>
              <p className={styles.portraitMore}>{t.more}</p>
            </div>
          </div>
          <p className={styles.profileHeading}>{t.taste}</p>
          <div className={styles.tasteCard}>{t.empty}</div>
          <p className={styles.profileHeading}>{t.space}</p>
          <div className={styles.profileMenu}>
            {t.rows.map(([icon, title, description]) => (
              <div className={styles.profileRow} key={icon}>
                <Icon name={icon} />
                <div><p>{title}</p><span>{description}</span></div>
                <Icon name="chevron" />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.phoneTabs}>
          {['home', 'library', 'add', 'calendar', 'profile'].map((icon, index) => (
            <div key={icon} className={icon === 'profile' ? styles.selectedTab : undefined}>
              <span className={icon === 'add' ? styles.addTab : undefined}><Icon name={icon} /></span>
              <span>{t.tabs[index]}</span>
            </div>
          ))}
        </div>
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
}

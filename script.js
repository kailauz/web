const copy = {
  en: {
    navWaitlist: "Waiting list",
    label: "Reading app",
    title: "kailauz helps you keep track of books and get better recommendations.",
    description:
      "A new reading app for people who want to remember what they read, understand their taste, and choose the next book more consciously.",
    platforms: "Coming to iOS and Android.",
    waitlistLabel: "Email",
    waitlistButton: "Join the waiting list",
    waitlistCaption: "We will only write when early access becomes available.",
    waitlistSuccess:
      "You are on the waiting list. We will email you when early access opens.",
    waitlistError: "Please enter a valid email."
  },
  ru: {
    navWaitlist: "Список ожидания",
    label: "Приложение для чтения",
    title: "kailauz поможет вести список книг и получать более точные рекомендации.",
    description:
      "Новое приложение для тех, кто хочет помнить прочитанное, лучше понимать свой вкус и осознанно выбирать следующую книгу.",
    platforms: "Скоро на iOS и Android.",
    waitlistLabel: "Email",
    waitlistButton: "Записаться в список ожидания",
    waitlistCaption: "Напишем только тогда, когда откроем ранний доступ.",
    waitlistSuccess:
      "Вы в списке ожидания. Напишем, когда откроем ранний доступ.",
    waitlistError: "Введите корректный email."
  }
};

const params = new URLSearchParams(window.location.search);
const initialLang = params.get("lang") === "ru" ? "ru" : "en";

function setLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-copy]").forEach((node) => {
    const key = node.getAttribute("data-copy");
    if (copy[lang][key]) {
      node.textContent = copy[lang][key];
    }
  });

  document.querySelectorAll("[data-lang-switch]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-lang-switch") === lang);
  });

  document.title =
    lang === "ru"
      ? "kailauz — приложение для чтения и рекомендаций"
      : "kailauz — reading app with AI recommendations";

  document
    .querySelector('meta[name="description"]')
    .setAttribute(
      "content",
      lang === "ru"
        ? "kailauz — приложение для чтения на iOS и Android. Помогает вести книги, понимать свой вкус и получать более точные рекомендации."
        : "kailauz is a reading app for iOS and Android. Track books, understand your reading taste, and get better recommendations. Join the waiting list."
    );

  const nextUrl = new URL(window.location.href);
  if (lang === "ru") {
    nextUrl.searchParams.set("lang", "ru");
  } else {
    nextUrl.searchParams.delete("lang");
  }
  window.history.replaceState({}, "", nextUrl);
  localStorage.setItem("kailauz-lang", lang);
}

document.querySelectorAll("[data-lang-switch]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.getAttribute("data-lang-switch")));
});

setLanguage(localStorage.getItem("kailauz-lang") || initialLang);

const waitlistForm = document.getElementById("waitlist-form");
const statusNode = document.getElementById("form-status");

waitlistForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const lang = document.documentElement.lang === "ru" ? "ru" : "en";
  const formData = new FormData(waitlistForm);
  const email = String(formData.get("email") || "").trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  statusNode.className = "status";

  if (!emailValid) {
    statusNode.textContent = copy[lang].waitlistError;
    statusNode.classList.add("is-error");
    return;
  }

  try {
    const endpoint = window.KAILAUZ_WAITLIST_ENDPOINT || '/api/waitlist';

    if (endpoint) {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source: "landing" })
      });
    }

    waitlistForm.reset();
    statusNode.textContent = copy[lang].waitlistSuccess;
    statusNode.classList.add("is-success");
  } catch (error) {
    statusNode.textContent = copy[lang].waitlistError;
    statusNode.classList.add("is-error");
  }
});

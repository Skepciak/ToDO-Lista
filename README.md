# ✅ ToDo Lista

Nowoczesna aplikacja do zarządzania zadaniami z funkcjami współpracy zespołowej, inspirowana Trello.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)

## ✨ Funkcje

### 📝 Zarządzanie zadaniami
- Tworzenie, edycja i usuwanie zadań
- Priorytety (wysoki 🔴, średni 🟡, niski 🟢)
- Terminy wykonania z datepicker
- Kategorie z kolorami
- Podzadania (subtasks)
- Drag & Drop do zmiany kolejności

### 👥 Współpraca (Trello-style)
- **Tablice współdzielone** - twórz tablice projektów
- **Zaproszenia email** - zapraszaj członków przez email
- **Role** - właściciel, admin, członek, widz
- Wspólne zadania na tablicach

### 🔐 Autentykacja
- Rejestracja i logowanie (email + hasło)
- **Google OAuth** - logowanie przez Google
- Panel administratora (`/admin`)

### 📅 Integracje
- **Google Calendar** - synchronizacja zadań w czasie rzeczywistym
- **Apple Calendar** - eksport do formatu iCal (.ics)
- Export do **JSON** i **CSV**

### 🎨 UX/UI
- **Tryb ciemny** - automatyczny lub ręczny
- Responsywny design
- Animacje i micro-interactions
- Wyszukiwanie zadań

### 🔔 Powiadomienia
- Powiadomienia przeglądarkowe
- Przypomnienia o terminach

## 🚀 Szybki start

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja

```bash
# Klonuj repozytorium
git clone https://github.com/Skepciak/ToDO-Lista.git
cd ToDO-Lista

# Zainstaluj zależności
npm install

# Skonfiguruj bazę danych
npx prisma db push

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja dostępna na: http://localhost:3000

## ⚙️ Konfiguracja

Utwórz plik `.env` w głównym katalogu:

```env
# Wymagane
NEXTAUTH_SECRET=wygeneruj-losowy-ciag-32-znakow
NEXTAUTH_URL=http://localhost:3000

# Opcjonalne - Google OAuth (logowanie + kalendarz)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx

# Opcjonalne - Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj@email.com
SMTP_PASS=haslo-aplikacji
```

### Generowanie NEXTAUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Konfiguracja Google OAuth

1. Wejdź na [Google Cloud Console](https://console.cloud.google.com)
2. Utwórz projekt i włącz Google Calendar API
3. Utwórz OAuth 2.0 credentials
4. Dodaj URI przekierowania: `http://localhost:3000/api/auth/callback/google`
5. Skopiuj Client ID i Secret do `.env`

## 📁 Struktura projektu

```
src/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── auth.ts       # Rejestracja/logowanie
│   │   ├── board.ts      # Tablice i zaproszenia
│   │   ├── calendar.ts   # Apple Calendar export
│   │   ├── export.ts     # JSON/CSV export + statystyki
│   │   ├── googleCalendar.ts  # Google Calendar sync
│   │   └── todo.ts       # CRUD zadań
│   ├── admin/            # Panel administratora
│   ├── api/auth/         # NextAuth API routes
│   ├── boards/           # Tablice współdzielone
│   │   ├── [id]/         # Szczegóły tablicy
│   │   └── join/[token]/ # Akceptacja zaproszeń
│   ├── login/            # Strona logowania
│   ├── register/         # Strona rejestracji
│   └── stats/            # Dashboard statystyk
├── components/           # 21 komponentów React
│   ├── AuthButtons.tsx
│   ├── CreateBoardForm.tsx
│   ├── GoogleCalendarSync.tsx
│   ├── SortableTodoList.tsx
│   ├── ThemeProvider.tsx
│   └── ...
├── lib/
│   └── prisma.ts         # Prisma client singleton
├── types/
│   └── next-auth.d.ts    # TypeScript types
└── auth.ts               # NextAuth configuration
```

## 🛠️ Technologie

| Kategoria | Technologia |
|-----------|-------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Baza danych | SQLite + Prisma ORM |
| Autentykacja | NextAuth.js v5 (beta) |
| Drag & Drop | @dnd-kit |
| Język | TypeScript 5 |

## 📊 Modele danych

```prisma
User          # Użytkownicy z rolami
Board         # Tablice współdzielone
BoardMember   # Członkostwo w tablicach
BoardInvite   # Zaproszenia email
Todo          # Zadania z priorytetami
Category      # Kategorie z kolorami
```

## 🧪 Komendy

```bash
npm run dev      # Serwer deweloperski
npm run build    # Build produkcyjny
npm run start    # Uruchom produkcję
npm run lint     # Sprawdź linting

npx prisma studio       # GUI bazy danych
npx prisma db push      # Synchronizuj schemat
npx prisma generate     # Generuj typy
```

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch (`git checkout -b feature/nowa-funkcja`)
3. Commit zmiany (`git commit -m 'Dodano nową funkcję'`)
4. Push (`git push origin feature/nowa-funkcja`)
5. Otwórz Pull Request

## 📄 Licencja

MIT License - możesz używać, modyfikować i dystrybuować.

---

Zbudowane z ❤️ przy użyciu Next.js i Prisma

# ToDo Lista 📝

Nowoczesna aplikacja webowa do zarządzania listą zadań, zbudowana z wykorzystaniem **Next.js 14**, **TypeScript**, **Tailwind CSS** i **Prisma**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)

## ✨ Funkcje

- ✅ **Dodawanie zadań** - Szybkie tworzenie nowych zadań
- ✅ **Oznaczanie jako wykonane** - Wizualne oznaczenie ukończonych zadań
- ✅ **Usuwanie zadań** - Łatwe usuwanie niepotrzebnych zadań
- ✅ **Filtrowanie** - Przeglądaj wszystkie, aktywne lub zakończone zadania
- ✅ **Responsywność** - Działa na wszystkich urządzeniach
- ✅ **Server Actions** - Nowoczesna obsługa logiki serwerowej

## 🛠️ Technologie

- **Framework**: Next.js 14 (App Router)
- **Język**: TypeScript
- **Stylowanie**: Tailwind CSS
- **Baza danych**: SQLite
- **ORM**: Prisma

## 🚀 Uruchomienie projektu

### Wymagania

- Node.js 18+ 
- npm lub yarn

### Instalacja

1. **Sklonuj repozytorium**
   ```bash
   git clone https://github.com/Skepciak/ToDO-Lista.git
   cd ToDO-Lista
   ```

2. **Zainstaluj zależności**
   ```bash
   npm install
   ```

3. **Skonfiguruj bazę danych**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Uruchom serwer deweloperski**
   ```bash
   npm run dev
   ```

5. **Otwórz aplikację**
   
   Przejdź do [http://localhost:3000](http://localhost:3000)

## 📁 Struktura projektu

```
├── prisma/
│   └── schema.prisma      # Schema bazy danych
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── todo.ts    # Server Actions (CRUD)
│   │   ├── globals.css    # Style globalne
│   │   ├── layout.tsx     # Layout główny
│   │   └── page.tsx       # Strona główna
│   ├── components/
│   │   ├── AddTodoForm.tsx   # Formularz dodawania
│   │   ├── FilterTabs.tsx    # Zakładki filtrowania
│   │   ├── TodoItem.tsx      # Pojedyncze zadanie
│   │   └── TodoList.tsx      # Lista zadań
│   └── lib/
│       └── prisma.ts      # Prisma Client singleton
└── README.md
```

## 🔧 Server Actions

Aplikacja wykorzystuje Next.js Server Actions do obsługi operacji na danych:

| Akcja | Opis |
|-------|------|
| `getTodos(filter)` | Pobiera zadania z opcjonalnym filtrem |
| `createTodo(formData)` | Tworzy nowe zadanie |
| `toggleTodo(id)` | Przełącza status zadania |
| `deleteTodo(id)` | Usuwa zadanie |

## 📝 Licencja

MIT License - możesz swobodnie używać tego projektu.

---

Wykonane z ❤️ przez [Skepciak](https://github.com/Skepciak)

# Konfiguracja Powiadomień Email i SMS

## Email (Gmail SMTP)

Aby włączyć powiadomienia email, utwórz plik `.env` w głównym katalogu projektu:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=twoj.email@gmail.com
SMTP_PASS=haslo-aplikacji-google
EMAIL_FROM=twoj.email@gmail.com
EMAIL_TO=twoj.email@gmail.com
```

### Jak uzyskać hasło aplikacji Google:
1. Zaloguj się na swoje konto Google
2. Wejdź na: https://myaccount.google.com/apppasswords
3. Wybierz "Inna" i wpisz np. "ToDo Lista"
4. Skopiuj wygenerowane hasło do `SMTP_PASS`

## SMS (Twilio - opcjonalne)

Aby włączyć powiadomienia SMS:
1. Zarejestruj się na https://www.twilio.com (darmowe konto testowe)
2. Skopiuj dane do `.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_TO_NUMBER=+48123456789
```

## Apple Calendar

Eksport do Apple Calendar działa automatycznie - kliknij przycisk "🍎 Apple Calendar" w stopce aplikacji. Plik `.ics` zostanie pobrany i można go otworzyć w:
- Apple Calendar (macOS/iOS)
- Google Calendar
- Outlook
- Dowolnej aplikacji obsługującej format iCal

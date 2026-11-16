# Praktikums-Coding-Aufgabe – Task Tracker

Willkommen und danke für dein Interesse an einem Praktikum bei uns!

In dieser Aufgabe übernimmst du eine kleine, **bestehende** Webanwendung. Es ist ein einfacher Task Tracker, den
ein Kollege vor seinen Ferien angefangen hat. Die App läuft, aber die Benutzerinnen und Benutzer melden Probleme,
und eine Funktion fehlt noch.

Du musst nichts von Grund auf neu bauen. Wir möchten sehen, wie du **fremden Code liest, verstehst, debuggst und
erweiterst**. Genau das macht den grössten Teil der täglichen Arbeit in einem Projekt aus.

---

## Die Anwendung

| Teil               | Technologie                                                                   |
| ------------------ | ----------------------------------------------------------------------------- |
| Frontend           | React + Vite (`frontend/`)                                                    |
| Backend – Option 1 | Node.js + Express + Mongoose (`backend-node/`)                                |
| Backend – Option 2 | Python + FastAPI + PyMongo (`backend-python/`)                                |
| Datenbank          | MongoDB. Startet automatisch **im Arbeitsspeicher**, keine Installation nötig |
| API-Vertrag        | `api/openapi.yaml`                                                            |
| Testdaten          | `seed/tasks.json` (30 Tasks, werden beim Start automatisch geladen)           |

### ➜ Wähle EIN Backend

Beide Backends machen genau dasselbe und enthalten dieselben Probleme. Wähle die Sprache, mit der du dich
wohler fühlst, und **arbeite nur an diesem Backend**. Lass den anderen Ordner unverändert oder lösche ihn.

Der **API-Vertrag in `api/openapi.yaml` ist verbindlich**. Das Frontend verlässt sich darauf, und wir testen dein
Backend dagegen.

---

## Setup

### Voraussetzungen

- **Node.js 20 oder neuer** (wird immer gebraucht, für das Frontend): <https://nodejs.org>
- **Nur für das Python-Backend:** Python **3.11 oder neuer**
- Git (empfohlen, aber nicht zwingend)

Du brauchst **weder** Docker **noch** eine MongoDB-Installation. Beim ersten Start lädt das Backend eine
MongoDB-Binärdatei herunter (ca. 100 MB) und betreibt sie im Arbeitsspeicher. Bei jedem Neustart werden die
Daten zurückgesetzt und die Testdaten neu geladen.

### Option 1 – Node.js-Backend

```bash
npm run install:node
npm run dev:node
```

### Option 2 – Python-Backend

Erstelle und aktiviere zuerst eine virtuelle Umgebung:

```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate

# Windows (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Danach:

```bash
npm run install:python
npm run dev:python
```

### App öffnen

- Frontend: <http://localhost:5173>
- API: <http://localhost:4000/api/tasks>

### Tests ausführen

```bash
npm run test:node      # Jest + Supertest
npm run test:python    # pytest (mit aktivierter virtueller Umgebung)
```

Jedes Backend enthält einen Beispieltest, den du als Vorlage verwenden kannst.

### Probleme beim Setup?

- Der Download von MongoDB kann hinter strengen Firmen- oder Schul-Proxys fehlschlagen. Verwende in diesem Fall
  entweder **GitHub Codespaces** (das Repo enthält einen `.devcontainer`, es funktioniert also im Browser), oder
  erstelle einen kostenlosen MongoDB-Atlas-Cluster und setze die Umgebungsvariable `MONGODB_URI`.
- Wenn du länger als 30 Minuten beim Setup feststeckst, melde dich bei uns. Setup-Probleme sind nicht Teil des
  Tests.

---

## Deine Aufgaben

### 1. Behebe die gemeldeten Bugs

Unsere Benutzerinnen und Benutzer haben folgende Probleme gemeldet:

> **#1** «Die Taskliste ist leer, obwohl die Datenbank 30 Tasks enthält.»
>
> **#2** «Tasks mit Priorität 10 – unsere dringendsten – werden ganz unten in der Liste angezeigt.»
>
> **#3** «Wenn ich einen Task mit Fälligkeitsdatum erstelle, zeigt die Liste den Tag _vor_ dem gewählten Datum
> an. Bestehende Tasks sehen korrekt aus.»
>
> **#4** «Das Abhaken eines Tasks als erledigt funktioniert nicht. Nach dem Neuladen der Seite ist der Task
> plötzlich erledigt.»
>
> **#5** «Unser Monitoring zeigt HTTP-500-Fehler, wenn ein Partnersystem `GET /api/tasks/123` aufruft.»
>
> **#6** «Unser Partnersystem ändert über die API nur den Titel eines Tasks. Danach ist das Fälligkeitsdatum
> weg.»

Benutzerinnen und Benutzer sind nicht immer präzise, und diese Liste ist vielleicht nicht vollständig. Behebe die
**Ursache**, nicht nur das Symptom. Ein Bug kann im Backend, im Frontend, in den Daten oder an mehreren Stellen
gleichzeitig liegen.

### 2. Implementiere Filtern und Sortieren

Die Benutzerinnen und Benutzer möchten die Taskliste filtern und sortieren. Implementiere die Query-Parameter
für `GET /api/tasks` so, wie sie in `api/openapi.yaml` spezifiziert sind:

| Parameter     | Werte                                          | Standard      |
| ------------- | ---------------------------------------------- | ------------- |
| `status`      | `open`, `done`                                 | (kein Filter) |
| `minPriority` | Ganzzahl 1–10 → nur Tasks mit Priorität ≥ Wert | (kein Filter) |
| `sort`        | `priority`, `dueDate`, `createdAt`             | `priority`    |
| `order`       | `asc`, `desc`                                  | `desc`        |

- Parameter lassen sich kombinieren, z. B. `GET /api/tasks?status=open&minPriority=7&sort=dueDate&order=asc`.
- Ungültige Werte (z. B. `status=closed`, `minPriority=abc`) → **HTTP 400** mit dem Fehlerformat
  `{ "error": "<Meldung>" }`.
- Filtern und Sortieren müssen **in der Datenbankabfrage** passieren, nicht in JavaScript/Python, nachdem alles
  geladen wurde.
- Füge im **Frontend** Bedienelemente (z. B. Dropdowns) für diese Optionen hinzu. Sie müssen die API verwenden
  und dürfen die Liste nicht im Browser filtern.

### 3. Schreibe Tests

Schreibe **mindestens 3 aussagekräftige Tests** in deinem gewählten Backend. Mindestens einer davon muss einen
der behobenen Bugs reproduzieren, also vor deinem Fix fehlschlagen und danach bestehen.

### 4. Dokumentiere deine Arbeit in `NOTES.md`

Fülle die `NOTES.md` im Hauptverzeichnis des Projekts aus (eine Vorlage ist vorhanden) mit:

- **Pro Bug:** Symptom → Ursache → Fix (Datei / was du geändert hast)
- **Feature:** kurze Beschreibung deiner Umsetzung und deiner Entscheidungen
- **KI-Nutzung:** welche Tools du wofür verwendet hast, und **wo die KI falsch lag oder nicht geholfen hat** und
  wie du das gemerkt hast
- **Zeitaufwand:** ungefähr, pro Aufgabe
- **Offene Punkte:** was dir aufgefallen ist, du aber nicht behoben hast, oder was du mit mehr Zeit anders
  machen würdest

Du musst keinen Roman schreiben. Eine kurze Beschreibung in Stichworten reicht völlig.

---

## Regeln

- **KI-Tools sind erlaubt** (ChatGPT, Copilot, Claude, …). Uns interessiert, _wie_ du sie einsetzt. Im Gespräch
  musst du jede Zeile erklären können, die du abgibst.
- **Zeitbudget: max. 8 Stunden.** Du musst nicht alles fertig machen. Eine saubere, gut erklärte Teillösung ist
  besser als eine überhastete komplette.
- Ändere den API-Vertrag (`api/openapi.yaml`) nicht.
- **Git ist erwünscht, aber keine Pflicht.** Wenn du Git verwendest, committe in kleinen, sinnvollen Schritten.
  Wir schauen uns dann auch deine Git-History an.

## Abgabe

Schick uns deine Lösung bis zur vereinbarten Deadline, auf einem dieser beiden Wege:

- **Link zu einem Git-Repository**, z. B. auf GitHub oder GitLab. Öffentlich, oder privat mit Zugriff
  für uns.
- **ZIP-Datei als Anhang per E-Mail.** Lass dabei die Ordner `node_modules` und `.venv` weg. Wenn du Git
  verwendest, lass den Ordner `.git` drin, damit wir deine History sehen.

## Wie es weitergeht

Nach der Abgabe laden wir dich zu einem Gespräch ein. Darin führst du uns durch deine Lösung und erklärst, wie du
vorgegangen bist.

## Worauf wir achten

- Verstehst du den Code, den du abgegeben hast, und kannst du ihn erklären?
- Sind die Bugs an der **Ursache** behoben?
- Funktioniert das Feature wie spezifiziert, auch bei ungültigen Eingaben?
- Sind deine Tests aussagekräftig?
- Ist deine `NOTES.md` klar und ehrlich?
- Wie setzt du KI ein: Überprüfst du, was sie dir liefert?

Viel Erfolg und viel Spass! 🚀

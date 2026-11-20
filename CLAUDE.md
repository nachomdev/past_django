# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A personal Django 4.2 site (deployed at basurero.com.ar) hosting a collection of small, mostly client-side learning games and tools, served by a single app, `pastapp`. UI text and many identifiers are in Spanish.

## Commands

The virtualenv lives one level up, outside this repo (`../venv`). On Windows:

```bash
../venv/Scripts/python manage.py runserver
```

- Apply migrations: `python manage.py migrate`
- Create migration after model changes: `python manage.py makemigrations pastapp`
- Load verb data: `python manage.py loaddata pastapp_data_utf8.json` (`pastapp_data_linux.json` is the same data dumped on the server)
- Tests: `python manage.py test pastapp` (single test: `python manage.py test pastapp.tests.SomeTestCase.test_method`). `pastapp/tests.py` covers only Vivir; tests override `STORAGES` because the manifest static storage fails without `collectstatic`.
- Production static files: `python manage.py collectstatic` (writes to `/var/www/basurero.com.ar/static/`).

`STORAGES` uses `ManifestStaticFilesStorage`, so with `DEBUG = False` any `{% static %}` reference to a file not yet collected raises an error — run `collectstatic` after adding or renaming static files.

## Architecture

Everything lives in `pastapp`: one `views.py`, one `urls.py`, and per-feature template + JS + CSS triples under `templates/pastapp/`, `static/pastapp/js/`, `static/pastapp/css/`. Templates are standalone pages (no base template / `{% extends %}`); third-party libs (Bootstrap, SweetAlert2, Chart.js, d3, topojson) come from CDNs.

Features and where their data lives:

- **Past-tense verb Wordle** (`/past` → `pasto.html` + `wordle.js`): verbs come from the `Verb` model, serialized by `get_verbs_json()` into the template as `verbos_json` with Spanish keys (`infinitivo`, `pasado`, `espa`) — the JS depends on those keys, not the model field names. If the DB is empty it falls back to a hardcoded list. Each guess is POSTed to `/save_attempt` and stored as `PlayLog`.
- **Dictations** (`/dictation...`): content is the hardcoded `DICTATIONS` list in `views.py` (not the DB). Adding a dictation = appending a dict with `id`, `title`, `text`, `hard_words`.
- **Push-up tracker "flexiones"** (`/flexiones`): the only feature using Django auth (custom login/signup views, not `django.contrib.auth.views`). The page is a shell; `flexiones.js` drives it through JSON endpoints under `/flexiones/api/` backed by `PushUpLog` / `PushUpGoal`. The client sends its local date (`YYYY-MM-DD`) so totals follow the user's day, not server UTC.
- **Vivir** (`/vivir`): workout routine (from a PDF plan) with tabs Inicio (one week at a time: sessions, meals, water, estimated kcal balance; tapping a day opens it in Entrenamiento; cycle start tucked under "Cambiar"), Entrenamiento (day navigation, per-day routine choice, item add/remove, per-item log of sets/reps/kg or minutes/km/rpm), Comidas (meal search over `VIVIR_FOODS` + the user's own `VivirFood`, portions, water) and Pesos (body-weight log). Reuses the flexiones login (`flexiones_login` honors `?next=` and shows the "Vivir" brand when next is `/vivir`). Content is hardcoded in `views.py`: `VIVIR_EXERCISES` (catalog; `met` + `minutes` give kcal = MET x 3.5 x kg / 200 x min, kg = latest body weight on or before that date, default 70; `mode` = reps / cardio / free decides what the item logs), `VIVIR_ROUTINES` (items reference catalog names; `short` = volume for weeks 1-2), `VIVIR_WEEK_PLAN` (suggested routine per weekday) and `VIVIR_FOODS` (kcal per portion). User data: `VivirPlan` (cycle start Monday + sex/birth year/height for the daily base burn: Mifflin-St Jeor x 1.2, else 26 kcal/kg), `VivirSession` (per date: done, minutes, `routine` key or blank = suggested, `items` JSON or null = routine defaults — logged sets live inside these items as `set_list` [{reps, kg}] (older items may have flat `sets`/`reps`/`kg`), cardio as km/rpm, and `per_rep` scales minutes with total reps — and water), `VivirExercise` / `VivirFood` (user's own catalog entries; a meal whose name isn't in `VIVIR_FOODS` is upserted into `VivirFood`), `VivirMeal` (kcal stored as total = per-portion x portions), `VivirBodyWeight` (one per date; re-posting a date replaces it). `vivir.js` resolves routines/items/kcal client-side and talks to `/vivir/api/` (`data` = cycle/weights/own catalogs/last loads, `week` and `day` = per-range data); same local-date convention as flexiones.
- **Geografía** (`/geografia`): the view reads the TopoJSON files in `static/pastapp/maps/` and inlines them into the template.
- **Francés, English, Chino**: purely client-side; all content/logic is in the JS file (or inline in `chino.html`).

JSON POST endpoints are `@csrf_exempt` and parse `request.body` with `json.loads`; follow that pattern for new endpoints called from `fetch`.

Some views (`index_past`, `pastest`, `juan`, `azar`) are not routed and reference templates that no longer exist. `pastapp/refactor_wordle.py` is a one-off script that extracted the Wordle CSS/JS out of old templates; it is not part of the app.

## Deployment notes

`settings.py` is used as-is in production (`DEBUG = True`, SQLite, hardcoded `SECRET_KEY` and `ALLOWED_HOSTS`). `nohup.out` shows the server has been run with `runserver 0.0.0.0:8443`. `db.sqlite3` is gitignored.

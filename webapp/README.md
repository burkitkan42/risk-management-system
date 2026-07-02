# СУР — веб-приложение

Полноценное CRUD-приложение поверх той же модели, что и в `Система_управления_рисками.xlsx`: реестр рисков, план обработки и тепловая карта (матрица рисков). Next.js (App Router) + TypeScript + Tailwind CSS.

## Локальный запуск

Ничего дополнительно настраивать не нужно — при первом запуске приложение само создаёт `data/db.json` с теми же 7 демо-рисками и 6 мероприятиями, что и в Excel-версии.

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

> `package.json` уже настроен на `next dev --webpack` / `next build --webpack`, потому что в некоторых окружениях (например, на управляемых Windows-машинах с политиками Application Control) нативная сборка Turbopack блокируется. На обычной машине или в Vercel это не мешает — можно вернуть обычный `next dev`, если нужно.

## Хранилище данных

- **По умолчанию (локально):** JSON-файл `data/db.json` на диске — чтобы приложение работало из коробки без внешних сервисов. Годится для локальной разработки/демо, но **не переживёт** серверлесс-деплой (Vercel/Netlify держат файловую систему только для чтения между запросами).
- **Production:** PostgreSQL через переменную окружения `DATABASE_URL`. Как только она задана, приложение автоматически переключается на неё (см. `src/lib/store.ts`).

## Деплой на Vercel (рекомендуется)

1. Запушьте репозиторий на GitHub (уже сделано, если вы клонировали этот проект).
2. На [vercel.com](https://vercel.com) → **Add New Project** → выберите репозиторий → **Root Directory: `webapp`**.
3. Создайте бесплатную Postgres-базу прямо в Vercel: вкладка **Storage → Create Database → Postgres** (или подключите свою — например, [Neon](https://neon.tech), тоже бесплатно). Vercel сам добавит `DATABASE_URL` в переменные окружения проекта.
4. Выполните `schema.sql` на этой базе (через встроенный SQL-редактор в Vercel/Neon или любой Postgres-клиент), при желании — `seed.sql` для демо-данных.
5. Задеплойте проект (Deploy). Готово — CRUD данные теперь хранятся в реальной базе и переживают redeploy.

## Деплой на Netlify

Аналогично: Root directory `webapp`, build command `npm run build`, publish directory `.next` (плагин `@netlify/plugin-nextjs` ставится автоматически при импорте Next.js-проекта). База данных — так же через `DATABASE_URL` (Neon/Supabase/любой хостed Postgres), выполните `schema.sql` перед первым запуском.

## Структура

```
src/app/                страницы (дашборд с матрицей, /risks, /plan)
src/components/          формы и переиспользуемые UI-компоненты
src/lib/types.ts          типы Risk / TreatmentAction
src/lib/reference.ts       справочники (категории, шкалы, зоны — как лист «Справочники» в Excel)
src/lib/risk-calc.ts       расчёт балла/зоны риска, просрочки
src/lib/store*.ts          слой данных (JSON локально, Postgres в production)
src/lib/actions.ts         Server Actions для создания/редактирования/удаления
schema.sql / seed.sql      SQL для настройки production-базы
```

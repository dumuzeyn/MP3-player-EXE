# MP3 Player EXE

MP3 Player EXE is a local Windows music player packaged as a native `.exe` application with Electron. It does not require a local server and opens as a normal desktop program.

The app plays audio files selected from the computer, stores the music library locally on the same machine, and does not upload tracks anywhere.

## Download

The regular build creates the desktop app in the `dist` folder:

```text
dist/win-unpacked/MP3 Player.exe
```

Keep the whole `win-unpacked` folder together and launch `MP3 Player.exe`.

## Features

- Add one or many audio files from the computer.
- Play songs, favorites, playlists, genres, artists, and albums.
- Search songs and playlists.
- Shuffle and play-all modes.
- Persistent favorites and playlists.
- Album art and metadata reading where the audio file provides them.
- Mini-player and large player views.
- Light and dark themes.
- English and Russian interface.
- Local-only storage.

## Development

Install dependencies:

```bash
pnpm install
```

Run the desktop app in development:

```bash
pnpm start
```

Build Windows `.exe` files:

```bash
pnpm dist
```

Build optional installer and portable artifacts:

```bash
pnpm dist:installer
```

## Project Files

```text
main.js       Electron desktop entry point
index.html    App interface
styles.css    App styles
app.js        Player logic
icon.svg      App icon used in the interface
package.json  Electron and build configuration
```

## Notes

The library is saved locally by Electron/Chromium storage. Removing a song from the player removes it only from the app library. It does not delete the original audio file from the computer.

If the app library disappears after clearing application data, add the songs again with the `+` button.

## License

MIT

---

# MP3 Player EXE на русском

MP3 Player EXE - локальный музыкальный плеер для Windows, упакованный в обычное `.exe` приложение через Electron. Локальный сервер, VBS-файл и запуск через браузер не нужны.

Приложение воспроизводит аудиофайлы, выбранные на компьютере, хранит медиатеку локально и никуда не загружает песни.

## Скачать

Обычная сборка создаёт desktop-приложение в папке `dist`:

```text
dist/win-unpacked/MP3 Player.exe
```

Держите всю папку `win-unpacked` вместе и запускайте `MP3 Player.exe`.

## Возможности

- Добавление одной или нескольких песен с компьютера.
- Разделы песен, избранного, плейлистов, жанров, исполнителей и альбомов.
- Поиск песен и плейлистов.
- Режимы воспроизведения всех песен и случайного порядка.
- Сохранение избранного и плейлистов.
- Чтение обложек и метаданных, если они есть в файле.
- Мини-плеер и большой экран плеера.
- Светлая и темная темы.
- Интерфейс на English и Русском.
- Только локальное хранение данных.

## Разработка

Установить зависимости:

```bash
pnpm install
```

Запустить приложение для разработки:

```bash
pnpm start
```

Собрать Windows `.exe` файлы:

```bash
pnpm dist
```

Собрать дополнительные installer и portable артефакты:

```bash
pnpm dist:installer
```

## Файлы проекта

```text
main.js       точка входа Electron
index.html    интерфейс приложения
styles.css    стили приложения
app.js        логика плеера
icon.svg      иконка внутри интерфейса
package.json  настройки Electron и сборки
```

## Примечания

Медиатека сохраняется локально в хранилище Electron/Chromium. Удаление песни из приложения удаляет только запись из медиатеки. Исходный аудиофайл на компьютере не удаляется.

Если медиатека исчезла после очистки данных приложения, добавьте песни заново кнопкой `+`.

## Лицензия

MIT

# MP3 Player EXE

**MP3 Player EXE** - настольный MP3-плеер для Windows, собранный как самостоятельный `.exe` файл. Пользователю не нужен браузер, локальный сервер, VBS-скрипт или отдельная папка приложения: достаточно скачать и запустить один файл.

[English version](#english-version)

## Скачать EXE

[Скачать MP3-Player-1.0.0-portable.exe](https://github.com/dumuzeyn/MP3-player-EXE/raw/main/dist/MP3-Player-1.0.0-portable.exe)

Локальный путь после сборки:

```text
dist/MP3-Player-1.0.0-portable.exe
```

Portable-версия при запуске временно распаковывает приложение в уникальную папку Windows Temp и запускает плеер оттуда. После закрытия временные файлы удаляются. Музыка и настройки остаются в локальном хранилище приложения.

## Что умеет приложение

- Добавляет MP3-файлы с компьютера через кнопку `+`.
- Поддерживает drag and drop: можно перетащить MP3-файлы прямо в окно приложения.
- Принимает только `.mp3`, чтобы случайные файлы другого типа не попадали в медиатеку.
- Может добавлять сразу большие пачки песен без чтения всего файла в память.
- Запоминает добавленные песни после перезапуска приложения.
- Хранит путь к исходному MP3-файлу, а не копирует музыку внутрь приложения.
- Удаление песни из приложения удаляет только запись из медиатеки, а не сам файл на компьютере.
- Читает ID3-метаданные: название, исполнитель, альбом, жанр и обложку, если они есть в MP3-файле.
- Показывает обложки в списке песен, мини-плеере, большом плеере, группах и плейлистах.
- Показывает песни в разделах `Песни`, `Избранное`, `Плейлисты`, `Жанры`, `Исполнители`, `Альбомы`, `Настройки`.
- Поддерживает поиск по песням, избранному и плейлистам.
- Поддерживает поиск песен во время добавления в плейлист.
- Позволяет создавать, открывать, наполнять, очищать и удалять плейлисты.
- В плейлистах видны обложки песен, количество треков и быстрые кнопки воспроизведения.
- Позволяет добавлять песни в избранное и быстро открывать список избранного.
- Есть режимы `играть все` и `перемешать`.
- Есть очередь воспроизведения и переход к следующей/предыдущей песне.
- Есть большой плеер с обложкой, названием, исполнителем, прогрессом, временем, лайком, повтором и таймером сна.
- Есть мини-плеер внизу окна: он показывает текущую песню, обложку и кнопку play/pause.
- Нажатие на мини-плеер открывает большой плеер.
- Музыка продолжает играть при закрытии окна: приложение прячется в трей.
- В трее можно открыть приложение или полностью выйти.
- Поддерживается системная медиапанель Windows через Media Session API: название, исполнитель, обложка, play/pause, next/previous и позиция трека.
- Есть светлая и темная тема.
- Есть русский и английский интерфейс. Выбор языка сделан как выпадающий список, чтобы позже можно было добавить больше языков.
- Верхнее меню можно прокручивать/тянуть, включая быстрый переход между крайними пунктами `Песни` и `Настройки`.

## Как работает хранение данных

Приложение хранит медиатеку локально на компьютере пользователя:

- список песен и техническая информация сохраняются в IndexedDB Electron/Chromium;
- избранное, плейлисты, язык, тема и активный раздел сохраняются в localStorage;
- исходные MP3-файлы остаются там, где пользователь их выбрал;
- приложение не загружает музыку в интернет;
- если пользователь переместит или удалит MP3-файл вручную, запись может остаться в медиатеке, но старый путь больше не сможет воспроизводиться.

## Безопасность

В приложении добавлены ограничения, чтобы оно не могло вредить пользователю:

- renderer работает без Node.js доступа;
- включен `contextIsolation`;
- включен sandbox для окна Electron;
- preload отдает в интерфейс только минимальный API для выбора и чтения MP3;
- IPC-запросы принимаются только от локального `index.html` приложения;
- чтение файлов ограничено абсолютными путями к `.mp3`;
- пакетное чтение ограничено по количеству файлов;
- приложение не имеет IPC-команд на запись, перезапись или удаление файлов пользователя;
- включена Content Security Policy;
- запрещены произвольные переходы, новые окна, фреймы и сетевые подключения из интерфейса;
- внешняя ссылка разрешена только на репозиторий GitHub проекта;
- запросы разрешений в Electron отклоняются.

## Технологии

- **Electron** - настольная оболочка Windows-приложения.
- **Chromium Web Audio / HTMLAudioElement** - воспроизведение MP3.
- **JavaScript** - логика плеера, медиатеки, плейлистов, поиска и интерфейса.
- **HTML/CSS** - интерфейс приложения.
- **IndexedDB** - локальное хранение медиатеки.
- **localStorage** - хранение настроек, языка, темы, избранного и плейлистов.
- **Electron IPC + preload** - безопасный мост между интерфейсом и системным диалогом выбора файлов.
- **ID3 parser в main.js** - чтение метаданных и обложек MP3 без загрузки всего файла в память.
- **Media Session API** - интеграция с медиапанелью Windows.
- **electron-builder** - сборка Electron-приложения.
- **NSIS** - создание portable `.exe`, который запускается как один файл.

## Файлы проекта

```text
main.js             Electron main process, окно, трей, IPC, безопасность, чтение MP3-тегов
preload.js          безопасный bridge API для renderer
index.html          структура интерфейса
styles.css          стили приложения
app.js              логика плеера, медиатеки, поиска, плейлистов и UI
icon.svg            исходная SVG-иконка приложения
icon.ico            Windows-иконка приложения
build-portable.nsi  NSIS-скрипт для надежной single-file portable сборки
package.json        зависимости и конфигурация сборки
```

## Разработка

Установить зависимости:

```bash
pnpm install
```

Запустить приложение в режиме разработки:

```bash
pnpm start
```

Собрать распакованную папку приложения:

```bash
pnpm dist:folder
```

Собрать portable `.exe` через NSIS-скрипт:

```bash
pnpm dist:folder
makensis build-portable.nsi
```

Готовый файл появится здесь:

```text
dist/MP3-Player-1.0.0-portable.exe
```

## Лицензия

MIT

---

## English Version

**MP3 Player EXE** is a desktop MP3 player for Windows packaged as a self-contained `.exe` file. The user does not need a browser, local server, VBS script, or separate application folder: download one file and run it.

[Russian version](#mp3-player-exe)

## Download EXE

[Download MP3-Player-1.0.0-portable.exe](https://github.com/dumuzeyn/MP3-player-EXE/raw/main/dist/MP3-Player-1.0.0-portable.exe)

Local build path:

```text
dist/MP3-Player-1.0.0-portable.exe
```

The portable build extracts the app into a unique Windows Temp folder and launches it from there. Temporary files are removed after the app exits. Music library data and settings stay in local app storage.

## Features

- Adds MP3 files from the computer with the `+` button.
- Supports drag and drop for MP3 files.
- Accepts only `.mp3` files.
- Imports large batches without reading full audio files into memory.
- Remembers imported songs after restart.
- Stores the path to the original MP3 file instead of copying music into the app.
- Removing a song from the app removes only the library entry, not the original file.
- Reads ID3 metadata: title, artist, album, genre, and cover art when available.
- Shows cover art in song lists, mini player, full player, groups, and playlists.
- Provides `Songs`, `Favorites`, `Playlists`, `Genres`, `Artists`, `Albums`, and `Settings` sections.
- Supports search in songs, favorites, and playlists.
- Supports song search while adding songs to a playlist.
- Creates, opens, fills, and deletes playlists.
- Playlist cards show cover art, track count, and quick playback buttons.
- Supports favorites.
- Includes play-all and shuffle modes.
- Includes queue playback, next track, and previous track.
- Includes a full player with cover art, title, artist, progress, time, like, repeat, and sleep timer.
- Includes a bottom mini-player with current song, cover art, and play/pause.
- Clicking the mini-player opens the full player.
- Music continues playing when the window is closed; the app hides to the system tray.
- The tray menu can reopen the app or quit it.
- Integrates with the Windows media panel through the Media Session API.
- Supports light and dark themes.
- Supports Russian and English UI. Language selection uses a dropdown so more languages can be added later.
- The top menu can be dragged horizontally, including quick movement between the edge tabs `Songs` and `Settings`.

## Data Storage

The app stores the library locally on the user's computer:

- songs and technical metadata are stored in Electron/Chromium IndexedDB;
- favorites, playlists, language, theme, and active view are stored in localStorage;
- original MP3 files stay in their original locations;
- the app does not upload music anywhere;
- if the user manually moves or deletes an MP3 file, the library entry may remain, but the old path will no longer play.

## Security

The app includes restrictions to avoid harming the user:

- the renderer has no Node.js access;
- `contextIsolation` is enabled;
- the Electron window runs in sandbox mode;
- preload exposes only the minimal API for selecting and reading MP3 files;
- IPC requests are accepted only from the local app `index.html`;
- file reads are limited to absolute `.mp3` paths;
- batch reads are limited by file count;
- the app has no IPC command for writing, overwriting, or deleting user files;
- Content Security Policy is enabled;
- arbitrary navigation, new windows, frames, and network connections from the UI are blocked;
- the only allowed external link is the project GitHub repository;
- Electron permission requests are denied.

## Technologies

- **Electron** for the Windows desktop shell.
- **Chromium Web Audio / HTMLAudioElement** for MP3 playback.
- **JavaScript** for player, library, playlist, search, and UI logic.
- **HTML/CSS** for the interface.
- **IndexedDB** for local library storage.
- **localStorage** for settings, language, theme, favorites, and playlists.
- **Electron IPC + preload** for a safe bridge between the UI and native file dialogs.
- **ID3 parser in main.js** for reading MP3 metadata and cover art without loading the whole file into memory.
- **Media Session API** for Windows media panel integration.
- **electron-builder** for Electron packaging.
- **NSIS** for the single-file portable `.exe` build.

## Project Files

```text
main.js             Electron main process, window, tray, IPC, security, MP3 tag reading
preload.js          safe bridge API for the renderer
index.html          interface structure
styles.css          app styles
app.js              player, library, search, playlist, and UI logic
icon.svg            source SVG app icon
icon.ico            Windows app icon
build-portable.nsi  NSIS script for reliable single-file portable builds
package.json        dependencies and build configuration
```

## Development

Install dependencies:

```bash
pnpm install
```

Run the app in development mode:

```bash
pnpm start
```

Build the unpacked app folder:

```bash
pnpm dist:folder
```

Build the portable `.exe` with the NSIS script:

```bash
pnpm dist:folder
makensis build-portable.nsi
```

The output file is:

```text
dist/MP3-Player-1.0.0-portable.exe
```

## License

MIT

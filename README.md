# MP3 Player Web

[English version](#engG)

MP3 Player Web - это локальный музыкальный плеер, который запускается в браузере с рабочего стола из папки проекта. Он никуда не загружает песни. Пользователь выбирает локальные аудиофайлы, а приложение хранит медиатеку в браузере на этом же компьютере.

## Быстрый старт

1. Откройте папку проекта.
2. Дважды щелкните `MP3 Player.vbs`.
3. Помощник запустит локальный сервер и откроет приложение в браузере.
4. Если браузер не открылся автоматически, перейдите по адресу `http://127.0.0.1:4173/`.

Не открывайте `index.html` напрямую для обычного использования. Аудиофайлы, хранилище IndexedDB и разрешения браузера надежнее работают через локальный адрес `127.0.0.1`.

## Файлы проекта

`index.html` содержит структуру приложения: заголовок, вкладки, списки песен, избранное, плейлисты, группировки, полный плеер, мини-плеер и модальные панели.

`styles.css` управляет визуальным оформлением. В начале файла находятся основные цветовые переменные. Внизу находится блок `Web final polish layer`, который применяет текущий финальный стиль: кнопки без рамок, скругленные обложки, перетаскиваемые вкладки, одинаковую высоту карточек плейлистов и исправленное выравнивание иконки перемешивания.

`app.js` содержит логику приложения: импорт песен, чтение метаданных, хранение песен, поиск, избранное, плейлисты, очередь воспроизведения, перемешивание, повтор, таймер, модальные панели, полный плеер и мини-плеер.

`manifest.webmanifest` описывает метаданные веб-приложения для браузеров и использования в стиле PWA.

`icon.svg` - иконка приложения. Она также отображается перед заголовком `MP3 Player` в шапке. CSS инвертирует иконку в шапке, когда включена темная тема.

`MP3 Player.vbs` запускает приложение одним кликом и скрывает окно командной строки.

`start-server.bat` запускает локальный сервер на порту `4173`.

## Добавление музыки

Откройте вкладку `Songs` и нажмите `+`. Выберите один или несколько аудиофайлов. Приложение добавит их в медиатеку и попробует прочитать из метаданных название, исполнителя, альбом, жанр и обложку.

Если файл не содержит метаданных, приложение использует запасные значения. Исходный аудиофайл на диске не изменяется.

## Хранилище

Песни хранятся в браузерном IndexedDB. Благодаря этому медиатека остается доступной после перезапуска браузера. Удаление песни из приложения удаляет ее только из браузерной медиатеки. Исходный файл на компьютере не удаляется.

Избранное, плейлисты, тема и небольшие настройки хранятся в `localStorage`.

## Вкладки

`Songs` показывает всю музыкальную медиатеку.

`Favorites` показывает песни, отмеченные сердцем.

`Playlists` показывает постоянные плейлисты. Их можно создавать, удалять, открывать, воспроизводить по порядку или перемешивать.

`Genres`, `Artists` и `Albums` создаются из метаданных песен. Если метаданных нет, песни попадают в запасные группы.

Панель вкладок можно двигать перетаскиванием мышью, тачпадом или колесом мыши. Она сделана как зацикленная лента, поэтому должна ощущаться так, будто может вращаться бесконечно.

## Воспроизведение

Кнопка воспроизведения у песни запускает эту песню. Щелчок по обложке песни тоже запускает песню и открывает полный плеер.

`Play all` создает очередь из текущего раздела и воспроизводит ее по порядку.

Перемешивание случайно упорядочивает весь текущий раздел и воспроизводит эту перемешанную очередь. Оно не запускает только одну случайную песню.

Мини-плеер остается закрепленным внизу экрана, пока выбрана песня. Когда он видим, список получает дополнительный нижний отступ, чтобы последняя песня не скрывалась за мини-плеером.

## Полный плеер

Полный плеер открывается из обложки песни или из мини-плеера. Он показывает обложку, название, исполнителя, позицию в очереди, полосу перемотки, кнопку предыдущего трека, воспроизведение или паузу, следующий трек, таймер, лайк, повтор и управление очередью.

У повтора три состояния: выключен, повтор одной песни и повтор текущего списка.

## Поиск

Поиск открывается как встроенная панель в стиле остального плеера. Он ищет текст в названиях песен и исполнителях. Например, ввод `vo` показывает все песни, в поисковых полях которых есть `vo`.

## Плейлисты

На вкладке `Playlists` кнопка `+` создает плейлист. Кнопка поиска фильтрует плейлисты по названию.

Щелкните карточку плейлиста, чтобы открыть его. Внутри плейлиста можно воспроизвести все песни, перемешать их, добавить песни и удалить песни из этого плейлиста.

При удалении плейлиста появляется запрос подтверждения. Песни внутри плейлиста остаются в медиатеке приложения.

Карточки плейлистов намеренно относятся к той же группе высоты, что и строки песен, чтобы раздел выглядел компактно и единообразно.

## Действия с песнями

У каждой строки песни есть кнопка свойств с тремя точками. Она открывает действия для выбранной песни: добавить в избранное, добавить в плейлист или удалить из приложения.

При удалении песни появляется запрос подтверждения. Исходный файл на компьютере не удаляется.

## Темы

Кнопка в правом верхнем углу переключает светлый и темный двухцветные режимы. Основные цвета управляются CSS-переменными в `:root` и `body.theme-dark` внутри `styles.css`.

Важные цветовые переменные:

```css
--bg
--panel
--text
--muted
--line
--strong-line
```

## Изменение дизайна

Чтобы изменить размер строки песни, отредактируйте `.song-row`.

Чтобы изменить размер обложки или радиус углов, отредактируйте `.song-cover`, `.group-cover` и `.cover-art`.

Чтобы изменить верхнюю панель вкладок, отредактируйте `.toolbar` и `.pill`.

Чтобы изменить кнопки, отредактируйте `.icon-button`, `.tiny-button`, `.round-button`, `.play-button` и `.play-mode-button`.

Чтобы изменить карточки плейлистов, отредактируйте `.playlist-card`, `.playlist-header`, `.playlist-name` и `.playlist-preview`.

Чтобы изменить мини-плеер, отредактируйте `.mini-player`, `#miniTitle` и `#miniState`.

Для последних дизайнерских переопределений начните с блока `Web final polish layer` внизу `styles.css`.

## Изменение поведения

Импорт файлов начинается с обработчика `fileInput` и функций загрузки песен в `app.js`.

Сортировка выполняется в `sortedSongs()`.

Поведение перемешивания находится в `shuffleSongs()` и обработчиках кнопки перемешивания.

Воспроизведение запускается через `playSong()` и обработчики строк песен.

Мини-плеер управляется функциями `updateMiniPlayerVisibility()` и `renderPlayer()`.

Отображение и редактирование плейлистов выполняются в `renderPlaylists()`, `renderPlaylist()`, `openPlaylistDetailPanel()` и функциях сохранения состояния.

Модальные панели управляются функциями `openPanel()`, `closePanel()`, `openConfirmDialog()` и связанными с ними функциями панелей.

Зацикленная панель вкладок инициализируется в `setupInfiniteToolbar()`. Поддержка перетаскивания мышью тоже находится внутри этой функции.

## Замена иконки

Замените `icon.svg` другим SVG-файлом. Если иконка в шапке должна продолжать инвертироваться вместе с темой, сохраните `.brand-icon { filter: var(--icon-filter); }` в `styles.css`.

## Перенос проекта

Скопируйте всю папку проекта. Запустите `MP3 Player.vbs` из нового расположения. Папка переносит код приложения, но сама музыкальная медиатека хранится в профиле браузера на одном компьютере. На новом компьютере добавьте песни заново кнопкой `+`.

## Частые проблемы

Если приложение не открывается, проверьте `http://127.0.0.1:4173/`.

Если порт занят, закройте старый процесс сервера или измените порт и в `start-server.bat`, и в `MP3 Player.vbs`.

Если песни исчезают после очистки данных браузера, скорее всего, был очищен IndexedDB. Добавьте песни заново.

Если обложка не появляется, файл может не содержать встроенную обложку или браузер не смог ее прочитать.

Если поиск ничего не находит, очистите панель поиска и проверьте текущую вкладку. Поиск фильтрует только активный раздел.

>**Автор проекта: Зейналов У.Р.о.**
---

<h1 id = engG>
 MP3 Player Web
</h1>

MP3 Player Web is a local music player that runs in a desktop browser from this project folder. It does not upload songs anywhere. The user selects local audio files, and the app stores its library inside the browser on the same computer.

## Quick Start

1. Open the project folder.
2. Double-click `MP3 Player.vbs`.
3. The helper starts the local server and opens the app in the browser.
4. If the browser does not open automatically, go to `http://127.0.0.1:4173/`.

Do not open `index.html` directly for normal use. Audio files, IndexedDB storage, and browser permissions work more reliably through the local `127.0.0.1` address.

## Project Files

`index.html` contains the app structure: the header, tabs, song lists, favorites, playlists, group views, full player, mini player, and modal panels.

`styles.css` controls the visual design. The top of the file defines the main color variables. The bottom contains `Web final polish layer`, which applies the current final style: borderless buttons, rounded covers, draggable tabs, equal playlist card height, and corrected shuffle icon alignment.

`app.js` contains the app logic: importing songs, reading metadata, storing songs, searching, favorites, playlists, playback queue, shuffle, repeat, timer, modal panels, full player, and mini player.

`manifest.webmanifest` describes the web app metadata for browsers and PWA-like use.

`icon.svg` is the app icon. It is also shown before the `MP3 Player` title in the header. The header icon is inverted by CSS when dark mode is active.

`MP3 Player.vbs` starts the app with one click and hides the command window.

`start-server.bat` starts the local server on port `4173`.

## Adding Music

Open the `Songs` tab and press `+`. Select one or more audio files. The app adds them to the library and tries to read title, artist, album, genre, and cover art from metadata.

If a file does not contain metadata, the app uses fallback values. The original audio file on disk is not modified.

## Storage

Songs are stored in browser IndexedDB. This keeps the library available after restarting the browser. Removing a song from the app removes it only from the browser library. It does not delete the original file from the computer.

Favorites, playlists, theme, and small settings are stored in `localStorage`.

## Tabs

`Songs` shows the full music library.

`Favorites` shows songs marked with a heart.

`Playlists` shows persistent playlists. They can be created, deleted, opened, played in order, or shuffled.

`Genres`, `Artists`, and `Albums` are generated from song metadata. If metadata is missing, songs are placed into fallback groups.

The tab bar can be moved with a mouse drag, trackpad, or mouse wheel. It is built as a looping strip, so it should feel like it can keep spinning.

## Playback

The play button on a song starts that song. Clicking a song cover also starts that song and opens the full player.

`Play all` builds a queue from the current section and plays it in order.

Shuffle randomizes the entire current section and plays that shuffled queue. It does not play only one random song.

The mini player stays fixed at the bottom of the screen while a song is selected. When it is visible, the list gets extra bottom space so the last song is not hidden behind the mini player.

## Full Player

The full player opens from a song cover or from the mini player. It shows cover art, title, artist, queue position, seek bar, previous button, play or pause, next button, timer, like, repeat, and queue controls.

Repeat has three states: off, repeat one song, and repeat the current list.

## Search

Search opens as an in-app panel styled like the rest of the player. It matches text inside song titles and artists. For example, typing `vo` shows all songs containing `vo` in their searchable fields.

## Playlists

In the `Playlists` tab, `+` creates a playlist. The search button filters playlists by name.

Click a playlist card to open it. Inside a playlist you can play all songs, shuffle them, add songs, and remove songs from that playlist.

Deleting a playlist asks for confirmation. Songs inside the playlist remain in the app library.

Playlist cards are intentionally the same height family as song rows, so the section feels compact and consistent.

## Song Actions

Each song row has a properties button with three dots. It opens actions for the selected song: add to favorites, add to playlist, or remove from the app.

Removing a song asks for confirmation. The original file on the computer is not deleted.

## Themes

The top-right button switches between light and dark two-color modes. The main colors are controlled by CSS variables in `:root` and `body.theme-dark` inside `styles.css`.

Important color variables:

```css
--bg
--panel
--text
--muted
--line
--strong-line
```

## Changing The Design

To change song row size, edit `.song-row`.

To change cover size or corner radius, edit `.song-cover`, `.group-cover`, and `.cover-art`.

To change the top tab strip, edit `.toolbar` and `.pill`.

To change buttons, edit `.icon-button`, `.tiny-button`, `.round-button`, `.play-button`, and `.play-mode-button`.

To change playlist cards, edit `.playlist-card`, `.playlist-header`, `.playlist-name`, and `.playlist-preview`.

To change the mini player, edit `.mini-player`, `#miniTitle`, and `#miniState`.

For the latest design overrides, start with the `Web final polish layer` block at the bottom of `styles.css`.

## Changing Behavior

File import starts from the `fileInput` handler and the song loading functions in `app.js`.

Sorting is handled by `sortedSongs()`.

Shuffle behavior is handled by `shuffleSongs()` and the shuffle button handlers.

Playback starts through `playSong()` and the song row event handlers.

The mini player is controlled by `updateMiniPlayerVisibility()` and `renderPlayer()`.

Playlist display and editing are handled by `renderPlaylists()`, `renderPlaylist()`, `openPlaylistDetailPanel()`, and the state saving functions.

Modal panels are controlled by `openPanel()`, `closePanel()`, `openConfirmDialog()`, and related panel functions.

The looping tab bar is initialized in `setupInfiniteToolbar()`. Mouse drag support is also inside that function.

## Replacing The Icon

Replace `icon.svg` with another SVG file. If the header icon should continue to invert with the theme, keep `.brand-icon { filter: var(--icon-filter); }` in `styles.css`.

## Moving The Project

Copy the whole project folder. Run `MP3 Player.vbs` from the new location. The folder moves the app code, but the music library itself is stored in the browser profile on one computer. On a new computer, add songs again with the `+` button.

## Common Problems

If the app does not open, check `http://127.0.0.1:4173/`.

If the port is busy, close the old server process or change the port in both `start-server.bat` and `MP3 Player.vbs`.

If songs disappear after clearing browser data, IndexedDB was probably cleared. Add the songs again.

If cover art does not appear, the file may not contain embedded cover art or the browser could not read it.

If search finds nothing, clear the search panel and check the current tab. Search filters only the active section.

> **Author of project: Zeynalov U.R.o.**
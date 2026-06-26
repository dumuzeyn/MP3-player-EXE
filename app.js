const audio = document.querySelector("#audio");
const fileInput = document.querySelector("#fileInput");
const songList = document.querySelector("#songList");
const favoriteList = document.querySelector("#favoriteList");
const playlistList = document.querySelector("#playlistList");
const emptyState = document.querySelector("#emptyState");
const miniPlayer = document.querySelector("#miniPlayer");
const miniTitle = document.querySelector("#miniTitle");
const miniArtist = document.querySelector("#miniArtist");
const miniState = document.querySelector("#miniState");
const playerSheet = document.querySelector("#playerSheet");
const themeToggle = document.querySelector("#themeToggle");
const settingsThemeToggle = document.querySelector("#settingsThemeToggle");
const settingsThemeValue = document.querySelector("#settingsThemeValue");
const languageEnglish = document.querySelector("#languageEnglish");
const languageRussian = document.querySelector("#languageRussian");
const deleteAllSongsButton = document.querySelector("#deleteAllSongsButton");
const deleteAllPlaylistsButton = document.querySelector("#deleteAllPlaylistsButton");
const queuePanel = document.querySelector("#queuePanel");
const timerPanel = document.querySelector("#timerPanel");
const customTimerRow = document.querySelector("#customTimerRow");
const customTimerInput = document.querySelector("#customTimerInput");
const startCustomTimer = document.querySelector("#startCustomTimer");
const queueList = document.querySelector("#queueList");
const playerTitle = document.querySelector("#playerTitle");
const playerSubtitle = document.querySelector("#playerSubtitle");
const coverArt = document.querySelector(".cover-art");
const seekBar = document.querySelector("#seekBar");
const currentTime = document.querySelector("#currentTime");
const remainingTime = document.querySelector("#remainingTime");
const playButton = document.querySelector("#playButton");
const likeButton = document.querySelector("#likeButton");
const loopButton = document.querySelector("#loopButton");
const loopLabel = document.querySelector("#loopLabel");
const timerLabel = document.querySelector("#timerLabel");
const playlistForm = document.querySelector("#playlistForm");
const playlistName = document.querySelector("#playlistName");
const playlistSearchToggle = document.querySelector("#playlistSearchToggle");
const playlistSearchRow = document.querySelector("#playlistSearchRow");
const playlistSearchInput = document.querySelector("#playlistSearchInput");
const toolbar = document.querySelector(".toolbar");
const viewPager = document.querySelector("#viewPager");
const viewTrack = document.querySelector("#viewTrack");
const addMusicButton = document.querySelector("#addMusicButton");
const playAllButton = document.querySelector("#playAllButton");
const shuffleButton = document.querySelector("#shuffleButton");
const searchToggle = document.querySelector("#searchToggle");
const searchRow = document.querySelector("#searchRow");
const searchInput = document.querySelector("#searchInput");
const favoritePlayAllButton = document.querySelector("#favoritePlayAllButton");
const favoriteShuffleButton = document.querySelector("#favoriteShuffleButton");
const favoriteSearchToggle = document.querySelector("#favoriteSearchToggle");
const favoriteSearchRow = document.querySelector("#favoriteSearchRow");
const favoriteSearchInput = document.querySelector("#favoriteSearchInput");
const favoriteAddButton = document.querySelector("#favoriteAddButton");
const favoriteAddPanel = document.querySelector("#favoriteAddPanel");
const favoriteAddList = document.querySelector("#favoriteAddList");
const confirmFavoriteAdd = document.querySelector("#confirmFavoriteAdd");
const playlistAddPanel = document.querySelector("#playlistAddPanel");
const playlistAddList = document.querySelector("#playlistAddList");
const playlistAddTitle = document.querySelector("#playlistAddTitle");
const confirmPlaylistAdd = document.querySelector("#confirmPlaylistAdd");
const playlistDetailPanel = document.querySelector("#playlistDetailPanel");
const playlistDetailTitle = document.querySelector("#playlistDetailTitle");
const playlistDetailList = document.querySelector("#playlistDetailList");
const playlistDetailAddButton = document.querySelector("#playlistDetailAddButton");
const playlistSequentialButton = document.querySelector("#playlistSequentialButton");
const playlistRandomButton = document.querySelector("#playlistRandomButton");
const songActionPanel = document.querySelector("#songActionPanel");
const songActionTitle = document.querySelector("#songActionTitle");
const songActionFavorite = document.querySelector("#songActionFavorite");
const songActionFavoriteIcon = document.querySelector("#songActionFavoriteIcon");
const songActionFavoriteText = document.querySelector("#songActionFavoriteText");
const songActionPlaylist = document.querySelector("#songActionPlaylist");
const songActionDelete = document.querySelector("#songActionDelete");
const playlistTargetPanel = document.querySelector("#playlistTargetPanel");
const playlistTargetTitle = document.querySelector("#playlistTargetTitle");
const playlistTargetName = document.querySelector("#playlistTargetName");
const playlistTargetList = document.querySelector("#playlistTargetList");
const createPlaylistTarget = document.querySelector("#createPlaylistTarget");
const confirmPanel = document.querySelector("#confirmPanel");
const confirmTitle = document.querySelector("#confirmTitle");
const confirmMessage = document.querySelector("#confirmMessage");
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const songCount = document.querySelector("#songCount");
const genreList = document.querySelector("#genreList");
const artistList = document.querySelector("#artistList");
const albumList = document.querySelector("#albumList");
const viewNames = [...document.querySelectorAll(".pill:not(.tab-clone)")].map((tab) => tab.dataset.view);
const DB_NAME = "mp3-player-library";
const DB_STORE = "songs";
const WAVEFORM_VERSION = 4;

function storageGet(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function storageJsonArray(key) {
  try {
    const value = JSON.parse(storageGet(key, "[]"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function storageChoice(key, allowed, fallback) {
  const value = storageGet(key, fallback);
  return allowed.includes(value) ? value : fallback;
}

function savedFavorites() {
  return storageJsonArray("favorites").map(String).filter(Boolean);
}

function savedPlaylists() {
  return storageJsonArray("playlists")
    .filter((playlist) => playlist && typeof playlist === "object")
    .map((playlist, index) => ({
      id: String(playlist.id || `playlist-${index}`),
      name: String(playlist.name || `\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 ${index + 1}`),
      songIds: Array.isArray(playlist.songIds) ? playlist.songIds.map(String).filter(Boolean) : [],
    }));
}

const state = {
  songs: [],
  favorites: new Set(savedFavorites()),
  playlists: savedPlaylists(),
  queue: [],
  currentIndex: -1,
  loopMode: "off",
  timerId: null,
  timerEndsAt: null,
  searchQuery: "",
  favoriteSearchQuery: "",
  playlistSearchQuery: "",
  editingPlaylistId: null,
  viewingPlaylistId: null,
  groupDetailSongs: [],
  groupDetailTitle: "",
  pendingFavoriteIds: new Set(),
  pendingPlaylistIds: new Set(),
  actionSongId: null,
  playlistTargetSongId: null,
  stopAfterCurrent: false,
  theme: storageChoice("theme", ["light", "dark"], "light"),
  language: storageChoice("language", ["ru", "en"], "ru"),
  activeView: storageChoice("activeView", viewNames, "songs"),
};

let pendingConfirmAction = null;

const loopText = {
  off: "\u0412\u044b\u043a\u043b",
  one: "\u041f\u0435\u0441\u043d\u044f",
  all: "\u0421\u043f\u0438\u0441\u043e\u043a",
};

function applyTheme() {
  // EN: Theme is stored separately from the library so the chosen look survives restarts.
  document.body.classList.toggle("theme-dark", state.theme === "dark");
  if (themeToggle) {
    themeToggle.textContent = state.theme === "dark" ? "◑" : "◐";
    themeToggle.title = state.theme === "dark" ? "Бело-черный режим" : "Черно-белый режим";
  }
  renderSettings();
}

function t(key) {
  const dictionary = {
    songs: ["Songs", "\u041f\u0435\u0441\u043d\u0438"],
    favorites: ["Favorites", "\u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"],
    playlists: ["Playlists", "\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u044b"],
    genres: ["Genres", "\u0416\u0430\u043d\u0440\u044b"],
    artists: ["Artists", "\u0418\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u0438"],
    albums: ["Albums", "\u0410\u043b\u044c\u0431\u043e\u043c\u044b"],
    settings: ["Settings", "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438"],
    theme: ["Theme", "\u0422\u0435\u043c\u0430"],
    light: ["Light", "\u0421\u0432\u0435\u0442\u043b\u0430\u044f"],
    dark: ["Dark", "\u0422\u0435\u043c\u043d\u0430\u044f"],
    language: ["Language", "\u042f\u0437\u044b\u043a"],
    deleteSongs: ["Delete all songs from app", "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u0435\u0441\u043d\u0438 \u0438\u0437 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"],
    filesStay: ["Files on the computer are not deleted", "\u0424\u0430\u0439\u043b\u044b \u043d\u0430 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435 \u043d\u0435 \u0443\u0434\u0430\u043b\u044f\u044e\u0442\u0441\u044f"],
    deletePlaylists: ["Delete all playlists", "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u044b"],
    songsStay: ["Songs stay in the library", "\u041f\u0435\u0441\u043d\u0438 \u043e\u0441\u0442\u0430\u043d\u0443\u0442\u0441\u044f \u0432 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0435"],
    addAudio: ["Add MP3 or another audio file", "\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 MP3 \u0438\u043b\u0438 \u0434\u0440\u0443\u0433\u043e\u0439 \u0430\u0443\u0434\u0438\u043e\u0444\u0430\u0439\u043b"],
    addAudioHint: ["Press plus and choose music on the device.", "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u043b\u044e\u0441 \u0438 \u0432\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043c\u0443\u0437\u044b\u043a\u0443 \u043d\u0430 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0435."],
    searchSong: ["Search song", "\u041f\u043e\u0438\u0441\u043a \u043f\u0435\u0441\u043d\u0438"],
    searchFavorite: ["Search favorites", "\u041f\u043e\u0438\u0441\u043a \u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u043c"],
    searchPlaylist: ["Search playlist", "\u041f\u043e\u0438\u0441\u043a \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0430"],
    playlistName: ["Playlist name", "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0430"],
  };
  const item = dictionary[key] || [key, key];
  return state.language === "en" ? item[0] : item[1];
}

function applyLanguage() {
  document.documentElement.lang = state.language === "en" ? "en" : "ru";
  document.querySelectorAll(".pill").forEach((pill) => {
    const label = t(pill.dataset.view);
    if (label) pill.textContent = label;
  });
  document.querySelector("#songsView h2")?.replaceChildren(document.createTextNode(`${t("songs")} `), songCount);
  const titleMap = {
    favoritesView: "favorites",
    playlistsView: "playlists",
    genresView: "genres",
    artistsView: "artists",
    albumsView: "albums",
    settingsView: "settings",
  };
  Object.entries(titleMap).forEach(([id, key]) => {
    const heading = document.querySelector(`#${id} h2`);
    if (heading) heading.textContent = t(key);
  });
  const emptyStrong = emptyState?.querySelector("strong");
  const emptyText = emptyState?.querySelector("span");
  if (emptyStrong) emptyStrong.textContent = t("addAudio");
  if (emptyText) emptyText.textContent = t("addAudioHint");
  if (searchInput) searchInput.placeholder = t("searchSong");
  if (favoriteSearchInput) favoriteSearchInput.placeholder = t("searchFavorite");
  if (playlistSearchInput) playlistSearchInput.placeholder = t("searchPlaylist");
  if (playlistName) playlistName.placeholder = t("playlistName");
  renderSettings();
}

function setPlayerOpen(open) {
  playerSheet.classList.toggle("open", open);
  playerSheet.setAttribute("aria-hidden", open ? "false" : "true");
  updateMiniPlayerVisibility();
}

function updateMiniPlayerVisibility() {
  // EN: The mini player hides under full panels and returns when they close.
  const panelOpen = Boolean(document.querySelector(".queue-panel.open"));
  miniPlayer.hidden = !currentSong() || playerSheet.classList.contains("open") || panelOpen;
}

function openPanel(panel) {
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  updateMiniPlayerVisibility();
}

function closePanel(panel) {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  updateMiniPlayerVisibility();
}

function activeViewIndex() {
  const index = viewNames.indexOf(state.activeView);
  return index === -1 ? 0 : index;
}

function setViewTrackTransform(offsetPx = 0) {
  if (!viewTrack) return;
  const index = activeViewIndex();
  viewTrack.style.transform = `translate3d(calc(${-index * 100}% + ${Math.round(offsetPx)}px), 0, 0)`;
}

function updateViewPagerHeight() {
  if (!viewPager) return;
  const activeView = document.querySelector(`#${state.activeView}View`);
  if (!activeView) return;
  viewPager.style.setProperty("--pager-height", `${activeView.offsetHeight}px`);
}

function scheduleViewPagerHeightUpdate() {
  requestAnimationFrame(updateViewPagerHeight);
}

function scrollActiveTabIntoView() {
  if (!toolbar) return;
  const toolbarRect = toolbar.getBoundingClientRect();
  const toolbarCenter = toolbarRect.left + toolbarRect.width / 2;
  const activeTabs = [...toolbar.querySelectorAll(`.pill[data-view="${state.activeView}"]`)];
  const nearestTab = activeTabs
    .map((tab) => {
      const rect = tab.getBoundingClientRect();
      return { tab, distance: Math.abs((rect.left + rect.right) / 2 - toolbarCenter) };
    })
    .sort((a, b) => a.distance - b.distance)[0]?.tab;
  if (!nearestTab) return;
  toolbar.scrollLeft = nearestTab.offsetLeft + nearestTab.offsetWidth / 2 - toolbar.clientWidth / 2;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

async function buildWaveform(file, bars = 24) {
  const seed = [...`${file.name}-${file.size}-${file.lastModified}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: bars }, (_, index) => {
    const wave = Math.sin((seed + index * 17) * 0.18) * 22;
    const jitter = ((seed >> (index % 8)) + index * 13) % 35;
    return Math.max(18, Math.min(96, Math.round(38 + wave + jitter)));
  });
}

function normalizeValue(value, fallback) {
  const clean = value?.trim();
  return clean || fallback;
}

function synchsafeToInt(bytes) {
  return (bytes[0] << 21) | (bytes[1] << 14) | (bytes[2] << 7) | bytes[3];
}

function decodeIso88591(bytes) {
  return [...bytes].map((byte) => String.fromCharCode(byte)).join("");
}

function decodeUtf16(bytes, littleEndian) {
  const values = [];
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    const code = littleEndian ? bytes[index] | (bytes[index + 1] << 8) : (bytes[index] << 8) | bytes[index + 1];
    if (code === 0) break;
    values.push(code);
  }
  return String.fromCharCode(...values);
}

function decodeTextFrame(bytes) {
  const encoding = bytes[0];
  const body = bytes.slice(1);
  let text = "";

  if (encoding === 0) text = decodeIso88591(body);
  else if (encoding === 1) {
    const littleEndian = body[0] === 0xff && body[1] === 0xfe;
    const start = body[0] === 0xff || body[0] === 0xfe ? 2 : 0;
    text = decodeUtf16(body.slice(start), littleEndian);
  } else if (encoding === 2) text = decodeUtf16(body, false);
  else text = new TextDecoder("utf-8").decode(body);

  return text.replace(/\0/g, "").trim();
}

function findNullTerminator(bytes, start, encoding) {
  if (encoding === 1 || encoding === 2) {
    for (let index = start; index + 1 < bytes.length; index += 2) {
      if (bytes[index] === 0 && bytes[index + 1] === 0) return index + 2;
    }
    return bytes.length;
  }
  const index = bytes.indexOf(0, start);
  return index === -1 ? bytes.length : index + 1;
}

function parsePictureFrame(bytes) {
  const encoding = bytes[0];
  let cursor = 1;
  const mimeEnd = bytes.indexOf(0, cursor);
  if (mimeEnd === -1) return null;
  const mimeType = decodeIso88591(bytes.slice(cursor, mimeEnd)) || "image/jpeg";
  cursor = mimeEnd + 2;
  cursor = findNullTerminator(bytes, cursor, encoding);
  const imageBytes = bytes.slice(cursor);
  return imageBytes.length ? new Blob([imageBytes], { type: mimeType }) : null;
}

async function readAudioTags(file) {
  const header = new Uint8Array(await file.slice(0, 10).arrayBuffer());
  if (decodeIso88591(header.slice(0, 3)) !== "ID3") return {};

  const version = header[3];
  const tagSize = synchsafeToInt(header.slice(6, 10));
  const bytes = new Uint8Array(await file.slice(10, 10 + tagSize).arrayBuffer());
  const tags = {};
  let offset = 0;

  while (offset + 10 <= bytes.length) {
    const frameId = decodeIso88591(bytes.slice(offset, offset + 4));
    if (!frameId.trim() || bytes[offset] === 0) break;
    const sizeBytes = bytes.slice(offset + 4, offset + 8);
    const frameSize = version === 4 ? synchsafeToInt(sizeBytes) : (sizeBytes[0] << 24) | (sizeBytes[1] << 16) | (sizeBytes[2] << 8) | sizeBytes[3];
    if (frameSize <= 0) break;

    const frame = bytes.slice(offset + 10, offset + 10 + frameSize);
    if (frameId === "TIT2") tags.title = decodeTextFrame(frame);
    if (frameId === "TPE1") tags.artist = decodeTextFrame(frame);
    if (frameId === "TALB") tags.album = decodeTextFrame(frame);
    if (frameId === "TCON") tags.genre = decodeTextFrame(frame).replace(/^\(\d+\)/, "");
    if (frameId === "APIC" && !tags.coverBlob) tags.coverBlob = parsePictureFrame(frame);

    offset += 10 + frameSize;
  }

  return tags;
}

function saveLibraryState() {
  storageSet("favorites", JSON.stringify([...state.favorites]));
  storageSet("playlists", JSON.stringify(state.playlists));
  storageSet("language", state.language);
}

function makeId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function songIdForFile(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function waitForFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadSavedSongs() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readonly").objectStore(DB_STORE).getAll();
    request.onsuccess = async () => {
      const songs = await Promise.all(request.result.map(async (record) => {
        if (record.artist && record.album && record.genre && record.coverBlob !== undefined && record.waveform && record.waveformVersion === WAVEFORM_VERSION) return hydrateSong(record);
        const tags = await readAudioTags(record.file).catch(() => ({}));
        const waveform = await buildWaveform(record.file).catch(() => record.waveform || []);
        return hydrateSong({
          ...record,
          title: normalizeValue(tags.title, record.title),
          artist: normalizeValue(tags.artist, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c"),
          album: normalizeValue(tags.album, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0430\u043b\u044c\u0431\u043e\u043c"),
          genre: normalizeValue(tags.genre, "\u0411\u0435\u0437 \u0436\u0430\u043d\u0440\u0430"),
          coverBlob: tags.coverBlob || null,
          waveform,
          waveformVersion: WAVEFORM_VERSION,
        });
      }));
      resolve(songs);
      songs.forEach(saveSong);
    };
    request.onerror = () => reject(request.error);
  });
}

async function saveSong(song) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).put({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      genre: song.genre,
      file: song.file,
      coverBlob: song.coverBlob,
      duration: song.duration,
      waveform: song.waveform,
      waveformVersion: WAVEFORM_VERSION,
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function clearSongRecords() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteSongRecord(songId) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).delete(songId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function hydrateSong(record) {
  return {
    ...record,
    url: URL.createObjectURL(record.file),
    coverUrl: record.coverBlob ? URL.createObjectURL(record.coverBlob) : "",
  };
}

async function makeSong(file) {
  const fallbackTitle = file.name.replace(/\.[^/.]+$/, "");
  const tags = await readAudioTags(file).catch(() => ({}));
  const waveform = await buildWaveform(file).catch(() => []);
  return {
    id: songIdForFile(file),
    title: normalizeValue(tags.title, fallbackTitle),
    artist: normalizeValue(tags.artist, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c"),
    album: normalizeValue(tags.album, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0430\u043b\u044c\u0431\u043e\u043c"),
    genre: normalizeValue(tags.genre, "\u0411\u0435\u0437 \u0436\u0430\u043d\u0440\u0430"),
    file,
    url: URL.createObjectURL(file),
    coverBlob: tags.coverBlob || null,
    coverUrl: tags.coverBlob ? URL.createObjectURL(tags.coverBlob) : "",
    duration: 0,
    waveform,
    waveformVersion: WAVEFORM_VERSION,
  };
}

function currentSong() {
  return state.queue[state.currentIndex] || null;
}

function titleScriptRank(title) {
  const firstChar = (title || "").trim()[0] || "";
  if (/[A-Za-z0-9]/.test(firstChar)) return 0;
  if (/[\u0400-\u04ff]/.test(firstChar)) return 1;
  return 2;
}

function sortedSongs(songs = state.songs) {
  return [...songs].sort((a, b) => {
    const rankA = titleScriptRank(a.title);
    const rankB = titleScriptRank(b.title);
    if (rankA !== rankB) return rankA - rankB;
    const locale = rankA === 0 ? "en" : "ru";
    return a.title.localeCompare(b.title, locale, { sensitivity: "base", numeric: true });
  });
}

function matchesSongQuery(song, query) {
  return [song.title, song.artist, song.album, song.genre]
    .some((value) => String(value || "").toLowerCase().includes(query));
}

function visibleSongs() {
  const query = state.searchQuery.trim().toLowerCase();
  const songs = sortedSongs();
  if (!query) return songs;
  return songs.filter((song) => matchesSongQuery(song, query));
}

function favoriteSongs() {
  const query = state.favoriteSearchQuery.trim().toLowerCase();
  const songs = sortedSongs(state.songs.filter((song) => state.favorites.has(song.id)));
  if (!query) return songs;
  return songs.filter((song) => matchesSongQuery(song, query));
}

function shuffleSongs(songs) {
  const shuffled = [...songs];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
  }
  return shuffled;
}

function setQueue(songs, startId) {
  state.queue = songs;
  state.currentIndex = Math.max(0, songs.findIndex((song) => song.id === startId));
}

function renderPlaybackState() {
  const currentId = currentSong()?.id || "";
  document.querySelectorAll(".song-row[data-song-id]").forEach((row) => {
    const isCurrent = row.dataset.songId === currentId;
    const isPlaying = isCurrent && !audio.paused;
    row.classList.toggle("playing", isCurrent);
    row.querySelectorAll(".play-now, .play-preview").forEach((button) => {
      button.classList.toggle("pause-now", isPlaying);
      button.textContent = isPlaying ? "\u23f8" : "\u25b6";
      button.title = isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c";
    });
  });
  renderPlayer();
  renderSeek();
  if (queuePanel.classList.contains("open")) renderQueue();
  scheduleViewPagerHeightUpdate();
}

function playSong(song, queue = state.songs, openPlayer = false) {
  if (!song) return;
  const playbackQueue = queue?.length ? queue : state.songs;
  setQueue(playbackQueue, song.id);
  state.stopAfterCurrent = playbackQueue.length === 1;
  if (audio.src !== song.url) audio.src = song.url;
  audio.play().catch(() => renderPlaybackState());
  if (openPlayer) setPlayerOpen(true);
  else updateMiniPlayerVisibility();
  renderPlaybackState();
}

function playOrPauseSong(song, queue) {
  const isCurrent = currentSong()?.id === song.id;
  if (isCurrent && !audio.paused) {
    audio.pause();
    renderPlaybackState();
    return;
  }
  playSong(song, queue?.length ? queue : state.songs, false);
}

function openSongPlayer(song, queue) {
  const isCurrent = currentSong()?.id === song.id;
  if (!isCurrent) playSong(song, queue, true);
  else {
    setPlayerOpen(true);
    render();
  }
}

function togglePlay() {
  if (!currentSong()) return;
  if (audio.paused) audio.play().catch(() => renderPlaybackState());
  else audio.pause();
  renderPlaybackState();
}

function playNext() {
  if (!state.queue.length) return;
  if (state.loopMode === "one") {
    audio.currentTime = 0;
    audio.play().catch(() => renderPlaybackState());
    return;
  }
  if (state.stopAfterCurrent) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    state.queue = [];
    state.currentIndex = -1;
    state.stopAfterCurrent = false;
    setPlayerOpen(false);
    renderPlaybackState();
    return;
  }
  const isLast = state.currentIndex >= state.queue.length - 1;
  if (isLast && state.loopMode !== "all") {
    audio.pause();
    renderPlaybackState();
    return;
  }
  state.currentIndex = isLast ? 0 : state.currentIndex + 1;
  const song = currentSong();
  audio.src = song.url;
  audio.play().catch(() => renderPlaybackState());
  state.stopAfterCurrent = false;
  renderPlaybackState();
}

function playPrevious() {
  if (!state.queue.length) return;
  if (audio.currentTime > 4) {
    audio.currentTime = 0;
    return;
  }
  state.currentIndex = state.currentIndex <= 0 ? state.queue.length - 1 : state.currentIndex - 1;
  const song = currentSong();
  audio.src = song.url;
  audio.play().catch(() => renderPlaybackState());
  renderPlaybackState();
}

function toggleFavorite(songId) {
  if (state.favorites.has(songId)) state.favorites.delete(songId);
  else state.favorites.add(songId);
  saveLibraryState();
  render();
}

function removeSongFromPlaylist(playlistId, songId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist) return;
  playlist.songIds = playlist.songIds.filter((id) => id !== songId);
  state.pendingPlaylistIds.delete(songId);
  saveLibraryState();
  render();
}

function openConfirmDialog(title, message, onConfirm) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  pendingConfirmAction = onConfirm;
  openPanel(confirmPanel);
}

function closeConfirmDialog() {
  pendingConfirmAction = null;
  closePanel(confirmPanel);
}

function requestDeleteSong(songId) {
  const song = state.songs.find((item) => item.id === songId);
  if (!song) return;
  openConfirmDialog(
    "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u0435\u0441\u043d\u044e?",
    `\u0422\u0440\u0435\u043a "${song.title}" \u043f\u0440\u043e\u043f\u0430\u0434\u0435\u0442 \u0438\u0437 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f, \u043d\u043e \u0444\u0430\u0439\u043b \u043d\u0430 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435 \u043e\u0441\u0442\u0430\u043d\u0435\u0442\u0441\u044f.`,
    () => deleteSongFromApp(songId)
  );
}

async function deleteSongFromApp(songId) {
  const song = state.songs.find((item) => item.id === songId);
  if (!song) return;

  const currentId = currentSong()?.id;
  const deletedCurrent = currentId === songId;

  if (deletedCurrent) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  if (song.url) URL.revokeObjectURL(song.url);
  if (song.coverUrl) URL.revokeObjectURL(song.coverUrl);

  state.songs = state.songs.filter((item) => item.id !== songId);
  state.favorites.delete(songId);
  state.pendingFavoriteIds.delete(songId);
  state.pendingPlaylistIds.delete(songId);
  state.playlists.forEach((playlist) => {
    playlist.songIds = playlist.songIds.filter((id) => id !== songId);
  });
  state.queue = state.queue.filter((item) => item.id !== songId);
  state.groupDetailSongs = state.groupDetailSongs.filter((item) => item.id !== songId);

  if (deletedCurrent) {
    state.currentIndex = -1;
    setPlayerOpen(false);
  } else {
    state.currentIndex = state.queue.findIndex((item) => item.id === currentId);
  }

  saveLibraryState();
  await deleteSongRecord(songId).catch(() => {});
  render();
}


function renderSettings() {
  if (!settingsThemeValue || !settingsThemeToggle) return;
  const dark = state.theme === "dark";
  const rows = document.querySelectorAll("#settingsView .settings-row");
  rows[0]?.querySelector(".settings-title") && (rows[0].querySelector(".settings-title").textContent = t("theme"));
  rows[1]?.querySelector(".settings-title") && (rows[1].querySelector(".settings-title").textContent = t("language"));
  rows[3]?.querySelector(".settings-title") && (rows[3].querySelector(".settings-title").textContent = t("deleteSongs"));
  rows[3]?.querySelector(".settings-value") && (rows[3].querySelector(".settings-value").textContent = t("filesStay"));
  rows[4]?.querySelector(".settings-title") && (rows[4].querySelector(".settings-title").textContent = t("deletePlaylists"));
  rows[4]?.querySelector(".settings-value") && (rows[4].querySelector(".settings-value").textContent = t("songsStay"));
  settingsThemeValue.textContent = dark ? t("dark") : t("light");
  settingsThemeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
  languageEnglish?.classList.toggle("active", state.language === "en");
  languageRussian?.classList.toggle("active", state.language !== "en");
}

function setTheme(nextTheme) {
  state.theme = nextTheme || (state.theme === "dark" ? "light" : "dark");
  storageSet("theme", state.theme);
  applyTheme();
  scheduleViewPagerHeightUpdate();
}

function setLanguage(language) {
  state.language = language === "en" ? "en" : "ru";
  storageSet("language", state.language);
  applyLanguage();
  scheduleViewPagerHeightUpdate();
}

function requestDeleteAllSongs() {
  openConfirmDialog(
    state.language === "en" ? "Delete all songs?" : "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u0435\u0441\u043d\u0438?",
    state.language === "en" ? "Songs disappear only from the app. Files on the computer are not deleted." : "\u041f\u0435\u0441\u043d\u0438 \u0438\u0441\u0447\u0435\u0437\u043d\u0443\u0442 \u0442\u043e\u043b\u044c\u043a\u043e \u0438\u0437 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f. \u0424\u0430\u0439\u043b\u044b \u043d\u0430 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u0435 \u043d\u0435 \u0443\u0434\u0430\u043b\u044f\u0442\u0441\u044f.",
    deleteAllSongsFromApp
  );
}

async function deleteAllSongsFromApp() {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  state.songs.forEach((song) => {
    if (song.url) URL.revokeObjectURL(song.url);
    if (song.coverUrl) URL.revokeObjectURL(song.coverUrl);
  });
  state.songs = [];
  state.favorites.clear();
  state.playlists.forEach((playlist) => { playlist.songIds = []; });
  state.queue = [];
  state.currentIndex = -1;
  state.pendingFavoriteIds.clear();
  state.pendingPlaylistIds.clear();
  state.groupDetailSongs = [];
  setPlayerOpen(false);
  saveLibraryState();
  await clearSongRecords().catch(() => {});
  render();
}

function requestDeleteAllPlaylists() {
  openConfirmDialog(
    state.language === "en" ? "Delete all playlists?" : "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u044b?",
    state.language === "en" ? "Songs stay in the library." : "\u041f\u0435\u0441\u043d\u0438 \u043e\u0441\u0442\u0430\u043d\u0443\u0442\u0441\u044f \u0432 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0435.",
    deleteAllPlaylists
  );
}

function deleteAllPlaylists() {
  state.playlists = [];
  state.editingPlaylistId = null;
  state.viewingPlaylistId = null;
  state.pendingPlaylistIds.clear();
  closePanel(playlistAddPanel);
  closePanel(playlistDetailPanel);
  saveLibraryState();
  render();
}

function openSongActionPanel(songId) {
  const song = state.songs.find((item) => item.id === songId);
  if (!song) return;
  state.actionSongId = songId;
  songActionTitle.textContent = song.title;
  const favorite = state.favorites.has(songId);
  songActionFavorite.classList.toggle("active", favorite);
  songActionFavoriteIcon.textContent = favorite ? "\u2665" : "\u2661";
  songActionFavoriteText.textContent = favorite ? "\u0423\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e" : "\u0412 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435";
  openPanel(songActionPanel);
}

function closeSongActionPanel() {
  state.actionSongId = null;
  closePanel(songActionPanel);
}

function closePlaylistTargetPanel() {
  state.playlistTargetSongId = null;
  playlistTargetName.value = "";
  closePanel(playlistTargetPanel);
}

function addSongToPlaylist(playlistId, songId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist || !state.songs.some((song) => song.id === songId)) return;
  if (!playlist.songIds.includes(songId)) playlist.songIds.push(songId);
  saveLibraryState();
  closePlaylistTargetPanel();
  render();
}

function renderPlaylistTargetList() {
  const songId = state.playlistTargetSongId;
  playlistTargetList.replaceChildren(
    ...(state.playlists.length
      ? state.playlists.map((playlist) => {
        const button = document.createElement("button");
        const alreadyAdded = playlist.songIds.includes(songId);
        button.type = "button";
        button.disabled = alreadyAdded;
        button.innerHTML = `<span>${alreadyAdded ? "\u2713" : "+"}</span><span>${escapeHtml(playlist.name)}</span>`;
        button.addEventListener("click", () => addSongToPlaylist(playlist.id, songId));
        return button;
      })
      : [emptyMessage("\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u043e\u0432 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.")])
  );
}

function openPlaylistTargetPanel(songId) {
  const song = state.songs.find((item) => item.id === songId);
  if (!song) return;
  state.playlistTargetSongId = songId;
  playlistTargetTitle.textContent = `\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c "${song.title}"`;
  renderPlaylistTargetList();
  openPanel(playlistTargetPanel);
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function coverHtml(song, className = "") {
  if (song?.coverUrl) return `<img class="${className}" src="${song.coverUrl}" alt="" decoding="async" draggable="false" />`;
  return escapeHtml(song?.title?.trim().charAt(0).toUpperCase() || "\u266a");
}

function songSeed(song) {
  return [...song.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function songWaveform(song) {
  return song.waveform?.length ? song.waveform : Array.from({ length: 24 }, (_, index) => 20 + ((index * 19) % 70));
}

function simpleWaveformHtml(song) {
  const waveform = songWaveform(song);
  const seed = songSeed(song);
  const hueA = 150 + (seed % 45);
  return `<div class="waveform" aria-label="\u0413\u0440\u0430\u0444\u0438\u043a \u043f\u0435\u0441\u043d\u0438">${waveform.map((height, index) => {
    const hue = hueA + ((index * 9 + seed) % 36);
    const delay = (index % 6) * 90;
    return `<span style="height:${height}%; background:hsl(${hue} 78% 50%); animation-delay:${delay}ms"></span>`;
  }).join("")}</div>`;
}

function renderSongRow(song, queue, compact = false, options = {}) {
  const li = document.createElement("li");
  const safeTitle = escapeHtml(song.title);
  const isCurrent = currentSong()?.id === song.id;
  const isPlaying = isCurrent && !audio.paused;
  const playlistId = options.playlistId || "";
  const actionMenu = Boolean(options.actionMenu);
  const favoriteOnly = Boolean(options.favoriteOnly);
  li.className = "song-row";
  li.dataset.songId = song.id;
  li.classList.toggle("playing", isCurrent);
  li.innerHTML = `
    <div class="song-cover">${coverHtml(song)}</div>
    <div class="song-main">
      <span class="song-title">${safeTitle}</span>
      ${simpleWaveformHtml(song)}
    </div>
    <div class="song-actions">
      ${actionMenu ? `<button class="tiny-button song-menu" title="\u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430">\u22ef</button>` : ""}
      ${favoriteOnly ? `<button class="tiny-button favorite active" title="\u0423\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0433\u043e">\u2665</button>` : ""}
      ${compact && playlistId ? `<button class="tiny-button remove-from-playlist" title="\u0423\u0431\u0440\u0430\u0442\u044c \u0438\u0437 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0430">\u2212</button>` : ""}
      <button class="tiny-button play-now ${isPlaying ? "pause-now" : ""}" title="${isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c"}">${isPlaying ? "\u23f8" : "\u25b6"}</button>
    </div>
  `;
  li.querySelector(".song-title").addEventListener("click", () => playOrPauseSong(song, queue));
  li.querySelector(".song-cover").addEventListener("click", () => openSongPlayer(song, queue));
  li.querySelector(".waveform")?.addEventListener("click", (event) => {
    event.stopPropagation();
    openSongPlayer(song, queue);
  });
  li.querySelector(".play-now").addEventListener("click", () => playOrPauseSong(song, queue));
  li.querySelector(".song-menu")?.addEventListener("click", (event) => {
    event.stopPropagation();
    openSongActionPanel(song.id);
  });
  li.querySelector(".favorite")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFavorite(song.id);
  });
  li.querySelector(".remove-from-playlist")?.addEventListener("click", (event) => {
    event.stopPropagation();
    removeSongFromPlaylist(playlistId, song.id);
  });
  return li;
}

function renderFavoriteAddRow(song) {
  return renderSelectableSongRow(song, state.pendingFavoriteIds, "\u2665", sortedSongs());
}

function renderSongs() {
  emptyState.hidden = state.songs.length > 0;
  const songs = visibleSongs();
  songCount.textContent = state.songs.length;
  playAllButton.disabled = state.songs.length === 0;
  shuffleButton.disabled = state.songs.length === 0;
  songList.replaceChildren(
    ...(songs.length
      ? songs.map((song) => renderSongRow(song, songs, false, { actionMenu: true }))
      : state.songs.length
        ? [emptyMessage("\u041f\u043e \u044d\u0442\u043e\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u043f\u0435\u0441\u0435\u043d \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e.")]
        : [])
  );

  const favorites = favoriteSongs();
  favoritePlayAllButton.disabled = favorites.length === 0;
  favoriteShuffleButton.disabled = favorites.length === 0;
  favoriteList.replaceChildren(
    ...(favorites.length
      ? favorites.map((song) => renderSongRow(song, favorites, false, { favoriteOnly: true }))
      : [emptyMessage(state.favorites.size ? "\u041f\u043e \u044d\u0442\u043e\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u043c \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e." : "\u041b\u044e\u0431\u0438\u043c\u044b\u0435 \u043f\u0435\u0441\u043d\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u0437\u0434\u0435\u0441\u044c \u043f\u043e\u0441\u043b\u0435 \u043d\u0430\u0436\u0430\u0442\u0438\u044f \u043d\u0430 \u043b\u0430\u0439\u043a.")])
  );

}

function renderFavoriteAddList() {
  const scrollTop = favoriteAddList.scrollTop;
  const addableSongs = sortedSongs(state.songs.filter((song) => !state.favorites.has(song.id)));
  favoriteAddList.replaceChildren(
    ...(addableSongs.length
      ? addableSongs.map(renderFavoriteAddRow)
      : [emptyMessage("\u0412\u0441\u0435 \u043f\u0435\u0441\u043d\u0438 \u0443\u0436\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b \u0432 \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435.")])
  );
  favoriteAddList.scrollTop = scrollTop;
}

function emptyMessage(text) {
  const li = document.createElement("li");
  li.className = "empty-state";
  li.textContent = text;
  return li;
}

function renderPlayer() {
  const song = currentSong();
  if (!song) {
    updateMiniPlayerVisibility();
    return;
  }
  playerTitle.textContent = song.title;
  playerSubtitle.textContent = `${song.artist} \u2022 ${state.currentIndex + 1} \u0438\u0437 ${state.queue.length}`;
  coverArt.innerHTML = coverHtml(song);
  miniTitle.textContent = song.title;
  miniArtist.textContent = audio.paused ? `${song.artist} \u2022 \u043f\u0430\u0443\u0437\u0430` : song.artist;
  miniState.textContent = audio.paused ? "\u25b6" : "\u23f8";
  playButton.textContent = audio.paused ? "\u25b6" : "\u23f8";
  miniState.classList.toggle("pause-now", !audio.paused);
  playButton.classList.toggle("pause-now", !audio.paused);
  likeButton.classList.toggle("active", state.favorites.has(song.id));
  likeButton.firstChild.textContent = state.favorites.has(song.id) ? "\u2665" : "\u2661";
  loopLabel.textContent = loopText[state.loopMode];
  loopButton.dataset.loop = state.loopMode;
  loopButton.classList.toggle("active", state.loopMode !== "off");
  updateMiniPlayerVisibility();
}

function renderQueue() {
  const nextSongs = state.queue.length ? state.queue : sortedSongs();
  queueList.replaceChildren(
    ...(nextSongs.length
      ? nextSongs.map((song) => renderSongRow(song, nextSongs, true))
      : [emptyMessage("\u041e\u0447\u0435\u0440\u0435\u0434\u044c \u043f\u043e\u043a\u0430 \u043f\u0443\u0441\u0442\u0430\u044f.")])
  );
}

function renderPlaylists() {
  const query = state.playlistSearchQuery.trim().toLowerCase();
  const playlists = query
    ? state.playlists.filter((playlist) => playlist.name.toLowerCase().includes(query))
    : state.playlists;
  playlistList.replaceChildren(
    ...(playlists.length ? playlists.map(renderPlaylist) : [emptyPlaylist(query ? "\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d." : undefined)])
  );
}

function groupSongsBy(field) {
  const groups = new Map();
  for (const song of sortedSongs()) {
    const key = normalizeValue(song[field], field === "genre" ? "\u0411\u0435\u0437 \u0436\u0430\u043d\u0440\u0430" : "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u043e");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(song);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "ru", { sensitivity: "base" }));
}

function renderGroupCard(name, songs) {
  const firstSong = songs[0];
  const card = document.createElement("article");
  card.className = "group-card";
  card.innerHTML = `
    <div class="group-cover">${coverHtml(firstSong)}</div>
    <div class="group-main">
      <span class="group-title">${escapeHtml(name)}</span>
      <span class="group-meta">${songs.length} \u043f\u0435\u0441\u0435\u043d</span>
    </div>
    <div class="group-actions">
      <button class="tiny-button play-group" title="\u0418\u0433\u0440\u0430\u0442\u044c">\u25b6</button>
      <button class="tiny-button shuffle-group" title="\u0418\u0433\u0440\u0430\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e">\u21c4</button>
    </div>
  `;
  card.addEventListener("click", () => openGroupDetailPanel(name, songs));
  card.querySelector(".play-group").addEventListener("click", (event) => {
    event.stopPropagation();
    playSong(songs[0], songs, false);
  });
  card.querySelector(".shuffle-group").addEventListener("click", (event) => {
    event.stopPropagation();
    const shuffled = shuffleSongs(songs);
    playSong(shuffled[0], shuffled, false);
  });
  return card;
}

function openGroupDetailPanel(name, songs) {
  state.viewingPlaylistId = null;
  state.groupDetailSongs = sortedSongs(songs);
  state.groupDetailTitle = name;
  renderPlaylistDetail();
  openPanel(playlistDetailPanel);
}

function renderGroups() {
  const genres = groupSongsBy("genre");
  const artists = groupSongsBy("artist");
  const albums = groupSongsBy("album");

  genreList.replaceChildren(
    ...(genres.length ? genres.map(([name, songs]) => renderGroupCard(name, songs)) : [emptyMessage("\u0416\u0430\u043d\u0440\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043f\u0435\u0441\u0435\u043d \u0441 \u043c\u0435\u0442\u0430\u0434\u0430\u043d\u043d\u044b\u043c\u0438.")])
  );
  artistList.replaceChildren(
    ...(artists.length ? artists.map(([name, songs]) => renderGroupCard(name, songs)) : [emptyMessage("\u0418\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u0438 \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043f\u0435\u0441\u0435\u043d.")])
  );
  albumList.replaceChildren(
    ...(albums.length ? albums.map(([name, songs]) => renderGroupCard(name, songs)) : [emptyMessage("\u0410\u043b\u044c\u0431\u043e\u043c\u044b \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043f\u0435\u0441\u0435\u043d.")])
  );
}

function renderToolbar() {
  const activeView = state.activeView || "songs";
  document.querySelectorAll(".pill").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.view === activeView);
  });
}

function emptyPlaylist(text = "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u043b\u044e\u0441, \u0447\u0442\u043e\u0431\u044b \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u0439 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442.") {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = text;
  return div;
}

function renderPlaylist(playlist) {
  const card = document.createElement("article");
  const songs = sortedSongs(state.songs.filter((song) => playlist.songIds.includes(song.id)));
  const coverSongs = songs.length ? songs.slice(0, 6) : [];
  const shouldRotate = songs.length > 3;
  const tickerSongs = songs.length ? (shouldRotate ? [...songs, ...songs, ...songs] : songs) : [];
  const safeName = escapeHtml(playlist.name);
  card.className = "playlist-card";
  card.innerHTML = `
    <div class="playlist-header">
      <div>
        <span class="playlist-name">${safeName}</span>
        <span class="playlist-meta">${songs.length} \u043f\u0435\u0441\u0435\u043d</span>
      </div>
      <div class="playlist-actions">
        <button class="tiny-button play-playlist" title="\u0418\u0433\u0440\u0430\u0442\u044c \u043f\u043e \u043f\u043e\u0440\u044f\u0434\u043a\u0443">\u25b6</button>
        <button class="tiny-button shuffle-playlist" title="\u0418\u0433\u0440\u0430\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e">\u21c4</button>
        <button class="tiny-button delete-playlist danger" title="\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442">\u00d7</button>
      </div>
    </div>
    <div class="playlist-preview">
      <div class="playlist-cover-stack ${shouldRotate ? "rotating" : ""}" style="--cover-count:${Math.max(coverSongs.length, 1)}">
        ${coverSongs.length ? `<div class="playlist-cover-base">${coverHtml(coverSongs[0])}</div>${shouldRotate ? coverSongs.slice(1).map((song, index) => `<div class="playlist-cover-layer" style="animation-delay:${(index + 1) * 5}s">${coverHtml(song)}</div>`).join("") : ""}` : `<div class="playlist-cover-base">\u266a</div>`}
      </div>
      <div class="playlist-track-window">
        ${tickerSongs.length ? `<div class="playlist-track-ticker ${shouldRotate ? "" : "static"}">${tickerSongs.map((song) => `<span>${escapeHtml(song.title)}</span>`).join("")}</div>` : `<span class="playlist-empty-text">\u0412 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u0435\u0441\u0435\u043d.</span>`}
      </div>
    </div>
  `;
  card.addEventListener("click", (event) => {
    if (event.target.closest(".playlist-actions")) return;
    openPlaylistDetailPanel(playlist.id);
  });
  card.querySelector(".play-playlist").addEventListener("click", (event) => {
    event.stopPropagation();
    playSong(songs[0], songs, false);
  });
  card.querySelector(".shuffle-playlist").addEventListener("click", (event) => {
    event.stopPropagation();
    const shuffled = shuffleSongs(songs);
    playSong(shuffled[0], shuffled, false);
  });
  card.querySelector(".delete-playlist").addEventListener("click", (event) => {
    event.stopPropagation();
    requestDeletePlaylist(playlist.id);
  });
  return card;
}

function requestDeletePlaylist(playlistId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist) return;
  openConfirmDialog(
    "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442?",
    `\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 "${playlist.name}" \u0438\u0441\u0447\u0435\u0437\u043d\u0435\u0442, \u043d\u043e \u043f\u0435\u0441\u043d\u0438 \u043e\u0441\u0442\u0430\u043d\u0443\u0442\u0441\u044f \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438.`,
    () => deletePlaylist(playlistId)
  );
}

function deletePlaylist(playlistId) {
  state.playlists = state.playlists.filter((item) => item.id !== playlistId);
  if (state.viewingPlaylistId === playlistId) {
    state.viewingPlaylistId = null;
    closePanel(playlistDetailPanel);
  }
  if (state.editingPlaylistId === playlistId) {
    state.editingPlaylistId = null;
    state.pendingPlaylistIds.clear();
    closePanel(playlistAddPanel);
  }
  saveLibraryState();
  render();
}

function playlistSongs(playlistId) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  return playlist ? sortedSongs(state.songs.filter((song) => playlist.songIds.includes(song.id))) : [];
}

function openPlaylistDetailPanel(playlistId) {
  state.viewingPlaylistId = playlistId;
  renderPlaylistDetail();
  openPanel(playlistDetailPanel);
}

function renderPlaylistDetail() {
  const isPlaylist = Boolean(state.viewingPlaylistId);
  const playlist = isPlaylist ? state.playlists.find((item) => item.id === state.viewingPlaylistId) : null;
  const songs = isPlaylist ? playlistSongs(state.viewingPlaylistId) : state.groupDetailSongs;
  playlistDetailTitle.textContent = isPlaylist ? (playlist?.name || "\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442") : (state.groupDetailTitle || "\u0420\u0430\u0437\u0434\u0435\u043b");
  playlistDetailAddButton.hidden = !isPlaylist;
  playlistSequentialButton.disabled = songs.length === 0;
  playlistRandomButton.disabled = songs.length === 0;
  playlistDetailList.replaceChildren(
    ...(songs.length ? songs.map((song) => renderSongRow(song, songs, true, { playlistId: isPlaylist ? state.viewingPlaylistId : "" })) : [emptyMessage(isPlaylist ? "\u0412 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u0435\u0441\u0435\u043d." : "\u0412 \u044d\u0442\u043e\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u0435\u0441\u0435\u043d.")])
  );
}

function openPlaylistAddPanel(playlistId) {
  state.editingPlaylistId = playlistId;
  const playlist = state.playlists.find((item) => item.id === playlistId);
  playlistAddTitle.textContent = `\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 ${playlist?.name || "\u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442"}`;
  renderPlaylistAddList();
  openPanel(playlistAddPanel);
}

function renderPlaylistAddList() {
  const playlist = state.playlists.find((item) => item.id === state.editingPlaylistId);
  const scrollTop = playlistAddList.scrollTop;
  if (!playlist) {
    playlistAddList.replaceChildren(emptyMessage("\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d."));
    playlistAddList.scrollTop = scrollTop;
    return;
  }
  const availableSongs = sortedSongs(state.songs.filter((song) => !playlist.songIds.includes(song.id)));
  playlistAddList.replaceChildren(
    ...(availableSongs.length
      ? availableSongs.map((song) => renderPlaylistAddRow(song, playlist))
      : [emptyMessage("\u0412\u0441\u0435 \u043f\u0435\u0441\u043d\u0438 \u0443\u0436\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b \u0432 \u044d\u0442\u043e\u0442 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442.")])
  );
  playlistAddList.scrollTop = scrollTop;
}

function renderPlaylistAddRow(song, playlist) {
  return renderSelectableSongRow(song, state.pendingPlaylistIds, "+", playlistSongs(playlist.id));
}

function renderSelectableSongRow(song, selection, icon, queue = sortedSongs()) {
  const li = document.createElement("li");
  const safeTitle = escapeHtml(song.title);
  const selected = selection.has(song.id);
  const isCurrent = currentSong()?.id === song.id;
  const isPlaying = isCurrent && !audio.paused;
  li.className = "song-row selectable-row";
  li.dataset.songId = song.id;
  li.classList.toggle("selected", selected);
  li.innerHTML = `
    <div class="song-cover">${coverHtml(song)}</div>
    <div class="song-main">
      <span class="song-title">${safeTitle}</span>
      ${simpleWaveformHtml(song)}
    </div>
    <div class="song-actions">
      <button class="tiny-button select-now ${selected ? "active" : ""}" title="\u041f\u043e\u043c\u0435\u0442\u0438\u0442\u044c">${selected ? "\u2713" : icon}</button>
      <button class="tiny-button play-preview ${isPlaying ? "pause-now" : ""}" title="${isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c"}">${isPlaying ? "\u23f8" : "\u25b6"}</button>
    </div>
  `;
  const toggleSelection = () => {
    if (selection.has(song.id)) selection.delete(song.id);
    else selection.add(song.id);
    const selectedNow = selection.has(song.id);
    li.classList.toggle("selected", selectedNow);
    const button = li.querySelector(".select-now");
    button.classList.toggle("active", selectedNow);
    button.textContent = selectedNow ? "\u2713" : icon;
  };
  li.addEventListener("click", toggleSelection);
  li.querySelector(".select-now").addEventListener("click", (event) => {
    event.stopPropagation();
    toggleSelection();
  });
  li.querySelector(".play-preview").addEventListener("click", (event) => {
    event.stopPropagation();
    const previewQueue = queue.length ? queue : sortedSongs();
    playOrPauseSong(song, previewQueue.some((item) => item.id === song.id) ? previewQueue : sortedSongs());
  });
  return li;
}

function renderTimer() {
  if (!state.timerEndsAt) {
    timerLabel.textContent = "\u0422\u0430\u0439\u043c\u0435\u0440";
    return;
  }
  const left = Math.max(0, Math.ceil((state.timerEndsAt - Date.now()) / 1000));
  timerLabel.textContent = formatTime(left);
}

function renderSeek() {
  seekBar.max = Math.floor(audio.duration || 0);
  seekBar.value = Math.floor(audio.currentTime || 0);
  currentTime.textContent = formatTime(audio.currentTime);
  remainingTime.textContent = `-${formatTime((audio.duration || 0) - (audio.currentTime || 0))}`;
}

function render() {
  renderToolbar();
  renderSongs();
  renderPlayer();
  renderQueue();
  renderPlaylists();
  renderGroups();
  renderSettings();
  renderTimer();
  renderSeek();
  setViewTrackTransform();
  scheduleViewPagerHeightUpdate();
  if (favoriteAddPanel.classList.contains("open")) renderFavoriteAddList();
  if (playlistDetailPanel.classList.contains("open")) renderPlaylistDetail();
  if (playlistAddPanel.classList.contains("open")) renderPlaylistAddList();
  if (playlistTargetPanel.classList.contains("open")) renderPlaylistTargetList();
}

async function importSongs(files) {
  const existingIds = new Set(state.songs.map((song) => song.id));
  const newSongs = [];

  for (const file of files) {
    const songId = songIdForFile(file);
    if (existingIds.has(songId)) continue;
    const song = await makeSong(file).catch(() => null);
    if (!song) continue;
    existingIds.add(song.id);
    state.songs.push(song);
    newSongs.push(song);

    if (newSongs.length % 6 === 0) {
      render();
      await waitForFrame();
    }
  }

  await Promise.allSettled(newSongs.map(saveSong));
  render();
}

fileInput.addEventListener("change", async () => {
  await importSongs([...fileInput.files]);
  fileInput.value = "";
});

addMusicButton.addEventListener("click", () => {
  fileInput.click();
});

searchToggle.addEventListener("click", () => {
  searchRow.hidden = !searchRow.hidden;
  if (!searchRow.hidden) searchInput.focus();
  scheduleViewPagerHeightUpdate();
});

searchInput.addEventListener("input", () => {
  state.searchQuery = searchInput.value;
  renderSongs();
});

favoriteSearchToggle.addEventListener("click", () => {
  favoriteSearchRow.hidden = !favoriteSearchRow.hidden;
  if (!favoriteSearchRow.hidden) favoriteSearchInput.focus();
  scheduleViewPagerHeightUpdate();
});

favoriteSearchInput.addEventListener("input", () => {
  state.favoriteSearchQuery = favoriteSearchInput.value;
  renderSongs();
});

playlistSearchToggle.addEventListener("click", () => {
  playlistSearchRow.hidden = !playlistSearchRow.hidden;
  if (!playlistSearchRow.hidden) playlistSearchInput.focus();
  scheduleViewPagerHeightUpdate();
});

playlistSearchInput.addEventListener("input", () => {
  state.playlistSearchQuery = playlistSearchInput.value;
  renderPlaylists();
});

favoriteAddButton.addEventListener("click", () => {
  if (favoriteAddPanel.classList.contains("open")) {
    closePanel(favoriteAddPanel);
    state.pendingFavoriteIds.clear();
    render();
    return;
  }
  state.pendingFavoriteIds.clear();
  renderFavoriteAddList();
  openPanel(favoriteAddPanel);
});

document.querySelector("#closeFavoriteAdd").addEventListener("click", () => {
  closePanel(favoriteAddPanel);
  state.pendingFavoriteIds.clear();
});

confirmFavoriteAdd.addEventListener("click", () => {
  state.pendingFavoriteIds.forEach((id) => state.favorites.add(id));
  state.pendingFavoriteIds.clear();
  saveLibraryState();
  closePanel(favoriteAddPanel);
  render();
});

document.querySelector("#closePlaylistAdd").addEventListener("click", () => {
  closePanel(playlistAddPanel);
  state.editingPlaylistId = null;
  state.pendingPlaylistIds.clear();
});

confirmPlaylistAdd.addEventListener("click", () => {
  const playlist = state.playlists.find((item) => item.id === state.editingPlaylistId);
  if (playlist) {
    state.pendingPlaylistIds.forEach((id) => {
      if (!playlist.songIds.includes(id)) playlist.songIds.push(id);
    });
    saveLibraryState();
  }
  state.pendingPlaylistIds.clear();
  closePanel(playlistAddPanel);
  state.editingPlaylistId = null;
  render();
});

document.querySelector("#closePlaylistDetail").addEventListener("click", () => {
  closePanel(playlistDetailPanel);
  state.viewingPlaylistId = null;
  state.groupDetailSongs = [];
  state.groupDetailTitle = "";
});

playlistSequentialButton.addEventListener("click", () => {
  const songs = state.viewingPlaylistId ? playlistSongs(state.viewingPlaylistId) : state.groupDetailSongs;
  playSong(songs[0], songs, false);
});

playlistRandomButton.addEventListener("click", () => {
  const sourceSongs = state.viewingPlaylistId ? playlistSongs(state.viewingPlaylistId) : state.groupDetailSongs;
  const songs = shuffleSongs(sourceSongs);
  playSong(songs[0], songs, false);
});

document.querySelector("#closeSongAction").addEventListener("click", closeSongActionPanel);

songActionFavorite.addEventListener("click", () => {
  if (!state.actionSongId) return;
  toggleFavorite(state.actionSongId);
  openSongActionPanel(state.actionSongId);
});

songActionPlaylist.addEventListener("click", () => {
  if (!state.actionSongId) return;
  const songId = state.actionSongId;
  closeSongActionPanel();
  openPlaylistTargetPanel(songId);
});

songActionDelete.addEventListener("click", () => {
  if (!state.actionSongId) return;
  const songId = state.actionSongId;
  closeSongActionPanel();
  requestDeleteSong(songId);
});

document.querySelector("#closePlaylistTarget").addEventListener("click", closePlaylistTargetPanel);

createPlaylistTarget.addEventListener("click", () => {
  const songId = state.playlistTargetSongId;
  if (!songId) return;
  const name = playlistTargetName.value.trim() || `\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 ${state.playlists.length + 1}`;
  const playlist = { id: makeId(), name, songIds: [songId] };
  state.playlists.push(playlist);
  saveLibraryState();
  closePlaylistTargetPanel();
  render();
});

confirmNo.addEventListener("click", closeConfirmDialog);

confirmYes.addEventListener("click", async () => {
  const action = pendingConfirmAction;
  closeConfirmDialog();
  if (action) await action();
});

playlistDetailAddButton.addEventListener("click", () => {
  if (!state.viewingPlaylistId) return;
  if (playlistAddPanel.classList.contains("open") && state.editingPlaylistId === state.viewingPlaylistId) {
    closePanel(playlistAddPanel);
    state.pendingPlaylistIds.clear();
    state.editingPlaylistId = null;
    render();
    return;
  }
  openPlaylistAddPanel(state.viewingPlaylistId);
});

[favoriteAddPanel, playlistAddPanel, playlistDetailPanel, queuePanel, timerPanel, songActionPanel, playlistTargetPanel, confirmPanel].forEach((panel) => {
  panel.addEventListener("click", (event) => {
    if (event.target !== panel) return;
    closePanel(panel);
    if (panel === favoriteAddPanel) state.pendingFavoriteIds.clear();
    if (panel === playlistAddPanel) {
      state.pendingPlaylistIds.clear();
      state.editingPlaylistId = null;
    }
    if (panel === playlistDetailPanel) {
      state.viewingPlaylistId = null;
      state.groupDetailSongs = [];
      state.groupDetailTitle = "";
    }
    if (panel === songActionPanel) state.actionSongId = null;
    if (panel === playlistTargetPanel) {
      state.playlistTargetSongId = null;
      playlistTargetName.value = "";
    }
    if (panel === confirmPanel) pendingConfirmAction = null;
  });
});

function selectView(viewName, options = {}) {
  if (!viewNames.includes(viewName)) return;
  state.activeView = viewName;
  storageSet("activeView", viewName);
  document.querySelectorAll(".pill").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  document.querySelectorAll(".view").forEach((view) => {
    const active = view.id === `${viewName}View`;
    view.classList.toggle("active", active);
    view.setAttribute("aria-hidden", active ? "false" : "true");
  });
  setViewTrackTransform();
  scheduleViewPagerHeightUpdate();
  if (!options.skipTabScroll) scrollActiveTabIntoView();
}

function setupInfiniteToolbar() {
  const originalTabs = [...toolbar.querySelectorAll(".pill:not(.tab-clone)")];
  const fileInputNode = toolbar.querySelector("#fileInput");
  const prependTabs = originalTabs.map((tab) => {
    const clone = tab.cloneNode(true);
    clone.classList.add("tab-clone");
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });
  const appendTabs = originalTabs.map((tab) => {
    const clone = tab.cloneNode(true);
    clone.classList.add("tab-clone");
    clone.setAttribute("aria-hidden", "true");
    return clone;
  });

  toolbar.prepend(...prependTabs);
  if (fileInputNode) toolbar.append(fileInputNode);
  toolbar.append(...appendTabs);

  requestAnimationFrame(() => {
    const cycleWidth = toolbar.scrollWidth / 3;
    toolbar.scrollLeft = cycleWidth;
  });

  toolbar.addEventListener("scroll", () => {
    const cycleWidth = toolbar.scrollWidth / 3;
    if (cycleWidth <= 0) return;
    if (toolbar.scrollLeft < cycleWidth * 0.45) toolbar.scrollLeft += cycleWidth;
    if (toolbar.scrollLeft > cycleWidth * 1.55) toolbar.scrollLeft -= cycleWidth;
  });

  let isDragging = false;
  let didDragToolbar = false;
  let suppressNextToolbarClick = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  toolbar.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    isDragging = true;
    didDragToolbar = false;
    dragStartX = event.clientX;
    dragStartScroll = toolbar.scrollLeft;
    toolbar.setPointerCapture?.(event.pointerId);
  });

  toolbar.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) <= 8 && !didDragToolbar) return;
    didDragToolbar = true;
    suppressNextToolbarClick = true;
    toolbar.classList.add("dragging");
    toolbar.scrollLeft = dragStartScroll - delta;
    event.preventDefault();
  });

  const stopToolbarDrag = (event) => {
    if (!isDragging) return;
    const wasDrag = didDragToolbar;
    isDragging = false;
    toolbar.releasePointerCapture?.(event.pointerId);
    toolbar.classList.remove("dragging");

    if (!wasDrag) {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const button = target?.closest?.(".pill");
      if (button && toolbar.contains(button)) {
        selectView(button.dataset.view);
        renderToolbar();
        suppressNextToolbarClick = true;
      }
    }
  };

  toolbar.addEventListener("pointerup", stopToolbarDrag);
  toolbar.addEventListener("pointercancel", stopToolbarDrag);
  toolbar.addEventListener("lostpointercapture", () => {
    isDragging = false;
    toolbar.classList.remove("dragging");
  });

  toolbar.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    toolbar.scrollLeft += event.deltaY;
    event.preventDefault();
  }, { passive: false });

  toolbar.addEventListener("click", (event) => {
    if (!suppressNextToolbarClick) return;
    suppressNextToolbarClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

function setupViewPager() {
  if (!viewPager || !viewTrack) return;

  let isDragging = false;
  let dragMode = "";
  let startX = 0;
  let startY = 0;
  let dragOffset = 0;
  let suppressNextPagerClick = false;

  const finishDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    viewPager.releasePointerCapture?.(event.pointerId);
    viewPager.classList.remove("dragging");

    if (dragMode === "x") {
      const width = viewPager.clientWidth || window.innerWidth;
      const threshold = Math.min(90, width * 0.22);
      const currentIndex = activeViewIndex();
      let nextIndex = currentIndex;

      if (Math.abs(dragOffset) > threshold) {
        nextIndex = dragOffset < 0
          ? Math.min(viewNames.length - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);
      }

      suppressNextPagerClick = true;
      selectView(viewNames[nextIndex], { skipTabScroll: false });
      setViewTrackTransform();
    }

    dragMode = "";
    dragOffset = 0;
  };

  viewPager.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest("input, textarea, select")) return;
    isDragging = true;
    dragMode = "";
    dragOffset = 0;
    startX = event.clientX;
    startY = event.clientY;
    viewPager.setPointerCapture?.(event.pointerId);
  });

  viewPager.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragMode && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
      dragMode = Math.abs(deltaX) > Math.abs(deltaY) * 1.15 ? "x" : "y";
    }

    if (dragMode !== "x") return;

    const currentIndex = activeViewIndex();
    const atStart = currentIndex === 0 && deltaX > 0;
    const atEnd = currentIndex === viewNames.length - 1 && deltaX < 0;
    dragOffset = atStart || atEnd ? deltaX * 0.28 : deltaX;
    viewPager.classList.add("dragging");
    setViewTrackTransform(dragOffset);
    event.preventDefault();
  }, { passive: false });

  viewPager.addEventListener("pointerup", finishDrag);
  viewPager.addEventListener("pointercancel", finishDrag);
  viewPager.addEventListener("lostpointercapture", () => {
    if (!isDragging) return;
    isDragging = false;
    dragMode = "";
    dragOffset = 0;
    viewPager.classList.remove("dragging");
    setViewTrackTransform();
  });

  viewPager.addEventListener("click", (event) => {
    if (!suppressNextPagerClick) return;
    suppressNextPagerClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  window.addEventListener("resize", () => {
    setViewTrackTransform();
    scheduleViewPagerHeightUpdate();
  });

  document.addEventListener("load", (event) => {
    if (event.target?.matches?.(".song-cover img, .group-cover img, .cover-art img")) {
      scheduleViewPagerHeightUpdate();
    }
  }, true);
}

toolbar.addEventListener("click", (event) => {
  const button = event.target.closest(".pill");
  if (!button) return;
  selectView(button.dataset.view);
  renderToolbar();
});

document.querySelector("#newPlaylistButton").addEventListener("click", (event) => {
  event.stopPropagation();
  playlistForm.classList.toggle("active");
  playlistName.focus();
  scheduleViewPagerHeightUpdate();
});

document.addEventListener("pointerdown", (event) => {
  if (!playlistForm.classList.contains("active")) return;
  if (playlistForm.contains(event.target) || event.target.closest("#newPlaylistButton")) return;
  playlistForm.classList.remove("active");
  scheduleViewPagerHeightUpdate();
}, true);

playAllButton.addEventListener("click", () => {
  const songs = sortedSongs();
  playSong(songs[0], songs, false);
});

shuffleButton.addEventListener("click", () => {
  const songs = shuffleSongs(sortedSongs());
  playSong(songs[0], songs, false);
});

favoritePlayAllButton.addEventListener("click", () => {
  const songs = favoriteSongs();
  playSong(songs[0], songs, false);
});

favoriteShuffleButton.addEventListener("click", () => {
  const songs = shuffleSongs(favoriteSongs());
  playSong(songs[0], songs, false);
});

document.querySelector("#savePlaylistButton").addEventListener("click", () => {
  const name = playlistName.value.trim() || `\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 ${state.playlists.length + 1}`;
  state.playlists.push({ id: makeId(), name, songIds: [] });
  playlistName.value = "";
  playlistForm.classList.remove("active");
  saveLibraryState();
  render();
});

miniPlayer.addEventListener("click", () => {
  const song = currentSong();
  if (song) openSongPlayer(song, state.queue);
});

miniState.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePlay();
  render();
});

document.querySelector("#closePlayer").addEventListener("click", () => {
  setPlayerOpen(false);
});

themeToggle?.addEventListener("click", () => setTheme());
settingsThemeToggle?.addEventListener("click", () => setTheme());
languageEnglish?.addEventListener("click", () => setLanguage("en"));
languageRussian?.addEventListener("click", () => setLanguage("ru"));
deleteAllSongsButton?.addEventListener("click", requestDeleteAllSongs);
deleteAllPlaylistsButton?.addEventListener("click", requestDeleteAllPlaylists);

document.querySelector("#queueButton").addEventListener("click", () => openPanel(queuePanel));
document.querySelector("#closeQueue").addEventListener("click", () => closePanel(queuePanel));
document.querySelector("#timerButton").addEventListener("click", () => openPanel(timerPanel));
document.querySelector("#closeTimer").addEventListener("click", () => closePanel(timerPanel));
playButton.addEventListener("click", togglePlay);
document.querySelector("#nextButton").addEventListener("click", playNext);
document.querySelector("#prevButton").addEventListener("click", playPrevious);

likeButton.addEventListener("click", () => {
  const song = currentSong();
  if (song) toggleFavorite(song.id);
});

loopButton.addEventListener("click", () => {
  state.loopMode = state.loopMode === "off" ? "one" : state.loopMode === "one" ? "all" : "off";
  render();
});

seekBar.addEventListener("input", () => {
  audio.currentTime = Number(seekBar.value);
});

function setSleepTimer(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return;
  clearTimeout(state.timerId);
  state.timerEndsAt = Date.now() + minutes * 60 * 1000;
  state.timerId = setTimeout(() => {
    audio.pause();
    state.timerEndsAt = null;
    render();
  }, minutes * 60 * 1000);
  closePanel(timerPanel);
  render();
}

document.querySelectorAll("[data-minutes]").forEach((button) => {
  button.addEventListener("click", () => {
    setSleepTimer(Number(button.dataset.minutes));
  });
});

document.querySelector("#customTimer").addEventListener("click", () => {
  customTimerRow.hidden = !customTimerRow.hidden;
  if (!customTimerRow.hidden) customTimerInput.focus();
});

startCustomTimer.addEventListener("click", () => {
  setSleepTimer(Number(customTimerInput.value));
  customTimerInput.value = "";
  customTimerRow.hidden = true;
});

customTimerInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  startCustomTimer.click();
});

audio.addEventListener("play", renderPlaybackState);
audio.addEventListener("pause", renderPlaybackState);
audio.addEventListener("ended", playNext);
audio.addEventListener("timeupdate", renderSeek);
audio.addEventListener("loadedmetadata", () => {
  const song = currentSong();
  if (song) {
    song.duration = audio.duration;
    saveSong(song);
  }
  render();
});

applyTheme();
applyLanguage();
selectView(state.activeView, { skipTabScroll: true });
setInterval(renderTimer, 1000);
setupInfiniteToolbar();
setupViewPager();
loadSavedSongs()
  .then((songs) => {
    state.songs = songs;
    render();
  })
  .catch(() => render());

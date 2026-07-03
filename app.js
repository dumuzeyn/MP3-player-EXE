const audio = document.querySelector("#audio");
const fileInput = document.querySelector("#fileInput");
const songList = document.querySelector("#songList");
const favoriteList = document.querySelector("#favoriteList");
const playlistList = document.querySelector("#playlistList");
const emptyState = document.querySelector("#emptyState");
const miniPlayer = document.querySelector("#miniPlayer");
const miniCover = document.querySelector("#miniCover");
const miniTitle = document.querySelector("#miniTitle");
const miniArtist = document.querySelector("#miniArtist");
const miniState = document.querySelector("#miniState");
const playerSheet = document.querySelector("#playerSheet");
const themeToggle = document.querySelector("#themeToggle");
const settingsThemeToggle = document.querySelector("#settingsThemeToggle");
const settingsThemeValue = document.querySelector("#settingsThemeValue");
const languageSelect = document.querySelector("#languageSelect");
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
const likeIcon = document.querySelector("#likeIcon");
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
const playlistAddSearchInput = document.querySelector("#playlistAddSearchInput");
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
const nextSongPreloader = new Audio();
nextSongPreloader.preload = "auto";

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
  playlistAddSearchQuery: "",
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
let sortedSongsCache = { signature: "", songs: [] };
let refreshViewClones = () => {};

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
    addAudioHint: ["Press plus or drag music files here.", "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043f\u043b\u044e\u0441 \u0438\u043b\u0438 \u043f\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u043c\u0443\u0437\u044b\u043a\u0443 \u0441 \u043a\u043e\u043c\u043f\u044c\u044e\u0442\u0435\u0440\u0430."],
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
  if (playlistAddSearchInput) playlistAddSearchInput.placeholder = t("searchSong");
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

function visualViewIndex(viewName = state.activeView) {
  const index = viewNames.indexOf(viewName);
  return (index === -1 ? 0 : index) + 1;
}

function setViewTrackTransform(offsetPx = 0, viewName = state.activeView) {
  if (!viewTrack) return;
  const index = visualViewIndex(viewName);
  viewTrack.style.transform = `translate3d(calc(${-index * 100}% + ${Math.round(offsetPx)}px), 0, 0)`;
}

function setViewTrackVisualIndex(index, offsetPx = 0) {
  if (!viewTrack) return;
  viewTrack.style.transform = `translate3d(calc(${-index * 100}% + ${Math.round(offsetPx)}px), 0, 0)`;
}

function withoutViewTrackTransition(callback) {
  if (!viewTrack) return;
  const previousTransition = viewTrack.style.transition;
  viewTrack.style.transition = "none";
  callback();
  viewTrack.offsetHeight;
  viewTrack.style.transition = previousTransition;
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
      const songs = [];
      const records = request.result || [];
      const missingCoverPaths = records
        .filter((record) => record.filePath && !record.coverDataUrl)
        .map((record) => record.filePath);
      const freshRecords = missingCoverPaths.length && window.mp3PlayerNative?.readAudioFiles
        ? await window.mp3PlayerNative.readAudioFiles(missingCoverPaths).catch(() => [])
        : [];
      const freshByPath = new Map(freshRecords.map((record) => [record.filePath, record]));
      for (const record of records) {
        if (record.filePath) {
          let nextRecord = record;
          if (!record.coverDataUrl && window.mp3PlayerNative?.readAudioFiles) {
            const fresh = freshByPath.get(record.filePath);
            if (fresh) {
              nextRecord = {
                ...record,
                title: normalizeValue(fresh.title, record.title),
                artist: normalizeValue(fresh.artist, record.artist),
                album: normalizeValue(fresh.album, record.album),
                genre: normalizeValue(fresh.genre, record.genre),
                coverDataUrl: fresh.coverDataUrl || record.coverDataUrl || "",
                fileUrl: fresh.fileUrl || record.fileUrl,
                fileSize: fresh.size || record.fileSize,
                fileLastModified: fresh.lastModified || record.fileLastModified,
              };
            }
          }
          songs.push(hydrateSong(nextRecord));
          continue;
        }
        if (record.artist && record.album && record.genre && record.coverBlob !== undefined && record.waveform && record.waveformVersion === WAVEFORM_VERSION) {
          songs.push(hydrateSong(record));
          continue;
        }
        const tags = await readAudioTags(record.file).catch(() => ({}));
        const waveform = await buildWaveform(record.file).catch(() => record.waveform || []);
        songs.push(hydrateSong({
          ...record,
          title: normalizeValue(tags.title, record.title),
          artist: normalizeValue(tags.artist, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c"),
          album: normalizeValue(tags.album, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0430\u043b\u044c\u0431\u043e\u043c"),
          genre: normalizeValue(tags.genre, "\u0411\u0435\u0437 \u0436\u0430\u043d\u0440\u0430"),
          coverBlob: tags.coverBlob || null,
          waveform,
          waveformVersion: WAVEFORM_VERSION,
        }));
      }
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
      file: song.file || null,
      filePath: song.filePath || "",
      fileUrl: song.fileUrl || "",
      fileName: song.fileName || "",
      fileSize: song.fileSize || 0,
      fileLastModified: song.fileLastModified || 0,
      coverBlob: song.coverBlob,
      coverDataUrl: song.coverDataUrl || "",
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
  if (record.filePath) {
    return {
      ...record,
      file: null,
      url: record.fileUrl,
      coverUrl: record.coverDataUrl || (record.coverBlob ? URL.createObjectURL(record.coverBlob) : ""),
    };
  }

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

async function makeSongFromNativeRecord(record) {
  const fallbackTitle = record.name.replace(/\.[^/.]+$/, "");
  const waveform = await buildWaveform({
    name: record.name,
    size: record.size,
    lastModified: record.lastModified,
  }).catch(() => []);

  return {
    id: record.filePath || `${record.name}-${record.size}-${record.lastModified}`,
    title: normalizeValue(record.title, fallbackTitle),
    artist: normalizeValue(record.artist, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c"),
    album: normalizeValue(record.album, "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0430\u043b\u044c\u0431\u043e\u043c"),
    genre: normalizeValue(record.genre, "\u0411\u0435\u0437 \u0436\u0430\u043d\u0440\u0430"),
    file: null,
    filePath: record.filePath,
    fileUrl: record.fileUrl,
    fileName: record.name,
    fileSize: record.size,
    fileLastModified: record.lastModified,
    url: record.fileUrl,
    coverBlob: null,
    coverDataUrl: record.coverDataUrl || "",
    coverUrl: record.coverDataUrl || "",
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

function sortedSongsSignature(songs) {
  return `${songs.length}:${songs.map((song) => song.id).join("|")}`;
}

function sortedSongs(songs = state.songs) {
  if (songs === state.songs) {
    const signature = sortedSongsSignature(songs);
    if (sortedSongsCache.signature === signature) return sortedSongsCache.songs;
    sortedSongsCache = { signature, songs: sortSongList(songs) };
    return sortedSongsCache.songs;
  }
  return sortSongList(songs);
}

function sortSongList(songs) {
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

function updateSongRowState(row, isCurrent, isPlaying) {
  row.classList.toggle("playing", isCurrent);
  row.querySelectorAll(".play-now, .play-preview").forEach((button) => {
    button.classList.toggle("pause-now", isPlaying);
    button.textContent = isPlaying ? "II" : "\u25b6";
    button.title = isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c";
  });
}

function renderPlaybackState() {
  const currentId = currentSong()?.id || "";
  document.querySelectorAll(".song-row.playing").forEach((row) => {
    const isCurrent = row.dataset.songId === currentId;
    updateSongRowState(row, isCurrent, false);
  });

  if (currentId) {
    document
      .querySelectorAll(`.song-row[data-song-id="${CSS.escape(currentId)}"]`)
      .forEach((row) => updateSongRowState(row, true, !audio.paused));
  }

  renderPlayer();
  renderSeek();
  if (queuePanel.classList.contains("open")) renderQueue();
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
  if (!isCurrent) {
    playSong(song, queue, true);
    return;
  }

  setPlayerOpen(true);
  renderPlayer();
  renderSeek();
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

function preloadNextSong() {
  if (!state.queue.length || state.currentIndex < 0) return;
  const nextIndex = state.currentIndex >= state.queue.length - 1 ? 0 : state.currentIndex + 1;
  const nextSong = state.queue[nextIndex];
  if (!nextSong?.url || nextSong.url === nextSongPreloader.src) return;
  nextSongPreloader.src = nextSong.url;
  nextSongPreloader.load();
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

  if (song.url && !song.filePath) URL.revokeObjectURL(song.url);
  if (song.coverUrl && !song.coverDataUrl) URL.revokeObjectURL(song.coverUrl);

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
  settingsThemeToggle.querySelector(".settings-title").textContent = t("theme");
  document.querySelector(".settings-language .settings-title").textContent = t("language");
  deleteAllSongsButton.querySelector(".settings-title").textContent = t("deleteSongs");
  deleteAllSongsButton.querySelector(".settings-value").textContent = t("filesStay");
  deleteAllPlaylistsButton.querySelector(".settings-title").textContent = t("deletePlaylists");
  deleteAllPlaylistsButton.querySelector(".settings-value").textContent = t("songsStay");
  settingsThemeValue.textContent = dark ? t("dark") : t("light");
  settingsThemeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";
  if (languageSelect) languageSelect.value = state.language;
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
    if (song.coverUrl && !song.coverDataUrl) URL.revokeObjectURL(song.coverUrl);
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

function mediaArtwork(song) {
  if (!song?.coverUrl) return [];
  const dataType = String(song.coverDataUrl || song.coverUrl).match(/^data:([^;,]+)/)?.[1] || "image/jpeg";
  return [
    { src: song.coverUrl, sizes: "96x96", type: dataType },
    { src: song.coverUrl, sizes: "256x256", type: dataType },
    { src: song.coverUrl, sizes: "512x512", type: dataType },
  ];
}

function updateMediaSessionPosition() {
  if (!("mediaSession" in navigator) || typeof navigator.mediaSession.setPositionState !== "function") return;
  const duration = Number(audio.duration);
  const position = Number(audio.currentTime);
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(position)) return;
  try {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: audio.playbackRate || 1,
      position: Math.min(Math.max(position, 0), duration),
    });
  } catch {}
}

function updateMediaSession() {
  if (!("mediaSession" in navigator)) return;
  const song = currentSong();
  try {
    navigator.mediaSession.playbackState = song ? (audio.paused ? "paused" : "playing") : "none";
    navigator.mediaSession.metadata = song && "MediaMetadata" in window
      ? new MediaMetadata({
        title: song.title || "\u041f\u0435\u0441\u043d\u044f",
        artist: song.artist || "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c",
        album: song.album || "",
        artwork: mediaArtwork(song),
      })
      : null;
    updateMediaSessionPosition();
  } catch {}
}

function setupMediaSessionControls() {
  if (!("mediaSession" in navigator)) return;
  const setHandler = (name, handler) => {
    try {
      navigator.mediaSession.setActionHandler(name, handler);
    } catch {}
  };
  setHandler("play", () => {
    if (currentSong() && audio.paused) togglePlay();
  });
  setHandler("pause", () => {
    if (currentSong() && !audio.paused) togglePlay();
  });
  setHandler("previoustrack", playPrevious);
  setHandler("nexttrack", playNext);
  setHandler("seekbackward", (details = {}) => {
    audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10));
    updateMediaSessionPosition();
  });
  setHandler("seekforward", (details = {}) => {
    const duration = Number(audio.duration);
    const nextTime = audio.currentTime + (details.seekOffset || 10);
    audio.currentTime = Number.isFinite(duration) ? Math.min(duration, nextTime) : nextTime;
    updateMediaSessionPosition();
  });
  setHandler("seekto", (details = {}) => {
    if (!Number.isFinite(details.seekTime)) return;
    if (details.fastSeek && typeof audio.fastSeek === "function") audio.fastSeek(details.seekTime);
    else audio.currentTime = details.seekTime;
    updateMediaSessionPosition();
  });
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
      <button class="tiny-button play-now ${isPlaying ? "pause-now" : ""}" title="${isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c"}">${isPlaying ? "II" : "\u25b6"}</button>
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

function updateCover(container, song) {
  if (!container || !song) return;
  if (container.dataset.songId === song.id) return;
  container.dataset.songId = song.id;
  container.innerHTML = coverHtml(song);
}

function renderPlayer() {
  const song = currentSong();
  if (!song) {
    updateMiniPlayerVisibility();
    updateMediaSession();
    return;
  }
  playerTitle.textContent = song.title;
  playerSubtitle.textContent = `${song.artist} \u2022 ${state.currentIndex + 1} \u0438\u0437 ${state.queue.length}`;
  updateCover(coverArt, song);
  updateCover(miniCover, song);
  miniTitle.textContent = song.title;
  miniArtist.textContent = audio.paused ? `${song.artist} \u2022 \u043f\u0430\u0443\u0437\u0430` : song.artist;
  miniState.textContent = audio.paused ? "\u25b6" : "II";
  playButton.textContent = audio.paused ? "\u25b6" : "II";
  miniState.classList.toggle("pause-now", !audio.paused);
  playButton.classList.toggle("pause-now", !audio.paused);
  likeButton.classList.toggle("active", state.favorites.has(song.id));
  likeIcon.textContent = state.favorites.has(song.id) ? "\u2665" : "\u2661";
  loopLabel.textContent = loopText[state.loopMode];
  loopButton.dataset.loop = state.loopMode;
  loopButton.classList.toggle("active", state.loopMode !== "off");
  updateMiniPlayerVisibility();
  updateMediaSession();
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
  const safeName = escapeHtml(playlist.name);
  card.className = "playlist-card";
  card.innerHTML = `
    <div class="playlist-cover-stack ${shouldRotate ? "rotating" : ""}" style="--cover-count:${Math.max(coverSongs.length, 1)}">
      ${coverSongs.length ? `<div class="playlist-cover-base">${coverHtml(coverSongs[0])}</div>${shouldRotate ? coverSongs.slice(1).map((song, index) => `<div class="playlist-cover-layer" style="animation-delay:${(index + 1) * 5}s">${coverHtml(song)}</div>`).join("") : ""}` : `<div class="playlist-cover-base">\u266a</div>`}
    </div>
    <div class="playlist-main">
      <div class="playlist-header">
        <span class="playlist-name">${safeName}</span>
        <span class="playlist-meta">${songs.length} \u043f\u0435\u0441\u0435\u043d</span>
      </div>
      ${songs[0] ? `<span class="playlist-preview-title">${escapeHtml(songs[0].title)}</span>` : `<span class="playlist-preview-title">\u0412 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043f\u0435\u0441\u0435\u043d.</span>`}
    </div>
    <div class="playlist-actions">
      <button class="tiny-button play-playlist" title="\u0418\u0433\u0440\u0430\u0442\u044c \u043f\u043e \u043f\u043e\u0440\u044f\u0434\u043a\u0443">\u25b6</button>
      <button class="tiny-button shuffle-playlist" title="\u0418\u0433\u0440\u0430\u0442\u044c \u0441\u043b\u0443\u0447\u0430\u0439\u043d\u043e">\u21c4</button>
      <button class="tiny-button delete-playlist danger" title="\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442">\u00d7</button>
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
  state.playlistAddSearchQuery = "";
  if (playlistAddSearchInput) playlistAddSearchInput.value = "";
  const playlist = state.playlists.find((item) => item.id === playlistId);
  playlistAddTitle.textContent = `\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0432 ${playlist?.name || "\u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442"}`;
  renderPlaylistAddList();
  openPanel(playlistAddPanel);
  requestAnimationFrame(() => playlistAddSearchInput?.focus());
}

function renderPlaylistAddList() {
  const playlist = state.playlists.find((item) => item.id === state.editingPlaylistId);
  const scrollTop = playlistAddList.scrollTop;
  if (!playlist) {
    playlistAddList.replaceChildren(emptyMessage("\u041f\u043b\u0435\u0439\u043b\u0438\u0441\u0442 \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d."));
    playlistAddList.scrollTop = scrollTop;
    return;
  }
  const query = state.playlistAddSearchQuery.trim().toLowerCase();
  const availableSongs = sortedSongs(state.songs.filter((song) => {
    if (playlist.songIds.includes(song.id)) return false;
    return !query || matchesSongQuery(song, query);
  }));
  playlistAddList.replaceChildren(
    ...(availableSongs.length
      ? availableSongs.map((song) => renderPlaylistAddRow(song, playlist))
      : [emptyMessage(query ? "\u041f\u0435\u0441\u043d\u0438 \u043f\u043e \u044d\u0442\u043e\u043c\u0443 \u043f\u043e\u0438\u0441\u043a\u0443 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b." : "\u0412\u0441\u0435 \u043f\u0435\u0441\u043d\u0438 \u0443\u0436\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b \u0432 \u044d\u0442\u043e\u0442 \u043f\u043b\u0435\u0439\u043b\u0438\u0441\u0442.")])
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
      <button class="tiny-button play-preview ${isPlaying ? "pause-now" : ""}" title="${isPlaying ? "\u041f\u0430\u0443\u0437\u0430" : "\u0418\u0433\u0440\u0430\u0442\u044c"}">${isPlaying ? "II" : "\u25b6"}</button>
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
  updateMediaSessionPosition();
}

function renderActiveViewContent() {
  if (state.activeView === "songs" || state.activeView === "favorites") renderSongs();
  else if (state.activeView === "playlists") renderPlaylists();
  else if (state.activeView === "genres" || state.activeView === "artists" || state.activeView === "albums") renderGroups();
  else if (state.activeView === "settings") renderSettings();
}

function render() {
  renderToolbar();
  renderActiveViewContent();
  renderPlayer();
  if (queuePanel.classList.contains("open")) renderQueue();
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
    if (!/\.mp3$/i.test(file.name || "")) continue;
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

async function importNativeRecords(records) {
  const existingIds = new Set(state.songs.map((song) => song.id));
  const newSongs = [];

  for (const record of records || []) {
    if (!record?.filePath || !/\.mp3$/i.test(record.name || record.filePath)) continue;
    if (existingIds.has(record.filePath)) continue;
    const song = await makeSongFromNativeRecord(record).catch(() => null);
    if (!song) continue;
    existingIds.add(song.id);
    state.songs.push(song);
    newSongs.push(song);

    if (newSongs.length % 50 === 0) {
      render();
      await waitForFrame();
    }
  }

  for (const song of newSongs) {
    await saveSong(song).catch(() => {});
  }
  render();
}

async function chooseAndImportSongs() {
  if (window.mp3PlayerNative?.selectAudioFiles) {
    try {
      const records = await window.mp3PlayerNative.selectAudioFiles();
      await importNativeRecords(records);
      return;
    } catch (error) {
      console.error("Native audio picker failed", error);
    }
  }

  fileInput?.click();
}

fileInput?.addEventListener("change", async () => {
  await importSongs([...fileInput.files]);
  fileInput.value = "";
});

addMusicButton.addEventListener("click", () => {
  chooseAndImportSongs().catch(() => {});
});

emptyState?.addEventListener("click", () => {
  chooseAndImportSongs().catch(() => {});
});

document.addEventListener("dragover", (event) => {
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop", (event) => {
  const files = [...(event.dataTransfer?.files || [])];
  if (!files.length) return;
  event.preventDefault();
  const paths = files.map((file) => file.path).filter(Boolean);
  if (paths.length && window.mp3PlayerNative?.readAudioFiles) {
    window.mp3PlayerNative.readAudioFiles(paths).then(importNativeRecords).catch(() => {
      importSongs(files.filter((file) => /\.mp3$/i.test(file.name))).catch(() => {});
    });
    return;
  }

  importSongs(files.filter((file) => /\.mp3$/i.test(file.name))).catch(() => {});
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

playlistAddSearchInput?.addEventListener("input", () => {
  state.playlistAddSearchQuery = playlistAddSearchInput.value;
  renderPlaylistAddList();
  scheduleViewPagerHeightUpdate();
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
  state.playlistAddSearchQuery = "";
  if (playlistAddSearchInput) playlistAddSearchInput.value = "";
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
      state.playlistAddSearchQuery = "";
      if (playlistAddSearchInput) playlistAddSearchInput.value = "";
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
  const previousView = state.activeView;
  const previousIndex = viewNames.indexOf(previousView);
  const nextIndex = viewNames.indexOf(viewName);
  const wrapToEnd = previousIndex === 0 && nextIndex === viewNames.length - 1;
  const wrapToStart = previousIndex === viewNames.length - 1 && nextIndex === 0;
  state.activeView = viewName;
  storageSet("activeView", viewName);
  document.querySelectorAll(".pill").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  document.querySelectorAll(".view:not(.view-clone)").forEach((view) => {
    const active = view.id === `${viewName}View`;
    view.classList.toggle("active", active);
    view.setAttribute("aria-hidden", active ? "false" : "true");
  });
  renderActiveViewContent();
  if (wrapToEnd || wrapToStart) {
    refreshViewClones();
    const startIndex = previousIndex + 1;
    const targetIndex = wrapToEnd ? 0 : viewNames.length + 1;
    withoutViewTrackTransition(() => setViewTrackVisualIndex(startIndex));
    setTimeout(() => {
      setViewTrackVisualIndex(targetIndex);
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        viewTrack.removeEventListener("transitionend", finish);
        withoutViewTrackTransition(() => setViewTrackTransform(0, viewName));
      };
      viewTrack.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 260);
    }, 0);
  } else {
    setViewTrackTransform();
  }
  scheduleViewPagerHeightUpdate();
  if (!options.skipTabScroll) scrollActiveTabIntoView();
}

function setupInfiniteToolbar() {
  toolbar.querySelectorAll(".tab-clone").forEach((tab) => tab.remove());
  const originals = [...toolbar.querySelectorAll(".pill:not(.tab-clone)")];
  const beforeClones = originals.map((tab) => {
    const clone = tab.cloneNode(true);
    clone.classList.add("tab-clone", "tab-clone-before");
    clone.tabIndex = -1;
    return clone;
  });
  const afterClones = originals.map((tab) => {
    const clone = tab.cloneNode(true);
    clone.classList.add("tab-clone", "tab-clone-after");
    clone.tabIndex = -1;
    return clone;
  });
  toolbar.prepend(...beforeClones);
  toolbar.append(...afterClones);

  let isDragging = false;
  let didDragToolbar = false;
  let suppressNextToolbarClick = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  const toolbarCycle = () => {
    const firstOriginal = toolbar.querySelector(".pill:not(.tab-clone)");
    const firstAfter = toolbar.querySelector(".tab-clone-after");
    if (!firstOriginal || !firstAfter) return null;
    const cycleWidth = firstAfter.offsetLeft - firstOriginal.offsetLeft;
    return cycleWidth > 0 ? { start: firstOriginal.offsetLeft, cycleWidth } : null;
  };

  const normalizeToolbarScroll = () => {
    const cycle = toolbarCycle();
    if (!cycle) return;
    if (toolbar.scrollLeft < cycle.start - cycle.cycleWidth * 0.45) {
      toolbar.scrollLeft += cycle.cycleWidth;
    } else if (toolbar.scrollLeft > cycle.start + cycle.cycleWidth * 1.45) {
      toolbar.scrollLeft -= cycle.cycleWidth;
    }
  };

  requestAnimationFrame(() => {
    const cycle = toolbarCycle();
    if (cycle) toolbar.scrollLeft = cycle.start;
  });

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
    normalizeToolbarScroll();
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
    normalizeToolbarScroll();
    event.preventDefault();
  }, { passive: false });

  toolbar.addEventListener("scroll", () => {
    if (isDragging) normalizeToolbarScroll();
  });

  toolbar.addEventListener("click", (event) => {
    if (!suppressNextToolbarClick) return;
    suppressNextToolbarClick = false;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}

function setupViewPager() {
  if (!viewPager || !viewTrack) return;
  const stripCloneIds = (clone) => {
    clone.removeAttribute("id");
    clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    clone.querySelectorAll("input, button, a, select, textarea").forEach((element) => {
      element.tabIndex = -1;
      element.setAttribute("aria-hidden", "true");
    });
  };

  refreshViewClones = () => {
    const settingsView = document.querySelector("#settingsView");
    const songsView = document.querySelector("#songsView");
    const beforeClone = viewTrack.querySelector(".view-clone-before");
    const afterClone = viewTrack.querySelector(".view-clone-after");
    if (settingsView && beforeClone) {
      beforeClone.innerHTML = settingsView.innerHTML;
      stripCloneIds(beforeClone);
    }
    if (songsView && afterClone) {
      afterClone.innerHTML = songsView.innerHTML;
      stripCloneIds(afterClone);
    }
  };

  const settingsClone = document.querySelector("#settingsView").cloneNode(true);
  settingsClone.className = "view view-clone view-clone-before";
  stripCloneIds(settingsClone);
  const songsClone = document.querySelector("#songsView").cloneNode(true);
  songsClone.className = "view view-clone view-clone-after";
  stripCloneIds(songsClone);
  viewTrack.prepend(settingsClone);
  viewTrack.append(songsClone);
  refreshViewClones();

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
});

document.querySelector("#closePlayer").addEventListener("click", () => {
  setPlayerOpen(false);
});

themeToggle?.addEventListener("click", () => setTheme());
settingsThemeToggle?.addEventListener("click", () => setTheme());
languageSelect?.addEventListener("change", () => setLanguage(languageSelect.value));
deleteAllSongsButton?.addEventListener("click", requestDeleteAllSongs);
deleteAllPlaylistsButton?.addEventListener("click", requestDeleteAllPlaylists);

document.querySelector("#queueButton").addEventListener("click", () => {
  renderQueue();
  openPanel(queuePanel);
});
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
  updateMediaSessionPosition();
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
audio.addEventListener("playing", preloadNextSong);
audio.addEventListener("pause", renderPlaybackState);
audio.addEventListener("ended", playNext);
audio.addEventListener("timeupdate", renderSeek);
audio.addEventListener("loadedmetadata", () => {
  const song = currentSong();
  if (song && Number.isFinite(audio.duration)) {
    const newDuration = audio.duration;
    const durationChanged = Math.abs((song.duration || 0) - newDuration) > 0.5;
    if (durationChanged) {
      song.duration = newDuration;
      saveSong(song).catch((error) => {
        console.error("Failed to save song duration:", error);
      });
    }
  }
  renderSeek();
});

setupMediaSessionControls();
applyTheme();
applyLanguage();
setInterval(renderTimer, 1000);
setupInfiniteToolbar();
setupViewPager();
selectView(state.activeView, { skipTabScroll: true });
loadSavedSongs()
  .then((songs) => {
    state.songs = songs;
    render();
  })
  .catch(() => render());

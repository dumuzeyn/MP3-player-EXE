Unicode true
Name "MP3 Player"
OutFile "dist\MP3-Player-1.0.0-portable.exe"
InstallDir "$PLUGINSDIR\app"
RequestExecutionLevel user
SilentInstall silent
AutoCloseWindow true
SetCompressor /SOLID lzma
Icon "icon.ico"

Section "Main"
  InitPluginsDir
  StrCpy $INSTDIR "$PLUGINSDIR\app"
  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*.*"
  ExecWait '"$INSTDIR\MP3 Player.exe"'
  SetOutPath "$TEMP"
  RMDir /r "$INSTDIR"
SectionEnd

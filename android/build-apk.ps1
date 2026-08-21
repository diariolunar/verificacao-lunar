$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$build = Join-Path $root "android\build\apk-$stamp"
$sdk = $env:ANDROID_HOME

if (-not $sdk) {
  throw "ANDROID_HOME nao esta configurado."
}

$buildTools = Join-Path $sdk "build-tools\36.1.0"
$androidJar = Join-Path $sdk "platforms\android-36\android.jar"
$aapt2 = Join-Path $buildTools "aapt2.exe"
$aapt = Join-Path $buildTools "aapt.exe"
$d8 = Join-Path $buildTools "d8.bat"
$zipalign = Join-Path $buildTools "zipalign.exe"
$apksigner = Join-Path $buildTools "apksigner.bat"

foreach ($tool in @($aapt2, $aapt, $d8, $zipalign, $apksigner, $androidJar)) {
  if (-not (Test-Path $tool)) {
    throw "Dependencia Android nao encontrada: $tool"
  }
}

New-Item -ItemType Directory -Force `
  "$build\compiled", `
  "$build\generated", `
  "$build\classes", `
  "$build\dex", `
  "$root\dist-apk" | Out-Null

$manifest = Join-Path $root "android\src\main\AndroidManifest.xml"
$res = Join-Path $root "android\src\main\res"
$src = Join-Path $root "android\src\main\java\com\diariolunar\verificacaolunar\MainActivity.java"

& $aapt2 compile --dir $res -o "$build\compiled"

$flats = Get-ChildItem "$build\compiled" -Filter *.flat | ForEach-Object { $_.FullName }
& $aapt2 link -o "$build\verificacao-lunar-unsigned.apk" -I $androidJar --manifest $manifest --java "$build\generated" --auto-add-overlay $flats

$generatedJava = Get-ChildItem "$build\generated" -Recurse -Filter *.java | ForEach-Object { $_.FullName }
$javaFiles = @($src) + $generatedJava
& javac -source 8 -target 8 -classpath $androidJar -d "$build\classes" $javaFiles

$classFiles = Get-ChildItem "$build\classes" -Recurse -Filter *.class | ForEach-Object { $_.FullName }
& $d8 --lib $androidJar --output "$build\dex" $classFiles

Push-Location "$build\dex"
& jar uf "$build\verificacao-lunar-unsigned.apk" classes.dex
Pop-Location

& $zipalign -f -p 4 "$build\verificacao-lunar-unsigned.apk" "$build\verificacao-lunar-aligned.apk"

$keystore = Join-Path $root "android\verificacao-lunar-debug.keystore"
if (-not (Test-Path $keystore)) {
  & keytool -genkeypair -v -keystore $keystore -storepass android -alias verificacao-lunar -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Verificacao Lunar, OU=Projeto Lunar, O=Diario Lunar, L=Fortaleza, S=CE, C=BR"
}

$outApk = Join-Path $root "dist-apk\verificacao-lunar.apk"
& $apksigner sign --ks $keystore --ks-pass pass:android --key-pass pass:android --out $outApk "$build\verificacao-lunar-aligned.apk"
& $apksigner verify --verbose $outApk
& $aapt dump badging $outApk | Select-String "package:|application-label|launchable-activity|sdkVersion|targetSdkVersion|uses-permission"

Get-Item $outApk

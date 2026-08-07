---
name: fabric-loom
description: Fabric Loom Gradle plugin: setup, DSL options, dependency configurations, tasks, production runs.
---

# Fabric Loom

Loom is the Gradle plugin that sets up the Minecraft dev environment (downloads/merges/remaps jars, decompiles sources, creates run configs, handles jar-in-jar and mixin AP).

## Plugin IDs

- `net.fabricmc.fabric-loom` — non-obfuscated Minecraft (26.1+).
- `net.fabricmc.fabric-loom-remap` — obfuscated Minecraft (1.21.11 and older).
- `net.fabricmc.fabric-loom-companion` — non-Loom subprojects in multi-project builds (only exposes classpath-group data).

## Basic Build Script

```gradle
plugins { id 'net.fabricmc.fabric-loom' version '1.16' }

dependencies {
  minecraft "com.mojang:minecraft:${minecraftVersion}"
  mappings loom.officialMojangMappings() // 26.1+; Yarn no longer needed/maintained
  modImplementation "net.fabricmc.fabric-api:fabric-api:${fabricApiVersion}"
  implementation "net.fabricmc:fabric-loader:${loaderVersion}"
}
```

Default repositories: Fabric maven, Mojang libraries, Maven Central. `loom { splitEnvironmentSourceSets(); mods { "example-mod" { sourceSet sourceSets.main; sourceSet sourceSets.client } } }` splits client/common code (requires MC 1.19+, Loader 0.14+, Loom 1.0+).

## Dependency Configurations

| Configuration | Meaning |
---------------|---------|
| `minecraft` | Minecraft version. |
| `mappings` | Mappings (Yarn `net.fabricmc:yarn:<v>:v2`, `loom.officialMojangMappings()`, or `loom.layered()` + Parchment). |
| `modImplementation` / `modApi` / `modRuntimeOnly` / `modCompileOnly` | Remapped mod dependencies. |
| `include` | Jar-in-jar: nested into the final mod JAR; a `fabric.mod.json` is generated for non-mod libraries. Not transitive. |
| `implementation project(path: ":name", configuration: "namedElements")` | Depend on a Loom subproject without remapping. |

## `loom` Extension Options

```gradle
loom {
  accessWidenerPath = file("src/main/resources/example-mod.classtweaker")
  log4jConfigs.from file("log4j-dev.xml")
  remapArchives = true
  setupRemappedVariants = true
  enableTransitiveAccessWideners = true
  runtimeOnlyLog4j = false
  runs {
    client { vmArgs "-Dexample=true"; environment = "client"; runDir = "run"; ideConfigGenerated = true }
    testClient { inherit client; source = sourceSets.test }
    remove server
  }
  mixin { useLegacyMixinAp = false; defaultRefmapName = "example.refmap.json" }
  interfaceInjection { enableDependencyInterfaceInjection = true }
}
```

## Fabric API DSL

```gradle
fabricApi {
  configureDataGeneration { client = true; outputDirectory = file("src/generated/resources") }
  configureTests {
    createSourceSet = true
    modId = "example-mod-tests"
    enableGameTests = true
    enableClientGameTests = true
    eula = true
  }
}
```

## Tasks & Caches

- `./gradlew build` — produces remapped release JAR in `build/libs` (dev jar gets `-dev` suffix).
- `./gradlew genSources` — decompile Minecraft for IDE navigation.
- `./gradlew runClient` / `runServer` — dev runs.
- `./gradlew runDatagen` — run data generation.
- `./gradlew validateAccessWidener` — validate class tweaker entries.
- `./gradlew build --refresh-dependencies` — fix corrupted caches.
- Extra tasks: `FabricModJsonV1Task` (generate `fabric.mod.json`), `DownloadTask` (fetch a file with optional sha1/maxAge), `ModEnigmaTask` (mappings javadoc), `ValidateMixinNameTask`.

Caches: `${GRADLE_HOME}/caches/fabric-loom` (shared), `.gradle/loom-cache` (project), `build/loom-cache` (subproject).

## Production Run Tasks

Test the real remapped environment before release:

```gradle
tasks.register("prodServer", net.fabricmc.loom.task.prod.ServerProductionRunTask) {
  installerVersion = "1.0.1"
  mods.from file("mod.jar")
  javaLauncher = javaToolchains.launcherFor { languageVersion = JavaLanguageVersion.of(25) }
}
tasks.register("prodClient", net.fabricmc.loom.task.prod.ClientProductionRunTask) {
  useXVFB = true // headless CI
  tracy { tracyCapture = file("tracy-capture"); output = file("profile.tracy") }
}
```

The server task can run a different Minecraft version — useful for cross-version mods.

<!--
Source references:
- https://docs.fabricmc.net/develop/loom/
- https://docs.fabricmc.net/develop/loom/options
- https://docs.fabricmc.net/develop/loom/fabric-api
- https://docs.fabricmc.net/develop/loom/classpath-groups
- https://docs.fabricmc.net/develop/loom/tasks
- https://docs.fabricmc.net/develop/loom/production-run-tasks
-->

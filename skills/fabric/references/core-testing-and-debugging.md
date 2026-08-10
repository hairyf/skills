---
name: fabric-testing-and-debugging
description: Fabric Loader JUnit unit tests, Minecraft game tests, CI setup, logging, breakpoints, crash logs.
---

# Testing & Debugging

## Unit Tests (Fabric Loader JUnit)

Plain JUnit doesn't work because of runtime bytecode tools (Mixin), so Fabric ships `fabric-loader-junit`:

```gradle
dependencies {
  testImplementation "net.fabricmc:fabric-loader-junit:${project.loader_version}"
}
test { useJUnitPlatform() }
```

Write tests in `src/test/java`, mirroring the package of the class under test (add `Test` suffix). Use `org.junit.jupiter.api.Assertions`.

Registry-dependent code (e.g. `ItemStack`) requires initializing Minecraft registries in `@BeforeAll`:

```java
@BeforeAll
static void beforeAll() {
    // BootstrapSharedRegistries/registry access setup — see reference/latest/src/test/...
}
```

GitHub Actions: upload `**/build/reports/` and `**/build/test-results/` on failure.

## Game Tests

Server (vanilla Gametest framework) and client game tests (Fabric API Client Test framework):

```gradle
fabricApi {
  configureTests {
    createSourceSet = true
    modId = "example-mod-tests"
    eula = true
  }
}
```

- Create `src/gametest/resources/fabric.mod.json` and test classes in `src/gametest/java`.
- Server tests run with `./gradlew build`; client tests with `runClientGameTest` or a production run task (`-Dfabric.client.gametest`; add `-Dfabric.client.gametest.disableNetworkSynchronizer=true` if CI fails on network synchronizer).

## Debugging

### Logging

```java
public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);
LOGGER.info("..."); LOGGER.warn("..."); LOGGER.error("...", exception); LOGGER.debug("...");
```

Use `debug` level for development-only messages (hidden by default). Show debug logs via a `log4j-dev.xml` configured with `loom.log4jConfigs.from "log4j-dev.xml"`. Missing assets log warnings with expected paths.

### Breakpoints & Hotswap

Run in **Debug** mode; place breakpoints, inspect variables/stack, evaluate expressions, use conditional breakpoints. Hotswap changed code with `Build > Build Project` (Mixins need special setup). Asset changes: `F3+T`; data changes: `/reload`.

### Logs & Crashes

Production logs live in the game instance's `logs/latest.log`; dev logs in `run/logs`; crash reports in `run/crash-reports`. Search for your mod id to isolate your messages.

<!--
Source references:
- https://docs.fabricmc.net/develop/automatic-testing
- https://docs.fabricmc.net/develop/debugging
-->

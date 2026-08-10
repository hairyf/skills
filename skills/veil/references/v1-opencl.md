---
name: veil-v1-opencl
description: Veil 1 OpenCL runtime — environments, programs, kernels, buffers, event dispatch, and lifecycle conventions.
---

# Veil 1 OpenCL

Veil bundles a full OpenCL runtime (`foundry.veil.api.opencl`) for general compute outside the GPU-only shader path.

## Conventions

- Request **one static `CLEnvironment`** per mod (`VeilOpenCL.get().getEnvironment()`); the default options fit most use cases.
- **Never free the environment yourself** — Veil frees it on shutdown (`onFreeNativeResources`).
- Most calls throw `CLException`; wrap them in try/catch.
- If no OpenCL device supports your requested options, the environment is `null` — degrade gracefully.

## Programs & kernels

```java
public static void doThing() throws CLException {
    CLEnvironment environment = ModClass.ENVIRONMENT;
    environment.loadProgram(new ResourceLocation("modid", "coolprogram"), """
            void kernel cool_kernel(global const int* A, global const int* B, global int* D) {
                int i = get_global_id(0);
                D[i] = A[i] + B[i];
            }
            """);

    CLKernel kernel = environment.createKernel(new ResourceLocation("modid", "coolprogram"), "cool_kernel");
    // ... run ...
    kernel.free(); // or try-with-resources (CLKernel implements AutoCloseable)
}
```

Notes:

- `loadProgram` must be called before `createKernel`.
- Loading a program under an existing name frees the old program and its kernels.
- Kernels should be freed when done; `freeProgram(id)` frees a whole program explicitly.

## Buffers & executing

```java
try (CLKernel kernel = environment.createKernel(new ResourceLocation("modid", "program"), "kernel")) {
    CLBuffer bufferA = kernel.createBuffer(CL_MEM_READ_ONLY, Integer.BYTES * 4);
    CLBuffer bufferD = kernel.createBuffer(CL_MEM_WRITE_ONLY, Integer.BYTES * 4);

    try (MemoryStack stack = MemoryStack.stackPush()) {
        IntBuffer dataA = stack.ints(1, 2, 3, 4);
        IntBuffer dataD = stack.mallocInt(4);

        bufferA.writeAsync(0, dataA, null);   // async, optional completion callback
        kernel.setInt(0, 4);
        kernel.setPointers(1, dataA);
        kernel.setPointers(2, dataD);
        kernel.execute(4, 1);                 // global work size, dimensions

        environment.finish();                 // block until commands processed
        bufferD.read(0, dataD);               // synchronous read-back
    }
}
```

`CLBuffer`s are freed automatically when their kernel is freed, or manually. Single primitives go through `kernel.setInt/setFloat/...` parameter slots; arrays use `setPointers` + buffers.

## Event dispatch

`environment.getEventDispatcher()` subscribes to OpenCL events (e.g. `CL_COMPLETE`) with callbacks:

```java
environment.getEventDispatcher().listen(event, CL_COMPLETE, () -> { /* done */ });
```

Veil's own async helpers (`writeAsync(..., Runnable onComplete)`) use this internally; direct use is optional.

<!--
Source references:
- https://github.com/FoundryMC/Veil.wiki (OpenCL, 2024-12-02 revision)
- https://github.com/FoundryMC/Veil/tree/1.20 (1.0.0.228: foundry.veil.api.opencl.*)
-->

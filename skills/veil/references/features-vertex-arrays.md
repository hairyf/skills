---
name: features-vertex-arrays
description: Use Veil VertexArrays for GPU vertex buffers with custom attributes, multiple buffers, and index buffers.
---

# Better Vertex Buffers

`VertexArray` improves on vanilla `VertexBuffer`: create with `VertexArray.create()`, free with `free()`.

## Uploading Meshes

```java
BufferBuilder builder = RenderSystem.renderThreadTesselator().begin(
        VertexFormat.Mode.QUADS, DefaultVertexFormat.POSITION_COLOR);
builder.addVertex(0, 0, 0).setColor(-1);
// ... more vertices ...

VertexArray vertexArray = VertexArray.create();
vertexArray.upload(builder.buildOrThrow(), VertexArray.DrawUsage.STATIC);

// Render loop:
vertexArray.bind();
vertexArray.drawWithRenderType(RenderType.debugQuads());

// When done:
vertexArray.free();
```

`upload(MeshData, DrawUsage)` can place multiple meshes at different locations via the optional `attributeStart` parameter.

## Custom Attributes & Multiple Buffers

Vertex arrays can reference arbitrary OpenGL buffers or own their buffers. Build a format with `editFormat()`:

```java
VertexArray vertexArray = VertexArray.create();
int defaultVbo = vertexArray.getOrCreateBuffer(VertexArray.VERTEX_BUFFER);
int extraVbo = vertexArray.getOrCreateBuffer(2);
int vanillaVbo = vertexArray.getOrCreateBuffer(3);

// Upload raw data per buffer
VertexArray.upload(defaultVbo, vertexData, VertexArray.DrawUsage.STATIC);
VertexArray.upload(extraVbo, extraData, VertexArray.DrawUsage.STATIC);
vertexArray.uploadIndexBuffer(stack.bytes(0, 1, 2, 2, 3, 0), VertexArray.IndexType.BYTE);
vertexArray.setIndexCount(6, VertexArray.IndexType.BYTE);
vertexArray.setDrawMode(VertexFormat.Mode.TRIANGLES);

VertexArrayBuilder builder = vertexArray.editFormat();
builder.defineVertexBuffer(0, defaultVbo, 0, Float.BYTES * 5, 0);
builder.defineVertexBuffer(1, extraVbo, 0, Integer.BYTES, 0);
builder.setVertexAttribute(0, 0, 3, VertexArrayBuilder.DataType.FLOAT, false, 0);       // position
builder.setVertexAttribute(1, 0, 2, VertexArrayBuilder.DataType.FLOAT, false, Float.BYTES * 3); // uv
builder.setVertexAttribute(2, 1, 4, VertexArrayBuilder.DataType.UNSIGNED_BYTE, false, 0); // color

// Apply a vanilla format to an arbitrary buffer + attribute start
builder.applyFrom(3, vanillaVbo, 2, DefaultVertexFormat.PARTICLE);

vertexArray.bind();
vertexArray.draw();
```

Vertex buffers can be redefined at any time via `VertexArrayBuilder#defineVertexBuffer` without rebuilding the format.

<!--
Source references:
- https://github.com/FoundryMC/Veil/blob/1.21/wiki/VertexArray.md
-->


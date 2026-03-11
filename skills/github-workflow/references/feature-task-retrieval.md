---
name: feature-task-retrieval
description: Logic for retrieving task details from various sources and configuring them.
---

# Task Retrieval & Configuration

Handles fetching task details (title, description, status) from external data sources (ClickUp, Jira, etc.) and managing the configuration for these sources.

## Global Configuration

- **Path**: `~/.bonfire/source.json` (user-level, persistent)
- **Purpose**: Maps input patterns to specific query commands to skip discovery steps.

### Config Structure

```json
{
  "dataSourceType": "clickup",
  "description": "ClickUp task link",
  "matchPatterns": ["clickup.com/t/", "app.clickup.com"],
  "taskIdPlaceholder": "<task_id>",
  "commands": {
    "get": "node ~/.bonfire/skills/clickup/query.mjs get <task_id> --subtasks",
    "comments": "node ~/.bonfire/skills/clickup/query.mjs comments <task_id>"
  },
  "envCheck": "~/.bonfire/skills/clickup/.env"
}
```

## Retrieval Workflow

### 1. Check Global Config
1. Read `~/.bonfire/source.json`.
2. If input (URL/text) matches `matchPatterns`:
   - Parse `task_id`.
   - Execute `commands.get` and `commands.comments`.
   - **Skip discovery**.

### 2. Discovery (find-skills)
If no config matches:
1. **Analyze Input**: Identify type (URL domain or text keywords).
2. **Find Skill**: Run `npx skills find <keyword>` (e.g., `npx skills find clickup`).
3. **Confirm & Save**:
   - Present found skills/commands.
   - Ask user to confirm method.
   - **Save** new config to `~/.bonfire/source.json` for future use.
4. **Execute**: Run the confirmed method to get task info.

### 3. Fallback
If no skill found or config fails:
- Prompt user for: "Task Title", "Description", "Short Branch Description".

## Key Points
- Always check global config first to save time.
- Persist successful discovery to global config.
- Fallback to manual user input if automation fails.

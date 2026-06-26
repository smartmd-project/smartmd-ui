<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '@/components/AppShell.vue'
import EditorTabs from '@/components/EditorTabs.vue'
import FocusEditor from '@/components/FocusEditor.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const saveLabel = ref('Save')
const editorMode = ref<'edit' | 'preview'>('edit')
let saveToastTimer: ReturnType<typeof setTimeout> | undefined

interface WorkspaceDocument {
  id: string
  name: string
  title: string
  meta: string
  type: string
  tags: string[]
  content: string
  pinned?: boolean
  dirty?: boolean
}

const documents = reactive<WorkspaceDocument[]>([
  {
    id: 'moc-linux',
    name: '4-MOC-Linux-mau',
    title: '4-MOC-Linux-mau',
    meta: 'Knowledge map',
    type: 'moc',
    tags: ['MOC', 'LINUX'],
    pinned: true,
    content: `## MOC - Linux

> MOC là mục lục sống: gom các permanent note liên quan để nhìn nhanh toàn cảnh hệ thống kiến thức.

## Phân quyền & bảo mật
- Linux - chmod và octal permissions
- Linux - chown vs chgrp
- Linux - sudo vs su

## Quản lý tiến trình
- Linux - ps, top, kill
- Linux - systemd và service

## Mạng & kết nối
- Linux - SSH cơ bản`,
  },
  {
    id: 'product-spec',
    name: 'product-spec.md',
    title: 'product-spec.md',
    meta: 'Active file',
    type: 'spec',
    tags: ['PRODUCT', 'SMARTMD'],
    pinned: true,
    content: `# SmartMD Product Spec

## Workspace
- Left command rail controls the visible drawer.
- File drawer opens notes into editor tabs.
- Editor surface behaves like a Markdown knowledge workspace.

## Next
- Wire persistence to backend when API is ready.
- Add command palette and file search shortcuts.`,
  },
  {
    id: 'backend-notes',
    name: 'backend-notes.md',
    title: 'backend-notes.md',
    meta: 'Pinned draft',
    type: 'note',
    tags: ['BACKEND', 'API'],
    pinned: true,
    content: `# Backend Notes

## Auth
- Session cookie flow is mocked in frontend.
- API client already centralizes base URL and credentials.

## Documents
- Save document metadata first.
- Sync content through markdown endpoint later.`,
  },
  {
    id: 'render-pipeline',
    name: 'render-pipeline.md',
    title: 'render-pipeline.md',
    meta: 'Edited today',
    type: 'note',
    tags: ['RENDER', 'VUE'],
    content: `# Render Pipeline

## Editor
- Use stable tab state.
- Keep document editing local and immediate.

## Preview
- Markdown preview can be layered in after editable mode is stable.`,
  },
  {
    id: 'release-plan',
    name: 'release-plan.md',
    title: 'release-plan.md',
    meta: 'Yesterday',
    type: 'plan',
    tags: ['RELEASE'],
    content: `# Release Plan

- Finalize editor workspace.
- Verify auth flows.
- Capture screenshots for pull request.`,
  },
  {
    id: 'vue-components',
    name: 'vue-components.md',
    title: 'vue-components.md',
    meta: '3 days ago',
    type: 'note',
    tags: ['VUE', 'COMPONENTS'],
    content: `# Vue Components

## Shell
- AppShell owns layout composition.
- EditorView owns workspace state.
- Components receive props and emit events.`,
  },
])

const openTabIds = ref(['moc-linux', 'product-spec'])
const activeDocumentId = ref('product-spec')
const openTabs = computed(() =>
  openTabIds.value
    .map((id) => documents.find((document) => document.id === id))
    .filter((document): document is WorkspaceDocument => Boolean(document)),
)
const activeDocument = computed<WorkspaceDocument>(() => {
  return documents.find((document) => document.id === activeDocumentId.value) ?? documents[0]!
})
const workspaceFiles = computed(() =>
  documents.map((document) => ({
    id: document.id,
    name: document.name,
    meta: document.dirty ? 'Unsaved changes' : document.meta,
    pinned: document.pinned,
  })),
)

function openDocument(id: string) {
  if (!openTabIds.value.includes(id)) {
    openTabIds.value.push(id)
  }

  activeDocumentId.value = id
}

function closeTab(id: string) {
  if (openTabIds.value.length === 1) {
    return
  }

  const closingIndex = openTabIds.value.indexOf(id)
  openTabIds.value = openTabIds.value.filter((tabId) => tabId !== id)

  if (activeDocumentId.value === id) {
    const fallbackIndex = Math.max(0, closingIndex - 1)
    activeDocumentId.value =
      openTabIds.value[fallbackIndex] ?? openTabIds.value[0] ?? documents[0]!.id
  }
}

function createDocument() {
  const nextNumber = documents.length + 1
  const id = `untitled-${Date.now()}`
  const name = `untitled-${nextNumber}.md`

  documents.unshift({
    id,
    name,
    title: name,
    meta: 'New draft',
    type: 'note',
    tags: ['DRAFT'],
    pinned: true,
    dirty: true,
    content: `# ${name}

Start writing your Markdown note here.`,
  })

  openDocument(id)
}

function updateActiveContent(value: string) {
  activeDocument.value.content = value
  activeDocument.value.dirty = true
  saveLabel.value = 'Unsaved'
}

function toggleEditorMode() {
  editorMode.value = editorMode.value === 'edit' ? 'preview' : 'edit'
}

function handleSave() {
  activeDocument.value.dirty = false
  activeDocument.value.meta = 'Saved just now'
  saveLabel.value = 'Saved'

  if (saveToastTimer) {
    clearTimeout(saveToastTimer)
  }

  saveToastTimer = setTimeout(() => {
    saveLabel.value = 'Save'
  }, 1800)
}

async function handleLogout() {
  await authStore.logout()
  await router.push('/login')
}

onBeforeUnmount(() => {
  if (saveToastTimer) {
    clearTimeout(saveToastTimer)
  }
})
</script>

<template>
  <AppShell
    :user="user"
    :save-label="saveLabel"
    :files="workspaceFiles"
    :active-file-id="activeDocumentId"
    @save="handleSave"
    @new-file="createDocument"
    @open-file="openDocument"
    @logout="handleLogout"
  >
    <section
      class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-smart-border bg-[#071219]"
    >
      <EditorTabs
        :tabs="openTabs"
        :active-tab-id="activeDocumentId"
        :mode="editorMode"
        @select-tab="openDocument"
        @close-tab="closeTab"
        @new-tab="createDocument"
        @toggle-mode="toggleEditorMode"
      />
      <FocusEditor
        :document="activeDocument"
        :mode="editorMode"
        @update-content="updateActiveContent"
      />
    </section>
  </AppShell>
</template>

export interface StoredDocument {
  title: string
  content: string
  savedAt: string
}

const documentKey = 'smartmd.document'

export function getStoredDocument(): StoredDocument | null {
  const storedDocument = localStorage.getItem(documentKey)

  if (!storedDocument) {
    return null
  }

  try {
    return JSON.parse(storedDocument) as StoredDocument
  } catch {
    localStorage.removeItem(documentKey)
    return null
  }
}

export function saveDocument(title: string, content: string): StoredDocument {
  const document = {
    title: title.trim() || 'untitled.md',
    content,
    savedAt: new Date().toISOString(),
  }

  localStorage.setItem(documentKey, JSON.stringify(document))
  return document
}

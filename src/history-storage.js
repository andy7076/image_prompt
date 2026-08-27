const DATABASE_NAME = 'prompt-signal'
const DATABASE_VERSION = 1
const HISTORY_STORE = 'generation-history'

let databasePromise

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'))
  })
}

function openDatabase() {
  if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB is unavailable'))
  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
      request.onupgradeneeded = () => {
        const database = request.result
        if (!database.objectStoreNames.contains(HISTORY_STORE)) {
          const store = database.createObjectStore(HISTORY_STORE, { keyPath: 'id' })
          store.createIndex('createdAt', 'createdAt')
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        databasePromise = null
        reject(request.error)
      }
    })
  }
  return databasePromise
}

function dataUrlToBlob(dataUrl) {
  const [metadata, encoded] = dataUrl.split(',', 2)
  if (!encoded) return null
  const mimeType = metadata.match(/^data:([^;]+)/)?.[1] || 'image/png'
  const binary = window.atob(encoded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new Blob([bytes], { type: mimeType })
}

function serializeRecord(record) {
  const stored = { ...record }
  delete stored.objectUrl
  if (typeof stored.image === 'string' && stored.image.startsWith('data:')) {
    stored.imageBlob = dataUrlToBlob(stored.image)
    stored.image = ''
  }
  if (typeof stored.referencePreview === 'string' && stored.referencePreview.startsWith('data:')) {
    stored.referenceBlob = dataUrlToBlob(stored.referencePreview)
    stored.referencePreview = ''
  }
  return stored
}

function hydrateRecord(record) {
  const hydrated = { ...record }
  if (record.imageBlob instanceof Blob) {
    hydrated.image = URL.createObjectURL(record.imageBlob)
    hydrated.objectUrl = true
  }
  if (record.referenceBlob instanceof Blob) hydrated.referencePreview = URL.createObjectURL(record.referenceBlob)
  return hydrated
}

async function readStoredRecords() {
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readonly')
  const records = await requestResult(transaction.objectStore(HISTORY_STORE).getAll())
  await transactionComplete(transaction)
  return records.sort((first, second) => String(second.createdAt).localeCompare(String(first.createdAt)))
}

async function pruneRecords(limit) {
  const records = await readStoredRecords()
  const overflow = records.slice(limit)
  if (!overflow.length) return
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readwrite')
  overflow.forEach((record) => transaction.objectStore(HISTORY_STORE).delete(record.id))
  await transactionComplete(transaction)
}

export async function loadGenerationRecords(limit) {
  return (await readStoredRecords()).slice(0, limit).map(hydrateRecord)
}

export async function saveGenerationRecord(record, limit) {
  const stored = serializeRecord(record)
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readwrite')
  transaction.objectStore(HISTORY_STORE).put(stored)
  await transactionComplete(transaction)
  await pruneRecords(limit)
  return hydrateRecord(stored)
}

export async function migrateGenerationRecords(records, limit) {
  if (!records.length) return
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readwrite')
  records.slice(0, limit).forEach((record) => transaction.objectStore(HISTORY_STORE).put(serializeRecord(record)))
  await transactionComplete(transaction)
  await pruneRecords(limit)
}

export async function deleteGenerationRecord(id) {
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readwrite')
  transaction.objectStore(HISTORY_STORE).delete(id)
  await transactionComplete(transaction)
}

export async function clearGenerationRecords() {
  const database = await openDatabase()
  const transaction = database.transaction(HISTORY_STORE, 'readwrite')
  transaction.objectStore(HISTORY_STORE).clear()
  await transactionComplete(transaction)
}

export function revokeGenerationRecordAssets(record) {
  if (record?.objectUrl && record.image?.startsWith('blob:')) URL.revokeObjectURL(record.image)
  if (record?.referenceBlob instanceof Blob && record.referencePreview?.startsWith('blob:')) URL.revokeObjectURL(record.referencePreview)
}

import type { User } from '@supabase/supabase-js'
import type { Snap } from './types'
import { supabase } from './supabase'

const BUCKET = 'snaply-images'

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function saveCloudSnap(snap: Snap, user: User): Promise<Snap> {
  if (!supabase) return snap
  let storagePath = snap.storagePath
  if (!storagePath && snap.image.startsWith('data:')) {
    const blob = dataUrlToBlob(snap.image)
    const ext = blob.type.split('/')[1]?.replace('jpeg','jpg') || 'jpg'
    storagePath = `${user.id}/${snap.id}.${ext}`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, blob, {
      contentType: blob.type, upsert: true
    })
    if (uploadError) throw uploadError
  }
  const row = {
    id: snap.id,
    user_id: user.id,
    title: snap.title,
    text_content: snap.text,
    category: snap.category,
    tags: snap.tags,
    favorite: snap.favorite,
    created_at: new Date(snap.createdAt).toISOString(),
    storage_path: storagePath || null
  }
  const { error } = await supabase.from('snaps').upsert(row)
  if (error) throw error
  return { ...snap, storagePath }
}

export async function loadCloudSnaps(user: User): Promise<Snap[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('snaps').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  if (error) throw error
  const result: Snap[] = []
  for (const row of data || []) {
    let image = ''
    if (row.storage_path) {
      const { data: signed, error: signedError } = await supabase.storage.from(BUCKET).createSignedUrl(row.storage_path, 60 * 60)
      if (!signedError && signed?.signedUrl) image = signed.signedUrl
    }
    result.push({
      id: row.id, title: row.title, text: row.text_content || '',
      category: row.category, tags: row.tags || [], favorite: row.favorite,
      createdAt: new Date(row.created_at).getTime(), image, storagePath: row.storage_path || undefined
    })
  }
  return result
}

export async function deleteCloudSnap(id: string, user: User) {
  if (!supabase) return
  const { data: row } = await supabase.from('snaps').select('storage_path').eq('id', id).eq('user_id', user.id).maybeSingle()
  const { error } = await supabase.from('snaps').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  if (row?.storage_path) await supabase.storage.from(BUCKET).remove([row.storage_path])
}
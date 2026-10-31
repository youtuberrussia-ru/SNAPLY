export type Category = 'Ideas' | 'Shopping' | 'Recipes' | 'Travel' | 'Documents' | 'Other'
export type Snap = {
  id: string
  title: string
  text: string
  category: Category
  tags: string[]
  image: string
  createdAt: number
  favorite: boolean
  storagePath?: string
}
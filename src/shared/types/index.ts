export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  bio?: string
  profession?: string
  city?: string
  booksRead: number
  followers: number
  following: number
  createdAt: string
  readingStreak?: number
  currentGoal?: { target: number; current: number; year: number }
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  genre: string
  description: string
  rating: number
  reviewCount: number
  publishedAt: number
  pages: number
  trending: boolean
  tags: string[]
}

export interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  likes: number
  comments: number
  liked: boolean
  saved: boolean
  user: User
  book: Book
}

export interface Library {
  id: string
  name: string
  address: string
  city: string
  phone: string
  website: string
  hours: string
  lat: number
  lng: number
  rating: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earnedAt?: string
}

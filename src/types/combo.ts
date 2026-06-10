export interface ComboService {
  id: string | number
  name: string
  duration: number          
  originalPrice: number     
  description: string
  included: string[]       
  icon?: string            
}

export interface ComboDetail {
  id: string | number
  slug: string
  name: string
  tagline: string           
  description: string
  coverImage: string
  badge?: string            
  comboPrice: number       
  services: ComboService[]
  benefits: string[]       
  bookingNote?: string      
  gallery?: string[]       
}
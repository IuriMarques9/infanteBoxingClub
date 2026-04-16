export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: string | null
          created_at?: string
        }
      }
      modalidades: {
        Row: {
          id: string
          title: string
          description: string | null
          horario_text: string | null
          imageurl: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          horario_text?: string | null
          imageurl?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          horario_text?: string | null
          imageurl?: string | null
          created_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          title: string
          date: string
          location: string | null
          description: string | null
          imageurl: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          location?: string | null
          description?: string | null
          imageurl?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          location?: string | null
          description?: string | null
          imageurl?: string | null
          created_at?: string
        }
      }
      store_products: {
        Row: {
          id: string
          name: string
          price: number
          description: string | null
          imageurl: string | null
          in_stock: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          description?: string | null
          imageurl?: string | null
          in_stock?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          description?: string | null
          imageurl?: string | null
          in_stock?: boolean | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

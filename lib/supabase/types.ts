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
      membros: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          data_nascimento: string | null
          turma: string
          is_competicao: boolean
          is_isento: boolean
          created_by: string | null
          updated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          data_nascimento?: string | null
          turma: string
          is_competicao?: boolean
          is_isento?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          data_nascimento?: string | null
          turma?: string
          is_competicao?: boolean
          is_isento?: boolean
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
        }
      }
      pagamentos: {
        Row: {
          id: string
          membro_id: string
          mes_referencia: string
          valor: number
          data_pagamento: string
          admin_id: string
        }
        Insert: {
          id?: string
          membro_id: string
          mes_referencia: string
          valor: number
          data_pagamento?: string
          admin_id?: string
        }
        Update: {
          id?: string
          membro_id?: string
          mes_referencia?: string
          valor?: number
          data_pagamento?: string
          admin_id?: string
        }
      }
      horarios: {
        Row: {
          id: string
          turma: string
          descricao: string
          hora: string
          created_at: string
        }
        Insert: {
          id?: string
          turma: string
          descricao: string
          hora: string
          created_at?: string
        }
        Update: {
          id?: string
          turma?: string
          descricao?: string
          hora?: string
          created_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          admin_id: string
          action: string
          description: string
          entity_type: string | null
          entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string
          action: string
          description: string
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          description?: string
          entity_type?: string | null
          entity_id?: string | null
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

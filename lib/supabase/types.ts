export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_activity_log_admin"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_metadata: {
        Row: {
          categoria: string
          file_name: string
          id: string
          membro_id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          categoria: string
          file_name: string
          id?: string
          membro_id: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Update: {
          categoria?: string
          file_name?: string
          id?: string
          membro_id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_metadata_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_metadata_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros_status"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          all_day: boolean
          created_at: string
          cta_url: string | null
          date: string
          date_end: string | null
          description: string | null
          id: string
          imageurl: string | null
          location: string | null
          title: string
        }
        Insert: {
          all_day?: boolean
          created_at?: string
          cta_url?: string | null
          date: string
          date_end?: string | null
          description?: string | null
          id?: string
          imageurl?: string | null
          location?: string | null
          title: string
        }
        Update: {
          all_day?: boolean
          created_at?: string
          cta_url?: string | null
          date?: string
          date_end?: string | null
          description?: string | null
          id?: string
          imageurl?: string | null
          location?: string | null
          title?: string
        }
        Relationships: []
      }
      fichas_cliente: {
        Row: {
          cc_numero: string | null
          created_at: string | null
          doencas: string | null
          emergencia_cc: string | null
          emergencia_data_nascimento: string | null
          emergencia_morada: string | null
          emergencia_nacionalidade: string | null
          emergencia_nif: string | null
          emergencia_nome: string | null
          emergencia_parentesco: string | null
          emergencia_telefone: string | null
          medicacao: string | null
          membro_id: string
          morada: string | null
          nacionalidade: string | null
          nif: string | null
          objetivo: string | null
          saude_observacoes: string | null
          updated_at: string | null
        }
        Insert: {
          cc_numero?: string | null
          created_at?: string | null
          doencas?: string | null
          emergencia_cc?: string | null
          emergencia_data_nascimento?: string | null
          emergencia_morada?: string | null
          emergencia_nacionalidade?: string | null
          emergencia_nif?: string | null
          emergencia_nome?: string | null
          emergencia_parentesco?: string | null
          emergencia_telefone?: string | null
          medicacao?: string | null
          membro_id: string
          morada?: string | null
          nacionalidade?: string | null
          nif?: string | null
          objetivo?: string | null
          saude_observacoes?: string | null
          updated_at?: string | null
        }
        Update: {
          cc_numero?: string | null
          created_at?: string | null
          doencas?: string | null
          emergencia_cc?: string | null
          emergencia_data_nascimento?: string | null
          emergencia_morada?: string | null
          emergencia_nacionalidade?: string | null
          emergencia_nif?: string | null
          emergencia_nome?: string | null
          emergencia_parentesco?: string | null
          emergencia_telefone?: string | null
          medicacao?: string | null
          membro_id?: string
          morada?: string | null
          nacionalidade?: string | null
          nif?: string | null
          objetivo?: string | null
          saude_observacoes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fichas_cliente_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: true
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fichas_cliente_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: true
            referencedRelation: "membros_status"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios: {
        Row: {
          created_at: string
          descricao: string
          dias_semana: string[] | null
          hora: string
          hora_fim: string | null
          hora_inicio: string | null
          id: string
          turma: string
        }
        Insert: {
          created_at?: string
          descricao: string
          dias_semana?: string[] | null
          hora: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          turma: string
        }
        Update: {
          created_at?: string
          descricao?: string
          dias_semana?: string[] | null
          hora?: string
          hora_fim?: string | null
          hora_inicio?: string | null
          id?: string
          turma?: string
        }
        Relationships: []
      }
      membros: {
        Row: {
          cota: number
          created_at: string
          created_by: string | null
          data_nascimento: string | null
          data_vencimento: string | null
          email: string | null
          id: string
          is_competicao: boolean | null
          is_isento: boolean | null
          nome: string
          observacoes: string | null
          seguro_ano_pago: number | null
          seguro_pago: string | null
          telefone: string | null
          turma: string
          updated_by: string | null
        }
        Insert: {
          cota?: number
          created_at?: string
          created_by?: string | null
          data_nascimento?: string | null
          data_vencimento?: string | null
          email?: string | null
          id?: string
          is_competicao?: boolean | null
          is_isento?: boolean | null
          nome: string
          observacoes?: string | null
          seguro_ano_pago?: number | null
          seguro_pago?: string | null
          telefone?: string | null
          turma: string
          updated_by?: string | null
        }
        Update: {
          cota?: number
          created_at?: string
          created_by?: string | null
          data_nascimento?: string | null
          data_vencimento?: string | null
          email?: string | null
          id?: string
          is_competicao?: boolean | null
          is_isento?: boolean | null
          nome?: string
          observacoes?: string | null
          seguro_ano_pago?: number | null
          seguro_pago?: string | null
          telefone?: string | null
          turma?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      modalidades: {
        Row: {
          created_at: string
          description: string | null
          horario_text: string | null
          id: string
          imageurl: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          horario_text?: string | null
          id?: string
          imageurl?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          horario_text?: string | null
          id?: string
          imageurl?: string | null
          title?: string
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          admin_id: string
          data_pagamento: string
          descricao: string | null
          id: string
          membro_id: string
          mes_referencia: string | null
          referencia_id: string | null
          tipo: string
          valor: number
        }
        Insert: {
          admin_id?: string
          data_pagamento?: string
          descricao?: string | null
          id?: string
          membro_id: string
          mes_referencia?: string | null
          referencia_id?: string | null
          tipo?: string
          valor: number
        }
        Update: {
          admin_id?: string
          data_pagamento?: string
          descricao?: string | null
          id?: string
          membro_id?: string
          mes_referencia?: string | null
          referencia_id?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros_status"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string | null
          role?: string | null
        }
        Relationships: []
      }
      store_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          imageurl: string | null
          in_stock: boolean | null
          name: string
          price: number
          published: boolean
          sort_order: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          imageurl?: string | null
          in_stock?: boolean | null
          name: string
          price: number
          published?: boolean
          sort_order?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          imageurl?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      membros_status: {
        Row: {
          cota: number | null
          created_at: string | null
          created_by: string | null
          data_nascimento: string | null
          data_vencimento: string | null
          email: string | null
          id: string | null
          is_competicao: boolean | null
          is_isento: boolean | null
          nome: string | null
          observacoes: string | null
          seguro_ano_pago: number | null
          seguro_pago: string | null
          status: string | null
          telefone: string | null
          turma: string | null
          updated_by: string | null
        }
        Insert: {
          cota?: number | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          data_vencimento?: string | null
          email?: string | null
          id?: string | null
          is_competicao?: boolean | null
          is_isento?: boolean | null
          nome?: string | null
          observacoes?: string | null
          seguro_ano_pago?: number | null
          seguro_pago?: string | null
          status?: never
          telefone?: string | null
          turma?: string | null
          updated_by?: string | null
        }
        Update: {
          cota?: number | null
          created_at?: string | null
          created_by?: string | null
          data_nascimento?: string | null
          data_vencimento?: string | null
          email?: string | null
          id?: string | null
          is_competicao?: boolean | null
          is_isento?: boolean | null
          nome?: string | null
          observacoes?: string | null
          seguro_ano_pago?: number | null
          seguro_pago?: string | null
          status?: never
          telefone?: string | null
          turma?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

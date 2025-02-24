export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          order_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          order_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_comments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tasks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          order_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          order_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          order_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_date: string
          drawing_file_path: string | null
          id: string
          material: string
          part_name: string
          price: number
          quantity: number
          status: string
          step_file_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_date: string
          drawing_file_path?: string | null
          id?: string
          material: string
          part_name: string
          price: number
          quantity: number
          status?: string
          step_file_path?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_date?: string
          drawing_file_path?: string | null
          id?: string
          material?: string
          part_name?: string
          price?: number
          quantity?: number
          status?: string
          step_file_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          billing_address: Json | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          shipping_address: Json | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          shipping_address?: Json | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          shipping_address?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          id: string
          quoted_price: number
          rfq_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quoted_price: number
          rfq_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quoted_price?: number
          rfq_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          created_at: string
          drawing_file_path: string
          expected_delivery_date: string
          id: string
          material: string
          quantity: number
          special_instructions: string | null
          status: string | null
          step_file_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          drawing_file_path: string
          expected_delivery_date: string
          id?: string
          material: string
          quantity: number
          special_instructions?: string | null
          status?: string | null
          step_file_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          drawing_file_path?: string
          expected_delivery_date?: string
          id?: string
          material?: string
          quantity?: number
          special_instructions?: string | null
          status?: string | null
          step_file_path?: string
          user_id?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

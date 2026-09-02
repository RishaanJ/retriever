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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          kind: Database["public"]["Enums"]["location_kind"]
          name: string
          parent_id: string | null
          sort_order: number
          tone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["location_kind"]
          name: string
          parent_id?: string | null
          sort_order?: number
          tone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["location_kind"]
          name?: string
          parent_id?: string | null
          sort_order?: number
          tone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "storage_area_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      part_requests: {
        Row: {
          created_at: string
          fulfilled_part_id: string | null
          id: string
          part_name: string
          priority: Database["public"]["Enums"]["request_priority"]
          quantity: number
          reason: string | null
          requested_by: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          fulfilled_part_id?: string | null
          id?: string
          part_name: string
          priority?: Database["public"]["Enums"]["request_priority"]
          quantity?: number
          reason?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          fulfilled_part_id?: string | null
          id?: string
          part_name?: string
          priority?: Database["public"]["Enums"]["request_priority"]
          quantity?: number
          reason?: string | null
          requested_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_requests_fulfilled_part_id_fkey"
            columns: ["fulfilled_part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_requests_fulfilled_part_id_fkey"
            columns: ["fulfilled_part_id"]
            isOneToOne: false
            referencedRelation: "parts_with_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_requests_fulfilled_part_id_fkey"
            columns: ["fulfilled_part_id"]
            isOneToOne: false
            referencedRelation: "recently_viewed_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      part_views: {
        Row: {
          id: number
          part_id: string
          viewed_at: string
        }
        Insert: {
          id?: number
          part_id: string
          viewed_at?: string
        }
        Update: {
          id?: number
          part_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "part_views_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_views_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "parts_with_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "part_views_part_id_fkey"
            columns: ["part_id"]
            isOneToOne: false
            referencedRelation: "recently_viewed_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      parts: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          location_id: string | null
          min_quantity: number
          name: string
          notes: string | null
          quantity: number
          search_vector: unknown
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          min_quantity?: number
          name: string
          notes?: string | null
          quantity?: number
          search_vector?: unknown
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          min_quantity?: number
          name?: string
          notes?: string | null
          quantity?: number
          search_vector?: unknown
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_area_summary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      location_paths: {
        Row: {
          area_id: string | null
          area_name: string | null
          depth: number | null
          id: string | null
          kind: Database["public"]["Enums"]["location_kind"] | null
          name: string | null
          parent_id: string | null
          path: string | null
        }
        Relationships: []
      }
      parts_with_location: {
        Row: {
          area_id: string | null
          area_name: string | null
          category_id: string | null
          category_name: string | null
          created_at: string | null
          id: string | null
          is_low_stock: boolean | null
          location_id: string | null
          location_path: string | null
          min_quantity: number | null
          name: string | null
          notes: string | null
          quantity: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_area_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      recently_viewed_parts: {
        Row: {
          area_id: string | null
          area_name: string | null
          category_id: string | null
          category_name: string | null
          id: string | null
          is_low_stock: boolean | null
          last_viewed_at: string | null
          location_id: string | null
          location_path: string | null
          min_quantity: number | null
          name: string | null
          quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "storage_area_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_area_summary: {
        Row: {
          icon: string | null
          id: string | null
          low_stock_count: number | null
          name: string | null
          part_count: number | null
          sort_order: number | null
          structure: string | null
          tone: string | null
          total_quantity: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      record_part_view: { Args: { part: string }; Returns: undefined }
      search_parts: {
        Args: { q?: string }
        Returns: {
          area_id: string
          area_name: string
          category_id: string
          category_name: string
          id: string
          is_low_stock: boolean
          location_id: string
          location_path: string
          min_quantity: number
          name: string
          notes: string
          quantity: number
          rank: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      location_kind:
        | "area"
        | "tier"
        | "shelf"
        | "drawer"
        | "bin"
        | "box"
        | "compartment"
        | "section"
      request_priority: "low" | "normal" | "high"
      request_status: "requested" | "ordered" | "arrived"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      location_kind: [
        "area",
        "tier",
        "shelf",
        "drawer",
        "bin",
        "box",
        "compartment",
        "section",
      ],
      request_priority: ["low", "normal", "high"],
      request_status: ["requested", "ordered", "arrived"],
    },
  },
} as const

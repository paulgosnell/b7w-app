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
      changelog: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          story_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          story_id?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          story_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "changelog_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      epics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          author: string
          content: string
          created_at: string | null
          id: string
          image_urls: string[] | null
          parent_id: string | null
          related_changelog_id: string | null
          related_story_id: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          parent_id?: string | null
          related_changelog_id?: string | null
          related_story_id?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          id?: string
          image_urls?: string[] | null
          parent_id?: string | null
          related_changelog_id?: string | null
          related_story_id?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_related_changelog_id_fkey"
            columns: ["related_changelog_id"]
            isOneToOne: false
            referencedRelation: "changelog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_related_story_id_fkey"
            columns: ["related_story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      project_meta: {
        Row: {
          current_week: number | null
          id: string
          start_date: string | null
          status: string | null
          target_end_date: string | null
          total_weeks: number | null
          updated_at: string | null
        }
        Insert: {
          current_week?: number | null
          id?: string
          start_date?: string | null
          status?: string | null
          target_end_date?: string | null
          total_weeks?: number | null
          updated_at?: string | null
        }
        Update: {
          current_week?: number | null
          id?: string
          start_date?: string | null
          status?: string | null
          target_end_date?: string | null
          total_weeks?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          completed_week: number | null
          created_at: string | null
          description: string | null
          epic_id: string | null
          id: string
          notes: string | null
          order_index: number | null
          planned_week: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed_week?: number | null
          created_at?: string | null
          description?: string | null
          epic_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          planned_week?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed_week?: number | null
          created_at?: string | null
          description?: string | null
          epic_id?: string | null
          id?: string
          notes?: string | null
          order_index?: number | null
          planned_week?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_epic_id_fkey"
            columns: ["epic_id"]
            isOneToOne: false
            referencedRelation: "epics"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_updates: {
        Row: {
          blockers: string[] | null
          completed: string[] | null
          created_at: string | null
          date: string
          id: string
          in_progress: string[] | null
          loom_url: string | null
          next_week: string[] | null
          notes: string | null
          summary: string
          week_number: number
        }
        Insert: {
          blockers?: string[] | null
          completed?: string[] | null
          created_at?: string | null
          date: string
          id?: string
          in_progress?: string[] | null
          loom_url?: string | null
          next_week?: string[] | null
          notes?: string | null
          summary: string
          week_number: number
        }
        Update: {
          blockers?: string[] | null
          completed?: string[] | null
          created_at?: string | null
          date?: string
          id?: string
          in_progress?: string[] | null
          loom_url?: string | null
          next_week?: string[] | null
          notes?: string | null
          summary?: string
          week_number?: number
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

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenient type aliases
export type Epic = Tables<'epics'>
export type Story = Tables<'stories'>
export type WeeklyUpdate = Tables<'weekly_updates'>
export type Changelog = Tables<'changelog'>
export type Feedback = Tables<'feedback'>
export type ProjectMeta = Tables<'project_meta'>

// Story with epic relationship
export type StoryWithEpic = Story & {
  epics: Epic | null
}

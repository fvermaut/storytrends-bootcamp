export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      jobs: {
        Row: {
          blocks_job_id: string | null
          created_at: string
          ended_at: string | null
          id: string
          pipeline_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["pipeline_status"] | null
          status_current_step: number | null
          status_message: string | null
          status_total_steps: number | null
          status_updated_at: string | null
          updated_at: string | null
        }
        Insert: {
          blocks_job_id?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          pipeline_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"] | null
          status_current_step?: number | null
          status_message?: string | null
          status_total_steps?: number | null
          status_updated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          blocks_job_id?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          pipeline_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"] | null
          status_current_step?: number | null
          status_message?: string | null
          status_total_steps?: number | null
          status_updated_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_jobs_blocks_job_id_fkey"
            columns: ["blocks_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          created_at: string
          eval: boolean | null
          eval_coherence: number | null
          eval_continuity: number | null
          eval_cross_diversity: number | null
          eval_diversity: number | null
          eval_merged_ratio: number | null
          eval_outliers_ratio: number | null
          eval_perplexity: number | null
          eval_reactivity: number | null
          eval_stability: number | null
          eval_topic_count: number | null
          eval_topic_size: number | null
          has_errors: boolean | null
          hyperparams_map: Json | null
          id: string
          name: string | null
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          eval?: boolean | null
          eval_coherence?: number | null
          eval_continuity?: number | null
          eval_cross_diversity?: number | null
          eval_diversity?: number | null
          eval_merged_ratio?: number | null
          eval_outliers_ratio?: number | null
          eval_perplexity?: number | null
          eval_reactivity?: number | null
          eval_stability?: number | null
          eval_topic_count?: number | null
          eval_topic_size?: number | null
          has_errors?: boolean | null
          hyperparams_map?: Json | null
          id?: string
          name?: string | null
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          eval?: boolean | null
          eval_coherence?: number | null
          eval_continuity?: number | null
          eval_cross_diversity?: number | null
          eval_diversity?: number | null
          eval_merged_ratio?: number | null
          eval_outliers_ratio?: number | null
          eval_perplexity?: number | null
          eval_reactivity?: number | null
          eval_stability?: number | null
          eval_topic_count?: number | null
          eval_topic_size?: number | null
          has_errors?: boolean | null
          hyperparams_map?: Json | null
          id?: string
          name?: string | null
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_steps: {
        Row: {
          created_at: string
          dry_run: boolean | null
          id: string
          mdl_id: string | null
          pipeline_id: string
          running: boolean | null
          step_number: number | null
          task_metadata: Json | null
          task_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dry_run?: boolean | null
          id?: string
          mdl_id?: string | null
          pipeline_id: string
          running?: boolean | null
          step_number?: number | null
          task_metadata?: Json | null
          task_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dry_run?: boolean | null
          id?: string
          mdl_id?: string | null
          pipeline_id?: string
          running?: boolean | null
          step_number?: number | null
          task_metadata?: Json | null
          task_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_steps_model_id_fkey"
            columns: ["mdl_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_steps_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          blocks_pipeline_id: string | null
          created_at: string
          eval: boolean | null
          id: string
          mdl_id: string | null
          name: string | null
          project_id: string
          running: boolean | null
          updated_at: string | null
        }
        Insert: {
          blocks_pipeline_id?: string | null
          created_at?: string
          eval?: boolean | null
          id?: string
          mdl_id?: string | null
          name?: string | null
          project_id: string
          running?: boolean | null
          updated_at?: string | null
        }
        Update: {
          blocks_pipeline_id?: string | null
          created_at?: string
          eval?: boolean | null
          id?: string
          mdl_id?: string | null
          name?: string | null
          project_id?: string
          running?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_model_id_fkey"
            columns: ["mdl_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipelines_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_pipelines_blocks_pipeline_id_fkey"
            columns: ["blocks_pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          error_message: string | null
          evaluation_criterias: Json | null
          hyperparams_map: Json | null
          id: string
          internal: boolean | null
          last_started_at: string | null
          name: string | null
          settings: Json | null
          source_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          target_status: Database["public"]["Enums"]["project_status"]
          type: Database["public"]["Enums"]["project_types"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          evaluation_criterias?: Json | null
          hyperparams_map?: Json | null
          id: string
          internal?: boolean | null
          last_started_at?: string | null
          name?: string | null
          settings?: Json | null
          source_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_status?: Database["public"]["Enums"]["project_status"]
          type?: Database["public"]["Enums"]["project_types"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          evaluation_criterias?: Json | null
          hyperparams_map?: Json | null
          id?: string
          internal?: boolean | null
          last_started_at?: string | null
          name?: string | null
          settings?: Json | null
          source_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_status?: Database["public"]["Enums"]["project_status"]
          type?: Database["public"]["Enums"]["project_types"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_projects_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_projects_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          last_imported_at: string | null
          name: string | null
          stats: Json | null
          status: Database["public"]["Enums"]["source_status"]
          target_status: Database["public"]["Enums"]["source_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id: string
          last_imported_at?: string | null
          name?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["source_status"]
          target_status?: Database["public"]["Enums"]["source_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          last_imported_at?: string | null
          name?: string | null
          stats?: Json | null
          status?: Database["public"]["Enums"]["source_status"]
          target_status?: Database["public"]["Enums"]["source_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_sources_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string
          foreign_id: string | null
          id: number
          job_ids: string[] | null
          pub_date: string | null
          source_id: string | null
          summary: string | null
          text: string | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          foreign_id?: string | null
          id?: number
          job_ids?: string[] | null
          pub_date?: string | null
          source_id?: string | null
          summary?: string | null
          text?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          foreign_id?: string | null
          id?: number
          job_ids?: string[] | null
          pub_date?: string | null
          source_id?: string | null
          summary?: string | null
          text?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_stories_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          dry_run: boolean | null
          ended_at: string | null
          force: boolean | null
          id: string
          job_id: string
          pipeline_step_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["pipeline_status"]
          status_message: string | null
          status_updated_at: string | null
          step_number: number | null
          task_metadata: Json | null
          task_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          dry_run?: boolean | null
          ended_at?: string | null
          force?: boolean | null
          id?: string
          job_id: string
          pipeline_step_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"]
          status_message?: string | null
          status_updated_at?: string | null
          step_number?: number | null
          task_metadata?: Json | null
          task_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          dry_run?: boolean | null
          ended_at?: string | null
          force?: boolean | null
          id?: string
          job_id?: string
          pipeline_step_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["pipeline_status"]
          status_message?: string | null
          status_updated_at?: string | null
          step_number?: number | null
          task_metadata?: Json | null
          task_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_pipeline_step_id_fkey"
            columns: ["pipeline_step_id"]
            isOneToOne: false
            referencedRelation: "pipeline_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          centroid: number[] | null
          coherence_c_npmi: number | null
          coherence_c_uci: number | null
          coherence_c_v: number | null
          coherence_u_mass: number | null
          confidence: number | null
          created_at: string
          date: string | null
          extracted_name: string | null
          family_id: string
          first_extraction_date: string | null
          id: string
          keywords: string[] | null
          llm_additional_info: Json | null
          mdl_id: string | null
          outliers: boolean
          representation: string | null
          size: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["topic_status"] | null
          task_id: string | null
          trend_size: Database["public"]["Enums"]["topic_trends"] | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          centroid?: number[] | null
          coherence_c_npmi?: number | null
          coherence_c_uci?: number | null
          coherence_c_v?: number | null
          coherence_u_mass?: number | null
          confidence?: number | null
          created_at?: string
          date?: string | null
          extracted_name?: string | null
          family_id?: string
          first_extraction_date?: string | null
          id?: string
          keywords?: string[] | null
          llm_additional_info?: Json | null
          mdl_id?: string | null
          outliers?: boolean
          representation?: string | null
          size?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["topic_status"] | null
          task_id?: string | null
          trend_size?: Database["public"]["Enums"]["topic_trends"] | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          centroid?: number[] | null
          coherence_c_npmi?: number | null
          coherence_c_uci?: number | null
          coherence_c_v?: number | null
          coherence_u_mass?: number | null
          confidence?: number | null
          created_at?: string
          date?: string | null
          extracted_name?: string | null
          family_id?: string
          first_extraction_date?: string | null
          id?: string
          keywords?: string[] | null
          llm_additional_info?: Json | null
          mdl_id?: string | null
          outliers?: boolean
          representation?: string | null
          size?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["topic_status"] | null
          task_id?: string | null
          trend_size?: Database["public"]["Enums"]["topic_trends"] | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_topics_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_mdl_id_fkey"
            columns: ["mdl_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      topics_stories: {
        Row: {
          created_at: string
          is_representative_doc: boolean | null
          story_id: number
          story_prob: number | null
          topic_id: string
        }
        Insert: {
          created_at?: string
          is_representative_doc?: boolean | null
          story_id: number
          story_prob?: number | null
          topic_id: string
        }
        Update: {
          created_at?: string
          is_representative_doc?: boolean | null
          story_id?: number
          story_prob?: number | null
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_stories_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_stories_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_projects: {
        Row: {
          created_at: string
          id: string
          name: string | null
          req_hyperparams_map: Json | null
          req_model_id: string | null
          req_settings: Json | null
          req_source_id: string | null
          req_start_date: string | null
          req_status: Database["public"]["Enums"]["project_status"] | null
          req_type: Database["public"]["Enums"]["project_types"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          req_hyperparams_map?: Json | null
          req_model_id?: string | null
          req_settings?: Json | null
          req_source_id?: string | null
          req_start_date?: string | null
          req_status?: Database["public"]["Enums"]["project_status"] | null
          req_type?: Database["public"]["Enums"]["project_types"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          req_hyperparams_map?: Json | null
          req_model_id?: string | null
          req_settings?: Json | null
          req_source_id?: string | null
          req_start_date?: string | null
          req_status?: Database["public"]["Enums"]["project_status"] | null
          req_type?: Database["public"]["Enums"]["project_types"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_projects_req_source_id_fkey"
            columns: ["req_source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sources: {
        Row: {
          created_at: string
          custom_settings: Json | null
          id: string
          name: string | null
          req_status: Database["public"]["Enums"]["source_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          custom_settings?: Json | null
          id?: string
          name?: string | null
          req_status?: Database["public"]["Enums"]["source_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          custom_settings?: Json | null
          id?: string
          name?: string | null
          req_status?: Database["public"]["Enums"]["source_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_user_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string
          health_checked_at: string | null
          id: string
          job_id: string | null
          status: Database["public"]["Enums"]["worker_status"]
          status_updated_at: string | null
          type: Database["public"]["Enums"]["worker_type"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          health_checked_at?: string | null
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["worker_status"]
          status_updated_at?: string | null
          type?: Database["public"]["Enums"]["worker_type"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          health_checked_at?: string | null
          id?: string
          job_id?: string | null
          status?: Database["public"]["Enums"]["worker_status"]
          status_updated_at?: string | null
          type?: Database["public"]["Enums"]["worker_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_workers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allocate_worker: {
        Args: {
          worker_type_input: Database["public"]["Enums"]["worker_type"]
          job_id_input: string
        }
        Returns: {
          id: string
          created_at: string
          updated_at: string
          status_updated_at: string
          health_checked_at: string
          job_id: string
          status: Database["public"]["Enums"]["worker_status"]
          type: Database["public"]["Enums"]["worker_type"]
        }[]
      }
      create_topic: {
        Args: {
          extracted_name_input: string
          keywords_input: string[]
          story_ids_input: number[]
          story_probs_input: number[]
          representative_docs_input: boolean[]
          centroid_input: number[]
          coherence_c_v_input: number
          coherence_u_mass_input: number
          coherence_c_npmi_input: number
          coherence_c_uci_input: number
          outliers_input: boolean
          date_input: string
          start_date_input: string
          model_id_input: string
          task_id_input: string
        }
        Returns: string
      }
      get_project_embedding_dimensions: {
        Args: {
          project_id_input: string
        }
        Returns: {
          unique_dimension: number
        }[]
      }
      get_source_date_range: {
        Args: {
          source_id_input: string
        }
        Returns: {
          min_date: string
          max_date: string
        }[]
      }
      get_total_embedding_dimension_in_project: {
        Args: {
          project_id_input: string
        }
        Returns: number
      }
      merge_topics: {
        Args: {
          topic_from_id_input: string
          topic_to_id_input: string
        }
        Returns: {
          centroid: number[] | null
          coherence_c_npmi: number | null
          coherence_c_uci: number | null
          coherence_c_v: number | null
          coherence_u_mass: number | null
          confidence: number | null
          created_at: string
          date: string | null
          extracted_name: string | null
          family_id: string
          first_extraction_date: string | null
          id: string
          keywords: string[] | null
          llm_additional_info: Json | null
          mdl_id: string | null
          outliers: boolean
          representation: string | null
          size: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["topic_status"] | null
          task_id: string | null
          trend_size: Database["public"]["Enums"]["topic_trends"] | null
          updated_at: string | null
          version: number | null
        }
      }
      process_user_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          name: string | null
          req_hyperparams_map: Json | null
          req_model_id: string | null
          req_settings: Json | null
          req_source_id: string | null
          req_start_date: string | null
          req_status: Database["public"]["Enums"]["project_status"] | null
          req_type: Database["public"]["Enums"]["project_types"]
          updated_at: string | null
          user_id: string | null
        }[]
      }
      process_user_sources: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          custom_settings: Json | null
          id: string
          name: string | null
          req_status: Database["public"]["Enums"]["source_status"] | null
          updated_at: string | null
          user_id: string | null
        }[]
      }
      update_task_status: {
        Args: {
          task_id_input: string
          task_status_input: Database["public"]["Enums"]["pipeline_status"]
          task_status_message_input: string
          task_started_input: boolean
          task_ended_input: boolean
          job_started_input: boolean
          job_ended_input: boolean
        }
        Returns: {
          created_at: string
          dry_run: boolean | null
          ended_at: string | null
          force: boolean | null
          id: string
          job_id: string
          pipeline_step_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["pipeline_status"]
          status_message: string | null
          status_updated_at: string | null
          step_number: number | null
          task_metadata: Json | null
          task_type: string | null
          updated_at: string | null
        }
      }
    }
    Enums: {
      pipeline_status:
        | "INIT"
        | "WAITING"
        | "QUEUED"
        | "RUNNING"
        | "SUCCESS"
        | "FAILED"
        | "ABORTED"
      project_status:
        | "INIT"
        | "CREATED"
        | "READY"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED"
        | "DELETED"
      project_types: "EVAL" | "EVAL_1" | "EVAL_2" | "LIVE"
      source_status: "INIT" | "READY" | "SUSPENDED" | "DELETED"
      topic_status: "INIT" | "LATEST" | "REPLACED" | "MERGED"
      topic_trends: "NEW" | "UP" | "STABLE" | "DOWN"
      worker_status: "IDLE" | "ALLOCATED" | "UNRESPONSIVE" | "TERMINATED"
      worker_type: "topic" | "lang" | "eval" | "source"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
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


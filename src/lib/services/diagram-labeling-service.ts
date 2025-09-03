import { supabase } from '@/lib/supabase/client';

export interface Diagram {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  labels?: Label[];
}

export interface Label {
  id: number;
  diagram_id: number;
  label_number: number;
  x_position: number;
  y_position: number;
  answer: string;
}

export class DiagramLabelingService {
  static async getDiagrams(): Promise<Diagram[]> {
    const { data, error } = await supabase
      .from('diagrams')
      .select(`
        *,
        diagram_labels (
          id,
          diagram_id,
          label_number,
          x_position,
          y_position,
          answer
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching diagrams:', error);
      return [];
    }

    // Transform the data to match our interface
    return (data || []).map(diagram => ({
      ...diagram,
      labels: diagram.diagram_labels || []
    }));
  }

  static async createDiagram(title: string, imageUrl: string): Promise<Diagram | null> {
    const { data, error } = await supabase
      .from('diagrams')
      .insert([
        {
          title,
          image_url: imageUrl,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating diagram:', error);
      return null;
    }

    return data;
  }

  static async addLabel(diagramId: number, labelNumber: number, xPosition: number, yPosition: number, answer: string): Promise<Label | null> {
    const { data, error } = await supabase
      .from('diagram_labels')
      .insert([
        {
          diagram_id: diagramId,
          label_number: labelNumber,
          x_position: xPosition,
          y_position: yPosition,
          answer: answer,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding label:', error);
      return null;
    }

    return data;
  }

  static async updateLabel(labelId: number, answer: string): Promise<Label | null> {
    const { data, error } = await supabase
      .from('diagram_labels')
      .update({ answer })
      .eq('id', labelId)
      .select()
      .single();

    if (error) {
      console.error('Error updating label:', error);
      return null;
    }

    return data;
  }

  static async deleteDiagram(diagramId: number): Promise<boolean> {
    // First delete all labels for this diagram
    const { error: labelsError } = await supabase
      .from('diagram_labels')
      .delete()
      .eq('diagram_id', diagramId);

    if (labelsError) {
      console.error('Error deleting labels:', labelsError);
      return false;
    }

    // Then delete the diagram
    const { error } = await supabase
      .from('diagrams')
      .delete()
      .eq('id', diagramId);

    if (error) {
      console.error('Error deleting diagram:', error);
      return false;
    }

    return true;
  }

  static async getLabelsForDiagram(diagramId: number): Promise<Label[]> {
    const { data, error } = await supabase
      .from('diagram_labels')
      .select('*')
      .eq('diagram_id', diagramId)
      .order('label_number', { ascending: true });

    if (error) {
      console.error('Error fetching labels:', error);
      return [];
    }

    return data || [];
  }
}
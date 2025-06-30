'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Minus } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';
import type { TermConcept } from '@/shared/schemas/concepts';
import { VARIATION_TYPES } from '@/shared/schemas/concepts';

const conceptSchema = z.object({
  term: z.string().min(1, 'Term is required'),
  definition: z.string().min(1, 'Definition is required'),
  variations: z.array(z.object({
    type: z.string().min(1),
    text: z.string().min(1),
  })).optional(),
});

const deckFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  concepts: z.array(conceptSchema).min(1, 'At least one concept is required'),
});

export type DeckFormData = z.infer<typeof deckFormSchema>;

interface DeckFormProps {
  initialData?: Partial<Deck>;
  onSubmit: (data: DeckFormData) => Promise<void>;
  submitLabel: string;
  isLoading?: boolean;
}

export const DeckForm: React.FC<DeckFormProps> = ({
  initialData,
  onSubmit,
  submitLabel,
  isLoading = false,
}) => {
  const form = useForm<DeckFormData>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      concepts: initialData?.concepts?.map(concept => ({
        term: concept.conceptType === 'term' ? concept.term : '',
        definition: concept.conceptType === 'term' ? concept.definition : '',
        variations: concept.conceptType === 'term' ? concept.variations || [] : [],
      })) || [{ term: '', definition: '', variations: [] }],
    },
  });

  const { fields: conceptFields, append: appendConcept, remove: removeConcept } = 
    form.useFieldArray({ name: 'concepts' });

  const addConcept = () => {
    appendConcept({ term: '', definition: '', variations: [] });
  };

  const addVariation = (conceptIndex: number) => {
    const currentVariations = form.getValues(`concepts.${conceptIndex}.variations`) || [];
    form.setValue(`concepts.${conceptIndex}.variations`, [
      ...currentVariations,
      { type: 'example', text: '' }
    ]);
  };

  const removeVariation = (conceptIndex: number, variationIndex: number) => {
    const currentVariations = form.getValues(`concepts.${conceptIndex}.variations`) || [];
    form.setValue(`concepts.${conceptIndex}.variations`, 
      currentVariations.filter((_, i) => i !== variationIndex)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Deck Information</CardTitle>
            <CardDescription>
              Basic details about your learning deck
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Spanish Basics, Science Concepts..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what this deck covers..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Concepts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Concepts</CardTitle>
                <CardDescription>
                  Add the terms and concepts you want to learn
                </CardDescription>
              </div>
              <Button type="button" onClick={addConcept} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Concept
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {conceptFields.map((field, conceptIndex) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Concept {conceptIndex + 1}</Badge>
                  {conceptFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeConcept(conceptIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`concepts.${conceptIndex}.term`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term/Word *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Mitochondria, Hola..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`concepts.${conceptIndex}.definition`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Definition *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Clear explanation of the term..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Variations */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <FormLabel>Variations (Optional)</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addVariation(conceptIndex)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Variation
                    </Button>
                  </div>
                  
                  {form.watch(`concepts.${conceptIndex}.variations`)?.map((variation, variationIndex) => (
                    <div key={variationIndex} className="flex gap-2 mb-2">
                      <Select
                        value={variation.type}
                        onValueChange={(value) => 
                          form.setValue(`concepts.${conceptIndex}.variations.${variationIndex}.type`, value)
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {VARIATION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        value={variation.text}
                        onChange={(e) => 
                          form.setValue(`concepts.${conceptIndex}.variations.${variationIndex}.text`, e.target.value)
                        }
                        placeholder="Variation text..."
                        className="flex-1"
                      />
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariation(conceptIndex, variationIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
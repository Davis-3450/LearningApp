import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DecksAPI } from '@/lib/api/decks';
import type { Deck } from '@/shared/schemas/deck';

export const useDecks = () => {
  return useQuery({
    queryKey: ['decks'],
    queryFn: async () => {
      const response = await DecksAPI.getAll();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch decks');
      }
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeck = (fileName: string) => {
  return useQuery({
    queryKey: ['deck', fileName],
    queryFn: async () => {
      const response = await DecksAPI.getOne(fileName);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch deck');
      }
      return response.data;
    },
    enabled: !!fileName,
    staleTime: 10 * 60 * 1000, // 10 minutes - decks don't change often
  });
};

export const useCreateDeck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (deck: Omit<Deck, 'id'>) => DecksAPI.create(deck),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['decks'] });
      }
    },
  });
};

export const useUpdateDeck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fileName, deck }: { fileName: string; deck: Deck }) => 
      DecksAPI.update(fileName, deck),
    onSuccess: (response, { fileName }) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['decks'] });
        queryClient.invalidateQueries({ queryKey: ['deck', fileName] });
      }
    },
  });
};

export const useDeleteDeck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (fileName: string) => DecksAPI.delete(fileName),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['decks'] });
      }
    },
  });
};

export const useImportDeck = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => DecksAPI.import(file),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['decks'] });
      }
    },
  });
};
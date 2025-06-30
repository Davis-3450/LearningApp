import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DecksAPI } from '@/lib/api/decks'
import type { Deck } from '@/shared/schemas/deck'

export const DECK_QUERY_KEYS = {
  all: ['decks'] as const,
  lists: () => [...DECK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...DECK_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...DECK_QUERY_KEYS.all, 'detail'] as const,
  detail: (fileName: string) => [...DECK_QUERY_KEYS.details(), fileName] as const,
  public: () => [...DECK_QUERY_KEYS.all, 'public'] as const,
  myPosts: () => [...DECK_QUERY_KEYS.all, 'myPosts'] as const,
}

// Hook to get all decks
export function useDecks() {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await DecksAPI.getAll()
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch decks')
      }
      return response.data || []
    },
  })
}

// Hook to get a single deck
export function useDeck(fileName: string) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.detail(fileName),
    queryFn: async () => {
      const response = await DecksAPI.getOne(fileName)
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch deck')
      }
      return response.data
    },
    enabled: !!fileName,
  })
}

// Hook to create a deck
export function useCreateDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (deck: Omit<Deck, 'id'>) => {
      const response = await DecksAPI.create(deck)
      if (!response.success) {
        throw new Error(response.error || 'Failed to create deck')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch deck lists
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() })
    },
  })
}

// Hook to update a deck
export function useUpdateDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ fileName, deck }: { fileName: string; deck: Deck }) => {
      const response = await DecksAPI.update(fileName, deck)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update deck')
      }
      return response.data
    },
    onSuccess: (data, variables) => {
      // Invalidate deck lists and specific deck detail
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(variables.fileName) })
    },
  })
}

// Hook to delete a deck
export function useDeleteDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (fileName: string) => {
      const response = await DecksAPI.delete(fileName)
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete deck')
      }
      return response
    },
    onSuccess: () => {
      // Invalidate deck lists
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() })
    },
  })
}

// Hook to import a deck
export function useImportDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await DecksAPI.import(file)
      if (!response.success) {
        throw new Error(response.error || 'Failed to import deck')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate deck lists
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() })
    },
  })
}

// Hook to post a deck publicly
export function usePostDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      fileName, 
      deck, 
      metadata 
    }: { 
      fileName: string; 
      deck: Deck; 
      metadata?: { author?: string; tags?: string[]; isPublic?: boolean } 
    }) => {
      const response = await DecksAPI.postDeck(fileName, deck, metadata)
      if (!response.success) {
        throw new Error(response.error || 'Failed to post deck')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate public decks and my posts
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.public() })
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.myPosts() })
    },
  })
}

// Hook to get public decks
export function usePublicDecks() {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.public(),
    queryFn: async () => {
      const response = await DecksAPI.getPublicDecks()
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch public decks')
      }
      return response.data || []
    },
  })
}

// Hook to get user's posted decks
export function useMyPosts() {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.myPosts(),
    queryFn: async () => {
      const response = await DecksAPI.getMyPosts()
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch my posts')
      }
      return response.data || []
    },
  })
}

// Hook to like/unlike a deck
export function useLikeDeck() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ postId, action }: { postId: string; action: 'like' | 'unlike' }) => {
      const response = action === 'like' 
        ? await DecksAPI.likeDeck(postId)
        : await DecksAPI.unlikeDeck(postId)
      
      if (!response.success) {
        throw new Error(response.error || `Failed to ${action} deck`)
      }
      return response
    },
    onSuccess: () => {
      // Invalidate public decks to refresh like counts
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.public() })
    },
  })
}

// Hook to generate deck with AI
export function useGenerateDeckWithAI() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (params: {
      topic: string;
      description?: string;
      conceptCount: number;
    }) => {
      const response = await DecksAPI.generateWithAI(params)
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate deck with AI')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidate deck lists since a new deck might be created
      queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() })
    },
  })
} 
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Playlist, Mood } from '@/types';

const STORAGE_KEY = 'poemcloud_playlists';

export const [PlaylistProvider, usePlaylists] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const playlistsQuery = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Playlist[];
      }
      return [];
    },
  });

  useEffect(() => {
    if (playlistsQuery.data) {
      setPlaylists(playlistsQuery.data);
    }
  }, [playlistsQuery.data]);

  const { mutate: savePlaylists } = useMutation({
    mutationFn: async (data: Playlist[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  const createPlaylist = useCallback((
    title: string,
    coverImageUrl?: string,
    moods: Mood[] = [],
    countryCodes: string[] = [],
    initialPoemId?: string
  ): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      coverImageUrl,
      moods,
      countryCodes,
      poemIds: initialPoemId ? [initialPoemId] : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setPlaylists(prev => {
      const updated = [newPlaylist, ...prev];
      savePlaylists(updated);
      return updated;
    });

    return newPlaylist;
  }, [savePlaylists]);

  const updatePlaylist = useCallback((
    playlistId: string,
    updates: Partial<Omit<Playlist, 'id' | 'createdAt'>>
  ) => {
    setPlaylists(prev => {
      const updated = prev.map(p => 
        p.id === playlistId 
          ? { ...p, ...updates, updatedAt: Date.now() }
          : p
      );
      savePlaylists(updated);
      return updated;
    });
  }, [savePlaylists]);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== playlistId);
      savePlaylists(updated);
      return updated;
    });
  }, [savePlaylists]);

  const addPoemToPlaylist = useCallback((playlistId: string, poemId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId && !p.poemIds.includes(poemId)) {
          return { ...p, poemIds: [...p.poemIds, poemId], updatedAt: Date.now() };
        }
        return p;
      });
      savePlaylists(updated);
      return updated;
    });
  }, [savePlaylists]);

  const removePoemFromPlaylist = useCallback((playlistId: string, poemId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id === playlistId) {
          return { 
            ...p, 
            poemIds: p.poemIds.filter(id => id !== poemId), 
            updatedAt: Date.now() 
          };
        }
        return p;
      });
      savePlaylists(updated);
      return updated;
    });
  }, [savePlaylists]);

  const addPoemToMultiplePlaylists = useCallback((poemId: string, playlistIds: string[]) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (playlistIds.includes(p.id) && !p.poemIds.includes(poemId)) {
          return { ...p, poemIds: [...p.poemIds, poemId], updatedAt: Date.now() };
        }
        return p;
      });
      savePlaylists(updated);
      return updated;
    });
  }, [savePlaylists]);

  const isPoemInPlaylist = useCallback((playlistId: string, poemId: string): boolean => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist ? playlist.poemIds.includes(poemId) : false;
  }, [playlists]);

  const getPlaylistById = useCallback((playlistId: string): Playlist | undefined => {
    return playlists.find(p => p.id === playlistId);
  }, [playlists]);

  const getPlaylistsContainingPoem = useCallback((poemId: string): Playlist[] => {
    return playlists.filter(p => p.poemIds.includes(poemId));
  }, [playlists]);

  return {
    playlists,
    isLoading: playlistsQuery.isLoading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addPoemToPlaylist,
    removePoemFromPlaylist,
    addPoemToMultiplePlaylists,
    isPoemInPlaylist,
    getPlaylistById,
    getPlaylistsContainingPoem,
  };
});

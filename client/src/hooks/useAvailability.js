import { useCallback, useEffect, useRef, useState } from 'react';
import api, { getError } from '../services/api';
import socket from '../services/socket';

// Live availability for one room.
// status: 'idle' (no dates yet) | 'checking' | 'available' | 'unavailable' | 'error'
export default function useAvailability(roomId, checkIn, checkOut) {
  const [state, setState] = useState({ status: 'idle', conflicts: [], bookedRanges: [], reason: null, error: '' });
  const latest = useRef(0); // ignore responses from outdated requests

  const check = useCallback(async () => {
    const id = ++latest.current;
    const hasDates = checkIn && checkOut;
    if (hasDates && checkOut <= checkIn) {
      setState((s) => ({ ...s, status: 'error', error: 'Check-out must be after check-in.' }));
      return;
    }
    if (hasDates) setState((s) => ({ ...s, status: 'checking', error: '' }));
    try {
      const { data } = await api.get(`/rooms/${roomId}/availability`, {
        params: hasDates ? { checkIn, checkOut } : {},
      });
      if (id !== latest.current) return;
      setState({
        status: !hasDates ? 'idle' : data.available ? 'available' : 'unavailable',
        conflicts: data.conflicts || [],
        bookedRanges: data.bookedRanges || [],
        reason: data.reason || null,
        error: '',
      });
    } catch (err) {
      if (id !== latest.current) return;
      setState((s) => ({ ...s, status: 'error', error: getError(err) }));
    }
  }, [roomId, checkIn, checkOut]);

  // Re-check shortly after the dates change (debounced while the user types)
  useEffect(() => {
    const t = setTimeout(check, 350);
    return () => clearTimeout(t);
  }, [check]);

  // Live updates: re-check whenever someone books or cancels this room
  useEffect(() => {
    socket.emit('room:watch', roomId);
    const onChange = (payload) => { if (payload.roomId === String(roomId)) check(); };
    socket.on('availability:changed', onChange);
    socket.on('connect', check); // catch up after a dropped connection
    return () => {
      socket.emit('room:unwatch', roomId);
      socket.off('availability:changed', onChange);
      socket.off('connect', check);
    };
  }, [roomId, check]);

  return { ...state, recheck: check };
}

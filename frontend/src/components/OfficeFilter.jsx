import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function OfficeFilter({ officeTags, children, fallback = null }) {
  const { user } = useAuth();
  
  // If no officeTags defined on the item, assume it's visible to everyone
  if (!officeTags || officeTags.length === 0) {
    return <>{children}</>;
  }

  // If user is not logged in or has no office, maybe they shouldn't see targeted alerts
  if (!user || !user.district) {
    return <>{fallback}</>;
  }

  const normalizedUserOffice = user.district.toLowerCase();
  const normalizedTags = officeTags.map(t => typeof t === 'string' ? t.toLowerCase() : '');

  const isAuthorized = normalizedTags.includes('state') || 
                       normalizedTags.includes('all') || 
                       normalizedTags.includes(normalizedUserOffice);

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { persistOrgId, sanitizeNumericId } from '@/utils/security';

export default function HomeRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const startapp = sanitizeNumericId(params.get('startapp'));
    const orgId = sanitizeNumericId(params.get('org_id'));
    const resolvedOrgId = persistOrgId(startapp || orgId);

    if (resolvedOrgId && !params.get('org_id')) {
      params.set('org_id', resolvedOrgId);
    }

    const query = params.toString();
    navigate(query ? `/catalog?${query}` : '/catalog', { replace: true });
  }, [location.search, navigate]);

  return null;
}

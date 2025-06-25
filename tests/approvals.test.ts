import { render, screen, fireEvent } from '@testing-library/react';
import { useApprovals } from '../src/lib/approvals';
import React from 'react';
import supertest from 'supertest';
import handler from '../pages/api/approvals/index';
import { apiResolver } from 'next/dist/server/api-utils/node';
import http from 'http';

jest.mock('@supabase/supabase-js', () => {
  const actual = jest.requireActual('@supabase/supabase-js');
  return {
    ...actual,
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'change-1', status: 'approved' }, error: null }),
      })),
    })),
  };
});

describe('useApprovals', () => {
  it('approve() calls edge fn and updates list', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({ data: [{ id: 'change-1' }] }) }) // fetchList
      .mockResolvedValueOnce({ json: async () => ({ success: true }) }) // approve
      .mockResolvedValueOnce({ json: async () => ({ data: [{ id: 'change-1' }] }) }); // fetchList after approve
    const { approve, fetchList } = useApprovals('manager-1');
    await fetchList();
    const res = await approve('change-1', 'ok');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/approvals',
      expect.objectContaining({ method: 'POST' })
    );
    expect(res.success).toBe(true);
  });
});

describe('RLS', () => {
  it('contractor cannot call /approvals API', async () => {
    // Simulate missing manager_id
    const req = new http.IncomingMessage();
    req.method = 'GET';
    req.query = {}; // no manager_id
    const res = new http.ServerResponse(req);
    const json = jest.fn();
    res.status = jest.fn(() => res);
    res.json = json;
    await apiResolver(req, res, undefined, handler, {});
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });
}); 
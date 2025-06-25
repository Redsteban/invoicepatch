import { render, screen } from '@testing-library/react';
import { SummaryCard } from '../src/components/dashboard/SummaryCard';
import { CheckCircle } from 'lucide-react';
import React from 'react';
import supertest from 'supertest';
import handler from '../pages/api/pay-periods/index';
import { apiResolver } from 'next/dist/server/api-utils/node';
import http from 'http';

jest.mock('@supabase/supabase-js', () => {
  const actual = jest.requireActual('@supabase/supabase-js');
  return {
    ...actual,
    createClient: jest.fn(() => ({
      from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'pp-1' }, error: null }),
      })),
    })),
  };
});

describe('SummaryCard', () => {
  it('renders value', () => {
    render(<SummaryCard icon={<CheckCircle data-testid="icon" />} label="Test" value={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});

describe('/api/pay-periods', () => {
  it('POST calls edge function', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    const req = new http.IncomingMessage();
    req.method = 'POST';
    req.body = { start_date: '2024-07-01', end_date: '2024-07-14', template_id: 'tpl-1', user_id: 'user-1' };
    const res = new http.ServerResponse(req);
    const json = jest.fn();
    res.status = jest.fn(() => res);
    res.json = json;
    await apiResolver(req, res, undefined, handler, {});
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/functions/v1/generateDailyEntries'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
}); 
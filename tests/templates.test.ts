import { renderHook, act } from '@testing-library/react-hooks';
import { useTemplates } from '../src/lib/templates';
import { validateTemplate } from '../src/utils/validation';
import { TemplateSchema } from '../src/utils/validation';
import supertest from 'supertest';
import handler from '../pages/api/templates/index';
import { createMocks } from 'node-mocks-http';

jest.mock('@supabase/supabase-js', () => {
  const actual = jest.requireActual('@supabase/supabase-js');
  return {
    ...actual,
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
      },
      from: jest.fn(() => ({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 'template-1', name: 'Test', rate: 10, hours: 8, unit: 'hour', is_active: true }, error: null }),
      })),
    })),
  };
});

describe('useTemplates', () => {
  it('create inserts payload and returns parsed data', async () => {
    const { result } = renderHook(() => useTemplates());
    await act(async () => {
      const data = await result.current.create({ name: 'Test', rate: 10, hours: 8, unit: 'hour' });
      expect(data).toHaveProperty('id');
      expect(data.name).toBe('Test');
    });
  });
});

describe('validateTemplate', () => {
  it('rejects negative rate', () => {
    const result = validateTemplate({ name: 'Test', rate: -5, hours: 8, unit: 'hour' });
    expect(result.success).toBe(false);
    expect(result.errors?.[0].message).toMatch(/greater than 0/);
  });
});

// Integration test for /api/templates
import http from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';

describe('/api/templates', () => {
  it('POST creates a template', async () => {
    const req = new http.IncomingMessage();
    req.method = 'POST';
    req.body = { name: 'Test', rate: 10, hours: 8, unit: 'hour' };
    const res = new http.ServerResponse(req);
    const json = jest.fn();
    res.status = jest.fn(() => res);
    res.json = json;
    await apiResolver(req, res, undefined, handler, {});
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  it('GET returns templates', async () => {
    const req = new http.IncomingMessage();
    req.method = 'GET';
    req.query = { user_id: 'user-1' };
    const res = new http.ServerResponse(req);
    const json = jest.fn();
    res.status = jest.fn(() => res);
    res.json = json;
    await apiResolver(req, res, undefined, handler, {});
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
}); 
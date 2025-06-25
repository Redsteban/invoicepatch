import request from 'supertest';
import { createCheckoutSession } from '@/lib/stripe';
import { planGuard } from '@/middleware/planGuard';

jest.mock('@/lib/stripe', () => ({
  ...jest.requireActual('@/lib/stripe'),
  createCheckoutSession: jest.fn(),
}));

const mockSession = { user: { id: 'user-1' } };
const mockUserTrial = { plan_type: 'trial', invoices_created: 5 };
const mockUserPaid = { plan_type: 'contractor', invoices_created: 1 };

const mockReq = (overCap = false, api = true) => ({
  nextUrl: { pathname: api ? '/api/daily_entries' : '/dashboard', origin: 'http://localhost:3000' },
  headers: {},
  method: 'POST',
  cookies: {},
  ...overCap && { user: mockUserTrial },
});

describe('Billing API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls Stripe with correct payload', async () => {
    const payload = {
      userId: 'user-1',
      priceId: 'price_123',
      successUrl: 'http://localhost/success',
      cancelUrl: 'http://localhost/cancel',
    };
    (createCheckoutSession as jest.Mock).mockResolvedValue({ id: 'sess_1', url: 'https://stripe.com/checkout' });
    const session = await createCheckoutSession(payload);
    expect(createCheckoutSession).toHaveBeenCalledWith(payload);
    expect(session.url).toContain('stripe.com/checkout');
  });

  it('planGuard blocks trial over-usage for API', async () => {
    const req: any = mockReq(true, true);
    req.nextUrl = { pathname: '/api/daily_entries', origin: 'http://localhost:3000' };
    req.method = 'POST';
    req.user = mockUserTrial;
    const res: any = await planGuard(req);
    expect(res.status).toBe(402);
  });

  it('planGuard blocks trial over-usage for pages', async () => {
    const req: any = mockReq(true, false);
    req.nextUrl = { pathname: '/dashboard', origin: 'http://localhost:3000' };
    req.method = 'POST';
    req.user = mockUserTrial;
    const res: any = await planGuard(req);
    expect(res.headers.get('location')).toContain('/billing?paywall=1');
  });

  it('planGuard allows paid users', async () => {
    const req: any = mockReq(false, true);
    req.nextUrl = { pathname: '/api/daily_entries', origin: 'http://localhost:3000' };
    req.method = 'POST';
    req.user = mockUserPaid;
    const res: any = await planGuard(req);
    expect(res.status).not.toBe(402);
  });
}); 
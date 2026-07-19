import * as apiClient from '@src/api/client';
import { ApiError } from '@src/api/client';
import { resolveDemoDataEnabled } from '@src/config/env';

import { demoTreks } from '../fixtures';
import { filterDemoTreks, getTreks } from '.';
import { normalizeTrekCollection } from './normalizers';
import { buildTrekQueryParams, isNumericTrekQueryValidationError } from './query-compat';
import { getTrekValidationCopy } from './validation-status';

const trek = {
  id: 'trek-1',
  name: 'Test Trail',
  difficulty: 'EASY',
  costInr: 2500,
  location: 'Coorg',
};

describe('normalizeTrekCollection', () => {
  it('normalizes the deployed direct-array envelope', () => {
    const result = normalizeTrekCollection({ success: true, message: 'ok', data: [trek] });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({ id: 'trek-1', name: 'Test Trail', source: 'api' });
    expect(result.meta).toEqual({ page: 1, limit: 20, total: 1, totalPages: 1 });
    expect(result.validation).toEqual({ compatibilityMode: false, source: 'api', state: 'validated' });
  });

  it('preserves the local paginated response metadata', () => {
    const result = normalizeTrekCollection({
      success: true,
      message: 'ok',
      data: { data: [trek], meta: { page: 2, limit: 1, total: 3, totalPages: 3 } },
    });
    expect(result.meta).toEqual({ page: 2, limit: 1, total: 3, totalPages: 3 });
  });

  it('synthesizes pagination when metadata is absent', () => {
    const result = normalizeTrekCollection([trek], { page: 3, limit: 5 });
    expect(result.meta).toEqual({ page: 3, limit: 5, total: 1, totalPages: 1 });
  });

  it('rejects malformed collections and malformed trek records', () => {
    expect(() => normalizeTrekCollection({ data: { unexpected: true } })).toThrow('not an array');
    expect(() => normalizeTrekCollection([{ id: 'missing-name' }])).toThrow('valid id or name');
  });
});

describe('development demo mode', () => {
  it('can only be enabled outside production', () => {
    expect(resolveDemoDataEnabled('development', 'true')).toBe(true);
    expect(resolveDemoDataEnabled('staging', 'TRUE')).toBe(true);
    expect(resolveDemoDataEnabled('production', 'true')).toBe(false);
    expect(resolveDemoDataEnabled('development', 'false')).toBe(false);
  });

  it('applies search, difficulty, region, budget, and popular sorting to fixtures', () => {
    expect(filterDemoTreks({ q: 'Kodagu' }).map((item) => item.id)).toContain('demo-tadiandamol');
    expect(filterDemoTreks({ difficulty: 'EASY' }).every((item) => item.difficulty === 'EASY')).toBe(true);
    expect(filterDemoTreks({ state: 'uttar' }).map((item) => item.id)).toEqual(['demo-valley-flowers']);
    expect(filterDemoTreks({ maxCost: 3000 }).every((item) => item.costInr <= 3000)).toBe(true);
    const popular = filterDemoTreks({ sort: 'popular' });
    expect(popular[0].popularityScore).toBeGreaterThanOrEqual(popular[1].popularityScore ?? 0);
  });

  it('runtime-validates every demo fixture through the trek adapter', () => {
    expect(demoTreks).toHaveLength(6);
    expect(demoTreks.every((item) => item.source === 'demo' && item.id && item.name)).toBe(true);
  });
});

describe('local API numeric-query compatibility', () => {
  it('removes only numeric filters for the compatibility retry', () => {
    expect(buildTrekQueryParams({
      difficulty: 'EASY', limit: 12, maxCost: 5000, page: 2, q: 'forest', sort: 'popular', state: 'Karnataka',
    }, { includeNumeric: false })).toEqual({
      difficulty: 'EASY', q: 'forest', sort: 'popular', state: 'Karnataka',
    });
  });

  it('retries the exact integer validation failure reported by the local API', () => {
    const retryable = new ApiError('Validation failed', 400, {
      details: { limit: 'must be an integer number', page: 'must be an integer number' },
    });
    const unrelated = new ApiError('Validation failed', 400, {
      details: { difficulty: 'must be a valid enum value' },
    });

    expect(isNumericTrekQueryValidationError(retryable)).toBe(true);
    expect(isNumericTrekQueryValidationError(unrelated)).toBe(false);
    expect(isNumericTrekQueryValidationError(new ApiError('Unauthorized', 401))).toBe(false);
  });

  it('returns a validated local page after the backend rejects numeric query strings', async () => {
    const fetchSpy = jest.spyOn(apiClient, 'fetchJson')
      .mockRejectedValueOnce(new ApiError('Validation failed', 400, {
        details: { limit: 'must be an integer number', page: 'must be an integer number' },
      }))
      .mockResolvedValueOnce({
        success: true,
        message: 'ok',
        data: { data: [trek], meta: { page: 1, limit: 20, total: 1, totalPages: 1 } },
      });

    await expect(getTreks({ limit: 12, page: 1 })).resolves.toMatchObject({
      items: [{ id: 'trek-1', source: 'api' }],
      validation: { compatibilityMode: true, source: 'api', state: 'validated' },
    });
    expect(fetchSpy).toHaveBeenNthCalledWith(2, '/treks', expect.objectContaining({
      queryParams: { difficulty: undefined, q: undefined, sort: undefined, state: undefined },
    }));
    fetchSpy.mockRestore();
  });
});

describe('validation status display', () => {
  const liveValidation = { compatibilityMode: false, source: 'api', state: 'validated' } as const;

  it('distinguishes local, preview, and demo validation', () => {
    expect(getTrekValidationCopy('validated', liveValidation, 'development', false).label).toBe('LOCAL · VALIDATED');
    expect(getTrekValidationCopy('validated', liveValidation, 'staging', false).label).toBe('PREVIEW · VALIDATED');
    expect(getTrekValidationCopy('validated', { ...liveValidation, source: 'demo' }, 'staging', true).label).toBe('DEMO · VALIDATED');
  });

  it('reports pending and failed validation states', () => {
    expect(getTrekValidationCopy('pending', undefined, 'development', false).label).toBe('VALIDATING DATA');
    expect(getTrekValidationCopy('error', undefined, 'staging', false).label).toBe('VALIDATION ISSUE');
  });
});

import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import {
  getErrorMessage,
  getHttpStatus,
  isNotFoundError,
  toRejectedPayload,
} from '../api/client';

function axiosError(status: number, statusText = 'Error') {
  return new AxiosError(
    `Request failed with status code ${status}`,
    'ERR_BAD_RESPONSE',
    { headers: new AxiosHeaders() },
    {},
    {
      status,
      statusText,
      data: null,
      headers: {},
      config: { headers: new AxiosHeaders() },
    }
  );
}

describe('getErrorMessage', () => {
  it('includes the HTTP status when the server responded', () => {
    expect(getErrorMessage(axiosError(500, 'Internal Server Error'))).toContain('500');
  });

  it('falls back to "Server error" when statusText is missing', () => {
    expect(getErrorMessage(axiosError(502, ''))).toContain('Server error');
  });

  it('returns a connection message when a request was sent but no response arrived', () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK');
    err.request = {};
    expect(getErrorMessage(err)).toBe(
      'No response from server. Please check your connection and try again.'
    );
  });

  it('returns the Error message when axios has neither a response nor a request', () => {
    const err = new AxiosError('bad config');
    expect(getErrorMessage(err)).toBe('bad config');
  });

  it('returns the Error message for non-axios errors', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('returns a generic message for unknown values', () => {
    expect(getErrorMessage('not-an-error')).toBe('An unexpected error occurred.');
  });
});

describe('getHttpStatus and isNotFoundError', () => {
  it('reads the status from an axios error with a response', () => {
    expect(getHttpStatus(axiosError(404, 'Not Found'))).toBe(404);
    expect(isNotFoundError(axiosError(404, 'Not Found'))).toBe(true);
  });

  it('returns undefined for non-axios errors', () => {
    expect(getHttpStatus(new Error('nope'))).toBeUndefined();
    expect(isNotFoundError(new Error('nope'))).toBe(false);
  });
});

describe('toRejectedPayload', () => {
  it('always includes notFound, defaulting to false', () => {
    expect(toRejectedPayload(new Error('boom'))).toEqual({
      message: 'boom',
      notFound: false,
    });
  });

  it('preserves an explicit notFound flag', () => {
    expect(toRejectedPayload(new Error('boom'), { notFound: true })).toEqual({
      message: 'boom',
      notFound: true,
    });
  });
});

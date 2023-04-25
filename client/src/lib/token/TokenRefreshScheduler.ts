import { postRefreshToken } from '../apis/auth';
import { getMe } from '../apis/me';
// import { extractError } from './error';

const TOKEN_DURATION = 1000 * 30;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class TokenRefreshScheduler {
  timeoutId: ReturnType<typeof setTimeout> | null = null;
  counter = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.increaseCounter();
    }
  }

  increaseCounter() {
    const value = this.getCounter();
    const nextValue = value + 1;
    this.setCounter(nextValue);
    this.counter = nextValue;
  }

  getCounter() {
    const value = localStorage.getItem('tokenScheduler');
    if (value === null) {
      return 0;
    }
    return parseInt(value, 10);
  }

  setCounter(value: number) {
    localStorage.setItem('tokenScheduler', value.toString());
  }

  shouldRefresh() {
    return this.getCounter() === this.counter;
  }

  async refresh() {
    if (this.shouldRefresh()) {
      await postRefreshToken();
    }
    this.schedule();
  }

  schedule(remainingTime: number = TOKEN_DURATION) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    const earlierTime = remainingTime - 3000;

    this.timeoutId = setTimeout(() => {
      this.refresh();
    }, earlierTime);
  }

  async refreshTokenIfExpired() {
    try {
      await getMe();
    } catch (e: any) {
      if (
        e.response.data.statusCode === 401 &&
        (e.response.data.message === 'token expired error' ||
          e.response.data.message === 'not exist access_token')
      ) {
        await this.refresh();
        this.schedule();
      }
    }
  }

  setup() {
    const handler = () => {
      this.increaseCounter();
      this.refreshTokenIfExpired();
    };

    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }
}

export default TokenRefreshScheduler;

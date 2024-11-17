import mixpanel from 'mixpanel-browser';

class MixpanelService {
  token: string;
  userInfo: any;

  /**
   * Create a new MixpanelService instance.
   * @param {string} token - Mixpanel project token.
   * @param {Object} [options={}] - Mixpanel initialization options.
   */
  constructor(token: string, options: any = {}) {
    if (!token) {
      throw new Error('Mixpanel token is required');
    }
    this.token = token;
    this.userInfo = null;

    // Initialize Mixpanel
    mixpanel.init(this.token, options);
  }

  /**
   * Set user information for tracking.
   * @param {Object} userInfo - User information (e.g., { id: '12345', name: 'John Doe', email: 'john@example.com' }).
   */
  setUser(userInfo: any) {
    if (!userInfo || typeof userInfo.id === 'undefined') {
      throw new Error('User information must include an id');
    }
    this.userInfo = userInfo;

    // Register user info as super properties in Mixpanel
    mixpanel.identify(userInfo.id);
    mixpanel.people.set({
      $name: userInfo.name || null,
      $email: userInfo.email || null,
      ...userInfo
    });
  }

  /**
   * Track an event in Mixpanel.
   * @param {string} eventName - Event name.
   * @param {Object} [properties={}] - Event properties.
   */
  trackEvent(eventName: string, properties = {}) {
    if (!eventName) {
      throw new Error('Event name is required');
    }

    const eventProperties = {
      ...properties,
      ...(this.userInfo ? { userId: this.userInfo.id } : {}),
    };

    mixpanel.track(eventName, eventProperties);
  }

  trackPageView(pageName: string) {
    mixpanel.track_pageview({
      page: pageName,
    });
  }

  /**
   * Reset user information and clear Mixpanel identity.
   */
  resetUser() {
    this.userInfo = null;
    mixpanel.reset();
  }
}

export default MixpanelService;

// Example usage:
// const mixpanelService = new MixpanelService('YOUR_MIXPANEL_TOKEN');
// mixpanelService.setUser({ id: '12345', name: 'John Doe', email: 'john@example.com' });
// mixpanelService.trackEvent('Button Clicked', { buttonName: 'Submit' });

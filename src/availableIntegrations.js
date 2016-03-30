import GoogleAnalytics from './integrations/GoogleAnalytics.js';
import GoogleTagManager from './integrations/GoogleTagManager.js';
import Driveback from './integrations/Driveback.js';
import RetailRocket from './integrations/RetailRocket.js';
import FacebookPixel from './integrations/FacebookPixel.js';
import SegmentStream from './integrations/SegmentStream.js';
import SendPulse from './integrations/SendPulse.js';

const integrations = {
  [GoogleAnalytics.getName()]: GoogleAnalytics,
  [GoogleTagManager.getName()]: GoogleTagManager,
  [FacebookPixel.getName()]: FacebookPixel,
  [Driveback.getName()]: Driveback,
  [RetailRocket.getName()]: RetailRocket,
  [SegmentStream.getName()]: SegmentStream,
  [SendPulse.getName()]: SendPulse,
};

export default integrations;

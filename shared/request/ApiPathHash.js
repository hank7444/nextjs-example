const serverUrl = __IS_STATIC_SERVER_HOST__ ? __SERVER_URL__ : null;  //window.location.origin;
const sdkPath = __IS_STATIC_SERVER_HOST__ ? __SDK_PATH__ : `${serverUrl}/styleme-api/en.styleme.js`;

const API_PATH_HASH = {
  server: `${serverUrl}`,
  seaweed: `${serverUrl}/style-me/storages/`,
  serverRendering: `${serverUrl}/style-me/server-rendering`,
  sdk: sdkPath,
  retailer: `${serverUrl}/style-me/messages/retailer`,
};

export default API_PATH_HASH;

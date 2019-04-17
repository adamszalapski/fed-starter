// Add attribute `data-useragent` to `html` tag with value about the client user-agent
// It is required to =useragent($agents)
export default () => {
  const doc = document.documentElement;
  doc.setAttribute('data-useragent', navigator.userAgent);
};

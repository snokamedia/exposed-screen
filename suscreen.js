
window.addEventListener('DOMContentLoaded', function () {

  let actualInnerWidth = Math.round(window.innerWidth / window.devicePixelRatio);
  let actualInnerHeight = Math.round(window.innerHeight / window.devicePixelRatio);
  const globalProps = {
    window_props: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      actualInnerWidth: actualInnerWidth,
      actualInnerHeight: actualInnerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      windowHeightdiff: window.outerHeight - Math.round(window.innerHeight / window.devicePixelRatio),
      windowWidthdiff: window.outerWidth - Math.round(window.innerWidth / window.devicePixelRatio),
    },
    screen_props: {
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      width: window.screen.width,
      height: window.screen.height,
      screenHeightdiff: window.screen.availHeight - window.screen.height,
      screenWidthdiff: window.screen.availWidth - window.screen.width,
      initialLeft: window.screenLeft,
      initialTop: window.screenTop,
      availLeft: window.screen.availLeft,
      compLeft: window.screenLeft - window.screen.availLeft,
      availTop: window.screen.availTop,
      compTop: window.screenTop - window.screen.availTop,
      colorDepth: window.screen.colorDepth
    }
  };

  function display_properties() {
    let slider = document.getElementById("myRange");
    // Update the HTML element styles with the new property values
    document.querySelector('.inner-window').style.height = actualInnerHeight / slider.value + "px";
    document.querySelector('.inner-window').style.width = actualInnerWidth / slider.value + "px";
    document.querySelector('.outer-window').style.height = globalProps.window_props.outerHeight / slider.value + "px";
    document.querySelector('.outer-window').style.width = globalProps.window_props.outerWidth / slider.value + "px";
    document.querySelector('.outer-window').style.marginLeft = globalProps.screen_props.compLeft / slider.value + "px";
    document.querySelector('.outer-window').style.marginTop = globalProps.screen_props.compTop / slider.value + "px";
    document.querySelector('.avail-screen').style.height = globalProps.screen_props.availHeight / slider.value + "px";
    document.querySelector('.avail-screen').style.width = globalProps.screen_props.availWidth / slider.value + "px";
    document.querySelector('.screen').style.height = globalProps.screen_props.height / slider.value + "px";
    document.querySelector('.screen').style.width = globalProps.screen_props.width / slider.value + "px";
    let props_html = '';
    if (globalProps.screen_props.initialLeft >= globalProps.screen_props.width) {
      props_html += '<strong>isExtended: Its probably on the right extended display! The primary display width is probably ' + globalProps.screen_props.availLeft + 'px </strong><br>';
    }
    else if (Math.abs(globalProps.screen_props.initialLeft) >= globalProps.window_props.outerWidth) {
      props_html += '<strong>isExtended: Its probably on the left extended display! </strong><br>';
    }
    else if (Math.sign(globalProps.screen_props.availTop) == -1 && Math.abs(globalProps.screen_props.initialTop) >= globalProps.window_props.outerHeight) {
      props_html += '<strong>isExtended: Its probably on the top extended display! </strong><br>';
    }
    else if (globalProps.screen_props.initialTop >= globalProps.screen_props.height) {
      props_html += '<strong>isExtended: Its probably on the bottom extended display! The primary display height is probably ' + globalProps.screen_props.availTop + 'px </strong><br>';
    }
    ;
    for (var prop in globalProps.window_props) {
      props_html += prop + ': ' + globalProps.window_props[prop] + '<br>';
    }
    for (var prop in globalProps.screen_props) {
      props_html += prop + ': ' + globalProps.screen_props[prop] + '<br>';
    }
    document.getElementById('window-properties').innerHTML = props_html;
  }

  display_properties();

  function init_properties() {

    var output_strings = [];
    if (
      globalProps.window_props.windowWidthdiff <= -150 ||
      globalProps.window_props.windowHeightdiff <= -200 ||
      globalProps.window_props.windowWidthdiff >= 300 ||
      globalProps.window_props.height >= 10000 ||
      globalProps.window_props.availHeight >= 10000
    ) {
      output_strings.push('Probably a VM');
    }
    if (
      globalProps.window_props.outerWidth === 800 &&
      globalProps.window_props.outerHeight === 600 &&
      globalProps.screen_props.availWidth === 800 &&
      globalProps.screen_props.availHeight === 600 &&
      globalProps.screen_props.width === 800 &&
      globalProps.screen_props.height === 600 &&
      globalProps.screen_props.screenHeightdiff === 0 &&
      globalProps.screen_props.screenWidthdiff === 0
    ) {
      output_strings.push('Probably a VM');
    }
    if (
      globalProps.screen_props.screenHeightdiff === -40 ||
      globalProps.screen_props.screenHeightdiff === -81 ||
      globalProps.screen_props.screenHeightdiff === -122 ||
      globalProps.screen_props.screenHeightdiff === -163 ||
      globalProps.screen_props.screenHeightdiff === -204 ||
      globalProps.screen_props.screenHeightdiff === -245 ||
      globalProps.screen_props.screenHeightdiff === -286 ||
      globalProps.screen_props.screenHeightdiff === -327
    ) {
      output_strings.push('OS Prediction: Windows 10');
    }
    if (
      globalProps.screen_props.screenHeightdiff === -32 ||
      globalProps.screen_props.screenHeightdiff === -48 ||
      globalProps.screen_props.screenHeightdiff === -72
    ) {
      output_strings.push('OS Prediction: Windows 11');
    }
    if (globalProps.screen_props.screenHeightdiff === -21) {
      output_strings.push('OS Prediction: macOS 10.4 - 10.9');
      document.querySelector('.avail-screen').style.alignSelf = 'flex-end';
    }
    if (globalProps.screen_props.screenHeightdiff === -22) {
      output_strings.push('OS Prediction: macOS 10.10 - 10.15');
      document.querySelector('.avail-screen').style.alignSelf = 'flex-end';
    }
    if (globalProps.screen_props.screenHeightdiff === -24) {
      output_strings.push('OS Prediction: macOS 11 -');
      document.querySelector('.avail-screen').style.alignSelf = 'flex-end';
    }

    var props_html = '';
    if (output_strings.length > 0) {
      props_html += '<strong>' + output_strings.join('<br>') + '</strong><br>';
    }
    document.getElementById('os-properties').innerHTML = props_html;
  }

  init_properties();

  function updateProperties() {
    actualInnerWidth = Math.round(window.innerWidth / window.devicePixelRatio);
    actualInnerHeight = Math.round(window.innerHeight / window.devicePixelRatio);
    globalProps.window_props = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      actualInnerWidth: actualInnerWidth,
      actualInnerHeight: actualInnerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      windowHeightdiff: window.outerHeight - Math.round(window.innerHeight / window.devicePixelRatio),
      windowWidthdiff: window.outerWidth - Math.round(window.innerWidth / window.devicePixelRatio)
    };

    globalProps.screen_props = {
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      width: window.screen.width,
      height: window.screen.height,
      screenHeightdiff: window.screen.availHeight - window.screen.height,
      screenWidthdiff: window.screen.availWidth - window.screen.width,
      initialLeft: window.screenLeft,
      initialTop: window.screenTop,
      availLeft: window.screen.availLeft,
      compLeft: window.screenLeft - window.screen.availLeft,
      availTop: window.screen.availTop,
      compTop: window.screenTop - window.screen.availTop,
      colorDepth: window.screen.colorDepth
    };

    display_properties();
  }
  // Update the current slider value (each time you drag the slider handle)
  var slider = document.getElementById("myRange");
  slider.oninput = function () {
    display_properties();
  }

  let isResized = false;
  let interval = 1000; // default interval value

  window.addEventListener('resize', () => {
    updateProperties();
    isResized = true;
    setTimeout(() => {
      isResized = false;
    }, interval);
  });

  setInterval(() => {
    if (!isResized) {
      updateProperties();
    }
  }, interval);


  var html = '';
  var gpu = "Not Available";
  if (window.WebGLRenderingContext) {
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl.getParameter(gl.VERSION)) {
      gpu = gl.getParameter(gl.RENDERER) + " - " + gl.getParameter(gl.VERSION);
    }
  }
  html += '<p>GPU: ';
  html += gpu;
  html += '</p>';
  document.getElementById('gpu-data').innerHTML = html;
  let uap = new UAParser();
  let result = uap.getResult();
  var html = '';
  html += 'User-Agent: ' + result['ua'] + '<br>';
  html += 'Browser: ' + result['browser']['name'] + ' ' + result['browser']['version'] + '<br>';
  html += 'Engine: ' + result['engine']['name'] + ' ' + result['engine']['version'] + '<br>';
  html += 'OS: ' + result['os']['name'] + ' ' + result['os']['version'] + '<br>';
  html += 'Device: ' + result['device']['model'] + ' ' + result['device']['type'] + ' ' + result['device']['vendor'] + '<br>';
  html += 'CPU Architecture: ' + result['cpu']['architecture'] + '<br>';
  document.getElementById('user-agent-data').innerHTML = html;

  function displayBrowserFeatures() {
    const features = [
      { name: 'Cookies Enabled', value: navigator.cookieEnabled },
      { name: 'Browser Language', value: navigator.language },
      { name: 'Platform', value: navigator.platform },
      { name: 'Do Not Track', value: navigator.doNotTrack },
      { name: 'Online Status', value: navigator.onLine },
      { name: 'WebGL Support', value: !!window.WebGLRenderingContext },
      { name: 'WebSockets Support', value: 'WebSocket' in window },
      { name: 'Geolocation Support', value: 'geolocation' in navigator },
      { name: 'Local Storage Support', value: typeof (Storage) !== 'undefined' },
      { name: 'IndexedDB Support', value: 'indexedDB' in window },
      { name: 'Service Worker Support', value: 'serviceWorker' in navigator },
      { name: 'Web Workers Support', value: 'Worker' in window },
      { name: 'Web Share API Support', value: 'share' in navigator },
      { name: 'Battery Status API Support', value: 'getBattery' in navigator },
      { name: 'Media Devices API Support', value: 'mediaDevices' in navigator },
      { name: 'Gamepad API Support', value: !!navigator.getGamepads },
      { name: 'Web Bluetooth API Support', value: 'bluetooth' in navigator },
      { name: 'File System API Support', value: 'requestFileSystem' in window },
      { name: 'Speech Recognition API Support', value: 'SpeechRecognition' in window },
      { name: 'Web MIDI API Support', value: 'requestMIDIAccess' in navigator },
      { name: 'Web USB API Support', value: 'usb' in navigator },
      { name: 'WebXR Support', value: 'xr' in navigator },
      { name: 'WebRTC Support', value: 'RTCPeerConnection' in window },
      { name: 'WebAssembly Support', value: 'WebAssembly' in window },
      { name: 'FileSystem Access API Support', value: 'showDirectoryPicker' in window },
      { name: 'Notifications API Support', value: 'Notification' in window },
      { name: 'Push API Support', value: 'PushManager' in window },
      { name: 'Payment Request API Support', value: 'PaymentRequest' in window },
      { name: 'Credential Management API Support', value: 'credentials' in navigator },
      { name: 'Presentation API Support', value: 'presentation' in navigator },
      { name: 'Idle Detection API Support', value: 'IdleDetector' in window },
      // { name: 'Bluetooth Device Presence API Support', value: 'onadvertisementreceived' in navigator.bluetooth },
      { name: 'Orientation Sensor API Support', value: 'AbsoluteOrientationSensor' in window },
      { name: 'Device Orientation API Support', value: 'DeviceOrientationEvent' in window },
      { name: 'Ambient Light Sensor API Support', value: 'AmbientLightSensor' in window },
      { name: 'Proximity Sensor API Support', value: 'ProximitySensor' in window },
      { name: 'Web Speech API Support', value: 'webkitSpeechRecognition' in window },
      { name: 'Audio/Video Codecs Support', value: typeof (MediaRecorder) !== 'undefined' && typeof (MediaSource) !== 'undefined' }
    ];

    let featurehtml = '<ul>';
    for (let i = 0; i < features.length; i++) {
      featurehtml += `<li>${features[i].name}: ${features[i].value}</li>`;
    }
    featurehtml += '</ul>';

    // Display the list in the HTML element with the ID 'user-feature-data'
    document.getElementById('user-feature-data').innerHTML = featurehtml;
  }

  displayBrowserFeatures();


});
window.addEventListener('DOMContentLoaded', function () {

  let actualInnerWidth = Math.round(window.innerWidth / window.devicePixelRatio);
  let actualInnerHeight = Math.round(window.innerHeight / window.devicePixelRatio);
  const globalProps = {
    window_props: {
      menubar: window.menubar.visible,
      toolbar: window.toolbar.visible,
      statusbar: window.statusbar.visible,
      scrollbars: window.scrollbars.visible,
      personalbar: window.personalbar.visible,
      locationbar: window.locationbar.visible,
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
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      orientation: screen.orientation ? screen.orientation.type : 'Not Available'
    },
    navigator_props: {
      hardwareConcurrency: navigator.hardwareConcurrency || 'Not Available',
      deviceMemory: navigator.deviceMemory || 'Not Available',
      maxTouchPoints: navigator.maxTouchPoints || 0,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'Not Available',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      onLine: navigator.onLine,
      appCodeName: navigator.appCodeName,
      productSub: navigator.productSub,
      vendorSub: navigator.vendorSub,
      clipboardRead: 'Not Available',
      timezoneOffset: new Date().getTimezoneOffset(),
      prefersDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      scrollbarWidth: getScrollbarWidth(),
      historyLength: history.length,
      geolocation: 'Not Available',
      battery: 'Not Available',
      fonts: ['Arial', 'Times New Roman', 'Courier New'].filter(font => detectFont(font)),
      cssGridSupport: CSS.supports('display', 'grid'),
      supportedCodecs: {
        vp9: MediaRecorder.isTypeSupported('video/webm; codecs=vp9'),
        h264: MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),
        opus: MediaRecorder.isTypeSupported('audio/webm; codecs=opus')
      },
      possibleVM: false,
      adBlocker: false,
      isPageVisible: !document.hidden,
      storageEstimate: 'Not Available',
      isPrivateBrowsing: 'Not Available',
      motionSensors: {
        accelerometer: 'Accelerometer' in window,
        gyroscope: 'Gyroscope' in window
      },
      extensions: [],
      gamepads: 'Not Available',
      ambientLight: 'Not Available',
      fontSmoothing: 'Not Available'
    },
    webglProps: {
      vendor: 'Not Available',
      renderer: 'Not Available',
      shadingLanguageVersion: 'Not Available',
      extensions: []
    },
    canvasFingerprint: '',
    audioFingerprint: '',
    errorFingerprint: '',
  };

  // Helper functions
  function getScrollbarWidth() {
    let outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);
    let widthNoScroll = outer.offsetWidth;
    let inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    let widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }

  function getCanvasFingerprint() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Hello, world!', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Hello, world!', 4, 17);
    let dataUrl = canvas.toDataURL();
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = ((hash << 5) - hash) + dataUrl.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }
  globalProps.canvasFingerprint = getCanvasFingerprint();

  function getAudioFingerprint() {
    let audioCtx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
    let compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    oscillator.connect(compressor);
    compressor.connect(audioCtx.destination);
    oscillator.start(0);
    audioCtx.startRendering();
    return new Promise(resolve => {
      audioCtx.oncomplete = function(event) {
        let fingerprint = event.renderedBuffer.getChannelData(0)
          .slice(4500, 5000)
          .reduce((acc, val) => acc + Math.abs(val), 0)
          .toString();
        resolve(fingerprint);
      };
    });
  }
  getAudioFingerprint().then(fingerprint => {
    globalProps.audioFingerprint = fingerprint;
    // Continue with your code
  });

  function detectFont(font) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = '72px monospace';
    let baselineSize = context.measureText('A').width;
    context.font = `72px '${font}', monospace`;
    let newSize = context.measureText('A').width;
    return newSize !== baselineSize;
  }

  function getErrorFingerprint() {
    try {
      null[0]();
    } catch (e) {
      globalProps.errorFingerprint = e.message;
    }
  }
  getErrorFingerprint();

  if ('AmbientLightSensor' in window) {
    try {
      let sensor = new AmbientLightSensor();
      sensor.addEventListener('reading', () => {
        globalProps.navigator_props.ambientLight = sensor.illuminance;
      });
      sensor.start();
    } catch (err) {
      console.error('Ambient Light Sensor error:', err);
    }
  }

  function detectAdBlocker() {
    let ad = document.createElement('div');
    ad.innerHTML = '&nbsp;';
    ad.className = 'adsbox';
    ad.style.position = 'absolute';
    ad.style.left = '-9999px';
    document.body.appendChild(ad);
    window.setTimeout(() => {
      if (ad.offsetHeight === 0) {
        globalProps.navigator_props.adBlocker = true;
      }
      ad.remove();
    }, 100);
  }
  detectAdBlocker();

  document.addEventListener('visibilitychange', () => {
    globalProps.navigator_props.isPageVisible = !document.hidden;
  });

  if (navigator.storage && navigator.storage.estimate) {
    navigator.storage.estimate().then(estimate => {
      globalProps.navigator_props.storageEstimate = estimate;
    });
  }

  function detectPrivateMode(callback) {
    var db;
    try {
      db = indexedDB.open('test');
      db.onerror = function() { callback(true); };
      db.onsuccess = function() { callback(false); };
    } catch(e) {
      callback(true);
    }
  }
  detectPrivateMode(isPrivate => {
    globalProps.navigator_props.isPrivateBrowsing = isPrivate;
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      globalProps.navigator_props.geolocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    });
  }

  function getWebGLVendorAndRenderer() {
    let gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return {};
    let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return { vendor, renderer };
  }
  let webglInfo = getWebGLVendorAndRenderer();
  globalProps.webglProps.vendor = webglInfo.vendor;
  globalProps.webglProps.renderer = webglInfo.renderer;

  function detectExtensions() {
    let knownExtensions = [
      { name: 'uBlock Origin', test: () => !!window.uBlock },
      { name: 'LastPass', test: () => !!window.lpTag },
    ];
    globalProps.navigator_props.extensions = knownExtensions.filter(ext => ext.test()).map(ext => ext.name);
  }
  detectExtensions();

  window.addEventListener('gamepadconnected', event => {
    globalProps.navigator_props.gamepads = navigator.getGamepads().length;
  });

  function detectFontSmoothing() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = '72px Arial';
    ctx.fillText('O', 0, 72);
    let data = ctx.getImageData(35, 35, 1, 1).data;
    globalProps.navigator_props.fontSmoothing = data[3] > 0; // Check alpha channel
  }
  detectFontSmoothing();

  function isLikelyVM() {
    const vmIndicators = [
      /VirtualBox/i,
      /VMware/i,
      /Parallels/i,
    ];
    let isVM = vmIndicators.some(indicator => indicator.test(globalProps.webglProps.renderer));
    if (isVM) {
      globalProps.navigator_props.possibleVM = true;
    }
  }
  isLikelyVM();

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
    let sus_html = '';
    if (globalProps.screen_props.availTop == 0 && globalProps.screen_props.availLeft == 0) {
      sus_html += '<strong>isPrimary: This is the primary display';
    }
    else if (globalProps.screen_props.initialLeft >= globalProps.screen_props.width) {
      sus_html += '<strong>isExtended: Its probably on the right extended display! The primary display width is probably ' + globalProps.screen_props.availLeft + 'px </strong><br>';
    }
    else if (Math.abs(globalProps.screen_props.initialLeft) >= globalProps.window_props.actualInnerWidth) {
      sus_html += '<strong>isExtended: Its probably on the left extended display! </strong><br>';
    }
    else if (Math.sign(globalProps.screen_props.availTop) == -1 && Math.abs(globalProps.screen_props.initialTop) >= globalProps.window_props.outerHeight) {
      sus_html += '<strong>isExtended: Its probably on the top extended display! </strong><br>';
    }
    else if (globalProps.screen_props.initialTop >= globalProps.screen_props.height) {
      sus_html += '<strong>isExtended: Its probably on the bottom extended display! The primary display height is probably ' + globalProps.screen_props.availTop + 'px </strong><br>';
    };

    let zoomLevel = Math.round(window.devicePixelRatio * 100);
    let zoomLevelText = `Zoom Level: ${zoomLevel}%`;
  
    // Rest of your code to update HTML elements
    let props_html = '<ul>';
    props_html += `<li>${zoomLevelText}</li>`; // Display zoom level at the top
  
    for (var prop in globalProps.window_props) {
      props_html += '<li>' + prop + ': ' + globalProps.window_props[prop] + '</li>';
    }
    for (var prop in globalProps.screen_props) {
      props_html += '<li>' + prop + ': ' + globalProps.screen_props[prop] + '</li>';
    }
    props_html += '</ul>';
    document.getElementById('window-properties').innerHTML = props_html;
    document.getElementById('window-sus').innerHTML = sus_html;

  }

  display_properties();

  function init_properties() {

    var output_strings = [];
    if (
      globalProps.window_props.outerWidth === 0 &&
      globalProps.window_props.outerHeight === 0
    ) {
      output_strings.push('Probably a VM');
    }
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
      output_strings.push('OS Prediction (without user-agent): Windows 10');
    }
    if (
      globalProps.screen_props.screenHeightdiff === -32 ||
      globalProps.screen_props.screenHeightdiff === -48 ||
      globalProps.screen_props.screenHeightdiff === -72
    ) {
      output_strings.push('OS Prediction (without user-agent): Windows 11');
    }
    if (globalProps.screen_props.screenHeightdiff === -21) {
      output_strings.push('OS Prediction (without user-agent): macOS 10.4 - 10.9');
      document.querySelector('.avail-screen').style.alignSelf = 'flex-end';
    }
    if (globalProps.screen_props.screenHeightdiff === -22) {
      output_strings.push('OS Prediction (without user-agent): macOS 10.10 - 10.15');
      document.querySelector('.avail-screen').style.alignSelf = 'flex-end';
    }
    if (globalProps.screen_props.screenHeightdiff === -24) {
      output_strings.push('OS Prediction (without user-agent): macOS 11 -');
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
      menubar: window.menubar.visible,
      toolbar: window.toolbar.visible,
      statusbar: window.statusbar.visible,
      scrollbars: window.scrollbars.visible,
      personalbar: window.personalbar.visible,
      locationbar: window.locationbar.visible,
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

  // Get a reference to the table cells
  const screenXValue = document.getElementById('screenX');
  const screenYValue = document.getElementById('screenY');
  const clientXValue = document.getElementById('clientX');
  const clientYValue = document.getElementById('clientY');
  // Update the table with the current values of the MouseEvent properties
  function updateTable(event) {
    if (event.clientX && event.clientX !== null) {
      clientXValue.innerHTML = event.clientX;
    }
    if (event.clientY !== null) {
      clientYValue.innerHTML = event.clientY;
    }
    if (event.screenX !== null) {
      screenXValue.innerHTML = event.screenX;
    }
    if (event.screenY !== null) {
      screenYValue.innerHTML = event.screenY;
    }
    document.querySelector('.mouse').style.marginTop = event.clientY / slider.value + "px";
    document.querySelector('.mouse').style.marginLeft = event.clientX / slider.value + "px";
  }

  // Add an event listener to the document to listen for mousemove events
  document.addEventListener('mousemove', updateTable);
});

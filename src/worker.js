let data = '{}';

self.onconnect = (e) => {
  const [port] = e.ports;
  port.onmessage = (event) => {
    const d = JSON.parse(event.data);
    console.info('worker: ', e.ports, d, data);
    if (d.type === 'sync') {
      port.postMessage(data);
    } else if (d.type === 'clear') {
      data = '{}'
    } else {
      data = event.data;
    }
  };
}

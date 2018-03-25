import TGWorker from './generator.worker';

export default class TGProxy {
  constructor(params) {
    this.worker = new TGWorker();

    Object.assign(this, params);

    this.worker.postMessage({
      type: 'init',
      payload: params,
    })
  }

  update(params) {
    this.worker.postMessage({
      type: 'update',
      payload: params,
    })
  }

  onMapUpdate(cb) {
    this.worker.onmessage = ({ data }) => cb(data);
  }
}
